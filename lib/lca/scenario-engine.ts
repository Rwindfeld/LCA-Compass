/** Scenario lever — sensitivity parameter adjusted relative to baseline LCA. */
export type ScenarioLever =
  | "gwp_overall"
  | "transport"
  | "use_energy"
  | "recycled_eol"
  | "custom_gwp"

export type ScenarioModifiedData = {
  lever: ScenarioLever
  /** Percent change on the affected portion (e.g. -20 = 20% reduction). */
  percentChange?: number
  /** Direct GWP override in kg CO₂-eq / FU (custom_gwp only). */
  absoluteGwp?: number
  assumptions?: string
  /** GWP at time of save (baseline reference). */
  snapshotBaselineGwp?: number
}

export type ScenarioResult = {
  baselineGwp: number | null
  scenarioGwp: number | null
  deltaKg: number | null
  deltaPercent: number | null
}

/** Default share of total GWP attributed to each lever when hotspots are unknown. */
const DEFAULT_PHASE_SHARE: Record<Exclude<ScenarioLever, "gwp_overall" | "custom_gwp">, number> = {
  transport: 0.08,
  use_energy: 0.25,
  recycled_eol: 0.05,
}

function parseHotspotShare(
  interpretation: Record<string, unknown> | null | undefined,
  phase: string
): number | null {
  const hotspots = interpretation?.hotspots as { phase?: string; contribution?: number }[] | undefined
  if (!Array.isArray(hotspots)) return null
  const match = hotspots.find((h) => h.phase === phase)
  return typeof match?.contribution === "number" ? match.contribution / 100 : null
}

export function parseModifiedData(raw: string | null): ScenarioModifiedData {
  if (!raw) return { lever: "gwp_overall", percentChange: 0 }
  try {
    return JSON.parse(raw) as ScenarioModifiedData
  } catch {
    return { lever: "gwp_overall", percentChange: 0 }
  }
}

export function getBaselineGwp(product: {
  lcia?: { results?: { gwp_kg_co2?: unknown } } | null
}): number | null {
  const val = product.lcia?.results?.gwp_kg_co2
  if (val == null || val === "") return null
  const n = typeof val === "number" ? val : Number(val)
  return Number.isFinite(n) ? n : null
}

export function computeScenarioResult(
  product: {
    lcia?: Record<string, unknown> | null
    interpretation?: Record<string, unknown> | null
  },
  modified: ScenarioModifiedData
): ScenarioResult {
  const baselineGwp = modified.snapshotBaselineGwp ?? getBaselineGwp(product)
  if (baselineGwp == null) {
    return { baselineGwp: null, scenarioGwp: null, deltaKg: null, deltaPercent: null }
  }

  if (modified.lever === "custom_gwp" && modified.absoluteGwp != null) {
    const scenarioGwp = modified.absoluteGwp
    const deltaKg = scenarioGwp - baselineGwp
    const deltaPercent = baselineGwp !== 0 ? (deltaKg / baselineGwp) * 100 : null
    return { baselineGwp, scenarioGwp, deltaKg, deltaPercent }
  }

  const pct = modified.percentChange ?? 0
  const factor = 1 + pct / 100

  let scenarioGwp = baselineGwp

  switch (modified.lever) {
    case "gwp_overall":
      scenarioGwp = baselineGwp * factor
      break
    case "transport": {
      const share =
        parseHotspotShare(product.interpretation, "distribution") ??
        DEFAULT_PHASE_SHARE.transport
      scenarioGwp = baselineGwp * (1 - share + share * factor)
      break
    }
    case "use_energy": {
      const share =
        parseHotspotShare(product.interpretation, "use") ?? DEFAULT_PHASE_SHARE.use_energy
      scenarioGwp = baselineGwp * (1 - share + share * factor)
      break
    }
    case "recycled_eol": {
      const share =
        parseHotspotShare(product.interpretation, "end_of_life") ??
        DEFAULT_PHASE_SHARE.recycled_eol
      scenarioGwp = baselineGwp * (1 - share + share * factor)
      break
    }
    default:
      scenarioGwp = baselineGwp * factor
  }

  const deltaKg = scenarioGwp - baselineGwp
  const deltaPercent = baselineGwp !== 0 ? (deltaKg / baselineGwp) * 100 : null

  return {
    baselineGwp,
    scenarioGwp: Math.round(scenarioGwp * 100) / 100,
    deltaKg: Math.round(deltaKg * 100) / 100,
    deltaPercent: deltaPercent != null ? Math.round(deltaPercent * 10) / 10 : null,
  }
}

export function buildModifiedDataPayload(
  lever: ScenarioLever,
  percentChange: number,
  baselineGwp: number | null,
  assumptions?: string,
  absoluteGwp?: number
): string {
  const data: ScenarioModifiedData = {
    lever,
    percentChange,
    assumptions: assumptions?.trim() || undefined,
    snapshotBaselineGwp: baselineGwp ?? undefined,
  }
  if (lever === "custom_gwp" && absoluteGwp != null) {
    data.absoluteGwp = absoluteGwp
  }
  return JSON.stringify(data)
}
