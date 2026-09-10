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

function loadPinned(icao: string): string[] {
  try { const s = localStorage.getItem('aip.pinned.' + icao); return s ? JSON.parse(s) : [] } catch { return [] }
}

function Brandmark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-label="eAIP" style={{ flex: 'none' }}>
      <rect x="1" y="1" width="32" height="32" rx="8" fill="#0D3B85" stroke="#ffffff" strokeOpacity=".22" strokeWidth="1" />
      <path d="M17 7 L24 25 L17 20.5 L10 25 Z" fill="#ffffff" />
      <circle cx="17" cy="18" r="2" fill="#0D3B85" />
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
  const [pinned, setPinned] = useState<string[]>(() => loadPinned(ICAO))
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

  const togglePin = useCallback((codeToPin: string) => {
    setPinned(prev => {
      const next = prev.includes(codeToPin) ? prev.filter(c => c !== codeToPin) : [...prev, codeToPin]
      try { localStorage.setItem('aip.pinned.' + ICAO, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
    toast(pinned.includes(codeToPin) ? 'Carta desanclada' : 'Carta anclada')
  }, [pinned, toast])

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
        <div className="gov">
          <div className="in">
            <span><b>DGAC Chile</b> · Servicio de Información Aeronáutica</span>
            <span className="r"><span>{utc}</span><span>·</span><span className="g">AIRAC 2409</span></span>
          </div>
        </div>
        <div className="hbar">
          <div className="in">
            <div className="brand">
              <Brandmark />
              <div style={{ minWidth: 0 }}>
                <div className="wm">eAIP <span>CHILE</span></div>
                <div className="t">{TITLES[screen]} · EFB</div>
              </div>
            </div>
            <span className="pill vig"><span className="dot pulse" />VIGENTE</span>
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
            {screen === 'ad' && <Aerodromo ad={ad} charts={cat.charts} pinned={pinned} onOpenChart={openChart} onSeeAll={() => nav('ct')} onToast={toast} onNotams={() => nav('no')} />}
            {screen === 'ct' && <Cartas icao={ICAO} charts={cat.charts} selected={chart} pinned={pinned} onTogglePin={togglePin} onOpen={openChart} onClose={closeChart} />}
            {screen === 'no' && <Notams />}
          </div>
        )}
      </main>

      <div className={'toast' + (toastMsg ? ' show' : '')}>{toastMsg}</div>
    </div>
  )
}
