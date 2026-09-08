import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons'

/** Visor de carta: zoom (rueda/pinch/botones/doble-tap), pan y modo noche. */
export function ChartViewer({ src, alt }: { src: string; alt: string }) {
  const vpRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const v = useRef({ z: 1, x: 0, y: 0 })
  const [zoomLbl, setZoomLbl] = useState('100%')
  const [night, setNight] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)

  const apply = () => {
    const s = stageRef.current
    if (s) s.style.transform = `translate(${v.current.x}px,${v.current.y}px) scale(${v.current.z})`
    setZoomLbl(Math.round(v.current.z * 100) + '%')
  }
  const clamp = () => {
    const vp = vpRef.current!
    const w = vp.clientWidth, h = vp.clientHeight
    v.current.x = Math.min(0, Math.max(w - w * v.current.z, v.current.x))
    v.current.y = Math.min(0, Math.max(h - h * v.current.z, v.current.y))
  }
  const fit = () => { v.current = { z: 1, x: 0, y: 0 }; apply() }
  const zoom = (f: number, cx?: number, cy?: number) => {
    const vp = vpRef.current!
    const w = vp.clientWidth, h = vp.clientHeight
    if (cx == null) { cx = w / 2; cy = h / 2 }
    const nz = Math.min(6, Math.max(1, v.current.z * f))
    const k = nz / v.current.z
    v.current.x = cx - (cx - v.current.x) * k
    v.current.y = cy! - (cy! - v.current.y) * k
    v.current.z = nz
    clamp(); apply()
  }

  // reset al cambiar de carta
  useEffect(() => { setLoading(true); setErr(false); setNight(false); fit() }, [src])

  // gestos
  useEffect(() => {
    const vp = vpRef.current!
    let drag = false, px = 0, py = 0, pinch = 0
    const pt = (e: MouseEvent | Touch) => {
      const r = vp.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const down = (e: MouseEvent) => { drag = true; vp.classList.add('grab'); const p = pt(e); px = p.x; py = p.y }
    const move = (e: MouseEvent) => { if (!drag) return; const p = pt(e); v.current.x += p.x - px; v.current.y += p.y - py; px = p.x; py = p.y; clamp(); apply() }
    const up = () => { drag = false; vp.classList.remove('grab') }
    const wheel = (e: WheelEvent) => { e.preventDefault(); const p = pt(e); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y) }
    const dist = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
    const mid = (t: TouchList) => { const r = vp.getBoundingClientRect(); return { x: (t[0].clientX + t[1].clientX) / 2 - r.left, y: (t[0].clientY + t[1].clientY) / 2 - r.top } }
    const tstart = (e: TouchEvent) => { if (e.touches.length === 1) down(e.touches[0] as unknown as MouseEvent); else if (e.touches.length === 2) pinch = dist(e.touches) }
    const tmove = (e: TouchEvent) => {
      if (e.touches.length === 2) { e.preventDefault(); const d = dist(e.touches), c = mid(e.touches); if (pinch) zoom(d / pinch, c.x, c.y); pinch = d }
      else move(e.touches[0] as unknown as MouseEvent)
    }
    const tend = (e: TouchEvent) => { if (e.touches.length === 0) { up(); pinch = 0 } }
    const dbl = (e: MouseEvent) => { const p = pt(e); zoom(v.current.z > 1 ? 1 / v.current.z : 2, p.x, p.y) }
    vp.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    vp.addEventListener('wheel', wheel, { passive: false })
    vp.addEventListener('touchstart', tstart, { passive: true })
    vp.addEventListener('touchmove', tmove, { passive: false })
    vp.addEventListener('touchend', tend)
    vp.addEventListener('dblclick', dbl)
    return () => {
      vp.removeEventListener('mousedown', down); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up)
      vp.removeEventListener('wheel', wheel); vp.removeEventListener('touchstart', tstart); vp.removeEventListener('touchmove', tmove)
      vp.removeEventListener('touchend', tend); vp.removeEventListener('dblclick', dbl)
    }
  }, [])

  return (
    <div className={'viewport' + (night ? ' night' : '')} ref={vpRef}>
      <div className="stage" ref={stageRef}>
        <img src={src} alt={alt} draggable={false}
          onLoad={() => { setLoading(false); fit() }}
          onError={() => { setLoading(false); setErr(true) }} />
      </div>
      {loading && <div className="loading">Cargando carta…</div>}
      {err && <div className="loading">No se pudo cargar la carta.</div>}
      <div className="rail">
        <button className="p tap" onClick={() => zoom(1.35)} aria-label="Acercar"><Icon name="plus" /></button>
        <button className="tap" onClick={() => zoom(1 / 1.35)} aria-label="Alejar"><Icon name="minus" /></button>
        <button className={'tap' + (night ? ' p' : '')} onClick={() => setNight(n => !n)} aria-label="Modo noche"><Icon name="moon" /></button>
        <button className="tap" onClick={fit} aria-label="Ajustar"><Icon name="maximize" /></button>
      </div>
      <div className="scale">{zoomLbl}</div>
    </div>
  )
}
