"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Plus, ChevronRight } from "lucide-react"
import { ProductSearch } from "./ProductSearch"
import { UserAccountMenu } from "./UserAccountMenu"

// Detect Prisma CUID / ULID / UUID patterns so we can skip raw IDs in breadcrumbs
function isId(segment: string): boolean {
  return segment.length > 16 && /^[a-z0-9]+$/i.test(segment)
}

interface Crumb {
  label: string
  href: string
  isLast: boolean
}

export function TopBar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations("nav")

  const breadcrumbLabels: Record<string, string> = {
    dashboard: t("dashboard"),
    products: t("products"),
    new: t("newProduct"),
    wizard: "Wizard",
    compliance: "Compliance",
    report: t("report"),
    export: t("export"),
    compare: t("compare"),
    guide: t("guide"),
    settings: t("settings"),
  }

  // Build breadcrumbs, stripping CUID/ID segments from labels but keeping them in hrefs
  const rawParts = pathname
    .replace(/^\/(da|en)/, "")
    .split("/")
    .filter(Boolean)

  const crumbs: Crumb[] = []
  let cumulativePath = `/${locale}`

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i]
    cumulativePath += "/" + part

    if (isId(part)) {
      // Skip ID in display — the path accumulates so next segment gets correct href
      continue
    }

    // Step numbers in wizard → "Step X"
    const label = breadcrumbLabels[part]
      ?? (!isNaN(parseInt(part)) ? `Step ${part}` : null)

    if (label) {
      crumbs.push({ label, href: cumulativePath, isLast: false })
    }
  }

  // Mark the last one
  if (crumbs.length > 0) {
    crumbs[crumbs.length - 1].isLast = true
  }

  return (
    <header className="bg-bone border-b border-sage-mist/30 px-4 lg:px-6 py-3 flex items-center gap-3 flex-shrink-0 min-h-[52px]">
      {/* Logo on mobile (sidebar is hidden) */}
      <Link
        href={`/${locale}/dashboard`}
        className="lg:hidden flex-shrink-0"
        aria-label="Dashboard"
      >
        <span className="text-sm font-display font-bold text-forest-deep tracking-tight">LCA</span>
      </Link>

      {/* Breadcrumb */}
      <nav aria-label="Brødsti" className="flex items-center gap-1 text-sm min-w-0 flex-1 overflow-hidden">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1 min-w-0 flex-shrink-0">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-ink/30 flex-shrink-0" strokeWidth={1.5} />
            )}
            {crumb.isLast ? (
              <span className="font-medium text-charcoal truncate max-w-[140px] sm:max-w-none">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-ink/50 hover:text-moss truncate transition-colors hidden sm:block"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Search — kun fra sm */}
      <ProductSearch className="hidden sm:block w-40 md:w-64 flex-shrink-0" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Link
          href={`/${locale}/products/new`}
          className="inline-flex items-center gap-1.5 bg-forest-deep text-bone hover:bg-moss active:bg-moss transition-colors duration-200 px-3 py-2 rounded-lg text-sm font-medium shadow-compass"
          aria-label={t("newProduct")}
        >
          <Plus className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
          <span className="hidden sm:inline">{t("newProduct")}</span>
        </Link>

        <UserAccountMenu variant="topbar" />
      </div>
    </header>
  )
}
