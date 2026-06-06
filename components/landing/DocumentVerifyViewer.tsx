"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ShieldCheck, Printer, ArrowLeft, BadgeCheck } from "lucide-react"

export type VerifiedDocument = {
  documentId: string
  productName: string
  complianceScore: number
  locale: string
  formatLabel: string
  issuedAt: string
  html: string
}

type DocumentVerifyViewerProps = {
  document: VerifiedDocument
  backHref: string
}

export function DocumentVerifyViewer({ document, backHref }: DocumentVerifyViewerProps) {
  const t = useTranslations("landing.verify")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const issuedDate = new Date(document.issuedAt).toLocaleDateString(
    document.locale === "en" ? "en-GB" : "da-DK",
    { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
  )

  const handlePrint = () => iframeRef.current?.contentWindow?.print()

  return (
    <div className="min-h-screen bg-bone">
      <div className="bg-forest-deep text-bone border-b border-moss/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs text-bone/60 hover:text-bone mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            {t("back")}
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-verified/20 text-verified border border-verified/30 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} />
                {t("verifiedBadge")}
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">{t("viewerTitle")}</h1>
              <p className="text-bone/70 text-sm max-w-xl">{t("viewerSubtitle")}</p>
            </div>

            <div className="flex items-center gap-4 bg-bone/10 border border-bone/20 rounded-2xl p-4 flex-shrink-0">
              <Image
                src="/lca-stamp.png"
                alt="LCA Compass"
                width={72}
                height={72}
                className="opacity-95"
              />
              <div className="text-sm">
                <p className="font-semibold text-brass">LCA Compass</p>
                <p className="text-bone/60 text-xs mt-0.5">lca-compass.dk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-parchment border border-sage-mist/40 rounded-2xl p-5 sm:p-6 shadow-compass grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">{t("meta.id")}</p>
            <p className="font-mono font-semibold text-charcoal">#{document.documentId}</p>
          </div>
          <div>
            <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">{t("meta.product")}</p>
            <p className="font-medium text-charcoal">{document.productName}</p>
          </div>
          <div>
            <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">{t("meta.issued")}</p>
            <p className="text-charcoal">{issuedDate}</p>
          </div>
          <div>
            <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">{t("meta.format")}</p>
            <p className="text-charcoal">{document.formatLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 text-sm text-moss bg-verified/10 border border-verified/20 px-4 py-2 rounded-lg">
            <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            {t("officialNotice")}
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-forest-deep text-bone hover:bg-moss transition-colors px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Printer className="w-4 h-4" strokeWidth={1.5} />
            {t("print")}
          </button>
        </div>

        <div className="bg-white border border-sage-mist/40 rounded-2xl overflow-hidden shadow-compass-lg min-h-[70vh]">
          <iframe
            ref={iframeRef}
            srcDoc={document.html}
            title={t("iframeTitle", { id: document.documentId })}
            className="w-full min-h-[70vh] border-0"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
