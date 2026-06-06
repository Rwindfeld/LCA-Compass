import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ReportClient } from "./ReportClient"
import { generateProse } from "@/lib/ai"
import { getTranslations } from "next-intl/server"

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: "report.sections" })

  const sections = [
    { id: "executive_summary" as const, label: t("executive_summary") },
    { id: "goal_scope" as const, label: t("goal_scope") },
    { id: "lci_raw" as const, label: t("lci_raw") },
    { id: "lcia" as const, label: t("lcia") },
    { id: "interpretation" as const, label: t("interpretation") },
  ]

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

    const prose: Record<string, string> = {}
    for (const section of sections) {
      prose[section.id] = await generateProse({
        section: section.id,
        productData: parsedProduct,
        locale: (locale === "en" ? "en" : "da") as "da" | "en",
      })
    }

    return (
      <ReportClient
        product={parsedProduct}
        sections={sections}
        prose={prose}
      />
    )
  } catch {
    notFound()
  }
}
