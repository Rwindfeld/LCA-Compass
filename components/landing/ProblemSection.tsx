"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { BookOpen, DollarSign, FileX } from "lucide-react"

const problems = [
  {
    icon: BookOpen,
    key: "standards" as const,
    color: "text-coral",
    bgColor: "bg-coral/10",
  },
  {
    icon: DollarSign,
    key: "cost" as const,
    color: "text-amber-warn",
    bgColor: "bg-amber-warn/10",
  },
  {
    icon: FileX,
    key: "tools" as const,
    color: "text-moss",
    bgColor: "bg-moss/10",
  },
]

export function ProblemSection() {
  const t = useTranslations("landing.problem")

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

      <div className="grid md:grid-cols-3 gap-6">
        {problems.map(({ icon: Icon, key, color, bgColor }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass hover:shadow-compass-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl ${bgColor} mb-4`}>
              <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              {t(`cards.${key}.title`)}
            </h3>
            <p className="text-sm text-ink/70 leading-relaxed">
              {t(`cards.${key}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
