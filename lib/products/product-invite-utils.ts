/** Client-safe helpers (no Prisma / Node DB). */

export function parseInviteEmails(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@") && e.length > 3)
}

export function buildInvitePath(locale: string, token: string): string {
  return `/${locale}/invite/${token}`
}
