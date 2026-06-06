"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Check } from "lucide-react"

const tiers = [
  { key: "free" as const, highlighted: false },
  { key: "pro" as const, highlighted: true },
  { key: "enterprise" as const, highlighted: false },
]

export function PricingTable() {
  const t = useTranslations("landing.pricing")

  return (
    <section className="py-24 bg-forest-deep" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-display-lg font-display font-bold text-bone"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map(({ key, highlighted }, i) => {
            const features = t.raw(`${key}.features`) as string[]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl p-8 ${
                  highlighted
                    ? "bg-bone shadow-brass-glow border-2 border-brass relative"
                    : "bg-moss/30 border border-sage-mist/10"
                }`}
              >
                {highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-brass text-forest-deep text-xs font-bold px-3 py-1 rounded-full">
                      MEST POPULÆR
                    </span>
                  </div>
                )}

                <h3
                  className={`text-xl font-display font-semibold mb-1 ${
                    highlighted ? "text-forest-deep" : "text-bone"
                  }`}
                >
                  {t(`${key}.name`)}
                </h3>

                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold font-mono ${
                      highlighted ? "text-forest-deep" : "text-bone"
                    }`}
                  >
                    {t(`${key}.price`)}
                  </span>
                  {t(`${key}.period`) && (
                    <span
                      className={`text-sm ml-1 ${
                        highlighted ? "text-moss" : "text-sage-mist/70"
                      }`}
                    >
                      / {t(`${key}.period`)}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 ${
                          highlighted ? "text-verified" : "text-brass/70"
                        }`}
                        strokeWidth={2.5}
                      />
                      <span
                        className={`text-sm ${
                          highlighted ? "text-charcoal" : "text-sage-mist/80"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    highlighted
                      ? "bg-forest-deep text-bone hover:bg-moss shadow-compass"
                      : "bg-transparent border border-sage-mist/30 text-bone hover:border-brass hover:text-brass"
                  }`}
                >
                  {key === "enterprise" ? "Kontakt os" : "Kom i gang"}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
