"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Download, Edit3, RefreshCw, ChevronRight, BookOpen } from "lucide-react"

interface Section {
  id: string
  label: string
}

interface ReportClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any
  sections: Section[]
  prose: Record<string, string>
}

function ProseStream({ text }: { text: string }) {
  const [shown, setShown] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setShown("")
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
        return
      }
      setShown(text.slice(0, (i += 6)))
    }, 15)
    return () => clearInterval(id)
  }, [text])

  return (
    <div className="prose-lca text-sm leading-relaxed text-ink whitespace-pre-wrap">
      {shown}
      {!done && <span className="cursor-blink">▌</span>}
    </div>
  )
}

function renderMarkdown(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-display font-bold text-forest-deep mt-6 mb-3 pb-2 border-b border-sage-mist/30">{line.slice(3)}</h2>
      if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-moss mt-4 mb-2">{line.slice(4)}</h3>
      if (line.startsWith("*") && line.endsWith("*")) return <p key={i} className="italic text-ink/80 my-2">{line.slice(1, -1)}</p>
      if (!line.trim()) return <br key={i} />
      return <p key={i} className="text-sm text-ink leading-relaxed mb-2">{line}</p>
    })
}

export function ReportClient({ product, sections, prose }: ReportClientProps) {
  const params = useParams()
  const id = params.id as string
  const locale = useLocale()
  const lp = (path: string) => `/${locale}${path}`
  const t = useTranslations("report")
  const tp = useTranslations("productDetail")
  const [activeSection, setActiveSection] = useState(sections[0]?.id)
  const [editMode, setEditMode] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [localProse, setLocalProse] = useState(prose)
  const [streaming, setStreaming] = useState(false)

  const handleEdit = (sectionId: string) => {
    setEditMode(sectionId)
    setEditContent(localProse[sectionId] ?? "")
  }

  const handleSaveEdit = (sectionId: string) => {
    setLocalProse((p) => ({ ...p, [sectionId]: editContent }))
    setEditMode(null)
  }

  const handleRegenerate = async (sectionId: string) => {
    setStreaming(true)
    try {
      const res = await fetch("/api/lca/prose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionId,
          productId: id,
          variantSeed: Math.floor(Math.random() * 1000),
        }),
      })
      const data = await res.json()
      if (data.prose) {
        setLocalProse((p) => ({ ...p, [sectionId]: data.prose }))
      }
    } catch { /* silent */ }
    finally { setStreaming(false) }
  }

  return (
    <div className="max-w-6xl mx-auto flex gap-8 -m-6 lg:-m-8">
      {/* TOC Sidebar */}
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-parchment border-r border-sage-mist/30 min-h-full p-5">
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-ink/40 mb-2">
            <Link href={lp(`/products/${id}`)} className="hover:text-moss transition-colors">{tp("backToProducts")}</Link>
            <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
            <span>{tp("tabs.report")}</span>
          </div>
          <h2 className="text-sm font-semibold text-charcoal">{t("toc")}</h2>
        </div>

        <nav className="space-y-0.5 flex-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSection === s.id
                  ? "bg-forest-deep text-bone"
                  : "text-ink/60 hover:text-charcoal hover:bg-sage-mist/20"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-sage-mist/20">
          <Link
            href={lp(`/products/${id}/export`)}
            className="w-full flex items-center gap-2 bg-brass/10 border border-brass/20 hover:bg-brass/20 text-forest-deep rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            {t("exportPdf")}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="mb-6 pb-4 border-b border-sage-mist/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-moss" strokeWidth={1.5} />
                <span className="text-xs text-moss font-medium uppercase tracking-wide">{t("title")}</span>
              </div>
              <h1 className="text-xl font-display font-bold text-charcoal">{product.name}</h1>
              <p className="text-xs text-ink/40 mt-0.5">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-mono bg-verified/10 text-verified border border-verified/20 px-2.5 py-1 rounded-full">
                {product.complianceScore}% compliant
              </span>
            </div>
          </div>
        </div>

        {sections.map((section) => (
          <motion.div
            key={section.id}
            className={activeSection === section.id ? "block" : "hidden"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-sage-mist/20 bg-bone/50">
                <h2 className="text-base font-semibold text-charcoal">{section.label}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRegenerate(section.id)}
                    disabled={streaming}
                    className="inline-flex items-center gap-1.5 text-xs text-moss hover:text-forest-deep transition-colors px-3 py-1.5 rounded-lg hover:bg-sage-mist/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${streaming ? "animate-spin" : ""}`} strokeWidth={1.5} />
                    {t("rewrite")}
                  </button>
                  <button
                    onClick={() => handleEdit(section.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-moss hover:text-forest-deep transition-colors px-3 py-1.5 rounded-lg hover:bg-sage-mist/20"
                  >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {t("editBtn")}
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                {editMode === section.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={20}
                      className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm font-mono outline-none resize-y"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleSaveEdit(section.id)}
                        className="px-4 py-2 bg-forest-deep text-bone rounded-lg text-sm font-medium hover:bg-moss transition-colors"
                      >
                        {t("saveChanges")}
                      </button>
                      <button
                        onClick={() => setEditMode(null)}
                        className="px-4 py-2 border border-sage-mist/40 text-ink rounded-lg text-sm hover:border-forest-deep transition-colors"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : streaming && activeSection === section.id ? (
                  <ProseStream text={localProse[section.id] ?? ""} />
                ) : (
                  <div className="prose-lca">
                    {renderMarkdown(localProse[section.id] ?? "")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection)
                  if (idx > 0) setActiveSection(sections[idx - 1].id)
                }}
                className="text-sm text-moss hover:text-forest-deep transition-colors disabled:opacity-30"
                disabled={sections[0].id === activeSection}
              >
                {t("prevSection")}
              </button>
              <button
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection)
                  if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id)
                }}
                className="text-sm text-moss hover:text-forest-deep transition-colors disabled:opacity-30"
                disabled={sections[sections.length - 1].id === activeSection}
              >
                {t("nextSection")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
