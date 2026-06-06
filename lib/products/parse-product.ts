import type { Product } from "@/generated/prisma/client"

export type ParsedProduct = Omit<
  Product,
  "goalScope" | "lci" | "lcia" | "interpretation" | "criticalReview" | "createdAt" | "updatedAt"
> & {
  goalScope: Record<string, unknown> | null
  lci: Record<string, unknown> | null
  lcia: Record<string, unknown> | null
  interpretation: Record<string, unknown> | null
  criticalReview: Record<string, unknown> | null
  createdAt: Date | string
  updatedAt: Date | string
}

export function parseProduct(product: Product): ParsedProduct {
  return {
    ...product,
    goalScope: product.goalScope ? JSON.parse(product.goalScope) : null,
    lci: product.lci ? JSON.parse(product.lci) : null,
    lcia: product.lcia ? JSON.parse(product.lcia) : null,
    interpretation: product.interpretation ? JSON.parse(product.interpretation) : null,
    criticalReview: product.criticalReview ? JSON.parse(product.criticalReview) : null,
  }
}
