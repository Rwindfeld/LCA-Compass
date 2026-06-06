"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField } from "./shared"

const lciaMethodDetails = [
  { value: "ReCiPe 2016 (H/A)", key: "ReCiPe2016", recommended: true, scope: "Global", type: "Mid + Endpoint" },
  { value: "CML-IA baseline", key: "CML2002", scope: "Europe", type: "Midpoint" },
  { value: "TRACI 2.1", key: "TRACI", scope: "USA/N.America", type: "Midpoint" },
  { value: "EF 3.1", key: "EF31", scope: "EU", type: "Midpoint" },
  { value: "ILCD 2011 Midpoint+", key: "ILCD", scope: "Europe", type: "Midpoint" },
  { value: "IPCC AR6 GWP", key: "GWP_only", scope: "Global", type: "GWP only" },
]

const allCategories = [
  { id: "GWP", label: "Climate change (GWP)", required: true },
  { id: "ODP", label: "Ozone depletion" },
  { id: "AP", label: "Acidification" },
  { id: "EP_fresh", label: "Eutrophication (freshwater)" },
  { id: "EP_marine", label: "Eutrophication (marine)" },
  { id: "POFP", label: "Photochemical ozone formation" },
  { id: "PM", label: "Particulate matter" },
  { id: "HT", label: "Human toxicity" },
  { id: "ET", label: "Ecotoxicity" },
  { id: "RD_mineral", label: "Resource depletion (minerals)" },
  { id: "RD_fossil", label: "Resource depletion (fossil)" },
  { id: "WS", label: "Water scarcity" },
  { id: "LU", label: "Land use" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step7LCIA({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step7")
  const [form, setForm] = useState({
    method: data?.method ?? "ReCiPe 2016 (H/A)",
    categories: data?.categories ?? ["GWP", "ODP", "AP", "EP_fresh", "resource_depletion"],
    normalization: data?.normalization ?? false,
    weighting: data?.weighting ?? false,
  })

  useEffect(() => { onChange({ lcia: form }) }, [form, onChange])

  const toggleCategory = (id: string) => {
    if (id === "GWP") return
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c: string) => c !== id)
        : [...f.categories, id],
    }))
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")} <span className="text-brass font-medium">ISO 14044 §4.4</span></p>
      </div>

      <WizardSection title="LCIA method">
        <div className="space-y-2">
          {lciaMethodDetails.map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, method: method.value }))}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                form.method === method.value
                  ? "border-forest-deep bg-forest-deep/5 shadow-compass"
                  : "border-sage-mist/40 hover:border-forest-deep/40 bg-bone"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-charcoal">{method.value}</span>
                {method.recommended && (
                  <span className="text-xs bg-verified/10 text-verified border border-verified/20 px-2 py-0.5 rounded-full">{t("recommended")}</span>
                )}
                <span className="text-xs text-ink/40 ml-auto">{method.scope} · {method.type}</span>
              </div>
              <p className="text-xs text-ink/60">{t(`methodDescs.${method.key}`)}</p>
            </button>
          ))}
        </div>
      </WizardSection>

      <WizardSection title="Impact categories">
        <p className="text-xs text-ink/50 mb-3">{t("categoriesHelper")}</p>
        <div className="grid grid-cols-2 gap-2">
          {allCategories.map(({ id, label, required }) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleCategory(id)}
              disabled={required}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all text-xs ${
                form.categories.includes(id)
                  ? "border-forest-deep bg-forest-deep/5 font-medium"
                  : "border-sage-mist/30 text-ink/60 hover:border-forest-deep/40"
              } ${required ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${form.categories.includes(id) ? "bg-forest-deep border-forest-deep text-bone" : "border-sage-mist/50"}`}>
                {form.categories.includes(id) && <span className="text-[10px]">✓</span>}
              </span>
              <span>{label}</span>
              {required && <span className="ml-auto text-xs text-brass">{t("gwpRequired")}</span>}
            </button>
          ))}
        </div>
      </WizardSection>

      <WizardSection title={t("normalizationTitle")} collapsible>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 bg-bone rounded-xl border border-sage-mist/30 cursor-pointer hover:border-brass transition-colors">
            <input type="checkbox" checked={form.normalization} onChange={(e) => setForm((f) => ({ ...f, normalization: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded" />
            <div>
              <p className="text-sm font-medium text-charcoal">{t("normalizationLabel")}</p>
              <p className="text-xs text-ink/50">{t("normalizationHelper")}</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-4 bg-bone rounded-xl border border-sage-mist/30 cursor-pointer hover:border-brass transition-colors">
            <input type="checkbox" checked={form.weighting} onChange={(e) => setForm((f) => ({ ...f, weighting: e.target.checked }))} className="mt-0.5 w-4 h-4 rounded" />
            <div>
              <p className="text-sm font-medium text-charcoal">{t("weightingLabel")}</p>
              <p className="text-xs text-ink/50">{t("weightingHelper")}</p>
            </div>
          </label>
        </div>
      </WizardSection>
    </div>
  )
}
