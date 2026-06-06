"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Compass, BarChart3, FileText, Target, Search, Download } from "lucide-react"

const features = [
  { icon: Compass, key: "wizard" as const },
  { icon: BarChart3, key: "lcia" as const },
  { icon: FileText, key: "prose" as const },
  { icon: Target, key: "dqi" as const },
  { icon: Search, key: "review" as const },
  { icon: Download, key: "pdf" as const },
]

export function FeatureGrid() {
  const t = useTranslations("landing.features")

  return (
    <section className="py-24 bg-forest-deep" id="product">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-display-lg font-display font-bold text-bone"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-moss/30 border border-sage-mist/10 rounded-xl p-6 hover:bg-moss/50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-brass/10 border border-brass/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brass/20 transition-colors">
                <Icon className="w-5 h-5 text-brass" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-bone mb-2">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm text-sage-mist/80 leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
