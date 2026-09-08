import type { Aerodrome, ChartCatalog } from './types'

const BASE = import.meta.env.BASE_URL // respeta la ruta base de despliegue

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`)
  return res.json() as Promise<T>
}

export const loadAerodrome = (icao: string) =>
  getJSON<Aerodrome>(`data/aerodromes/${icao}.json`)

export const loadCharts = (icao: string) =>
  getJSON<ChartCatalog>(`charts/${icao}/catalog.json`)

export const chartUrl = (icao: string, file: string) => `${BASE}charts/${icao}/${file}`

/** Colores/orden por tipo de carta (design system: APP=violeta, etc.) */
export const TYPE_META: Record<string, { c: string; lbl: string }> = {
  IAC: { c: 'violet', lbl: 'APROX (IAC)' },
  SID: { c: 'primary', lbl: 'SALIDAS (SID)' },
  STAR: { c: 'emerald', lbl: 'LLEGADAS (STAR)' },
  ADC: { c: 'ink-2', lbl: 'AERÓDROMO (ADC)' },
  GMC: { c: 'ink-2', lbl: 'RODAJE (GMC)' },
  PDC: { c: 'ink-2', lbl: 'PARKING (PDC)' },
  VAC: { c: 'amber', lbl: 'VISUAL (VAC)' },
}
export const TYPE_ORDER = ['IAC', 'SID', 'STAR', 'ADC', 'GMC', 'PDC', 'VAC']

/**
 * Datos curados de la carta ILS Z Rwy 17L (SCEL IAC 1), leídos de la lámina
 * del Vol. II. El resto de cartas muestran solo la imagen (que ya contiene sus
 * datos). Cuando el pipeline extraiga mínimos por carta, esto vendrá del JSON.
 */
export const CURATED_CHART_DATA: Record<
  string,
  { strip: [string, string, string][]; minima: [string, string, string, string][]; note: string }
> = {
  IAC01: {
    strip: [
      ['LOC / CHN', '110.3', 'IUEL'],
      ['FINAL CRS', '177°', 'MAG'],
      ['APT ELEV', "1.555'", 'FT'],
      ['GP / TCH', "3° / 51'", 'D4.5'],
    ],
    minima: [
      ['ILS CAT II (RA100)', "1.650' (100')", 'RVR 350m', 'ink'],
      ['ILS CAT II (RA150)', "1.700' (150')", 'RVR 500m', 'ink'],
      ['ILS CAT III-A', '—', 'RVR 200m', 'emerald'],
      ['ILS CAT III-B', '—', 'RVR 50m', 'emerald'],
      ['FAIL PASSIVE *', "1.600' (50')", '—', 'ink'],
    ],
    note: "MSA 25 NM AMB 19.000' · ALT MNM 5.000' · Nivel de transición por ATC. * Aeronaves \"FAIL PASSIVE\". Requiere certificación especial DAN 06-02 / 06-12.",
  },
}
