import { prisma } from "@/lib/prisma"
import { calcComplianceScore } from "@/lib/lca/compliance-check"
import { notFound, redirect } from "next/navigation"
import { WizardClient } from "./WizardClient"

export default async function WizardStepPage({
  params,
}: {
  params: Promise<{ id: string; step: string; locale: string }>
}) {
  const { id, step } = await params
  const stepNum = parseInt(step, 10)

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 10) {
    redirect(`/products/${id}/wizard/1`)
  }

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

    const liveScore = calcComplianceScore(parsedProduct)
    if (liveScore !== product.complianceScore) {
      parsedProduct.complianceScore = liveScore
      await prisma.product.update({
        where: { id },
        data: { complianceScore: liveScore },
      })
    }

    return <WizardClient product={parsedProduct} step={stepNum} />
  } catch {
    notFound()
  }
}
