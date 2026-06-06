import { describe, expect, it } from "vitest"
import { collectStudyLimitations } from "./study-limitations"
import { QR_SEED_PRODUCT, RFID_SEED_PRODUCT } from "./seed-data"

describe("collectStudyLimitations", () => {
  it("returnerer mindst 3 unikke begrænsninger for QR seed", () => {
    const items = collectStudyLimitations("da", {
      goalScope: QR_SEED_PRODUCT.goalScope,
      interpretation: QR_SEED_PRODUCT.interpretation,
      lci: QR_SEED_PRODUCT.lci,
      productType: QR_SEED_PRODUCT.productType,
    })
    expect(items.length).toBeGreaterThanOrEqual(3)
    expect(items.some((s) => /smartphone/i.test(s))).toBe(true)
    expect(items.some((s) => /2026-2027|teknologi-baseline/i.test(s))).toBe(true)
  })

  it("returnerer mindst 4 begrænsninger for RFID seed inkl. PFC og genanvendelse", () => {
    const items = collectStudyLimitations("da", {
      goalScope: RFID_SEED_PRODUCT.goalScope,
      interpretation: RFID_SEED_PRODUCT.interpretation,
      lci: RFID_SEED_PRODUCT.lci,
      productType: RFID_SEED_PRODUCT.productType,
    })
    expect(items.length).toBeGreaterThanOrEqual(3)
    expect(items.some((s) => /PFC/i.test(s))).toBe(true)
    expect(items.some((s) => /15%|genanvend/i.test(s))).toBe(true)
    expect(items.some((s) => /2026-2031/i.test(s))).toBe(true)
  })

  it("udfylder standardbegrænsninger når produktdata er tynde", () => {
    const items = collectStudyLimitations("da", {
      goalScope: { limitations: "Kun én kort begrænsning." },
    })
    expect(items.length).toBeGreaterThanOrEqual(3)
  })
})
