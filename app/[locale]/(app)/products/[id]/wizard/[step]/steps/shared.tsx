"use client"

import { useState } from "react"
import * as Popover from "@radix-ui/react-popover"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

const fieldHelpContentClass =
  "z-50 w-72 max-w-[min(18rem,calc(100vw-2rem))] bg-forest-deep text-bone text-xs rounded-xl p-4 pr-8 shadow-compass-lg border border-moss/20 outline-none"

function FieldHelpPopover({ text }: { text: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-5 h-5 rounded-full bg-moss/10 hover:bg-moss/20 text-moss text-xs font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-moss/30"
          aria-label="Help"
        >
          ?
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions
          className={fieldHelpContentClass}
        >
          <div className="flex items-start gap-2">
            <span className="text-brass font-bold mt-0.5 flex-shrink-0">?</span>
            <p className="leading-relaxed">{text}</p>
          </div>
          <Popover.Close
            type="button"
            className="absolute top-2 right-2 text-bone/40 hover:text-bone transition-colors text-base"
            aria-label="Close"
          >
            ×
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

interface WizardSectionProps {
  title: string
  children: React.ReactNode
  collapsible?: boolean
}

export function WizardSection({ title, children, collapsible = false }: WizardSectionProps) {
  const [open, setOpen] = useState(!collapsible)

  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bone/50 transition-colors"
        >
          <span className="text-sm font-semibold text-charcoal">{title}</span>
          <ChevronDown
            className={`w-4 h-4 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`}
            strokeWidth={1.5}
          />
        </button>
      ) : (
        <div className="px-5 py-4 border-b border-sage-mist/20">
          <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
        </div>
      )}

      {open && (
        <div className="px-5 py-4 space-y-5">
          {children}
        </div>
      )}
    </div>
  )
}

interface WizardFieldProps {
  label: string
  helper?: string
  optional?: boolean
  required?: boolean
  children: React.ReactNode
}

export function WizardField({ label, helper, optional = false, required = false, children }: WizardFieldProps) {
  const t = useTranslations("redFlag")

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-sm font-medium text-charcoal">{label}</label>
        {optional && !required && (
          <span className="text-xs text-ink/40 bg-ink/5 px-1.5 py-0.5 rounded">{t("optional")}</span>
        )}
        {required && (
          <span className="text-xs text-coral/70 font-medium">{t("required")}</span>
        )}
        {helper && <FieldHelpPopover text={helper} />}
      </div>
      {children}
    </div>
  )
}

// Standalone inline hint button (for use outside of WizardField labels)
export function FieldHint({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      <FieldHelpPopover text={text} />
    </span>
  )
}

interface RedFlagFieldProps {
  label: string
  required?: boolean
  isEmpty: boolean
  whyImportant: string
  isoRef?: string
  howToFind: string
  impactIfMissing: "critical" | "high" | "medium" | "low"
  children: React.ReactNode
}

export function RedFlagField({
  label,
  required = false,
  isEmpty,
  whyImportant,
  isoRef,
  howToFind,
  impactIfMissing,
  children,
}: RedFlagFieldProps) {
  const t = useTranslations("redFlag")

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-sm font-medium text-charcoal">{label}</label>
        {required && (
          <span className="text-xs text-coral/70 font-medium">{t("required")}</span>
        )}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

interface DQISelectorProps {
  value: { reliability: number; completeness: number; temporal: number; geographic: number; technological: number }
  onChange: (v: { reliability: number; completeness: number; temporal: number; geographic: number; technological: number }) => void
}

export function DQISelector({ value, onChange }: DQISelectorProps) {
  const t = useTranslations("dqi")

  const dqiDimensions = [
    { key: "reliability" as const, label: t("reliability"), desc: t("reliabilityDesc") },
    { key: "completeness" as const, label: t("completeness"), desc: t("completenessDesc") },
    { key: "temporal" as const, label: t("temporal"), desc: t("temporalDesc") },
    { key: "geographic" as const, label: t("geographic"), desc: t("geographicDesc") },
    { key: "technological" as const, label: t("technological"), desc: t("technologicalDesc") },
  ]

  const dqiLabels = [
    "",
    t("scores.1"),
    t("scores.2"),
    t("scores.3"),
    t("scores.4"),
    t("scores.5"),
  ]

  return (
    <div className="bg-bone border border-sage-mist/20 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-parchment border-b border-sage-mist/20">
        <p className="text-xs font-semibold text-charcoal">{t("title")}</p>
        <p className="text-xs text-ink/40">{t("subtitle")}</p>
      </div>
      <div className="divide-y divide-sage-mist/10">
        {dqiDimensions.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-28 flex-shrink-0">
              <p className="text-xs font-medium text-charcoal">{label}</p>
              <p className="text-xs text-ink/40">{desc}</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => onChange({ ...value, [key]: score })}
                  title={dqiLabels[score]}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    value[key] === score
                      ? score >= 4
                        ? "bg-verified text-bone shadow-sm"
                        : score >= 3
                          ? "bg-amber-warn text-forest-deep shadow-sm"
                          : "bg-coral text-bone shadow-sm"
                      : "bg-sage-mist/20 text-ink/40 hover:bg-sage-mist/40"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <span className="text-xs text-ink/40 ml-1">{dqiLabels[value[key] ?? 0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
