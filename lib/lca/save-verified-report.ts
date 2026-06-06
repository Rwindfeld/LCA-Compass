import type { ReportFormat } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { generateDocumentId } from "@/lib/lca/document-id"

export async function createUniqueDocumentId(productId: string): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const documentId = generateDocumentId(productId)
    const existing = await prisma.report.findUnique({
      where: { documentId },
      select: { id: true },
    })
    if (!existing) return documentId
  }
  throw new Error("Could not allocate unique document ID")
}

/** Latest issued report for a product (current stamp ID). */
export async function getCurrentProductReport(productId: string) {
  return prisma.report.findFirst({
    where: { productId },
    orderBy: { version: "desc" },
    select: {
      id: true,
      documentId: true,
      version: true,
      locale: true,
      format: true,
    },
  })
}

/**
 * Reuse the product's current stamp ID unless `newVersion` is true.
 * New documentation on the same product gets a fresh ID and version number.
 */
export async function resolveDocumentRegistry(
  productId: string,
  newVersion = false
): Promise<{
  documentId: string
  existingReportId: string | null
  version: number
  isNewVersion: boolean
}> {
  const current = await getCurrentProductReport(productId)

  if (!newVersion && current?.documentId) {
    return {
      documentId: current.documentId,
      existingReportId: current.id,
      version: current.version,
      isNewVersion: false,
    }
  }

  const documentId = await createUniqueDocumentId(productId)
  const lastVersion = current?.version ?? 0

  return {
    documentId,
    existingReportId: null,
    version: lastVersion + 1,
    isNewVersion: true,
  }
}

type PersistVerifiedReportInput = {
  productId: string
  productName: string
  complianceScore: number
  locale: string
  format: ReportFormat
  htmlContent: string
  generatedProse?: string
  documentId: string
  existingReportId: string | null
  version: number
}

/** Update the current report in place, or create a new versioned report. */
export async function persistVerifiedReport(input: PersistVerifiedReportInput) {
  const data = {
    documentId: input.documentId,
    productName: input.productName,
    complianceScore: input.complianceScore,
    locale: input.locale,
    format: input.format,
    htmlContent: input.htmlContent,
    generatedProse: input.generatedProse,
  }

  if (input.existingReportId) {
    return prisma.report.update({
      where: { id: input.existingReportId },
      data,
    })
  }

  return prisma.report.create({
    data: {
      ...data,
      productId: input.productId,
      version: input.version,
    },
  })
}

/** @deprecated Use persistVerifiedReport */
export async function saveVerifiedReport(
  input: PersistVerifiedReportInput & { documentId: string }
) {
  return persistVerifiedReport(input)
}
