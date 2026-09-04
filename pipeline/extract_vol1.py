#!/usr/bin/env python3
"""
Extractor AIP Chile Vol. I -> JSON estructurado con arbol de indices OACI.

Detecta la estructura estandar OACI (GEN / ENR / AD) leyendo el codigo
que aparece en el encabezado de cada pagina, y agrupa el contenido en
un arbol navegable. Salida: index_vol1.json
"""
import re
import json
import os
import sys
from pypdf import PdfReader

# ---------------------------------------------------------------------------
# Patron OACI: parte (GEN/ENR/AD) + numero de seccion, ej "GEN 3.5", "AD 2",
# "ENR 1.1". El codigo suele venir con un sufijo de pagina "-8".
# ---------------------------------------------------------------------------
OACI_RE = re.compile(r'\b(GEN|ENR|AD)\s+(\d+(?:\.\d+)?)', re.IGNORECASE)
# Codigo ICAO de aerodromo (SCEL, SCIE, ...) para la parte AD
ICAO_RE = re.compile(r'\b(SC[A-Z]{2})\b')

PART_NAMES = {
    'GEN': 'Generalidades (GEN)',
    'ENR': 'En Ruta (ENR)',
    'AD':  'Aeródromos (AD)',
}


def clean(text: str) -> str:
    return re.sub(r'[ \t]+', ' ', text).strip()


def detect_code(page_text: str):
    """Devuelve (parte, seccion, icao|None) detectados en la pagina."""
    head = page_text[:400]  # el codigo vive en el encabezado
    m = OACI_RE.search(head)
    if not m:
        return None, None, None
    part = m.group(1).upper()
    section = m.group(2)
    icao = None
    if part == 'AD':
        mi = ICAO_RE.search(page_text[:600])
        if mi:
            icao = mi.group(1)
    return part, section, icao


def main(pdf_path: str):
    reader = PdfReader(pdf_path)
    n = len(reader.pages)
    print(f'Procesando {n} páginas...', file=sys.stderr)

    # tree[part][section] = { paginas:[...], icaos:set, texto_muestra }
    tree = {}
    pages_meta = []

    for i, page in enumerate(reader.pages):
        txt = page.extract_text() or ''
        part, section, icao = detect_code(txt)
        pages_meta.append({
            'page': i,
            'part': part,
            'section': section,
            'icao': icao,
            'chars': len(txt),
        })
        if not part:
            continue
        tree.setdefault(part, {})
        node = tree[part].setdefault(section, {
            'code': f'{part} {section}',
            'pages': [],
            'icaos': set(),
        })
        node['pages'].append(i)
        if icao:
            node['icaos'].add(icao)

        if (i + 1) % 100 == 0:
            print(f'  ...{i+1}/{n}', file=sys.stderr)

    # Construir arbol ordenado y serializable
    out_tree = []
    for part in ['GEN', 'ENR', 'AD']:
        if part not in tree:
            continue
        sections = []
        for sec_code in sorted(tree[part], key=lambda s: [int(x) for x in s.split('.')]):
            node = tree[part][sec_code]
            sections.append({
                'code': node['code'],
                'section': sec_code,
                'page_start': node['pages'][0],
                'page_end': node['pages'][-1],
                'page_count': len(node['pages']),
                'aerodromes': sorted(node['icaos']),
            })
        out_tree.append({
            'part': part,
            'name': PART_NAMES[part],
            'section_count': len(sections),
            'sections': sections,
        })

    result = {
        'source': 'AIP Chile Vol. I',
        'total_pages': n,
        'tree': out_tree,
        'pages': pages_meta,
    }

    out_path = os.path.join('data', 'index_vol1.json')
    os.makedirs('data', exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # Resumen legible
    print('\n=== ÁRBOL DE ÍNDICES DETECTADO ===', file=sys.stderr)
    for part in out_tree:
        print(f"\n{part['name']} — {part['section_count']} secciones", file=sys.stderr)
        for s in part['sections'][:8]:
            ad = f" [{len(s['aerodromes'])} AD: {', '.join(s['aerodromes'][:6])}...]" if s['aerodromes'] else ''
            print(f"  {s['code']:12} pág {s['page_start']:>3}-{s['page_end']:<3} ({s['page_count']}p){ad}", file=sys.stderr)
        if part['section_count'] > 8:
            print(f"  ... y {part['section_count']-8} más", file=sys.stderr)

    return result


if __name__ == '__main__':
    main(sys.argv[1])
