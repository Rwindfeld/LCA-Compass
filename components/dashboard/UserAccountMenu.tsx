"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { signOut } from "next-auth/react"
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from "lucide-react"

type UserAccountMenuProps = {
  variant?: "sidebar" | "topbar"
}

export function UserAccountMenu({ variant = "topbar" }: UserAccountMenuProps) {
  const t = useTranslations("nav")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSidebar = variant === "sidebar"

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  const handleSignOut = () => {
    setOpen(false)
    void signOut({ callbackUrl: `${window.location.origin}/${locale}/login` })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          isSidebar
            ? "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-moss/30 transition-all duration-200"
            : "flex items-center gap-2 p-2 rounded-lg hover:bg-parchment transition-colors"
        }
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div
          className={
            isSidebar
              ? "w-7 h-7 rounded-full bg-brass/20 border border-brass/30 flex items-center justify-center flex-shrink-0"
              : "w-8 h-8 rounded-full bg-forest-deep/10 border border-sage-mist/40 flex items-center justify-center flex-shrink-0"
          }
        >
          <User
            className={`w-3.5 h-3.5 ${isSidebar ? "text-brass" : "text-moss"}`}
            strokeWidth={1.5}
          />
        </div>
        {isSidebar ? (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-bone truncate">Rattana Nielsen</p>
              <p className="text-xs text-sage-mist/50 truncate">demo@lca-compass.dk</p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-sage-mist/40 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={1.5}
            />
          </>
        ) : (
          <>
            <span className="hidden md:inline text-sm font-medium text-charcoal max-w-[120px] truncate">
              Rattana Nielsen
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={1.5}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={
            isSidebar
              ? "absolute bottom-full left-0 right-0 mb-1 bg-bone border border-sage-mist/30 rounded-lg shadow-compass-lg py-1 z-50"
              : "absolute right-0 top-full mt-2 w-52 bg-parchment border border-sage-mist/40 rounded-xl shadow-compass-lg py-1 z-50"
          }
        >
          <p className="px-4 py-2 text-xs text-ink/50 border-b border-sage-mist/20 truncate">
            demo@lca-compass.dk
          </p>
          <Link
            href={`/${locale}/dashboard`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-bone/80 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-ink/50" strokeWidth={1.5} />
            {t("dashboard")}
          </Link>
          <Link
            href={`/${locale}/settings`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-bone/80 transition-colors"
          >
            <Settings className="w-4 h-4 text-ink/50" strokeWidth={1.5} />
            {t("settings")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-coral hover:bg-coral/5 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  )
}
