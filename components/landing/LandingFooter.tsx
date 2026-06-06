"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { CompassLogo } from "@/components/shared/CompassLogo"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"

export function LandingFooter() {
  const t = useTranslations("footer")
  const locale = useLocale()

  const footerLinks = {
    [t("product")]: [
      { label: t("features"), href: "#product" },
      { label: t("demo"), href: "/dashboard" },
      { label: "Changelog", href: "#" },
    ],
    [t("standards")]: [
      { label: "ISO 14040/14044", href: "#standards" },
      { label: "ISO 14025 EPD", href: "#standards" },
      { label: "ISO 14067 CFP", href: "#standards" },
      { label: "ISO 14071", href: "#standards" },
    ],
    [t("resources")]: [
      { label: t("isoGuide"), href: `/${locale}/guide` },
      { label: t("documentation"), href: "#" },
      { label: "API Reference", href: "#" },
    ],
    [t("company")]: [
      { label: t("about"), href: "#about" },
      { label: t("contact"), href: "#" },
      { label: t("privacy"), href: "#" },
      { label: t("terms"), href: "#" },
    ],
  }

  return (
    <footer className="bg-forest-deep text-bone py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-sage-mist/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <CompassLogo size={28} showWordmark href="/" className="mb-4" />
            <p className="text-sm text-sage-mist/70 leading-relaxed mt-3">
              {t("tagline")}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-sage-mist/50 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-sage-mist/70 hover:text-bone transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sage-mist/40">
            © 2026 LCA-Kompas. Made with intent in Copenhagen. 🧭
          </p>
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  )
}
