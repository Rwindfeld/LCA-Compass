import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isValidDocumentIdFormat, normalizeDocumentId } from "@/lib/lca/document-id"

const FORMAT_LABELS: Record<string, { da: string; en: string }> = {
  ISO_14044_FULL: { da: "ISO 14044 fuld rapport", en: "ISO 14044 full report" },
  EPD_ISO_14025: { da: "EPD (ISO 14025)", en: "EPD (ISO 14025)" },
  CARBON_FOOTPRINT_14067: { da: "Carbon footprint (ISO 14067)", en: "Carbon footprint (ISO 14067)" },
  COMPARATIVE_ASSERTION: { da: "Komparativ påstand", en: "Comparative assertion" },
  CSRD_ANNEX: { da: "CSRD bilag", en: "CSRD annex" },
}

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("id") ?? ""
    const documentId = normalizeDocumentId(raw)

    if (!documentId || !isValidDocumentIdFormat(documentId)) {
      return NextResponse.json({ error: "invalid_id" }, { status: 400 })
    }

    const report = await prisma.report.findUnique({
      where: { documentId },
      select: {
        documentId: true,
        productName: true,
        complianceScore: true,
        locale: true,
        format: true,
        createdAt: true,
        htmlContent: true,
      },
    })

    if (!report || !report.htmlContent) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }

    const locale = report.locale === "en" ? "en" : "da"
    const formatLabel = FORMAT_LABELS[report.format]?.[locale] ?? report.format

    return NextResponse.json({
      verified: true,
      issuer: "LCA Compass",
      issuerUrl: "https://lca-compass.dk",
      documentId: report.documentId,
      productName: report.productName,
      complianceScore: report.complianceScore,
      locale: report.locale,
      format: report.format,
      formatLabel,
      issuedAt: report.createdAt.toISOString(),
      html: report.htmlContent,
    })
  } catch (error) {
    console.error("Document verify error:", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
