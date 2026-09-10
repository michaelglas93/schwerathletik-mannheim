# schwerathletik-mannheim.de

Website der Schwerathletik Mannheim 2018 e.V. — Next.js 16 (App Router), React 19,
Tailwind 4, Sanity als Redaktionssystem, gehostet bei Vercel.

Dieses README richtet sich an alle, die hier mitarbeiten. Wenn du noch nie mit Next.js
oder Sanity gearbeitet hast: Kein Problem, der Abschnitt [Mitmachen](#mitmachen) erklärt
den Weg von der Idee bis zur veröffentlichten Änderung — auch mit KI-Unterstützung.

---

## Schnellstart

```bash
git clone https://github.com/michaelglas93/schwerathletik-mannheim.git
cd schwerathletik-mannheim
npm install
npm run dev          # http://localhost:3000
```

Die Seite läuft sofort, **auch ohne Zugangsdaten**. Ohne Sanity-Konfiguration nimmt sie
die Inhalte aus `content/seed.json`. Zum Entwickeln am Layout reicht das völlig.

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | Produktionsbuild — prüft auch die Typen |
| `npm run typecheck` | nur Typprüfung, schneller |
| `npm run migrate` | überträgt `content/seed.json` nach Sanity (`-- --dry` für einen Probelauf) |

---

## Wie die Inhalte fließen

Das ist der wichtigste Teil zum Verstehen. Es gibt **zwei Quellen** für denselben Inhalt:

```
                  ┌─────────────────────────┐
                  │  Sanity (cv3v2b6d)      │   ← Redaktion pflegt hier
                  │  Dataset: production    │
                  └───────────┬─────────────┘
                              │  wenn erreichbar
                              ▼
  content/seed.json ──▶ src/lib/content.ts ──▶ Seiten in src/app/(site)/
     (Fallback)              │
                             └─ getSettings, getPosts, getPost, getPeople,
                                getGallery, getDocuments
```

**Alle Seiten sprechen ausschließlich mit `src/lib/content.ts`.** Das Modul entscheidet:
Ist `NEXT_PUBLIC_SANITY_PROJECT_ID` gesetzt und Sanity antwortet, kommen die Daten von
dort. Sonst — oder bei einem Netzwerkfehler — fällt es auf `content/seed.json` zurück.

Beide Quellen liefern dieselben Typen aus `src/lib/types.ts`. Eine Seite muss also nie
wissen, woher ihre Daten kommen. Wenn du eine neue Seite baust, rufst du eine der
`get…`-Funktionen auf und fertig.

`content/seed.json` ist im Repo eingecheckt und damit auch das Sicherheitsnetz: Selbst
wenn Sanity ausfällt, bleibt die Website online.

---

## Was ist Sanity?

Sanity ist ein **Headless CMS** — eine Datenbank mit Redaktionsoberfläche, aber ohne
eigenes Frontend. Der Verein pflegt dort Texte und Bilder, die Website holt sie ab und
stellt sie dar. Der Vorteil gegenüber WordPress: Das Design liegt komplett in diesem
Repo und lässt sich nicht versehentlich aus dem Backend zerschießen.

**Das Backend läuft unter [`/studio`](https://schwerathletik-mannheim.vercel.app/studio)**
— derselbe Server, keine zweite Anwendung. Wer dort einen Sanity-Zugang hat, kann
Beiträge schreiben, Personen pflegen und die Vereinsdaten ändern.

Was in Sanity liegt, definieren die Schemata in `src/sanity/`:

| Datei | Inhalt |
|---|---|
| `schemas/siteSettings.ts` | Vereinsdaten: Anschrift, Register, Vorstand, E-Mails, Beiträge, Partner |
| `schemas/post.ts` | Neuigkeiten mit Fließtext, Bildern und Ergebnistabellen |
| `schemas/person.ts` | Vorstand, Abteilungsleitung, Coaches |
| `schemas/simple.ts` | Galeriebilder, Vereinsdokumente |
| `schemas/blocks.ts` | Bausteine für den Fließtext: Bild, Ergebnistabelle, Link |
| `structure.ts` | Reihenfolge und Gruppierung im Studio-Menü |
| `queries.ts` | GROQ-Abfragen — Sanitys Abfragesprache, ähnlich wie SQL für JSON |

**Wichtig:** Schema und Abfrage müssen zusammenpassen. Wenn du ein Feld hinzufügst,
brauchst du es an drei Stellen: im Schema (`src/sanity/schemas/`), in der Abfrage
(`src/sanity/queries.ts`) und im Typ (`src/lib/types.ts`). Vergisst du eins, meckert
`npm run typecheck`.

---

## Aufbau des Repos

```
src/
  app/
    (site)/          Die öffentlichen Seiten. Der Ordner in Klammern ist eine
                     Route Group: Er taucht in der URL nicht auf, gruppiert aber
                     alle Seiten unter einem gemeinsamen Layout (Header, Footer).
      page.tsx           →  /
      news/page.tsx      →  /news
      news/[slug]/       →  /news/q1-2025  (eine Seite pro Beitrag)
      verein, team, trainingsstaette, mitglied-werden, kontakt,
      impressum, datenschutz
    studio/          Das Sanity-Backend unter /studio
    layout.tsx       Wurzel-Layout: Schriften, Metadaten
    globals.css      Tailwind-Setup und Design-Tokens
    robots.ts        erzeugt /robots.txt
    sitemap.ts       erzeugt /sitemap.xml
    icon.png, apple-icon.png, opengraph-image.jpg, twitter-image.jpg
                     Next.js erkennt diese Dateinamen automatisch und baut daraus
                     Favicon und Social-Vorschaubilder.
  components/        Wiederverwendbare Bausteine. ui.tsx enthält die Grundelemente
                     (Button, Section, SectionHeading, PageHeader, Stat).
  lib/               content.ts (Datenzugriff), types.ts, fonts.ts, format.ts, image.ts
  sanity/            Schemata, Abfragen, Client
  fonts/             Oswald und Inter als Variable Font, selbst gehostet

content/seed.json    Fallback-Inhalte, siehe oben
public/              Bilder, die nicht in Sanity liegen (Galerie, Logos, Hero)
scripts/
  migrate.ts         schiebt seed.json nach Sanity — für ein frisches Dataset
  make-icons.py      erzeugt die Icons aus dem Logo neu
```

### Konventionen

- **Deutsch.** Code-Kommentare, Commit-Nachrichten und Texte sind auf Deutsch.
  Variablen- und Funktionsnamen bleiben englisch, wie in JavaScript üblich.
- **Server-Komponenten als Standard.** Nur `Gallery.tsx` und `Header.tsx` tragen
  `"use client"`, weil sie Klicks brauchen. Alles andere wird auf dem Server gerendert
  und schickt kein JavaScript an den Browser.
- **Kommentare erklären das Warum**, nicht das Was. Ein Kommentar, der beschreibt, was
  die Zeile ohnehin sagt, ist Rauschen.

---

## Diese Seite ist bewusst cookiefrei

Das ist kein Zufall, sondern eine **Vorgabe, die erhalten bleiben muss**. Die Website
setzt keine Cookies, bindet keine Tracker ein und lädt nichts von fremden Servern. Genau
deshalb braucht sie kein Einwilligungsbanner — und genau das sagt auch die
[Datenschutzerklärung](https://schwerathletik-mannheim.vercel.app/datenschutz) zu.

Sobald etwas davon kippt, wird die Datenschutzerklärung falsch, und eine falsche
Datenschutzerklärung ist abmahnfähig. Bevor du eines der folgenden Dinge einbaust,
sprich es ab:

- Schriften von Google Fonts statt aus `src/fonts/`
- eingebettete Karten, YouTube-Videos oder Instagram-Feeds (Links sind in Ordnung)
- Vercel Web Analytics, Speed Insights oder ein anderes Statistik-Werkzeug
- ein Kontaktformular mit Spam-Schutz wie reCAPTCHA
- **alles, was `localStorage`, `sessionStorage` oder Cookies benutzt** — auch ein
  harmloser Dark-Mode-Schalter, der sich die Auswahl merkt

Die Regel dahinter ist § 25 TDDDG: Er gilt für *jede* Speicherung auf dem Endgerät, nicht
nur für Cookies.

---

## Wie deployt wird

Das Repo hängt an Vercel. Du musst nichts von Hand ausliefern:

| Was du tust | Was passiert |
|---|---|
| Branch pushen, Pull Request öffnen | Vercel baut eine **Preview** unter einer eigenen URL |
| Pull Request nach `main` mergen | Vercel baut und veröffentlicht die **Produktion** |

Die Preview-URL steht im Pull Request. Dort siehst du deine Änderung, bevor sie live
geht.

**Previews sind nicht öffentlich.** Sie liegen hinter Vercels Anmeldung — wer keinen
Zugang zum Vercel-Projekt hat, landet auf einer Login-Seite. Zum Herzeigen taugt die URL
also nicht; nimm einen Screenshot oder lass dir kurz jemanden über die Schulter schauen.
(Teilbare Links ohne Anmeldung gäbe es erst im Pro-Plan.)

**`main` ist geschützt.** Direkt dorthin pushen geht nicht. Jede Änderung braucht einen
Pull Request und eine Freigabe.

Redaktionelle Änderungen in Sanity brauchen **kein** Deployment — die Seiten holen sich
die Inhalte selbst und aktualisieren sich innerhalb einer Minute.

---

## Mitmachen

### Der normale Weg

```bash
git checkout main && git pull
git checkout -b kurzer-name-der-aenderung

# ... arbeiten ...

npm run typecheck        # geht das durch?
npm run build            # baut es wirklich?

git add -A
git commit               # Nachricht auf Deutsch, erklärt das Warum
git push -u origin kurzer-name-der-aenderung
```

Danach auf GitHub einen Pull Request öffnen. Beschreibe, **was** du geändert hast und
**warum** — nicht wie, das steht im Diff. Wenn du am Aussehen etwas geändert hast, häng
einen Screenshot oder die Preview-URL an.

### Bevor du einen PR aufmachst

- [ ] `npm run build` läuft fehlerfrei durch
- [ ] Die Seite sieht auch auf dem Handy gut aus
- [ ] Keine neuen Verbindungen zu fremden Servern (siehe oben)
- [ ] Keine Bilder in `public/`, an denen die Rechte ungeklärt sind
- [ ] Personenfotos nur mit Einwilligung der Abgebildeten

### Mit Claude, ChatGPT oder Copilot arbeiten

KI-Werkzeuge sind hier ausdrücklich willkommen — dieses Repo wurde großteils damit
gebaut. Zwei Dinge machen den Unterschied zwischen brauchbarem und unbrauchbarem
Ergebnis:

**1. Gib dem Modell Kontext.** Ein Modell, das das Projekt nicht kennt, rät. Der
schnellste Weg ist, ihm dieses README zu geben, dazu die Dateien, um die es geht.

Bei **Claude Code**, **Cursor** oder **Codex** genügt es, das Repo zu öffnen — die
Werkzeuge lesen `AGENTS.md` und dieses README von selbst. Bei ChatGPT oder Claude im
Browser: README hineinkopieren, dann die betroffene Datei.

**2. Beschreibe das Ziel, nicht die Lösung.** Schlecht: „Füg ein useState in die
Header-Komponente ein." Besser: „Auf dem Handy soll das Menü nach dem Tippen auf einen
Link zugehen." Das Modell kennt den Code, du kennst das Problem.

Ein Prompt, der hier gut funktioniert:

> Ich arbeite am Repo schwerathletik-mannheim, einer Vereinswebsite mit Next.js 16
> (App Router), Tailwind 4 und Sanity als CMS. Alle Seiten holen ihre Daten über
> `src/lib/content.ts`, das entweder Sanity oder `content/seed.json` liest.
>
> Ich möchte: **[dein Ziel in einem Satz]**
>
> Wichtig: Die Seite muss cookiefrei bleiben — keine externen Skripte, keine Schriften
> von Google, kein localStorage. Server-Komponenten sind der Standard, `"use client"`
> nur wenn wirklich Interaktion nötig ist. Kommentare und Commit-Nachrichten auf Deutsch.
>
> Schlag mir zuerst vor, welche Dateien du anfassen würdest, bevor du Code schreibst.

Der letzte Satz ist der nützlichste. Er zwingt das Modell, seinen Plan offenzulegen, und
dir fällt ein Missverständnis auf, bevor 300 Zeilen Code entstanden sind.

**3. Prüfe das Ergebnis.** Modelle erfinden gelegentlich APIs, die es nicht gibt, oder
greifen zu einer Bibliothek, wo drei Zeilen gereicht hätten. `npm run build` ist die
erste Instanz. Die zweite bist du: Lies den Diff, bevor du ihn committest. Wenn du nicht
erklären kannst, was eine Zeile tut, gehört sie nicht in den PR.

### Kein Entwickler, aber eine Idee?

Mach ein [Issue](https://github.com/michaelglas93/schwerathletik-mannheim/issues) auf und
beschreibe in normalen Worten, was dir fehlt oder was stört. Ein Screenshot mit einem
Pfeil darauf hilft mehr als jede technische Beschreibung. Für reine Text- und
Bildänderungen brauchst du gar kein GitHub — das läuft über `/studio`.

---

## Konfiguration

`.env.local` anlegen (Vorlage: `.env.example`):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=…    # öffentlich, kein Geheimnis
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=…           # nur für npm run migrate
```

Ohne diese Werte läuft die Seite aus `content/seed.json` — für die meiste Arbeit reicht
das. Zugang zum Sanity-Projekt gibt es beim Vorstand.

Das **Write-Token ist ein echtes Geheimnis.** Es gehört nur in `.env.local`, und die
Datei ist von `.gitignore` erfasst. In Vercel sind nur die beiden `NEXT_PUBLIC_`-Werte
hinterlegt; das Token braucht der Server nicht, weil die Website nur liest.

---

## Lizenz

Kein Open Source. Der Inhalt dieses Repos gehört dem Verein, die Fotos zeigen seine
Mitglieder — Einzelheiten in [LICENSE](LICENSE). Die Schriften unter `src/fonts/` stehen
unter der SIL Open Font License, siehe [`src/fonts/OFL.txt`](src/fonts/OFL.txt).
