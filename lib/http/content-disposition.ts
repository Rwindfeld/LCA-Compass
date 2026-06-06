/**
 * HTTP header values must be ByteStrings (Latin-1). Sanitize download filenames
 * and provide RFC 5987 UTF-8 fallback for browsers.
 */
export function toAsciiFilenameSegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u2033/g, "in")
    .replace(/\u2032/g, "ft")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, "-")
    .replace(/["\\]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

export function buildAttachmentContentDisposition(filename: string): string {
  const ascii = toAsciiFilenameSegment(filename) || "download"
  const utf8 = encodeURIComponent(filename.normalize("NFC"))
  return `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`
}
