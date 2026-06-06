"use client"

import { useCallback, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { matchProductSearch } from "@/lib/products/match-product-search"
import { ProductSearch } from "@/components/dashboard/ProductSearch"
import {
  Plus, LayoutGrid, List, Cpu, Package,
  Shirt, Sofa, Utensils, Box, Building2, ArrowRight, GitCompare,
} from "lucide-react"

type Product = {
  id: string
  name: string
  productType: string
  ambitionLevel: string
  status: string
  complianceScore: number
  updatedAt: Date
  description: string | null
}

const typeIcons: Record<string, React.ElementType> = {
  ELECTRONICS: Cpu, SOFTWARE_HARDWARE: Cpu, TEXTILE: Shirt,
  FURNITURE: Sofa, FOOD: Utensils, PACKAGING: Box, CONSTRUCTION: Building2, OTHER: Package,
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-ink/10 text-ink/60",
  IN_PROGRESS: "bg-amber-warn/10 text-amber-warn border border-amber-warn/20",
  REVIEW_PENDING: "bg-moss/10 text-moss border border-moss/20",
  REVIEW_DONE: "bg-verified/10 text-verified border border-verified/20",
  EPD_READY: "bg-brass/10 text-brass border border-brass/20",
  PUBLISHED: "bg-forest-deep/10 text-forest-deep border border-forest-deep/20",
}

const statusKeys = ["DRAFT", "IN_PROGRESS", "REVIEW_PENDING", "REVIEW_DONE", "EPD_READY", "PUBLISHED"] as const
type StatusKey = (typeof statusKeys)[number]

function isStatusKey(value: string | null): value is StatusKey {
  return value != null && statusKeys.includes(value as StatusKey)
}

interface ProductsClientProps { products: Product[] }

export function ProductsClient({ products }: ProductsClientProps) {
  const t = useTranslations("products")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(() => searchParams.get("q") ?? "")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    const status = searchParams.get("status")
    return isStatusKey(status) ? status : "all"
  })
  const [incompleteOnly] = useState(() => searchParams.get("incomplete") === "1")
  const [sortByCompliance] = useState(() => searchParams.get("sort") === "compliance")

  const syncQueryToUrl = useCallback(
    (updates: { q?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString())
      if (updates.q !== undefined) {
        if (updates.q.trim()) params.set("q", updates.q.trim())
        else params.delete("q")
      }
      if (updates.status !== undefined) {
        if (updates.status === "all") params.delete("status")
        else params.set("status", updates.status)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const handleSearchChange = useCallback(
    (q: string) => {
      setSearch(q)
      syncQueryToUrl({ q })
    },
    [syncQueryToUrl]
  )

  const handleStatusChange = useCallback(
    (status: string) => {
      setStatusFilter(status)
      syncQueryToUrl({ status })
    },
    [syncQueryToUrl]
  )

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      const extraTerms = [
        t(`type.${p.productType}`),
        t(`status.${p.status}`),
        t(`ambition.${p.ambitionLevel}`),
      ]
      const matchesSearch = matchProductSearch(p, search, extraTerms)
      const matchesStatus = statusFilter === "all" || p.status === statusFilter
      const matchesIncomplete = !incompleteOnly || p.complianceScore < 100
      return matchesSearch && matchesStatus && matchesIncomplete
    })
    if (sortByCompliance) {
      return [...list].sort((a, b) => b.complianceScore - a.complianceScore)
    }
    return list
  }, [products, search, statusFilter, incompleteOnly, sortByCompliance, t])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal">{t("title")}</h1>
          <p className="text-sm text-ink/50 mt-0.5">{products.length} {t("totalCount")}</p>
        </div>
        {products.length >= 2 && (
          <Link
            href={`/${locale}/products/compare`}
            className="inline-flex items-center gap-2 bg-parchment border border-sage-mist/30 hover:border-moss/40 text-charcoal px-4 py-2 rounded-lg text-sm font-medium shadow-compass hover:shadow-compass-lg transition-all"
          >
            <GitCompare className="w-4 h-4 text-brass" strokeWidth={1.5} />
            {t("compareLink")}
          </Link>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <ProductSearch
          className="flex-1 min-w-[200px] max-w-md"
          surfaceClassName="flex items-center gap-2 w-full bg-bone border border-sage-mist/50 rounded-lg px-3 py-2.5 group focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/20 transition-all"
          initialQuery={search}
          onQueryChange={handleSearchChange}
          mode="filter"
          showViewAllLink={false}
        />

        <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-bone border border-sage-mist/50 focus:border-brass rounded-lg px-3 py-2.5 text-sm text-charcoal outline-none cursor-pointer">
          <option value="all">{t("allStatuses")}</option>
          {statusKeys.map((key) => (
            <option key={key} value={key}>{t(`status.${key}`)}</option>
          ))}
        </select>

        <div className="flex items-center bg-parchment border border-sage-mist/30 rounded-lg p-1">
          <button onClick={() => setView("grid")} aria-label={t("gridView")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-forest-deep text-bone shadow-sm" : "text-ink/50 hover:text-charcoal"}`}>
            <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button onClick={() => setView("list")} aria-label={t("listView")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-forest-deep text-bone shadow-sm" : "text-ink/50 hover:text-charcoal"}`}>
            <List className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState search={search} />
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} locale={locale} />)}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => <ProductListItem key={p.id} product={p} index={i} locale={locale} />)}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, index, locale }: { product: Product; index: number; locale: string }) {
  const t = useTranslations("products")
  const TypeIcon = typeIcons[product.productType] ?? Package

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass hover:shadow-compass-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-bone border border-sage-mist/30 rounded-lg flex items-center justify-center">
            <TypeIcon className="w-4 h-4 text-moss" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-xs text-ink/40">{t(`type.${product.productType}`)}</span>
            <p className="text-xs text-ink/40 mt-0.5">{t(`ambition.${product.ambitionLevel}`)}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[product.status] ?? "bg-ink/10 text-ink/60"}`}>
          {t(`status.${product.status}`)}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-charcoal mb-3 line-clamp-2 leading-snug">{product.name}</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-ink/40">Compliance</span>
          <span className="text-xs font-mono text-moss">{product.complianceScore}%</span>
        </div>
        <div className="h-1.5 bg-sage-mist/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-forest-deep to-moss rounded-full transition-all duration-700" style={{ width: `${product.complianceScore}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink/30">
          {new Date(product.updatedAt).toLocaleDateString(locale === "en" ? "en-GB" : "da-DK", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <Link href={`/products/${product.id}`} className="inline-flex items-center gap-1 text-xs text-moss hover:text-forest-deep font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {t("open")} <ArrowRight className="w-3 h-3" strokeWidth={2} />
        </Link>
      </div>
    </motion.div>
  )
}

function ProductListItem({ product, index, locale }: { product: Product; index: number; locale: string }) {
  const t = useTranslations("products")
  const TypeIcon = typeIcons[product.productType] ?? Package

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-parchment border border-sage-mist/30 rounded-xl px-5 py-4 shadow-compass hover:shadow-compass-lg transition-all duration-300 flex items-center gap-4 group">
      <div className="w-9 h-9 bg-bone border border-sage-mist/30 rounded-lg flex items-center justify-center flex-shrink-0">
        <TypeIcon className="w-4 h-4 text-moss" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-charcoal truncate">{product.name}</h3>
        <p className="text-xs text-ink/40">{t(`type.${product.productType}`)} · {t(`ambition.${product.ambitionLevel}`)}</p>
      </div>
      <span className={`hidden sm:inline text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusColors[product.status] ?? "bg-ink/10 text-ink/60"}`}>
        {t(`status.${product.status}`)}
      </span>
      <div className="hidden md:flex items-center gap-3 w-32">
        <div className="flex-1 h-1.5 bg-sage-mist/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-forest-deep to-moss rounded-full" style={{ width: `${product.complianceScore}%` }} />
        </div>
        <span className="text-xs font-mono text-moss w-8 text-right">{product.complianceScore}%</span>
      </div>
      <Link href={`/products/${product.id}`} className="inline-flex items-center gap-1 text-xs text-moss hover:text-forest-deep font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {t("open")} <ArrowRight className="w-3 h-3" strokeWidth={2} />
      </Link>
    </motion.div>
  )
}

function EmptyState({ search }: { search: string }) {
  const t = useTranslations("products")
  return (
    <div className="bg-parchment border border-sage-mist/30 rounded-2xl p-16 text-center shadow-compass">
      <Package className="w-12 h-12 text-sage-mist mx-auto mb-4" strokeWidth={0.75} />
      <h3 className="text-lg font-display font-semibold text-charcoal mb-2">
        {search ? t("noResults", { query: search }) : t("empty.title")}
      </h3>
      <p className="text-sm text-ink/50 mb-6 max-w-sm mx-auto">
        {search ? t("tryOtherSearch") : t("empty.description")}
      </p>
      {!search && (
        <Link href="/products/new" className="inline-flex items-center gap-2 bg-forest-deep text-bone px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-moss transition-colors shadow-compass">
          <Plus className="w-4 h-4" strokeWidth={2} /> {t("empty.cta")}
        </Link>
      )}
    </div>
  )
}
