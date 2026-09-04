# Prototipo EFB — AIP Chile

Prototipo interactivo de la app (para la demostración de aprobación).
Un solo archivo autónomo: **`index.html`**. Ábrelo en el navegador del
teléfono o del escritorio.

## Cómo verlo
Abre `prototipo/index.html` en cualquier navegador. No requiere servidor,
build ni conexión: **cero dependencias de runtime** (iconos SVG en línea,
CSS propio con los tokens de `design/DESIGN_SYSTEM.md`, y la carta incrustada
como data URI). Las fuentes Inter/JetBrains Mono se cargan de Google Fonts si
hay red, y degradan a las del sistema si no.

## Regenerar (build)
La imagen de la carta va **incrustada** en `index.html` para que sea un único
archivo. Para regenerarla tras renderizar cartas nuevas:

```bash
python prototipo/build.py   # inyecta data/charts/SCEL/*.png como data URIs
```

Render de una carta desde el PDF del Vol. II (ver `docs/DATA_SOURCES.md`):
`pypdfium2` → PNG en `data/charts/SCEL/`.

## Qué contiene
Tres pantallas navegables con la barra inferior:

1. **Aeródromos** — briefing de SCEL con **datos reales** extraídos del
   AIP Chile Vol. I (AD 2, AMDT 67): elevación, VAR MAG, altitud de
   transición, pistas, frecuencias (toca para copiar) y radioayudas.
2. **Cartas** — visor de la **carta real ILS Z Rwy 17L** (SCEL IAC 1, DGAC
   AMDT 103), renderizada del Vol. II, con zoom/pan, doble-tap y modo
   noche (invert). Franja de datos y mínimos **reales** de la carta
   (LOC IUEL 110.3, FINAL CRS 177°, CAT II/III).
3. **NOTAMs** — briefing operacional (datos de muestra).

## Fidelidad de datos
- **Reales (del AIP):** todo el briefing AD 2 de SCEL y los datos de la
  carta ILS 17L. Fuente: `data/aerodromes/SCEL.json`.
- **Muestra demo (etiquetada como tal):** METAR, NOTAM y radar — en
  producción vienen de feeds en vivo, no del PDF del AIP.

> ⚠️ PROTOTIPO — herramienta de consulta/estudio; no reemplaza la fuente
> oficial certificada para navegación.
