import { Icon } from '../icons'

const NOTAMS: [string, string, string, string, string, string][] = [
  ['red', 'CRÍTICO OPERACIONAL', 'A1428/24', 'RWY 17R/35L CLSD DUE TO MAINT WIP',
    'Pista 17R/35L cerrada por trabajos de mantenimiento en carpeta asfáltica. Planificar rodaje vía TWY Kilo hacia RWY 17L.', '24/04/20 → 24/04/28'],
  ['amber', 'PRECAUCIÓN NAVEGACIÓN', 'A1390/24', 'VOR/DME AMB 116.1 MHZ U/S FOR CALIBRATION',
    'Radioayuda VOR/DME Santiago fuera de servicio por vuelo de calibración. Utilizar RNAV 1 GNSS para llegadas STAR y aproximaciones RNP.', '24/04/18 → 24/04/25'],
  ['primary', 'INFORMACIÓN / OBSTÁCULO', 'C0512/24', 'OBST CRANE ERECTED 2.1 NM N SCEL ELEV 1720FT LGTD',
    'Grúa pluma de construcción a 2.1 NM al norte del umbral RWY 17L. Elevación máxima 1.720 FT AMSL. Balizamiento nocturno operativo.', 'PERMANENTE'],
]

export function Notams() {
  return (
    <>
      <div className="brief">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <Icon name="shield" /><h2>Briefing Operacional · SCEL</h2>
          <span className="tag demo" style={{ marginLeft: 'auto' }}>MUESTRA DEMO</span>
        </div>
        <div className="kpis">
          <div className="kpi"><div className="row" style={{ gap: 6 }}><Icon name="file" size={16} color="var(--ink-2)" /><span className="n">32</span></div><div className="l">VIGENTES</div></div>
          <div className="kpi red"><div className="row" style={{ gap: 6 }}><Icon name="siren" size={16} color="var(--red)" /><span className="n">2</span></div><div className="l">CRÍTICOS · ALERTA VUELO</div></div>
        </div>
      </div>

      <div className="notams">
        {NOTAMS.map(([col, cat, id, title, body, val]) => (
          <div className={'notam tinted c-' + col} key={id}>
            <div className="bar"><span className="c"><span className="dot" />{cat}</span><span className="z">DEMO</span></div>
            <div className="in">
              <div className="id">{id} <span className="z">NOTAMN</span></div>
              <div className="t">{title}</div>
              <div className="dec"><Icon name="translate" size={15} /><p><b>Decodificación:</b> {body}</p></div>
              <div className="val"><Icon name="clock" size={13} />{val}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="foot-note">Los NOTAM y suplementos son <b>datos de muestra</b> del prototipo. En producción provienen de un feed operacional en vivo (no del PDF del AIP).</p>
    </>
  )
}
