/**
 * CORSIA Corn ATJ-E pathway — verification test
 * Target: 52.92 gCO₂e/MJ jet fuel  (CORSIA Sample Calculation, June 2025, §3.21)
 * Tolerance: ±5% = [50.27, 55.57] gCO₂e/MJ
 *
 * Data sources: CORSIA Sample Calculation document, Tables 1–13
 * All blue (background) values from GREET/Ecoinvent as specified in document
 * All red (foreground) values use the notional sample values from the document
 */

import {
  calcStage,
  calcPathway,
  calcTransportStage,
  type StageInput,
  type TransportLeg,
  isStageResult,
} from "../calculation-engine"

// ─── Stage 1: Corn farming ────────────────────────────────────────────────────
// CORSIA Table 1 (upstream) + Table 2 (onsite), unit: per kg corn

const cornFarming: StageInput = {
  stageName: "Corn grain production",
  functionalUnit: "per kg corn",
  materials: [
    // Upstream CIs from GREET background data (blue)
    { name: "Nitrogen",   amount: 15.6, unit: "g/kg corn", ci: 3.45,  ef: 0.61744 + 0.0216 * 265, source: "background", note: "CO₂ from urea + N₂O×GWP265" },
    { name: "P₂O₅",       amount: 5.2,  unit: "g/kg corn", ci: 1.64,  ef: 0,       source: "background" },
    { name: "K₂O",        amount: 5.4,  unit: "g/kg corn", ci: 0.48,  ef: 0,       source: "background" },
    { name: "CaCO₃",      amount: 57.9, unit: "g/kg corn", ci: 0.01,  ef: 0.2165,  source: "background" },
    { name: "Herbicides", amount: 0.3,  unit: "g/kg corn", ci: 25.52, ef: 0,       source: "background" },
    { name: "Insecticide",amount: 0.001,unit: "g/kg corn", ci: 21.32, ef: 0,       source: "background" },
    // Crop residue N₂O (onsite only, no CI)
    { name: "Crop residue N", amount: 5.6, unit: "g/kg corn", ci: 0, ef: 0.01986 * 265, source: "background", note: "N₂O from crop residue" },
  ],
  energy: [
    // Diesel split into two engine types (CORSIA footnote 2 & 3)
    { name: "Diesel (stationary, 20%)", amount: 43.6,  unit: "kJ/kg corn", ci: 0.015, ef: 0.0744, source: "background" },
    { name: "Diesel (off-road, 80%)",   amount: 174.4, unit: "kJ/kg corn", ci: 0.015, ef: 0.0747, source: "foreground" },
    { name: "Gasoline",    amount: 33.7, unit: "kJ/kg corn", ci: 0.019, ef: 0.0735, source: "background" },
    { name: "Natural gas", amount: 19.9, unit: "kJ/kg corn", ci: 0.013, ef: 0.0665, source: "background" },
    { name: "LPG",         amount: 42.6, unit: "kJ/kg corn", ci: 0.013, ef: 0.0657, source: "background" },
    { name: "Electricity", amount: 55.1, unit: "kJ/kg corn", ci: 0.122, ef: 0,      source: "background", note: "US avg grid" },
  ],
}

// ─── Stage 2: Corn transportation ────────────────────────────────────────────
// CORSIA Table 4, unit: per kg corn
// functionalUnitWeightKg = 1 (we work per kg corn)

const cornTransportLegs: TransportLeg[] = [
  {
    from: "Farm", to: "Stack",
    mode: "MHD_truck",
    share: 1.0,
    distanceKm: 16,
    energyIntensity: 1384,  // kJ/t-km
    emissionIntensity: 0.0896,  // g/kJ (outbound)
    returnEmissionIntensity: 0.0896,
    hasBackhaul: true,
    lossFactor: 0,
    source: "background",
  },
  {
    from: "Stack", to: "Plant",
    mode: "HHD_truck",
    share: 1.0,
    distanceKm: 64,
    energyIntensity: 490,
    emissionIntensity: 0.0895,
    returnEmissionIntensity: 0.0895,
    hasBackhaul: true,
    lossFactor: 0,
    source: "background",
    // Note: return uses 389 kJ/t-km energy but same emission intensity per CORSIA
  },
]

// ─── Stage 3: Ethanol production ─────────────────────────────────────────────
// CORSIA Table 5 (upstream) + Table 6 (onsite), unit: per MJ ethanol
// Carry-in: corn at 257.2 gCO₂e/kg × 0.11 kg/MJ ethanol

const ethanolProduction: StageInput = {
  stageName: "Corn grain to ethanol production",
  functionalUnit: "per MJ ethanol",
  upstreamCarryIn: {
    name: "Corn (at plant gate)",
    amount: 0.11,   // kg/MJ ethanol (foreground)
    amountUnit: "kg/MJ ethanol",
    ci: 257.2,      // gCO₂e/kg — result from stages 1+2
    source: "foreground",
  },
  materials: [
    { name: "Alpha-Amylase", amount: 0.03, unit: "g/MJ ethanol", ci: 1.2,  ef: 0, source: "background" },
    { name: "Gluco-Amylase", amount: 0.07, unit: "g/MJ ethanol", ci: 5.5,  ef: 0, source: "background" },
    { name: "Yeast",         amount: 0.03, unit: "g/MJ ethanol", ci: 2.6,  ef: 0, source: "background" },
    { name: "Sulfuric Acid", amount: 0.06, unit: "g/MJ ethanol", ci: 0.05, ef: 0, source: "background" },
    { name: "Ammonia",       amount: 0.22, unit: "g/MJ ethanol", ci: 2.4,  ef: 0, source: "background" },
    { name: "NaOH",          amount: 0.28, unit: "g/MJ ethanol", ci: 2.1,  ef: 0, source: "background" },
    { name: "Quicklime",     amount: 0.13, unit: "g/MJ ethanol", ci: 1.3,  ef: 0, source: "background" },
  ],
  energy: [
    // Natural gas split: 50% large boiler, 50% small boiler (CORSIA footnote 10 & 11)
    { name: "Natural gas (large boiler, 50%)", amount: 0.15, unit: "MJ/MJ ethanol", ci: 12.7,  ef: 56.53, source: "foreground" },
    { name: "Natural gas (small boiler, 50%)", amount: 0.15, unit: "MJ/MJ ethanol", ci: 12.7,  ef: 56.43, source: "foreground" },
    { name: "Coal",        amount: 0.001, unit: "MJ/MJ ethanol", ci: 5.8,   ef: 95.07, source: "background" },
    { name: "Electricity", amount: 0.03,  unit: "MJ/MJ ethanol", ci: 122.1, ef: 0,     source: "background" },
  ],
  fugitive: {
    // VOC fugitive: 0.028 g VOC/MJ ethanol × 3.12 (CORSIA §3.13)
    vocGPerFU: 0.028,
    vocToCo2Factor: 3.12,
  },
  // Co-products for energy allocation (CORSIA Table 8)
  // Primary product (ethanol) MUST be first → its allocationFactor is used
  coproducts: [
    { name: "Ethanol", amount: 1,     amountUnit: "L/L ethanol",  lhv: 21.27, source: "foreground" },
    { name: "DDGS",    amount: 0.55,  amountUnit: "dry kg/L ethanol", lhv: 20.24, source: "foreground" },
    { name: "Corn oil",amount: 0.033, amountUnit: "kg/L ethanol", lhv: 37.20, source: "foreground" },
  ],
}

// ─── Stage 4: Ethanol transportation ─────────────────────────────────────────
// CORSIA Table 9, unit: per MJ ethanol
// functionalUnitWeightKg for 1 MJ ethanol ≈ 1/21.27 L × 0.789 kg/L ≈ 0.0371 kg

const ethanolTransportLegs: TransportLeg[] = [
  {
    from: "Ethanol plant", to: "Jet upgrading plant",
    mode: "barge",
    share: 0.13,
    distanceKm: 837,
    energyIntensity: 161,
    emissionIntensity: 0.0899,
    hasBackhaul: true,   // barge = backhaul
    source: "background",
  },
  {
    from: "Ethanol plant", to: "Jet upgrading plant",
    mode: "rail",
    share: 0.79,
    distanceKm: 1287,
    energyIntensity: 197,
    emissionIntensity: 0.0901,
    hasBackhaul: false,  // rail = no backhaul
    source: "background",
  },
  {
    from: "Ethanol plant", to: "Jet upgrading plant",
    mode: "HHD_truck",
    share: 0.08,
    distanceKm: 129,
    energyIntensity: 494,
    emissionIntensity: 0.0895,
    returnEmissionIntensity: 0.0895,
    hasBackhaul: true,
    source: "background",
  },
]

// ─── Stage 5: Ethanol → Jet upgrading ────────────────────────────────────────
// CORSIA Table 10 (upstream) + Table 11 (onsite), unit: per MJ jet

const jetUpgrading: StageInput = {
  stageName: "Ethanol to jet upgrading",
  functionalUnit: "per MJ jet",
  upstreamCarryIn: {
    name: "Ethanol (at jet plant gate)",
    amount: 1.06,   // MJ/MJ jet (foreground)
    amountUnit: "MJ/MJ jet",
    ci: 35.03,      // gCO₂e/MJ ethanol — result from stages 3+4
    source: "foreground",
  },
  materials: [
    { name: "Catalysts", amount: 0.11, unit: "g/MJ jet", ci: 6.93, ef: 0, source: "background" },
  ],
  energy: [
    { name: "Hydrogen",    amount: 0.04, unit: "MJ/MJ jet", ci: 78.75, ef: 0,     source: "background" },
    { name: "Natural gas (large boiler)", amount: 0.05, unit: "MJ/MJ jet", ci: 12.71, ef: 56.53, source: "foreground" },
    { name: "Natural gas (small boiler)", amount: 0.05, unit: "MJ/MJ jet", ci: 12.71, ef: 56.43, source: "foreground" },
    { name: "Electricity", amount: 0.05, unit: "MJ/MJ jet", ci: 122.11, ef: 0,    source: "background" },
  ],
  // Jet accounts for 95% of product slate by energy (CORSIA §3.19)
  coproducts: [
    { name: "Jet fuel",           amount: 0.95, amountUnit: "MJ/MJ", lhv: 1, source: "background" },
    { name: "Renewable diesel + gasoline", amount: 0.05, amountUnit: "MJ/MJ", lhv: 1, source: "background" },
  ],
}

// ─── Stage 6: Jet transportation and distribution ─────────────────────────────
// CORSIA Table 13, unit: per MJ jet

const jetTransportLegs: TransportLeg[] = [
  {
    from: "Upgrading plant", to: "Blending terminal",
    mode: "barge",
    share: 0.33,
    distanceKm: 837,
    energyIntensity: 161,
    emissionIntensity: 0.0899,
    hasBackhaul: true,
    source: "background",
  },
  {
    from: "Upgrading plant", to: "Blending terminal",
    mode: "pipeline",
    share: 0.60,
    distanceKm: 644,
    energyIntensity: 292,
    emissionIntensity: 0.1221,
    hasBackhaul: false,
    source: "background",
  },
  {
    from: "Upgrading plant", to: "Blending terminal",
    mode: "rail",
    share: 0.07,
    distanceKm: 1287,
    energyIntensity: 197,
    emissionIntensity: 0.0901,
    hasBackhaul: false,
    source: "background",
  },
  {
    from: "Terminal", to: "Airport",
    mode: "HHD_truck",
    share: 1.0,
    distanceKm: 48,
    energyIntensity: 494,
    emissionIntensity: 0.0895,
    returnEmissionIntensity: 0.0895,
    hasBackhaul: true,
    source: "background",
  },
]

// ─── Run the test ─────────────────────────────────────────────────────────────

function runCORSIATest() {
  console.log("╔══════════════════════════════════════════════════════════════╗")
  console.log("║  CORSIA Corn ATJ-E LCA — Verification Test                  ║")
  console.log("║  Target: 52.92 gCO₂e/MJ jet  (CORSIA Sample Calc, Jun 2025)║")
  console.log("╚══════════════════════════════════════════════════════════════╝\n")

  // ── Stage 1: Corn farming ─────────────────────────────────────────────────
  const s1 = calcStage(cornFarming)
  console.log(`Stage 1: ${s1.stageName}`)
  console.log(`  Upstream:  ${s1.upstreamTotal.toFixed(2)} gCO₂e/kg corn`)
  console.log(`  Onsite:    ${s1.onsiteTotal.toFixed(2)} gCO₂e/kg corn`)
  console.log(`  Total:     ${s1.totalBeforeAllocation.toFixed(2)} gCO₂e/kg corn`)
  console.log(`  CORSIA ref: 248.3 gCO₂e/kg corn → diff: ${(s1.totalBeforeAllocation - 248.3).toFixed(2)}\n`)

  // ── Stage 2: Corn transport ───────────────────────────────────────────────
  const s2 = calcTransportStage(
    "Corn grain transportation",
    "per kg corn",
    s1.ciAtGate,   // CI at farm gate = 248.3 (no loss or allocation in stage 1)
    cornTransportLegs,
    1,             // 1 kg per functional unit
    undefined,
    0
  )
  console.log(`Stage 2: ${s2.stageName}`)
  s2.legs.forEach((l) => {
    console.log(`  ${l.leg.from}→${l.leg.to} (${l.leg.mode}): ${l.totalGhgPerFU.toFixed(3)} gCO₂e/kg`)
  })
  console.log(`  Transport total: ${s2.totalGhg.toFixed(2)} gCO₂e/kg corn`)
  console.log(`  CI at plant gate: ${s2.ciOut.toFixed(2)} gCO₂e/kg corn`)
  console.log(`  CORSIA ref: 257.2 gCO₂e/kg corn → diff: ${(s2.ciOut - 257.2).toFixed(2)}\n`)

  // ── Stage 3: Ethanol production ───────────────────────────────────────────
  // Override carry-in CI with our computed value
  const ethStage: StageInput = {
    ...ethanolProduction,
    upstreamCarryIn: {
      ...ethanolProduction.upstreamCarryIn!,
      ci: s2.ciOut,
    },
  }
  const s3 = calcStage(ethStage)
  console.log(`Stage 3: ${s3.stageName}`)
  console.log(`  Total before allocation: ${s3.totalBeforeAllocation.toFixed(2)} gCO₂e/MJ ethanol`)
  console.log(`  CORSIA ref: 54.03 gCO₂e/MJ ethanol → diff: ${(s3.totalBeforeAllocation - 54.03).toFixed(2)}`)
  console.log(`  Allocation factor (ethanol): ${(s3.allocationFactor * 100).toFixed(1)}%`)
  console.log(`  CORSIA ref: 63.2%`)
  console.log(`  Allocated CI: ${s3.allocatedCI.toFixed(2)} gCO₂e/MJ ethanol`)
  console.log(`  CORSIA ref: 34.13 gCO₂e/MJ ethanol → diff: ${(s3.allocatedCI - 34.13).toFixed(2)}\n`)

  // ── Stage 4: Ethanol transport ────────────────────────────────────────────
  // 1 MJ ethanol ≈ 1/21.27 L × 789 g/L ≈ 37.1 g = 0.0371 kg
  const ethFUWeightKg = (1 / 21.27) * 0.789
  const s4 = calcTransportStage(
    "Corn ethanol transportation",
    "per MJ ethanol",
    s3.allocatedCI,
    ethanolTransportLegs,
    ethFUWeightKg,
    { vocGPerFU: 0.019, vocToCo2Factor: 3.12 }, // CORSIA §3.17
    0.0005  // 0.05% loss factor
  )
  console.log(`Stage 4: ${s4.stageName}`)
  console.log(`  Transport GHG: ${s4.totalGhg.toFixed(3)} gCO₂e/MJ ethanol`)
  console.log(`  Fugitive VOC:  ${s4.fugitiveGhg.toFixed(3)} gCO₂e/MJ ethanol`)
  console.log(`  CI at jet plant gate: ${s4.ciOut.toFixed(2)} gCO₂e/MJ ethanol`)
  console.log(`  CORSIA ref: 35.03 gCO₂e/MJ ethanol → diff: ${(s4.ciOut - 35.03).toFixed(2)}\n`)

  // ── Stage 5: Jet upgrading ────────────────────────────────────────────────
  const jetStage: StageInput = {
    ...jetUpgrading,
    upstreamCarryIn: {
      ...jetUpgrading.upstreamCarryIn!,
      ci: s4.ciOut,
    },
  }
  const s5 = calcStage(jetStage)
  console.log(`Stage 5: ${s5.stageName}`)
  console.log(`  Total before allocation: ${s5.totalBeforeAllocation.toFixed(2)} gCO₂e/MJ jet`)
  console.log(`  CORSIA ref: 55.05 gCO₂e/MJ jet → diff: ${(s5.totalBeforeAllocation - 55.05).toFixed(2)}`)
  console.log(`  Allocation factor (jet): ${(s5.allocationFactor * 100).toFixed(0)}%`)
  console.log(`  Allocated CI: ${s5.allocatedCI.toFixed(2)} gCO₂e/MJ jet`)
  console.log(`  CORSIA ref: 52.30 gCO₂e/MJ jet → diff: ${(s5.allocatedCI - 52.30).toFixed(2)}\n`)

  // ── Stage 6: Jet transport ────────────────────────────────────────────────
  // 1 MJ jet fuel ≈ 1/43.2 kg ≈ 0.02315 kg (LHV of jet fuel ~43.2 MJ/kg)
  const jetFUWeightKg = 1 / 43.2
  const s6 = calcTransportStage(
    "Jet fuel transportation & distribution",
    "per MJ jet",
    s5.allocatedCI,
    jetTransportLegs,
    jetFUWeightKg,
    { vocGPerFU: 0.001, vocToCo2Factor: 3.12 }, // CORSIA §3.21
    0.00005  // 0.005% loss factor
  )
  console.log(`Stage 6: ${s6.stageName}`)
  console.log(`  Transport GHG: ${s6.totalGhg.toFixed(3)} gCO₂e/MJ jet`)
  console.log(`  Fugitive VOC:  ${s6.fugitiveGhg.toFixed(3)} gCO₂e/MJ jet`)
  console.log(`  FINAL CI:      ${s6.ciOut.toFixed(2)} gCO₂e/MJ jet fuel`)
  console.log(`  CORSIA ref:    52.92 gCO₂e/MJ jet fuel`)
  console.log(`  Difference:    ${(s6.ciOut - 52.92).toFixed(2)} gCO₂e/MJ`)

  const pctDiff = Math.abs((s6.ciOut - 52.92) / 52.92 * 100)
  console.log(`  % deviation:   ${pctDiff.toFixed(2)}%`)
  const passed = pctDiff <= 5
  console.log(`\n  ${passed ? "✅ PASS" : "❌ FAIL"} — within ±5% tolerance: ${passed}`)

  return { finalCI: s6.ciOut, passed }
}

// Run immediately when executed directly
const result = runCORSIATest()
export { result }
