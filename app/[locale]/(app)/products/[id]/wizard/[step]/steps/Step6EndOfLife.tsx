"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField, RedFlagField, FieldHint } from "./shared"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step6EndOfLife({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step6")
  const [form, setForm] = useState({
    reuse: data?.reuse ?? 0,
    recycled: data?.recycled ?? 0,
    energyRecovery: data?.energyRecovery ?? 0,
    landfill: data?.landfill ?? 100,
    other: data?.other ?? 0,
    designForDisassembly: data?.designForDisassembly ?? false,
    disassemblyDescription: data?.disassemblyDescription ?? "",
    recoveryRateAssumptions: data?.recoveryRateAssumptions ?? "",
    takeBackProgram: data?.takeBackProgram ?? "",
  })

  useEffect(() => { onChange({ endOfLife: form }) }, [form, onChange])
  const update = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }))

  const total = form.reuse + form.recycled + form.energyRecovery + form.landfill + form.other
  const isValid = total === 100

  const routes = [
    { field: "reuse" as const, key: "reuse", color: "bg-verified" },
    { field: "recycled" as const, key: "recycling", color: "bg-moss" },
    { field: "energyRecovery" as const, key: "energy", color: "bg-brass" },
    { field: "landfill" as const, key: "landfill", color: "bg-coral" },
    { field: "other" as const, key: "other", color: "bg-ink/30" },
  ] as const

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      <WizardSection title="EOL scenario (mass-balance)">
        <div className={`p-3 rounded-xl text-xs font-medium text-center mb-4 ${isValid ? "bg-verified/10 text-verified border border-verified/20" : "bg-coral/10 text-coral border border-coral/20"}`}>
          {t("total", { pct: total })} {isValid ? t("totalValid") : t("totalInvalid", { remaining: 100 - total })}
        </div>

        {routes.map(({ field, key, color }) => (
          <div key={field}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-sm font-medium text-charcoal">{t(`routes.${key}`)}</label>
                {(key === "recycling" || key === "reuse") && (
                  <FieldHint text={t("recoveryRateHelper")} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" max="100"
                  value={form[field]}
                  onChange={(e) => update(field, parseInt(e.target.value) || 0)}
                  className="w-16 bg-bone border border-sage-mist focus:border-brass rounded-lg px-2 py-1.5 text-sm font-mono text-right outline-none"
                />
                <span className="text-xs text-ink/40 w-4">%</span>
              </div>
            </div>
            <div className="h-2 bg-sage-mist/20 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${form[field]}%` }} />
            </div>
          </div>
        ))}
      </WizardSection>

      <WizardSection title="Design for disassembly">
        <label className="flex items-center gap-3 p-4 bg-bone rounded-xl border border-sage-mist/30 cursor-pointer hover:border-brass transition-colors">
          <input type="checkbox" checked={form.designForDisassembly} onChange={(e) => update("designForDisassembly", e.target.checked)} className="w-4 h-4 rounded" />
          <div>
            <p className="text-sm font-medium text-charcoal">{t("disassembly")}</p>
            <p className="text-xs text-ink/50">{t("disassemblyNote")}</p>
          </div>
        </label>
        {form.designForDisassembly && (
          <WizardField label={t("disassemblyDesc")} optional>
            <textarea value={form.disassemblyDescription} onChange={(e) => update("disassemblyDescription", e.target.value)}
              placeholder={t("disassemblyPlaceholder")} rows={2}
              className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
          </WizardField>
        )}
      </WizardSection>

      <WizardSection title={t("assumptionsTitle")}>
        <RedFlagField label={t("assumptionsLabel")} required isEmpty={!form.recoveryRateAssumptions}
          whyImportant={t("assumptionsHelper")}
          isoRef="ISO 14044 §4.3.3" howToFind={t("assumptionsHelper")}
          impactIfMissing="high">
          <textarea value={form.recoveryRateAssumptions} onChange={(e) => update("recoveryRateAssumptions", e.target.value)}
            placeholder={t("assumptionsPlaceholder")} rows={2}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </RedFlagField>

        <WizardField label={t("takebackLabel")} optional helper={t("takebackPlaceholder")}>
          <input type="text" value={form.takeBackProgram} onChange={(e) => update("takeBackProgram", e.target.value)}
            placeholder={t("takebackPlaceholder")} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none" />
        </WizardField>
      </WizardSection>
    </div>
  )
}
