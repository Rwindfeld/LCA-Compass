import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ExportClient } from "./ExportClient"

export default async function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { scenarios: true } } },
    })
    if (!product) notFound()
    const { _count, ...rest } = product
    const p = {
      ...rest,
      goalScope: product.goalScope ? JSON.parse(product.goalScope) : null,
      lci: product.lci ? JSON.parse(product.lci) : null,
      lcia: product.lcia ? JSON.parse(product.lcia) : null,
      interpretation: product.interpretation ? JSON.parse(product.interpretation) : null,
      scenarioCount: _count.scenarios,
    }
    return <ExportClient product={p} />
  } catch { notFound() }
}
