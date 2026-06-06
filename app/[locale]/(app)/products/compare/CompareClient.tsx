"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { motion } from "framer-motion"
import {
  GitCompare,
  ArrowLeftRight,
  ArrowRight,
  Check,
  X,
  ExternalLink,
} from "lucide-react"
import { ComplianceScoreRing } from "@/components/ComplianceScoreRing"
import {
  buildProductCompareSnapshot,
  formatGwpDelta,
  type PhaseKey,
  type ProductCompareSnapshot,
} from "@/lib/products/product-compare"
import type { ParsedProduct } from "@/lib/products/parse-product"

type CompareClientProps = {
  products: ParsedProduct[]
  initialA?: string
  initialB?: string
}

type CompareRow = {
  key: string
  label: string
  a: string
  b: string
  highlight?: "a" | "b" | "neutral"
}

function findInitial(
  products: ParsedProduct[],
  id: string | undefined,
  excludeId?: string
): string {
  if (!id) return ""
  const exists = products.some((p) => p.id === id && p.id !== excludeId)
  return exists ? id : ""
}

export function CompareClient({ products, initialA, initialB }: CompareClientProps) {
  const t = useTranslations("products.compare")
  const tp = useTranslations("products")
  const tph = useTranslations("productDetail.phases")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const snapshots = useMemo(
    () => products.map(buildProductCompareSnapshot),
    [products]
  )

  const [idA, setIdA] = useState(() => {
    const fromUrl = findInitial(products, initialA)
    if (fromUrl) return fromUrl
    return products[0]?.id ?? ""
  })
  const [idB, setIdB] = useState(() => {
    const fromUrl = findInitial(products, initialB, initialA)
    if (fromUrl) return fromUrl
    const exclude = findInitial(products, initialA) || products[0]?.id
    return products.find((p) => p.id !== exclude)?.id ?? ""
  })

  const syncUrl = useCallback(
    (a: string, b: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (a) params.set("a", a)
      else params.delete("a")
      if (b) params.set("b", b)
      else params.delete("b")
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const handleSelectA = (value: string) => {
    setIdA(value)
    let nextB = idB
    if (value && value === idB) {
      const other = products.find((p) => p.id !== value)
      nextB = other?.id ?? ""
      setIdB(nextB)
    }
    syncUrl(value, nextB)
  }

  const handleSelectB = (value: string) => {
    if (value && value === idA) return
    setIdB(value)
    syncUrl(idA, value)
  }

  const swap = () => {
    setIdA(idB)
    setIdB(idA)
    syncUrl(idB, idA)
  }

  const snapA = snapshots.find((s) => s.id === idA)
  const snapB = snapshots.find((s) => s.id === idB)
  const ready = !!snapA && !!snapB && snapA.id !== snapB.id

  const gwpDelta = ready ? formatGwpDelta(snapA!.gwpKgCo2, snapB!.gwpKgCo2) : null
  const complianceDelta = ready ? snapB!.complianceScore - snapA!.complianceScore : null

  const rows: CompareRow[] = useMemo(() => {
    if (!ready || !snapA || !snapB) return []

    const fmt = (v: string | null) => v ?? t("notSet")
    const fmtBool = (v: boolean) => (v ? t("yes") : t("no"))
    const status = (s: string) => tp(`status.${s}` as "status.DRAFT")
    const type = (s: string) => tp(`type.${s}` as "type.OTHER")
    const ambition = (s: string) => tp(`ambition.${s}` as "ambition.SCREENING")

    const phaseRows: CompareRow[] = (
      ["raw_material", "production", "distribution", "use", "end_of_life"] as PhaseKey[]
    ).map((key) => ({
      key: `phase_${key}`,
      label: tph(key),
      a: fmtBool(snapA.phases[key]),
      b: fmtBool(snapB.phases[key]),
      highlight:
        snapA.phases[key] === snapB.phases[key]
          ? "neutral"
          : snapA.phases[key]
            ? "a"
            : "b",
    }))

    const checklistA = `${snapA.checklistFulfilled}/${snapA.checklistTotal}`
    const checklistB = `${snapB.checklistFulfilled}/${snapB.checklistTotal}`

    return [
      {
        key: "type",
        label: t("rows.type"),
        a: type(snapA.productType),
        b: type(snapB.productType),
      },
      {
        key: "status",
        label: t("rows.status"),
        a: status(snapA.status),
        b: status(snapB.status),
      },
      {
        key: "ambition",
        label: t("rows.ambition"),
        a: ambition(snapA.ambitionLevel),
        b: ambition(snapB.ambitionLevel),
      },
      {
        key: "compliance",
        label: t("rows.compliance"),
        a: `${snapA.complianceScore}%`,
        b: `${snapB.complianceScore}%`,
        highlight:
          snapA.complianceScore === snapB.complianceScore
            ? "neutral"
            : snapA.complianceScore > snapB.complianceScore
              ? "a"
              : "b",
      },
      {
        key: "checklist",
        label: t("rows.checklist"),
        a: checklistA,
        b: checklistB,
        highlight:
          snapA.checklistFulfilled === snapB.checklistFulfilled
            ? "neutral"
            : snapA.checklistFulfilled > snapB.checklistFulfilled
              ? "a"
              : "b",
      },
      {
        key: "functionalUnit",
        label: t("rows.functionalUnit"),
        a: fmt(snapA.functionalUnit),
        b: fmt(snapB.functionalUnit),
      },
      {
        key: "systemBoundaries",
        label: t("rows.systemBoundaries"),
        a: fmt(snapA.systemBoundaries),
        b: fmt(snapB.systemBoundaries),
      },
      {
        key: "geographicScope",
        label: t("rows.geographicScope"),
        a: fmt(snapA.geographicScope),
        b: fmt(snapB.geographicScope),
      },
      {
        key: "lciaMethod",
        label: t("rows.lciaMethod"),
        a: fmt(snapA.lciaMethod),
        b: fmt(snapB.lciaMethod),
      },
      {
        key: "gwp",
        label: t("rows.gwp"),
        a: snapA.gwpKgCo2 != null ? `${snapA.gwpKgCo2} kg CO₂-eq` : t("notSet"),
        b: snapB.gwpKgCo2 != null ? `${snapB.gwpKgCo2} kg CO₂-eq` : t("notSet"),
        highlight:
          snapA.gwpKgCo2 == null || snapB.gwpKgCo2 == null
            ? "neutral"
            : snapA.gwpKgCo2 === snapB.gwpKgCo2
              ? "neutral"
              : snapA.gwpKgCo2 < snapB.gwpKgCo2
                ? "a"
                : "b",
      },
      {
        key: "ewaste",
        label: t("rows.eWaste"),
        a: snapA.eWasteKg != null ? `${snapA.eWasteKg} kg` : t("notSet"),
        b: snapB.eWasteKg != null ? `${snapB.eWasteKg} kg` : t("notSet"),
        highlight:
          snapA.eWasteKg == null || snapB.eWasteKg == null
            ? "neutral"
            : snapA.eWasteKg === snapB.eWasteKg
              ? "neutral"
              : snapA.eWasteKg < snapB.eWasteKg
                ? "a"
                : "b",
      },
      ...phaseRows,
      {
        key: "updated",
        label: t("rows.updated"),
        a: formatDate(snapA.updatedAt, locale),
        b: formatDate(snapB.updatedAt, locale),
      },
    ]
  }, [ready, snapA, snapB, t, tp, tph, locale])

  const lp = (path: string) => `/${locale}${path}`

  if (products.length < 2) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <GitCompare className="w-12 h-12 text-sage-mist mx-auto mb-4" strokeWidth={0.75} />
        <h1 className="text-xl font-display font-bold text-charcoal mb-2">{t("title")}</h1>
        <p className="text-sm text-ink/50 mb-6">{t("needMoreProducts")}</p>
        <Link
          href={lp("/products/new")}
          className="inline-flex items-center gap-2 bg-forest-deep text-bone px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-moss transition-colors"
        >
          {tp("new")}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-charcoal flex items-center gap-2">
              <GitCompare className="w-7 h-7 text-brass" strokeWidth={1.5} />
              {t("title")}
            </h1>
            <p className="text-sm text-ink/60 mt-1">{t("subtitle")}</p>
          </div>
          <Link
            href={lp("/products")}
            className="text-sm text-moss hover:text-forest-deep font-medium transition-colors"
          >
            {t("backToProducts")}
          </Link>
        </div>
      </motion.div>

      {/* Pickers */}
      <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <ProductPicker
            label={t("productA")}
            value={idA}
            products={products}
            excludeId={idB}
            onChange={handleSelectA}
          />
          <button
            type="button"
            onClick={swap}
            disabled={!idA || !idB}
            className="flex items-center justify-center w-11 h-11 rounded-lg border border-sage-mist/40 bg-bone text-moss hover:bg-parchment hover:border-moss/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mx-auto"
            aria-label={t("swap")}
            title={t("swap")}
          >
            <ArrowLeftRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <ProductPicker
            label={t("productB")}
            value={idB}
            products={products}
            excludeId={idA}
            onChange={handleSelectB}
          />
        </div>
        {idA && idB && idA === idB && (
          <p className="text-xs text-coral mt-3">{t("sameProduct")}</p>
        )}
      </div>

      {!ready ? (
        <div className="bg-parchment border border-dashed border-sage-mist/50 rounded-xl p-12 text-center">
          <p className="text-sm text-ink/50">{t("pickTwo")}</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <SummaryCard
              snapshot={snapA!}
              label={t("productA")}
              locale={locale}
              ringLabel={t("complianceLabel")}
            />
            <SummaryCard
              snapshot={snapB!}
              label={t("productB")}
              locale={locale}
              ringLabel={t("complianceLabel")}
            />
          </div>

          {(gwpDelta != null || complianceDelta != null) && (
            <div className="bg-forest-deep/5 border border-moss/20 rounded-xl px-5 py-4 flex flex-wrap gap-6 text-sm">
              <span className="font-semibold text-charcoal">{t("deltaTitle")}</span>
              {gwpDelta != null && (
                <span className="text-ink/70">
                  {t("gwpDelta")}:{" "}
                  <strong className={gwpDelta > 0 ? "text-coral" : gwpDelta < 0 ? "text-verified" : "text-charcoal"}>
                    {gwpDelta > 0 ? "+" : ""}
                    {gwpDelta.toFixed(2)} kg CO₂-eq
                  </strong>
                  <span className="text-xs text-ink/40 ml-1">({t("gwpDeltaHint")})</span>
                </span>
              )}
              {complianceDelta != null && complianceDelta !== 0 && (
                <span className="text-ink/70">
                  {t("complianceDelta")}:{" "}
                  <strong className={complianceDelta > 0 ? "text-verified" : "text-coral"}>
                    {complianceDelta > 0 ? "+" : ""}
                    {complianceDelta}%
                  </strong>
                </span>
              )}
            </div>
          )}

          {/* Comparison table */}
          <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-mist/30 bg-bone/60">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide w-[28%]">
                      {t("metric")}
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-forest-deep uppercase tracking-wide w-[36%]">
                      {snapA!.name}
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-moss uppercase tracking-wide w-[36%]">
                      {snapB!.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.key}
                      className={`border-b border-sage-mist/15 last:border-0 ${
                        i % 2 === 0 ? "bg-bone/30" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 text-xs font-medium text-ink/60 align-top">
                        {row.label}
                      </td>
                      <td className={`px-5 py-3.5 align-top ${cellHighlight(row.highlight, "a")}`}>
                        <CellValue value={row.a} kind={row.key.startsWith("phase_") ? "phase" : "text"} />
                      </td>
                      <td className={`px-5 py-3.5 align-top ${cellHighlight(row.highlight, "b")}`}>
                        <CellValue value={row.b} kind={row.key.startsWith("phase_") ? "phase" : "text"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <Link
              href={lp(`/products/${snapA!.id}`)}
              className="inline-flex items-center gap-1.5 text-sm text-moss hover:text-forest-deep font-medium transition-colors"
            >
              {t("openProduct", { name: snapA!.name })} <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={lp(`/products/${snapB!.id}`)}
              className="inline-flex items-center gap-1.5 text-sm text-moss hover:text-forest-deep font-medium transition-colors"
            >
              {t("openProduct", { name: snapB!.name })} <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function ProductPicker({
  label,
  value,
  products,
  excludeId,
  onChange,
}: {
  label: string
  value: string
  products: ParsedProduct[]
  excludeId: string
  onChange: (id: string) => void
}) {
  const t = useTranslations("products.compare")

  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-2 block">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bone border border-sage-mist/50 focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none cursor-pointer"
      >
        <option value="">{t("choose")}</option>
        {products
          .filter((p) => p.id !== excludeId)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>
    </label>
  )
}

function SummaryCard({
  snapshot,
  label,
  locale,
  ringLabel,
}: {
  snapshot: ProductCompareSnapshot
  label: string
  locale: string
  ringLabel: string
}) {
  const lp = (path: string) => `/${locale}${path}`

  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass flex flex-wrap items-center gap-5">
      <ComplianceScoreRing score={snapshot.complianceScore} size={88} strokeWidth={8} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink/40 uppercase tracking-wide mb-0.5">{label}</p>
        <h2 className="text-base font-semibold text-charcoal truncate">{snapshot.name}</h2>
        <p className="text-xs text-ink/50 mt-1">{ringLabel}</p>
        {snapshot.gwpKgCo2 != null && (
          <p className="text-sm font-mono text-charcoal mt-2">
            GWP: <span className="font-bold">{snapshot.gwpKgCo2}</span> kg CO₂-eq
          </p>
        )}
      </div>
      <Link
        href={lp(`/products/${snapshot.id}`)}
        className="inline-flex items-center gap-1 text-xs text-moss hover:text-forest-deep font-medium flex-shrink-0"
      >
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
      </Link>
    </div>
  )
}

function cellHighlight(highlight: CompareRow["highlight"], side: "a" | "b"): string {
  if (!highlight || highlight === "neutral") return "text-charcoal"
  if (highlight === side) return "text-charcoal font-medium bg-verified/5"
  return "text-ink/70"
}

function CellValue({ value, kind }: { value: string; kind: "text" | "phase" }) {
  const t = useTranslations("products.compare")

  if (kind === "phase") {
    if (value === t("yes")) {
      return (
        <span className="inline-flex items-center gap-1 text-verified text-xs font-medium">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> {value}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-coral text-xs">
        <X className="w-3.5 h-3.5" strokeWidth={2} /> {value}
      </span>
    )
  }

  return <span className="text-sm leading-relaxed">{value}</span>
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
