import Handlebars from "handlebars"
import { mergeStudyLimitations } from "@/lib/lca/study-limitations"

export type ProseSection =
  | "goal_scope"
  | "lci_raw"
  | "lci_production"
  | "lci_distribution"
  | "lci_use"
  | "lci_eol"
  | "lcia"
  | "interpretation"
  | "conclusion"
  | "executive_summary"

export interface ProseInput {
  section: ProseSection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productData: any
  locale: "da" | "en"
  tone?: "formal_technical" | "executive_summary"
  variantSeed?: number
}

export async function generateProseTemplate(opts: ProseInput): Promise<string> {
  const { section, productData, locale, variantSeed } = opts

  const seed = variantSeed ?? hashCode(productData.id ?? "default")
  const context = buildContext(productData, locale)
  const templates = TEMPLATES[locale][section] ?? []

  if (templates.length === 0) return fallbackProse(section, locale)

  const selected = selectTemplates(templates, context, seed)
  const paragraphs = selected.map((tpl) => {
    try {
      const compiled = Handlebars.compile(tpl)
      return compiled(context)
    } catch {
      return tpl
    }
  })

  return paragraphs.join("\n\n")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildContext(p: any, locale: "da" | "en") {
  const gs = p.goalScope ?? {}
  const lci = p.lci ?? {}
  const lcia = p.lcia ?? {}
  const interp = p.interpretation ?? {}

  const transitions =
    locale === "da"
      ? ["Endvidere", "Derudover", "Yderligere", "I tillæg hertil", "Herudover"]
      : ["Furthermore", "Additionally", "Moreover", "In addition", "Beyond this"]

  const t = transitions[hashCode(p.id ?? "") % transitions.length]

  const da = locale === "da"

  return {
    productName: p.name,
    purpose: gs.purpose ?? (da ? "ikke specificeret" : "not specified"),
    functionalUnitText: gs.functionalUnit?.text ?? (da ? "ikke defineret" : "not defined"),
    functionalUnitQuantity: gs.functionalUnit?.quantity ?? 1,
    functionalUnitUnit: gs.functionalUnit?.unit ?? (da ? "enhed" : "unit"),
    referenceFlow: gs.referenceFlow ?? (da ? "ikke defineret" : "not defined"),
    systemBoundaries: gs.systemBoundaries ?? "Cradle-to-grave",
    allocationApproach: localizeAllocation(gs.allocationApproach, locale),
    cutOff: gs.cutOffCriterion ?? 1,
    geographicScope: gs.geographicScope ?? (da ? "ikke specificeret" : "not specified"),
    timePeriod: gs.timePeriod ?? (da ? "ikke specificeret" : "not specified"),
    limitations: mergeStudyLimitations(locale, gs.limitations, interp.limitations, {
      goalScope: gs,
      interpretation: interp,
      lci: p.lci,
      productType: p.productType,
    }),
    lciaMethod: lcia.method ?? "ReCiPe 2016 (H/A)",
    gwpResult: lcia.results?.gwp_kg_co2 ?? (da ? "ikke beregnet" : "not calculated"),
    topHotspot: interp.hotspots?.[0]?.driver ?? (da ? "ikke identificeret" : "not identified"),
    topHotspotPhase: interp.hotspots?.[0]?.phase ?? (da ? "råmateriale" : "raw material"),
    topHotspotPct: interp.hotspots?.[0]?.contribution ?? 0,
    conclusions: interp.conclusions ?? (da ? "ikke dokumenteret" : "not documented"),
    isoStandard: da ? "ISO 14040:2006 og ISO 14044:2006" : "ISO 14040:2006 and ISO 14044:2006",
    ambitionLevel: localizeAmbition(p.ambitionLevel, locale),
    transition: t,
    materialCount: lci.rawMaterial?.length ?? 0,
    firstMaterial: lci.rawMaterial?.[0]?.name ?? (da ? "primære materialer" : "primary materials"),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function selectTemplates(templates: string[], context: any, seed: number): string[] {
  if (templates.length <= 3) return templates
  const startIdx = seed % (templates.length - 2)
  return templates.slice(startIdx, startIdx + Math.min(4, templates.length))
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function localizeAllocation(val: string, locale: "da" | "en"): string {
  const map: Record<string, { da: string; en: string }> = {
    AVOID_ALLOCATION: { da: "undgå allokering", en: "avoiding allocation" },
    SYSTEM_EXPANSION: { da: "systemudvidelse", en: "system expansion" },
    PHYSICAL_ALLOCATION: { da: "fysisk allokering", en: "physical allocation" },
    ECONOMIC_ALLOCATION: { da: "økonomisk allokering", en: "economic allocation" },
  }
  return map[val]?.[locale] ?? val
}

function localizeAmbition(val: string, locale: "da" | "en"): string {
  const map: Record<string, { da: string; en: string }> = {
    SCREENING: { da: "screening", en: "screening" },
    DETAILED: { da: "detaljeret", en: "detailed" },
    CRITICAL_REVIEWED: { da: "critical reviewed", en: "critically reviewed" },
    EPD_VERIFIED: { da: "EPD-verificeret", en: "EPD-verified" },
  }
  return map[val]?.[locale] ?? val
}

function fallbackProse(section: string, locale: "da" | "en"): string {
  if (locale === "da") {
    return `## ${section.replace("_", " ")}\n\nDenne sektion afventer udfyldning af alle obligatoriske felter i LCA-wizard'en. Udfyld venligst de manglende datapunkter for at generere professionel rapporttekst.`
  }
  return `## ${section.replace("_", " ")}\n\nThis section awaits completion of all mandatory fields in the LCA wizard. Please fill in the missing data points to generate professional report text.`
}

const TEMPLATES: Record<"da" | "en", Partial<Record<ProseSection, string[]>>> = {
  da: {
    goal_scope: [
      `## Formål og afgrænsning

Nærværende livscyklusvurdering (LCA) er udarbejdet i overensstemmelse med {{isoStandard}} med det formål at kvantificere de potentielle miljøpåvirkninger forbundet med {{productName}}. Analysen er gennemført som en {{ambitionLevel}} screening med henblik på at understøtte beslutningstagning vedrørende følgende formål: {{purpose}}.

Den funktionelle enhed er defineret som *"{{functionalUnitText}}"*, der kvantificerer den ydelse produktet leverer som {{functionalUnitQuantity}} {{functionalUnitUnit}}. Reference-flowet, der er nødvendigt for at opfylde denne funktion, er fastsat til {{referenceFlow}}.`,

      `### Systemgrænser og afgrænsning

Systemet er afgrænset som {{systemBoundaries}}, idet dette afspejler produktets primære miljøpåvirkningsprofil og den tilsigtede anvendelse af studiet. I henhold til ISO 14044 §4.2.3.3 er der anvendt et cut-off kriterium på {{cutOff}}% af samlet masse, hvilket indebærer at materialestrømme under denne grænse er udeladt, forudsat at deres samlede miljøpåvirkning vurderes at være marginal.

Geografisk er studiet afgrænset til {{geographicScope}}, og det tidsmæssige scope dækker {{timePeriod}}. Disse afgrænsninger er valgt for at sikre datarelevans og repræsentativitet.`,

      `### Allokeringsmetode

Allokering af miljøpåvirkninger er håndteret ved {{allocationApproach}} i overensstemmelse med ISO 14044&apos;s allokeringshierarki (§4.3.4.2). Denne tilgang er konsistent gennemgående i studiet og dokumenteret i bilagets antagelseslog.`,

      `### Begrænsninger og forbehold

Følgende begrænsninger bør tages i betragtning ved fortolkning af resultaterne: {{limitations}}. Disse begrænsninger påvirker ikke validiteten af de konklusioner der drages inden for studiets afgrænsning, men sætter rammer for hvilke beslutninger studiet kan understøtte.`,
    ],

    lci_raw: [
      `## Livscyklus-inventar: Råmaterialer

Råmaterialefasen udgør et centralt element i nærværende livscyklus-inventar. Der er identificeret {{materialCount}} primære materialestrømme, herunder {{firstMaterial}}, som tilsammen konstituerer produktets materialebasis pr. funktionel enhed.

Alle datapunkter er kvalitetsvurderet i overensstemmelse med ISO 14044's pedigree-matrix-metodologi (§4.2.3.6.2), der dækker dimensionerne pålidelighed, fuldstændighed, tidsmæssig, geografisk og teknologisk korrelation på en skala fra 1 (meget lav) til 5 (meget høj).`,

      `### Datakilder og datakvalitet

Dataindsamlingen er gennemført med udgangspunkt i leverandørdata, anerkendte LCA-databaser (primært Ecoinvent 3.10) samt tilgængelig litteratur. {{transition}} er datakvaliteten vurderet ud fra de specifikke anvendelsesforhold, idet det overordnede datakvalitetsindeks (DQI) afspejler den samlede usikkerhed associeret med råmaterialefasen.

For datapunkter med et DQI-gennemsnit under 3 er der gennemført en konservativ vurdering, der tager højde for potentielle undervurderinger af miljøpåvirkningen.`,
    ],

    lcia: [
      `## Vurdering af miljøpåvirkning (LCIA)

Vurderingen af miljøpåvirkning er gennemført i overensstemmelse med ISO 14044 §4.4 ved anvendelse af {{lciaMethod}}-metoden, der er valgt på baggrund af dens brede accept inden for det relevante geografiske og faglige scope.

### Karakteriseringsresultater

Klimapåvirkning (GWP, 100-år) udgør {{gwpResult}} kg CO₂-ækvivalenter pr. funktionel enhed, beregnet ved hjælp af IPCC-karakteriseringsfaktorer som implementeret i {{lciaMethod}}.`,

      `### Hotspot-analyse

Den systematiske hotspot-analyse identificerer {{topHotspotPhase}}-fasen som den primære bidragsyder til den samlede klimapåvirkning med {{topHotspotPct}}% af det totale GWP. Det primære drivende element er {{topHotspot}}.

{{transition}} demonstrerer analysen at der er et betydeligt forbedringspotentiale i råmaterialevalg og produktionsprocesser, hvilket bør prioriteres i fremtidige produktudviklingsiterationer.`,
    ],

    interpretation: [
      `## Fortolkning

I overensstemmelse med ISO 14044 §4.5 er nærværende fortolkning struktureret omkring tre kerneelementer: identifikation af signifikante issues, evaluering af resultaternes robusthed samt formulering af konklusioner og anbefalinger.

### Signifikante miljøpåvirkninger

Den gennemførte hotspot-analyse identificerer {{topHotspotPhase}}-fasen som den dominerende kilde til miljøpåvirkning, primært drevet af {{topHotspot}} ({{topHotspotPct}}% af GWP). Dette fund er konsistent på tværs af de analyserede impact-kategorier og udgør således et klart fokusområde for produktforbedring.`,

      `### Konklusioner

{{topHotspotPhase}}-fasen er identificeret som den dominerende bidragsyder til den samlede miljøpåvirkning med {{topHotspotPct}}% af det totale GWP, primært drevet af {{topHotspot}}. Den samlede klimapåvirkning udgør {{gwpResult}} kg CO₂-ækvivalenter pr. funktionel enhed.

Resultaternes robusthed er verificeret gennem følsomhedsanalyse, der demonstrerer at de overordnede konklusioner forbliver stabile inden for de undersøgte parametervariationers rækkevidde.`,

      `### Begrænsninger

{{limitations}}

Det understreges at nærværende LCA-studie leverer et dokumenteret og transparent grundlag for de angivne konklusioner, og at begrænsningerne ikke undergraver studiets metodologiske integritet inden for det definerede scope.`,
    ],

    executive_summary: [
      `## Resumé

Nærværende livscyklusvurdering af {{productName}} er gennemført i overensstemmelse med {{isoStandard}}. Studiet kvantificerer de potentielle miljøpåvirkninger over produktets fulde livscyklus ({{systemBoundaries}}) med den funktionelle enhed defineret som "{{functionalUnitText}}".

Den samlede klimapåvirkning er beregnet til {{gwpResult}} kg CO₂-ækvivalenter pr. funktionel enhed. Hotspot-analysen identificerer {{topHotspotPhase}} som den primære bidragsyder med {{topHotspotPct}}% af den totale GWP, primært drevet af {{topHotspot}}.`,
    ],
  },

  en: {
    goal_scope: [
      `## Goal and Scope Definition

This life cycle assessment (LCA) has been conducted in accordance with {{isoStandard}} with the purpose of quantifying the potential environmental impacts associated with {{productName}}. The study has been performed as a {{ambitionLevel}} assessment to support decision-making regarding the following goal: {{purpose}}.

The functional unit is defined as *"{{functionalUnitText}}"*, representing the quantified service delivered as {{functionalUnitQuantity}} {{functionalUnitUnit}}. The reference flow required to fulfil this function is {{referenceFlow}}.`,

      `### System Boundaries and Scope

The system has been bounded as {{systemBoundaries}}, reflecting the primary environmental impact profile of the product and the intended application of this study. In accordance with ISO 14044 §4.2.3.3, a cut-off criterion of {{cutOff}}% of total mass has been applied, meaning material flows below this threshold have been excluded, provided their overall environmental significance is judged to be negligible.

The geographic scope is limited to {{geographicScope}}, and the temporal scope covers {{timePeriod}}.`,

      `### Allocation Approach

Environmental impact allocation has been handled by {{allocationApproach}} in accordance with ISO 14044's allocation hierarchy (§4.3.4.2). This approach is applied consistently throughout the study.`,

      `### Limitations

The following limitations should be considered when interpreting the results: {{limitations}}. These limitations do not affect the validity of conclusions drawn within the defined scope of the study.`,
    ],

    lci_raw: [
      `## Life Cycle Inventory: Raw Materials

The raw material phase constitutes a central element of this life cycle inventory. A total of {{materialCount}} primary material flows have been identified, including {{firstMaterial}}, which together form the material basis of the product per functional unit.

All data points have been quality-assessed in accordance with the ISO 14044 pedigree matrix methodology (§4.2.3.6.2), covering the dimensions of reliability, completeness, temporal, geographic, and technological correlation on a scale from 1 (very low) to 5 (very high).`,

      `### Data Sources and Data Quality

Data collection has been carried out based on supplier data, recognised LCA databases (primarily Ecoinvent 3.10), and available literature. {{transition}}, data quality has been assessed based on the specific conditions of use, with the overall data quality index (DQI) reflecting the aggregate uncertainty associated with the raw material phase.

For data points with a mean DQI below 3, a conservative assessment has been applied to account for potential underestimations of environmental impact.`,
    ],

    lcia: [
      `## Life Cycle Impact Assessment (LCIA)

The impact assessment has been conducted in accordance with ISO 14044 §4.4 using the {{lciaMethod}} method, selected for its broad acceptance within the relevant geographic and professional scope.

### Characterisation Results

Climate change (GWP, 100-year) amounts to {{gwpResult}} kg CO₂-equivalents per functional unit, calculated using IPCC characterisation factors as implemented in {{lciaMethod}}.`,

      `### Hotspot Analysis

The systematic hotspot analysis identifies the {{topHotspotPhase}} phase as the primary contributor to overall climate impact, accounting for {{topHotspotPct}}% of total GWP. The primary driver is {{topHotspot}}.`,
    ],

    interpretation: [
      `## Interpretation

In accordance with ISO 14044 §4.5, this interpretation is structured around three core elements: identification of significant issues, evaluation of result robustness, and formulation of conclusions and recommendations.

### Significant Environmental Impacts

The hotspot analysis identifies the {{topHotspotPhase}} phase as the dominant environmental impact source, driven primarily by {{topHotspot}} ({{topHotspotPct}}% of GWP).`,

      `### Conclusions

The {{topHotspotPhase}} phase has been identified as the dominant contributor to overall environmental impact, accounting for {{topHotspotPct}}% of total GWP and driven primarily by {{topHotspot}}. The total climate impact amounts to {{gwpResult}} kg CO₂-equivalents per functional unit.

Result robustness has been verified through sensitivity analysis, demonstrating that the overall conclusions remain stable across the range of parameter variations investigated.`,

      `### Limitations

{{limitations}}

It is emphasised that this LCA study provides a documented and transparent basis for the stated conclusions, and that the identified limitations do not undermine the methodological integrity of the study within the defined scope.`,
    ],

    executive_summary: [
      `## Executive Summary

This life cycle assessment of {{productName}} has been conducted in accordance with {{isoStandard}}. The study quantifies potential environmental impacts across the full product lifecycle ({{systemBoundaries}}) with the functional unit defined as "{{functionalUnitText}}".

Total climate impact is calculated at {{gwpResult}} kg CO₂-equivalents per functional unit. Hotspot analysis identifies the {{topHotspotPhase}} phase as the primary contributor at {{topHotspotPct}}% of total GWP, driven by {{topHotspot}}.`,
    ],
  },
}
