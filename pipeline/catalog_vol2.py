#!/usr/bin/env python3
"""
Catalogador AIP Chile Vol. II (cartas aeronauticas).

Recorre las paginas de cartas, detecta el codigo ICAO del aerodromo y
el tipo de carta (SID/STAR/IAC/ADC/...), y produce un catalogo JSON
agrupado por aerodromo y fase de vuelo -> base para el visor estilo charts.
Salida: catalog_vol2.json
"""
import re
import json
import os
import sys
from pypdf import PdfReader

ICAO_RE = re.compile(r'\b(SC[A-Z]{2})\b')

# Tipos de carta y su fase de vuelo (para el pinboard)
CHART_TYPES = [
    ('SID',   'Salida',   re.compile(r'\bSID\b', re.I)),
    ('STAR',  'Llegada',  re.compile(r'\bSTAR\b', re.I)),
    ('IAC',   'Aproximación', re.compile(r'\bIAC\b|APPROACH|APROXIMACIÓN', re.I)),
    ('ADC',   'Aeródromo', re.compile(r'\bADC\b|AERODROME CHART|PLANO DE AER', re.I)),
    ('GMC',   'Movimiento', re.compile(r'\bGMC\b|GROUND MOVEMENT', re.I)),
    ('PATC',  'Estacionamiento', re.compile(r'\bPATC\b|PARKING|ESTACIONAMIENTO', re.I)),
    ('AOC',   'Obstáculos', re.compile(r'\bAOC\b|OBSTACLE', re.I)),
    ('VAC',   'Visual',    re.compile(r'\bVAC\b|VISUAL APPROACH', re.I)),
]


def detect_chart(text: str):
    icao = None
    mi = ICAO_RE.search(text[:400])
    if mi:
        icao = mi.group(1)
    ctype, phase = 'OTRO', 'Otros'
    for code, ph, rx in CHART_TYPES:
        if rx.search(text[:500]):
            ctype, phase = code, ph
            break
    # runway si aparece (RWY 09, RWY 12L)
    rwy = None
    mr = re.search(r'RWY\s*(\d{2}[LRC]?)', text[:500])
    if mr:
        rwy = mr.group(1)
    # titulo: primera linea util
    title = ''
    for line in text.split('\n'):
        line = line.strip()
        if line and not line.startswith('AIP'):
            title = line[:80]
            break
    return icao, ctype, phase, rwy, title


def main(pdf_path: str):
    reader = PdfReader(pdf_path)
    n = len(reader.pages)
    print(f'Catalogando {n} cartas...', file=sys.stderr)

    charts = []
    for i, page in enumerate(reader.pages):
        txt = page.extract_text() or ''
        icao, ctype, phase, rwy, title = detect_chart(txt)
        charts.append({
            'page': i,
            'icao': icao,
            'type': ctype,
            'phase': phase,
            'rwy': rwy,
            'title': title,
        })
        if (i + 1) % 200 == 0:
            print(f'  ...{i+1}/{n}', file=sys.stderr)

    # Agrupar por aerodromo
    by_ad = {}
    for c in charts:
        if not c['icao']:
            continue
        by_ad.setdefault(c['icao'], []).append(c)

    catalog = {
        'source': 'AIP Chile Vol. II',
        'total_pages': n,
        'aerodrome_count': len(by_ad),
        'aerodromes': {
            icao: {
                'icao': icao,
                'chart_count': len(cs),
                'charts': cs,
            } for icao, cs in sorted(by_ad.items())
        },
    }

    out_path = os.path.join('data', 'catalog_vol2.json')
    os.makedirs('data', exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f'\n=== CATÁLOGO: {len(by_ad)} aeródromos con cartas ===', file=sys.stderr)
    for icao, cs in list(sorted(by_ad.items()))[:12]:
        types = {}
        for c in cs:
            types[c['type']] = types.get(c['type'], 0) + 1
        tstr = ', '.join(f'{k}:{v}' for k, v in sorted(types.items()))
        print(f'  {icao}: {len(cs):>2} cartas  ({tstr})', file=sys.stderr)
    print(f'  ... y {len(by_ad)-12} aeródromos más', file=sys.stderr)

    return catalog


if __name__ == '__main__':
    main(sys.argv[1])
