"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { CompassLogo } from "@/components/shared/CompassLogo"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"

export function MarketingHeader() {
  const t = useTranslations("landing.nav")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bone/95 backdrop-blur-sm shadow-compass border-b border-sage-mist/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <CompassLogo size={28} showWordmark />

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primær navigation">
          {[
            { label: t("product"), href: "#product" },
            { label: t("verify"), href: "#verify" },
            { label: t("standards"), href: "#standards" },
            { label: t("about"), href: "#about" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-ink hover:text-forest-deep transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium text-ink hover:text-forest-deep transition-colors duration-200 px-3 py-1.5"
          >
            {t("login")}
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 transition-colors duration-200 px-4 py-2 rounded-lg text-sm font-semibold shadow-brass-glow"
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
