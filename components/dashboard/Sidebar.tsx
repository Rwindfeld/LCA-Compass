"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { CompassLogo } from "@/components/shared/CompassLogo"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { LayoutDashboard, Package, FileText, Settings } from "lucide-react"
import { UserAccountMenu } from "./UserAccountMenu"

export function Sidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("nav")
  const lp = (path: string) => `/${locale}${path}`

  const navItems = [
    { href: lp("/dashboard"), icon: LayoutDashboard, label: t("dashboard") },
    { href: lp("/products"), icon: Package, label: t("products") },
    { href: lp("/reports"), icon: FileText, label: t("reports") },
    { href: lp("/settings"), icon: Settings, label: t("settings") },
  ]

  const isActive = (segment: string) => pathname.includes(segment)

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-forest-deep border-r border-moss/20 h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-moss/20">
        <CompassLogo size={26} showWordmark href={lp("/dashboard")} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Sidebar navigation">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isActive(href.replace(`/${locale}`, ""))
          return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              active
                ? "bg-moss/60 text-bone"
                : "text-sage-mist/70 hover:text-bone hover:bg-moss/30"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={`w-4 h-4 flex-shrink-0 transition-colors ${
                active ? "text-brass" : "text-sage-mist/50 group-hover:text-brass/70"
              }`}
              strokeWidth={1.5}
            />
            {label}
            {active && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brass" />
            )}
          </Link>
        )})}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-moss/20 space-y-2">
        <div className="px-3">
          <LocaleSwitcher />
        </div>

        <UserAccountMenu variant="sidebar" />
      </div>
    </aside>
  )
}
