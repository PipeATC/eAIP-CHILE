// Iconos SVG en línea (autocontenidos, sin dependencia externa).
import type { CSSProperties } from 'react'

const P: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  pin: '<path d="M12 21s-6-5.7-6-10a6 6 0 0 1 12 0c0 4.3-6 10-6 10Z"/><circle cx="12" cy="11" r="2.4"/>',
  star: '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.2l5.9-.9Z"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.3 12 2.6 2.6L15.8 9"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-.9 1.7l4.6 3.4-2.3 2.3-2.3-.5a1 1 0 0 0-.9 1.6L6 20l1.8 2.7a1 1 0 0 0 1.6-.9l-.5-2.3 2.3-2.3 3.4 4.6a1 1 0 0 0 1.7-.9Z"/>',
  wind: '<path d="M2 8h13a3 3 0 1 0-3-4"/><path d="M2 12h17a3 3 0 1 1-3 4"/><path d="M2 16h9a3 3 0 1 1-3 4"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a9.5 9.5 0 0 0 0 14M19 5a9.5 9.5 0 0 1 0 14"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4.5"/><path d="M12 17h.01"/>',
  map: '<path d="M9 4 3 6.2v14L9 18l6 2.2 6-2.2v-14L15 6 9 4Z"/><path d="M9 4v14M15 6v14"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  arrowleft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  pushpin: '<path d="M12 17v5"/><path d="M9.5 10.8V4h5v6.8l2 3.2h-9l2-3.2Z"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  translate: '<path d="M4 5h8M8 3v2c0 4.5-2.2 8-6 9.5M5 9c0 3.2 3.2 5.5 7 6.5"/><path d="m12.5 21 4-9 4 9M14 18h5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  shield: '<path d="M12 3 5 6v5c0 4.6 3 8.2 7 10 4-1.8 7-5.4 7-10V6l-7-3Z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  ruler: '<path d="M3 15 15 3l6 6L9 21Z"/><path d="m7.5 10.5 2 2M11 7l2 2M14.5 10.5l1.5 1.5"/>',
  route: '<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M6.5 16.8V9.5a4 4 0 0 1 4-4H14M17.5 7.2v7.3a4 4 0 0 1-4 4H10"/>',
  siren: '<path d="M7 18v-4.5a5 5 0 0 1 10 0V18"/><path d="M5 18h14v3H5z"/><path d="M12 4.5V2M4.8 8 3.4 7M19.2 8l1.4-1"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  compress: '<path d="M9 3v6H3M15 21v-6h6M3 9l6-6M21 15l-6 6"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  eraser: '<path d="m7 21-4-4a2 2 0 0 1 0-3l9-9a2 2 0 0 1 3 0l4 4a2 2 0 0 1 0 3l-8 8Z"/><path d="M7.5 13.5 12 18M6 21h13"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-4"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',
}

export type IconName = keyof typeof P

export function Icon({ name, size, color, className, fill }: {
  name: IconName | string
  size?: number
  color?: string
  className?: string
  fill?: number
}) {
  const style: CSSProperties = {}
  if (size) style.fontSize = size
  if (color) style.color = color
  return (
    <i className={'ic' + (className ? ' ' + className : '')} style={style} aria-hidden>
      <svg viewBox="0 0 24 24" style={fill ? { fill: 'currentColor', stroke: 'none' } : undefined}
        dangerouslySetInnerHTML={{ __html: P[name] || '' }} />
    </i>
  )
}
