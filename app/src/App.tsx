import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from './icons'
import { loadAerodrome, loadCharts } from './data'
import type { Aerodrome, ChartCatalog } from './types'
import { Aerodromo } from './screens/Aerodromo'
import { Cartas } from './screens/Cartas'
import { Notams } from './screens/Notams'

type Screen = 'ad' | 'ct' | 'no'
const ICAO = 'SCEL'

function parseHash(): { screen: Screen; chart: string | null } {
  const h = location.hash.replace(/^#\/?/, '')
  const [seg, sub] = h.split('/')
  if (seg === 'cartas') return { screen: 'ct', chart: sub || null }
  if (seg === 'notams') return { screen: 'no', chart: null }
  return { screen: 'ad', chart: null }
}

const TITLES: Record<Screen, string> = { ad: 'Aeródromos', ct: 'Cartas', no: 'NOTAMs' }

function Brandmark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-label="IFIS">
      <rect x="1" y="1" width="32" height="32" rx="7" fill="#0F131C" stroke="#00A3FF" strokeWidth="1.5" />
      <path d="M17 6 L25 26 L17 21 L9 26 Z" fill="#00A3FF" />
      <circle cx="17" cy="17" r="2.2" fill="#0A0E16" />
    </svg>
  )
}

export function App() {
  const [route, setRoute] = useState(parseHash())
  const [ad, setAd] = useState<Aerodrome | null>(null)
  const [cat, setCat] = useState<ChartCatalog | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [utc, setUtc] = useState('--:--z')
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    Promise.all([loadAerodrome(ICAO), loadCharts(ICAO)])
      .then(([a, c]) => { setAd(a); setCat(c) })
      .catch(e => setError(String(e.message || e)))
  }, [])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setUtc(String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0') + 'z')
    }
    tick(); const id = setInterval(tick, 10000); return () => clearInterval(id)
  }, [])

  const nav = useCallback((s: Screen) => { location.hash = s === 'ad' ? '#/' : s === 'ct' ? '#/cartas' : '#/notams' }, [])
  const openChart = useCallback((code: string) => { location.hash = `#/cartas/${code}` }, [])
  const closeChart = useCallback(() => { location.hash = '#/cartas' }, [])

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 1200)
  }, [])

  const { screen, chart } = route

  const navItems: { s: Screen | 'en'; ic: string; label: string }[] = [
    { s: 'ad', ic: 'plane', label: 'AERÓDROMOS' },
    { s: 'ct', ic: 'map', label: 'CARTAS' },
    { s: 'en', ic: 'route', label: 'ENROUTE' },
    { s: 'no', ic: 'alert', label: 'NOTAMS' },
  ]

  return (
    <div className="shell">
      <nav className="nav">
        <div className="brandmark"><Brandmark /></div>
        <div className="g">
          {navItems.map(it => (
            <button key={it.s} className={'navb tap' + (it.s === screen ? ' on' : '')}
              onClick={() => nav(it.s === 'en' ? 'ad' : (it.s as Screen))}>
              <Icon name={it.ic} /><span>{it.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <header className="header">
        <div className="hbar">
          <div className="brand">
            <span className="none" style={{ display: 'inline-flex' }}><Brandmark /></span>
            <div style={{ minWidth: 0 }}>
              <div className="k">AIP CHILE · IFIS</div>
              <div className="t">{TITLES[screen]}</div>
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <div className="pill clock"><Icon name="clock" size={13} color="var(--primary)" /><span>{utc}</span></div>
            <div className="pill airac"><span className="dot pulse" /><b>AIRAC 2409</b></div>
          </div>
        </div>
        <div className="disclaimer">
          <div className="in">
            <Icon name="info" size={13} />
            <span>PROTOTIPO · consulta/estudio · no reemplaza la fuente oficial certificada para navegación</span>
          </div>
        </div>
      </header>

      <main className="content">
        {error && <div className="loadscreen">Error cargando datos: {error}</div>}
        {!error && (!ad || !cat) && <div className="loadscreen">Cargando datos de {ICAO}…</div>}
        {ad && cat && (
          <div className="wrap">
            {screen === 'ad' && <Aerodromo ad={ad} charts={cat.charts} onOpenChart={openChart} onSeeAll={() => nav('ct')} onToast={toast} onNotams={() => nav('no')} />}
            {screen === 'ct' && <Cartas icao={ICAO} charts={cat.charts} selected={chart} onOpen={openChart} onClose={closeChart} />}
            {screen === 'no' && <Notams />}
          </div>
        )}
      </main>

      <div className={'toast' + (toastMsg ? ' show' : '')}>{toastMsg}</div>
    </div>
  )
}
