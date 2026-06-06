import { NextRequest, NextResponse } from "next/server"
import type { ReportFormat } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { generateProse } from "@/lib/ai"
import { buildAttachmentContentDisposition } from "@/lib/http/content-disposition"
import { getExportFormatAvailability } from "@/lib/lca/export-formats"
import {
  buildReportHtml,
  getProseSectionsForFormat,
  getReportDownloadPrefix,
} from "@/lib/lca/report-templates"
import {
  persistVerifiedReport,
  resolveDocumentRegistry,
} from "@/lib/lca/save-verified-report"

function parseJsonField<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      productId,
      format,
      locale = "da",
      options = {},
      newVersion = false,
    } = await req.json()

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { _count: { select: { scenarios: true } } },
    })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const formatKey = (format ?? "ISO_14044_FULL") as keyof ReturnType<
      typeof getExportFormatAvailability
    >
    const allowed = getExportFormatAvailability(
      product.ambitionLevel,
      product._count.scenarios
    )
    if (!allowed[formatKey]) {
      return NextResponse.json(
        {
          error: "Report format not available for this product",
          detail:
            formatKey === "EPD_ISO_14025"
              ? "EPD requires ambition level EPD verified"
              : "Comparative assertion requires at least 2 scenarios",
        },
        { status: 403 }
      )
    }

    const { _count: _scenarioCount, ...productFields } = product
    const parsedProduct = {
      ...productFields,
      goalScope: parseJsonField(product.goalScope),
      lci: parseJsonField(product.lci),
      lcia: parseJsonField(product.lcia),
      interpretation: parseJsonField(product.interpretation),
    }

    const proseMap: Record<string, string> = {}
    for (const section of getProseSectionsForFormat(formatKey)) {
      proseMap[section] = await generateProse({
        section,
        productData: parsedProduct,
        locale: locale as "da" | "en",
      })
    }

    const date = new Date().toLocaleDateString(locale === "da" ? "da-DK" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const formatEnum = (format ?? "ISO_14044_FULL") as ReportFormat
    const registry = await resolveDocumentRegistry(productId, Boolean(newVersion))

    const html = buildReportHtml(formatKey, {
      product: parsedProduct,
      prose: proseMap,
      locale: locale as "da" | "en",
      date,
      reportId: registry.documentId,
      reportFormat: formatKey,
      options,
    })

    await persistVerifiedReport({
      productId,
      productName: product.name,
      complianceScore: product.complianceScore,
      locale,
      format: formatEnum,
      htmlContent: html,
      generatedProse: JSON.stringify(proseMap),
      documentId: registry.documentId,
      existingReportId: registry.existingReportId,
      version: registry.version,
    })

    const prefix = getReportDownloadPrefix(formatKey)
    const downloadName = `${prefix}-${product.name}-${locale.toUpperCase()}.html`

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": buildAttachmentContentDisposition(downloadName),
        "X-LCA-Document-Id": registry.documentId,
        "X-LCA-Document-New-Version": registry.isNewVersion ? "1" : "0",
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    const detail = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        detail: process.env.NODE_ENV === "development" ? detail : undefined,
      },
      { status: 500 }
    )
  }
}
