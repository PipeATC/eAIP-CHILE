#!/usr/bin/env python3
"""
Inyecta el catálogo de cartas de SCEL dentro de prototipo/index.html.

El prototipo lista las cartas desde un catálogo embebido (para no depender de
fetch/CORS al abrir por file://) y carga cada imagen por ruta relativa desde
data/charts/SCEL/. Este script vuelca data/charts/SCEL/catalog.json en el
marcador  const CATALOG=/*__CATALOG__*/{...}/*__END__*/  de index.html.

Uso:  python prototipo/build.py
(idempotente). Regenera primero las cartas con:
      python pipeline/render_scel_charts.py
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / "prototipo" / "index.html"
CATALOG = ROOT / "data" / "charts" / "SCEL" / "catalog.json"

MARK = re.compile(r'/\*__CATALOG__\*/.*?/\*__END__\*/', re.S)


def main():
    if not CATALOG.exists():
        raise SystemExit(f"No existe {CATALOG}. Corre pipeline/render_scel_charts.py primero.")
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    html = HTML.read_text(encoding="utf-8")
    new = f"/*__CATALOG__*/{payload}/*__END__*/"
    html2, n = MARK.subn(lambda _: new, html, count=1)
    if not n:
        raise SystemExit("No se encontró el marcador __CATALOG__ en index.html")
    HTML.write_text(html2, encoding="utf-8")
    print(f"✓ Catálogo inyectado: {data['count']} cartas -> {HTML.name} ({HTML.stat().st_size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
