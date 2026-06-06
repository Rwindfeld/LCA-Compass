export type ReportLocale = "da" | "en"

export type ReportBuildInput = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any
  prose: Record<string, string>
  locale: ReportLocale
  date: string
  reportId: string
  reportFormat: string
  options?: {
    includeAppendices?: boolean
    showDqi?: boolean
    anonymize?: boolean
  }
}

export const REPORT_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 22mm 20mm 28mm 20mm; }
  body {
    font-family: "Times New Roman", Times, serif;
    color: #000;
    background: #fff;
    font-size: 11pt;
    line-height: 1.45;
    max-width: 170mm;
    margin: 0 auto;
    padding: 20mm 0 10mm;
  }
  h1 { font-size: 20pt; font-weight: bold; margin-bottom: 4pt; }
  h2 { font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; border-bottom: 1px solid #000; padding-bottom: 2pt; }
  h3 { font-size: 11pt; font-weight: bold; margin-top: 10pt; margin-bottom: 3pt; }
  p { margin-top: 0; margin-bottom: 5pt; text-align: justify; }
  ul, ol { margin: 4pt 0 4pt 18pt; padding: 0; }
  li { margin-bottom: 2pt; }
  .cover {
    min-height: calc(297mm - 50mm);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    border-bottom: 2px solid #000;
    padding-bottom: 10pt;
  }
  .cover-title { font-size: 22pt; font-weight: bold; margin-bottom: 6pt; }
  .cover-product { font-size: 16pt; margin-bottom: 4pt; }
  .cover-subtitle { font-size: 10pt; font-style: italic; margin-bottom: 16pt; }
  .cover-meta-table { width: 100%; border-collapse: collapse; margin-top: 16pt; font-size: 10pt; }
  .cover-meta-table td { padding: 3pt 6pt; border: 1px solid #aaa; }
  .cover-meta-table td:first-child { font-weight: bold; width: 40%; background: #f0f0f0; }
  .cover-bottom { flex: 1; display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 4pt; gap: 20pt; }
  .cover-highlights { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 6pt; }
  .cover-highlights-title { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #555; border-bottom: 1px solid #ccc; padding-bottom: 3pt; }
  .cover-kpi { border-left: 3px solid #333; padding: 4pt 8pt; background: #f7f7f7; margin-bottom: 5pt; }
  .cover-kpi-label { font-size: 7.5pt; color: #555; text-transform: uppercase; }
  .cover-kpi-value { font-size: 11pt; font-weight: bold; }
  .cover-stamp-wrap { display: flex; flex-direction: column; align-items: center; gap: 4pt; flex-shrink: 0; }
  .cover-stamp { width: 150pt; height: 150pt; opacity: 0.9; }
  .cover-stamp-id { font-size: 7.5pt; color: #444; font-family: "Courier New", monospace; text-align: center; }
  .section { page-break-before: always; }
  .section:first-of-type { page-break-before: auto; }
  .callout { border: 1px solid #555; border-left: 4px solid #000; padding: 6pt 10pt; margin: 8pt 0; font-size: 10.5pt; background: #f8f8f8; }
  .callout-warn { border-left-color: #8a6d00; background: #fffbeb; }
  .hero-gwp { font-size: 28pt; font-weight: bold; text-align: center; margin: 16pt 0 8pt; }
  .hero-unit { font-size: 11pt; text-align: center; color: #444; margin-bottom: 12pt; }
  .toc-table { width: 100%; border-collapse: collapse; margin: 6pt 0 0; font-size: 10.5pt; }
  .toc-table td { padding: 3pt 0; border-bottom: 1px dotted #bbb; }
  .toc-table td:last-child { text-align: right; }
  table { width: 100%; border-collapse: collapse; margin: 8pt 0; font-size: 10pt; }
  th { background: #e0e0e0; font-weight: bold; padding: 5pt 7pt; text-align: left; border: 1px solid #888; }
  td { padding: 4pt 7pt; border: 1px solid #bbb; vertical-align: top; }
  tr:nth-child(even) td { background: #f5f5f5; }
  td.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.na { color: #888; font-style: italic; }
  .bar-cell { position: relative; }
  .bar-fill { display: block; height: 10pt; background: #2d4a3e; margin-top: 2pt; max-width: 100%; }
  .page-footer {
    position: fixed; bottom: 0; left: 0; width: 100%;
    display: flex; align-items: flex-end; justify-content: space-between;
    padding: 0 20mm 4mm; font-size: 8pt; color: #555; border-top: 1px solid #ccc;
  }
  .page-footer img { width: 52pt; height: 52pt; opacity: 0.85; }
  @media screen { body { padding: 30px; max-width: 800px; } .cover { min-height: 70vh; } }
  @media print { body { padding: 0; } }
`

export function escapeHtml(text: unknown): string {
  if (text == null) return ""
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ""
  const blocks = markdown.split(/\n{2,}/)
  return blocks
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (trimmed.startsWith("## ")) return `<h3>${escapeHtml(trimmed.slice(3))}</h3>`
      if (trimmed.startsWith("### ")) return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`
      if (trimmed.split("\n").every((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))) {
        const items = trimmed
          .split("\n")
          .map((l) => `<li>${escapeHtml(l.replace(/^[-*]\s+/, ""))}</li>`)
          .join("")
        return `<ul>${items}</ul>`
      }
      const withBold = escapeHtml(trimmed).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      return `<p>${withBold.replace(/\n/g, " ")}</p>`
    })
    .filter(Boolean)
    .join("\n")
}

export function wrapReportHtml(
  locale: ReportLocale,
  title: string,
  body: string,
  generatedBy: string,
  reportId: string,
  date: string
): string {
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>${REPORT_STYLES}</style>
</head>
<body>
<div class="page-footer">
  <span>${escapeHtml(generatedBy)} — lca-compass.dk &nbsp;·&nbsp; ID: #${escapeHtml(reportId)}</span>
  <img src="/lca-stamp.png" alt="LCA Compass seal" />
  <span>${escapeHtml(date)}</span>
</div>
${body}
</body>
</html>`
}

export function buildCoverStamp(reportId: string): string {
  return `<div class="cover-stamp-wrap">
    <img class="cover-stamp" src="/lca-stamp.png" alt="LCA Compass official seal" />
    <span class="cover-stamp-id">ID: #${escapeHtml(reportId)}</span>
  </div>`
}

export function detectSystemBoundary(systemBoundaries?: string): "cradle-to-gate" | "cradle-to-grave" {
  const s = (systemBoundaries ?? "").toLowerCase()
  if (s.includes("gate") || s.includes("a1-a3") || s.includes("cradle-to-gate")) {
    return "cradle-to-gate"
  }
  return "cradle-to-grave"
}

export function getBaselineGwp(product: { lcia?: { results?: { gwp_kg_co2?: unknown } } }): number | null {
  const val = product.lcia?.results?.gwp_kg_co2
  if (val == null || val === "") return null
  const n = typeof val === "number" ? val : Number(val)
  return Number.isFinite(n) ? n : null
}

export type PhaseGwpRow = { phase: string; label: { da: string; en: string }; kg: number; pct: number }

const PHASE_LABELS: Record<string, { da: string; en: string }> = {
  raw_material: { da: "Råmaterialer (A1)", en: "Raw materials (A1)" },
  production: { da: "Produktion (A3)", en: "Production (A3)" },
  distribution: { da: "Transport (A4)", en: "Transport (A4)" },
  use: { da: "Brug (B)", en: "Use (B)" },
  end_of_life: { da: "End-of-life (C)", en: "End-of-life (C)" },
}

/** Aggregér hotspot-% pr. fase (summerer dubletter) og normalisér til 100 %. */
export function aggregateHotspotShares(
  hotspots: { phase?: string; contribution?: number }[] | undefined,
  allowedPhases: string[]
): Record<string, number> {
  const aggregated: Record<string, number> = {}
  if (!Array.isArray(hotspots)) return aggregated

  for (const h of hotspots) {
    if (!h.phase || typeof h.contribution !== "number" || !allowedPhases.includes(h.phase)) {
      continue
    }
    aggregated[h.phase] = (aggregated[h.phase] ?? 0) + h.contribution
  }

  const sum = Object.values(aggregated).reduce((a, b) => a + b, 0)
  if (sum <= 0) return aggregated

  for (const phase of Object.keys(aggregated)) {
    aggregated[phase] = (aggregated[phase] / sum) * 100
  }
  return aggregated
}

function roundKgShares(totalGwp: number, pcts: number[]): number[] {
  const kg = pcts.map((pct) => Math.round(totalGwp * (pct / 100) * 10) / 10)
  const drift = Math.round((totalGwp - kg.reduce((a, b) => a + b, 0)) * 10) / 10
  if (drift !== 0 && kg.length > 0) {
    const idx = pcts.indexOf(Math.max(...pcts))
    kg[idx] = Math.round((kg[idx] + drift) * 10) / 10
  }
  return kg
}

/** Fordel total GWP på livscyklusfaser; fase-kg summer altid til totalGwp. */
export function allocateGwpByPhase(
  totalGwp: number,
  hotspots: { phase?: string; contribution?: number }[] | undefined,
  boundary: "cradle-to-gate" | "cradle-to-grave"
): PhaseGwpRow[] {
  const phases =
    boundary === "cradle-to-gate"
      ? ["raw_material", "production", "distribution"]
      : ["raw_material", "production", "distribution", "use", "end_of_life"]

  const defaultShare: Record<string, number> =
    boundary === "cradle-to-gate"
      ? { raw_material: 70, production: 22, distribution: 8 }
      : { raw_material: 52, production: 14, distribution: 8, use: 22, end_of_life: 4 }

  const fromHotspots = aggregateHotspotShares(hotspots, phases)
  const hasHotspots = Object.keys(fromHotspots).length > 0
  const shares = hasHotspots ? fromHotspots : defaultShare

  const pcts = phases.map((phase) => shares[phase] ?? 0)
  const kgValues = roundKgShares(totalGwp, pcts)

  return phases.map((phase, i) => {
    const pct = Math.round(pcts[i] * 10) / 10
    const label = PHASE_LABELS[phase] ?? { da: phase, en: phase }
    return { phase, label, kg: kgValues[i], pct }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasAppendixContent(product: any): boolean {
  const lci = product.lci ?? {}
  const interp = product.interpretation ?? {}
  const sens = interp.sensitivityAnalysis
  return Boolean(
    lci.rawMaterial?.length ||
    lci.distribution?.length ||
    sens?.results ||
    (Array.isArray(sens?.parameters) && sens.parameters.length > 0)
  )
}

export function sumPhaseKg(rows: PhaseGwpRow[]): number {
  return Math.round(rows.reduce((a, r) => a + r.kg, 0) * 10) / 10
}

export function averageDqi(
  materials: { dqi?: Record<string, number> }[] | undefined
): number | null {
  if (!materials?.length) return null
  let sum = 0
  let n = 0
  for (const m of materials) {
    const d = m.dqi
    if (!d) continue
    const scores = [d.reliability, d.completeness, d.temporal, d.geographic, d.technological].filter(
      (v) => typeof v === "number"
    )
    if (scores.length) {
      sum += scores.reduce((a, b) => a + b, 0) / scores.length
      n++
    }
  }
  return n ? Math.round((sum / n) * 10) / 10 : null
}
