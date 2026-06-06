"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Mail, CheckCircle, Loader2, ArrowRight, FlaskConical } from "lucide-react"

type InviteInfo = {
  email: string
  role: string
  status: string
  productId: string
  productName: string
}

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>()
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations("inviteAccept")
  const [info, setInfo] = useState<InviteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    fetch(`/api/invites/${token}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setInfo(data)
        if (data?.status === "ACTIVE") setAccepted(true)
      })
      .finally(() => setLoading(false))
  }, [token])

  const accept = async () => {
    setAccepting(true)
    try {
      const res = await fetch(`/api/invites/${token}`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setAccepted(true)
        setInfo((prev) =>
          prev ? { ...prev, status: "ACTIVE", productId: data.productId } : prev
        )
      }
    } finally {
      setAccepting(false)
    }
  }

  const lp = (path: string) => `/${locale}${path}`

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-moss" />
      </div>
    )
  }

  if (!info) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-charcoal font-semibold">{t("notFound")}</p>
        <Link href={lp("/dashboard")} className="text-sm text-moss mt-4 inline-block">
          {t("backDashboard")}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-parchment border border-sage-mist/30 rounded-2xl p-8 shadow-compass text-center space-y-5"
      >
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-brass/10 text-brass border border-brass/25">
          <FlaskConical className="w-3 h-3" />
          {t("prototypeBadge")}
        </span>

        <div className="w-14 h-14 rounded-full bg-moss/10 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 text-moss" strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="text-xl font-display font-bold text-charcoal">{t("title")}</h1>
          <p className="text-sm text-ink/60 mt-2">{t("invitedTo")}</p>
          <p className="text-lg font-semibold text-forest-deep mt-1">{info.productName}</p>
        </div>

        <div className="text-left bg-bone rounded-lg border border-sage-mist/25 px-4 py-3 text-sm space-y-1">
          <p>
            <span className="text-ink/45">{t("email")}: </span>
            <span className="font-medium text-charcoal">{info.email}</span>
          </p>
          <p>
            <span className="text-ink/45">{t("access")}: </span>
            <span className="font-medium text-charcoal">{t("accessDesc")}</span>
          </p>
        </div>

        <p className="text-xs text-ink/50 leading-relaxed">{t("prototypeNote")}</p>

        {accepted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-verified">
              <CheckCircle className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm font-semibold">{t("accepted")}</span>
            </div>
            <Link
              href={lp(`/products/${info.productId}`)}
              className="inline-flex items-center gap-2 bg-forest-deep text-bone px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-moss transition-colors"
            >
              {t("openProduct")}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={accept}
            disabled={accepting}
            className="w-full inline-flex items-center justify-center gap-2 bg-forest-deep text-bone px-5 py-3 rounded-lg text-sm font-semibold hover:bg-moss disabled:opacity-50"
          >
            {accepting && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("acceptDemo")}
          </button>
        )}
      </motion.div>
    </div>
  )
}
