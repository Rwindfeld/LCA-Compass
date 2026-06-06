"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField, RedFlagField } from "./shared"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step5Use({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step5")
  const [form, setForm] = useState({
    lifetime: data?.lifetime ?? "",
    energyKwhPerYear: data?.energyKwhPerYear ?? "",
    consumables: data?.consumables ?? "",
    maintenance: data?.maintenance ?? "",
    userBehaviorAssumptions: data?.userBehaviorAssumptions ?? "",
    reboundEffects: data?.reboundEffects ?? "",
  })

  useEffect(() => { onChange({ use: form }) }, [form, onChange])
  const update = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      <WizardSection title={t("lifetimeTitle")}>
        <div className="grid grid-cols-2 gap-4">
          <RedFlagField label={t("lifetimeLabel")} required isEmpty={!form.lifetime}
            whyImportant={t("lifetimeHelper")}
            isoRef="ISO 14044 §4.3.3" howToFind={t("lifetimeHelper")}
            impactIfMissing="critical">
            <div className="relative">
              <input type="number" value={form.lifetime} onChange={(e) => update("lifetime", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="0" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none pr-10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40">{t("lifetimeUnit")}</span>
            </div>
          </RedFlagField>

          <WizardField label={t("energyLabel")} helper={t("energyHelper")}>
            <div className="relative">
              <input type="number" value={form.energyKwhPerYear} onChange={(e) => update("energyKwhPerYear", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="0" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none pr-16" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40">{t("energyUnit")}</span>
            </div>
          </WizardField>
        </div>

        <WizardField label={t("consumablesLabel")} optional helper={t("consumablesPlaceholder")}>
          <textarea value={form.consumables} onChange={(e) => update("consumables", e.target.value)}
            placeholder={t("consumablesPlaceholder")} rows={2}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>

        <WizardField label={t("maintenanceLabel")} optional>
          <textarea value={form.maintenance} onChange={(e) => update("maintenance", e.target.value)}
            placeholder={t("maintenancePlaceholder")} rows={2}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>
      </WizardSection>

      <WizardSection title={t("behaviorTitle")}>
        <RedFlagField label={t("behaviorLabel")} required isEmpty={!form.userBehaviorAssumptions}
          whyImportant={t("behaviorHelper")}
          isoRef="ISO 14044 §4.2.3.7" howToFind={t("behaviorHelper")}
          impactIfMissing="medium">
          <textarea value={form.userBehaviorAssumptions} onChange={(e) => update("userBehaviorAssumptions", e.target.value)}
            placeholder={t("behaviorPlaceholder")} rows={3}
            className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </RedFlagField>

        <WizardField label={t("reboundLabel")} optional helper={t("reboundHelper")}>
          <textarea value={form.reboundEffects} onChange={(e) => update("reboundEffects", e.target.value)}
            placeholder={t("reboundPlaceholder")} rows={2}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>
      </WizardSection>
    </div>
  )
}
