# LCA Compass

Webbaseret prototype til livscyklusvurdering (LCA): guidet dataindsamling, ISO 14044-compliance, eksport af ISO 14044 / EPD / kulstofaftryk (GWP) med verificerbart dokument-ID.

## Hurtig start

```bash
npm install
npm run db:setup
npm run dev
```

**Vigtigt:** Efter kodeændringer skal dev-serveren genstartes (`Ctrl+C`, derefter `npm run dev` igen). Kører du på gammel proces, mangler PDF-fixes og Prisma-opdateringer.

Hvis export/PDF fejler: `npm run db:setup` og genstart `npm run dev`.

Åbn http://localhost:3000 — demo-bruger: **demo@lca-compass.dk** (se `lib/auth.ts`).

## Censordemo

Se **[docs/CENSOR-DEMO.md](docs/CENSOR-DEMO.md)** for anbefalede produkter, rapporttyper, styrker, begrænsninger og svar til typiske censorspørgsmål.

## Rapportformater

| Format | Fil-prefix |
|--------|------------|
| ISO 14044 Full | `LCA-` |
| EPD (ISO 14025) | `EPD-` |
| Carbon Footprint (ISO 14067) | `PCF-` |

Skabeloner: `lib/lca/report-templates/`

## Publicér prototypen (GitHub + Render)

Se **[docs/DEPLOY.md](docs/DEPLOY.md)** for trin-for-trin: push til GitHub, deploy via `render.yaml`, og del den offentlige URL.
