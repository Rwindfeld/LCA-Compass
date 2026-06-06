/**
 * LCA Calculation Engine
 * Implements CORSIA Core LCA equations (ICAO CORSIA, June 2025):
 *
 *   Eq. 1  Total GHG  = Upstream GHG + Onsite GHG
 *   Eq. 2  Upstream   = Σ(xᵢ × CIᵢ) + Σ(yⱼ × CIⱼ)   [materials + energy, well-to-gate]
 *   Eq. 3  Onsite     = Σ(xᵢ × EFᵢ) + Σ(yⱼ × EFⱼ) + Fugitive GHG
 *
 * Color convention (mirrors CORSIA tables):
 *   "foreground" = operator-measured/red values  → require verification
 *   "background" = database/model values (Ecoinvent/GREET) → blue values
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataSource = "foreground" | "background"

/** A single material or energy input with CI and optional combustion EF */
export interface LcaInput {
  name: string
  /** Amount of material/energy per functional unit */
  amount: number
  unit: string
  /** Carbon Intensity — well-to-gate upstream emissions (gCO₂e / same unit as amount) */
  ci: number
  ciUnit?: string
  /** Emission Factor — onsite combustion/use emissions (gCO₂e / same unit). 0 if no direct combustion */
  ef: number
  efUnit?: string
  source: DataSource
  /** Footnote or citation */
  note?: string
  /** True = biogenic CO₂ (CORSIA §2.4: treated as carbon-neutral at combustion) */
  isBiogenic?: boolean
}

/** A transport leg (CORSIA Table 4 / Table 9 / Table 13 format) */
export interface TransportLeg {
  from: string
  to: string
  mode: "HHD_truck" | "MHD_truck" | "barge" | "rail" | "pipeline" | "ocean_tanker" | "air"
  share: number           // fraction 0–1
  distanceKm: number
  energyIntensity: number // kJ / (t·km)
  /** Emission intensity = upstream CI + combustion EF of transport fuel (g/kJ) */
  emissionIntensity: number
  /** Does this mode require accounting for the empty return trip? (trucks & barges: yes) */
  hasBackhaul: boolean
  returnEmissionIntensity?: number  // g/kJ for return leg (can differ from outbound)
  lossFactor?: number     // fraction 0–1, default 0
  source: DataSource
}

/** Fugitive VOC emissions (CORSIA §3.13, §3.17) */
export interface FugitiveEmissions {
  vocGPerFU: number       // g VOC per functional unit
  /** Conversion factor C(VOC) → CO₂. CORSIA uses 3.12 (from GREET) */
  vocToCo2Factor?: number // default 3.12
  otherGhgGPerFU?: number // any other direct fugitive GHG (g CO₂e / FU)
}

/** Co-product for energy-based allocation (CORSIA Table 8) */
export interface CoProduct {
  name: string
  amount: number          // amount per functional unit (e.g. L/L, dry kg/L)
  amountUnit: string
  lhv: number             // Lower Heating Value (MJ / amount-unit)
  source: DataSource
}

/** Full stage input spec */
export interface StageInput {
  stageName: string
  functionalUnit: string  // description, e.g. "per kg corn"
  materials: LcaInput[]
  energy: LcaInput[]
  fugitive?: FugitiveEmissions
  /** If the stage cumulates CI from a previous stage (e.g. corn CI fed into ethanol) */
  upstreamCarryIn?: {
    name: string
    amount: number         // amount per FU
    amountUnit: string
    ci: number             // CI from prior stage calculation (gCO₂e / amountUnit)
    source: DataSource
  }
  coproducts?: CoProduct[]
  /** Loss factor applied AFTER allocation, before next stage (CORSIA §3.17) */
  outboundLossFactor?: number
}

// ─── Row-level result (mirrors CORSIA Table 1/2/3 rows) ──────────────────────

export interface InputResult {
  name: string
  amount: number
  unit: string
  ci: number
  ef: number
  upstream: number        // amount × ci  (gCO₂e / FU)
  onsite: number          // amount × ef  (gCO₂e / FU)
  total: number           // upstream + onsite
  source: DataSource
  note?: string
}

export interface StageResult {
  stageName: string
  functionalUnit: string
  rows: InputResult[]
  upstreamTotal: number
  onsiteTotal: number
  fugitiveGhg: number
  totalBeforeAllocation: number
  allocationFactor: number          // 1.0 if no co-products
  allocatedCI: number               // totalBeforeAllocation × allocationFactor
  /** CI carried into next stage after loss factor: allocatedCI × (1 + outboundLossFactor) */
  ciAtGate: number
  coproducts: CoProduct[]
  coproductAllocationTable: CoproductAllocationRow[]
}

export interface CoproductAllocationRow {
  name: string
  amount: number
  lhv: number
  energyContent: number   // amount × lhv
  allocationFactor: number
}

export interface TransportStageResult {
  stageName: string
  functionalUnit: string
  legs: TransportLegResult[]
  totalGhg: number         // sum of all legs (gCO₂e / FU)
  fugitiveGhg: number
  lossFactor: number
  /** CI entering this stage (from prior process) */
  ciIn: number
  /** ciIn × (1 + loss) + totalGhg + fugitiveGhg */
  ciOut: number
}

export interface TransportLegResult {
  leg: TransportLeg
  outboundGhgPerTon: number
  returnGhgPerTon: number
  totalGhgPerFU: number   // (outbound + return) per functional unit weight
  source: DataSource
}

// ─── Eq. 2 & 3 core calculation ───────────────────────────────────────────────

function calcInputResult(inp: LcaInput): InputResult {
  const upstream = inp.amount * inp.ci
  // Biogenic CO₂ at combustion = carbon-neutral per CORSIA §2.4 → EF treated as 0
  const ef = inp.isBiogenic ? 0 : inp.ef
  const onsite = inp.amount * ef
  return {
    name: inp.name,
    amount: inp.amount,
    unit: inp.unit,
    ci: inp.ci,
    ef,
    upstream,
    onsite,
    total: upstream + onsite,
    source: inp.source,
    note: inp.note,
  }
}

// ─── Energy-based co-product allocation (CORSIA §2.10, Table 8) ───────────────

export function calcAllocationFactor(
  coproducts: CoProduct[]
): CoproductAllocationRow[] {
  const rows: CoproductAllocationRow[] = coproducts.map((p) => ({
    name: p.name,
    amount: p.amount,
    lhv: p.lhv,
    energyContent: p.amount * p.lhv,
    allocationFactor: 0, // filled below
  }))
  const totalEnergy = rows.reduce((s, r) => s + r.energyContent, 0)
  rows.forEach((r) => {
    r.allocationFactor = totalEnergy > 0 ? r.energyContent / totalEnergy : 1
  })
  return rows
}

// ─── Stage calculation (Eq. 1–3) ──────────────────────────────────────────────

export function calcStage(input: StageInput): StageResult {
  const rows: InputResult[] = []

  // Carry-in from previous stage (e.g. corn CI at plant gate → ethanol step)
  if (input.upstreamCarryIn) {
    const c = input.upstreamCarryIn
    const upstream = c.amount * c.ci
    rows.push({
      name: c.name,
      amount: c.amount,
      unit: c.amountUnit,
      ci: c.ci,
      ef: 0,
      upstream,
      onsite: 0,
      total: upstream,
      source: c.source,
    })
  }

  // Materials (Eq. 2 + Eq. 3)
  input.materials.forEach((m) => rows.push(calcInputResult(m)))
  // Energy carriers (Eq. 2 + Eq. 3)
  input.energy.forEach((e) => rows.push(calcInputResult(e)))

  const upstreamTotal = rows.reduce((s, r) => s + r.upstream, 0)
  const onsiteTotal = rows.reduce((s, r) => s + r.onsite, 0)

  // Fugitive GHG (Eq. 3 addendum)
  let fugitiveGhg = 0
  if (input.fugitive) {
    const voc = input.fugitive.vocGPerFU ?? 0
    const factor = input.fugitive.vocToCo2Factor ?? 3.12
    fugitiveGhg = voc * factor + (input.fugitive.otherGhgGPerFU ?? 0)
  }

  const totalBeforeAllocation = upstreamTotal + onsiteTotal + fugitiveGhg

  // Co-product allocation
  let allocationFactor = 1
  let coproductRows: CoproductAllocationRow[] = []
  if (input.coproducts && input.coproducts.length > 0) {
    coproductRows = calcAllocationFactor(input.coproducts)
    // Find the allocation factor for the primary product (first entry)
    allocationFactor = coproductRows[0]?.allocationFactor ?? 1
  }

  const allocatedCI = round4(totalBeforeAllocation * allocationFactor)

  // Apply loss factor for outbound transport (CORSIA §3.17)
  const loss = input.outboundLossFactor ?? 0
  const ciAtGate = round4(allocatedCI * (1 + loss))

  return {
    stageName: input.stageName,
    functionalUnit: input.functionalUnit,
    rows,
    upstreamTotal: round4(upstreamTotal),
    onsiteTotal: round4(onsiteTotal),
    fugitiveGhg: round4(fugitiveGhg),
    totalBeforeAllocation: round4(totalBeforeAllocation),
    allocationFactor,
    allocatedCI,
    ciAtGate,
    coproducts: input.coproducts ?? [],
    coproductAllocationTable: coproductRows,
  }
}

// ─── Transport stage (CORSIA Table 4 / 9 / 13 format) ─────────────────────────

/**
 * @param ciIn  CI of the commodity entering this transport stage (gCO₂e / FU)
 * @param legs  List of transport legs
 * @param functionalUnitWeightKg  Weight of 1 FU in kg (used to convert g/t → g/FU)
 * @param fugitive  Optional fugitive VOC during transport
 * @param lossFactor  Fraction lost during transport (e.g. 0.0005 = 0.05%)
 */
export function calcTransportStage(
  stageName: string,
  functionalUnit: string,
  ciIn: number,
  legs: TransportLeg[],
  functionalUnitWeightKg: number,
  fugitive?: FugitiveEmissions,
  lossFactor: number = 0
): TransportStageResult {
  const legResults: TransportLegResult[] = legs.map((leg) => {
    // GHG (g/t) = share × distance × energyIntensity × emissionIntensity
    const outboundGhgPerTon =
      leg.share * leg.distanceKm * leg.energyIntensity * leg.emissionIntensity

    // Return trip for modes with backhaul (trucks, barges)
    const returnGhgPerTon = leg.hasBackhaul
      ? leg.share *
        leg.distanceKm *
        leg.energyIntensity *
        (leg.returnEmissionIntensity ?? leg.emissionIntensity)
      : 0

    // Convert g/t → g/FU
    const totalGhgPerFU =
      ((outboundGhgPerTon + returnGhgPerTon) * functionalUnitWeightKg) / 1000

    return { leg, outboundGhgPerTon, returnGhgPerTon, totalGhgPerFU: round4(totalGhgPerFU), source: leg.source }
  })

  const totalGhg = round4(legResults.reduce((s, r) => s + r.totalGhgPerFU, 0))

  let fugitiveGhg = 0
  if (fugitive) {
    fugitiveGhg = round4(
      (fugitive.vocGPerFU ?? 0) * (fugitive.vocToCo2Factor ?? 3.12) +
        (fugitive.otherGhgGPerFU ?? 0)
    )
  }

  // ciOut = ciIn × (1 + lossFactor) + transport GHG + fugitive
  const ciOut = round4(ciIn * (1 + lossFactor) + totalGhg + fugitiveGhg)

  return {
    stageName,
    functionalUnit,
    legs: legResults,
    totalGhg,
    fugitiveGhg,
    lossFactor,
    ciIn,
    ciOut,
  }
}

// ─── Full pathway calculator ───────────────────────────────────────────────────

export interface PathwayResult {
  pathwayName: string
  functionalUnit: string
  stages: Array<StageResult | TransportStageResult>
  finalCI: number          // gCO₂e / FU (after all stages)
  unit: string
}

export type PathwayStageInput =
  | { type: "process"; input: StageInput }
  | {
      type: "transport"
      stageName: string
      functionalUnit: string
      legs: TransportLeg[]
      functionalUnitWeightKg: number
      fugitive?: FugitiveEmissions
      lossFactor?: number
    }

export function calcPathway(
  pathwayName: string,
  functionalUnit: string,
  unit: string,
  stageInputs: PathwayStageInput[]
): PathwayResult {
  const stages: Array<StageResult | TransportStageResult> = []
  let runningCI = 0

  for (const s of stageInputs) {
    if (s.type === "process") {
      // Inject running CI as carry-in if the stage doesn't already have one
      const result = calcStage(s.input)
      stages.push(result)
      runningCI = result.ciAtGate
    } else {
      const result = calcTransportStage(
        s.stageName,
        s.functionalUnit,
        runningCI,
        s.legs,
        s.functionalUnitWeightKg,
        s.fugitive,
        s.lossFactor ?? 0
      )
      stages.push(result)
      runningCI = result.ciOut
    }
  }

  return {
    pathwayName,
    functionalUnit,
    stages,
    finalCI: round4(runningCI),
    unit,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round4(n: number): number {
  return Math.round(n * 10000) / 10000
}

export function isStageResult(s: StageResult | TransportStageResult): s is StageResult {
  return "rows" in s
}
