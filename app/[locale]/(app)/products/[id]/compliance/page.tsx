import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ComplianceClient } from "./ComplianceClient"

export default async function CompliancePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) notFound()
    const p = {
      ...product,
      goalScope: product.goalScope ? JSON.parse(product.goalScope) : null,
      lci: product.lci ? JSON.parse(product.lci) : null,
      lcia: product.lcia ? JSON.parse(product.lcia) : null,
      interpretation: product.interpretation ? JSON.parse(product.interpretation) : null,
    }
    return <ComplianceClient product={p} />
  } catch { notFound() }
}
