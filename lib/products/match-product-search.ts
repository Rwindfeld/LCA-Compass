export type ProductSearchFields = {
  name: string
  description?: string | null
  productType?: string
  status?: string
}

/** Match products against a query (name, description, type, status + optional extra terms e.g. translations). */
export function matchProductSearch(
  product: ProductSearchFields,
  query: string,
  extraTerms: string[] = []
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    product.name,
    product.description ?? "",
    product.productType ?? "",
    product.status ?? "",
    ...extraTerms,
  ]
    .join(" ")
    .toLowerCase()

  const terms = q.split(/\s+/).filter(Boolean)
  return terms.every((term) => haystack.includes(term))
}
