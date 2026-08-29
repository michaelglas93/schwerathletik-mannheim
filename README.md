# schwerathletik-mannheim.de

Neubau des Auftritts der Schwerathletik Mannheim 2018 e.V. — Next.js 16 (App Router),
Tailwind 4, Sanity als Redaktions-Backend.

## Loslegen

```bash
npm install
npm run dev      # http://localhost:3000
```

Die Seite läuft sofort, auch ohne Sanity: Inhalte kommen dann aus `content/seed.json`.

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktionsbuild, prüft auch die Typen |
| `npm run typecheck` | nur Typprüfung |
| `npm run extract` | erzeugt `content/seed.json` neu aus `scrape/` |
| `npm run migrate` | überträgt den Seed nach Sanity (`-- --dry` für einen Probelauf) |

## Woher die Inhalte kommen

Alle Seiten sprechen ausschließlich mit `src/lib/content.ts`. Das Modul liest aus Sanity,
sobald `NEXT_PUBLIC_SANITY_PROJECT_ID` gesetzt ist, und fällt sonst — oder bei einem
Netzwerkfehler — auf `content/seed.json` zurück. Beide Quellen liefern dieselben Typen aus
`src/lib/types.ts`, die Seiten müssen also nicht unterscheiden.

`content/seed.json` entsteht aus dem WordPress-Scrape in `scrape/` über
`scripts/extract.py`: 27 Beiträge inklusive Ergebnistabellen, 12 Personen, 7 FAQ-Einträge,
65 Galeriebilder, 6 Dokumente und die Vereinsdaten.

## Sanity einrichten

```bash
npx sanity@latest login
npx sanity@latest init --project-plan free
```

Danach `.env.local` anlegen (Vorlage: `.env.example`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=…
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=…
```

Das Write-Token braucht die Rolle *Editor* und entsteht im Sanity-Dashboard unter
**API → Tokens**. Es wird nur für die Migration gebraucht, nicht zur Laufzeit.

```bash
npm run migrate -- --dry   # zeigt, was übertragen würde
npm run migrate            # überträgt Inhalte und Bilder
```

Der Lauf ist wiederholbar: Dokumente haben feste IDs, bereits hochgeladene Bilder stehen in
`scripts/.asset-map.json` und werden wiederverwendet.

Das Studio liegt danach unter `/studio` — dieselbe Domain, kein zweiter Deploy.

## Datenschutz by design

Die Seite setzt keine Cookies und lädt nichts von fremden Servern:

- Schriften (Oswald, Inter) liegen als `.woff2` in `src/fonts/` und werden über
  `next/font/local` eingebunden — bewusst nicht `next/font/google`.
- Sanity-Bilder laufen über `next/image` und werden dadurch von der eigenen Domain
  ausgeliefert, nicht von `cdn.sanity.io`.
- Keine Analyse, kein Tracking, keine Karteneinbindung, kein Cookie-Banner.

Wer hier etwas einbaut, das nach außen lädt, muss `src/app/(site)/datenschutz/page.tsx`
anpassen — und braucht dann womöglich doch eine Einwilligung.

## Struktur

```
src/
  app/
    (site)/        öffentliche Seiten mit Kopf- und Fußzeile
    studio/        Sanity Studio
  components/      Bausteine der Oberfläche
  lib/             Inhalte, Typen, Bilder, Formatierung
  sanity/          Client, Queries, Schemas, Studio-Menü
  fonts/           lokal gehostete Schriften
content/seed.json  Inhalte, solange kein Sanity-Projekt verbunden ist
scrape/            Rohdaten des alten WordPress-Auftritts
scripts/           extract.py · migrate.ts · make-icons.py
```

## Zum alten Auftritt

Die WordPress-Installation hatte sich über eine Backdoor Malware eingefangen. Aus dem
Scrape wurden ausschließlich Bilder und ein PDF übernommen, kein ausführbarer Code; alle
Dateien wurden per Magic-Bytes geprüft und auf `<?php`, `eval(`, `base64_decode` und
`<script` durchsucht. Die alten Adressen leiten über `next.config.ts` auf die neuen weiter.
