const MIN_LIMITATIONS = 3

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** Standardbegrænsninger når produktdata er tynde. */
export const STUDY_LIMITATIONS = {
  da: [
    "Baggrundsdata er primært baseret på Ecoinvent 3.10 og litteratur — geografisk og teknologisk repræsentativitet kan afvige.",
    "Usikkerhed i allokeringsvalg og cut-off kan påvirke resultaterne inden for det definerede scope.",
    "Sensitetsanalyse dækker ikke alle parametre; ekstreme scenarier kan ligge uden for testet interval.",
  ],
  en: [
    "Background data rely mainly on Ecoinvent 3.10 and literature — geographic and technological representativeness may differ.",
    "Uncertainty in allocation and cut-off rules may affect results within the defined scope.",
    "Sensitivity analysis does not cover all parameters; extreme scenarios may lie outside the tested range.",
  ],
} as const

const COMPARATIVE_SMARTPHONE = {
  da: "Brugerens smartphone er ikke inkluderet i systemgrænsen — kan undervurdere QR-løsningens reelle impact, hvis sammenligningen anses som påstandsfølsom.",
  en: "The user's smartphone is excluded from the system boundary — this may understate the QR solution's real impact if the comparison is treated as a sensitive assertion.",
} as const

const PFC_GAP = {
  da: "PFC-emissioner fra chip-fabrikation er ikke inkluderet pga. manglende leverandørspecifikke data — kan undervurdere GWP marginalt.",
  en: "PFC emissions from chip fabrication are not included due to missing supplier-specific data — GWP may be marginally understated.",
} as const

function normalizeKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 80)
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^[-•]\s*/, "").trim())
    .filter((s) => s.length > 20)
}

function hasDirectProductionEmissions(lci: { production?: { directEmissions?: unknown } } | null | undefined): boolean {
  const v = lci?.production?.directEmissions
  if (v == null) return false
  if (typeof v === "string") return v.trim().length > 0
  return true
}

function isElectronicsComparison(product: {
  goalScope?: { comparativeAssertion?: boolean; timePeriod?: string } | null
  productType?: string
  lci?: { rawMaterial?: { name?: string }[] } | null
}): boolean {
  if (product.goalScope?.comparativeAssertion) return true
  if (product.productType === "ELECTRONICS" || product.productType === "SOFTWARE_HARDWARE") return true
  const names = product.lci?.rawMaterial?.map((m) => (m.name ?? "").toLowerCase()).join(" ") ?? ""
  return /chip|silicium|rfid|tablet|elektronik/.test(names)
}

/** Saml 3+ unikke begrænsninger til rapporter. */
export function collectStudyLimitations(
  locale: "da" | "en",
  product?: {
    goalScope?: {
      limitations?: string | null
      comparativeAssertion?: boolean
      timePeriod?: string
    } | null
    interpretation?: { limitations?: string | null } | null
    lci?: { production?: { directEmissions?: unknown }; rawMaterial?: { name?: string }[] } | null
    productType?: string
  }
): string[] {
  const items: string[] = []
  const seen = new Set<string>()

  const push = (text?: string | null) => {
    if (!text?.trim()) return
    for (const sentence of splitIntoSentences(text)) {
      const key = normalizeKey(sentence)
      if (seen.has(key)) continue
      seen.add(key)
      items.push(sentence)
    }
  }

  const gs = product?.goalScope
  const interp = product?.interpretation

  push(gs?.limitations)
  push(interp?.limitations)

  if (gs?.comparativeAssertion) {
    push(COMPARATIVE_SMARTPHONE[locale])
  }

  if (product && isElectronicsComparison(product) && !hasDirectProductionEmissions(product.lci)) {
    push(PFC_GAP[locale])
  }

  if (gs?.timePeriod) {
    push(
      locale === "da"
        ? `Resultaterne reflekterer ${gs.timePeriod} som teknologi-baseline; fremtidige produktionsforbedringer kan ændre konklusionerne.`
        : `Results reflect ${gs.timePeriod} as the technology baseline; future production improvements may change the conclusions.`
    )
  }

  for (const fallback of STUDY_LIMITATIONS[locale]) {
    if (items.length >= MIN_LIMITATIONS) break
    push(fallback)
  }

  return items
}

export function mergeStudyLimitations(
  locale: "da" | "en",
  goalScopeLimitations?: string | null,
  interpretationLimitations?: string | null,
  product?: Parameters<typeof collectStudyLimitations>[1]
): string {
  const bullets = collectStudyLimitations(locale, {
    ...product,
    goalScope: {
      ...product?.goalScope,
      limitations: goalScopeLimitations ?? product?.goalScope?.limitations,
    },
    interpretation: {
      ...product?.interpretation,
      limitations: interpretationLimitations ?? product?.interpretation?.limitations,
    },
  })
  return bullets.join(" ")
}

export function limitationsToHtml(
  locale: "da" | "en",
  product?: Parameters<typeof collectStudyLimitations>[1]
): string {
  const bullets = collectStudyLimitations(locale, product)
  if (!bullets.length) return ""
  return `<h3>${locale === "da" ? "Begrænsninger" : "Limitations"}</h3><ul>${bullets
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join("")}</ul>`
}
