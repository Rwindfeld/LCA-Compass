"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Search, ShieldCheck, FileCheck2, Loader2 } from "lucide-react"
import { normalizeDocumentId } from "@/lib/lca/document-id"

export function DocumentVerifySection() {
  const t = useTranslations("landing.verify")
  const locale = useLocale()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = normalizeDocumentId(query)
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/documents/verify?id=${encodeURIComponent(id)}`)
      if (!res.ok) {
        setError(res.status === 400 ? t("errors.invalid") : t("errors.notFound"))
        return
      }
      router.push(`/${locale}/verify/${id}`)
    } catch {
      setError(t("errors.generic"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="verify" className="py-20 lg:py-28 bg-forest-deep text-bone relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none bg-grid-pattern"
        aria-hidden
      />

      <div className="max-w-3xl mx-auto px-6 relative">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-brass" strokeWidth={1.5} />
          <p className="text-xs uppercase tracking-widest text-bone/60 font-medium">
            {t("eyebrow")}
          </p>
        </div>

        <h2 className="text-2xl lg:text-3xl font-display font-bold text-center mb-3">
          {t("title")}
        </h2>
        <p className="text-center text-bone/70 text-sm lg:text-base leading-relaxed mb-8 max-w-xl mx-auto">
          {t("subtitle")}
        </p>

        <form
          onSubmit={handleVerify}
          className="bg-bone/10 border border-bone/20 rounded-2xl p-4 sm:p-5 backdrop-blur-sm"
        >
          <label htmlFor="document-id" className="block text-xs font-medium text-bone/70 mb-2">
            {t("inputLabel")}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/40"
                strokeWidth={1.5}
              />
              <input
                id="document-id"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setError(null)
                }}
                placeholder={t("placeholder")}
                className="w-full bg-bone text-charcoal rounded-xl pl-10 pr-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-brass/40 border border-transparent"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 disabled:opacity-50 transition-colors px-6 py-3 rounded-xl text-sm font-semibold shadow-brass-glow flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : (
                <FileCheck2 className="w-4 h-4" strokeWidth={2} />
              )}
              {t("submit")}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-coral/90" role="alert">
              {error}
            </p>
          )}
          <p className="mt-3 text-xs text-bone/50">{t("hint")}</p>
        </form>

        <ul className="mt-8 grid sm:grid-cols-3 gap-4 text-center text-xs text-bone/60">
          <li className="bg-bone/5 rounded-xl px-4 py-3 border border-bone/10">
            {t("trust.seal")}
          </li>
          <li className="bg-bone/5 rounded-xl px-4 py-3 border border-bone/10">
            {t("trust.data")}
          </li>
          <li className="bg-bone/5 rounded-xl px-4 py-3 border border-bone/10">
            {t("trust.timestamp")}
          </li>
        </ul>
      </div>
    </section>
  )
}
