import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { calcComplianceScore } from "@/lib/lca/compliance-check"
import { ProductsClient } from "./ProductsClient"

async function getProducts() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "demo@lca-compass.dk" },
      include: { products: { orderBy: { updatedAt: "desc" } } },
    })
    const products = user?.products ?? []

    // Recalculate compliance score for each product and batch-update stale ones
    const updates: Promise<unknown>[] = []
    const synced = products.map((p) => {
      const parsed = {
        ...p,
        goalScope: p.goalScope ? JSON.parse(p.goalScope) : null,
        lci: p.lci ? JSON.parse(p.lci) : null,
        lcia: p.lcia ? JSON.parse(p.lcia) : null,
        interpretation: p.interpretation ? JSON.parse(p.interpretation) : null,
      }
      const live = calcComplianceScore(parsed)
      if (live !== p.complianceScore) {
        const status =
          live >= 90 ? "EPD_READY" :
          live >= 40 ? "IN_PROGRESS" : "DRAFT"
        updates.push(
          prisma.product.update({
            where: { id: p.id },
            data: {
              complianceScore: live,
              ...(p.status !== "PUBLISHED" ? { status } : {}),
            },
          })
        )
        return { ...p, complianceScore: live, ...(p.status !== "PUBLISHED" ? { status } : {}) }
      }
      return p
    })

    if (updates.length > 0) await Promise.all(updates)
    return synced
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <Suspense fallback={null}>
      <ProductsClient products={products} />
    </Suspense>
  )
}
