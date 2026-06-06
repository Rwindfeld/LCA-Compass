export const locales = ["da", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "da"
