# eAIP-CHILE

Aplicación digital de la **AIP Chile** (Publicación de Información
Aeronáutica de la DGAC). Convierte los dos PDF de la AIP en una app
navegable estilo **EFB / Navigraph Charts**: el Vol. I organizado en un
árbol de índices OACI con búsqueda, y las cartas del Vol. II en un visor
interactivo con zoom/pan y modo día-noche.

> Estado: **demostración de viabilidad**. Ver [`CLAUDE.md`](CLAUDE.md) para
> el contexto completo y el roadmap.
>
> ⚠️ Herramienta de consulta/estudio. **No reemplaza la fuente oficial
> certificada** para navegación.

## Estructura

```
.
├── CLAUDE.md              # Contexto del proyecto (léelo primero)
├── requirements.txt       # Dependencias del pipeline
├── pipeline/             # Ingesta y extracción de los PDF
│   ├── extract_vol1.py   # Vol. I  -> árbol OACI  (data/index_vol1.json)
│   └── catalog_vol2.py   # Vol. II -> catálogo de cartas (data/catalog_vol2.json)
├── data/                 # Salidas del pipeline (JSON generados)
├── demo/
│   └── aip_chile_demo.html   # Demo de escritorio autónoma
├── design/               # Sistema de diseño de la app
│   ├── DESIGN_SYSTEM.md
│   └── mockups/          # Pantallas de referencia (HTML + PNG)
└── docs/
    └── DATA_SOURCES.md   # Cómo obtener los PDF fuente
```

## Uso rápido

1. Coloca los PDF de la AIP en `source_pdfs/` (ver [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md)).
2. Instala dependencias: `pip install -r requirements.txt`
3. Genera los índices (la salida va a `data/`):

   ```bash
   python pipeline/extract_vol1.py source_pdfs/AIP_VOL_I.pdf
   python pipeline/catalog_vol2.py source_pdfs/AIP_VOL_II.pdf
   ```

4. Abre `demo/aip_chile_demo.html` en el navegador para ver la demo actual.

## Diseño

`design/DESIGN_SYSTEM.md` define el lenguaje visual (EFB oscuro avionics-grade)
y `design/mockups/` tiene las pantallas de referencia: briefing de aeródromo,
visor de cartas y NOTAMs/Suplementos.

## Roadmap

Ver [`CLAUDE.md`](CLAUDE.md). En resumen: completar extracción de contenido y
tablas → backend FastAPI + búsqueda → app React Native + Expo → automatización
AIRAC.
