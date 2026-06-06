# Deploy: GitHub + Render

Denne guide publicerer LCA Compass-prototypen, så alle kan åbne den i browseren.

## 1. Push til GitHub

Fra mappen `lca-compass`:

```bash
git init
git add .
git commit -m "Initial commit — LCA Compass prototype"
```

Opret et **tomt** repository på GitHub (fx `lca-compass`), uden README/license.

```bash
git branch -M main
git remote add origin https://github.com/DIT-BRUGERNAVN/lca-compass.git
git push -u origin main
```

Erstat `DIT-BRUGERNAVN` med dit GitHub-brugernavn.

## 2. Deploy på Render (Blueprint)

1. Gå til [Render Blueprint](https://dashboard.render.com/blueprint/new) med dit repo:
   ```
   https://dashboard.render.com/blueprint/new?repo=https://github.com/DIT-BRUGERNAVN/lca-compass
   ```
2. Godkend GitHub-forbindelse, hvis du bliver bedt om det.
3. Gennemgå `render.yaml` — én **Web Service** (`lca-compass`, free plan, Frankfurt).
4. Klik **Apply** og vent på første deploy (typisk 5–10 min).

Render sætter automatisk `NEXTAUTH_SECRET`. `NEXTAUTH_URL` hentes fra service-host.

## 3. Test prototypen

Når deploy er **Live**, åbn URL'en (fx `https://lca-compass.onrender.com`).

- Log ind med vilkårlig e-mail — demo-bruger oprettes automatisk.
- Eller brug **demo@lca-compass.dk** (seed-data efter hver deploy).

## Vigtigt om demo-data (free plan)

På Render **free** plan er filsystemet **midlertidigt**. Ved hver deploy kører `start:render`:

1. `prisma migrate deploy`
2. `prisma/seed.ts` (demo-produkter genoprettes)
3. `next start`

Brugeroprettede produkter overlever **ikke** redeploys på free tier. Til varig data: opgrader til **Starter** og tilføj persistent disk i `render.yaml` (se kommentar i filen).

## Miljøvariabler

| Variabel | Beskrivelse |
|----------|-------------|
| `DATABASE_URL` | SQLite-sti (`file:./prisma/data/lca.db` på Render) |
| `NEXTAUTH_SECRET` | Session-hemmelighed (auto-genereret på Render) |
| `NEXTAUTH_URL` | App-URL (auto fra Render) |
| `AI_PROVIDER` | `template` (ingen API-nøgle nødvendig til demo) |
| `GEMINI_API_KEY` | Valgfri — kun hvis `AI_PROVIDER=gemini` |

## Opdateringer

Push til `main` på GitHub → Render deployer automatisk.

```bash
git add .
git commit -m "Beskriv ændringen"
git push
```
