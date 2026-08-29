# Schwerathletik Mannheim 2018 e.V. — Site Brief (scraped 2026-08-29)

Quelle: https://schwerathletik-mannheim.de/ (WordPress, Theme "Whistle", WPBakery/js_composer,
LayerSlider, Slider Revolution, The Events Calendar, Real Cookie Banner).
Der Alt-Auftritt liegt hinter HTTP-Basic-Auth. **Hinweis: die WP-Installation hatte eine Backdoor —
aus dem Scrape wurden nur Bilder + 1 PDF übernommen, keine PHP/JS-Dateien. Alle Dateien wurden auf
`<?php` / `eval(` / `base64_decode` / `<script` geprüft: sauber.**

## Marke
- Bildmarke: stilisiertes "K" aus Hantelscheiben-Schrägen. Charcoal + Orange.
- Farben (aus Logo extrahiert): Anthrazit `#282727`, Orange `#D1430C` (Wordmark-Variante `#D14416`).
- Alt-Fonts: Crete Round (400/400i, Headlines), Lato (Body).
- Logos: `public/img/brand/logo-bildmarke.png` (2362×1890, farbig),
  `logo-bildmarke-white.png` (142×83, weiß, für dunklen Header),
  `logo-wordmark.png` (230×89, Header-Logo der alten Seite).

## Seitenstruktur (alt)
- **Home** – Hero (dunkles Hantel-Bild) + "Über Uns"
- **Neuigkeiten** – Jahres-Unterseiten: 2025, 2024, 2023, 2022, 2018–2021 (27 Beiträge gesamt)
- **Trainingsstätte** – Foto-Galerie (65 Bilder)
- **FAQ** – 7 Akkordeon-Fragen
- **Verein** (`/dokumente/`)
  - Mitglied werden
  - Vereinssatzung- und ordnungen (6 Google-Drive-PDFs)
- **Kontakt**
  - Coaches im Verein (4 Coaches)
  - Ämter im Verein (Vorstand, Abteilungen, Schlichtung)
  - Impressum
  - Datenschutzerklärung (Real-Cookie-Banner-Generat, ~40k Zeichen)

## Kerntexte

### Über Uns / Verein
> Wir sind ein Schwerathletikverein in Mannheim, der sich für die Förderung, Pflege und Verbreitung
> des Kraftsports einsetzt. Wir üben Kraftdreikampf, Gewichtheben und Freizeitsport aus und nehmen an
> sportlichen Wettkämpfen teil. Auch die Suche und Förderung von Talenten sind Teil des Vereins.
> Wir legen großen Wert auf ein gutes Miteinander und gegenseitige Unterstützung.

Gegründet 2018, seit 2021 eigene Trainingsstätte beim SKV Sandhofen; dort werden auch Wettkämpfe
ausgerichtet.

### Trainingsstätte
Halle des SKV Sandhofen, Kalthorststraße 44, 68307 Mannheim.
Zugang für Mitglieder per App. Probetraining nur nach vorheriger Vereinbarung.

### Beiträge
- Mitgliedschaft: 15 €/Monat (Erwachsene), 10 €/Monat (ermäßigt)
- Trainingsstätte: 16 €/Monat; +5 € für den angrenzenden SKV-Fitnessbereich

### Mitglied werden
Probetraining per Mail vereinbaren (kdk@ oder gewichtheben@).
Aufnahmeantrag online: https://docuseal.eu/d/EzNCx6JoBgyFbo
Zusätzlich Mitgliedschaft im SKV Sandhofen e.V. nötig (Abteilungen "Schwerathletik" + "SKVfit").

### Verbände
BWG (bw-gewichtheben.de) und BVDK (bvdk.de) — Wettkampfstart über den Verein möglich.
Partnerverein: SKV Sandhofen (skv-sandhofen.de).

## Kontakt
- Schwerathletik Mannheim 2018 e.V., c/o Roy Lotzwik, Maxburgstraße 4, 68219 Mannheim
- Vereinsregister VR 702410, Amtsgericht Mannheim
- vorstand@schwerathletik-mannheim.de · kdk@… · gewichtheben@… · schlichtung@…
- Instagram: https://www.instagram.com/schwerathletikmannheim
- Facebook: https://www.facebook.com/profile.php?id=100046941896475

## Personen
**Vorstand:** Roy Lotzwik (1. Vorstand), Sven Mitländer (2. Vorstand),
Benedikt Rhomberg-Kauert (1. Kassierer), Julia Renkel (2. Kassiererin)
**Abteilung Gewichtheben:** Stanislaus Schwabauer
**Abteilung Kraftdreikampf:** Veronika Schulze, Simon Oswald
**Schlichtung:** Keven Reinfrank
**Coaches:** Janosch Janson (KDK, Bodybuilding) · Keven Reinfrank (KDK, Bodybuilding) ·
Simon Oswald (KDK, allg. Krafttraining) · Stani Schwabauer (Gewichtheben, KDK, allg. Krafttraining)
— Steckbriefe liegen als Google-Drive-PDFs vor (Links in `scrape/content/page-coaches-im-verein.md`).

## Externe Dokumente (Google Drive, in `scrape/content/page-vereinssatzung-und-ordnungen.md`)
Vereinssatzung · Aufnahmeantrag · Partizipationsordnung · Finanzordnung · Anti-Doping-Ordnung · Wahlordnung
