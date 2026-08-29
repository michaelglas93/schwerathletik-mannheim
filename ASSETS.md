# Asset-Inventar (`public/`)

| Ordner | Anzahl | Inhalt |
|---|---|---|
| `img/brand/` | 3 | Logo Bildmarke (farbig 2362×1890, weiß 142×83), Wordmark 230×89 |
| `img/hero/` | 3 | `home-hero-dark.jpg` 2320×687 (Hero der alten Startseite), `home_websoze.jpg` (helle Variante), `unbenannt-1.jpg` |
| `img/people/` | 12 | Vorstand, Abteilungsleitung, Schlichtung, Coaches — Dateinamen = Rolle + Name |
| `img/gym/` | 65 | Trainingsstätten-Galerie, `gym-01` … `gym-65` (Reihenfolge wie alte Masonry-Grid) |
| `img/news/` | 63 | Wettkampf-/Vereinsfotos aus den Beiträgen |
| `docs/` | 1 | `Gebuehr_2019.pdf` |

**Gesamt 146 Dateien, 49 MB.** Alle jpg/png/pdf, per Magic-Bytes verifiziert.
6 Einträge der WP-Mediathek lieferten 404 (serverseitig gelöscht) und wurden entfernt:
`2025/03/{Untitled,Untitled-2,media}.jpg`, `2025/03/Screenshot-2023-06-14-132457.png`,
`2025/07/{Bene,Julia}.jpeg` (letztere existieren identisch unter `2025/08/`).

Rohdaten des Scrapes liegen in `scrape/`:
`content/*.md` (alle 17 Seiten + 27 Beiträge als Text), `full_pages.json`, `full_posts.json`,
`media_*.json`, `media_list.tsv`, `assets/` (Originalpfade wie im WP-Upload-Ordner), `index.html`.

**Noch nicht vorhanden:** Favicon/App-Icons, OG-Image, SVG-Version des Logos (aktuell nur PNG),
Vereinssatzung & Ordnungen als lokale PDFs (liegen bei Google Drive).
