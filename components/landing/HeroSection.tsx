"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const t = useTranslations("landing.hero")

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none"
        aria-hidden="true"
      />

      {/* Compass rose decoration */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none"
        aria-hidden="true"
        style={{ transform: "translateY(-50%) translateX(30%)" }}
      >
        <CompassRoseSVG size={700} />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32 w-full text-center">
        <div className="flex flex-col items-center">
          {/* Single centered column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6 justify-center"
            >
              <span className="inline-flex items-center gap-1.5 bg-brass/10 text-brass border border-brass/20 rounded-full px-3 py-1 text-xs font-medium">
                ✦ {t("eyebrow")}
              </span>
            </motion.div>

            {/* Title */}
            <h1
              className="text-display-xl font-display font-bold text-charcoal mb-6 leading-[1.1] mx-auto"
              style={{ letterSpacing: "-0.01em", maxWidth: "800px" }}
            >
              {t("titleStart")}{" "}
              <span className="text-forest-deep">{t("titleHighlight")}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-ink/70 leading-relaxed mb-10 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-forest-deep text-bone hover:bg-moss transition-colors duration-200 px-8 py-3.5 rounded-xl font-semibold text-base shadow-compass"
              >
                {t("ctaPrimary")}
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            {/* Micro trust */}
            <div>
              <p className="text-xs text-ink/40 mb-3">{t("trustedBy")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {["NorthLight Design", "Verde Studio", "Atlas Goods", "Forma Lab", "Papas Papbar"].map((name) => (
                  <span
                    key={name}
                    className="text-xs font-medium text-moss/70 bg-sage-mist/20 px-3 py-1 rounded-full border border-sage-mist/30"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CompassRoseSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Outer ring */}
      <circle cx="100" cy="100" r="95" stroke="#4A6B5C" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="75" stroke="#4A6B5C" strokeWidth="0.3" />
      <circle cx="100" cy="100" r="55" stroke="#C9A961" strokeWidth="0.5" />

      {/* Cardinal arrows */}
      <polygon points="100,5 96,50 100,45 104,50" fill="#C9A961" opacity="0.8" />
      <polygon points="100,195 96,150 100,155 104,150" fill="#4A6B5C" opacity="0.6" />
      <polygon points="5,100 50,96 45,100 50,104" fill="#4A6B5C" opacity="0.6" />
      <polygon points="195,100 150,96 155,100 150,104" fill="#4A6B5C" opacity="0.6" />

      {/* Intercardinal marks */}
      {[45, 135, 225, 315].map((angle) => (
        <line
          key={angle}
          x1={100 + 55 * Math.cos((angle * Math.PI) / 180)}
          y1={100 + 55 * Math.sin((angle * Math.PI) / 180)}
          x2={100 + 75 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 75 * Math.sin((angle * Math.PI) / 180)}
          stroke="#B8C5B0"
          strokeWidth="0.5"
        />
      ))}

      {/* Tick marks */}
      {Array.from({ length: 32 }, (_, i) => i * (360 / 32)).map((angle) => (
        <line
          key={angle}
          x1={100 + 88 * Math.cos((angle * Math.PI) / 180)}
          y1={100 + 88 * Math.sin((angle * Math.PI) / 180)}
          x2={100 + 94 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 94 * Math.sin((angle * Math.PI) / 180)}
          stroke="#B8C5B0"
          strokeWidth="0.5"
        />
      ))}

      <circle cx="100" cy="100" r="5" fill="#C9A961" opacity="0.8" />
    </svg>
  )
}
