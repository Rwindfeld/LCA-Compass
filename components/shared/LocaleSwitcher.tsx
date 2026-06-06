"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/lib/i18n/navigation"
import { Globe } from "lucide-react"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="inline-flex items-center gap-1 bg-parchment border border-sage-mist/40 rounded-full p-1">
      <Globe className="w-4 h-4 text-moss ml-1.5" strokeWidth={1.5} />
      <button
        onClick={() => handleSwitch("da")}
        className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          locale === "da"
            ? "bg-forest-deep text-bone shadow-compass"
            : "text-ink hover:text-forest-deep"
        }`}
        aria-label="Skift til dansk"
        aria-pressed={locale === "da"}
      >
        DK
      </button>
      <button
        onClick={() => handleSwitch("en")}
        className={`px-2.5 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          locale === "en"
            ? "bg-forest-deep text-bone shadow-compass"
            : "text-ink hover:text-forest-deep"
        }`}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  )
}
