import { ISO_CHECKLIST } from "./compliance-check"

export const ISO_CHECKLIST_TOTAL = ISO_CHECKLIST.length

const LABELS_DA: Record<string, string> = {
  purpose: "Formål med studiet dokumenteret",
  fu: "Funktionel enhed defineret og kvantificeret",
  boundary: "Systemgrænser defineret",
  cutoff: "Cut-off kriterium defineret",
  allocation: "Allokeringsmetode valgt og begrundet",
  lciRaw: "Råmaterialer og inputflow dokumenteret",
  lciProdEnergy: "Produktionsenergi og processer dokumenteret",
  lciProdEmit: "Direkte produktionsemissioner (VOC, NOx m.fl.)",
  lciDist: "Transport i distributionsfasen dokumenteret",
  lciUse: "Antagelser om brugerfase dokumenteret",
  lciEolRecovery: "Genanvendelses- og recovery-antagelser (slutafhandling)",
  lciEolTakeback: "Take-back / WEEE-registrering dokumenteret",
  lciaMethod: "LCIA-metode valgt og begrundet",
  sensitivity: "Følsomhedsanalyse gennemført",
  conclusions: "Konklusioner og begrænsninger dokumenteret",
}

const LABELS_EN: Record<string, string> = {
  purpose: "Study purpose documented",
  fu: "Functional unit defined and quantified",
  boundary: "System boundaries defined",
  cutoff: "Cut-off criterion defined",
  allocation: "Allocation method chosen and justified",
  lciRaw: "Raw materials and input flows documented",
  lciProdEnergy: "Production energy and processes documented",
  lciProdEmit: "Direct production emissions (VOC, NOx, etc.)",
  lciDist: "Distribution transport legs documented",
  lciUse: "Use-phase behaviour assumptions documented",
  lciEolRecovery: "End-of-life recovery assumptions documented",
  lciEolTakeback: "Take-back / WEEE registration documented",
  lciaMethod: "LCIA method chosen and justified",
  sensitivity: "Sensitivity analysis completed",
  conclusions: "Conclusions and limitations documented",
}

export function getComplianceItemLabel(key: string, locale: "da" | "en"): string {
  const map = locale === "da" ? LABELS_DA : LABELS_EN
  return map[key] ?? ISO_CHECKLIST.find((c) => c.key === key)?.label ?? key
}
