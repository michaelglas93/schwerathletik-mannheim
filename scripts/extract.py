#!/usr/bin/env python3
"""Wandelt den WordPress-Scrape in eine normalisierte Content-Datei um.

Ergebnis: content/seed.json — dieselbe Struktur, die das Frontend rendert und die
scripts/migrate.ts nach Sanity schiebt. Bildpfade zeigen auf public/img/...,
in Sanity werden daraus Asset-Referenzen.

    python3 scripts/extract.py
"""
from __future__ import annotations

import html
import json
import os
import re
import unicodedata
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRAPE = os.path.join(ROOT, "scrape")
OUT = os.path.join(ROOT, "content", "seed.json")

# ── Hilfen ────────────────────────────────────────────────────────────────────

_KEY = [0]


def key(prefix: str = "k") -> str:
    _KEY[0] += 1
    return f"{prefix}{_KEY[0]:04d}"


def slugify(s: str) -> str:
    s = s.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def clean(s: str) -> str:
    """Entities auflösen und die typografischen Eigenheiten von WP glätten."""
    s = html.unescape(s or "")
    s = s.replace("–", "–").replace("’", "'")
    return re.sub(r"[ \t ]+", " ", s)


def load(name: str):
    with open(os.path.join(SCRAPE, name), encoding="utf-8") as f:
        return json.load(f)


# ── Media-Mapping: WP-Upload-URL → Pfad unter public/ ─────────────────────────

PEOPLE = {
    365: ("vorstand-1-roy-lotzwik", "Roy Lotzwik", "1. Vorstand", "vorstand"),
    366: ("vorstand-2-sven-mitlaender", "Sven Mitländer", "2. Vorstand", "vorstand"),
    651: ("kassierer-1-benedikt-rhomberg-kauert", "Benedikt Rhomberg-Kauert", "1. Kassierer", "vorstand"),
    652: ("kassiererin-2-julia-renkel", "Julia Renkel", "2. Kassiererin", "vorstand"),
    368: ("gewichtheben-stanislaus-schwabauer", "Stanislaus Schwabauer", "Abteilungsleitung", "gewichtheben"),
    370: ("kdk-veronika-schulze", "Veronika Schulze", "Abteilungsleitung", "kdk"),
    650: ("kdk-simon-oswald", "Simon Oswald", "Abteilungsleitung", "kdk"),
    369: ("schlichtung-keven-reinfrank", "Keven Reinfrank", "Schlichtungsbeauftragter", "schlichtung"),
}

COACHES = {
    374: ("coach-janosch-janson", "Janosch Janson", ["KDK/Powerlifting", "Bodybuilding"],
          "https://drive.google.com/file/d/1L1MNB8z2GS6u6QFxcMZFXdV5_YIyGFTd/view?usp=sharing"),
    373: ("coach-keven-reinfrank", "Keven Reinfrank", ["KDK/Powerlifting", "Bodybuilding"],
          "https://drive.google.com/file/d/1ezcj2gNdjlwo9ym3UFgqKI_RR0PAaoRV/view?usp=sharing"),
    307: ("coach-simon-oswald", "Simon Oswald", ["KDK/Powerlifting", "Allgemeines Krafttraining"],
          "https://drive.google.com/file/d/1tWPLLN4eT79GnfIFJVjl9HFyX9yO6EkY/view?usp=sharing"),
    375: ("coach-stani-schwabauer", "Stani Schwabauer", ["Gewichtheben", "KDK/Powerlifting", "Allgemeines Krafttraining"],
          "https://drive.google.com/file/d/1mFvHJMKxiMT2QQR3BeYLnmZ_gU27r7Kl/view?usp=sharing"),
}

GYM_IDS = [274, 273, 272, 271, 270, 269, 268, 267, 266, 265, 264, 263, 262, 261, 260,
           259, 258, 257, 256, 255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245,
           244, 243, 242, 241, 240, 239, 238, 237, 236, 235, 234, 233, 232, 231, 230,
           229, 228, 227, 226, 225, 224, 223, 222, 221, 220, 219, 218, 217, 216, 215,
           214, 212, 211, 210, 209]

BRAND = {146: "brand/logo-bildmarke", 148: "brand/logo-bildmarke-white", 538: "brand/logo-wordmark"}
# 111 ist das unbeschnittene Original (2500×1667), 202 der abgedunkelte Banner-Zuschnitt
# der alten Seite. Für den hohen Hero eignet sich das Original besser.
HERO = {111: "hero/home-hero", 202: "hero/home-hero-dark"}
# Diese Mediathek-Einträge lieferten auf dem Server 404 und existieren lokal nicht.
MISSING = {"2025/03/Untitled.jpg", "2025/03/Untitled-2.jpg", "2025/03/media.jpg",
           "2025/03/Screenshot-2023-06-14-132457.png", "2025/07/Bene.jpeg", "2025/07/Julia.jpeg"}


def build_media_index() -> tuple[dict[int, dict], dict[str, dict]]:
    """Liefert (nach WP-ID, nach Upload-Pfad) — jeweils mit lokalem public-Pfad."""
    by_id: dict[int, dict] = {}
    for part in ("media_1.json", "media_2.json"):
        for m in load(part):
            by_id[m["id"]] = m

    gym_pos = {mid: i + 1 for i, mid in enumerate(GYM_IDS)}
    index: dict[int, dict] = {}
    for mid, m in by_id.items():
        rel = m["source_url"].split("/uploads/")[1]
        if rel in MISSING:
            continue
        ext = os.path.splitext(rel)[1]
        if mid in BRAND:
            path = BRAND[mid] + ext
        elif mid in HERO:
            path = HERO[mid] + ext
        elif mid in PEOPLE:
            path = f"people/{PEOPLE[mid][0]}{ext}"
        elif mid in COACHES:
            path = f"people/{COACHES[mid][0]}{ext}"
        elif mid in gym_pos:
            path = f"gym/gym-{gym_pos[mid]:02d}{ext}"
        elif m["mime_type"] == "application/pdf":
            path = None
        else:
            path = f"news/{slugify(m['slug'])}{ext}"
        index[mid] = {
            "id": mid,
            "path": f"/img/{path}" if path else None,
            "source": rel,
            "alt": clean(m.get("alt_text") or ""),
            "caption": clean(re.sub(r"<[^>]+>", "", m.get("caption", {}).get("rendered", ""))).strip(),
            "width": (m.get("media_details") or {}).get("width"),
            "height": (m.get("media_details") or {}).get("height"),
        }
    by_source = {v["source"]: v for v in index.values()}
    return index, by_source


# ── HTML → Portable Text ─────────────────────────────────────────────────────

BLOCK_STYLE = {"h1": "h2", "h2": "h2", "h3": "h3", "h4": "h4", "h5": "h4",
               "p": "normal", "blockquote": "blockquote"}
MARK_TAGS = {"strong": "strong", "b": "strong", "em": "em", "i": "em", "u": "underline"}


class PortableTextParser(HTMLParser):
    """Wandelt das Gutenberg-HTML eines Beitrags in Portable-Text-Blöcke.

    Erzeugt zusätzlich zwei eigene Blocktypen:
      imageBlock   — Bild mit lokalem Pfad, Alt-Text und optionaler Bildunterschrift
      resultsTable — Wettkampfergebnisse als headers/rows statt als <table>
    """

    def __init__(self, media_by_source: dict[str, dict]):
        super().__init__(convert_charrefs=True)
        self.media = media_by_source
        self.blocks: list[dict] = []
        self._children: list[dict] = []
        self._markdefs: list[dict] = []
        self._marks: list[str] = []
        self._style = "normal"
        self._list: str | None = None
        self._table: list[list[str]] | None = None
        self._row: list[str] | None = None
        self._cell: list[str] | None = None
        self._figure: dict | None = None
        self._caption: list[str] | None = None

    # -- Blockverwaltung
    def _flush(self):
        text = "".join(c["text"] for c in self._children)
        if text.strip():
            block = {"_type": "block", "_key": key("b"), "style": self._style,
                     "markDefs": self._markdefs, "children": self._children}
            if self._list:
                block["listItem"] = self._list
                block["level"] = 1
            self.blocks.append(block)
        self._children, self._markdefs = [], []
        self._style = "normal"

    def _push(self, text: str):
        if not text:
            return
        target = self._cell if self._cell is not None else (
            self._caption if self._caption is not None else None)
        if target is not None:
            target.append(text)
            return
        if self._children and self._children[-1]["marks"] == list(self._marks):
            self._children[-1]["text"] += text
        else:
            self._children.append({"_type": "span", "_key": key("s"),
                                   "text": text, "marks": list(self._marks)})

    # -- Handler
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in BLOCK_STYLE:
            self._flush()
            self._style = BLOCK_STYLE[tag]
        elif tag in ("ul", "ol"):
            self._flush()
            self._list = "bullet" if tag == "ul" else "number"
        elif tag == "li":
            self._flush()
        elif tag in MARK_TAGS:
            self._marks.append(MARK_TAGS[tag])
        elif tag == "a" and a.get("href"):
            k = key("l")
            self._markdefs.append({"_key": k, "_type": "link", "href": clean(a["href"])})
            self._marks.append(k)
        elif tag == "br":
            self._push("\n")
        elif tag == "figure":
            self._figure = {}
        elif tag == "figcaption":
            self._caption = []
        elif tag == "img":
            src = a.get("src", "")
            rel = src.split("/uploads/")[1] if "/uploads/" in src else None
            # WP hängt Größen an den Dateinamen: foo-768x1024.jpg → foo.jpg
            if rel:
                rel = re.sub(r"-\d+x\d+(\.[a-zA-Z]+)$", r"\1", rel)
            m = self.media.get(rel) if rel else None
            self._flush()
            if m and m["path"]:
                blk = {"_type": "imageBlock", "_key": key("i"), "path": m["path"],
                       "mediaId": m["id"],
                       "alt": clean(a.get("alt") or m["alt"] or ""),
                       "width": m["width"], "height": m["height"]}
                if self._figure is not None:
                    self._figure = blk
                else:
                    self.blocks.append(blk)
        elif tag == "table":
            self._flush()
            self._table = []
        elif tag == "tr" and self._table is not None:
            self._row = []
        elif tag in ("td", "th") and self._row is not None:
            self._cell = []

    def handle_endtag(self, tag):
        if tag in BLOCK_STYLE or tag == "li":
            self._flush()
        elif tag in ("ul", "ol"):
            self._flush()
            self._list = None
        elif tag in MARK_TAGS:
            if MARK_TAGS[tag] in self._marks:
                self._marks.remove(MARK_TAGS[tag])
        elif tag == "a":
            if self._marks:
                self._marks.pop()
        elif tag == "figcaption":
            caption = clean("".join(self._caption or "")).strip()
            self._caption = None
            if caption and isinstance(self._figure, dict) and self._figure.get("_type"):
                self._figure["caption"] = caption
        elif tag == "figure":
            if isinstance(self._figure, dict) and self._figure.get("_type"):
                self.blocks.append(self._figure)
            self._figure = None
        elif tag in ("td", "th") and self._cell is not None:
            self._row.append(clean("".join(self._cell)).strip())
            self._cell = None
        elif tag == "tr" and self._row is not None:
            if any(c for c in self._row):
                self._table.append(self._row)
            self._row = None
        elif tag == "table" and self._table is not None:
            if self._table:
                headers, rows = self._table[0], self._table[1:]
                self.blocks.append({"_type": "resultsTable", "_key": key("t"),
                                    "headers": headers, "rows": rows})
            self._table = None

    def handle_data(self, data):
        self._push(clean(data))

    def close(self):
        super().close()
        self._flush()


def to_portable_text(raw_html: str, media_by_source: dict) -> list[dict]:
    p = PortableTextParser(media_by_source)
    p.feed(raw_html)
    p.close()
    return p.blocks


def plain_text(blocks: list[dict]) -> str:
    out = []
    for b in blocks:
        if b["_type"] == "block":
            out.append("".join(c["text"] for c in b["children"]))
    return " ".join(out)


# ── Aufbau der einzelnen Inhaltstypen ────────────────────────────────────────

# Die WP-Kategorien sind reine Jahreszahlen und verlässlicher als das Beitragsdatum:
# drei Quartalsrückblicke wurden nachträglich angelegt und tragen das Datum der Eingabe.
CATEGORY_YEAR = {3: 2018, 4: 2019, 5: 2020, 6: 2021, 7: 2022, 8: 2023, 9: 2024, 10: 2025}


def split_lead_headings(body: list[dict]) -> list[dict]:
    """`<strong>Zwischenüberschrift</strong><br>Fließtext` zu h3 + Absatz auftrennen.

    Die Quartalsrückblicke gliedern ihre Wettkämpfe auf diese Weise; als ein einziger
    Absatz gelesen verlieren sie ihre Struktur.
    """
    out = []
    for b in body:
        if b["_type"] != "block" or b["style"] != "normal" or not b["children"]:
            out.append(b)
            continue
        head, rest = b["children"][0], b["children"][1:]
        title = head["text"].split("\n")[0].strip()
        # Der fette Auftakt zählt nur als Überschrift, wenn danach ein Umbruch folgt
        # oder der Absatz mit ihm endet — fett mitten im Fließtext bleibt fett.
        breaks_after = "\n" in head["text"] or (rest and rest[0]["text"].startswith("\n"))
        if "strong" not in head["marks"] or not title or len(title) > 90:
            out.append(b)
            continue
        if not breaks_after and rest:
            out.append(b)
            continue
        out.append({"_type": "block", "_key": key("b"), "style": "h3", "markDefs": [],
                    "children": [{"_type": "span", "_key": key("s"), "text": title, "marks": []}]})
        tail = []
        remainder = head["text"].partition("\n")[2].lstrip("\n")
        if remainder:
            tail.append({**head, "_key": key("s"), "text": remainder,
                         "marks": [m for m in head["marks"] if m != "strong"]})
        for i, c in enumerate(rest):
            tail.append({**c, "_key": key("s"),
                         "text": c["text"].lstrip("\n") if i == 0 else c["text"]})
        if any(c["text"].strip() for c in tail):
            out.append({**b, "_key": key("b"), "children": tail})
    return out


def build_posts(media_by_id, media_by_source) -> list[dict]:
    posts = []
    for p in load("full_posts.json"):
        title = clean(re.sub(r"<[^>]+>", "", p["title"]["rendered"])).strip()
        body = to_portable_text(p["content"]["rendered"], media_by_source)

        # WP wiederholt den Titel oft als erste Überschrift im Text — die fällt raus.
        if body and body[0]["_type"] == "block" and body[0]["style"] in ("h2", "h3"):
            first = "".join(c["text"] for c in body[0]["children"]).strip()
            if slugify(first) == slugify(title):
                body = body[1:]
        body = split_lead_headings(body)

        excerpt = clean(re.sub(r"<[^>]+>", "", p.get("excerpt", {}).get("rendered", ""))).strip()
        excerpt = re.sub(r"\s*\[…\]\s*$", "…", excerpt).replace("[…]", "…")
        # Der Auto-Excerpt beginnt mit der Titelüberschrift aus dem Beitragstext.
        if slugify(excerpt).startswith(slugify(title)) and len(excerpt) > len(title):
            excerpt = excerpt[len(title):].lstrip(" –—-:")
        if not excerpt:
            excerpt = plain_text(body)[:200].rsplit(" ", 1)[0] + "…"

        cover = media_by_id.get(p.get("featured_media") or 0)
        if not cover or not cover.get("path"):
            cover = next((b for b in body if b["_type"] == "imageBlock"), None)
            cover = {"path": cover["path"], "alt": cover.get("alt", ""), "id": cover.get("mediaId"),
                     "width": cover.get("width"), "height": cover.get("height")} if cover else None

        date = p["date"][:10]
        year = next((CATEGORY_YEAR[c] for c in p.get("categories", []) if c in CATEGORY_YEAR),
                    int(date[:4]))

        posts.append({
            "_id": f"post-{p['id']}",
            "title": title,
            "slug": p["slug"],
            "date": date,
            "year": year,
            # Bei nachträglich angelegten Beiträgen passt das Datum nicht zum Jahr —
            # dann zeigt das Frontend nur die Jahreszahl statt eines irreführenden Tages.
            "showDate": int(date[:4]) == year,
            "excerpt": excerpt,
            "cover": {"path": cover["path"], "alt": cover.get("alt") or title,
                      "mediaId": cover.get("id"), "width": cover.get("width"),
                      "height": cover.get("height")} if cover else None,
            "body": body,
        })
    posts.sort(key=lambda x: x["date"], reverse=True)
    return posts


def build_people(media_by_id) -> list[dict]:
    people = []
    for mid, (fname, name, role, dept) in PEOPLE.items():
        m = media_by_id[mid]
        people.append({"_id": f"person-{mid}", "name": name, "role": role,
                       "department": dept, "photo": m["path"], "order": len(people)})
    for mid, (fname, name, disciplines, profile) in COACHES.items():
        m = media_by_id[mid]
        people.append({"_id": f"person-{mid}", "name": name, "role": "Coach",
                       "department": "coach", "photo": m["path"],
                       "disciplines": disciplines, "profileUrl": profile,
                       "order": len(people)})
    return people



def build_gallery(media_by_id) -> list[dict]:
    out = []
    for i, mid in enumerate(GYM_IDS, 1):
        m = media_by_id.get(mid)
        if not m or not m["path"]:
            continue
        out.append({"_id": f"gallery-{mid}", "path": m["path"], "order": i,
                    "caption": m["caption"], "width": m["width"], "height": m["height"]})
    return out


DOCUMENTS = [
    ("Vereinssatzung", "https://drive.google.com/file/d/1xrDaIWT4L5z_yEsBNt3pu34uB97NzAmd/view?usp=sharing"),
    ("Aufnahmeantrag", "https://drive.google.com/file/d/1P7qhaCRrEk7M1B93hWv1Ii0kMpn5SoQ7/view?usp=sharing"),
    ("Partizipationsordnung", "https://drive.google.com/file/d/1moRQbhne6BJL1bIld8BYFOarf5DiOE76/view?usp=sharing"),
    ("Finanzordnung", "https://drive.google.com/file/d/1gR7FWmM3mmIHB8tDLN0qEIcxZXLbHp7s/view?usp=sharing"),
    ("Anti-Doping-Ordnung", "https://drive.google.com/file/d/1kbgewbA49nBb7LyT8rexj4XUuOy436p9/view?usp=sharing"),
    ("Wahlordnung", "https://drive.google.com/file/d/1K1PIdLnLDtv1N3-zYYOSFN2TkiYPToVh/view?usp=sharing"),
]


def build_documents() -> list[dict]:
    return [{"_id": f"doc-{slugify(t)}", "title": t,
             "subtitle": "Schwerathletik Mannheim 2018 e.V.", "url": u, "order": i}
            for i, (t, u) in enumerate(DOCUMENTS)]


SETTINGS = {
    "_id": "siteSettings",
    "clubName": "Schwerathletik Mannheim 2018 e.V.",
    "shortName": "Schwerathletik Mannheim",
    "tagline": "Kraftdreikampf und Gewichtheben in Mannheim-Sandhofen",
    "intro": ("Wir sind ein Schwerathletikverein in Mannheim, der sich für die Förderung, Pflege "
              "und Verbreitung des Kraftsports einsetzt. Wir üben Kraftdreikampf, Gewichtheben "
              "und Freizeitsport aus und nehmen an sportlichen Wettkämpfen teil. Auch die Suche "
              "und Förderung von Talenten sind Teil des Vereins."),
    "introSecond": "Wir legen großen Wert auf ein gutes Miteinander und gegenseitige Unterstützung.",
    "founded": 2018,
    "gymSince": 2021,
    "heroImage": "/img/hero/home-hero.jpg",
    "address": {"street": "Maxburgstraße 4", "zip": "68219", "city": "Mannheim",
                "co": "c/o Roy Lotzwik"},
    "gym": {"name": "Halle des SKV Sandhofen", "street": "Kalthorststraße 44",
            "zip": "68307", "city": "Mannheim"},
    "register": {"number": "VR 702410", "court": "Amtsgericht Mannheim"},
    "board": ["Roy Lotzwik", "Sven Mitländer", "Benedikt Rhomberg-Kauert", "Julia Renkel"],
    "emails": [
        {"label": "Vorstand", "address": "vorstand@schwerathletik-mannheim.de"},
        {"label": "Abteilung Kraftdreikampf", "address": "kdk@schwerathletik-mannheim.de"},
        {"label": "Abteilung Gewichtheben", "address": "gewichtheben@schwerathletik-mannheim.de"},
        {"label": "Schlichtung", "address": "schlichtung@schwerathletik-mannheim.de"},
    ],
    "social": [
        {"label": "Instagram", "url": "https://www.instagram.com/schwerathletikmannheim"},
        {"label": "Facebook", "url": "https://www.facebook.com/profile.php?id=100046941896475"},
    ],
    "fees": [
        {"label": "Mitgliedschaft Erwachsene", "amount": "15 €", "period": "pro Monat"},
        {"label": "Mitgliedschaft ermäßigt", "amount": "10 €", "period": "pro Monat"},
        {"label": "Trainingsstätte", "amount": "16 €", "period": "pro Monat"},
        {"label": "SKV-Fitnessbereich dazu", "amount": "5 €", "period": "pro Monat"},
    ],
    "partners": [
        {"label": "SKV Sandhofen", "url": "https://www.skv-sandhofen.de",
         "note": "Partnerverein, Trainingsstätte"},
        {"label": "BWG", "url": "https://www.bw-gewichtheben.de/",
         "note": "Baden-Württembergischer Verband für Gewichtheben und Kraftdreikampf"},
        {"label": "BVDK", "url": "https://bvdk.de", "note": "Bundesverband Deutscher Kraftdreikämpfer"},
    ],
    "membershipFormUrl": "https://docuseal.eu/d/EzNCx6JoBgyFbo",
    "skvMembershipUrl": "https://www.skv-sandhofen.de/de/mitglieder-service/deine-mitgliedschaft/",
}


def main():
    media_by_id, media_by_source = build_media_index()
    data = {
        "settings": SETTINGS,
        "posts": build_posts(media_by_id, media_by_source),
        "people": build_people(media_by_id),
        "gallery": build_gallery(media_by_id),
        "documents": build_documents(),
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    missing = [b["path"] for p in data["posts"] for b in p["body"]
               if b["_type"] == "imageBlock" and not os.path.exists(os.path.join(ROOT, "public", b["path"].lstrip("/")))]
    tables = sum(1 for p in data["posts"] for b in p["body"] if b["_type"] == "resultsTable")
    images = sum(1 for p in data["posts"] for b in p["body"] if b["_type"] == "imageBlock")
    print(f"→ {OUT}")
    print(f"  Beiträge      {len(data['posts'])}  (davon mit Titelbild: "
          f"{sum(1 for p in data['posts'] if p['cover'])})")
    print(f"  Bilder im Text {images}   Ergebnistabellen {tables}")
    print(f"  Personen      {len(data['people'])}")
    print(f"  Galerie       {len(data['gallery'])}")
    print(f"  Dokumente     {len(data['documents'])}")
    if missing:
        print(f"  ⚠ {len(missing)} Bildpfade ohne Datei: {missing[:5]}")


if __name__ == "__main__":
    main()
