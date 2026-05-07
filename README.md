# Hantavirus Andes Live Map

Applicazione React + Vite per visualizzare casi confermati di Hantavirus Andes su mappa OpenStreetMap, con dettagli solo nel pannello laterale (nessun popup).

## Requisiti

- Node.js 20+
- npm 10+

## Sviluppo locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Origine dati

I dati sono in `public/data/cases.json`.

- Nessuna fonte non ufficiale viene inclusa.
- La validazione dei casi è limitata a fonti ufficiali monitorate (ministeri salute, OMS/PAHO, bollettini istituzionali).

## Deploy GitHub Pages

Il workflow `.github/workflows/deploy.yml` effettua build e deploy su GitHub Pages ad ogni push su `main`.

## Aggiornamento automatico orario

Il workflow `.github/workflows/update-data.yml` viene eseguito ogni ora e aggiorna il timestamp in `cases.json`, con commit automatico quando ci sono variazioni.
