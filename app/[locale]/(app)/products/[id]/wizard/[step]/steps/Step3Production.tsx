"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { WizardSection, WizardField, RedFlagField } from "./shared"
import { Plus, Trash2 } from "lucide-react"

type Process = { name: string; location: string; energyKwh: number | ""; energySource: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Step3Production({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const t = useTranslations("wizardStepContent.step3")
  const [form, setForm] = useState({
    processes: data?.processes ?? [{ name: "", location: "", energyKwh: "", energySource: "dk" }] as Process[],
    water: data?.water ?? "",
    waste: data?.waste ?? "",
    directEmissions: data?.directEmissions ?? "",
    machineEfficiency: data?.machineEfficiency ?? "",
    iso14001: data?.iso14001 ?? false,
  })

  useEffect(() => { onChange({ production: form }) }, [form, onChange])

  const updateProcess = (i: number, field: string, value: unknown) =>
    setForm((f) => ({
      ...f,
      processes: f.processes.map((p: Process, idx: number) =>
        idx === i ? { ...p, [field]: value } : p
      ),
    }))

  const addProcess = () =>
    setForm((f) => ({
      ...f,
      processes: [...f.processes, { name: "", location: "", energyKwh: "", energySource: "dk" }],
    }))

  const removeProcess = (i: number) =>
    setForm((f) => ({ ...f, processes: f.processes.filter((_: Process, idx: number) => idx !== i) }))

  const energySources = ["dk", "tw", "de", "solar", "wind", "gas", "coal"] as const

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal mb-1">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      {form.processes.map((proc: Process, i: number) => (
        <WizardSection key={i} title={`${t("process", { n: i + 1 })}${proc.name ? ` — ${proc.name}` : ""}`}>
          <div className="flex justify-end mb-2">
            {form.processes.length > 1 && (
              <button type="button" onClick={() => removeProcess(i)} className="text-xs text-coral/60 hover:text-coral flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> {t("remove")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <WizardField label={t("processName")} required>
              <input type="text" value={proc.name} onChange={(e) => updateProcess(i, "name", e.target.value)}
                placeholder="fx 'Label-print', 'Chip-fabrication'" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
            <WizardField label={t("location")}>
              <input type="text" value={proc.location} onChange={(e) => updateProcess(i, "location", e.target.value)}
                placeholder={t("locationPlaceholder")} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <WizardField label={t("energy")} helper={t("energyHelper")}>
              <input type="number" value={proc.energyKwh} onChange={(e) => updateProcess(i, "energyKwh", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="0" className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none" />
            </WizardField>
            <WizardField label={t("energySource")}>
              <select value={proc.energySource} onChange={(e) => updateProcess(i, "energySource", e.target.value)} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-3 py-2.5 text-sm outline-none">
                {energySources.map((src) => (
                  <option key={src} value={src}>{t(`energySources.${src}`)}</option>
                ))}
                <option value="eu">EU electricity mix</option>
                <option value="cn">CN electricity mix</option>
              </select>
            </WizardField>
          </div>
        </WizardSection>
      ))}

      <button type="button" onClick={addProcess} className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-sage-mist/40 rounded-xl text-sm text-moss hover:border-brass hover:text-forest-deep transition-all">
        <Plus className="w-4 h-4" strokeWidth={2} /> {t("addProcess")}
      </button>

      <WizardSection title={t("resourcesTitle")}>
        <RedFlagField
          label={t("waterLabel")}
          required
          isEmpty={form.water === "" || form.water === null}
          whyImportant={t("waterHelper")}
          isoRef="ISO 14044 §4.4.2"
          howToFind={t("waterHelper")}
          impactIfMissing="medium"
        >
          <input type="number" value={form.water} onChange={(e) => setForm((f) => ({ ...f, water: e.target.value }))}
            placeholder={t("waterUnit")} className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none" />
        </RedFlagField>

        <WizardField label={t("wasteLabel")} optional>
          <textarea value={form.waste} onChange={(e) => setForm((f) => ({ ...f, waste: e.target.value }))}
            placeholder={t("wastePlaceholder")} rows={2}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </WizardField>

        <RedFlagField
          label={t("emissionsLabel")}
          required={false}
          isEmpty={!form.directEmissions}
          whyImportant={t("emissionsHelper")}
          howToFind={t("emissionsHelper")}
          impactIfMissing="medium"
        >
          <textarea value={form.directEmissions ?? ""} onChange={(e) => setForm((f) => ({ ...f, directEmissions: e.target.value }))}
            placeholder={t("emissionsPlaceholder")} rows={2}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none" />
        </RedFlagField>
      </WizardSection>
    </div>
  )
}
