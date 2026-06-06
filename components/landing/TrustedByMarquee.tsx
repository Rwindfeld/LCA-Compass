"use client"

import { useTranslations } from "next-intl"

const companies = [
  "NorthLight Design",
  "Verde Studio",
  "Atlas Goods",
  "Forma Lab",
  "Papas Papbar",
  "Civic Objects",
  "Terrain Studio",
  "Moss & Co",
]

export function TrustedByMarquee() {
  const t = useTranslations("landing.trustedBy")
  const doubled = [...companies, ...companies]

  return (
    <section className="py-10 bg-parchment border-y border-sage-mist/30 overflow-hidden">
      <p className="text-center text-xs font-medium text-ink/50 mb-6 tracking-widest uppercase">
        {t("label")}
      </p>
      <div className="relative">
        <div
          className="flex gap-12 items-center"
          style={{
            animation: "marquee 30s linear infinite",
            width: "max-content",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.animationPlayState = "paused"
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.animationPlayState = "running"
          }}
        >
          {doubled.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brass flex-shrink-0" />
              <span className="text-sm font-medium text-moss/70">{name}</span>
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-parchment to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-parchment to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
