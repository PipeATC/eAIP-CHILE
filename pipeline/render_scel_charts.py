#!/usr/bin/env python3
"""
Renderiza las cartas de SCEL del Vol. II a imágenes + catálogo JSON.

Toma el PDF combinado de las cartas de SCEL, agrupa las páginas por identidad
de carta (tipo + número, ej. IAC 1, SID 5, STAR 6), elige de cada grupo la
**lámina gráfica** (la página con más trazos vectoriales, no la hoja de texto),
la renderiza con pypdfium2 y escribe:

  data/charts/SCEL/<CODE>.jpg      una imagen por carta
  data/charts/SCEL/catalog.json    metadatos (code, tipo, fase, rwy, título, file)

Uso:  python pipeline/render_scel_charts.py [source_pdfs/AIP_VOL_II_SCEL_full.pdf]
"""
import sys, os, re, json, hashlib
import pypdfium2 as pdfium
import pdfplumber

SRC = sys.argv[1] if len(sys.argv) > 1 else 'source_pdfs/AIP_VOL_II_SCEL_full.pdf'
OUT = 'data/charts/SCEL'
SCALE = 2.6      # ~1070 px de ancho (A4) — legible y liviano
JPG_Q = 85

TYPE_RE = re.compile(r'SCEL\s*[-—]?\s*(IAC|SID|STAR|ADC|GMC|PATC|AOC|VAC|PDC|APDC)\s*([0-9]{1,2})?', re.I)
PROC_RES = [
    r'ILS [ZY] RWY ?\d{2}[LRC]?', r'LOC RWY ?\d{2}[LRC]?', r'VOR RWY ?\d{2}[LRC]?',
    r'RNP [ZY]? ?RWY ?\d{2}[LRC]?', r'RNAV RWY ?\d{2}[LRC]?', r'[A-Z]{4,6} ?\d[A-Z]? RNAV',
]
PHASE = {'IAC': 'Aproximación', 'SID': 'Salida', 'STAR': 'Llegada', 'ADC': 'Aeródromo',
         'GMC': 'Movimiento', 'PATC': 'Estacionamiento', 'PDC': 'Estacionamiento',
         'AOC': 'Obstáculos', 'VAC': 'Visual', 'OTRO': 'Otros'}
ORDER = ['IAC', 'SID', 'STAR', 'ADC', 'GMC', 'PATC', 'PDC', 'AOC', 'VAC', 'OTRO']


def parse(txt):
    up = txt.upper()
    m = TYPE_RE.search(up)
    typ = m.group(1).upper() if m else 'OTRO'
    num = m.group(2) if (m and m.group(2)) else ''
    proc = ''
    for rx in PROC_RES:
        mm = re.search(rx, up)
        if mm:
            proc = re.sub(r'\s+', ' ', mm.group(0).title()).replace('Rwy', 'RWY').replace('Ils', 'ILS')
            proc = proc.replace('Loc', 'LOC').replace('Vor', 'VOR').replace('Rnp', 'RNP').replace('Rnav', 'RNAV')
            break
    if not proc:
        for kw, lbl in [('GROUND MOVEMENT', 'Movimiento en superficie'), ('MOVIMIENTO', 'Movimiento en superficie'),
                        ('ESTACIONAMIENTO', 'Estacionamiento'), ('PARKING', 'Estacionamiento'),
                        ('AERODROME', 'Plano de aeródromo'), ('VISUAL', 'Aproximación visual')]:
            if kw in up:
                proc = lbl
                break
    return typ, num, proc


def main():
    os.makedirs(OUT, exist_ok=True)
    pdf = pdfium.PdfDocument(SRC)
    plumb = pdfplumber.open(SRC)
    n = len(pdf)
    print(f'{n} páginas en {SRC}')

    pages = []
    for i in range(n):
        pg = plumb.pages[i]
        typ, num, proc = parse(pg.extract_text() or '')
        score = len(pg.curves) + len(pg.lines)
        bmp = pdf[i].render(scale=1.0)
        h = hashlib.md5(bmp.to_pil().convert('L').resize((64, 90)).tobytes()).hexdigest()
        pages.append(dict(i=i, typ=typ, num=num, proc=proc, score=score, h=h))

    # Agrupar por identidad. Numeradas: (tipo,num). Sin número: por hash de imagen.
    groups = {}
    for p in pages:
        key = f"{p['typ']}{int(p['num']):02d}" if p['num'] else f"{p['typ']}~{p['h'][:8]}"
        g = groups.setdefault(key, [])
        g.append(p)

    # Remapea páginas sin número a su tipo real por palabra clave del título
    PROC2TYPE = {'Movimiento en superficie': 'GMC', 'Estacionamiento': 'PDC',
                 'Aproximación visual': 'VAC', 'Plano de aeródromo': 'ADC'}
    charts = []
    for key, ps in groups.items():
        rep = max(ps, key=lambda p: p['score'])          # la lámina gráfica
        proc = next((p['proc'] for p in ps if p['proc']), '')
        typ = rep['typ']; num = rep['num']
        # Descarta OTRO sin identificar (hojas de texto / índice / continuación)
        if typ == 'OTRO' and not proc:
            continue
        if typ == 'OTRO' and proc in PROC2TYPE:
            typ = PROC2TYPE[proc]
        charts.append(dict(key=key, typ=typ, num=num, proc=proc, page=rep['i'], score=rep['score']))

    # Ordenar por tipo (ORDER) y número
    charts.sort(key=lambda c: (ORDER.index(c['typ']) if c['typ'] in ORDER else 99,
                               int(c['num']) if c['num'] else 999))

    catalog = []
    for c in charts:
        typ, num = c['typ'], c['num']
        rwy = ''
        mr = re.search(r'RWY ?(\d{2}[LRC]?)', c['proc'])
        if mr:
            rwy = mr.group(1)
        title = c['proc'] or f"{typ} {num}".strip()
        code = f"{typ}{int(num):02d}" if num else key_code(typ, catalog)
        fname = f"{code}.jpg"
        # render
        bmp = pdf[c['page']].render(scale=SCALE)
        img = bmp.to_pil().convert('RGB')
        img.save(os.path.join(OUT, fname), quality=JPG_Q, optimize=True)
        catalog.append(dict(code=code, type=typ, phase=PHASE.get(typ, 'Otros'),
                            num=num, rwy=rwy, title=title, file=fname))
        print(f"  {code:10} {typ:5} {title[:34]:34} <- pág {c['page']+1} ({os.path.getsize(os.path.join(OUT,fname))//1024} KB)")

    json.dump({'icao': 'SCEL', 'source': 'AIP Chile Vol. II (AMDT 103)',
               'count': len(catalog), 'charts': catalog},
              open(os.path.join(OUT, 'catalog.json'), 'w'), ensure_ascii=False, indent=2)
    print(f'\n{len(catalog)} cartas -> {OUT}/  (catalog.json)')


def key_code(typ, catalog):
    k = sum(1 for c in catalog if c['type'] == typ) + 1
    return f"{typ}{k:02d}"


if __name__ == '__main__':
    main()
