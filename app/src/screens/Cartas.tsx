import { useState } from 'react'
import { Icon } from '../icons'
import { ChartViewer } from '../components/ChartViewer'
import { chartUrl, TYPE_META, TYPE_ORDER, CURATED_CHART_DATA } from '../data'
import type { Chart } from '../types'

export function Cartas({ icao, charts, selected, pinned, onTogglePin, onOpen, onClose }: {
  icao: string
  charts: Chart[]
  selected: string | null
  pinned: string[]
  onTogglePin: (code: string) => void
  onOpen: (code: string) => void
  onClose: () => void
}) {
  const [filter, setFilter] = useState<string | null>(null)
  const counts: Record<string, number> = {}
  charts.forEach(c => { counts[c.type] = (counts[c.type] || 0) + 1 })
  const chart = selected ? charts.find(c => c.code === selected) : null

  if (chart) {
    const tm = TYPE_META[chart.type] || { c: 'ink-2' }
    const extra = CURATED_CHART_DATA[chart.code]
    return (
      <>
        <div className="ct-head">
          <button className="ct-back tap" onClick={onClose} aria-label="Volver"><Icon name="arrowleft" /></button>
          <span className={'ct-app c-' + tm.c}>{chart.type}</span>
          <div className="grow" style={{ minWidth: 0 }}>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              <span className="ct-title">{icao} / SCL</span>
              <span className="ct-proc">{chart.title}</span>
            </div>
            <div className="ct-meta">
              <span>{icao} {chart.code}</span><span className="d">·</span>
              <span>DGAC AMDT 103</span><span className="d">·</span><span className="sup">06 AGO 2026</span>
            </div>
          </div>
          <button className={'pin-btn tap' + (pinned.includes(chart.code) ? ' on' : '')}
            onClick={() => onTogglePin(chart.code)} aria-label="Anclar carta" title="Anclar a Aeródromos">
            <Icon name="pushpin" size={18} fill={pinned.includes(chart.code) ? 1 : 0} />
          </button>
        </div>

        <div className="viewer-split">
          <ChartViewer src={chartUrl(icao, chart.file)} alt={`${chart.title} — ${icao} ${chart.code}`} code={chart.code} />

          <div>
            {extra && (
              <>
                <div className="strip">
                  {extra.strip.map(([l, v, u]) => (
                    <div className="it" key={l}><div className="l">{l}</div>
                      <div className="row2"><span className="v">{v}</span><span className="u">{u}</span></div></div>
                  ))}
                </div>
                <div className="sec">
                  <div className="sec-head"><Icon name="ruler" /><h2>MÍNIMOS DE ATERRIZAJE</h2><span className="r">QNH · RWY {chart.rwy}</span></div>
                  <div className="minima">
                    <div className="hd"><div>PROC</div><div>DA(H)</div><div>RVR/VIS</div></div>
                    {extra.minima.map(([p, da, rvr, col]) => (
                      <div className="rw" key={p}>
                        <div className="p" style={{ color: `var(--${col})` }}>{p}</div>
                        <div className="da">{da}</div><div className="rvr">{rvr}</div>
                      </div>
                    ))}
                  </div>
                  <p className="note">{extra.note}</p>
                </div>
              </>
            )}
            <div className="dbcard">
              <Icon name="database" size={22} color="var(--emerald)" />
              <div style={{ minWidth: 0 }}>
                <div className="t">Base de Datos AIP Chile · AIRAC 2409</div>
                <div className="d">Carta real renderizada del Vol. II (DGAC AMDT 103)</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const list = charts.filter(c => !filter || c.type === filter)
  return (
    <>
      <div className="browser-head">
        <div className="row">
          <span className="ct-app c-violet">{icao}</span>
          <div className="grow"><h2>Cartas de {icao}</h2>
            <div className="sub">{charts.length} cartas · AIP Chile Vol. II · AMDT 103</div></div>
        </div>
      </div>
      <div className="scroll-x" style={{ marginTop: 12 }}>
        <button className={'cat tap' + (filter == null ? ' on' : '')} onClick={() => setFilter(null)}>TODAS <span className="n">{charts.length}</span></button>
        {TYPE_ORDER.filter(t => counts[t]).map(t => (
          <button key={t} className={'cat tap' + (filter === t ? ' on' : '')} onClick={() => setFilter(t)}>
            {(TYPE_META[t] || { lbl: t }).lbl} <span className="n">{counts[t]}</span>
          </button>
        ))}
      </div>
      <div className="chartgrid">
        {list.map(c => {
          const tm = TYPE_META[c.type] || { c: 'ink-2' }
          return (
            <button key={c.code} className={'cardc tap c-' + tm.c} onClick={() => onOpen(c.code)}>
              <div className="thumb">
                <span className="bd">{c.type}{c.num ? ' ' + c.num : ''}</span>
                <img loading="lazy" alt={c.title} src={chartUrl(icao, c.file)} />
              </div>
              <div className="cap"><div className="t">{c.title}</div>
                <div className="s">{icao} {c.code}{c.rwy ? ' · RWY ' + c.rwy : ''}</div></div>
            </button>
          )
        })}
      </div>
    </>
  )
}
