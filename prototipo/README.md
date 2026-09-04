# Prototipo EFB — AIP Chile

Prototipo interactivo de la app (para la demostración de aprobación).
App de una sola página: **`index.html`** + las cartas en `data/charts/SCEL/`.

## Cómo verlo
Abre `prototipo/index.html` en cualquier navegador (desde el repo, para que
encuentre las cartas en `../data/charts/SCEL/`). No requiere servidor ni build:
**cero dependencias de runtime** — iconos SVG en línea y CSS propio con los
tokens de `design/DESIGN_SYSTEM.md`. Las fuentes Inter/JetBrains Mono se cargan
de Google Fonts si hay red, y degradan a las del sistema si no.

## Qué contiene
Tres pantallas navegables con la barra inferior:

1. **Aeródromos** — briefing de SCEL con **datos reales** del AIP Chile Vol. I
   (AD 2, AMDT 67): elevación, VAR MAG, altitud de transición, pistas,
   frecuencias (toca para copiar) y radioayudas. Fuente: `data/aerodromes/SCEL.json`.
2. **Cartas** — **navegador de las 54 cartas reales de SCEL** (IAC, SID, STAR,
   ADC, GMC, PDC, VAC) renderizadas del Vol. II (DGAC AMDT 103), con filtros por
   fase y miniaturas. El visor tiene **zoom/pan, doble-tap y modo noche**
   (invert para cabina). La ILS Z Rwy 17L además muestra franja de datos y
   mínimos reales (LOC IUEL 110.3, FINAL CRS 177°, CAT II/III).
3. **NOTAMs** — briefing operacional (datos de muestra).

## Datos y cartas (cómo se generan)
```bash
# 1) Renderiza las cartas de SCEL del Vol. II -> data/charts/SCEL/*.jpg + catalog.json
python pipeline/render_scel_charts.py source_pdfs/AIP_VOL_II_SCEL_full.pdf
# 2) Inyecta el catálogo dentro de index.html (marcador __CATALOG__)
python prototipo/build.py
```
Las cartas de SCEL se versionan en el repo (demo autocontenida); el resto de
`data/charts/` está en `.gitignore`. El PDF fuente no se versiona
(ver `docs/DATA_SOURCES.md`).

## Fidelidad de datos
- **Reales (del AIP):** briefing AD 2 de SCEL, las 54 cartas del Vol. II y los
  datos de la carta ILS Z 17L.
- **Muestra demo (etiquetada como tal):** METAR, NOTAM y radar — en producción
  vienen de feeds en vivo, no del PDF del AIP.

> ⚠️ PROTOTIPO — herramienta de consulta/estudio; no reemplaza la fuente
> oficial certificada para navegación.
