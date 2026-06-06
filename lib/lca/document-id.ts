/** Public verification ID format: ABCD-1XYZ (product prefix + time suffix). */
export function generateDocumentId(productId: string): string {
  const prefix = productId.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "LCA"
  const suffix = Date.now().toString(36).slice(-4).toUpperCase()
  return `${prefix}-${suffix}`
}

export function normalizeDocumentId(raw: string): string {
  return raw.trim().replace(/^#/, "").replace(/\s+/g, "").toUpperCase()
}

export const DOCUMENT_ID_PATTERN = /^[A-Z0-9]{2,8}-[A-Z0-9]{4}$/

export function isValidDocumentIdFormat(id: string): boolean {
  return DOCUMENT_ID_PATTERN.test(normalizeDocumentId(id))
}
