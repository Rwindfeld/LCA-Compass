"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Check, X, AlertCircle, ArrowRight, ChevronRight } from "lucide-react"
import { ComplianceScoreRing } from "@/components/ComplianceScoreRing"
import { ISO_CHECKLIST, checkItemStatus, calcComplianceScore } from "@/lib/lca/compliance-check"
import { getComplianceItemLabel } from "@/lib/lca/compliance-i18n"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ComplianceClient({ product }: { product: any }) {
  const params = useParams()
  const id = params.id as string
  const locale = useLocale()
  const lp = (path: string) => `/${locale}${path}`
  const t = useTranslations("complianceCheck")
  const tp = useTranslations("productDetail")

  const labelFor = (key: string) => getComplianceItemLabel(key, locale as "da" | "en")

  const ambitionLevels = [
    { name: "Screening", required: [1, 2, 3, 5, 9], minScore: 60 },
    { name: "Detailed", required: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], minScore: 80 },
    { name: "Critical reviewed", required: ISO_CHECKLIST.map((c) => c.id), minScore: 90 },
    { name: "EPD verified", required: ISO_CHECKLIST.map((c) => c.id), minScore: 95 },
  ]

  const checks = ISO_CHECKLIST.map((item) => ({
    ...item,
    label: labelFor(item.key),
    status: checkItemStatus(product, item.field),
  }))

  const fulfilled = checks.filter((c) => c.status === "fulfilled").length
  const score = calcComplianceScore(product)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-1.5 text-xs text-ink/40 mb-1">
          <Link href={lp(`/products/${id}`)} className="hover:text-moss transition-colors">{tp("backToProducts")}</Link>
          <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
          <span>Compliance</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-charcoal">ISO 14044 Compliance Check</h1>
        <p className="text-sm text-ink/50 mt-1">{product.name}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-parchment border border-sage-mist/30 rounded-2xl p-8 shadow-compass text-center"
      >
        <p className="text-xs text-ink/40 uppercase tracking-widest mb-6">ISO 14044 Compliance Score</p>
        <div className="relative inline-flex items-center justify-center mb-6">
          <ComplianceScoreRing score={score} size={160} strokeWidth={12} />
          <div className="absolute text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-bold font-mono text-charcoal"
            >
              {score}
            </motion.span>
            <span className="text-lg text-moss block">%</span>
          </div>
        </div>
        <p className="text-base font-semibold text-charcoal mb-1">
          {t("score", { fulfilled, total: checks.length })}
        </p>
        <p className="text-sm text-ink/50">
          {score >= 90 ? t("ready") : score >= 70 ? t("good") : t("low")}
        </p>

        {score >= 80 && (
          <div className="mt-6">
            <Link
              href={lp(`/products/${id}/report`)}
              className="inline-flex items-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 transition-colors px-6 py-3 rounded-xl font-bold shadow-brass-glow"
            >
              {t("generateDraft")}
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        )}
      </motion.div>

      <div>
        <h2 className="text-base font-semibold text-charcoal mb-4">{t("checklist")}</h2>
        <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass overflow-hidden">
          {checks.map(({ id: cid, label, isoRef, status, wizardStep }, i) => (
            <motion.div
              key={cid}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 px-5 py-4 border-b border-sage-mist/15 last:border-0 hover:bg-bone/50 transition-colors"
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                status === "fulfilled" ? "bg-verified/15 text-verified" : "bg-coral/10 text-coral"
              }`}>
                {status === "fulfilled"
                  ? <Check className="w-4 h-4" strokeWidth={2.5} />
                  : <X className="w-4 h-4" strokeWidth={2} />
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal">{label}</p>
                <span className="text-xs text-ink/40 font-mono">{isoRef}</span>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  status === "fulfilled" ? "bg-verified/10 text-verified" : "bg-coral/10 text-coral"
                }`}>
                  {status === "fulfilled" ? t("fulfilled") : t("missing")}
                </span>

                {status !== "fulfilled" && (
                  <Link
                    href={lp(`/products/${id}/wizard/${wizardStep}`)}
                    className="text-xs text-moss hover:text-forest-deep font-medium transition-colors inline-flex items-center gap-1"
                  >
                    Fix <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-charcoal mb-4">{t("compareLevel")}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {ambitionLevels.map(({ name, required, minScore }) => {
            const levelFulfilled = required.filter((reqId) =>
              checks.find((c) => c.id === reqId)?.status === "fulfilled"
            ).length
            const levelScore = Math.round((levelFulfilled / required.length) * 100)
            const achieved = score >= minScore

            return (
              <div
                key={name}
                className={`bg-parchment border rounded-xl p-4 shadow-compass ${achieved ? "border-verified/30" : "border-sage-mist/30"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-charcoal">{name}</h3>
                  {achieved ? (
                    <span className="text-xs text-verified bg-verified/10 border border-verified/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" strokeWidth={2.5} /> {t("achieved")}
                    </span>
                  ) : (
                    <span className="text-xs text-amber-warn bg-amber-warn/10 border border-amber-warn/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" strokeWidth={2} /> {t("missing_pct", { pct: minScore - score })}
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-sage-mist/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${achieved ? "bg-verified" : "bg-amber-warn"}`}
                    style={{ width: `${Math.min(levelScore, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-ink/40 mt-1.5">{t("requires", { min: minScore })}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
