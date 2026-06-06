"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useLocale, useTranslations } from "next-intl"
import {
  Loader2, ArrowRight, Cpu, Radio, Shirt, Armchair,
  UtensilsCrossed, Package, HardHat, Shapes,
  type LucideIcon,
} from "lucide-react"

const PRODUCT_TYPES: { value: string; icon: LucideIcon }[] = [
  { value: "ELECTRONICS",       icon: Cpu },
  { value: "SOFTWARE_HARDWARE", icon: Radio },
  { value: "TEXTILE",           icon: Shirt },
  { value: "FURNITURE",         icon: Armchair },
  { value: "FOOD",              icon: UtensilsCrossed },
  { value: "PACKAGING",         icon: Package },
  { value: "CONSTRUCTION",      icon: HardHat },
  { value: "OTHER",             icon: Shapes },
]

const AMBITION_LEVELS = ["SCREENING", "DETAILED", "CRITICAL_REVIEWED", "EPD_VERIFIED"] as const

export default function NewProductPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("newProduct")
  const [name, setName] = useState("")
  const [productType, setProductType] = useState("")
  const [description, setDescription] = useState("")
  const [ambitionLevel, setAmbitionLevel] = useState("SCREENING")
  const [creating, setCreating] = useState(false)
  const [inviteEmails, setInviteEmails] = useState("")

  const handleCreate = async () => {
    if (!name || !productType) return
    setCreating(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          productType,
          description,
          ambitionLevel,
          inviteEmails: inviteEmails.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.product) {
        router.push(`/${locale}/products/${data.product.id}/wizard/1`)
      }
    } catch {
      setCreating(false)
    }
  }

  const isValid = name.length > 0 && productType !== ""

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-charcoal mb-1">{t("title")}</h1>
        <p className="text-sm text-ink/60">{t("subtitle")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-parchment border border-sage-mist/30 rounded-2xl p-6 shadow-compass space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            {t("nameLabel")} <span className="text-coral text-xs">{t("required")}</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm font-sans outline-none transition-all"
            autoFocus
          />
        </div>

        {/* Product type */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-3">
            {t("typeLabel")} <span className="text-coral text-xs">{t("required")}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRODUCT_TYPES.map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setProductType(value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all active:scale-95 ${
                  productType === value
                    ? "border-forest-deep bg-forest-deep shadow-compass"
                    : "border-sage-mist/40 hover:border-forest-deep/40 bg-bone"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  productType === value ? "bg-white/15" : "bg-forest-deep/10"
                }`}>
                  <Icon className={`w-4 h-4 ${productType === value ? "text-bone" : "text-forest-deep"}`} strokeWidth={1.75} />
                </div>
                <span className={`text-xs font-medium leading-tight break-words w-full ${productType === value ? "text-bone" : "text-charcoal"}`}>
                  {t(`types.${value}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            {t("descLabel")} <span className="text-ink/40 text-xs">{t("optional")}</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descPlaceholder")}
            rows={3}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none resize-none"
          />
        </div>

        {/* Ambition level */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-3">{t("ambitionLabel")}</label>
          <div className="grid grid-cols-2 gap-2">
            {AMBITION_LEVELS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmbitionLevel(value)}
                className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${
                  ambitionLevel === value
                    ? "border-brass bg-brass/5 shadow-brass-glow"
                    : "border-sage-mist/40 hover:border-brass/40"
                }`}
              >
                <p className="font-semibold text-charcoal">{t(`ambitions.${value}.label`)}</p>
                <p className="text-ink/40 mt-0.5">{t(`ambitions.${value}.desc`)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-sage-mist/25 pt-5">
          <label className="block text-sm font-medium text-charcoal mb-1">
            {t("inviteLabel")}{" "}
            <span className="text-ink/40 text-xs font-normal">{t("optional")}</span>
          </label>
          <p className="text-xs text-ink/50 mb-2">{t("inviteHint")}</p>
          <input
            type="text"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
            placeholder={t("invitePlaceholder")}
            className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={!isValid || creating}
          className="w-full flex items-center justify-center gap-2 bg-forest-deep text-bone hover:bg-moss transition-colors duration-200 px-6 py-4 rounded-xl font-semibold text-base shadow-compass disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
              {t("creating")}
            </>
          ) : (
            <>
              {t("startWizard")}
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  )
}
