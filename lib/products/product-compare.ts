import { calcComplianceScore, ISO_CHECKLIST, checkItemStatus } from "@/lib/lca/compliance-check"
import type { ParsedProduct } from "./parse-product"

export type PhaseKey =
  | "raw_material"
  | "production"
  | "distribution"
  | "use"
  | "end_of_life"

export type ProductCompareSnapshot = {
  id: string
  name: string
  productType: string
  status: string
  ambitionLevel: string
  complianceScore: number
  updatedAt: string
  functionalUnit: string | null
  systemBoundaries: string | null
  geographicScope: string | null
  lciaMethod: string | null
  gwpKgCo2: number | null
  eWasteKg: number | null
  checklistFulfilled: number
  checklistTotal: number
  phases: Record<PhaseKey, boolean>
}

function parseNumber(val: unknown): number | null {
  if (val == null || val === "") return null
  const n = typeof val === "number" ? val : Number(val)
  return Number.isFinite(n) ? n : null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function phaseFilled(lci: any, key: PhaseKey): boolean {
  if (!lci) return false
  switch (key) {
    case "raw_material":
      return Array.isArray(lci.rawMaterial) && lci.rawMaterial.length > 0
    case "production":
      return !!lci.production
    case "distribution":
      return Array.isArray(lci.distribution) && lci.distribution.length > 0
    case "use":
      return !!lci.use
    case "end_of_life":
      return !!lci.endOfLife
    default:
      return false
  }
}

export function buildProductCompareSnapshot(product: ParsedProduct): ProductCompareSnapshot {
  const gs = product.goalScope as {
    functionalUnit?: { text?: string }
    systemBoundaries?: string
    geographicScope?: string
  } | null
  const lcia = product.lcia as {
    method?: string
    results?: { gwp_kg_co2?: unknown; eWaste_kg?: unknown }
  } | null

  const fulfilled = ISO_CHECKLIST.filter(
    (item) => checkItemStatus(product, item.field) === "fulfilled"
  ).length

  const phaseKeys: PhaseKey[] = [
    "raw_material",
    "production",
    "distribution",
    "use",
    "end_of_life",
  ]

  return {
    id: product.id,
    name: product.name,
    productType: product.productType,
    status: product.status,
    ambitionLevel: product.ambitionLevel,
    complianceScore: calcComplianceScore(product),
    updatedAt:
      product.updatedAt instanceof Date
        ? product.updatedAt.toISOString()
        : String(product.updatedAt),
    functionalUnit: gs?.functionalUnit?.text?.trim() || null,
    systemBoundaries: gs?.systemBoundaries?.trim() || null,
    geographicScope: gs?.geographicScope?.trim() || null,
    lciaMethod: lcia?.method?.trim() || null,
    gwpKgCo2: parseNumber(lcia?.results?.gwp_kg_co2),
    eWasteKg: parseNumber(lcia?.results?.eWaste_kg),
    checklistFulfilled: fulfilled,
    checklistTotal: ISO_CHECKLIST.length,
    phases: Object.fromEntries(
      phaseKeys.map((k) => [k, phaseFilled(product.lci, k)])
    ) as Record<PhaseKey, boolean>,
  }
}

export function formatGwpDelta(a: number | null, b: number | null): number | null {
  if (a == null || b == null) return null
  return b - a
}
