"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField, RedFlagField, DQISelector } from "./shared"
import { Plus, Trash2 } from "lucide-react"

type Material = {
  name: string
  quantity: number | ""
  unit: string
  type: string
  origin: string
  sourceType: string
  sourceDetails: string
  dqi: { reliability: number; completeness: number; temporal: number; geographic: number; technological: number }
  co2eqPerUnit: number | ""
  recycledContent: number | ""
  isMissing: boolean
}

const defaultDqi = { reliability: 3, completeness: 3, temporal: 3, geographic: 3, technological: 3 }

const defaultMaterial: Material = {
  name: "", quantity: "", unit: "kg", type: "primary", origin: "", sourceType: "DATABASE",
  sourceDetails: "", dqi: defaultDqi, co2eqPerUnit: "", recycledContent: "", isMissing: false,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step2RawMaterial({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step2")
  const [materials, setMaterials] = useState<Material[]>(
    data?.length ? data : [{ ...defaultMaterial }]
  )

  useEffect(() => { onChange({ rawMaterial: materials }) }, [materials, onChange])

  const update = (i: number, field: string, value: unknown) => {
    setMaterials((m) => m.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const add = () => setMaterials((m) => [...m, { ...defaultMaterial }])
  const remove = (i: number) => setMaterials((m) => m.filter((_, idx) => idx !== i))

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">
          {t("subtitle")}{" "}
          <span className="text-brass font-medium">ISO 14044 §4.3.2</span>
        </p>
      </div>

      {materials.map((mat, i) => (
        <WizardSection key={i} title={`${t("material", { n: i + 1 })}${mat.name ? ` — ${mat.name}` : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-ink/40">#{i + 1}</span>
            {materials.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-coral/60 hover:text-coral flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                {t("remove")}
              </button>
            )}
          </div>

          <RedFlagField
            label={t("nameLabel")}
            required
            isEmpty={!mat.name}
            whyImportant={t("nameHelper")}
            isoRef="ISO 14044 §4.3.2"
            howToFind={t("namePlaceholder")}
            impactIfMissing="high"
          >
            <input
              type="text"
              value={mat.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm outline-none transition-all"
            />
          </RedFlagField>

          <div className="grid grid-cols-3 gap-3">
            <WizardField label={t("quantityLabel")} required
              helper={t("quantityHelp")}>
              <input
                type="number"
                value={mat.quantity}
                onChange={(e) => update(i, "quantity", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="0"
                className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
              />
            </WizardField>
            <WizardField label={t("unit")}>
              <select
                value={mat.unit}
                onChange={(e) => update(i, "unit", e.target.value)}
                className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
              >
                {["kg", "g", "m³", "stk", "m²", "L", "kWh", "km"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </WizardField>
            <WizardField label={t("typeLabel")}>
              <select
                value={mat.type}
                onChange={(e) => update(i, "type", e.target.value)}
                className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
              >
                <option value="primary">{t("types.primary")}</option>
                <option value="secondary">{t("types.secondary")}</option>
                <option value="biobased">{t("types.biobased")}</option>
              </select>
            </WizardField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <WizardField label={t("originLabel")} optional>
              <input
                type="text"
                value={mat.origin}
                onChange={(e) => update(i, "origin", e.target.value)}
                placeholder={t("originPlaceholder")}
                className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
              />
            </WizardField>
            <WizardField label={t("sourceTypeLabel")}>
              <select
                value={mat.sourceType}
                onChange={(e) => update(i, "sourceType", e.target.value)}
                className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
              >
                <option value="MEASUREMENT">{t("sourceTypes.measurement")}</option>
                <option value="SUPPLIER_DATA">{t("sourceTypes.supplier")}</option>
                <option value="LITERATURE">{t("sourceTypes.literature")}</option>
                <option value="DATABASE">Database (Ecoinvent)</option>
                <option value="ASSUMPTION">{t("sourceTypes.assumption")}</option>
                <option value="EXPERT_JUDGMENT">{t("sourceTypes.expert")}</option>
              </select>
            </WizardField>
          </div>

          <WizardField label={t("sourceDetailLabel")} optional helper={t("sourceDetailHelper")}>
            <input
              type="text"
              value={mat.sourceDetails}
              onChange={(e) => update(i, "sourceDetails", e.target.value)}
              placeholder="fx 'Ecoinvent 3.10 — copper, primary, RER'"
              className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </WizardField>

          <DQISelector value={mat.dqi} onChange={(dqi) => update(i, "dqi", dqi)} />

          <div className="grid grid-cols-2 gap-3">
            <WizardField label={t("emissionLabel")} optional helper={t("emissionHelper")}>
              <div className="relative">
                <input
                  type="number"
                  value={mat.co2eqPerUnit}
                  onChange={(e) => update(i, "co2eqPerUnit", e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder="0.00"
                  className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40">
                  kg CO₂/{mat.unit}
                </span>
              </div>
            </WizardField>
            <WizardField label={t("recycledContent")} optional helper={t("recycledHelper")}>
              <div className="relative">
                <input
                  type="number"
                  min="0" max="100"
                  value={mat.recycledContent}
                  onChange={(e) => update(i, "recycledContent", e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder="0"
                  className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40">%</span>
              </div>
            </WizardField>
          </div>
        </WizardSection>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-sage-mist/40 rounded-xl text-sm text-moss hover:border-brass hover:text-forest-deep transition-all"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        {t("addMaterial")}
      </button>
    </div>
  )
}
