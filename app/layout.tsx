import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "LCA-Kompas — Officiel LCA-dokumentation",
    template: "%s | LCA-Kompas",
  },
  description:
    "Fra produkt-idé til officiel ISO 14044-dokumentation på under en time. Guidet LCA-wizard med AI-genereret professionel rapporttekst og PDF-eksport.",
  keywords: [
    "LCA",
    "livscyklusvurdering",
    "ISO 14044",
    "ISO 14040",
    "EPD",
    "bæredygtighed",
    "carbon footprint",
  ],
  openGraph: {
    siteName: "LCA-Kompas",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
