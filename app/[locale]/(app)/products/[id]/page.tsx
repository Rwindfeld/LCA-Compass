import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./ProductDetailClient"
import { calcComplianceScore } from "@/lib/lca/compliance-check"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = await params

  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) notFound()

    const parsedProduct = {
      ...product,
      goalScope: product.goalScope ? JSON.parse(product.goalScope) : null,
      lci: product.lci ? JSON.parse(product.lci) : null,
      lcia: product.lcia ? JSON.parse(product.lcia) : null,
      interpretation: product.interpretation ? JSON.parse(product.interpretation) : null,
    }

    // Sync compliance score to DB if it's stale
    const liveScore = calcComplianceScore(parsedProduct)
    if (liveScore !== product.complianceScore) {
      // Derive status from score automatically
      const derivedStatus =
        liveScore >= 90 ? "EPD_READY" :
        liveScore >= 40 ? "IN_PROGRESS" :
        "DRAFT"

      await prisma.product.update({
        where: { id },
        data: {
          complianceScore: liveScore,
          // Only auto-upgrade status, never downgrade a manually set PUBLISHED
          ...(product.status !== "PUBLISHED" ? { status: derivedStatus } : {}),
        },
      })

      parsedProduct.complianceScore = liveScore
      if (product.status !== "PUBLISHED") parsedProduct.status = derivedStatus
    }

    return <ProductDetailClient product={parsedProduct} />
  } catch {
    notFound()
  }
}
