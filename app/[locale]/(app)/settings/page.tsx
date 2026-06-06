"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { User, Building2, Globe, Bell, Key, Save, Check } from "lucide-react"

type SaveState = "idle" | "saving" | "saved" | "error"

function useSaveUser() {
  const [state, setState] = useState<SaveState>("idle")

  const save = async (payload: { name?: string; company?: string }) => {
    setState("saving")
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setState("saved")
      setTimeout(() => setState("idle"), 2500)
    } catch {
      setState("error")
      setTimeout(() => setState("idle"), 2500)
    }
  }

  return { save, state }
}

export default function SettingsPage() {
  const t = useTranslations("settings")
  const tCommon = useTranslations("common")

  const tabs = [
    { id: "profile", label: t("profile"), icon: User },
    { id: "company", label: t("company"), icon: Building2 },
    { id: "language", label: t("language"), icon: Globe },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "api", label: t("api"), icon: Key },
  ]

  const [activeTab, setActiveTab] = useState("profile")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const { save, state } = useSaveUser()

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((u) => {
        if (u.name) setName(u.name)
        if (u.company) setCompany(u.company ?? "")
        if (u.email) setEmail(u.email)
      })
      .catch(() => {})
  }, [])

  const SaveButton = ({ payload }: { payload: { name?: string; company?: string } }) => (
    <button
      onClick={() => save(payload)}
      disabled={state === "saving"}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        state === "saved"
          ? "bg-verified text-bone"
          : state === "error"
            ? "bg-coral text-bone"
            : "bg-forest-deep text-bone hover:bg-moss"
      } disabled:opacity-60`}
    >
      {state === "saving" ? (
        <span className="w-4 h-4 border-2 border-bone/40 border-t-bone rounded-full animate-spin" />
      ) : state === "saved" ? (
        <Check className="w-4 h-4" strokeWidth={2} />
      ) : (
        <Save className="w-4 h-4" strokeWidth={1.5} />
      )}
      {state === "saved" ? tCommon("saved") : state === "error" ? tCommon("error") : tCommon("save")}
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-charcoal">{t("title")}</h1>
      </motion.div>

      {/* Tabs på mobil, sidebar på desktop */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        {/* Mobil: horisontal tab-liste */}
        <nav className="flex sm:hidden gap-1 overflow-x-auto scrollbar-none border-b border-sage-mist/30 pb-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === id
                  ? "border-brass text-forest-deep"
                  : "border-transparent text-ink/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </nav>

        {/* Desktop: vertikal sidebar */}
        <aside className="hidden sm:block w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-forest-deep text-bone"
                    : "text-ink/60 hover:text-charcoal hover:bg-parchment"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === id ? "text-brass" : "text-ink/40"}`} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Indhold */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-parchment border border-sage-mist/30 rounded-xl p-5 sm:p-6 shadow-compass"
          >
            {activeTab === "profile" && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-charcoal">{t("profile")}</h2>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("fullName")}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("email")}</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-bone/50 border border-sage-mist/30 rounded-lg px-4 py-3 text-sm outline-none text-ink/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-ink/40 mt-1">{t("emailReadOnly")}</p>
                </div>
                <SaveButton payload={{ name }} />
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-charcoal">{t("company")}</h2>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("companyName")}</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
                <SaveButton payload={{ company }} />
              </div>
            )}

            {activeTab === "language" && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-charcoal">{t("language")}</h2>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">{t("appLanguage")}</label>
                  <LocaleSwitcher />
                </div>
                <p className="text-xs text-ink/50">{t("languageNote")}</p>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-charcoal">{t("api")}</h2>
                <div className="bg-bone rounded-xl p-4 border border-sage-mist/20">
                  <p className="text-xs text-ink/50 mb-2">AI-provider</p>
                  <div className="font-mono text-sm text-charcoal flex items-center justify-between flex-wrap gap-2">
                    <span>template-engine (free, local)</span>
                    <span className="text-xs bg-verified/10 text-verified border border-verified/20 px-2 py-1 rounded-full">{t("active")}</span>
                  </div>
                </div>
                <p className="text-xs text-ink/50">{t("apiNote")}</p>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="text-center py-8">
                <p className="text-sm text-ink/40">{t("notAvailableInDemo")}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
