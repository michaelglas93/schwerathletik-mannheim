#!/usr/bin/env python3
"""Erzeugt Favicon und Apple-Touch-Icon aus der Bildmarke.

Auf diesem Rechner gibt es weder Pillow noch ImageMagick, und `sips` kann keine
transparenten Flächen mit einer Farbe hinterlegen — die Bildmarke ist aber dunkles
Anthrazit und würde auf einem dunklen Tab verschwinden. Deshalb hier ein kleiner
eigener PNG-Weg: dekodieren, per Box-Filter verkleinern, auf den hellen Markenton
komponieren, wieder kodieren.

    python3 scripts/make-icons.py
"""
from __future__ import annotations

import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "public", "img", "brand", "logo-bildmarke.png")
BACKGROUND = (0xF5, 0xF3, 0xF1)  # --color-bone, damit das Anthrazit sichtbar bleibt
INSET = 0.78  # Anteil der Kantenlänge, den die Marke einnimmt

Pixels = list[list[tuple[int, int, int, int]]]


def read_png(path: str) -> Pixels:
    data = open(path, "rb").read()
    pos, idat = 8, b""
    width = height = depth = color = 0

    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        kind = data[pos + 4 : pos + 8]
        chunk = data[pos + 8 : pos + 8 + length]
        pos += 12 + length
        if kind == b"IHDR":
            width, height, depth, color = struct.unpack(">IIBB", chunk[:10])
        elif kind == b"IDAT":
            idat += chunk

    if depth != 8 or color not in (2, 6):
        raise SystemExit(f"Nur 8-Bit RGB/RGBA unterstützt (hier: depth={depth}, color={color})")

    channels = 4 if color == 6 else 3
    raw = zlib.decompress(idat)
    stride = width * channels
    rows: Pixels = []
    previous = bytearray(stride)
    offset = 0

    for _ in range(height):
        filter_type = raw[offset]
        offset += 1
        line = bytearray(raw[offset : offset + stride])
        offset += stride
        for x in range(stride):
            a = line[x - channels] if x >= channels else 0
            b = previous[x]
            c = previous[x - channels] if x >= channels else 0
            if filter_type == 1:
                line[x] = (line[x] + a) & 0xFF
            elif filter_type == 2:
                line[x] = (line[x] + b) & 0xFF
            elif filter_type == 3:
                line[x] = (line[x] + (a + b) // 2) & 0xFF
            elif filter_type == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                predictor = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + predictor) & 0xFF
        rows.append(
            [
                (
                    line[i * channels],
                    line[i * channels + 1],
                    line[i * channels + 2],
                    line[i * channels + 3] if channels == 4 else 255,
                )
                for i in range(width)
            ]
        )
        previous = line

    return rows


def resize(rows: Pixels, target_w: int, target_h: int) -> Pixels:
    """Box-Filter — für reines Verkleinern völlig ausreichend."""
    src_h, src_w = len(rows), len(rows[0])
    out: Pixels = []
    for y in range(target_h):
        y0, y1 = y * src_h // target_h, max(y * src_h // target_h + 1, (y + 1) * src_h // target_h)
        line = []
        for x in range(target_w):
            x0, x1 = x * src_w // target_w, max(x * src_w // target_w + 1, (x + 1) * src_w // target_w)
            r = g = b = a = n = 0
            for sy in range(y0, y1):
                for sx in range(x0, x1):
                    pr, pg, pb, pa = rows[sy][sx]
                    # Vorher mit Alpha gewichten, sonst blutet Schwarz aus transparenten Pixeln.
                    r += pr * pa
                    g += pg * pa
                    b += pb * pa
                    a += pa
                    n += 1
            if a:
                line.append((r // a, g // a, b // a, a // n))
            else:
                line.append((0, 0, 0, 0))
        out.append(line)
    return out


def write_png(path: str, rows: list[list[tuple[int, int, int]]]) -> None:
    height, width = len(rows), len(rows[0])
    raw = bytearray()
    for row in rows:
        raw.append(0)  # Filter „None“
        for r, g, b in row:
            raw += bytes((r, g, b))

    def chunk(kind: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + kind
            + payload
            + struct.pack(">I", zlib.crc32(kind + payload) & 0xFFFFFFFF)
        )

    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    open(path, "wb").write(png)


def make_icon(source: Pixels, size: int) -> list[list[tuple[int, int, int]]]:
    src_h, src_w = len(source), len(source[0])
    mark_w = int(size * INSET)
    mark_h = max(1, round(mark_w * src_h / src_w))
    if mark_h > size * INSET:
        mark_h = int(size * INSET)
        mark_w = max(1, round(mark_h * src_w / src_h))

    mark = resize(source, mark_w, mark_h)
    left, top = (size - mark_w) // 2, (size - mark_h) // 2

    canvas = [[BACKGROUND for _ in range(size)] for _ in range(size)]
    for y in range(mark_h):
        for x in range(mark_w):
            r, g, b, a = mark[y][x]
            if not a:
                continue
            br, bg, bb = canvas[top + y][left + x]
            canvas[top + y][left + x] = (
                (r * a + br * (255 - a)) // 255,
                (g * a + bg * (255 - a)) // 255,
                (b * a + bb * (255 - a)) // 255,
            )
    return canvas


def main() -> None:
    source = read_png(SOURCE)
    for name, size in (("icon.png", 512), ("apple-icon.png", 180)):
        target = os.path.join(ROOT, "src", "app", name)
        write_png(target, make_icon(source, size))
        print(f"→ src/app/{name}  {size}×{size}")


if __name__ == "__main__":
    main()
