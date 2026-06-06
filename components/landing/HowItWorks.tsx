"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Target, Database, BarChart2, FileDown } from "lucide-react"

const steps = [
  { icon: Target, key: "define" as const, number: "01" },
  { icon: Database, key: "input" as const, number: "02" },
  { icon: BarChart2, key: "analyze" as const, number: "03" },
  { icon: FileDown, key: "export" as const, number: "04" },
]

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks")

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2
          className="text-display-lg font-display font-bold text-charcoal"
          style={{ letterSpacing: "-0.02em" }}
        >
          {t("title")}
        </h2>
      </motion.div>

      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-sage-mist via-brass to-sage-mist opacity-40" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ icon: Icon, key, number }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              {/* Number + Icon circle */}
              <div className="relative inline-flex mb-6">
                <div className="w-24 h-24 bg-bone border-2 border-sage-mist/30 rounded-full flex items-center justify-center shadow-compass group-hover:border-brass transition-colors">
                  <Icon className="w-9 h-9 text-forest-deep" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-brass text-forest-deep rounded-full flex items-center justify-center text-xs font-bold font-mono">
                  {number}
                </span>
              </div>

              <h3 className="text-base font-semibold text-charcoal mb-2">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-sm text-ink/60 leading-relaxed">
                {t(`steps.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
