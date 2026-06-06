"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { LayoutDashboard, Package, BookOpen, Settings } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("nav")
  const lp = (path: string) => `/${locale}${path}`

  const navItems = [
    { href: lp("/dashboard"), icon: LayoutDashboard, label: t("dashboard") },
    { href: lp("/products"), icon: Package, label: t("products") },
    { href: lp("/guide"), icon: BookOpen, label: t("guide") },
    { href: lp("/settings"), icon: Settings, label: t("settings") },
  ]

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-forest-deep border-t border-moss/30 flex items-stretch safe-area-inset-bottom"
      aria-label="Mobilnavigation"
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-xs font-medium transition-colors duration-150 ${
              active ? "text-brass" : "text-sage-mist/60 hover:text-bone active:text-bone"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={`w-5 h-5 transition-colors ${active ? "text-brass" : "text-sage-mist/50"}`}
              strokeWidth={active ? 2 : 1.5}
            />
            <span className="leading-none">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
