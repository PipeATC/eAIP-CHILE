import { useEffect, useRef, useState } from 'react'
import { Icon } from '../icons'

/** Un trazo de anotación, en coordenadas normalizadas 0..1 sobre la carta. */
type Stroke = { color: string; size: number; erase: boolean; pts: [number, number][] }

// Notas por carta (memoria de sesión + localStorage) para que sobrevivan al
// cambiar de carta y a recargas.
const noteStore = new Map<string, Stroke[]>()
function loadNotes(code: string): Stroke[] {
  if (noteStore.has(code)) return noteStore.get(code)!
  let v: Stroke[] = []
  try { const s = localStorage.getItem('aip.notes.' + code); if (s) v = JSON.parse(s) } catch { /* ignore */ }
  noteStore.set(code, v)
  return v
}
function saveNotes(code: string, strokes: Stroke[]) {
  noteStore.set(code, strokes)
  try { localStorage.setItem('aip.notes.' + code, JSON.stringify(strokes)) } catch { /* ignore */ }
}

const COLORS = ['#00A3FF', '#F59E0B', '#EF4444', '#10B981', '#F1F5FB']

/** Visor de carta: ajuste a pantalla, zoom/pan, pantalla completa, modo noche
 *  y scratchpad para anotar con lápiz o dedo. */
export function ChartViewer({ src, alt, code }: { src: string; alt: string; code: string }) {
  const vpRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const v = useRef({ z: 1, x: 0, y: 0, fit: 1, baseW: 1, baseH: 1 })
  const [zoomLbl, setZoomLbl] = useState('100%')
  const [night, setNight] = useState(false)
  const [full, setFull] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)

  const [draw, setDraw] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [erase, setErase] = useState(false)
  const [hasNotes, setHasNotes] = useState(false)
  // refs espejo para leer estado dentro de handlers estables
  const drawRef = useRef(draw); drawRef.current = draw
  const colorRef = useRef(color); colorRef.current = color
  const eraseRef = useRef(erase); eraseRef.current = erase
  const strokesRef = useRef<Stroke[]>([])

  const apply = () => {
    const s = stageRef.current
    if (s) s.style.transform = `translate(${v.current.x}px,${v.current.y}px) scale(${v.current.z})`
    setZoomLbl(Math.round((v.current.z / v.current.fit) * 100) + '%')
  }
  const clamp = () => {
    const vp = vpRef.current!
    const cw = v.current.baseW * v.current.z, ch = v.current.baseH * v.current.z
    v.current.x = cw <= vp.clientWidth ? (vp.clientWidth - cw) / 2 : Math.min(0, Math.max(vp.clientWidth - cw, v.current.x))
    v.current.y = ch <= vp.clientHeight ? (vp.clientHeight - ch) / 2 : Math.min(0, Math.max(vp.clientHeight - ch, v.current.y))
  }
  // Recalcula el tamaño base para que la carta entera quepa (contain) y centra.
  const measure = () => {
    const vp = vpRef.current, img = imgRef.current
    if (!vp || !img || !img.naturalWidth) return
    const aspect = img.naturalHeight / img.naturalWidth
    v.current.baseW = vp.clientWidth
    v.current.baseH = vp.clientWidth * aspect
    v.current.fit = Math.min(1, vp.clientHeight / v.current.baseH)
    if (stageRef.current) { stageRef.current.style.width = v.current.baseW + 'px'; stageRef.current.style.height = v.current.baseH + 'px' }
  }
  const fit = () => { measure(); v.current.z = v.current.fit; clamp(); apply() }
  const zoom = (f: number, cx?: number, cy?: number) => {
    const vp = vpRef.current!
    if (cx == null) { cx = vp.clientWidth / 2; cy = vp.clientHeight / 2 }
    const nz = Math.min(v.current.fit * 8, Math.max(v.current.fit, v.current.z * f))
    const k = nz / v.current.z
    v.current.x = cx - (cx - v.current.x) * k
    v.current.y = cy! - (cy! - v.current.y) * k
    v.current.z = nz
    clamp(); apply()
  }

  // ---- canvas de anotaciones ----
  const redraw = () => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d')!; ctx.clearRect(0, 0, c.width, c.height)
    for (const st of strokesRef.current) strokeAll(ctx, c, st)
    setHasNotes(strokesRef.current.length > 0)
  }
  const strokeAll = (ctx: CanvasRenderingContext2D, c: HTMLCanvasElement, st: Stroke) => {
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'
    ctx.globalCompositeOperation = st.erase ? 'destination-out' : 'source-over'
    ctx.strokeStyle = st.color; ctx.lineWidth = st.size * c.width
    ctx.beginPath()
    st.pts.forEach((p, i) => { const x = p[0] * c.width, y = p[1] * c.height; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) })
    ctx.stroke()
  }

  const onImgLoad = () => {
    setLoading(false); setErr(false)
    const img = imgRef.current!, c = canvasRef.current!
    c.width = img.naturalWidth; c.height = img.naturalHeight
    strokesRef.current = loadNotes(code).slice()
    redraw()
    fit()
  }

  // reset al cambiar de carta
  useEffect(() => { setLoading(true); setErr(false); setNight(false); setDraw(false); setErase(false) }, [src])

  // re-ajustar al cambiar tamaño / entrar-salir de pantalla completa
  useEffect(() => {
    const onResize = () => { if (imgRef.current?.naturalWidth) fit() }
    const onFs = () => { setFull(!!document.fullscreenElement); setTimeout(onResize, 60) }
    window.addEventListener('resize', onResize)
    document.addEventListener('fullscreenchange', onFs)
    return () => { window.removeEventListener('resize', onResize); document.removeEventListener('fullscreenchange', onFs) }
  }, [])

  const toggleFull = () => {
    const vp = vpRef.current!
    if (document.fullscreenElement) document.exitFullscreen()
    else vp.requestFullscreen?.().catch(() => {})
  }

  const undo = () => { strokesRef.current.pop(); saveNotes(code, strokesRef.current); redraw() }
  const clear = () => { strokesRef.current = []; saveNotes(code, strokesRef.current); redraw() }

  // ---- entrada unificada (mouse / touch / pen) ----
  useEffect(() => {
    const vp = vpRef.current!
    const pointers = new Map<number, { x: number; y: number }>()
    let mode: 'idle' | 'pan' | 'pinch' | 'draw' = 'idle'
    let last = { x: 0, y: 0 }, startDist = 0, drawId = -1
    let cur: Stroke | null = null, lastPt = { x: 0, y: 0 }

    const rel = (e: PointerEvent) => { const r = vp.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const norm = (e: PointerEvent) => {
      const c = canvasRef.current!, r = c.getBoundingClientRect()
      return { nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height }
    }
    const isDraw = (e: PointerEvent) => drawRef.current || e.pointerType === 'pen'
    const dist = () => { const p = [...pointers.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) }
    const mid = () => { const p = [...pointers.values()]; return { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 } }

    const beginStroke = (e: PointerEvent) => {
      const c = canvasRef.current!, ctx = c.getContext('2d')!, { nx, ny } = norm(e)
      cur = { color: colorRef.current, size: eraseRef.current ? 0.02 : 0.004, erase: eraseRef.current, pts: [[nx, ny]] }
      drawId = e.pointerId
      ctx.lineJoin = ctx.lineCap = 'round'
      ctx.globalCompositeOperation = cur.erase ? 'destination-out' : 'source-over'
      ctx.strokeStyle = cur.color; ctx.lineWidth = cur.size * c.width
      lastPt = { x: nx * c.width, y: ny * c.height }
    }
    const extendStroke = (e: PointerEvent) => {
      if (!cur) return
      const c = canvasRef.current!, ctx = c.getContext('2d')!, { nx, ny } = norm(e)
      cur.pts.push([nx, ny])
      const x = nx * c.width, y = ny * c.height
      ctx.beginPath(); ctx.moveTo(lastPt.x, lastPt.y); ctx.lineTo(x, y); ctx.stroke()
      lastPt = { x, y }
    }
    const endStroke = () => {
      if (cur && cur.pts.length) { strokesRef.current.push(cur); saveNotes(code, strokesRef.current); setHasNotes(true) }
      cur = null; drawId = -1
    }

    const down = (e: PointerEvent) => {
      // No secuestrar los punteros que nacen sobre los controles (rail / tools).
      if ((e.target as HTMLElement).closest('.rail, .draw-tools')) return
      vp.setPointerCapture(e.pointerId)
      pointers.set(e.pointerId, rel(e))
      if (pointers.size === 2) { mode = 'pinch'; startDist = dist(); if (cur) endStroke(); return }
      if (isDraw(e)) { mode = 'draw'; beginStroke(e) }
      else { mode = 'pan'; last = rel(e) }
    }
    const move = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, rel(e))
      if (mode === 'draw') { if (e.pointerId === drawId) { e.preventDefault(); extendStroke(e) } }
      else if (mode === 'pinch' && pointers.size >= 2) {
        e.preventDefault(); const d = dist(), c = mid()
        if (startDist) zoom(d / startDist, c.x, c.y); startDist = d
      } else if (mode === 'pan') {
        const p = rel(e); v.current.x += p.x - last.x; v.current.y += p.y - last.y; last = p; clamp(); apply()
      }
    }
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      try { vp.releasePointerCapture(e.pointerId) } catch { /* */ }
      if (mode === 'draw' && e.pointerId === drawId) endStroke()
      if (pointers.size === 0) mode = 'idle'
      else if (pointers.size === 1) { mode = 'pan'; last = [...pointers.values()][0] }
    }
    const wheel = (e: WheelEvent) => { e.preventDefault(); const r = vp.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top) }
    const dbl = (e: MouseEvent) => { if (drawRef.current) return; const r = vp.getBoundingClientRect(); zoom(v.current.z > v.current.fit * 1.2 ? 0.001 : 2, e.clientX - r.left, e.clientY - r.top) }

    vp.addEventListener('pointerdown', down)
    vp.addEventListener('pointermove', move)
    vp.addEventListener('pointerup', up)
    vp.addEventListener('pointercancel', up)
    vp.addEventListener('wheel', wheel, { passive: false })
    vp.addEventListener('dblclick', dbl)
    return () => {
      vp.removeEventListener('pointerdown', down); vp.removeEventListener('pointermove', move)
      vp.removeEventListener('pointerup', up); vp.removeEventListener('pointercancel', up)
      vp.removeEventListener('wheel', wheel); vp.removeEventListener('dblclick', dbl)
    }
  }, [code])

  return (
    <div className={'viewport' + (night ? ' night' : '') + (draw ? ' draw' : '')} ref={vpRef}>
      <div className="stage" ref={stageRef}>
        <img ref={imgRef} src={src} alt={alt} draggable={false} onLoad={onImgLoad} onError={() => { setLoading(false); setErr(true) }} />
        <canvas ref={canvasRef} className="notes" />
      </div>

      {loading && <div className="loading">Cargando carta…</div>}
      {err && <div className="loading">No se pudo cargar la carta.</div>}

      {draw && (
        <div className="draw-tools">
          {COLORS.map(c => (
            <button key={c} className={'sw' + (!erase && color === c ? ' on' : '')} style={{ background: c }}
              onClick={() => { setErase(false); setColor(c) }} aria-label={'Color ' + c} />
          ))}
          <button className={'db' + (erase ? ' on' : '')} onClick={() => setErase(e => !e)} aria-label="Goma"><Icon name="eraser" size={16} /></button>
          <button className="db" onClick={undo} disabled={!hasNotes} aria-label="Deshacer"><Icon name="undo" size={16} /></button>
          <button className="db" onClick={clear} disabled={!hasNotes} aria-label="Limpiar"><Icon name="trash" size={16} /></button>
        </div>
      )}

      <div className="rail">
        <button className="p tap" onClick={() => zoom(1.35)} aria-label="Acercar"><Icon name="plus" /></button>
        <button className="tap" onClick={() => zoom(1 / 1.35)} aria-label="Alejar"><Icon name="minus" /></button>
        <button className="tap" onClick={fit} aria-label="Ajustar a pantalla"><Icon name="maximize" /></button>
        <button className={'tap' + (draw ? ' p' : '')} onClick={() => setDraw(d => !d)} aria-label="Dibujar"><Icon name="pencil" /></button>
        <button className={'tap' + (night ? ' p' : '')} onClick={() => setNight(n => !n)} aria-label="Modo noche"><Icon name="moon" /></button>
        <button className={'tap' + (full ? ' p' : '')} onClick={toggleFull} aria-label="Pantalla completa"><Icon name={full ? 'compress' : 'expand'} /></button>
      </div>
      <div className="scale">{zoomLbl}{hasNotes ? ' · ✎' : ''}</div>
    </div>
  )
}
