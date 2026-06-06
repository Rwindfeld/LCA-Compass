import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { normalizeDocumentId } from "@/lib/lca/document-id"
import { DocumentVerifyViewer } from "@/components/landing/DocumentVerifyViewer"

const FORMAT_LABELS: Record<string, { da: string; en: string }> = {
  ISO_14044_FULL: { da: "ISO 14044 fuld rapport", en: "ISO 14044 full report" },
  EPD_ISO_14025: { da: "EPD (ISO 14025)", en: "EPD (ISO 14025)" },
  CARBON_FOOTPRINT_14067: { da: "Carbon footprint (ISO 14067)", en: "Carbon footprint (ISO 14067)" },
  COMPARATIVE_ASSERTION: { da: "Komparativ påstand", en: "Comparative assertion" },
  CSRD_ANNEX: { da: "CSRD bilag", en: "CSRD annex" },
}

export default async function VerifyDocumentPage({
  params,
}: {
  params: Promise<{ locale: string; documentId: string }>
}) {
  const { locale, documentId: rawId } = await params
  const documentId = normalizeDocumentId(rawId)

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

  if (!report?.htmlContent) notFound()

  const reportLocale = report.locale === "en" ? "en" : "da"
  const formatLabel = FORMAT_LABELS[report.format]?.[reportLocale] ?? report.format

  return (
    <DocumentVerifyViewer
      backHref={`/${locale}#verify`}
      document={{
        documentId: report.documentId,
        productName: report.productName,
        complianceScore: report.complianceScore,
        locale: report.locale,
        formatLabel,
        issuedAt: report.createdAt.toISOString(),
        html: report.htmlContent,
      }}
    />
  )
}
