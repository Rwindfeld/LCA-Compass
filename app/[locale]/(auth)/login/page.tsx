"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { CompassLogo } from "@/components/shared/CompassLogo"
import { Eye, EyeOff, Loader2 } from "lucide-react"

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
    </svg>
  )
}

export default function LoginPage() {
  const t = useTranslations("auth.login")
  const locale = useLocale()
  const router = useRouter()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const redirectToDashboard = () => {
    router.push(`/${locale}/dashboard`)
  }

  const handleOAuthLogin = async (provider: "google" | "microsoft") => {
    setLoading(provider)
    setError("")
    try {
      const result = await signIn("credentials", {
        provider,
        email: "",
        password: "demo",
        redirect: false,
      })
      if (result?.error) {
        setError(t("errorGeneral"))
      } else {
        redirectToDashboard()
      }
    } catch {
      setError(t("errorGeneral"))
    } finally {
      setLoading(null)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("email")
    setError("")
    try {
      const result = await signIn("credentials", {
        email: email || "demo@lca-compass.dk",
        password: password || "demo",
        provider: "email",
        redirect: false,
      })
      if (result?.error) {
        setError(t("errorGeneral"))
      } else {
        redirectToDashboard()
      }
    } catch {
      setError(t("errorGeneral"))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Form */}
      <div className="flex flex-col items-center justify-center px-8 py-16 bg-bone">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <CompassLogo size={32} showWordmark href="/" />
          </div>

          <h1 className="text-2xl font-display font-bold text-charcoal mb-2">
            {t("title")}
          </h1>
          <p className="text-sm text-ink/60 mb-8">{t("subtitle")}</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-coral/10 border border-coral/20 rounded-lg text-sm text-coral"
            >
              {error}
            </motion.div>
          )}

          {/* Provider buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 bg-bone border border-sage-mist/50 hover:border-forest-deep active:bg-parchment text-charcoal px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-compass hover:shadow-compass-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              ) : (
                <GoogleIcon />
              )}
              {t("continueWithGoogle")}
            </button>

            <button
              onClick={() => handleOAuthLogin("microsoft")}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 bg-bone border border-sage-mist/50 hover:border-forest-deep active:bg-parchment text-charcoal px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-compass hover:shadow-compass-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "microsoft" ? (
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              ) : (
                <MicrosoftIcon />
              )}
              {t("continueWithMicrosoft")}
            </button>

            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="w-full flex items-center gap-3 bg-bone border border-sage-mist/50 hover:border-forest-deep active:bg-parchment text-charcoal px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <span className="w-4 h-4 flex items-center justify-center text-sm flex-shrink-0">✉️</span>
              {t("continueWithEmail")}
            </button>
          </div>

          {/* Email form */}
          {showEmailForm && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sage-mist/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-bone px-3 text-xs text-ink/40">{t("orDivider")}</span>
                </div>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleEmailLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@lca-compass.dk"
                    className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm font-sans outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-bone border border-sage-mist focus:border-brass focus:ring-2 focus:ring-brass/20 rounded-lg px-4 py-3 text-sm font-sans outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                      aria-label={showPassword ? "Skjul" : "Vis"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading !== null}
                  className="w-full bg-forest-deep text-bone hover:bg-moss active:bg-moss transition-colors duration-200 px-6 py-3 rounded-lg font-semibold text-sm shadow-compass disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading === "email" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("signIn")}
                </button>
              </motion.form>
            </>
          )}

          {/* Demo hint */}
          <div className="mt-8 p-3 bg-brass/10 border border-brass/20 rounded-lg">
            <p className="text-xs text-moss font-medium mb-1">✦ {t("demoTitle")}</p>
            <p className="text-xs text-ink/60">{t("demoHint")}</p>
          </div>
        </motion.div>
      </div>

      {/* Right — Hero panel (kun desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-forest-deep p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="500" height="500" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="95" stroke="#C9A961" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="75" stroke="#C9A961" strokeWidth="0.3" />
              <polygon points="100,5 96,50 100,45 104,50" fill="#C9A961" />
              <polygon points="100,195 96,150 100,155 104,150" fill="#B8C5B0" />
            </svg>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center relative z-10"
        >
          <blockquote className="text-2xl font-display font-medium text-bone leading-relaxed mb-8">
            &ldquo;LCA-Kompas gav os en professionel rapport, som vores investor kunne tage seriøst — på en eftermiddag.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brass/20 border border-brass/30 flex items-center justify-center text-brass font-semibold text-sm">
              MK
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-bone">Maria Kristiansen</p>
              <p className="text-xs text-sage-mist/60">Produktdesigner, Verde Studio</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
