"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField } from "./shared"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step8Interpretation({ data, lcia, onChange }: { data: any; lcia: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step8")
  const [form, setForm] = useState({
    sensitivityParameters: data?.sensitivityAnalysis?.parameters ?? [],
    sensitivityResults: data?.sensitivityAnalysis?.results ?? "",
    conclusions: data?.conclusions ?? "",
    recommendations: data?.recommendations ?? "",
    limitations: data?.limitations ?? "",
  })

  useEffect(() => {
    onChange({
      interpretation: {
        sensitivityAnalysis: { parameters: form.sensitivityParameters, results: form.sensitivityResults },
        conclusions: form.conclusions,
        recommendations: form.recommendations,
        limitations: form.limitations,
      }
    })
  }, [form, onChange])

  const paramOptions = ["lifetime", "transport-distance", "electricity-mix", "recycling-rate", "use-energy", "material-quantity"]

  const toggleParam = (p: string) => setForm((f) => ({
    ...f,
    sensitivityParameters: f.sensitivityParameters.includes(p)
      ? f.sensitivityParameters.filter((x: string) => x !== p)
      : [...f.sensitivityParameters, p]
  }))

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")} <span className="text-brass font-medium">ISO 14044 §4.5</span></p>
      </div>

      {lcia?.results && (
        <div className="bg-brass/5 border border-brass/20 rounded-xl p-5">
          <p className="text-xs font-semibold text-brass mb-3">{t("lciaTitle")}</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-bone rounded-lg p-3 border border-sage-mist/20">
              <p className="text-xs text-ink/40">{t("gwp")}</p>
              <p className="text-xl font-bold font-mono text-charcoal">{lcia.results.gwp_kg_co2}</p>
              <p className="text-xs text-moss">{t("gwpUnit")}</p>
            </div>
            <div className="bg-bone rounded-lg p-3 border border-sage-mist/20">
              <p className="text-xs text-ink/40">E-waste</p>
              <p className="text-xl font-bold font-mono text-charcoal">{lcia.results.eWaste_kg ?? "N/A"}</p>
              <p className="text-xs text-moss">{t("waterUnit")}</p>
            </div>
            <div className="bg-bone rounded-lg p-3 border border-sage-mist/20">
              <p className="text-xs text-ink/40">{t("resources")}</p>
              <p className="text-sm font-bold text-charcoal capitalize">{lcia.results.resourceDepletion ?? "—"}</p>
            </div>
          </div>
        </div>
      )}

      <WizardSection title={t("sensitivityTitle")}>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">{t("sensitivityParams")}</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {paramOptions.map((p) => (
              <button key={p} type="button" onClick={() => toggleParam(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.sensitivityParameters.includes(p)
                    ? "bg-forest-deep text-bone border-forest-deep"
                    : "bg-bone text-ink/60 border-sage-mist/40 hover:border-forest-deep"
                }`}>
                {p}
              </button>
            ))}
          </div>
          <WizardField label={t("sensitivityResult")} optional>
            <textarea value={form.sensitivityResults} onChange={(e) => setForm((f) => ({ ...f, sensitivityResults: e.target.value }))}
              placeholder={t("sensitivityPlaceholder")} rows={3}
              className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
          </WizardField>
        </div>
      </WizardSection>

      <WizardSection title={t("conclusionsTitle")}>
        <WizardField label={t("conclusionsLabel")} helper={t("conclusionsHelper")}>
          <textarea value={form.conclusions} onChange={(e) => setForm((f) => ({ ...f, conclusions: e.target.value }))}
            placeholder={t("conclusionsPlaceholder")} rows={4}
            className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>
        <WizardField label={t("recommendationsLabel")} optional>
          <textarea value={form.recommendations} onChange={(e) => setForm((f) => ({ ...f, recommendations: e.target.value }))}
            placeholder={t("recommendationsPlaceholder")} rows={3}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>
        <WizardField label={t("limitationsLabel")} helper={t("limitationsHelper")}>
          <textarea value={form.limitations} onChange={(e) => setForm((f) => ({ ...f, limitations: e.target.value }))}
            placeholder={t("limitationsPlaceholder")} rows={3}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>
      </WizardSection>
    </div>
  )
}
