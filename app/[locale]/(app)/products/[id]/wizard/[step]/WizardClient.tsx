"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Check,
  Target,
  Layers,
  Factory,
  Truck,
  Zap,
  Recycle,
  BarChart2,
  Search,
  Star,
  CheckSquare,
  Save,
} from "lucide-react"
import { Step1GoalScope } from "./steps/Step1GoalScope"
import { Step2RawMaterial } from "./steps/Step2RawMaterial"
import { Step3Production } from "./steps/Step3Production"
import { Step4Distribution } from "./steps/Step4Distribution"
import { Step5Use } from "./steps/Step5Use"
import { Step6EndOfLife } from "./steps/Step6EndOfLife"
import { Step7LCIA } from "./steps/Step7LCIA"
import { Step8Interpretation } from "./steps/Step8Interpretation"
import { Step9CriticalReview } from "./steps/Step9CriticalReview"
import { Step10Compliance } from "./steps/Step10Compliance"

const STEP_ICONS = [Target, Layers, Factory, Truck, Zap, Recycle, BarChart2, Search, Star, CheckSquare]
const STEP_PHASES = ["goal_scope", "raw_material", "production", "distribution", "use", "end_of_life", "lcia", "interpretation", "review", "compliance"]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WizardClient({ product, step }: { product: any; step: number }) {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const locale = params.locale as string
  const t = useTranslations("wizardNav")
  const tNav = useTranslations("nav")
  const ts = useTranslations("productDetail.wizardSteps")

  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({})
  const [direction, setDirection] = useState(1)

  const steps = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    label: ts(String(i + 1) as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"),
    icon: STEP_ICONS[i],
    phase: STEP_PHASES[i],
  }))

  const handleSave = useCallback(async () => {
    if (!formData || Object.keys(formData).length === 0) return
    setSaving(true)
    try {
      await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, data: formData }),
      })
      setLastSaved(new Date())
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }, [formData, id, step])

  useEffect(() => {
    const timer = setTimeout(handleSave, 1500)
    return () => clearTimeout(timer)
  }, [formData, handleSave])

  const handleNext = async () => {
    await handleSave()
    if (step < 10) {
      setDirection(1)
      router.push(`/${locale}/products/${id}/wizard/${step + 1}`)
    } else {
      router.push(`/${locale}/products/${id}/compliance`)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1)
      router.push(`/${locale}/products/${id}/wizard/${step - 1}`)
    } else {
      router.push(`/${locale}/products/${id}`)
    }
  }

  const currentStep = steps[step - 1]
  const completedSteps = new Set(
    steps
      .filter((s) => {
        if (s.phase === "goal_scope") return !!product.goalScope
        if (s.phase === "raw_material") return !!product.lci?.rawMaterial?.length
        if (s.phase === "production") return !!product.lci?.production
        if (s.phase === "distribution") return !!product.lci?.distribution?.length
        if (s.phase === "use") return !!product.lci?.use
        if (s.phase === "end_of_life") return !!product.lci?.endOfLife
        if (s.phase === "lcia") return !!product.lcia
        if (s.phase === "interpretation") return !!product.interpretation
        return false
      })
      .map((s) => s.id)
  )

  function formatTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 10) return t("savedNow")
    if (seconds < 60) return t("savedSeconds", { seconds })
    const minutes = Math.floor(seconds / 60)
    if (minutes === 1) return t("savedMinute")
    return t("savedMinutes", { minutes })
  }

  return (
    <div className="flex h-full -m-4 lg:-m-8">
      {/* Left sidebar */}
      <div className="hidden lg:flex flex-col w-72 bg-parchment border-r border-sage-mist/30 flex-shrink-0 overflow-y-auto">
        <div className="px-5 py-5 border-b border-sage-mist/20">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-moss transition-colors mb-2"
          >
            <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.5} />
            {tNav("dashboard")}
          </Link>
          <Link
            href={`/${locale}/products/${id}`}
            className="flex items-center gap-1.5 text-xs text-moss hover:text-forest-deep transition-colors mb-3"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
            {t("backToProduct")}
          </Link>
          <h2 className="text-sm font-semibold text-charcoal">{product.name}</h2>
          <p className="text-xs text-ink/40 mt-0.5">LCA Wizard — 10 steps</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Wizard steps">
          {steps.map(({ id: sid, label, icon: Icon }) => {
            const isActive = sid === step
            const isCompleted = completedSteps.has(sid)
            const isAccessible = sid <= step || isCompleted

            return (
              <Link
                key={sid}
                href={isAccessible ? `/${locale}/products/${id}/wizard/${sid}` : "#"}
                onClick={(e) => !isAccessible && e.preventDefault()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-forest-deep text-bone"
                    : isCompleted
                      ? "text-verified hover:bg-verified/5"
                      : isAccessible
                        ? "text-ink/60 hover:text-charcoal hover:bg-sage-mist/20"
                        : "text-ink/30 cursor-not-allowed"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? "bg-brass text-forest-deep"
                      : isCompleted
                        ? "bg-verified/20 text-verified"
                        : "bg-sage-mist/30 text-ink/40"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-3 h-3" strokeWidth={isActive ? 2 : 1.5} />
                  )}
                </div>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-ink/40">{t("progress")}</span>
            <span className="text-xs font-mono text-moss">{completedSteps.size}/10</span>
          </div>
          <div className="h-1.5 bg-sage-mist/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest-deep to-moss rounded-full transition-all duration-700"
              style={{ width: `${(completedSteps.size / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-bone border-b border-sage-mist/30 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 lg:hidden">
            {steps.map(({ id: sid }) => (
              <div
                key={sid}
                className={`rounded-full transition-all duration-300 ${
                  sid === step
                    ? "w-4 h-2 bg-brass"
                    : completedSteps.has(sid)
                      ? "w-2 h-2 bg-verified"
                      : "w-2 h-2 bg-sage-mist/30"
                }`}
              />
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-ink/40">{t("stepOf", { step })}</span>
            <span className="text-xs font-medium text-charcoal">{currentStep?.label}</span>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-ink/40">
            {saving ? (
              <span className="flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 animate-pulse text-moss" strokeWidth={1.5} />
                {t("saving")}
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-verified" strokeWidth={2} />
                {formatTimeAgo(lastSaved)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && <Step1GoalScope data={product.goalScope} onChange={setFormData} />}
              {step === 2 && <Step2RawMaterial data={product.lci?.rawMaterial} onChange={setFormData} />}
              {step === 3 && <Step3Production data={product.lci?.production} onChange={setFormData} />}
              {step === 4 && <Step4Distribution data={product.lci?.distribution} onChange={setFormData} />}
              {step === 5 && <Step5Use data={product.lci?.use} onChange={setFormData} />}
              {step === 6 && <Step6EndOfLife data={product.lci?.endOfLife} onChange={setFormData} />}
              {step === 7 && <Step7LCIA data={product.lcia} onChange={setFormData} />}
              {step === 8 && <Step8Interpretation data={product.interpretation} lcia={product.lcia} onChange={setFormData} />}
              {step === 9 && <Step9CriticalReview data={product.criticalReview} ambitionLevel={product.ambitionLevel} onChange={setFormData} />}
              {step === 10 && <Step10Compliance product={product} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-bone border-t border-sage-mist/30 px-4 py-3 flex items-center justify-between flex-shrink-0 gap-2">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-forest-deep active:text-forest-deep transition-colors py-2 px-1"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">{t("back")}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-moss hover:text-forest-deep transition-colors"
            >
              <Save className="w-4 h-4" strokeWidth={1.5} />
              {t("save")}
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-forest-deep text-bone hover:bg-moss active:bg-moss transition-colors duration-200 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-compass"
            >
              {step === 10 ? t("viewCompliance") : t("saveAndContinue")}
              <ChevronRight className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
