"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField } from "./shared"
import { Plus, Trash2 } from "lucide-react"

type Leg = { from: string; to: string; distance: number | ""; method: string; loadFactor: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step4Distribution({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step4")
  const [legs, setLegs] = useState<Leg[]>(
    data?.length ? data : [{ from: "", to: "", distance: "", method: "truck", loadFactor: 70 }]
  )
  const [packaging, setPackaging] = useState({ material: "", quantity: "", recyclable: false })

  useEffect(() => { onChange({ distribution: legs, packagingDistribution: packaging }) }, [legs, packaging, onChange])

  const update = (i: number, field: string, value: unknown) =>
    setLegs((l) => l.map((leg, idx) => idx === i ? { ...leg, [field]: value } : leg))
  const add = () => setLegs((l) => [...l, { from: "", to: "", distance: "", method: "truck", loadFactor: 70 }])
  const remove = (i: number) => setLegs((l) => l.filter((_, idx) => idx !== i))

  const modes = ["truck", "rail", "sea", "air", "combined"] as const

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")} <span className="text-brass font-medium">ISO 14044 §4.3.2</span></p>
      </div>

      {legs.map((leg, i) => (
        <WizardSection key={i} title={t("leg", { n: i + 1 })}>
          <div className="flex justify-end mb-1">
            {legs.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-xs text-coral/60 hover:text-coral flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> {t("remove")}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <WizardField label={t("fromLabel")}>
              <input type="text" value={leg.from} onChange={(e) => update(i, "from", e.target.value)} placeholder="fx 'Taiwan'" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
            <WizardField label={t("toLabel")}>
              <input type="text" value={leg.to} onChange={(e) => update(i, "to", e.target.value)} placeholder={t("toPlaceholder")} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <WizardField label={t("distanceLabel")} helper={t("distanceHelper")}>
              <input type="number" value={leg.distance} onChange={(e) => update(i, "distance", e.target.value ? parseFloat(e.target.value) : "")} placeholder="0" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
            <WizardField label={t("modeLabel")}>
              <select value={leg.method} onChange={(e) => update(i, "method", e.target.value)} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none">
                {modes.map((m) => (
                  <option key={m} value={m}>{t(`modes.${m}`)}</option>
                ))}
              </select>
            </WizardField>
            <WizardField label={t("loadFactor")} helper={t("loadFactorHelper")}>
              <input type="number" min="10" max="100" value={leg.loadFactor} onChange={(e) => update(i, "loadFactor", parseInt(e.target.value))} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
          </div>
        </WizardSection>
      ))}

      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-sage-mist/40 rounded-xl text-sm text-moss hover:border-brass hover:text-forest-deep transition-all">
        <Plus className="w-4 h-4" strokeWidth={2} /> {t("addLeg")}
      </button>

      <WizardSection title={t("packagingTitle")} collapsible>
        <div className="grid grid-cols-2 gap-3">
          <WizardField label={t("packagingMaterial")} optional>
            <input type="text" value={packaging.material} onChange={(e) => setPackaging((p) => ({ ...p, material: e.target.value }))} placeholder={t("packagingPlaceholder")} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
          </WizardField>
          <WizardField label={t("packagingWeight")} optional helper={t("weightHelper")}>
            <input type="text" value={packaging.quantity} onChange={(e) => setPackaging((p) => ({ ...p, quantity: e.target.value }))} placeholder="0" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
          </WizardField>
        </div>
        <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
          <input type="checkbox" checked={packaging.recyclable} onChange={(e) => setPackaging((p) => ({ ...p, recyclable: e.target.checked }))} className="rounded" />
          {t("packagingRecyclable")}
        </label>
      </WizardSection>
    </div>
  )
}
