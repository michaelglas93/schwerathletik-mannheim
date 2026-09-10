# Asset-Inventar (`public/`)

| Ordner | Anzahl | Inhalt |
|---|---|---|
| `img/brand/` | 3 | Logo Bildmarke (farbig 2362×1890, weiß 142×83), Wordmark 230×89 |
| `img/hero/` | 3 | `home-hero.jpg` 2500×1667, `home-hero-dark.jpg` 2320×687 (Hero der alten Startseite), `unbenannt-1.jpg` 2500×250 |
| `img/people/` | 12 | Vorstand, Abteilungsleitung, Schlichtung, Coaches — Dateinamen = Rolle + Name |
| `img/gym/` | 65 | Trainingsstätten-Galerie, `gym-01` … `gym-65` (Reihenfolge wie alte Masonry-Grid) |
| `img/news/` | 50 | Wettkampf-/Vereinsfotos aus den Beiträgen |

**Gesamt 133 Dateien, 41 MB.** Alle jpg/png, per Magic-Bytes verifiziert.
6 Einträge der WP-Mediathek lieferten 404 (serverseitig gelöscht) und wurden entfernt:
`2025/03/{Untitled,Untitled-2,media}.jpg`, `2025/03/Screenshot-2023-06-14-132457.png`,
`2025/07/{Bene,Julia}.jpeg` (letztere existieren identisch unter `2025/08/`).

## Was aus rechtlichen Gründen entfernt wurde

`public/` wird vollständig ausgeliefert — auch Dateien, die nirgends verlinkt sind. Was
hier nicht gebraucht wird, gehört deshalb raus:

- `docs/Gebuehr_2019.pdf` — war kein Vereinsdokument, sondern ein Schreiben der DHBW
  Mannheim zu Studienbeiträgen samt Namen und Durchwahlen dreier Beschäftigter. Kam über
  den WP-Scrape mit und war unter `/docs/Gebuehr_2019.pdf` öffentlich abrufbar.
- `img/news/lm-bawu-aktive-2023-kira-stett-28.jpg` und
  `img/news/rheinland-barbell-shirts-shot-by-cesco-129-squared.jpg` — Fotos mit fremdem
  Urheber im Dateinamen, ungenutzt, Rechtelage ungeklärt.
- Zehn weitere ungenutzte Dateien aus `img/news/`: die Personenfotos `bene-2.jpeg`,
  `julia-2.jpeg` und `vorstand-kira.jpg`, ein WhatsApp-Bild unklarer Herkunft sowie
  `dsc06546.jpg`, `dsc07204.jpg`, `img-4695.jpg`, `mypicture-2.png` und zwei Dateien mit
  kryptischen Namen aus der WP-Mediathek. Wer auf einem Foto zu sehen ist und seine
  Einwilligung widerruft, ist mit „nicht mehr verlinkt" nicht bedient — die Datei muss weg.

Die Originale liegen weiterhin im lokalen Archiv unter `scrape/assets/` (nicht im Repo).
Verwaist ist damit nur noch `img/brand/logo-wordmark.png` — das eigene Logo, das bleibt.

Rohdaten des Scrapes liegen in `scrape/`:
`content/*.md` (alle 17 Seiten + 27 Beiträge als Text), `full_pages.json`, `full_posts.json`,
`media_*.json`, `media_list.tsv`, `assets/` (Originalpfade wie im WP-Upload-Ordner), `index.html`.

Icons und Social-Vorschaubilder liegen nicht unter `public/`, sondern als Konventionsdateien
in `src/app/`: `icon.png`, `apple-icon.png`, `opengraph-image.jpg`, `twitter-image.jpg`
(erzeugt von `scripts/make-icons.py`).

**Noch nicht vorhanden:** SVG-Version des Logos (aktuell nur PNG), Vereinssatzung &
Ordnungen als lokale PDFs (liegen bei Google Drive).
