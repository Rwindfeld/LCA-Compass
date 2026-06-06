"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher"
import { User, Building2, Globe, Bell, Key, Save } from "lucide-react"

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
  const [name, setName] = useState("Rattana Nielsen")
  const [company, setCompany] = useState("Papas Papbar")
  const [email] = useState("demo@lca-compass.dk")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-charcoal">{t("title")}</h1>
      </motion.div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0">
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

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-parchment border border-sage-mist/30 rounded-xl p-6 shadow-compass"
          >
            {activeTab === "profile" && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-charcoal">{t("profile")}</h2>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("fullName")}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("email")}</label>
                  <input type="email" value={email} disabled
                    className="w-full bg-bone/50 border border-sage-mist/30 rounded-lg px-4 py-3 text-sm outline-none text-ink/50 cursor-not-allowed" />
                  <p className="text-xs text-ink/40 mt-1">{t("emailReadOnly")}</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-forest-deep text-bone px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-moss transition-colors">
                  <Save className="w-4 h-4" strokeWidth={1.5} /> {tCommon("save")}
                </button>
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-charcoal">{t("company")}</h2>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">{t("companyName")}</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-bone border border-sage-mist focus:border-brass rounded-lg px-4 py-3 text-sm outline-none" />
                </div>
                <button className="inline-flex items-center gap-2 bg-forest-deep text-bone px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-moss transition-colors">
                  <Save className="w-4 h-4" strokeWidth={1.5} /> {tCommon("save")}
                </button>
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
                  <div className="font-mono text-sm text-charcoal flex items-center justify-between">
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
