"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ComplianceScoreRing } from "@/components/ComplianceScoreRing"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import {
  LayoutDashboard,
  Compass,
  CheckSquare,
  FileText,
  Download,
  GitCompare,
  Star,
  Edit3,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Check,
  X,
  Trash2,
  Loader2,
} from "lucide-react"
import {
  calcComplianceScore,
  ISO_CHECKLIST,
  checkItemStatus,
} from "@/lib/lca/compliance-check"
import { ScenariosTab } from "./ScenariosTab"
import { ProductMembersPanel } from "@/components/products/ProductMembersPanel"

const statusColors: Record<string, string> = {
  DRAFT: "bg-ink/10 text-ink/60",
  IN_PROGRESS: "bg-amber-warn/10 text-amber-warn border border-amber-warn/20",
  EPD_READY: "bg-brass/10 text-brass border border-brass/20",
  PUBLISHED: "bg-verified/10 text-verified border border-verified/20",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function detectMissingFields(product: any): { label: string; step: number; impact: "high" | "medium" | "low" }[] {
  return ISO_CHECKLIST
    .filter((item) => checkItemStatus(product, item.field) === "missing")
    .map((item) => ({ label: item.label, step: item.wizardStep, impact: item.impact }))
    .slice(0, 5)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductDetailClient({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const params = useParams()
  const id = params.id as string
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("productDetail")
  const tp = useTranslations("products")

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push(`/${locale}/products`)
        router.refresh()
      }
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const lp = (path: string) => `/${locale}${path}`

  const tabs = [
    { id: "overview", label: t("tabs.overview"), icon: LayoutDashboard },
    { id: "wizard", label: t("tabs.wizard"), icon: Compass },
    { id: "compliance", label: t("tabs.compliance"), icon: CheckSquare },
    { id: "report", label: t("tabs.report"), icon: FileText },
    { id: "export", label: t("tabs.export"), icon: Download },
    { id: "scenarios", label: t("tabs.scenarios"), icon: GitCompare },
    { id: "review", label: t("tabs.review"), icon: Star },
  ]

  const statusLabels: Record<string, string> = {
    DRAFT: tp("status.DRAFT"),
    IN_PROGRESS: tp("status.IN_PROGRESS"),
    EPD_READY: tp("status.EPD_READY"),
    PUBLISHED: tp("status.PUBLISHED"),
  }

  const ambitionLabels: Record<string, string> = {
    SCREENING: tp("ambition.SCREENING"),
    DETAILED: tp("ambition.DETAILED"),
    CRITICAL_REVIEWED: tp("ambition.CRITICAL_REVIEWED"),
    EPD_VERIFIED: tp("ambition.EPD_VERIFIED"),
  }

  const missingFields = detectMissingFields(product)
  // Always calculate compliance live so it matches the ComplianceClient page
  const liveScore = calcComplianceScore(product)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-xs text-ink/40 mb-1">
            <Link href={lp("/products")} className="hover:text-moss transition-colors">
              {t("backToProducts")}
            </Link>
            <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-charcoal/60">{product.name}</span>
          </div>
          <ProductNameEditor
            productId={id}
            initialName={product.name}
            locale={locale}
          />
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[product.status] ?? "bg-ink/10 text-ink/60"}`}>
              {statusLabels[product.status] ?? product.status}
            </span>
            <span className="text-xs text-ink/40">·</span>
            <span className="text-xs text-ink/50">{ambitionLabels[product.ambitionLevel] ?? product.ambitionLevel}</span>
            <span className="text-xs text-ink/40">·</span>
            <span className="text-xs font-mono text-moss">{liveScore}% compliance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 rounded-lg text-ink/30 hover:text-coral hover:bg-coral/10 active:bg-coral/10 transition-all"
            title="Slet produkt"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <Link
            href={lp(`/products/${id}/export`)}
            className="inline-flex items-center gap-1.5 bg-transparent border border-forest-deep text-forest-deep hover:bg-forest-deep hover:text-bone active:bg-forest-deep active:text-bone transition-all duration-200 px-3 py-2 rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="hidden sm:inline">{t("exportPdf")}</span>
          </Link>
          <Link
            href={lp(`/products/${id}/wizard/1`)}
            className="inline-flex items-center gap-1.5 bg-forest-deep text-bone hover:bg-moss active:bg-moss transition-colors duration-200 px-4 py-2 rounded-lg text-sm font-medium shadow-compass"
          >
            <Edit3 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            {t("edit")}
          </Link>
        </div>
      </motion.div>

      {/* Tabs — scrollable på mobil med fade-hint */}
      <div className="relative border-b border-sage-mist/30">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-0 min-w-max">
            {tabs.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === tabId
                    ? "border-brass text-forest-deep"
                    : "border-transparent text-ink/50 hover:text-charcoal hover:border-sage-mist"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>
        {/* Fade-hint → indikerer at der er mere at scrolle */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bone to-transparent sm:hidden" />
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && (
          <OverviewTab product={product} missingFields={missingFields} id={id} locale={locale} />
        )}
        {activeTab === "wizard" && <WizardTab id={id} locale={locale} />}
        {activeTab === "compliance" && <ComplianceTab product={product} id={id} locale={locale} score={liveScore} />}
        {activeTab === "report" && <ReportTab id={id} locale={locale} />}
        {activeTab === "export" && <ExportTab id={id} locale={locale} />}
        {activeTab === "scenarios" && <ScenariosTab product={product} productId={id} />}
        {activeTab === "review" && <ReviewTab product={product} />}
      </motion.div>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-parchment rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-sage-mist/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-coral/10">
                  <Trash2 className="w-5 h-5 text-coral" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-charcoal">Slet produkt</h3>
                  <p className="text-xs text-ink/50">Denne handling kan ikke fortrydes</p>
                </div>
              </div>
              <p className="text-sm text-ink/70 mb-6">
                Er du sikker på, at du vil slette <span className="font-semibold text-charcoal">{product.name}</span>? Alle data, LCA-beregninger og rapporter tilknyttet dette produkt vil blive permanent slettet.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-sage-mist/40 text-sm text-ink/70 hover:bg-sage-mist/10 transition-colors disabled:opacity-40"
                >
                  Annuller
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-coral text-white text-sm font-medium hover:bg-coral/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sletter…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      Slet produkt
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Inline product name editor
function ProductNameEditor({ productId, initialName, locale }: { productId: string; initialName: string; locale: string }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "name", data: { name } }),
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false) }}
          className="text-2xl font-display font-bold text-charcoal bg-bone border border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-3 py-1 outline-none"
        />
        <button onClick={save} disabled={saving}
          className="p-1.5 rounded-lg bg-verified/10 text-verified hover:bg-verified/20 transition-colors">
          <Check className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button onClick={() => { setEditing(false); setName(initialName) }}
          className="p-1.5 rounded-lg bg-ink/5 text-ink/40 hover:bg-ink/10 transition-colors">
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex items-center gap-2 text-left mt-1 hover:opacity-80 transition-opacity"
      title="Click to rename"
    >
      <h1 className="text-2xl font-display font-bold text-charcoal">{name}</h1>
      <Edit3 className="w-4 h-4 text-ink/20 group-hover:text-moss transition-colors flex-shrink-0" strokeWidth={1.5} />
    </button>
  )
}

function OverviewTab({
  product, missingFields, id, locale,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any; missingFields: { label: string; step: number; impact: "high" | "medium" | "low" }[]; id: string; locale: string
}) {
  const t = useTranslations("productDetail.overview")
  const tph = useTranslations("productDetail.phases")
  const goalScope = product.goalScope
  const lcia = product.lcia
  const interpretation = product.interpretation
  const lp = (path: string) => `/${locale}${path}`

  const phases = [
    { key: "raw_material" as const, filled: product.lci?.rawMaterial?.length > 0, percent: product.lci?.rawMaterial?.length > 0 ? 85 : 0 },
    { key: "production" as const, filled: !!product.lci?.production, percent: product.lci?.production ? 70 : 0 },
    { key: "distribution" as const, filled: product.lci?.distribution?.length > 0, percent: product.lci?.distribution?.length > 0 ? 90 : 0 },
    { key: "use" as const, filled: !!product.lci?.use, percent: product.lci?.use ? 80 : 0 },
    { key: "end_of_life" as const, filled: !!product.lci?.endOfLife, percent: product.lci?.endOfLife ? 65 : 0 },
  ]

  const hotspots = interpretation?.hotspots ?? []

  const impactColor = {
    high: "bg-coral/10 text-coral border border-coral/20",
    medium: "bg-amber-warn/10 text-amber-warn border border-amber-warn/20",
    low: "bg-ink/5 text-ink/40 border border-ink/10",
  }

  return (
    <div className="space-y-6">
      <ProductMembersPanel productId={id} />

      <div className="grid md:grid-cols-3 gap-5">
        {/* Goal & Scope */}
        <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-charcoal">{t("goalScope")}</h3>
            <Link href={lp(`/products/${id}/wizard/1`)} className="text-xs text-moss hover:text-forest-deep transition-colors">
              {t("editLink")}
            </Link>
          </div>
          {goalScope ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-ink/40 mb-0.5">{t("functionalUnit")}</p>
                <p className="text-xs text-charcoal font-medium leading-relaxed">{goalScope.functionalUnit?.text ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-ink/40 mb-0.5">{t("systemBoundaries")}</p>
                <p className="text-xs text-charcoal">{goalScope.systemBoundaries ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-ink/40 mb-0.5">{t("geographicScope")}</p>
                <p className="text-xs text-charcoal">{goalScope.geographicScope ?? "—"}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink/40">{t("notFilledYet")}</p>
          )}
        </div>

        {/* Phase progress */}
        <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass">
          <h3 className="text-sm font-semibold text-charcoal mb-4">{t("phaseProgress")}</h3>
          <div className="space-y-3">
            {phases.map(({ key, filled, percent }) => (
              <Link key={key} href={lp(`/products/${id}/wizard/${["raw_material","production","distribution","use","end_of_life"].indexOf(key) + 2}`)}>
                <div className="flex items-center justify-between mb-1 hover:opacity-80 transition-opacity cursor-pointer">
                  <span className="text-xs text-charcoal">{tph(key)}</span>
                  <span className={`text-xs font-mono ${filled ? "text-verified" : "text-coral"}`}>{percent}%</span>
                </div>
                <div className="h-1.5 bg-sage-mist/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${filled ? "bg-gradient-to-r from-forest-deep to-moss" : "bg-sage-mist/30"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* LCIA summary */}
        <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass">
          <h3 className="text-sm font-semibold text-charcoal mb-4">{t("lciaResults")}</h3>
          {lcia?.results ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-bone rounded-lg border border-sage-mist/20">
                <div>
                  <p className="text-xs text-ink/40">{t("gwp")}</p>
                  <p className="text-xl font-bold font-mono text-charcoal mt-0.5">{lcia.results.gwp_kg_co2}</p>
                </div>
                <span className="text-xs text-moss bg-moss/10 px-2 py-1 rounded">kg CO₂-eq</span>
              </div>
              <div className="text-xs text-ink/50">
                <span className="font-medium text-charcoal">Method:</span> {lcia.method}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-ink/40 mb-3">{t("lciaNotConfigured")}</p>
              <Link href={lp(`/products/${id}/wizard/7`)}
                className="text-xs text-moss hover:text-forest-deep font-medium flex items-center gap-1 transition-colors">
                Configure LCIA → <ArrowRight className="w-3 h-3" strokeWidth={2} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Hotspots */}
      {hotspots.length > 0 && (
        <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass">
          <h3 className="text-sm font-semibold text-charcoal mb-4">
            <TrendingUp className="inline w-4 h-4 text-coral mr-1.5" strokeWidth={1.5} />
            {t("hotspots")}
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {hotspots.slice(0, 3).map((h: { phase: string; contribution: number; driver?: string }, i: number) => (
              <div key={i} className="bg-bone rounded-lg p-3 border border-sage-mist/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-charcoal capitalize">{h.phase.replace(/_/g, " ")}</span>
                  <span className="text-sm font-bold font-mono text-coral">{h.contribution}%</span>
                </div>
                <p className="text-xs text-ink/50 leading-relaxed">{h.driver}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing fields — clickable links to wizard steps */}
      {missingFields.length > 0 && (
        <div className="bg-coral/5 border border-coral/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-coral mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
            {t("missingFields", { count: missingFields.length })}
          </h3>
          <div className="space-y-2">
            {missingFields.map((field, i) => (
              <Link
                key={i}
                href={lp(`/products/${id}/wizard/${field.step}`)}
                className="flex items-center justify-between gap-3 bg-bone rounded-lg p-3 border border-coral/10 hover:border-coral/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${impactColor[field.impact]}`}>
                    {field.step}
                  </div>
                  <p className="text-xs text-charcoal font-medium truncate">{field.label}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${impactColor[field.impact]}`}>
                    {field.impact}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-coral/40 group-hover:text-coral group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Next step CTA */}
      <div className="bg-forest-deep rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-bone">{t("nextStep")}</p>
          <p className="text-xs text-sage-mist/70 mt-0.5">{t("continueWizard")}</p>
        </div>
        <Link
          href={lp(`/products/${id}/wizard/1`)}
          className="inline-flex items-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 transition-colors px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0"
        >
          {t("continueWizardBtn")}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}

function WizardTab({ id, locale }: { id: string; locale: string }) {
  const t = useTranslations("productDetail.wizardSteps")
  const lp = (path: string) => `/${locale}${path}`

  const wizardSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => ({
    step,
    label: t(String(step) as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10"),
    completed: step <= 7,
  }))

  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass">
      <h3 className="text-base font-semibold text-charcoal mb-6">10-step LCA Wizard</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {wizardSteps.map(({ step, label, completed }) => (
          <Link
            key={step}
            href={lp(`/products/${id}/wizard/${step}`)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 group hover:shadow-compass ${
              completed ? "bg-verified/5 border-verified/20 hover:border-verified/40" : "bg-bone border-sage-mist/30 hover:border-brass"
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${completed ? "bg-verified/20 text-verified" : "bg-sage-mist/20 text-ink/40"}`}>
              {step}
            </span>
            <span className="text-sm font-medium text-charcoal">{label}</span>
            {!completed && (
              <ArrowRight className="w-4 h-4 text-ink/20 ml-auto group-hover:text-moss group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
            )}
            {completed && <span className="ml-auto text-xs text-verified">✓</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ComplianceTab({ product, id, locale, score }: { product: any; id: string; locale: string; score: number }) {
  const t = useTranslations("productDetail.overview")
  const lp = (path: string) => `/${locale}${path}`
  const fulfilled = ISO_CHECKLIST.filter(
    (item) => checkItemStatus(product, item.field) === "fulfilled"
  ).length

  return (
    <div className="space-y-5">
      <div className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass text-center">
        <p className="text-xs text-ink/40 uppercase tracking-widest mb-2">ISO 14044 Compliance Score</p>
        <div className="relative inline-flex items-center justify-center mb-2">
          <ComplianceScoreRing score={score} size={120} strokeWidth={8} />
          <div className="absolute text-center">
            <span className="text-3xl font-bold font-mono text-charcoal">{score}</span>
            <span className="text-sm text-moss block">%</span>
          </div>
        </div>
        <p className="text-sm text-ink/60">
          {score >= 90 ? t("complianceReady") : score >= 70 ? t("complianceGood") : t("complianceLow")}
        </p>
      </div>

      <Link
        href={lp(`/products/${id}/compliance`)}
        className="flex items-center justify-between bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass hover:shadow-compass-lg transition-all group"
      >
        <div>
          <p className="text-sm font-semibold text-charcoal">{t("viewChecklist")}</p>
          <p className="text-xs text-ink/50 mt-0.5">
            {t("checklistMeta", { total: ISO_CHECKLIST.length, fulfilled })}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-moss group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
      </Link>
    </div>
  )
}

function ReportTab({ id, locale }: { id: string; locale: string }) {
  const t = useTranslations("productDetail.overview")
  const lp = (path: string) => `/${locale}${path}`
  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass text-center">
      <FileText className="w-10 h-10 text-sage-mist mx-auto mb-3" strokeWidth={0.75} />
      <h3 className="text-base font-semibold text-charcoal mb-2">{t("reportTitle")}</h3>
      <p className="text-sm text-ink/50 mb-4">{t("reportDesc")}</p>
      <Link href={lp(`/products/${id}/report`)}
        className="inline-flex items-center gap-2 bg-forest-deep text-bone px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-moss transition-colors">
        {t("openReport")}
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
      </Link>
    </div>
  )
}

function ExportTab({ id, locale }: { id: string; locale: string }) {
  const t = useTranslations("productDetail.overview")
  const lp = (path: string) => `/${locale}${path}`
  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass text-center">
      <Download className="w-10 h-10 text-sage-mist mx-auto mb-3" strokeWidth={0.75} />
      <h3 className="text-base font-semibold text-charcoal mb-2">{t("exportTitle")}</h3>
      <p className="text-sm text-ink/50 mb-4">{t("exportDesc")}</p>
      <Link href={lp(`/products/${id}/export`)}
        className="inline-flex items-center gap-2 bg-brass text-forest-deep px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brass/90 transition-colors shadow-brass-glow">
        {t("goToExport")}
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
      </Link>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReviewTab({ product }: { product: any }) {
  const t = useTranslations("productDetail.overview")
  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass">
      <h3 className="text-base font-semibold text-charcoal mb-2">Critical Review</h3>
      <p className="text-sm text-ink/50">
        {product.ambitionLevel === "SCREENING" || product.ambitionLevel === "DETAILED"
          ? t("reviewNote")
          : t("configureReview")}
      </p>
    </div>
  )
}
