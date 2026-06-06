/**
 * Shared ISO 14044 compliance checker.
 * Used in both ProductDetailClient (overview tab) and ComplianceClient (full page)
 * so that displayed scores are always consistent.
 */

export const ISO_CHECKLIST = [
  { id: 1,  key: "purpose",        isoRef: "ISO 14044 §4.2.2",   field: "goalScope.purpose",                           wizardStep: 1, label: "LCA purpose / goal statement",              impact: "high"   as const },
  { id: 2,  key: "fu",             isoRef: "ISO 14044 §4.2.3.2", field: "goalScope.functionalUnit.text",               wizardStep: 1, label: "Functional unit description",               impact: "high"   as const },
  { id: 3,  key: "boundary",       isoRef: "ISO 14044 §4.2.3.3", field: "goalScope.systemBoundaries",                  wizardStep: 1, label: "System boundaries",                         impact: "high"   as const },
  { id: 4,  key: "cutoff",         isoRef: "ISO 14044 §4.2.3.4", field: "goalScope.cutOffCriterion",                   wizardStep: 1, label: "Cut-off criterion",                         impact: "medium" as const },
  { id: 5,  key: "allocation",     isoRef: "ISO 14044 §4.3.4.2", field: "goalScope.allocationApproach",                wizardStep: 1, label: "Allocation approach",                       impact: "medium" as const },
  { id: 6,  key: "lciRaw",         isoRef: "ISO 14044 §4.3.2",   field: "lci.rawMaterial",                             wizardStep: 2, label: "Raw material inputs",                       impact: "high"   as const },
  { id: 7,  key: "lciProdEnergy",  isoRef: "ISO 14044 §4.3.2",   field: "lci.production.processes",                    wizardStep: 3, label: "Production energy & processes",             impact: "medium" as const },
  { id: 8,  key: "lciProdEmit",    isoRef: "ISO 14044 §4.3.2",   field: "lci.production.directEmissions",              wizardStep: 3, label: "Direct production emissions (VOC, NOx)",    impact: "medium" as const },
  { id: 9,  key: "lciDist",        isoRef: "ISO 14044 §4.3.2",   field: "lci.distribution",                            wizardStep: 4, label: "Distribution transport legs",               impact: "medium" as const },
  { id: 10, key: "lciUse",         isoRef: "ISO 14044 §4.3.2",   field: "lci.use.userBehaviorAssumptions",             wizardStep: 5, label: "Use-phase behaviour assumptions",           impact: "medium" as const },
  { id: 11, key: "lciEolRecovery", isoRef: "ISO 14044 §4.3.2",   field: "lci.endOfLife.recoveryRateAssumptions",       wizardStep: 6, label: "End-of-life recovery assumptions",          impact: "medium" as const },
  { id: 12, key: "lciEolTakeback", isoRef: "ISO 14044 §4.3.2",   field: "lci.endOfLife.takeBackProgram",               wizardStep: 6, label: "Take-back / WEEE registration",            impact: "low"    as const },
  { id: 13, key: "lciaMethod",     isoRef: "ISO 14044 §4.4.2",   field: "lcia.method",                                 wizardStep: 7, label: "LCIA method selection",                     impact: "high"   as const },
  { id: 14, key: "sensitivity",    isoRef: "ISO 14044 §4.5.2",   field: "interpretation.sensitivityAnalysis.results",  wizardStep: 8, label: "Sensitivity analysis results",              impact: "medium" as const },
  { id: 15, key: "conclusions",    isoRef: "ISO 14044 §4.5.3",   field: "interpretation.conclusions",                  wizardStep: 8, label: "Conclusions & recommendations",             impact: "medium" as const },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedField(obj: any, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key: string) =>
    acc != null && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
    obj
  )
}

/** Recursively checks whether a value contains at least one meaningful (non-empty, non-zero) leaf. */
function hasMeaningfulValue(val: unknown): boolean {
  if (val == null) return false
  if (typeof val === "string") return val.trim().length > 0
  if (typeof val === "number") return val !== 0
  if (typeof val === "boolean") return val
  if (Array.isArray(val)) return val.length > 0 && val.some(hasMeaningfulValue)
  if (typeof val === "object") {
    const keys = Object.keys(val as object)
    return keys.length > 0 && keys.some((k) => hasMeaningfulValue((val as Record<string, unknown>)[k]))
  }
  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkItemStatus(product: any, field: string): "fulfilled" | "missing" {
  const val = getNestedField(product, field)
  return hasMeaningfulValue(val) ? "fulfilled" : "missing"
}

/** Returns a 0-100 integer compliance score, calculated live from product data. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calcComplianceScore(product: any): number {
  const fulfilled = ISO_CHECKLIST.filter(
    (item) => checkItemStatus(product, item.field) === "fulfilled"
  ).length
  return Math.round((fulfilled / ISO_CHECKLIST.length) * 100)
}
