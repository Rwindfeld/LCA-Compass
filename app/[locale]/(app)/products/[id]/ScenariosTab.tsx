"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GitCompare,
  Plus,
  Trash2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
  Loader2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import {
  computeScenarioResult,
  parseModifiedData,
  getBaselineGwp,
  type ScenarioLever,
} from "@/lib/lca/scenario-engine"

type ScenarioRow = {
  id: string
  name: string
  description: string | null
  isBaseline: boolean
  modifiedData: string
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScenariosTab({ product, productId }: { product: any; productId: string }) {
  const t = useTranslations("productDetail.scenarios")
  const [scenarios, setScenarios] = useState<ScenarioRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [lever, setLever] = useState<ScenarioLever>("gwp_overall")
  const [percentChange, setPercentChange] = useState(0)
  const [assumptions, setAssumptions] = useState("")

  const baselineGwp = getBaselineGwp(product)
  const hasLcia = baselineGwp != null

  const loadScenarios = useCallback(async () => {
    setLoading(true)
    try {
      let res = await fetch(`/api/products/${productId}/scenarios`)
      if (!res.ok) throw new Error("load failed")
      let data = (await res.json()) as { scenarios: ScenarioRow[] }
      if (data.scenarios.length === 0 && hasLcia) {
        const initRes = await fetch(`/api/products/${productId}/scenarios`, { method: "PUT" })
        if (initRes.ok) {
          res = await fetch(`/api/products/${productId}/scenarios`)
          if (res.ok) data = await res.json()
        }
      }
      setScenarios(data.scenarios ?? [])
    } catch {
      setScenarios([])
    } finally {
      setLoading(false)
    }
  }, [productId, hasLcia])

  useEffect(() => {
    void loadScenarios()
  }, [loadScenarios])

  const computed = useMemo(() => {
    return scenarios.map((s) => {
      const modified = parseModifiedData(s.modifiedData)
      const result = computeScenarioResult(product, modified)
      return { scenario: s, modified, result }
    })
  }, [scenarios, product])

  const baseline = computed.find((c) => c.scenario.isBaseline) ?? computed[0]
  const maxGwp = Math.max(
    ...computed.map((c) => c.result.scenarioGwp ?? 0),
    baseline?.result.baselineGwp ?? 0,
    1
  )

  const createScenario = async (body: Record<string, unknown>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/products/${productId}/scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) return
      setShowForm(false)
      setName("")
      setDescription("")
      setPercentChange(0)
      setAssumptions("")
      await loadScenarios()
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = () => {
    if (!name.trim()) return
    void createScenario({
      name: name.trim(),
      description: description.trim() || undefined,
      lever,
      percentChange,
      assumptions: assumptions.trim() || undefined,
    })
  }

  const handleTemplate = (templateId: string) => {
    void createScenario({ fromTemplate: templateId })
  }

  const handleDelete = async (scenarioId: string) => {
    const res = await fetch(`/api/products/${productId}/scenarios/${scenarioId}`, {
      method: "DELETE",
    })
    if (res.ok) await loadScenarios()
  }

  const levers: ScenarioLever[] = [
    "gwp_overall",
    "transport",
    "use_energy",
    "recycled_eol",
  ]

  const templates = [
    { id: "green_electricity", icon: TrendingDown },
    { id: "shorter_transport", icon: TrendingDown },
    { id: "high_recycling", icon: TrendingDown },
    { id: "pessimistic", icon: TrendingUp },
  ] as const

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-ink/40">
        <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.5} />
      </div>
    )
  }

  if (!hasLcia) {
    return (
      <div className="bg-parchment border border-sage-mist/30 rounded-xl p-8 shadow-compass text-center">
        <GitCompare className="w-10 h-10 text-sage-mist mx-auto mb-3" strokeWidth={0.75} />
        <h3 className="text-base font-semibold text-charcoal mb-2">{t("needLciaTitle")}</h3>
        <p className="text-sm text-ink/50 max-w-md mx-auto">{t("needLciaDesc")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-charcoal">{t("title")}</h3>
          <p className="text-sm text-ink/50 mt-1 max-w-xl">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-forest-deep text-bone px-4 py-2 rounded-lg text-sm font-medium hover:bg-moss transition-colors shadow-compass"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          {t("newScenario")}
        </button>
      </div>

      {/* Quick templates */}
      <div>
        <p className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">
          {t("templates")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              disabled={saving}
              onClick={() => handleTemplate(id)}
              className="text-left bg-parchment border border-sage-mist/30 rounded-xl p-4 hover:border-moss/40 hover:shadow-compass transition-all disabled:opacity-50"
            >
              <Icon className="w-4 h-4 text-moss mb-2" strokeWidth={1.5} />
              <p className="text-sm font-medium text-charcoal">{t(`template.${id}.name`)}</p>
              <p className="text-xs text-ink/45 mt-1">{t(`template.${id}.desc`)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-parchment border border-brass/30 rounded-xl p-5 shadow-compass space-y-4">
              <h4 className="text-sm font-semibold text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brass" strokeWidth={1.5} />
                {t("createTitle")}
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="text-xs text-ink/50 mb-1 block">{t("nameLabel")}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bone border border-sage-mist/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
                    placeholder={t("namePlaceholder")}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs text-ink/50 mb-1 block">{t("descLabel")}</span>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-bone border border-sage-mist/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-brass"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-ink/50 mb-1 block">{t("leverLabel")}</span>
                  <select
                    value={lever}
                    onChange={(e) => setLever(e.target.value as ScenarioLever)}
                    className="w-full bg-bone border border-sage-mist/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-brass cursor-pointer"
                  >
                    {levers.map((l) => (
                      <option key={l} value={l}>
                        {t(`lever.${l}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-ink/50 mb-1 block">
                    {t("percentLabel")}: {percentChange > 0 ? "+" : ""}
                    {percentChange}%
                  </span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={percentChange}
                    onChange={(e) => setPercentChange(Number(e.target.value))}
                    className="w-full accent-forest-deep"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs text-ink/50 mb-1 block">{t("assumptionsLabel")}</span>
                  <textarea
                    value={assumptions}
                    onChange={(e) => setAssumptions(e.target.value)}
                    rows={2}
                    className="w-full bg-bone border border-sage-mist/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-brass resize-none"
                  />
                </label>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-ink/60 hover:text-charcoal"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  disabled={saving || !name.trim()}
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 bg-forest-deep text-bone px-4 py-2 rounded-lg text-sm font-medium hover:bg-moss disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("save")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison chart */}
      {computed.length > 0 && (
        <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass">
          <h4 className="text-sm font-semibold text-charcoal mb-4">{t("comparisonTitle")}</h4>
          <div className="space-y-3">
            {computed.map(({ scenario, result }) => {
              const gwp = result.scenarioGwp ?? result.baselineGwp ?? 0
              const widthPct = Math.max(4, (gwp / maxGwp) * 100)
              const delta = result.deltaPercent

              return (
                <div key={scenario.id} className="group">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-charcoal truncate">
                        {scenario.name}
                      </span>
                      {scenario.isBaseline && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-moss/10 text-moss border border-moss/20 flex-shrink-0">
                          {t("baseline")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-mono text-charcoal">{gwp} kg</span>
                      {!scenario.isBaseline && delta != null && (
                        <span
                          className={`text-xs font-mono flex items-center gap-0.5 ${
                            delta < 0 ? "text-verified" : delta > 0 ? "text-coral" : "text-ink/40"
                          }`}
                        >
                          {delta < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : delta > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          {delta > 0 ? "+" : ""}
                          {delta}%
                        </span>
                      )}
                      {!scenario.isBaseline && (
                        <button
                          type="button"
                          onClick={() => handleDelete(scenario.id)}
                          className="p-1 rounded text-ink/30 hover:text-coral opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={t("delete")}
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-sage-mist/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        scenario.isBaseline
                          ? "bg-gradient-to-r from-forest-deep to-moss"
                          : delta != null && delta < 0
                            ? "bg-verified"
                            : delta != null && delta > 0
                              ? "bg-coral/80"
                              : "bg-brass/70"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  {scenario.description && (
                    <p className="text-xs text-ink/45 mt-1">{scenario.description}</p>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-ink/40 mt-4">{t("comparisonNote")}</p>
        </div>
      )}

      {/* Detail cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {computed
          .filter((c) => !c.scenario.isBaseline)
          .map(({ scenario, modified, result }) => (
            <article
              key={scenario.id}
              className="bg-bone border border-sage-mist/25 rounded-xl p-4"
            >
              <h5 className="text-sm font-semibold text-charcoal">{scenario.name}</h5>
              <p className="text-xs text-ink/50 mt-1">{t(`lever.${modified.lever}`)}</p>
              {modified.assumptions && (
                <p className="text-xs text-ink/60 mt-2 leading-relaxed">{modified.assumptions}</p>
              )}
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-ink/40">{t("gwpResult")}</dt>
                  <dd className="font-mono font-semibold text-charcoal">
                    {result.scenarioGwp ?? "—"} kg CO₂-eq
                  </dd>
                </div>
                <div>
                  <dt className="text-ink/40">{t("vsBaseline")}</dt>
                  <dd
                    className={`font-mono font-semibold ${
                      (result.deltaKg ?? 0) < 0
                        ? "text-verified"
                        : (result.deltaKg ?? 0) > 0
                          ? "text-coral"
                          : "text-charcoal"
                    }`}
                  >
                    {result.deltaKg != null
                      ? `${result.deltaKg > 0 ? "+" : ""}${result.deltaKg} kg`
                      : "—"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
      </div>
    </div>
  )
}
