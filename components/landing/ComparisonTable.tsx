"use client"

import { motion } from "framer-motion"
import { Check, X, Minus } from "lucide-react"
import { useTranslations } from "next-intl"

type CellValue = boolean | "partial" | string

function Cell({ value, highlight = false }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={`w-5 h-5 mx-auto ${highlight ? "text-brass" : "text-verified"}`} strokeWidth={2.5} />
    ) : (
      <X className="w-4 h-4 mx-auto text-coral/60" strokeWidth={2} />
    )
  }
  if (value === "partial") return <Minus className="w-4 h-4 mx-auto text-amber-warn" strokeWidth={2} />
  return <span className={`text-sm ${highlight ? "font-semibold text-forest-deep" : "text-ink/70"}`}>{value}</span>
}

export function ComparisonTable() {
  const t = useTranslations("landing.comparison")

  const rows = [
    { feature: t("rows.time"),      lca: t("lcaTime"),       simapro: t("simaproTime"),       consultant: t("consultantTime"),       excel: t("excelTime") },
    { feature: t("rows.iso"),       lca: true,               simapro: true,                   consultant: true,                      excel: false },
    { feature: t("rows.guided"),    lca: true,               simapro: false,                  consultant: "partial" as const,        excel: false },
    { feature: t("rows.ai"),        lca: true,               simapro: false,                  consultant: false,                     excel: false },
    { feature: t("rows.pdf"),       lca: true,               simapro: true,                   consultant: true,                      excel: false },
    { feature: t("rows.bilingual"), lca: true,               simapro: false,                  consultant: "partial" as const,        excel: false },
    { feature: t("rows.epd"),       lca: true,               simapro: true,                   consultant: true,                      excel: false },
    { feature: t("rows.noExpert"),  lca: true,               simapro: false,                  consultant: true,                      excel: false },
  ]

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-display-lg font-display font-bold text-charcoal" style={{ letterSpacing: "-0.02em" }}>
          {t("title")}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="overflow-x-auto rounded-2xl border border-sage-mist/30 shadow-compass"
      >
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-bone border-b border-sage-mist/30">
              <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">{t("feature")}</th>
              <th className="px-6 py-4 text-sm font-bold text-forest-deep text-center bg-brass/5 border-x border-brass/20">LCA-Kompas ✦</th>
              <th className="px-6 py-4 text-sm font-medium text-ink/60 text-center">SimaPro</th>
              <th className="px-6 py-4 text-sm font-medium text-ink/60 text-center">{t("consultant")}</th>
              <th className="px-6 py-4 text-sm font-medium text-ink/60 text-center">Excel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.feature} className={`border-b border-sage-mist/20 last:border-0 ${i % 2 === 0 ? "bg-bone" : "bg-parchment/40"}`}>
                <td className="px-6 py-3.5 text-sm text-charcoal font-medium">{row.feature}</td>
                <td className="px-6 py-3.5 text-center bg-brass/5 border-x border-brass/20"><Cell value={row.lca} highlight /></td>
                <td className="px-6 py-3.5 text-center"><Cell value={row.simapro} /></td>
                <td className="px-6 py-3.5 text-center"><Cell value={row.consultant} /></td>
                <td className="px-6 py-3.5 text-center"><Cell value={row.excel} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  )
}
