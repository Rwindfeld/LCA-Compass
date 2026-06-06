"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"
import {
  Users,
  Mail,
  Copy,
  Check,
  Trash2,
  Loader2,
  UserPlus,
  FlaskConical,
} from "lucide-react"
import { buildInvitePath } from "@/lib/products/product-invite-utils"

type Member = {
  id: string
  email: string
  role: string
  status: string
  inviteToken: string
}

type ProductMembersPanelProps = {
  productId: string
  compact?: boolean
}

export function ProductMembersPanel({ productId, compact = false }: ProductMembersPanelProps) {
  const t = useTranslations("productMembers")
  const locale = useLocale()
  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${productId}/members`)
      if (res.ok) {
        const data = await res.json()
        setMembers(data.members ?? [])
      }
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    void load()
  }, [load])

  const invite = async () => {
    if (!email.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/products/${productId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: "EDITOR" }),
      })
      if (res.ok) {
        setEmail("")
        await load()
      }
    } finally {
      setSending(false)
    }
  }

  const remove = async (memberId: string) => {
    await fetch(`/api/products/${productId}/members/${memberId}`, { method: "DELETE" })
    await load()
  }

  const copyInviteLink = async (member: Member) => {
    const path = buildInvitePath(locale, member.inviteToken)
    const url = `${window.location.origin}${path}`
    await navigator.clipboard.writeText(url)
    setCopiedId(member.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div
      className={
        compact
          ? "space-y-3"
          : "bg-parchment border border-sage-mist/30 rounded-xl p-5 shadow-compass space-y-4"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-moss" strokeWidth={1.5} />
          <div>
            <h3 className="text-sm font-semibold text-charcoal">{t("title")}</h3>
            {!compact && (
              <p className="text-xs text-ink/50 mt-0.5">{t("subtitle")}</p>
            )}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-brass/10 text-brass border border-brass/25">
          <FlaskConical className="w-3 h-3" strokeWidth={1.5} />
          {t("prototypeBadge")}
        </span>
      </div>

      <p className="text-xs text-ink/55 leading-relaxed bg-bone/80 border border-sage-mist/25 rounded-lg px-3 py-2">
        {t("prototypeNote")}
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={1.5} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && invite()}
            placeholder={t("emailPlaceholder")}
            className="w-full pl-9 pr-3 py-2.5 bg-bone border border-sage-mist/50 rounded-lg text-sm outline-none focus:border-brass focus:ring-2 focus:ring-brass/20"
          />
        </div>
        <button
          type="button"
          onClick={invite}
          disabled={sending || !email.trim()}
          className="inline-flex items-center gap-1.5 bg-forest-deep text-bone px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-moss disabled:opacity-50 flex-shrink-0"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" strokeWidth={1.5} />
          )}
          {t("invite")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-ink/30" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-xs text-ink/45 text-center py-3">{t("empty")}</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-2 bg-bone rounded-lg border border-sage-mist/25 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{m.email}</p>
                <p className="text-xs text-ink/45">
                  {t(`role.${m.role}`)} ·{" "}
                  <span
                    className={
                      m.status === "ACTIVE" ? "text-verified font-medium" : "text-amber-warn"
                    }
                  >
                    {t(`status.${m.status}`)}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => copyInviteLink(m)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-moss hover:bg-moss/10 transition-colors"
                  title={t("copyLink")}
                >
                  {copiedId === m.id ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                  )}
                  {copiedId === m.id ? t("copied") : t("copyLink")}
                </button>
                <Link
                  href={buildInvitePath(locale, m.inviteToken)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-ink/50 hover:text-charcoal hover:bg-parchment"
                >
                  {t("preview")}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="p-1.5 rounded-md text-ink/30 hover:text-coral hover:bg-coral/5"
                  aria-label={t("remove")}
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
