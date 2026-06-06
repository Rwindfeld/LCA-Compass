"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import {
  Package, BarChart2, CheckCircle, AlertCircle,
  Plus, GitCompare, BookOpen, ArrowRight, Clock,
} from "lucide-react"

type Product = {
  id: string
  name: string
  productType: string
  status: string
  complianceScore: number
  updatedAt: Date
}

interface DashboardClientProps {
  products: Product[]
  stats: { total: number; avgCompliance: number; epdReady: number; missingFields: number }
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold font-mono text-charcoal">
      {value}{suffix}
    </motion.span>
  )
}

export function DashboardClient({ products, stats }: DashboardClientProps) {
  const t = useTranslations("dashboard")
  const tP = useTranslations("products")
  const locale = useLocale()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t("greeting.morning") : hour < 18 ? t("greeting.afternoon") : t("greeting.evening")

  const lp = (path: string) => `/${locale}${path}`

  const statCards = [
    { label: t("stats.activeProducts"),  value: stats.total,         suffix: "",  icon: Package,       color: "text-moss",    bg: "bg-moss/10",     href: lp("/products") },
    { label: t("stats.avgCompliance"),   value: stats.avgCompliance, suffix: "%", icon: BarChart2,     color: "text-verified",bg: "bg-verified/10", href: lp("/products?sort=compliance") },
    { label: t("stats.epdReady"),        value: stats.epdReady,      suffix: "",  icon: CheckCircle,   color: "text-brass",   bg: "bg-brass/10",    href: lp("/products?status=EPD_READY") },
    { label: t("stats.missingFields"),   value: stats.missingFields, suffix: "",  icon: AlertCircle,
      color: stats.missingFields > 0 ? "text-coral" : "text-verified",
      bg:    stats.missingFields > 0 ? "bg-coral/10" : "bg-verified/10",
      href: lp("/products?incomplete=1") },
  ]

  const quickActions = [
    { icon: Plus,       title: t("quickActions.newProduct"),  description: t("quickActions.newProductDesc"),  href: lp("/products/new"), color: "bg-forest-deep text-bone",                        iconBg: "bg-moss/30" },
    { icon: GitCompare, title: t("quickActions.compare"),     description: t("quickActions.compareDesc"),     href: lp("/products/compare"),     color: "bg-parchment text-charcoal border border-sage-mist/30", iconBg: "bg-brass/10" },
    { icon: BookOpen,   title: t("quickActions.guide"),       description: t("quickActions.guideDesc"),       href: lp("/guide"),             color: "bg-parchment text-charcoal border border-sage-mist/30", iconBg: "bg-moss/10" },
  ]

  const statusColors: Record<string, string> = {
    DRAFT: "bg-ink/10 text-ink/60",
    IN_PROGRESS: "bg-amber-warn/10 text-amber-warn border border-amber-warn/20",
    REVIEW_PENDING: "bg-moss/10 text-moss border border-moss/20",
    REVIEW_DONE: "bg-verified/10 text-verified border border-verified/20",
    EPD_READY: "bg-brass/10 text-brass border border-brass/20",
    PUBLISHED: "bg-forest-deep/10 text-forest-deep border border-forest-deep/20",
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-display font-bold text-charcoal">{greeting}, Rattana</h1>
        <p className="text-sm text-ink/60 mt-1">{t("subtitle", { count: stats.total })}</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, suffix, icon: Icon, color, bg, href }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}>
            <Link
              href={href}
              className="block bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass hover:shadow-compass-lg hover:-translate-y-0.5 hover:border-moss/30 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/40"
              aria-label={`${label}: ${value}${suffix}`}
            >
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.5} />
              </div>
              <Counter value={value} suffix={suffix} />
              <p className="text-xs text-ink/50 mt-1 flex items-center justify-between gap-2">
                <span>{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" strokeWidth={2} />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-widest mb-4">{t("quickActionsTitle")}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map(({ icon: Icon, title, description, href, color, iconBg }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}>
              <Link href={href} className={`block p-5 rounded-xl ${color} shadow-compass hover:shadow-compass-lg hover:-translate-y-0.5 transition-all duration-300 group`}>
                <div className={`inline-flex p-2.5 rounded-lg ${iconBg} mb-3`}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold mb-1">{title}</h3>
                <p className="text-xs opacity-70">{description}</p>
                <ArrowRight className="w-4 h-4 mt-3 opacity-40 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-200" strokeWidth={1.5} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-widest">{t("recentProducts")}</h2>
          <Link href={lp("/products")} className="text-xs text-moss hover:text-forest-deep font-medium transition-colors flex items-center gap-1">
            {t("seeAll")} <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-parchment border border-sage-mist/30 rounded-xl p-12 text-center shadow-compass">
            <Package className="w-10 h-10 text-sage-mist mx-auto mb-3" strokeWidth={1} />
            <h3 className="text-base font-semibold text-charcoal mb-2">{t("noProducts")}</h3>
            <p className="text-sm text-ink/50 mb-4">{t("createFirst")}</p>
            <Link href={lp("/products/new")} className="inline-flex items-center gap-2 bg-forest-deep text-bone px-4 py-2 rounded-lg text-sm font-medium hover:bg-moss transition-colors">
              <Plus className="w-4 h-4" strokeWidth={2} /> {tP("new")}
            </Link>
          </div>
        ) : (
          <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sage-mist/20 bg-bone/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide">{tP("title")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden sm:table-cell">{t("colStatus")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden md:table-cell">{t("colCompliance")}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden lg:table-cell">{t("colUpdated")}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                    className="border-b border-sage-mist/15 last:border-0 hover:bg-bone/50 transition-colors group">
                    <td className="px-5 py-4">
                      <Link href={lp(`/products/${product.id}`)} className="font-medium text-sm text-charcoal hover:text-forest-deep transition-colors">
                        {product.name}
                      </Link>
                      <p className="text-xs text-ink/40 mt-0.5">{tP(`type.${product.productType}`)}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[product.status] ?? "bg-ink/10 text-ink/60"}`}>
                        {tP(`status.${product.status}`)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-sage-mist/30 rounded-full overflow-hidden max-w-[80px]">
                          <div className="h-full bg-gradient-to-r from-forest-deep to-moss rounded-full" style={{ width: `${product.complianceScore}%` }} />
                        </div>
                        <span className="text-xs font-mono text-moss">{product.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-ink/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        {new Date(product.updatedAt).toLocaleDateString(locale === "en" ? "en-GB" : "da-DK", { day: "numeric", month: "short" })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={lp(`/products/${product.id}`)} className="text-xs text-moss hover:text-forest-deep font-medium opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                        {t("open")} <ArrowRight className="w-3 h-3" strokeWidth={2} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
