# AIP Chile — Aplicación digital (eAIP-CHILE)

Contexto para Claude Code. Lee esto antes de trabajar en el repo.

## Qué es

Convertir la **AIP Chile** (Publicación de Información Aeronáutica de la
DGAC), que hoy se distribuye como dos PDF enormes, en una aplicación
navegable tipo **EFB / Navigraph Charts**:

- **Vol. I** (GEN / ENR / AD): contenido reorganizado en un **árbol de
  índices OACI** con búsqueda directa.
- **Vol. II** (cartas: SID / STAR / IAC / ADC / etc.): visor interactivo
  con zoom/pan y modo día-noche.

El usuario trabaja en la DGAC. La fase actual es una **demostración**
para conseguir aprobación de desarrollo. No es todavía un producto
público. La automatización de ciclos AIRAC queda para una fase posterior.

> **Este repo (`eAIP-CHILE`) es el hogar canónico del proyecto.** Reúne el
> pipeline de ingesta, los datos generados, la demo de viabilidad y el
> sistema de diseño de la app.

## Estructura del repo

```
.
├── CLAUDE.md                 # Este archivo (léelo primero)
├── README.md                 # Descripción y uso rápido
├── requirements.txt          # Dependencias del pipeline (Python)
├── pipeline/                 # Ingesta y extracción de los PDF
│   ├── extract_vol1.py       # Vol. I  -> árbol OACI  (data/index_vol1.json)
│   └── catalog_vol2.py       # Vol. II -> catálogo de cartas (data/catalog_vol2.json)
├── data/                     # Salidas del pipeline (JSON generados, versionados)
│   ├── index_vol1.json
│   └── catalog_vol2.json
├── demo/
│   └── aip_chile_demo.html   # Demo de escritorio autónoma (prueba de viabilidad)
├── design/                   # Sistema de diseño de la app (EFB oscuro)
│   ├── DESIGN_SYSTEM.md       # Tokens, paleta, tipografía, componentes
│   └── mockups/              # Pantallas de referencia (Stitch): HTML + PNG
│       ├── aerodromo_briefing/   # Briefing de aeródromo (SCEL)
│       ├── visor_cartas/         # Visor de carta (ILS Z RWY 17L)
│       └── notams_suplementos/   # NOTAMs + Suplementos AIP
├── prototipo/                # Prototipo interactivo (demo de aprobación)
│   └── index.html            # App autónoma, 3 pantallas, sin deps de runtime
└── docs/
    └── DATA_SOURCES.md       # Cómo obtener los PDF fuente
```

## Estado actual (lo que ya funciona)

Prueba de viabilidad lograda sobre las ediciones reales de ambos volúmenes:

1. **`pipeline/extract_vol1.py`** — recorre las 993 páginas del Vol. I,
   detecta el código OACI del encabezado de cada página
   (regex `(GEN|ENR|AD) \d+(\.\d+)?`) y reconstruye el árbol:
   29 secciones GEN, 59 ENR, secciones AD, con mapeo de qué aeródromos
   (ICAO `SC[A-Z]{2}`) viven en cada sección. Salida: `data/index_vol1.json`.

2. **`pipeline/catalog_vol2.py`** — recorre las 927 cartas del Vol. II,
   detecta ICAO + tipo de carta + pista por página, agrupa por aeródromo
   (38 aeródromos, ej. SCEL con 90 cartas). Salida: `data/catalog_vol2.json`.

3. **`demo/aip_chile_demo.html`** — app demo autónoma de escritorio: árbol
   navegable con color por parte, búsqueda instantánea, vista de aeródromo
   con filtro por fase de vuelo, y visor de cartas con zoom/pan/modo noche.
   Solo embebe las imágenes de SCEL para pesar poco (~1 MB).

4. **`prototipo/index.html`** — prototipo mobile EFB de las 3 pantallas
   (Aeródromos / Cartas / NOTAMs) sobre el sistema de diseño. **Autocontenido:
   CSS propio + iconos SVG en línea, cero dependencias de runtime** (no
   Tailwind CDN — se descartó porque colapsaba offline/con red flaky). El
   briefing de SCEL usa datos **reales** del AD 2 (`data/aerodromes/SCEL.json`),
   extraídos con `pdfplumber` del Vol. I. La imagen de la carta queda pendiente
   del render del Vol. II.

### Datos de aeródromo (AD 2)
- `data/aerodromes/SCEL.json` — datos AD 2 reales de SCEL (general, pistas +
  distancias declaradas, frecuencias, radioayudas), verificados contra el PDF
  del Vol. I (AMDT 67). Generalizar a los 38 aeródromos es trabajo de Fase 1.
- Entorno: `pdfplumber`/`pypdf` requieren reparar cffi
  (`pip install --break-system-packages --force-reinstall cffi`); para render
  usar `pypdfium2` (wheel autocontenido) — `poppler-utils` no está disponible.

## Sistema de diseño

`design/DESIGN_SYSTEM.md` define el lenguaje visual objetivo: **EFB
avionics-grade oscuro** optimizado para cabina y baja luz, densidad de
información alta, tipografía dual (Inter para interfaz, JetBrains Mono para
datos operacionales) y color por función:

- **Cian nav** `#00A3FF` — navegación, acción primaria, rutas/estados activos.
- **Esmeralda** `#10B981` — verificado / OK / activo.
- **Ámbar** `#F59E0B` — precaución, NOTAM advisory.
- **Rojo** `#EF4444` — crítico / prohibido / cerrado / vencido.

`design/mockups/` tiene 3 pantallas de referencia (HTML + captura): briefing
de aeródromo, visor de cartas y NOTAMs/Suplementos. Son maquetas Stitch
(Tailwind CDN + tokens Material 3); úsalas como referencia visual, no como
código de producción.

Notas de estética al implementar (acordadas con el usuario):
- Los mockups usan el pastel M3 `#98cbff` para "primary"; preferir el cian
  eléctrico `#00A3FF` del DESIGN_SYSTEM para mayor contraste en acciones/enlaces.
- Reemplazar el logo IFIS alojado externamente por un wordmark vectorial local.
- Los tokens de color van como variables de tema para poder reajustar la
  paleta fácilmente.

## Roadmap

### Fase 1 — Completar el pipeline de datos (Python)
- **Extracción de contenido, no solo estructura.** Hoy el extractor arma el
  árbol pero no extrae el texto/tablas *dentro* de cada sección. Añadir
  `pdfplumber` (texto por posición) y `camelot` (tablas: frecuencias,
  coordenadas, navaids) sobre el rango de páginas de cada sección. El
  contenido AD 2 (datos de aeródromo) es la prioridad.
- **Render de todas las cartas.** Generalizar el render (hoy manual para
  SCEL) a los 38 aeródromos: `pdftoppm -r 150` o superior, o tiles para
  zoom sin pérdida. Guardar catalogadas por ICAO+tipo en `data/charts/`.
- **Afinar detección de títulos de carta.** El texto vectorial de Illustrator
  sale desordenado; usar posición (bbox) en vez de orden de lectura.
- **Contenido bilingüe.** La AIP es ES/EN; preservar ambos idiomas al extraer.

### Fase 2 — Backend + búsqueda
- API ligera (**FastAPI**, encaja con el pipeline en Python) sirviendo el
  contenido estructurado.
- Motor de búsqueda full-text: **Typesense** o **MeiliSearch** (por ICAO,
  frecuencia, procedimiento). Alternativa ligera/offline: SQLite FTS5.
- Copia local en dispositivo (SQLite) para **consulta offline** —
  diferenciador clave frente a consultar IFIS directo.

### Fase 3 — App multiplataforma
- **Stack fijado: React Native + Expo** (iOS + Android + web, una sola base).
- Componentes: árbol de navegación OACI, buscador global, vista por aeródromo,
  visor de cartas (zoom/pan sobre tiles, pinboard por fase, día/noche, anotaciones).
- **Fuera del MVP:** georreferenciado de cartas sobre mapa móvil (la DGAC no
  publica datos de georreferencia; sería trabajo manual grande).

### Fase 4 — Actualización AIRAC (post-aprobación)
- Automatizar descarga desde IFIS por ciclo (28 días) y re-ingesta.
- Sin esto, un producto en producción tendría datos vencidos = pasivo legal.

## Convenciones técnicas

- Python: usar `pip install --break-system-packages` en este entorno.
- Estructura OACI estándar: el árbol se deriva de la numeración, no se
  hardcodea. Si aparece una sección nueva, el extractor debe recogerla sola.
- Los scripts escriben su salida en `data/`. Aceptan la ruta del PDF como
  argumento.
- Los PDF fuente NO están en el repo (pesan ~226 MB juntos). El usuario los
  provee localmente; ver `docs/DATA_SOURCES.md`.

## Notas de contexto / cuidado

- **Respaldo institucional:** como esto va hacia producto público, cuando pase
  de demo a desarrollo aprobado conviene dejar por escrito la autorización de
  la DGAC para redistribuir el contenido. Protege al proyecto.
- **Uso real vs. referencia:** dejar explícito en la app que es herramienta de
  consulta/estudio y **no reemplaza la fuente oficial certificada** para
  navegación. Marcar las maquetas/demos como PROTOTIPO.
