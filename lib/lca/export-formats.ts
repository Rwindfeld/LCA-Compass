export const EXPORT_FORMAT_IDS = [
  "ISO_14044_FULL",
  "EPD_ISO_14025",
  "CARBON_FOOTPRINT_14067",
  "COMPARATIVE_ASSERTION",
] as const

export type ExportFormatId = (typeof EXPORT_FORMAT_IDS)[number]

export function getExportFormatAvailability(
  ambitionLevel: string,
  scenarioCount: number
): Record<ExportFormatId, boolean> {
  return {
    ISO_14044_FULL: true,
    EPD_ISO_14025: ambitionLevel === "EPD_VERIFIED",
    CARBON_FOOTPRINT_14067: true,
    COMPARATIVE_ASSERTION: scenarioCount >= 2,
  }
}

export function getExportFormatRecommended(
  availability: Record<ExportFormatId, boolean>
): Record<ExportFormatId, boolean> {
  return {
    ISO_14044_FULL: !availability.EPD_ISO_14025,
    EPD_ISO_14025: availability.EPD_ISO_14025,
    CARBON_FOOTPRINT_14067: false,
    COMPARATIVE_ASSERTION: false,
  }
}
