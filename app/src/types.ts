// Tipos del dominio AIP Chile (SCEL como semilla).

export interface Runway {
  id: string
  brg_mag: string
  len_m: number
  wid_m: number
  sfc: string
  thr_elev_ft: number
  tora: number
  toda: number
  asda: number
  lda: number
  ils: string | null
}

export interface Frequency {
  service: string
  name: string
  freq: string
  hours?: string
  alt?: string[]
}

export interface Navaid {
  type: string
  id: string | null
  freq: string
  ch?: string
  rwy: string
  elev_ft?: number
  hours?: string
}

export interface AerodromeGeneral {
  arp: string
  ubicacion: string
  elevacion_ft: number
  elevacion_m: number
  temp_ref_c: number
  ondulacion_geoidal_m: number
  mag_var: string
  altitud_transicion_ft: number
  trafico: string
  clase_espacio: string
  arff_categoria: string
  operador: string
  combustible: string
  horas: string
}

export interface Aerodrome {
  icao: string
  iata: string
  name: string
  city: string
  fir: string
  source: string
  general: AerodromeGeneral
  runways: Runway[]
  frequencies: Frequency[]
  navaids: Navaid[]
}

export type ChartType = 'IAC' | 'SID' | 'STAR' | 'ADC' | 'GMC' | 'PDC' | 'VAC' | string

export interface Chart {
  code: string
  type: ChartType
  phase: string
  num: string
  rwy: string
  title: string
  file: string
}

export interface ChartCatalog {
  icao: string
  source: string
  count: number
  charts: Chart[]
}
