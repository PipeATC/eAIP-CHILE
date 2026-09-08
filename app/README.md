# AIP Chile EFB — PWA

Aplicación **PWA** (Progressive Web App) de la AIP Chile: instalable, offline y
responsive (teléfono / tablet / escritorio). Arranca con los datos reales de
**SCEL** ya extraídos del AIP (Vol. I AD 2 + 54 cartas del Vol. II).

Stack: **Vite + React + TypeScript + vite-plugin-pwa** (Workbox).

## Desarrollo
```bash
cd app
npm install
npm run dev        # http://localhost:5173  (predev sincroniza los datos)
```

## Build / preview
```bash
npm run build      # -> app/dist (con service worker + manifest)
npm run preview
```

Para servir bajo un subdirectorio (p. ej. GitHub Pages en `/eAIP-CHILE/`):
```bash
BASE_PATH=/eAIP-CHILE/ npm run build
```

## Datos
La fuente de verdad son los JSON/imágenes del repo en `/data`
(`data/aerodromes/SCEL.json`, `data/charts/SCEL/`). `npm run sync-data`
(automático en predev/prebuild) los copia a `app/public/` para que Vite los
sirva; ahí quedan **ignorados por git** (regenerables). Añadir un aeródromo =
añadir su JSON + cartas y volver a construir.

## Estructura
```
app/
├── index.html
├── vite.config.ts          # PWA: manifest, precache app shell + JSON,
│                           #      runtime-cache de las cartas (CacheFirst)
├── scripts/sync-data.mjs   # copia /data -> public/ (predev/prebuild)
├── public/icons/           # iconos PWA (versionados)
└── src/
    ├── main.tsx            # registra el service worker
    ├── App.tsx             # layout responsive + nav + routing por hash
    ├── theme.css           # tokens (design/DESIGN_SYSTEM.md) + responsive
    ├── types.ts  data.ts   # tipos + capa de datos (fetch)
    ├── icons.tsx           # iconos SVG en línea
    ├── components/ChartViewer.tsx   # zoom / pan / pinch / modo noche
    └── screens/            # Aerodromo · Cartas · Notams
```

## Características PWA
- **Instalable** (manifest + iconos 192/512/maskable).
- **Offline-first**: el service worker precachea el app shell + los JSON de
  datos; las cartas se cachean bajo demanda (CacheFirst) — quedan disponibles
  sin conexión tras verlas una vez.
- **Responsive**: nav inferior en móvil; riel lateral + doble columna en
  tablet/escritorio; visor de carta a pantalla dividida en anchos grandes.

> ⚠️ PROTOTIPO — herramienta de consulta/estudio; no reemplaza la fuente
> oficial certificada para navegación.
