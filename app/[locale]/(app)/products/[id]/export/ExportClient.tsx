"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import {
  FileText,
  Award,
  Leaf,
  GitCompare,
  Check,
  ChevronDown,
  Download,
  Loader2,
  ChevronRight,
  Lock,
  X,
  Printer,
} from "lucide-react"

import {
  EXPORT_FORMAT_IDS,
  getExportFormatAvailability,
  getExportFormatRecommended,
  type ExportFormatId,
} from "@/lib/lca/export-formats"

const FORMAT_ICONS = { ISO_14044_FULL: FileText, EPD_ISO_14025: Award, CARBON_FOOTPRINT_14067: Leaf, COMPARATIVE_ASSERTION: GitCompare }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ExportClient({ product }: { product: any }) {
  const formatAvailable = getExportFormatAvailability(
    product.ambitionLevel ?? "SCREENING",
    product.scenarioCount ?? 0
  )
  const formatRecommended = getExportFormatRecommended(formatAvailable)
  const params = useParams()
  const id = params.id as string
  const locale = useLocale()
  const lp = (path: string) => `/${locale}${path}`
  const t = useTranslations("exportReport")
  const tp = useTranslations("productDetail")

  const defaultFormat: ExportFormatId = formatAvailable.EPD_ISO_14025
    ? "EPD_ISO_14025"
    : "ISO_14044_FULL"
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatId>(defaultFormat)
  const [language, setLanguage] = useState<"da" | "en">("da")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [options, setOptions] = useState({
    includeAppendices: true,
    showDqi: true,
    anonymize: false,
    newVersion: false,
  })
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { documentId?: string | null } | null) => {
        if (data?.documentId) setCurrentDocumentId(data.documentId)
      })
      .catch(() => {})
  }, [id])

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerateError(null)
    try {
      const res = await fetch(`/api/lca/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          format: selectedFormat,
          locale: language,
          options,
          newVersion: options.newVersion,
        }),
      })
      const body = await res.text()
      if (!res.ok) {
        let message = t("generateError")
        try {
          const json = JSON.parse(body) as { error?: string; detail?: string }
          if (json.detail) message = json.detail
          else if (json.error) message = json.error
        } catch {
          /* HTML or plain text error body */
        }
        setGenerateError(message)
        return
      }
      const issuedId = res.headers.get("X-LCA-Document-Id")
      setPreviewHtml(body)
      setDocumentId(issuedId)
      if (issuedId) setCurrentDocumentId(issuedId)
    } catch {
      setGenerateError(t("generateError"))
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = () => { iframeRef.current?.contentWindow?.print() }
  const handleClose = () => {
    setPreviewHtml(null)
    setDocumentId(null)
  }

  return (
    <>
    <AnimatePresence>
      {previewHtml && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-5 py-3 bg-charcoal text-bone flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-brass flex-shrink-0" strokeWidth={1.5} />
              <div className="min-w-0">
                <span className="text-sm font-semibold block truncate">LCA — {product.name}</span>
                {documentId && (
                  <Link
                    href={lp(`/verify/${documentId}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brass/90 hover:text-brass font-mono block"
                  >
                    ID: #{documentId} · {t("documentIdHint")}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-brass text-forest-deep hover:bg-brass/90 transition-colors px-4 py-2 rounded-lg font-semibold text-sm"
              >
                <Printer className="w-4 h-4" strokeWidth={2} />
                Save as PDF / Print
              </button>
              <button
                onClick={handleClose}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm"
              >
                <X className="w-4 h-4" strokeWidth={2} />
                Close
              </button>
            </div>
          </div>
          <iframe ref={iframeRef} srcDoc={previewHtml} className="flex-1 w-full bg-white" title="LCA report preview" />
        </motion.div>
      )}
    </AnimatePresence>

    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-1.5 text-xs text-ink/40 mb-1">
          <Link href={lp(`/products/${id}`)} className="hover:text-moss transition-colors">{tp("backToProducts")}</Link>
          <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
          <span>{tp("tabs.export")}</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-charcoal">{t("title")}</h1>
        <p className="text-sm text-ink/50 mt-1">{product.name}</p>
      </motion.div>

      {/* Format selection */}
      <div>
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-widest mb-4">{t("formatTitle")}</h2>
        <div className="space-y-3">
          {EXPORT_FORMAT_IDS.map((fid) => {
            const Icon = FORMAT_ICONS[fid]
            const available = formatAvailable[fid]
            const recommended = formatRecommended[fid]
            const isSelected = selectedFormat === fid
            const title = t(`formats.${fid}.title`)
            const description = t(`formats.${fid}.desc`)

            return (
              <div
                key={fid}
                role="radio"
                aria-checked={isSelected}
                tabIndex={available ? 0 : -1}
                onClick={() => { if (available) setSelectedFormat(fid) }}
                onKeyDown={(e) => { if (available && (e.key === "Enter" || e.key === " ")) setSelectedFormat(fid) }}
                className={[
                  "relative w-full text-left p-5 rounded-xl border-2 transition-all select-none",
                  available ? "cursor-pointer" : "cursor-not-allowed",
                  isSelected && available
                    ? "border-forest-deep bg-forest-deep/5 shadow-compass ring-2 ring-forest-deep/20"
                    : available
                      ? "border-sage-mist/40 bg-parchment hover:border-brass/60 hover:bg-parchment hover:shadow-compass active:border-forest-deep active:bg-forest-deep/5"
                      : "border-sage-mist/20 bg-bone/40 opacity-55",
                ].join(" ")}
              >
                <div className="flex items-start gap-4">
                  {/* Radio indicator */}
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    isSelected && available
                      ? "border-forest-deep bg-forest-deep"
                      : available
                        ? "border-sage-mist/60 bg-bone"
                        : "border-sage-mist/30 bg-bone/50"
                  }`}>
                    {isSelected && available && <div className="w-2 h-2 rounded-full bg-bone" />}
                  </div>

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected && available ? "bg-forest-deep text-bone" : "bg-sage-mist/20 text-ink/50"
                  }`}>
                    {available ? <Icon className="w-5 h-5" strokeWidth={1.5} /> : <Lock className="w-5 h-5" strokeWidth={1.5} />}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${available ? "text-charcoal" : "text-ink/40"}`}>{title}</span>
                      {recommended && (
                        <span className="text-xs bg-verified/10 text-verified border border-verified/20 px-2 py-0.5 rounded-full font-medium">
                          {t("recommended")}
                        </span>
                      )}
                      {!available && (
                        <span className="text-xs bg-amber-warn/10 text-amber-warn border border-amber-warn/20 px-2 py-0.5 rounded-full">
                          {fid === "EPD_ISO_14025" ? t("requiresEpd") : t("requiresScenarios")}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 leading-relaxed ${available ? "text-ink/60" : "text-ink/35"}`}>{description}</p>
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && available && (
                    <Check className="w-5 h-5 text-verified flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Language */}
      <div>
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-widest mb-4">{t("languageTitle")}</h2>
        <div className="flex gap-3">
          {[
            { value: "da" as const, label: t("danish"), flag: "🇩🇰" },
            { value: "en" as const, label: t("english"), flag: "🇬🇧" },
          ].map(({ value, label, flag }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLanguage(value)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 cursor-pointer transition-all select-none ${
                language === value
                  ? "border-forest-deep bg-forest-deep/5 shadow-compass ring-2 ring-forest-deep/20"
                  : "border-sage-mist/40 bg-parchment hover:border-brass/60 hover:shadow-compass"
              }`}
            >
              <span className="text-2xl">{flag}</span>
              <span className="text-sm font-medium text-charcoal">{label}</span>
              {language === value
                ? <Check className="w-4 h-4 text-verified ml-1" strokeWidth={2.5} />
                : <div className="w-4 h-4 ml-1 rounded-full border-2 border-sage-mist/40" />
              }
            </button>
          ))}
        </div>
      </div>

      {/* Advanced options */}
      <div className="bg-parchment border border-sage-mist/30 rounded-xl shadow-compass overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-bone/50 transition-colors"
        >
          <span className="text-sm font-semibold text-charcoal">{t("advancedTitle")}</span>
          <ChevronDown className={`w-4 h-4 text-ink/40 transition-transform ${showAdvanced ? "rotate-180" : ""}`} strokeWidth={1.5} />
        </button>

        {showAdvanced && (
          <div className="px-5 pb-5 space-y-3">
            {([
              { key: "includeAppendices" as const, label: t("includeAppendices") },
              { key: "showDqi" as const, label: t("showDqi") },
              { key: "anonymize" as const, label: t("anonymize") },
            ] as { key: "includeAppendices" | "showDqi" | "anonymize"; label: string }[]).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setOptions((o) => ({ ...o, [key]: !o[key] }))}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    options[key] ? "bg-forest-deep border-forest-deep" : "border-sage-mist"
                  }`}
                >
                  {options[key] && <Check className="w-3 h-3 text-bone" strokeWidth={3} />}
                </div>
                <span className="text-sm text-charcoal">{label}</span>
              </label>
            ))}
            <label className="flex items-start gap-3 cursor-pointer pt-1 border-t border-sage-mist/20">
              <div
                onClick={() => setOptions((o) => ({ ...o, newVersion: !o.newVersion }))}
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  options.newVersion ? "bg-forest-deep border-forest-deep" : "border-sage-mist"
                }`}
              >
                {options.newVersion && <Check className="w-3 h-3 text-bone" strokeWidth={3} />}
              </div>
              <span className="text-sm text-charcoal">
                {t("newVersionLabel")}
                {currentDocumentId && !options.newVersion && (
                  <span className="block text-xs text-ink/50 font-mono mt-1">
                    {t("currentStampId", { id: currentDocumentId })}
                  </span>
                )}
              </span>
            </label>
          </div>
        )}
      </div>

      {generateError && (
        <p className="text-sm text-coral bg-coral/10 border border-coral/20 rounded-xl px-4 py-3" role="alert">
          {generateError}
        </p>
      )}

      {/* Generate button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 flex items-center justify-center gap-3 bg-brass text-forest-deep hover:bg-brass/90 transition-colors duration-200 px-8 py-4 rounded-xl font-bold text-base shadow-brass-glow disabled:opacity-60"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
              {t("generating")}
            </>
          ) : (
            <>
              <Download className="w-5 h-5" strokeWidth={2} />
              {t("generateBtn")}
            </>
          )}
        </button>
      </div>
    </div>
    </>
  )
}
