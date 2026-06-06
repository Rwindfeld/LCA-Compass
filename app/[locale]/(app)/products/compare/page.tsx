import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { parseProduct } from "@/lib/products/parse-product"
import { CompareClient } from "./CompareClient"

async function getProducts() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "demo@lca-compass.dk" },
      include: { products: { orderBy: { updatedAt: "desc" } } },
    })
    return (user?.products ?? []).map(parseProduct)
  } catch {
    return []
  }
}

export default async function CompareProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>
}) {
  const products = await getProducts()
  const { a, b } = await searchParams

  const serialized = products.map((p) => ({
    ...p,
    createdAt:
      p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    updatedAt:
      p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
  }))

  return (
    <Suspense fallback={null}>
      <CompareClient products={serialized} initialA={a} initialB={b} />
    </Suspense>
  )
}
