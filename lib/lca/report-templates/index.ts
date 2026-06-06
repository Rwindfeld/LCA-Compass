import type { ExportFormatId } from "@/lib/lca/export-formats"
import { buildCarbonFootprint14067Report } from "./carbon-footprint-14067"
import { buildEpdIso14025Report } from "./epd-iso14025"
import { buildIso14044FullReport } from "./iso14044-full"
import type { ReportBuildInput } from "./shared"

export type { ReportBuildInput, ReportLocale } from "./shared"
export { markdownToHtml } from "./shared"

export function buildReportHtml(format: string, input: ReportBuildInput): string {
  const id = (format ?? "ISO_14044_FULL") as ExportFormatId

  switch (id) {
    case "EPD_ISO_14025":
      return buildEpdIso14025Report(input)
    case "CARBON_FOOTPRINT_14067":
      return buildCarbonFootprint14067Report(input)
    case "ISO_14044_FULL":
    default:
      return buildIso14044FullReport(input)
  }
}

export function getReportDownloadPrefix(format: string): string {
  switch (format) {
    case "EPD_ISO_14025":
      return "EPD"
    case "CARBON_FOOTPRINT_14067":
      return "PCF"
    default:
      return "LCA"
  }
}

export function getProseSectionsForFormat(format: string): import("@/lib/ai").ProseSection[] {
  if (format === "CARBON_FOOTPRINT_14067") {
    return []
  }
  if (format === "EPD_ISO_14025") {
    return []
  }
  return ["executive_summary", "goal_scope", "lci_raw", "lcia", "interpretation"]
}
