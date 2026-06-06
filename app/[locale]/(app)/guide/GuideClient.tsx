"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import {
  BookOpen,
  ExternalLink,
  Layers,
  FileText,
  Droplets,
  ClipboardCheck,
  Building2,
  Library,
} from "lucide-react"
import {
  CATEGORY_ORDER,
  STANDARDS_CATALOG,
  SUPPLEMENTARY_RESOURCES,
  type StandardCategory,
} from "@/lib/lca/standards-catalog"

const CATEGORY_ICONS: Record<StandardCategory, React.ElementType> = {
  core: Layers,
  declarations: FileText,
  footprints: Droplets,
  review: ClipboardCheck,
  organizational: Building2,
  supplementary: Library,
}

export function GuideClient() {
  const t = useTranslations("guide")
  const locale = useLocale()
  const lp = (path: string) => `/${locale}${path}`

  const phases = ["goalScope", "inventory", "impact", "interpretation"] as const

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-8">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-charcoal flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-brass flex-shrink-0" strokeWidth={1.5} />
              {t("title")}
            </h1>
            <p className="text-sm text-ink/60 mt-2 max-w-2xl leading-relaxed">{t("subtitle")}</p>
          </div>
          <Link
            href={lp("/dashboard")}
            className="text-sm text-moss hover:text-forest-deep font-medium transition-colors flex-shrink-0"
          >
            {t("backToDashboard")}
          </Link>
        </div>
        <p className="text-xs text-ink/45 bg-parchment border border-sage-mist/30 rounded-lg px-4 py-3 leading-relaxed">
          {t("disclaimer")}
        </p>
      </motion.header>

      {/* What is LCA */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-parchment border border-sage-mist/30 rounded-xl p-6 md:p-8 shadow-compass space-y-5"
      >
        <h2 className="text-lg font-display font-bold text-charcoal">{t("whatIsLca.title")}</h2>
        <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
          <p>{t("whatIsLca.p1")}</p>
          <p>{t("whatIsLca.p2")}</p>
          <p>{t("whatIsLca.p3")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-charcoal mb-3">{t("whatIsLca.phasesTitle")}</h3>
          <ol className="grid sm:grid-cols-2 gap-3">
            {phases.map((phase, i) => (
              <li
                key={phase}
                className="flex gap-3 bg-bone rounded-lg border border-sage-mist/25 p-4"
              >
                <span className="w-7 h-7 rounded-full bg-forest-deep text-bone text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {t(`whatIsLca.phases.${phase}.title`)}
                  </p>
                  <p className="text-xs text-ink/55 mt-1 leading-relaxed">
                    {t(`whatIsLca.phases.${phase}.desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </motion.section>

      {/* Standards intro */}
      <section className="space-y-2">
        <h2 className="text-lg font-display font-bold text-charcoal">{t("standardsTitle")}</h2>
        <p className="text-sm text-ink/60 leading-relaxed max-w-3xl">{t("standardsIntro")}</p>
      </section>

      {/* Standards by category */}
      {CATEGORY_ORDER.map((category, catIndex) => {
        const items = STANDARDS_CATALOG.filter((s) => s.category === category)
        if (items.length === 0) return null
        const Icon = CATEGORY_ICONS[category]

        return (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + catIndex * 0.04 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-moss/10">
                <Icon className="w-4 h-4 text-moss" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wide">
                {t(`categories.${category}`)}
              </h3>
            </div>

            <div className="grid gap-4">
              {items.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass hover:border-moss/25 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-base font-semibold text-charcoal">
                        {entry.code}
                        <span className="text-ink/40 font-normal ml-2 text-sm">
                          ({entry.year})
                        </span>
                      </h4>
                      <p className="text-xs text-ink/45 mt-0.5">
                        {t(`standards.${entry.id}.name`)}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bone border border-sage-mist/30 text-ink/50">
                      {entry.publisher}
                    </span>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed mb-3">
                    {t(`standards.${entry.id}.description`)}
                  </p>
                  <p className="text-xs text-ink/50 mb-3">
                    <span className="font-medium text-charcoal/80">{t("roleLabel")}: </span>
                    {t(`standards.${entry.id}.role`)}
                  </p>
                  <a
                    href={entry.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-moss hover:text-forest-deep transition-colors"
                  >
                    {t("officialDocument")}
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                </article>
              ))}
            </div>
          </motion.section>
        )
      })}

      {/* Free supplementary */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brass/10">
            <Library className="w-4 h-4 text-brass" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wide">
            {t("categories.supplementary")}
          </h3>
        </div>
        <p className="text-sm text-ink/60">{t("supplementaryIntro")}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SUPPLEMENTARY_RESOURCES.map((res) => (
            <article
              key={res.id}
              className="bg-verified/5 border border-verified/20 rounded-xl p-5"
            >
              <span className="text-xs font-medium text-verified bg-verified/10 px-2 py-0.5 rounded">
                {t("freeAccess")}
              </span>
              <h4 className="text-sm font-semibold text-charcoal mt-2">
                {t(`resources.${res.id}.title`)}
              </h4>
              <p className="text-xs text-ink/60 mt-2 leading-relaxed">
                {t(`resources.${res.id}.description`)}
              </p>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-moss hover:text-forest-deep mt-3 transition-colors"
              >
                {t("openResource")}
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </article>
          ))}
        </div>
      </motion.section>

      <div className="text-center pt-2">
        <Link
          href={lp("/products/new")}
          className="inline-flex items-center gap-2 bg-forest-deep text-bone px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-moss transition-colors shadow-compass"
        >
          {t("startLca")}
        </Link>
      </div>
    </div>
  )
}
