// ─── SCREENING ~40% (6/15 felter udfyldt) ───────────────────────────────────
export const TSHIRT_SEED_PRODUCT = {
  name: "Bomulds-T-shirt",
  productType: "TEXTILE" as const,
  description:
    "Konventionel bomulds-T-shirt produceret i Bangladesh og solgt på det danske marked. Screeningsniveau LCA til intern prioritering.",
  ambitionLevel: "SCREENING" as const,
  status: "DRAFT" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "Screening-LCA til internt brug: Identificer de to primære hotspot-faser i T-shirtens livscyklus med henblik på prioritering af dataindsats.",
    audience: ["Produkt-team", "Bæredygtighedsansvarlig"],
    comparativeAssertion: false,
    functionalUnit: {
      type: "Funktionsbaseret",
      text: "Bære ét bomulds-T-shirt i ét år (52 vask ved 40°C)",
      quantity: 1,
      unit: "stk/år",
    },
    referenceFlow: "Et T-shirt à 200 g bomuld",
    systemBoundaries: "Cradle-to-grave: råvare → produktion → brug → affald",
    // cutOffCriterion: mangler (missing)
    // allocationApproach: mangler (missing)
    geographicScope: "Bangladesh → Danmark",
    timePeriod: "2025",
  },
  lci: {
    rawMaterial: [
      {
        name: "Bomuld (konventionel)",
        quantity: 200,
        unit: "g/stk",
        type: "Primært",
        origin: "Indien",
        sourceType: "LITERATURE",
        sourceDetails: "Textile Exchange 2023 – global cotton average",
        dqi: { reliability: 3, completeness: 3, temporal: 4, geographic: 3, technological: 3 },
        co2eqPerUnit: 3.8,
      },
    ],
    production: {
      // processes: mangler (missing)
      water: null,
      waste: null,
      directEmissions: null,
    },
    // distribution: mangler (missing)
    use: {
      lifetime: 2,
      energyKwhPerYear: 18,
      consumables: "Vaskemiddel",
      maintenance: null,
      // userBehaviorAssumptions: mangler (missing)
    },
    endOfLife: {
      reuse: 5,
      recycled: 10,
      energyRecovery: 15,
      landfill: 70,
      other: 0,
      designForDisassembly: false,
      // recoveryRateAssumptions: mangler (missing)
      // takeBackProgram: mangler (missing)
    },
  },
  lcia: {
    method: "CML 2002",
    categories: ["GWP"],
    normalization: false,
    weighting: false,
    results: {
      gwp_kg_co2: 7.5,
    },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: [],
      // results: mangler (missing)
    },
    hotspots: [
      { phase: "raw_material", contribution: 60, driver: "Vandintensiv bomuldsproduktion" },
      { phase: "use", contribution: 30, driver: "Vask og tørring" },
    ],
    conclusions:
      "Bomulds-råvaren og brugsfasens vaskeprocesser er de primære hotspots. Videre detaljering anbefales for distribution og slutbehandling.",
    limitations: "Screening-niveau; data baseret på litteraturgennemsnit.",
  },
  complianceScore: 40,
}

// ─── DETAILED ~67% (10/15 felter udfyldt) ────────────────────────────────────
export const PACKAGING_SEED_PRODUCT = {
  name: "Biobaseret emballage (PLA-bæger)",
  productType: "PACKAGING" as const,
  description:
    "Engangs-drikkebæger fremstillet af polylactid (PLA) baseret på majsstivelse. Beregnet til kold- og varmdrik på caféer.",
  ambitionLevel: "DETAILED" as const,
  status: "IN_PROGRESS" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "Vurdere klimapåvirkning for PLA-bæger sammenlignet med PS-bæger (polystyren) med henblik på leverandørvalg og markedsføringspåstande.",
    audience: ["Indkøbsafdeling", "Marketing", "Ekstern konsulent"],
    comparativeAssertion: true,
    functionalUnit: {
      type: "Brugsbaseret",
      text: "Indeholde og levere 300 ml drikkevare til én forbruger én gang",
      quantity: 1,
      unit: "bæger",
    },
    referenceFlow: "1 PLA-bæger à 8 g",
    systemBoundaries: "Cradle-to-gate + end-of-life",
    cutOffCriterion: 1,
    allocationApproach: "ECONOMIC_ALLOCATION",
    geographicScope: "EU (Nederlandene)",
    timePeriod: "2025-2026",
    limitations: "Brugsfasen er udeladt (bæger bruges én gang).",
  },
  lci: {
    rawMaterial: [
      {
        name: "PLA-granulat",
        quantity: 8,
        unit: "g/bæger",
        type: "Primært",
        origin: "USA (NatureWorks)",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — polylactic acid, granulate",
        dqi: { reliability: 4, completeness: 4, temporal: 4, geographic: 3, technological: 4 },
        co2eqPerUnit: 0.039,
      },
      {
        name: "Farve-additiver",
        quantity: 0.1,
        unit: "g/bæger",
        type: "Sekundært",
        sourceType: "ASSUMPTION",
        dqi: { reliability: 2, completeness: 2, temporal: 3, geographic: 3, technological: 2 },
      },
    ],
    production: {
      processes: [
        {
          name: "Termoplastisk formning",
          location: "Nederlandene",
          energyKwh: 0.004,
          energySource: "NL el-mix",
        },
      ],
      water: null,
      waste: "5% PLA-spild ved formning – granuleres igen",
      directEmissions: null, // missing
    },
    distribution: [
      {
        from: "Nederlandene",
        to: "Danmark",
        distance: 750,
        method: "Lastbil",
        loadFactor: 85,
      },
    ],
    use: {
      lifetime: 0.003,
      energyKwhPerYear: 0,
      consumables: "Ingen",
      maintenance: "Ingen",
      userBehaviorAssumptions:
        "Bæger anvendes én gang og kasseres via det kommunale indsamlingssystem.",
    },
    endOfLife: {
      reuse: 0,
      recycled: 5,
      energyRecovery: 20,
      landfill: 75,
      other: 0,
      designForDisassembly: false,
      // recoveryRateAssumptions: mangler (missing)
      // takeBackProgram: mangler (missing)
    },
  },
  lcia: {
    method: "ReCiPe 2016 (H/A)",
    categories: ["GWP", "LU", "WU"],
    normalization: false,
    weighting: false,
    results: {
      gwp_kg_co2: 0.042,
    },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: [],
      // results: mangler (missing)
    },
    hotspots: [
      { phase: "raw_material", contribution: 72, driver: "PLA-granulat-produktion (landbrugsfase)" },
      { phase: "production", contribution: 15, driver: "Termoplastisk formning" },
    ],
    // conclusions: mangler (missing)
    limitations:
      "Kompostering i industrielle anlæg er ikke modelleret pga. usikker infrastruktur i DK.",
  },
  complianceScore: 67,
}

// ─── CRITICAL_REVIEWED ~87% (13/15 felter udfyldt) ───────────────────────────
export const STEEL_SEED_PRODUCT = {
  name: "Varmvalsed stålbjælke (HEA 200)",
  productType: "CONSTRUCTION" as const,
  description:
    "Standard bærende stålbjælke til erhvervsbyggeri. Fremstillet af ~30% genbrugsstål via EAF-rute i Sverige.",
  ambitionLevel: "CRITICAL_REVIEWED" as const,
  status: "REVIEW_PENDING" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "Dokumenter klimaaftryk og ressourceforbrug for HEA 200-bjælke til brug i EPD-process og bygherrekrav (DGNB/BREEAM). Ekstern critical review er planlagt.",
    audience: ["Bygherrer", "Rådgivende ingeniører", "Certificeringsorgan (DGNB)"],
    comparativeAssertion: false,
    functionalUnit: {
      type: "Masserelateret",
      text: "Producere og levere 1 ton varmvalset stålbjælke (HEA 200) til byggeplads i Danmark",
      quantity: 1,
      unit: "ton",
    },
    referenceFlow: "1.000 kg varmvalset stål (HEA 200 profil)",
    systemBoundaries: "Cradle-to-gate (A1-A3 iht. EN 15804)",
    cutOffCriterion: 1,
    allocationApproach: "PHYSICAL_ALLOCATION",
    geographicScope: "Sverige → Danmark",
    timePeriod: "2025 (produktionsdata fra SSAB)",
    limitations: "Transport fra byggeplads til slutbrug (A4) er ekskluderet.",
  },
  lci: {
    rawMaterial: [
      {
        name: "Skrotjern (genanvendt stål)",
        quantity: 700,
        unit: "kg/ton",
        type: "Primært",
        origin: "EU (blandet)",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "SSAB produktdata 2024 – skrot-ratio EAF",
        dqi: { reliability: 5, completeness: 4, temporal: 5, geographic: 5, technological: 5 },
        co2eqPerUnit: 0.35,
      },
      {
        name: "Jernmalm (primær)",
        quantity: 300,
        unit: "kg/ton",
        type: "Primært",
        origin: "Sverige (LKAB)",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "SSAB EPD 2024",
        dqi: { reliability: 5, completeness: 5, temporal: 5, geographic: 5, technological: 5 },
        co2eqPerUnit: 0.22,
      },
      {
        name: "Legeringselementer (Mn, Si)",
        quantity: 8,
        unit: "kg/ton",
        type: "Sekundært",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10",
        dqi: { reliability: 4, completeness: 4, temporal: 4, geographic: 4, technological: 4 },
      },
    ],
    production: {
      processes: [
        {
          name: "EAF-smelteovn",
          location: "Sverige",
          energyKwh: 430,
          energySource: "SE el-mix (høj vedvarende andel)",
        },
        {
          name: "Varmvalsning",
          location: "Sverige",
          energyKwh: 55,
          energySource: "SE el-mix",
        },
      ],
      water: 2.1,
      waste: "Slagge: 35 kg/ton — genanvendes som fyldmateriale",
      directEmissions: "NOx: 0.8 kg/ton, støv: 0.12 kg/ton (filtreret)",
    },
    distribution: [
      {
        from: "Sverige (Luleå)",
        to: "Danmark (Aarhus)",
        distance: 1100,
        method: "Sø + lastbil",
        loadFactor: 80,
      },
    ],
    use: {
      lifetime: 50,
      energyKwhPerYear: 0,
      consumables: "Ingen",
      maintenance: "Periodisk korrosionsbeskyttelse (antaget 1× pr. 15 år)",
      userBehaviorAssumptions:
        "Bjælken antages at være integreret i bærende konstruktion med levetid på 50 år.",
    },
    endOfLife: {
      reuse: 5,
      recycled: 85,
      energyRecovery: 0,
      landfill: 10,
      other: 0,
      designForDisassembly: true,
      recoveryRateAssumptions:
        "Baseret på Dansk Stål-statistik 2023: 85% genanvendelsesrate for konstruktionsstål.",
      // takeBackProgram: mangler (missing)
    },
  },
  lcia: {
    method: "EN 15804+A2 (GWP, ODP, POCP, AP, EP, PENRT, PERT)",
    categories: ["GWP", "ODP", "AP", "EP", "POCP", "resource_depletion"],
    normalization: true,
    weighting: false,
    results: {
      gwp_kg_co2: 785,
      eWaste_kg: 0,
      resourceDepletion: "medium (jernmalm, legeringer)",
    },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: ["skrot-ratio", "el-mix (SE vs EU-mix)", "levetid"],
      // results: mangler (missing)
    },
    hotspots: [
      { phase: "raw_material", contribution: 48, driver: "Jernmalm-udvinding og skrotbehandling" },
      { phase: "production", contribution: 40, driver: "EAF-energiforbrug og procesemissioner" },
      { phase: "distribution", contribution: 7, driver: "Søtransport" },
    ],
    conclusions:
      "GWP for HEA 200 via EAF-rute er 785 kg CO₂-eq/ton, hvilket er 35% lavere end BF-BOF-ruten (EU-gennemsnit ~1.200 kg). Høj skrot-andel (70%) og vedvarende svensk el er de primære drivkræfter. Critical review anbefales at fokusere på slagge-allokering og transportdata.",
    limitations:
      "Modul D (genanvendelsespotentiale) er ikke medtaget i GWP-tallet. Sensitetsanalyse er under udarbejdelse.",
  },
  complianceScore: 87,
}

// ─── EPD_VERIFIED ~93% (14/15 felter udfyldt) ────────────────────────────────
export const LAPTOP_SEED_PRODUCT = {
  name: "Bærbar computer (15 tommer business)",
  productType: "ELECTRONICS" as const,
  description:
    "Professionel 15″ bærbar computer til erhvervsbrug. Fremstillet i Taiwan med batterilevetid på 5 år og dokumenteret take-back program.",
  ambitionLevel: "EPD_VERIFIED" as const,
  status: "EPD_READY" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "Udarbejde verificeret EPD (ISO 14025 + EN 50693) for 15″ business laptop til brug i offentlige udbud (grønne indkøbskriterier) og CSRD-rapportering.",
    audience: [
      "Offentlige indkøbere",
      "Erhvervskunder",
      "Tredjepartsrevisor (SGS Danmark)",
      "Investorer",
    ],
    comparativeAssertion: false,
    functionalUnit: {
      type: "Funktionsbaseret",
      text: "Levere bærbar computerkraft til erhvervsbrugere i 5 år (8 t/dag, 220 dage/år)",
      quantity: 1,
      unit: "laptop/5 år",
    },
    referenceFlow: "1 laptop à 1.850 g inkl. batteri",
    systemBoundaries: "Cradle-to-grave (alle livscyklusfaser A1-C4 iht. EN 50693)",
    cutOffCriterion: 1,
    allocationApproach: "PHYSICAL_ALLOCATION",
    geographicScope: "Global supply chain → Danmark/EU",
    timePeriod: "2024-2025 produktionsdata",
    limitations:
      "Masserelateret allokering mellem hovedkomponenter. Cloud-infrastruktur til synkroniseringstjenester er ikke medregnet.",
  },
  lci: {
    rawMaterial: [
      {
        name: "PCB med komponenter (mainboard)",
        quantity: 320,
        unit: "g/stk",
        type: "Primært",
        origin: "Taiwan/Kina",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "Leverandørspecifik BOM-data fra Foxconn 2024",
        dqi: { reliability: 5, completeness: 5, temporal: 5, geographic: 5, technological: 5 },
        co2eqPerUnit: 68,
      },
      {
        name: "Li-ion batteri (50 Wh)",
        quantity: 280,
        unit: "g/stk",
        type: "Primært",
        origin: "Kina (CATL)",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "CATL EPD 2024",
        dqi: { reliability: 5, completeness: 4, temporal: 5, geographic: 5, technological: 5 },
        co2eqPerUnit: 22,
      },
      {
        name: "Aluminiumhus",
        quantity: 650,
        unit: "g/stk",
        type: "Primært",
        origin: "Kina (30% recycled)",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — aluminium, primary + secondary mix",
        dqi: { reliability: 4, completeness: 4, temporal: 4, geographic: 4, technological: 4 },
        co2eqPerUnit: 5.8,
      },
      {
        name: "Display (IPS 15.6″)",
        quantity: 400,
        unit: "g/stk",
        type: "Primært",
        origin: "Taiwan (AUO)",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "AUO EPD 2023",
        dqi: { reliability: 5, completeness: 4, temporal: 4, geographic: 5, technological: 5 },
        co2eqPerUnit: 28,
      },
    ],
    production: {
      processes: [
        {
          name: "SMT PCB-assembly",
          location: "Taiwan",
          energyKwh: 18,
          energySource: "TW el-mix",
        },
        {
          name: "Final assembly og test",
          location: "Kina",
          energyKwh: 4,
          energySource: "CN el-mix",
        },
      ],
      water: 0.8,
      waste: "PCB-trim, emballage-spild — 95% genanvendes internt",
      directEmissions: "Flux-dampemissioner: 0.002 kg VOC/enhed (filtreret via aktivt kul)",
    },
    distribution: [
      { from: "Kina (Shenzhen)", to: "Rotterdam", distance: 20500, method: "Sø", loadFactor: 90 },
      { from: "Rotterdam", to: "Danmark", distance: 750, method: "Lastbil", loadFactor: 85 },
    ],
    use: {
      lifetime: 5,
      energyKwhPerYear: 72,
      consumables: "Ingen (batteri antages udskiftes én gang, år 3)",
      maintenance: "OS-opdateringer; batteri-udskiftning år 3",
      userBehaviorAssumptions:
        "Aktiv brug 8 t/dag, 220 dage/år; skærmens lysstyrke sat til 200 nit (gennemsnit). Laptop antages ikke at stå i standby om natten.",
    },
    endOfLife: {
      reuse: 10,
      recycled: 70,
      energyRecovery: 5,
      landfill: 15,
      other: 0,
      designForDisassembly: true,
      recoveryRateAssumptions:
        "Baseret på EU WEEE-statistik 2023: 70% indsamlings- og genanvendelsesrate for bærbare computere i DK.",
      // takeBackProgram: mangler (missing) — under registrering
    },
  },
  lcia: {
    method: "ReCiPe 2016 (H/A) + EN 50693 scope",
    categories: ["GWP", "ODP", "AP", "EP", "POCP", "resource_depletion", "e_waste"],
    normalization: true,
    weighting: true,
    results: {
      gwp_kg_co2: 412,
      eWaste_kg: 1.85,
      resourceDepletion: "høj (sjældne jordmetaller, kobber)",
    },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: ["el-mix (DK vs EU)", "laptop-levetid (3 vs 5 vs 7 år)", "batteri-udskiftningsrate"],
      results:
        "Konklusion robust: selvom levetid reduceres til 3 år stiger GWP/år med 55%, men produktionsfasen forbliver dominerende (>60%). DK-el-mix vs EU-mix: ±8% forskel på use-phase GWP.",
    },
    hotspots: [
      { phase: "raw_material", contribution: 52, driver: "PCB + display (sjældne metaller, Pb-fri lodning)" },
      { phase: "production", contribution: 14, driver: "SMT-assembly energiforbrug Taiwan" },
      { phase: "use", contribution: 28, driver: "El-forbrug over 5-årig levetid" },
    ],
    conclusions:
      "Den samlede GWP er 412 kg CO₂-eq over 5 års levetid (82 kg/år). Produktionsfasen tegner sig for 66% inkl. råmaterialer. Forlængelse af levetid fra 5 til 7 år ville reducere GWP/år med ~25%. Take-back program er under registrering og forventes at øge genanvendelsesraten til 80%.",
    limitations:
      "WEEE take-back program er endnu ikke formelt registreret — genanvendelsestal er baseret på nationale statistikker.",
  },
  complianceScore: 93,
}

// ─── EPD_VERIFIED — byggeprodukter til EPD-udskrift ───────────────────────────
export const CONCRETE_EPD_SEED_PRODUCT = {
  name: "Precast betonelement (B30, 1 m³)",
  productType: "CONSTRUCTION" as const,
  description:
    "Standard præfabrikeret betonelement B30 til erhvervsbyggeri. EPD-verificeret cradle-to-gate (A1-A3) iht. EN 15804.",
  ambitionLevel: "EPD_VERIFIED" as const,
  status: "EPD_READY" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "Verificeret EPD (ISO 14025 + EN 15804) for 1 m³ B30 beton til DGNB-dokumentation og offentlige udbud.",
    audience: ["Bygherrer", "Rådgivende ingeniører", "EPD-operatør (EPD Danmark)"],
    comparativeAssertion: false,
    functionalUnit: {
      type: "Masserelateret",
      text: "Levere 1 m³ færdigstøbt B30 beton til byggeplads",
      quantity: 1,
      unit: "m³",
    },
    referenceFlow: "1.000 m³ B30 (ρ ≈ 2.400 kg/m³)",
    systemBoundaries: "Cradle-to-gate (A1-A3)",
    cutOffCriterion: 1,
    allocationApproach: "PHYSICAL_ALLOCATION",
    geographicScope: "Danmark (fabrik + lokale leverandører)",
    timePeriod: "2024-2025",
    limitations: "Modul B4-B5 (udskiftning) ikke medtaget.",
  },
  lci: {
    rawMaterial: [
      {
        name: "CEM I 52,5 R (cement)",
        quantity: 320,
        unit: "kg/m³",
        type: "Primært",
        origin: "Danmark (Aalborg Portland)",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "Aalborg Portland EPD 2024",
        dqi: { reliability: 5, completeness: 5, temporal: 5, geographic: 5, technological: 5 },
        co2eqPerUnit: 0.82,
      },
      {
        name: "Grus og sand (0-32 mm)",
        quantity: 1850,
        unit: "kg/m³",
        type: "Primært",
        origin: "DK (lokal grusgrav)",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — gravel, crushed",
        dqi: { reliability: 4, completeness: 4, temporal: 4, geographic: 5, technological: 4 },
        co2eqPerUnit: 0.004,
      },
    ],
    production: {
      processes: [
        { name: "Blandning og støbning", location: "Danmark", energyKwh: 12, energySource: "DK el-mix" },
      ],
      water: 180,
      waste: "Overskudsstøbning genanvendes som knust beton (95%)",
      directEmissions: "CO₂ fra hydrering: modelleret separat",
    },
    distribution: [
      { from: "Fabrik (Randers)", to: "Byggeplads (København)", distance: 220, method: "Lastbil", loadFactor: 90 },
    ],
    use: {
      lifetime: 60,
      energyKwhPerYear: 0,
      consumables: "Ingen",
      maintenance: "Ingen (statisk konstruktion)",
      userBehaviorAssumptions: "Element integreret i bærende konstruktion.",
    },
    endOfLife: {
      reuse: 0,
      recycled: 75,
      energyRecovery: 5,
      landfill: 20,
      other: 0,
      designForDisassembly: false,
      recoveryRateAssumptions: "DK beton-genanvendelse 2023: 75% knusning til ballast.",
      takeBackProgram: "Retur via byggeaffaldsordning",
    },
  },
  lcia: {
    method: "EN 15804+A2",
    categories: ["GWP", "AP", "EP", "ODP", "POCP"],
    normalization: true,
    weighting: false,
    results: { gwp_kg_co2: 298, eWaste_kg: 0, resourceDepletion: "medium (cement, ballast)" },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: ["cementtype (CEM I vs CEM III)", "transportafstand"],
      results: "CEM III ville reducere GWP med ~35%. Transport ±50 km: ±3% på total GWP.",
    },
    hotspots: [
      { phase: "raw_material", contribution: 78, driver: "Portlandcement" },
      { phase: "production", contribution: 12, driver: "Blandeenergi" },
      { phase: "distribution", contribution: 6, driver: "Lastbiltransport" },
    ],
    conclusions:
      "GWP er 298 kg CO₂-eq/m³ (A1-A3). Cement tegner sig for ~78% af klimaaftrykket. CEM III-alternativ anbefales dokumenteret i bilag.",
    limitations: "Karbonatisering i brugsfasen (modul B1) er ikke medregnet.",
  },
  complianceScore: 95,
}

export const WINDOW_EPD_SEED_PRODUCT = {
  name: "Aluminium vinduesprofil (3-lags, 1 m²)",
  productType: "CONSTRUCTION" as const,
  description:
    "Energivindue med 3-lags glas og termisk brud i aluminiumsprofil. EPD-verificeret cradle-to-grave for facadeprojekter.",
  ambitionLevel: "EPD_VERIFIED" as const,
  status: "EPD_READY" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "EPD (ISO 14025) for facadevindue til dokumentation i bygherrekrav og materialepas.",
    audience: ["Arkitekter", "Facadeentreprenører", "Bygherre"],
    comparativeAssertion: false,
    functionalUnit: {
      type: "Funktionsbaseret",
      text: "Levere 1 m² installeret energivindue med U-værdi ≤ 0.9 W/m²K i 30 år",
      quantity: 1,
      unit: "m²/30 år",
    },
    referenceFlow: "1 m² vinduesmodul inkl. glas og beslag",
    systemBoundaries: "Cradle-to-grave (A1-C4)",
    cutOffCriterion: 1,
    allocationApproach: "PHYSICAL_ALLOCATION",
    geographicScope: "Tyskland/Danmark",
    timePeriod: "2024",
    limitations:
      "Masserelateret allokering mellem aluminium og glas. Monteringsstillads og fugning på byggeplads er estimeret med standardværdi.",
  },
  lci: {
    rawMaterial: [
      {
        name: "Aluminiumsprofil (med termisk brud)",
        quantity: 8.5,
        unit: "kg/m²",
        type: "Primært",
        origin: "Tyskland (45% genanvendt)",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "Leverandør EPD 2023",
        dqi: { reliability: 5, completeness: 5, temporal: 4, geographic: 5, technological: 5 },
        co2eqPerUnit: 12.5,
      },
      {
        name: "3-lags energiglas",
        quantity: 22,
        unit: "kg/m²",
        type: "Primært",
        origin: "Belgien",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent — flat glass, coated",
        dqi: { reliability: 4, completeness: 4, temporal: 4, geographic: 4, technological: 4 },
        co2eqPerUnit: 1.1,
      },
    ],
    production: {
      processes: [
        { name: "Profilpresning og samling", location: "Tyskland", energyKwh: 6, energySource: "DE el-mix" },
      ],
      water: 0.2,
      waste: "Glas- og aluminiumsklip genanvendes (98%)",
      directEmissions: "Ingen direkte procesemissioner",
    },
    distribution: [
      { from: "Tyskland", to: "Danmark", distance: 650, method: "Lastbil", loadFactor: 85 },
    ],
    use: {
      lifetime: 30,
      energyKwhPerYear: 0,
      consumables: "Ingen",
      maintenance: "Glasrengøring 2×/år; tætningsliste udskiftes år 20",
      userBehaviorAssumptions: "Vindue i erhvervsbygning, normal drift.",
    },
    endOfLife: {
      reuse: 5,
      recycled: 80,
      energyRecovery: 5,
      landfill: 10,
      other: 0,
      designForDisassembly: true,
      recoveryRateAssumptions: "Aluminium og glas adskilles; 80% materialgenanvendelse.",
      takeBackProgram: "Leverandør take-back for aluminiumsprofiler",
    },
  },
  lcia: {
    method: "EN 15804+A2 + ReCiPe 2016",
    categories: ["GWP", "AP", "EP", "ODP", "POCP"],
    normalization: true,
    weighting: true,
    results: { gwp_kg_co2: 118, eWaste_kg: 0, resourceDepletion: "medium (Al, glas)" },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: ["genanvendt aluminiumsandel", "levetid"],
      results: "100% primær Al øger GWP med ~18%. Levetid 20 vs 30 år: ±12% på årlig GWP.",
    },
    hotspots: [
      { phase: "raw_material", contribution: 62, driver: "Aluminiumsprofil" },
      { phase: "raw_material", contribution: 24, driver: "Energiglas" },
      { phase: "distribution", contribution: 8, driver: "Transport DE→DK" },
    ],
    conclusions:
      "Samlet GWP 118 kg CO₂-eq/m² over 30 år (3,9 kg/år). Høj genanvendt aluminiumsandel er kritisk for resultatet.",
    limitations: "Monteringsenergi på byggeplads er estimeret med standardværdi.",
  },
  complianceScore: 96,
}

// ─── Eksisterende produkter ───────────────────────────────────────────────────
export const QR_SEED_PRODUCT = {
  name: "QR-system til brætspilcafé",
  productType: "SOFTWARE_HARDWARE" as const,
  description:
    "Print-baseret identifikationssystem til at spore brug af brætspil. Bruger papir/vinyl-labels på hvert brætspil scannet via brugerens smartphone.",
  ambitionLevel: "DETAILED" as const,
  status: "IN_PROGRESS" as const,
  isSeedData: true,
  goalScope: {
    purpose:
      "Beslutningsstøtte ved valg mellem QR og RFID til brætspil-tracking på Papas Papbar (850+ brætspil). Identificer hotspots og kvantificer miljø-trade-offs.",
    audience: ["Internt designteam", "Caféejer", "Censor"],
    comparativeAssertion: true,
    functionalUnit: {
      type: "Brugsbaseret",
      text: "Spor ét brætspil i ét år med ≥85% datavaliditet på brætspilcafé med 850 spil",
      quantity: 1,
      unit: "brætspil/år",
    },
    referenceFlow:
      "~850 QR-labels pr. år (label-udskiftning hver 1-2 år) + 1 admin-enhed (tablet/PC)",
    systemBoundaries:
      "Cradle-to-grave (eksklusiv brugerens smartphone som baggrunds-infrastruktur)",
    includedPhases: [
      "raw_material",
      "production",
      "distribution",
      "use",
      "end_of_life",
    ],
    cutOffCriterion: 1,
    allocationApproach: "AVOID_ALLOCATION",
    geographicScope: "Danmark",
    timePeriod: "2026-2027",
    limitations:
      "Brugerens smartphone er ikke inkluderet i systemgrænsen — kan undervurdere QR-løsningens reelle impact, hvis sammenligningen anses som påstandsfølsom. Resultaterne reflekterer 2026-2027 som teknologi-baseline; fremtidige produktionsforbedringer kan ændre konklusionerne. Baggrundsdata for tablet og labels er primært Ecoinvent 3.10-proxydata.",
  },
  lci: {
    rawMaterial: [
      {
        name: "QR-labels (papir + lim)",
        quantity: 850,
        unit: "stk/år",
        type: "Primært",
        origin: "Danmark",
        sourceType: "LITERATURE",
        sourceDetails: "Standard etiket-data fra dansk producent",
        dqi: {
          reliability: 3,
          completeness: 4,
          temporal: 5,
          geographic: 5,
          technological: 4,
        },
        co2eqPerUnit: 0.005,
      },
      {
        name: "Blæk til print",
        quantity: 0.5,
        unit: "L/år",
        type: "Primært",
        sourceType: "ASSUMPTION",
        dqi: {
          reliability: 2,
          completeness: 3,
          temporal: 3,
          geographic: 4,
          technological: 3,
        },
        isMissing: false,
        missingReason: null,
      },
      {
        name: "Tablet (admin-enhed)",
        quantity: 1,
        unit: "stk",
        type: "Primært",
        origin: "Kina",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — tablet computer",
        dqi: {
          reliability: 4,
          completeness: 4,
          temporal: 4,
          geographic: 3,
          technological: 4,
        },
        co2eqPerUnit: 87,
      },
    ],
    production: {
      processes: [
        {
          name: "Label-print (lokal)",
          location: "Danmark",
          energyKwh: 0.02,
          energySource: "DK el-mix",
        },
      ],
      water: null,
      waste: "Minimalt papir-spild fra print",
      directEmissions: null,
    },
    distribution: [
      {
        from: "Danmark (printer)",
        to: "Café (København)",
        distance: 25,
        method: "Lastbil",
        loadFactor: 70,
      },
    ],
    use: {
      lifetime: 1.5,
      energyKwhPerYear: 18,
      consumables: "Label-udskiftning hver 1-2 år",
      maintenance: "Manuel label-udskiftning ved slid",
      userBehaviorAssumptions:
        "Bruger antaget at have smartphone (>92% af danskere over 16)",
    },
    endOfLife: {
      reuse: 0,
      recycled: 30,
      energyRecovery: 65,
      landfill: 5,
      other: 0,
      designForDisassembly: false,
      recoveryRateAssumptions: "Baseret på dansk affaldsstatistik 2024",
    },
  },
  lcia: {
    method: "ReCiPe 2016 (H/A)",
    categories: ["GWP", "ODP", "AP", "EP", "resource_depletion"],
    normalization: false,
    weighting: false,
    results: {
      gwp_kg_co2: 12.4,
      eWaste_kg: 0.002,
      resourceDepletion: "lav",
    },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: ["label-levetid", "transport-distance", "el-mix"],
      results:
        "Konklusion robust ift. label-levetid ±50%; transport-distance har minimal effekt",
    },
    hotspots: [
      {
        phase: "raw_material",
        contribution: 65,
        driver: "Tablet (admin-enhed) embedded impact",
      },
      { phase: "use", contribution: 25, driver: "Tablet el-forbrug" },
      { phase: "end_of_life", contribution: 5 },
    ],
    conclusions:
      "QR-løsningen har lav embedded impact pr. funktionel enhed sammenlignet med RFID-alternativet. Hotspot-analysen identificerer tablet-hardwaren som den primære bidragsyder til klimapåvirkning (65%), efterfulgt af el-forbrug i brugsfasen (25%). Systemet er velegnet til opskalering uden proportional stigning i miljøpåvirkning.",
    limitations:
      "Real-world adoption-rate for QR-scanning er antaget 100% — lavere adoption kan ændre funktionel-enhedsfortolkningen.",
  },
  missingFields: [
    {
      field: "production.water",
      reason: "Vandforbrug ved label-print er ikke målt",
      whyImportant:
        "Vandforbrug er en ISO 14044-anbefalet impact-kategori, især relevant for produktionsprocesser med våd-behandling",
      howToFind:
        "Kontakt label-producenten og spørg om vandforbrug pr. m² print, eller brug ecoinvent's gennemsnitsdata for 'offset printing'",
      impactIfMissing: "medium",
    },
    {
      field: "production.directEmissions",
      reason: "Direkte emissioner fra print-processen er ikke målt",
      whyImportant:
        "VOC-emissioner fra blæk bidrager til photochemical ozone formation",
      howToFind:
        "Tjek blæk-leverandørens SDS (Safety Data Sheet) for VOC-indhold pr. liter",
      impactIfMissing: "low",
    },
  ],
  complianceScore: 72,
}

export const RFID_SEED_PRODUCT = {
  name: "RFID-system til brætspilcafé",
  productType: "ELECTRONICS" as const,
  description:
    "Elektronisk identifikationssystem med passive RFID-tags på hvert brætspil. Kræver dedikeret RFID-læser-hardware.",
  ambitionLevel: "DETAILED" as const,
  status: "IN_PROGRESS" as const,
  isSeedData: true,
  goalScope: {
    purpose: "Identisk med QR-løsning (sammenligning).",
    audience: ["Internt designteam", "Caféejer", "Censor"],
    comparativeAssertion: true,
    functionalUnit: {
      type: "Brugsbaseret",
      text: "Spor ét brætspil i ét år med ≥85% datavaliditet på brætspilcafé med 850 spil",
      quantity: 1,
      unit: "brætspil/år",
    },
    referenceFlow:
      "850 RFID-tags (5-10 års levetid) + 1 RFID-læser-station + infrastruktur",
    systemBoundaries: "Cradle-to-grave",
    includedPhases: [
      "raw_material",
      "production",
      "distribution",
      "use",
      "end_of_life",
    ],
    cutOffCriterion: 1,
    allocationApproach: "AVOID_ALLOCATION",
    geographicScope: "Global supply chain → Danmark",
    timePeriod: "2026-2031 (5års scope)",
    limitations:
      "Brugerens smartphone er ikke inkluderet i systemgrænsen — kan undervurdere QR-løsningens reelle impact, hvis sammenligningen anses som påstandsfølsom. PFC-emissioner fra chip-fabrikation er ikke inkluderet pga. manglende leverandørspecifikke data — kan undervurdere GWP marginalt. Fremtidige genanvendelses- og WEEE-rates for RFID-tags er usikre; antaget konservativt 15% indsamling. Resultaterne reflekterer 2026-2031 teknologi-baseline; fremtidige produktionsforbedringer kan ændre konklusionerne.",
  },
  lci: {
    rawMaterial: [
      {
        name: "Silicium chips (RFID IC)",
        quantity: 0.0001,
        unit: "kg/tag",
        type: "Primært",
        origin: "Asien (Kina/Taiwan)",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — integrated circuit, IC",
        dqi: {
          reliability: 4,
          completeness: 4,
          temporal: 4,
          geographic: 3,
          technological: 4,
        },
        co2eqPerUnit: 27,
      },
      {
        name: "Kobber-antenne",
        quantity: 0.0008,
        unit: "kg/tag",
        type: "Primært",
        origin: "Global",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — copper, primary",
        dqi: {
          reliability: 4,
          completeness: 4,
          temporal: 4,
          geographic: 3,
          technological: 4,
        },
        co2eqPerUnit: 2.8,
      },
      {
        name: "Polymer-substrat (PET)",
        quantity: 0.002,
        unit: "kg/tag",
        type: "Primært",
        sourceType: "DATABASE",
        sourceDetails: "Ecoinvent 3.10 — PET film",
        dqi: {
          reliability: 4,
          completeness: 4,
          temporal: 4,
          geographic: 4,
          technological: 4,
        },
        co2eqPerUnit: 2.1,
      },
      {
        name: "RFID-læser-hardware",
        quantity: 1,
        unit: "stk",
        type: "Primært",
        origin: "EU",
        sourceType: "SUPPLIER_DATA",
        sourceDetails: "Producent-data fra Zebra Technologies",
        dqi: {
          reliability: 5,
          completeness: 4,
          temporal: 5,
          geographic: 5,
          technological: 5,
        },
        co2eqPerUnit: 120,
      },
    ],
    production: {
      processes: [
        {
          name: "Chip-fabrication (semiconductor)",
          location: "Taiwan",
          energyKwh: 0.5,
          energySource: "TW el-mix (høj kul-andel)",
        },
        {
          name: "Tag-assembly",
          location: "Kina",
          energyKwh: 0.05,
          energySource: "CN el-mix",
        },
      ],
      water: 0.5,
      waste: "Silicium-spild fra wafer-cutting (≈20% af råmaterial)",
      directEmissions: null,
    },
    distribution: [
      {
        from: "Taiwan",
        to: "Tyskland",
        distance: 9500,
        method: "Sø",
        loadFactor: 80,
      },
      {
        from: "Tyskland",
        to: "Danmark",
        distance: 850,
        method: "Lastbil",
        loadFactor: 70,
      },
    ],
    use: {
      lifetime: 7.5,
      energyKwhPerYear: 87,
      consumables: "Ingen (passive tags)",
      maintenance: "Læser-hardware: årlig kalibrering",
      userBehaviorAssumptions:
        "Tags antaget at fungere stabilt over levetid; tab/skift estimeret til 5%/år",
    },
    endOfLife: {
      reuse: 0,
      recycled: 15,
      energyRecovery: 10,
      landfill: 75,
      other: 0,
      designForDisassembly: false,
      recoveryRateAssumptions:
        "Konservativ: tags antages at følge brætspil til skraldespand pga manglende take-back",
    },
  },
  lcia: {
    method: "ReCiPe 2016 (H/A)",
    categories: ["GWP", "ODP", "AP", "EP", "resource_depletion", "e_waste"],
    normalization: false,
    weighting: false,
    results: {
      gwp_kg_co2: 524,
      eWaste_kg: 1.7,
      resourceDepletion: "høj (silicium, kobber)",
    },
  },
  interpretation: {
    sensitivityAnalysis: {
      parameters: ["tag-levetid", "læser-hardware-impact", "transport-distance"],
      results:
        "Konklusion robust selv ved tag-levetid 15 år (best case); transport bidrager <10%",
    },
    hotspots: [
      {
        phase: "raw_material",
        contribution: 55,
        driver: "Silicium chip-fabrikation + læser-hardware",
      },
      {
        phase: "production",
        contribution: 22,
        driver: "Energi-intensiv chip-fab i Taiwan",
      },
      {
        phase: "distribution",
        contribution: 5,
        driver: "Leverandørtransport til café",
      },
      {
        phase: "end_of_life",
        contribution: 18,
        driver: "Spredt e-waste i 850+ enheder",
      },
    ],
    conclusions:
      "RFID-løsningen har væsentligt højere embedded impact pr. funktionel enhed end QR-alternativet, primært drevet af silicium-chip-fabrikation og spredt e-waste. GWP er 42× højere (524 vs 12,4 kg CO₂-eq pr. FU). Energi-intensiv semiconductor-produktion i Taiwan udgør den primære hotspot.",
    limitations:
      "Take-back-program for RFID-tags er ikke etableret; slutafhandling er baseret på nationale WEEE-gennemsnit.",
  },
  missingFields: [
    {
      field: "production.directEmissions",
      reason: "Direkte emissioner fra chip-fab er ikke specificeret",
      whyImportant:
        "Semiconductor-produktion bruger PFC-gasser (perfluorocarbons) med ekstremt høj GWP. Disse kan være betydningsfulde selv i små mængder",
      howToFind:
        "Spørg tag-producenten om PFC-emissioner pr. wafer, eller brug branchegennemsnit fra SEMI/Intel-rapporter",
      impactIfMissing: "high",
    },
    {
      field: "endOfLife.takeBackProgram",
      reason: "Ingen take-back-program defineret",
      whyImportant:
        "Take-back kunne forbedre recovery-rate fra 15% til 60%+, hvilket markant reducerer total impact",
      howToFind:
        "Kontakt RFID-leverandør ang. eksisterende take-back, eller dansk WEEE-system",
      impactIfMissing: "high",
    },
    {
      field: "rawMaterial.recycledContent",
      reason: "Genanvendt indhold i kobber-antenne er ikke specificeret",
      whyImportant:
        "Sekundært kobber har 90% lavere impact end primært — betydningsfuld for samlet GWP",
      howToFind:
        "Spørg tag-producenten om source af kobber (primært vs recycled)",
      impactIfMissing: "medium",
    },
  ],
  complianceScore: 58,
}
