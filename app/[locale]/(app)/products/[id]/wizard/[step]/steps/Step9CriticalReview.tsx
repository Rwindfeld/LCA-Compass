"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField } from "./shared"
import { AlertTriangle } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step9CriticalReview({ data, ambitionLevel, onChange }: { data: any; ambitionLevel: string; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step9")
  const requiresReview = ambitionLevel === "CRITICAL_REVIEWED" || ambitionLevel === "EPD_VERIFIED"

  const [form, setForm] = useState({
    reviewType: data?.reviewType ?? "INTERNAL",
    reviewerEmail: data?.reviewerEmail ?? "",
    reviewerName: data?.reviewerName ?? "",
    status: data?.status ?? "NOT_STARTED",
    comments: data?.comments ?? "",
  })

  useEffect(() => { onChange({ criticalReview: form }) }, [form, onChange])

  if (!requiresReview) {
    return (
      <div className="max-w-3xl">
        <div>
          <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
          <p className="text-sm text-ink/60 mb-6">ISO 14071</p>
        </div>

        <div className="bg-amber-warn/10 border border-amber-warn/30 rounded-xl p-6 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-warn flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold text-charcoal mb-1">{t("notRequired")}</p>
            <p className="text-sm text-ink/60">
              {t("required")} <strong>Critical reviewed</strong> {t("updateNote")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const reviewTypes = [
    { value: "INTERNAL", labelKey: "internal", descKey: "internalDesc" },
    { value: "EXTERNAL_SINGLE", labelKey: "external_single", descKey: "externalSingleDesc" },
    { value: "EXPERT_PANEL", labelKey: "expert_panel", descKey: "expertPanelDesc" },
  ] as const

  const reviewStatuses = [
    { value: "NOT_STARTED", label: t("notStarted") },
    { value: "SCOPING", label: "Initial scoping" },
    { value: "LCI_REVIEW", label: "LCI review" },
    { value: "LCIA_REVIEW", label: "LCIA review" },
    { value: "INTERPRETATION_REVIEW", label: "Interpretation review" },
    { value: "FINAL_APPROVAL", label: "Final approval ✓" },
  ]

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("configure")} <span className="text-brass font-medium">ISO 14071</span></p>
      </div>

      <WizardSection title="Review type">
        <div className="space-y-2">
          {reviewTypes.map(({ value, labelKey, descKey }) => (
            <button key={value} type="button" onClick={() => setForm((f) => ({ ...f, reviewType: value }))}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${form.reviewType === value ? "border-forest-deep bg-forest-deep/5" : "border-sage-mist/40 hover:border-forest-deep/40 bg-bone"}`}>
              <p className="text-sm font-medium text-charcoal">{t(`reviewTypes.${labelKey}`)}</p>
              <p className="text-xs text-ink/50 mt-0.5">{t(`reviewTypes.${descKey}`)}</p>
            </button>
          ))}
        </div>
      </WizardSection>

      <WizardSection title="Reviewer(s)">
        <div className="grid grid-cols-2 gap-3">
          <WizardField label={t("reviewerName")}>
            <input type="text" value={form.reviewerName} onChange={(e) => setForm((f) => ({ ...f, reviewerName: e.target.value }))}
              placeholder={t("reviewerNamePlaceholder")} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
          </WizardField>
          <WizardField label="Email">
            <input type="email" value={form.reviewerEmail} onChange={(e) => setForm((f) => ({ ...f, reviewerEmail: e.target.value }))}
              placeholder="reviewer@example.com" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
          </WizardField>
        </div>
      </WizardSection>

      <WizardSection title="Review status">
        <div className="space-y-2">
          {reviewStatuses.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => setForm((f) => ({ ...f, status: value }))}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${form.status === value ? "border-verified bg-verified/5 font-medium text-verified" : "border-sage-mist/30 text-ink/60 hover:border-verified/40"}`}>
              {label}
            </button>
          ))}
        </div>
      </WizardSection>
    </div>
  )
}
