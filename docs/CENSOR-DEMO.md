# LCA Compass — guide til censordemo

Kort teknisk og faglig guide til at vise prototypen og forsvare valg.

## Start

```bash
cd lca-compass
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

Åbn http://localhost:3000 — login: **demo@lca-compass.dk** (demo-credentials i `lib/auth.ts`).

---

## Anbefalede demo-produkter

| Produkt | Formål | Compliance |
|---------|--------|------------|
| **RFID-system til brætspilcafé** | ISO 14044 Full + Carbon Footprint (PCF) | ~87 % |
| **Aluminium vinduesprofil (3-lags)** | EPD (EPD verified) | ~96 % |
| **Bærbar computer (15 tommer business)** | EPD + scenarier (≥2 → komparativ export) | ~93 % |
| **QR-system til brætspilcafé** | Sammenligning med RFID (lav GWP) | — |

---

## Eksport og verifikation

1. Produkt → **Export** → vælg format → **Generate PDF** → **Print / Save as PDF**
2. **Stempel-ID** på forsiden og i footer — genbruges ved opdatering; ny version giver nyt ID (afkryds “ny dokumentversion”)
3. Offentlig verifikation: `/{locale}/verify/{documentId}` eller landingsside

### Rapporttyper (forskellige skabeloner)

| Format | Standard | Indhold |
|--------|----------|---------|
| ISO 14044 Full | ISO 14040/14044 | 5 kapitler + bilag (LCI, DQI pedigree, transport, sensitivitet) |
| EPD | ISO 14025 + EN 15804 | Moduler A1–C, PCR, deklareret enhed, DQI |
| Carbon Footprint | ISO 14067 | Kun GWP + fasefordeling (kg summer = total) |

**Bemærk:** Komparativ påstand kræver ≥2 scenarier men har endnu ikke egen PDF-skabelon.

---

## Styrker at fremhæve over for censor

- Guidet **10-trins wizard** med ISO 14044-tjekliste (15 punkter) og live compliance-score
- **Tre adskilte rapportlayouts** (ikke kun forsidedifference)
- **DQI pedigree-matrix** i bilag (R/C/T/G/Te)
- **Dokument-ID** og offentlig verifikation
- **Scenarier** med GWP-beregning (sensitivity)
- **Sammenlign produkter** (fx QR vs RFID)
- **Guide** med links til officielle ISO/CEN-standarder

---

## Kendte begrænsninger (ærligt at nævne)

| Emne | Status |
|------|--------|
| Prototype, ikke certificeret EPD-operatør | Demo-data og skabeloner |
| PDF = HTML + browser-print | Ingen separat PDF-motor |
| Produktmedlemmer / invite-mail | UI-demo, ingen reel mail eller API-adgangskontrol |
| `/reports` i menu | Side mangler endnu |
| CSRD bilag / komparativ PDF | Enum findes; skabelon ikke bygget |
| AI-tekst | Handlebars-skabeloner (valgfri Gemini via `AI_PROVIDER`) |

---

## Faglige svar hvis censor spørger

**“Alle LCA’er har begrænsninger”**  
→ Ja. Prosa trækker nu `limitations` fra produktdata; RFID har fx usikker genanvendelsesrate for tags. Undgå at påstå “ingen begrænsninger”.

**“Økonomisk allokering på EPD”**  
→ Vinduesproduktet bruger **masseallokering (PHYSICAL_ALLOCATION)** mellem aluminium og glas, dokumenteret i scope.

**“Summerer PCF-faser til total GWP?”**  
→ Ja: hotspot-andele normaliseres til 100 % (uden skjulte standard-faser); fase-kg summerer til total (test: `lib/lca/report-templates/allocate-gwp.test.ts`).

**“11 vs 15 compliance-krav?”**  
→ Overalt **15 elementer** i UI og score; hvert punkt har eget dansk label (fx direkte emissioner, take-back).

**“Hvad er forskellen på ISO 14044 og ISO 14067?”**  
→ 14044 = fuld LCA med alle faser og fortolkning; 14067 = deklareret **partial footprint**, her kun GWP med eksplicit afgrænsning i rapporten.

---

## Teknisk stack

Next.js 16, React, Prisma, SQLite, next-intl (da/en), NextAuth (demo).

---

*Sidst opdateret i forbindelse med rettelser af PCF-fordeling, bilag A, limitations-tekst og EPD-allokering.*
