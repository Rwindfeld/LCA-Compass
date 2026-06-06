"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardField, WizardSection, RedFlagField } from "./shared"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step1GoalScope({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step1")
  const ta = useTranslations("newProduct.ambitions")

  const [form, setForm] = useState({
    productName: data?.productName ?? "",
    productType: data?.productType ?? "",
    purpose: data?.purpose ?? "",
    audience: data?.audience ?? [],
    comparativeAssertion: data?.comparativeAssertion ?? false,
    functionalUnit: data?.functionalUnit ?? { type: "", text: "", quantity: "", unit: "" },
    referenceFlow: data?.referenceFlow ?? "",
    systemBoundaries: data?.systemBoundaries ?? "Cradle-to-grave",
    includedPhases: data?.includedPhases ?? ["raw_material", "production", "distribution", "use", "end_of_life"],
    cutOffCriterion: data?.cutOffCriterion ?? 1,
    allocationApproach: data?.allocationApproach ?? "AVOID_ALLOCATION",
    ambitionLevel: data?.ambitionLevel ?? "SCREENING",
    geographicScope: data?.geographicScope ?? "",
    timePeriod: data?.timePeriod ?? "",
    limitations: data?.limitations ?? "",
  })

  useEffect(() => { onChange(form) }, [form, onChange])

  const update = (field: string, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const audienceKeys = ["design", "customers", "investors", "authorities", "public", "censor"] as const

  const toggleAudience = (opt: string) => {
    setForm((f) => ({
      ...f,
      audience: f.audience.includes(opt)
        ? f.audience.filter((a: string) => a !== opt)
        : [...f.audience, opt],
    }))
  }

  const boundaryTypes = [
    { value: "Cradle-to-grave", key: "cradle_to_grave" },
    { value: "Cradle-to-gate", key: "cradle_to_gate" },
    { value: "Cradle-to-cradle", key: "cradle_to_gate_recycled" },
    { value: "Gate-to-gate", key: "gate_to_gate" },
    { value: "Gate-to-grave", key: "gate_to_grave" },
  ] as const

  const phaseKeys = [
    { value: "raw_material", key: "raw_material" },
    { value: "production", key: "production" },
    { value: "distribution", key: "distribution" },
    { value: "use", key: "use" },
    { value: "end_of_life", key: "eol" },
    { value: "recycling", key: "recycling" },
  ] as const

  const allocationOptions: { value: string; labelKey: string; descKey: string; preferred?: boolean }[] = [
    { value: "AVOID_ALLOCATION", labelKey: "avoid", descKey: "avoidDesc", preferred: true },
    { value: "SYSTEM_EXPANSION", labelKey: "expand", descKey: "expandDesc" },
    { value: "PHYSICAL_ALLOCATION", labelKey: "physical", descKey: "physicalDesc" },
    { value: "ECONOMIC_ALLOCATION", labelKey: "economic", descKey: "economicDesc" },
  ]

  const ambitionLevels = ["SCREENING", "DETAILED", "CRITICAL_REVIEWED", "EPD_VERIFIED"] as const

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">
          {t("subtitle")}{" "}
          <span className="text-brass font-medium">ISO 14044 §4.2</span>
        </p>
      </div>

      <WizardSection title={t("basicInfo")}>
        <RedFlagField
          label={t("purposeLabel")}
          required
          isEmpty={!form.purpose}
          whyImportant={t("purposeHelper")}
          isoRef="ISO 14044 §4.2.2"
          howToFind={t("purposePlaceholder")}
          impactIfMissing="critical"
        >
          <textarea
            value={form.purpose}
            onChange={(e) => update("purpose", e.target.value)}
            placeholder={t("intendedAudience")}
            rows={3}
            className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm font-sans outline-none transition-all resize-none"
          />
        </RedFlagField>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Intended audience
          </label>
          <div className="flex flex-wrap gap-2">
            {audienceKeys.map((key) => {
              const label = t(`audiences.${key}`)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAudience(label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    form.audience.includes(label)
                      ? "bg-forest-deep text-bone border-forest-deep"
                      : "bg-bone text-ink/70 border-sage-mist/50 hover:border-forest-deep"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-amber-warn/5 border border-amber-warn/20 rounded-xl">
          <input
            type="checkbox"
            id="comparative"
            checked={form.comparativeAssertion}
            onChange={(e) => update("comparativeAssertion", e.target.checked)}
            className="w-4 h-4 rounded border-sage-mist text-forest-deep"
          />
          <div>
            <label htmlFor="comparative" className="text-sm font-medium text-charcoal cursor-pointer">
              {t("comparativeAssertion")}
            </label>
            <p className="text-xs text-ink/50 mt-0.5">{t("comparativeNote")}</p>
          </div>
        </div>
      </WizardSection>

      <WizardSection title={t("functionalUnit")}>
        <RedFlagField
          label={t("functionalUnit")}
          required
          isEmpty={!form.functionalUnit?.text}
          whyImportant={t("fuHelper")}
          isoRef="ISO 14044 §4.2.3.2"
          howToFind={t("fuPlaceholder")}
          impactIfMissing="critical"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-ink/50 mb-1">{t("fuType")}</label>
                <select
                  value={form.functionalUnit.type}
                  onChange={(e) => update("functionalUnit", { ...form.functionalUnit, type: e.target.value })}
                  className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
                >
                  <option value="">{t("fuType")}</option>
                  <option value="time">{t("fuTypes.time")}</option>
                  <option value="usage">{t("fuTypes.usage")}</option>
                  <option value="output">{t("fuTypes.output")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-ink/50 mb-1">{t("fuQuantity")}</label>
                <input
                  type="number"
                  value={form.functionalUnit.quantity}
                  onChange={(e) => update("functionalUnit", { ...form.functionalUnit, quantity: e.target.value })}
                  placeholder="1"
                  className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-ink/50 mb-1">{t("fuUnit")}</label>
                <input
                  type="text"
                  value={form.functionalUnit.unit}
                  onChange={(e) => update("functionalUnit", { ...form.functionalUnit, unit: e.target.value })}
                  placeholder={t("fuUnitPlaceholder")}
                  className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <textarea
              value={form.functionalUnit.text}
              onChange={(e) => update("functionalUnit", { ...form.functionalUnit, text: e.target.value })}
              placeholder={t("fuTextPlaceholder")}
              rows={2}
              className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm font-sans outline-none transition-all resize-none"
            />
          </div>
        </RedFlagField>

        <WizardField label={t("referenceFlow")} helper={t("rfHelper")}>
          <input
            type="text"
            value={form.referenceFlow}
            onChange={(e) => update("referenceFlow", e.target.value)}
            placeholder={t("rfPlaceholder")}
            className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm font-sans outline-none transition-all"
          />
        </WizardField>
      </WizardSection>

      <WizardSection title={t("systemBoundaries")}>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-3">{t("boundaryType")}</label>
          <div className="grid sm:grid-cols-3 gap-2">
            {boundaryTypes.map(({ value, key }) => (
              <button
                key={value}
                type="button"
                onClick={() => update("systemBoundaries", value)}
                className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${
                  form.systemBoundaries === value
                    ? "border-forest-deep bg-forest-deep/5 font-medium text-forest-deep"
                    : "border-sage-mist/40 hover:border-forest-deep text-ink/70"
                }`}
              >
                <p className="font-medium mb-0.5">{value}</p>
                <p className="text-ink/40">{t(`boundaryTypes.${key}`)}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">{t("includedPhases")}</label>
          <div className="flex flex-wrap gap-2">
            {phaseKeys.map(({ value, key }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  const phases = form.includedPhases.includes(value)
                    ? form.includedPhases.filter((p: string) => p !== value)
                    : [...form.includedPhases, value]
                  update("includedPhases", phases)
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.includedPhases.includes(value)
                    ? "bg-verified/10 text-verified border-verified/30"
                    : "bg-bone text-ink/50 border-sage-mist/40"
                }`}
              >
                {t(`phases.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <WizardField label={t("cutOff")} helper={t("cutOffHelper")}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.1" max="5" step="0.1"
              value={form.cutOffCriterion}
              onChange={(e) => update("cutOffCriterion", parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-mono text-moss w-12 text-right">{form.cutOffCriterion}%</span>
          </div>
        </WizardField>
      </WizardSection>

      <WizardSection title={t("allocationMethod")}>
        <div className="space-y-2">
          {allocationOptions.map(({ value, labelKey, descKey, preferred }) => (
            <button
              key={value}
              type="button"
              onClick={() => update("allocationApproach", value)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                form.allocationApproach === value
                  ? "border-forest-deep bg-forest-deep/5"
                  : "border-sage-mist/40 hover:border-forest-deep/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-charcoal">{t(`allocationMethods.${labelKey}`)}</span>
                {preferred && (
                  <span className="text-xs bg-verified/10 text-verified border border-verified/20 px-2 py-0.5 rounded-full">
                    {t("recommended")}
                  </span>
                )}
              </div>
              <p className="text-xs text-ink/50 mt-0.5">{t(`allocationMethods.${descKey}`)}</p>
            </button>
          ))}
        </div>
      </WizardSection>

      <WizardSection title={t("ambitionLevel")}>
        <div className="grid sm:grid-cols-2 gap-3">
          {ambitionLevels.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => update("ambitionLevel", value)}
              className={`text-left px-4 py-3 rounded-xl border transition-all ${
                form.ambitionLevel === value
                  ? "border-brass bg-brass/5 shadow-brass-glow"
                  : "border-sage-mist/40 hover:border-brass/40"
              }`}
            >
              <p className="text-sm font-semibold text-charcoal">{ta(`${value}.label`)}</p>
              <p className="text-xs text-ink/50 mt-0.5">{t(`ambitions.${value}`)}</p>
            </button>
          ))}
        </div>
      </WizardSection>

      <WizardSection title={t("advancedSettings")} collapsible>
        <WizardField label={t("geographicScope")} optional>
          <input
            type="text"
            value={form.geographicScope}
            onChange={(e) => update("geographicScope", e.target.value)}
            placeholder={t("geoPlaceholder")}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none"
          />
        </WizardField>

        <WizardField label={t("timePeriod")} optional>
          <input
            type="text"
            value={form.timePeriod}
            onChange={(e) => update("timePeriod", e.target.value)}
            placeholder={t("timePlaceholder")}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none"
          />
        </WizardField>

        <WizardField label={t("limitations")} optional>
          <textarea
            value={form.limitations}
            onChange={(e) => update("limitations", e.target.value)}
            placeholder={t("limitationsPlaceholder")}
            rows={3}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none"
          />
        </WizardField>
      </WizardSection>
    </div>
  )
}
