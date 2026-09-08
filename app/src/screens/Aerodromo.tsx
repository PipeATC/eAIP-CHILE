import { Icon } from '../icons'
import { TYPE_META, TYPE_ORDER } from '../data'
import type { Aerodrome, Chart, Frequency } from '../types'

function freqLabel(f: Frequency): string {
  const n = (f.name || '').toLowerCase()
  switch (f.service) {
    case 'ATIS': return n.includes('desp') ? 'ATIS DEP' : 'ATIS ARR'
    case 'TWR': return n.includes('secund') ? 'TORRE (TWR) 2' : 'TORRE (TWR)'
    case 'GND': return n.includes(' w') || n.includes('oeste') ? 'RODAJE W (GND)' : 'RODAJE E (GND)'
    case 'APP': return 'APROX (APP)'
    case 'DLVRY': return 'AUTORIZ (CLR)'
    case 'INFO': return 'INFO'
    default: return f.service
  }
}

const OTHER_ADS = [['SCFA', 'ANF'], ['SCCF', 'CJC'], ['SCTE', 'PMC'], ['SCIE', 'CCP']]

export function Aerodromo({ ad, charts, onOpenChart, onSeeAll, onToast, onNotams }: {
  ad: Aerodrome
  charts: Chart[]
  onOpenChart: (code: string) => void
  onSeeAll: () => void
  onToast: (m: string) => void
  onNotams: () => void
}) {
  const g = ad.general
  const tiles: [string, string, string][] = [
    ['ELEVACIÓN', g.elevacion_ft.toLocaleString('es-CL'), 'FT'],
    ['VAR MAG', g.mag_var.replace(' (2022)', ''), '2022'],
    ['ALT TRANS', g.altitud_transicion_ft.toLocaleString('es-CL'), 'FT'],
    ['TEMP REF', String(g.temp_ref_c), '°C'],
    ['ARFF', g.arff_categoria, 'SEI'],
    ['COMBUSTIBLE', g.combustible, g.horas],
  ]
  const counts: Record<string, number> = {}
  charts.forEach(c => { counts[c.type] = (counts[c.type] || 0) + 1 })
  const featured = ['IAC01', 'IAC09', 'SID05', 'STAR06', 'ADC01']
    .map(code => charts.find(c => c.code === code)).filter(Boolean) as Chart[]

  const copy = (f: string) => {
    navigator.clipboard?.writeText(f).catch(() => {})
    onToast(`Copiado  ${f}  MHz`)
  }

  const maxRwy = ad.runways.reduce((a, r) => Math.max(a, r.len_m), 0)
  const minWid = Math.min(...ad.runways.map(r => r.wid_m))

  return (
    <>
      <div className="search">
        <Icon name="search" />
        <input defaultValue={ad.icao} placeholder="Buscar aeródromo, VOR o fix…" />
      </div>
      <div className="scroll-x" style={{ marginTop: 10 }}>
        <button className="chip on tap"><Icon name="pin" size={13} />{ad.icao}</button>
        {OTHER_ADS.map(([ic, ia]) => (
          <button key={ic} className="chip tap" onClick={() => onToast('Solo SCEL disponible en esta fase')}>{ic} <span className="s">{ia}</span></button>
        ))}
      </div>

      <div className="grid-2">
        <div>
          <div className="hero">
            <div className="bg" />
            <div className="in">
              <div className="between">
                <div className="st"><Icon name="check" size={13} />AIP ACTIVO · AD 2 · AMDT 67</div>
                <button className="ico-btn tap" aria-label="Favorito"><Icon name="star" /></button>
              </div>
              <div className="row" style={{ alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
                <h1 style={{ fontFamily: 'var(--mono)' }}>{ad.icao}</h1>
                <span className="mono" style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 700, marginBottom: 2 }}>{ad.iata}</span>
              </div>
              <div className="sub1">{ad.name.toUpperCase()}</div>
              <div className="sub2">{ad.city.toUpperCase()} · FIR {ad.fir} · {g.ubicacion.split('·')[0].toUpperCase()}</div>
            </div>
          </div>

          <div className="tiles">
            {tiles.map(([l, v, u]) => (
              <div className="tile" key={l}><div className="l">{l}</div><div className="v">{v}</div><div className="u">{u}</div></div>
            ))}
          </div>

          <div className="rwybox">
            <div>
              <div className="l">PISTAS DECLARADAS</div>
              <div className="v">{ad.runways.map(r => r.id).join(' · ')}</div>
              <div className="d">Paralelas · ASPH · máx {maxRwy.toLocaleString('es-CL')} × {minWid} m</div>
            </div>
            <Icon name="plane" size={32} color="rgba(0,163,255,.8)" />
          </div>

          <div className="sec">
            <div className="sec-head"><Icon name="wind" /><h2>METAR &amp; CONDICIONES</h2><span className="tag demo" style={{ marginLeft: 'auto' }}>MUESTRA DEMO</span></div>
            <div className="metar"><p>SCEL 041800Z 18012KT 9999 FEW030 21/08 Q1016 NOSIG</p></div>
          </div>
        </div>

        <div>
          <div className="sec" style={{ marginTop: 0 }}>
            <div className="sec-head"><Icon name="radio" /><h2>FRECUENCIAS</h2><span className="r">TOCA PARA COPIAR</span></div>
            <div className="freqs">
              {ad.frequencies.map((f, i) => (
                <button className="freq tap" key={i} onClick={() => copy(f.freq)}>
                  <div className="top"><div className="l">{freqLabel(f)}</div><Icon name="copy" className="cp" size={15} /></div>
                  <div className="v">{f.freq}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="sec">
            <button className="warnbtn tap" onClick={onNotams}>
              <Icon name="alert" size={26} />
              <div style={{ minWidth: 0 }}>
                <div className="k">NOTAM A1428/24 · CRÍTICO <span className="z">· DEMO</span></div>
                <div className="t trunc">RWY 17R/35L CLSD DUE TO MAINT WIP</div>
              </div>
              <Icon name="chevron" className="go" size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="sec">
        <div className="sec-head"><Icon name="map" /><h2>CARTAS AERONÁUTICAS</h2>
          <button className="linkbtn r tap" onClick={onSeeAll} style={{ marginLeft: 'auto' }}>VER TODAS ({charts.length}) ›</button></div>
        <div className="scroll-x">
          <button className="cat on tap">TODAS <span className="n">{charts.length}</span></button>
          {TYPE_ORDER.filter(t => counts[t]).map(t => (
            <button key={t} className="cat tap" onClick={onSeeAll}>{t} <span className="n">{counts[t]}</span></button>
          ))}
        </div>
        <div className="charts">
          {featured.map((c, i) => {
            const tm = TYPE_META[c.type] || { c: 'ink-2' }
            return (
              <button key={c.code} className={'chart tap c-' + tm.c} onClick={() => onOpenChart(c.code)}>
                <span className="badge">{c.type}</span>
                <div className="grow"><div className="t trunc">{c.title}</div><div className="s trunc">SCEL {c.code}{c.rwy ? ' · RWY ' + c.rwy : ''}</div></div>
                {i === 0 && <Icon name="pushpin" className="pin" size={16} />}
                <Icon name="chevron" className="go" size={18} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
