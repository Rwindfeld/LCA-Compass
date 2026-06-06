"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"

export function IsoTimeline() {
  const t = useTranslations("landing.standards")

  const standards = [
    { id: "ISO 14040", name: t("iso14040.name"), description: t("iso14040.description"), year: 2006, color: "bg-forest-deep" },
    { id: "ISO 14044", name: t("iso14044.name"), description: t("iso14044.description"), year: 2006, color: "bg-moss" },
    { id: "ISO 14025", name: t("iso14025.name"), description: t("iso14025.description"), year: 2006, color: "bg-brass" },
    { id: "ISO 14067", name: t("iso14067.name"), description: t("iso14067.description"), year: 2018, color: "bg-verified" },
    { id: "ISO 14071", name: t("iso14071.name"), description: t("iso14071.description"), year: 2014, color: "bg-amber-warn" },
    { id: "EN 15978", name: t("en15978.name"),  description: t("en15978.description"),  year: 2011, color: "bg-coral" },
  ]

  return (
    <section className="py-24 bg-parchment" id="standards">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-display-lg font-display font-bold text-charcoal" style={{ letterSpacing: "-0.02em" }}>
            {t("title")}
          </h2>
          <p className="text-base text-ink/60 mt-3 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {standards.map(({ id, name, description, year, color }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-bone border border-sage-mist/30 rounded-xl p-5 shadow-compass hover:shadow-compass-lg hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className={`inline-block ${color} text-bone text-xs font-bold font-mono px-2.5 py-1 rounded-md flex-shrink-0`}>
                  {id}
                </span>
                <span className="text-xs text-ink/40 font-mono mt-0.5">{year}</span>
              </div>
              <h3 className="text-sm font-semibold text-charcoal mb-1.5">{name}</h3>
              <p className="text-xs text-ink/60 leading-relaxed">{description}</p>
              <button className="mt-3 inline-flex items-center gap-1 text-xs text-moss hover:text-forest-deep transition-colors opacity-0 group-hover:opacity-100">
                {t("readMore")} <ExternalLink className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
