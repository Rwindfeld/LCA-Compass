"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Check, X, ArrowRight } from "lucide-react"
import { ComplianceScoreRing } from "@/components/ComplianceScoreRing"
import {
  ISO_CHECKLIST,
  calcComplianceScore,
  checkItemStatus,
} from "@/lib/lca/compliance-check"
import { getComplianceItemLabel } from "@/lib/lca/compliance-i18n"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step10Compliance({ product }: { product: any }) {
  const params = useParams()
  const id = params.id as string
  const locale = useLocale()
  const lp = (path: string) => `/${locale}${path}`
  const t = useTranslations("wizardStepContent.step10")
  const tc = useTranslations("complianceCheck")

  const labelFor = (key: string) => getComplianceItemLabel(key, locale as "da" | "en")

  const checks = ISO_CHECKLIST.map((item) => ({
    ...item,
    label: labelFor(item.key),
    status: checkItemStatus(product, item.field),
  }))

  const score = calcComplianceScore(product)
  const fulfilled = checks.filter((c) => c.status === "fulfilled").length
  const total = checks.length

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      <div className="bg-parchment border border-sage-mist/30 rounded-2xl p-6 shadow-compass text-center">
        <p className="text-xs text-ink/40 uppercase tracking-widest mb-4">ISO 14044 Compliance Score</p>
        <div className="relative inline-flex items-center justify-center mb-4">
          <ComplianceScoreRing score={score} size={140} strokeWidth={10} />
          <div className="absolute text-center">
            <span className="text-4xl font-bold font-mono text-charcoal">{score}</span>
            <span className="text-sm text-moss block">%</span>
          </div>
        </div>
        <p className="text-sm font-medium text-charcoal">
          {t("score", { fulfilled, total })}
        </p>
        {score >= 90 && (
          <p className="text-sm text-ink/50 mt-1">{tc("ready")}</p>
        )}

        {score >= 90 && (
          <div className="mt-4">
            <Link
              href={lp(`/products/${id}/report`)}
              className="inline-flex items-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 transition-colors px-5 py-2.5 rounded-lg text-sm font-bold shadow-brass-glow"
            >
              {t("generateReport")}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        )}
      </div>

      <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass overflow-hidden">
        <div className="px-5 py-4 border-b border-sage-mist/20 bg-bone/50">
          <h3 className="text-sm font-semibold text-charcoal">{t("checklist")}</h3>
        </div>
        <div className="divide-y divide-sage-mist/15">
          {checks.map(({ id: cid, label, isoRef, status, wizardStep }) => (
            <div key={cid} className="flex items-center gap-4 px-5 py-3.5">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  status === "fulfilled"
                    ? "bg-verified/15 text-verified"
                    : "bg-coral/10 text-coral"
                }`}
              >
                {status === "fulfilled" ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                ) : (
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal">{label}</p>
                <span className="text-xs text-ink/40 font-mono">{isoRef}</span>
              </div>

              {status !== "fulfilled" && (
                <Link
                  href={lp(`/products/${id}/wizard/${wizardStep}`)}
                  className="text-xs text-moss hover:text-forest-deep font-medium transition-colors flex-shrink-0"
                >
                  Fix →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
