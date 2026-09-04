#!/usr/bin/env python3
"""
Incrusta los assets (cartas renderizadas) dentro de prototipo/index.html como
data: URIs, para que el prototipo sea un único archivo autocontenido que se
puede abrir en cualquier navegador / teléfono sin servidor ni archivos sueltos.

Uso:  python prototipo/build.py
Es idempotente: vuelve a inyectar la imagen en la línea marcada
    const CHART_SRC="...";/*__CHART_ILS_Z_17L__*/
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / "prototipo" / "index.html"

ASSETS = {
    "__CHART_ILS_Z_17L__": ROOT / "data" / "charts" / "SCEL" / "ILS_Z_17L.png",
}


def data_uri(path: pathlib.Path) -> str:
    mime = "image/png" if path.suffix == ".png" else "image/jpeg"
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def main():
    html = HTML.read_text(encoding="utf-8")
    for marker, path in ASSETS.items():
        if not path.exists():
            print(f"  ! falta {path} — se deja el placeholder para {marker}")
            continue
        uri = data_uri(path)
        # reemplaza la línea:  const CHART_SRC="...";/*__MARKER__*/
        pat = re.compile(r'const CHART_SRC="(?:[^"\\]|\\.)*";/\*' + re.escape(marker) + r'\*/')
        repl = f'const CHART_SRC="{uri}";/*{marker}*/'
        html, n = pat.subn(repl, html)
        print(f"  {'✓' if n else '·'} {marker}: {n} inyección(es), {path.stat().st_size/1e6:.2f} MB -> data URI")
    HTML.write_text(html, encoding="utf-8")
    print(f"Listo: {HTML} ({HTML.stat().st_size/1e6:.2f} MB)")


if __name__ == "__main__":
    main()
