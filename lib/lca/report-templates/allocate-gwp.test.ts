import { describe, expect, it } from "vitest"
import { allocateGwpByPhase, sumPhaseKg } from "./shared"

const RFID_HOTSPOTS = [
  { phase: "raw_material", contribution: 55 },
  { phase: "production", contribution: 22 },
  { phase: "distribution", contribution: 5 },
  { phase: "end_of_life", contribution: 18 },
]

describe("allocateGwpByPhase", () => {
  it("RFID PCF: phase kg sum equals declared total 524", () => {
    const total = 524
    const rows = allocateGwpByPhase(total, RFID_HOTSPOTS, "cradle-to-grave")
    const nonZero = rows.filter((r) => r.pct > 0)
    expect(sumPhaseKg(nonZero)).toBe(total)
    expect(nonZero.reduce((a, r) => a + r.pct, 0)).toBeCloseTo(100, 1)
  })

  it("does not inflate total when hotspots omit use phase", () => {
    const total = 524
    const rows = allocateGwpByPhase(total, RFID_HOTSPOTS, "cradle-to-grave")
    const useRow = rows.find((r) => r.phase === "use")
    expect(useRow?.kg ?? 0).toBe(0)
    expect(sumPhaseKg(rows.filter((r) => r.kg > 0))).toBe(total)
  })
})
