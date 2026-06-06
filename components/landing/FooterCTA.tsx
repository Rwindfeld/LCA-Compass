"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

export function FooterCTA() {
  const t = useTranslations("landing.cta")

  return (
    <section className="py-32 relative overflow-hidden bg-bone">
      {/* Compass rose background */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="600" height="600" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="95" stroke="#1F3A2F" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="75" stroke="#1F3A2F" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="55" stroke="#C9A961" strokeWidth="0.5" />
          <polygon points="100,5 96,50 100,45 104,50" fill="#C9A961" />
          <polygon points="100,195 96,150 100,155 104,150" fill="#1F3A2F" />
          <polygon points="5,100 50,96 45,100 50,104" fill="#1F3A2F" />
          <polygon points="195,100 150,96 155,100 150,104" fill="#1F3A2F" />
          <circle cx="100" cy="100" r="8" fill="#C9A961" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-display-xl font-display font-bold text-charcoal mb-8"
          style={{ letterSpacing: "-0.02em" }}
        >
          {t("title")}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 transition-colors duration-200 px-8 py-4 rounded-xl font-bold text-lg shadow-brass-glow"
          >
            {t("button")}
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </motion.div>
        <p className="mt-4 text-sm text-ink/40">
          {t("subline")}
        </p>
      </div>
    </section>
  )
}
