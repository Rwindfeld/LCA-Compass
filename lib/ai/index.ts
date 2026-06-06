import { generateProseTemplate, type ProseInput, type ProseSection } from "./template-engine"

export type { ProseSection, ProseInput }

export async function generateProse(opts: ProseInput): Promise<string> {
  if (process.env.AI_PROVIDER === "gemini") {
    // Future: import and call Gemini
    return generateProseTemplate(opts)
  }
  return generateProseTemplate(opts)
}
