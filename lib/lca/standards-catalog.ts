export type StandardCategory =
  | "core"
  | "declarations"
  | "footprints"
  | "review"
  | "organizational"
  | "supplementary"

export type StandardEntry = {
  id: string
  code: string
  year: string
  category: StandardCategory
  /** Official publisher page (ISO, CEN, EU). Full text is typically licensed. */
  officialUrl: string
  publisher: "ISO" | "CEN" | "EU"
  relatedIds?: string[]
}

export type SupplementaryResource = {
  id: string
  url: string
  publisher: "EU" | "CEN"
  freeAccess: boolean
}

/** ISO and related normative references for product LCA (official catalog links). */
export const STANDARDS_CATALOG: StandardEntry[] = [
  {
    id: "iso14040",
    code: "ISO 14040",
    year: "2006",
    category: "core",
    officialUrl: "https://www.iso.org/standard/37456.html",
    publisher: "ISO",
    relatedIds: ["iso14044"],
  },
  {
    id: "iso14044",
    code: "ISO 14044",
    year: "2006",
    category: "core",
    officialUrl: "https://www.iso.org/standard/38498.html",
    publisher: "ISO",
    relatedIds: ["iso14040", "iso14071"],
  },
  {
    id: "iso14025",
    code: "ISO 14025",
    year: "2006",
    category: "declarations",
    officialUrl: "https://www.iso.org/standard/38131.html",
    publisher: "ISO",
    relatedIds: ["iso14027", "en15804"],
  },
  {
    id: "iso14027",
    code: "ISO/TS 14027",
    year: "2017",
    category: "declarations",
    officialUrl: "https://www.iso.org/standard/66123.html",
    publisher: "ISO",
    relatedIds: ["iso14025"],
  },
  {
    id: "iso14026",
    code: "ISO 14026",
    year: "2017",
    category: "declarations",
    officialUrl: "https://www.iso.org/standard/67401.html",
    publisher: "ISO",
  },
  {
    id: "iso14067",
    code: "ISO 14067",
    year: "2018",
    category: "footprints",
    officialUrl: "https://www.iso.org/standard/59521.html",
    publisher: "ISO",
    relatedIds: ["iso14040", "iso14044"],
  },
  {
    id: "iso14046",
    code: "ISO 14046",
    year: "2014",
    category: "footprints",
    officialUrl: "https://www.iso.org/standard/43263.html",
    publisher: "ISO",
    relatedIds: ["iso14040", "iso14044"],
  },
  {
    id: "iso14071",
    code: "ISO 14071",
    year: "2024",
    category: "review",
    officialUrl: "https://www.iso.org/standard/82293.html",
    publisher: "ISO",
    relatedIds: ["iso14044"],
  },
  {
    id: "iso14072",
    code: "ISO 14072",
    year: "2024",
    category: "organizational",
    officialUrl: "https://www.iso.org/standard/86265.html",
    publisher: "ISO",
    relatedIds: ["iso14040", "iso14044"],
  },
  {
    id: "en15804",
    code: "EN 15804",
    year: "2012+A2:2019",
    category: "declarations",
    officialUrl: "https://www.en-standard.eu/standard/BS-EN-15804-2012-A2-2019/",
    publisher: "CEN",
    relatedIds: ["iso14025", "iso14044"],
  },
]

export const SUPPLEMENTARY_RESOURCES: SupplementaryResource[] = [
  {
    id: "ilcd",
    url: "https://eplca.jrc.ec.europa.eu/archives/ILCD-Handbook.html",
    publisher: "EU",
    freeAccess: true,
  },
  {
    id: "pef",
    url: "https://environment.ec.europa.eu/topics/circular-economy/product-environmental-footprint_en",
    publisher: "EU",
    freeAccess: true,
  },
]

export const CATEGORY_ORDER: StandardCategory[] = [
  "core",
  "declarations",
  "footprints",
  "review",
  "organizational",
]
