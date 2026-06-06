"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Search, Loader2 } from "lucide-react"

type SearchProduct = {
  id: string
  name: string
  description: string | null
  productType: string
  status: string
  complianceScore: number
}

type ProductSearchProps = {
  className?: string
  inputClassName?: string
  surfaceClassName?: string
  /** Prefill query (e.g. from URL on products page). */
  initialQuery?: string
  /** Called when query changes (for syncing products list filter). */
  onQueryChange?: (query: string) => void
  /** Navigate to products list with ?q= on Enter when no result is focused. */
  showViewAllLink?: boolean
  /** filter: only emit query (products page). dropdown: global search with suggestions. */
  mode?: "dropdown" | "filter"
}

export function ProductSearch({
  className = "",
  inputClassName = "",
  initialQuery = "",
  onQueryChange,
  showViewAllLink = true,
  mode = "dropdown",
  surfaceClassName,
}: ProductSearchProps) {
  const t = useTranslations("nav")
  const tProducts = useTranslations("products")
  const locale = useLocale()
  const router = useRouter()
  const listId = useId()

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const fetchResults = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const params = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""
      const res = await fetch(`/api/products${params}`)
      if (!res.ok) throw new Error("search failed")
      const data = (await res.json()) as { products: SearchProduct[] }
      setResults(data.products)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onQueryChange?.(query)
      if (mode === "dropdown" && open) fetchResults(query)
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, open, fetchResults, onQueryChange, mode])

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  const itemCount = results.length + (showViewAllLink && query.trim() ? 1 : 0)

  const goToProductsList = () => {
    const q = query.trim()
    setOpen(false)
    router.push(q ? `/${locale}/products?q=${encodeURIComponent(q)}` : `/${locale}/products`)
  }

  const selectResult = (product: SearchProduct) => {
    setOpen(false)
    setQuery("")
    setActiveIndex(-1)
    router.push(`/${locale}/products/${product.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
      return
    }

    if (mode === "dropdown" && !open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true)
      void fetchResults(query)
      return
    }

    if (!open) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i < itemCount - 1 ? i + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i > 0 ? i - 1 : itemCount - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < results.length) {
        selectResult(results[activeIndex])
      } else if (activeIndex === results.length && showViewAllLink && query.trim()) {
        goToProductsList()
      } else if (query.trim()) {
        goToProductsList()
      }
    }
  }

  const showDropdown =
    mode === "dropdown" && open && (loading || results.length > 0 || query.trim())

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={
          surfaceClassName ??
          "flex items-center gap-2 bg-parchment border border-sage-mist/30 rounded-lg px-3 py-2 group focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/10 transition-all"
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-ink/30 flex-shrink-0 animate-spin" strokeWidth={1.5} />
        ) : (
          <Search className="w-4 h-4 text-ink/30 flex-shrink-0" strokeWidth={1.5} />
        )}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => {
            setOpen(true)
            void fetchResults(query)
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("searchProducts")}
          className={`bg-transparent text-sm text-charcoal placeholder:text-ink/30 outline-none w-full min-w-0 ${inputClassName}`}
          aria-label={t("searchProducts")}
          aria-expanded={!!showDropdown}
          aria-controls={showDropdown ? listId : undefined}
          aria-autocomplete="list"
          role="combobox"
        />
      </div>

      {showDropdown && (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] sm:w-80 max-h-72 overflow-y-auto bg-parchment border border-sage-mist/40 rounded-xl shadow-compass-lg py-1"
        >
          {loading && results.length === 0 && (
            <li className="px-4 py-3 text-xs text-ink/50">{t("searchLoading")}</li>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <li className="px-4 py-3 text-xs text-ink/50">{t("searchNoResults")}</li>
          )}

          {results.map((product, i) => (
            <li key={product.id} role="option" aria-selected={activeIndex === i}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => selectResult(product)}
                className={`w-full text-left px-4 py-2.5 transition-colors ${
                  activeIndex === i ? "bg-forest-deep/5" : "hover:bg-bone/80"
                }`}
              >
                <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                <p className="text-xs text-ink/50 truncate">
                  {tProducts(`type.${product.productType}`)} · {tProducts(`status.${product.status}`)}
                </p>
              </button>
            </li>
          ))}

          {showViewAllLink && query.trim() && (
            <li role="option" aria-selected={activeIndex === results.length}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(results.length)}
                onClick={goToProductsList}
                className={`w-full text-left px-4 py-2.5 text-xs font-medium text-moss border-t border-sage-mist/20 transition-colors ${
                  activeIndex === results.length ? "bg-forest-deep/5" : "hover:bg-bone/80"
                }`}
              >
                {t("searchViewAll", { query })}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
