# Fuentes de datos

Los PDF de la AIP Chile NO se versionan en este repo (pesan ~226 MB juntos
y se actualizan cada ciclo AIRAC). Se obtienen del sistema IFIS de la DGAC:

- Portal IFIS: https://aipchile.dgac.gob.cl/
- Vol. I (CHILE): información general, en ruta y aeródromos.
- Vol. II (MAP): cartas aeronáuticas.

Coloca los archivos descargados en `source_pdfs/`:

```
source_pdfs/
├── AIP_VOL_I.pdf
└── AIP_VOL_II.pdf
```

Los scripts del pipeline aceptan la ruta del PDF como argumento, así que
los nombres exactos no importan mientras apuntes bien.

## Ediciones usadas en la demo inicial

- Vol. I: edición completa con AMDT 67 (SUP 02-26 y SUP 09-26).
- Vol. II: actualizado al 06-08-2026 (AMDT 103).
