---
name: DGAC Cockpit AIP
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bec7d4'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#88919d'
  outline-variant: '#3f4852'
  surface-tint: '#98cbff'
  primary: '#98cbff'
  on-primary: '#003354'
  primary-container: '#00a3ff'
  on-primary-container: '#00375a'
  inverse-primary: '#00629d'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#da8b00'
  on-tertiary-container: '#4c2d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#98cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a77'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-lg:
    fontFamily: inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  data-display-lg:
    fontFamily: jetbrainsMono
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.04em
  data-display-md:
    fontFamily: jetbrainsMono
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.03em
  data-display-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  badge-label:
    fontFamily: jetbrainsMono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
  caption:
    fontFamily: inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  touch-min: 44px
  pad-2xs: 0.125rem
  pad-xs: 0.25rem
  pad-sm: 0.5rem
  pad-md: 0.75rem
  pad-lg: 1rem
  pad-xl: 1.5rem
  gutter-mobile: 0.75rem
  gutter-tablet: 1rem
  sheet-max-w: 480px
---

## Brand & Style

This design system establishes an ultra-high-legibility, avionics-grade mobile interface engineered for commercial, military, and general aviation flight crews referencing DGAC Chile Aeronautical Information Publication (AIP) data. Designed specifically for low-light cockpit environments and high-stress workload conditions, the aesthetic combines technical minimalism, instrument panel discipline, and sharp micro-borders reminiscent of Navigraph Charts and modern Electronic Flight Bags (EFBs).

Key stylistic tenets:
- **Cockpit-Optimized Night Ergonomics**: Near-zero pure-white eye strain, using luminous electric cyan, amber, and terminal emerald sparingly against deep layered slates to preserve pilot scotopic (night) vision.
- **Instrument Precision**: Information density is balanced with rapid touch targeting, sharp delineation lines, and immediate categorical recognition via standardized aeronautical tags.
- **Absolute Legibility**: Unambiguous tabular alignment, clear separation of operational data (frequencies, runways, radials, transponder codes) using monospaced engineering type paired with crisp functional sans-serif labels.

## Colors

The palette adheres strictly to flight deck ergonomics: high contrast without bloom, deliberate chromatic differentiation for situational awareness, and strict functional roles for every hue.

### Palette Roles
- **Base Background (`#0B0F17`)**: Deep cockpit slate-black. Eliminates backlight bleed on OLED and modern avionics displays.
- **Surface Elevation 1 (`#111827`)**: Cockpit dark navy, used for viewports, chart panels, and drawer canvases.
- **Surface Elevation 2 (`#1E293B`)**: Technical slate for floating trays, segmented controls, cards, and modal sheets.
- **Micro-Border & Dividers (`#334155`)**: Crisp, non-intrusive geometric scaffolding to separate technical data fields.
- **Primary / Navigational Electric Cyan (`#00A3FF`)**: Selected states, active flight routes, VOR/NDB indicators, and primary action buttons. Secondary cyan accent: `#0284C7` for hover/active fills.
- **Terminal Emerald Green (`#10B981`)**: Verified active status, GPS FIX lock, VFR/IFR cleared states, and runway active indicators.
- **Instrument Caution Amber (`#F59E0B`)**: NOTAM advisories, weather minimum cautions, crossing runway warnings, and transient alert status.
- **Critical Alert Red (`#EF4444`)**: Prohibited airspace, closed runways, terrain warnings, expired cycles, and severe METAR phenomena.
- **Data Neutral High (`#F8FAFC`)**: Primary readouts, runway designations, frequency digits.
- **Data Neutral Muted (`#94A3B8`)**: Labels, units of measurement, secondary metadata, and unselected tabs.

## Typography

Typography enforces a strict dual-engine standard:

1. **System Interface Sans (`inter`)**: Powers operational summaries, instructions, procedures text, drawer headers, and navigational labels where legibility at a glance is required.
2. **Avionics Monospace (`jetbrainsMono`)**: Exclusively reserved for quantitative flight telemetry, ICAO/IATA identifiers (e.g., `SCEL`, `SCTE`), VHF/UHF radio frequencies (`118.100 MHz`), runway designations (`17L / 35R`), magnetic headings (`HDG 042°`), transitions, barometric settings, and NOTAM alphanumeric raw blocks.

### Typography Hierarchy & Rules
- **All Alphanumeric Flight Data**: Must utilize `jetbrainsMono` with tabular figures (`tnum`) enabled to prevent layout shifting during real-time GPS/speed updates.
- **Flight Badges & Category Identifiers**: Capitalized, tracked slightly wide (`0.06em`) for fast visual decoding in turbulence.

## Layout & Spacing

The layout is built for hand-held mobile devices and yoke-mounted tablet cockpits (iPad Mini / 11-inch classes).

- **Grid Architecture**: 4-column fluid layout for phone displays with an 8px base technical grid; transforms to an 8-column layout on tablet split-screens.
- **Touch Targets**: Standard cockpit interaction zones require a strict minimum hit box of `44px × 44px` to guarantee error-free input during flight deck vibration and turbulence.
- **AIP Chart Viewport**: Full-bleed edge-to-edge canvas with overlayable, semi-translucent HUD utility rails anchored to top and bottom margins.
- **Information Density**: Compact component heights with minimal superfluous white-space; internal item spacing standardizes around `4px` (`pad-xs`) and `8px` (`pad-sm`).

## Elevation & Depth

This system avoids soft, atmospheric drop shadows that introduce muddy contrast in darkened cockpits. Depth is created via **Tonal Layering** combined with **Sharp Micro-Borders**:

- **Layer 0 (Canvas Base)**: `#0B0F17` — Chart raster/vector backgrounds and primary map canvas.
- **Layer 1 (Recessed/Docked Panes)**: `#111827` with a 1px border of `#1E293B`.
- **Layer 2 (Interactive Floating Cards / Bottom Sheets)**: `#1E293B` bounded by a 1px crisp outline of `#334155`.
- **Layer 3 (Modals / Emergency Cautions / High Overlays)**: `#1E293B` bounded by high-contrast indicator borders (`#00A3FF` for active flight selection, `#F59E0B` for cautionary NOTAMs).
- **Glow & Highlights**: Tactical use of a sharp inner hairline highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`) on elevated panels to mimic backlit physical avionics glass.

## Shapes

The design system uses a strict **Soft (`roundedness: 1`)** geometry:
- Default components, panels, input fields, and cards employ crisp `4px` (`0.25rem`) corner rounding.
- High-level containers and bottom sheets employ `8px` (`0.5rem`) rounding on top edges.
- **Segmented Pill Controls & Aviation Badges**: Exceptions are pill-shaped navigation items and category badges, which use full capsular ends (`9999px`) to immediately distinguish flight category flags (SID, STAR, APP) from rectangular operational data blocks.

## Components

### Buttons
- **Primary Avionics Button**: Electric Cyan (`#00A3FF`) solid fill, text in `#0B0F17` (`inter`, bold, 13px). Height: 44px minimum. Active press: `#0284C7`.
- **Secondary Ghost Button**: `#111827` background, 1px `#334155` border, text in `#F8FAFC`. Active state illuminates border to `#00A3FF`.
- **Caution / Warning Button**: Amber (`#F59E0B`) or Alert Red (`#EF4444`) 1px border with 10% translucent fill of the respective color.

### Aviation Badge Tags
Compact visual cues for chart categorization with 100% monospaced caps:
- **`SID` (Standard Instrument Departure)**: `#00A3FF` border, 15% `#00A3FF` fill, white text.
- **`STAR` (Standard Terminal Arrival)**: `#10B981` border, 15% `#10B981` fill, emerald text.
- **`APP` (Instrument Approach Procedure)**: `#A855F7` border, 15% `#A855F7` fill, violet text.
- **`TAXI` (Aerodrome / Ground Movement)**: `#E2E8F0` border, 15% `#E2E8F0` fill, white text.
- **`NOTAM` (Notice to Airmen)**: Amber `#F59E0B` border, 15% `#F59E0B` fill, amber text.

### Segmented Pill Navigation
- Horizontal runway/chart switchers set inside a `#111827` recessed tray with 1px `#1E293B` stroke.
- Unselected items: muted slate `#94A3B8` without border.
- Selected item: solid `#1E293B` background with a crisp 1px `#00A3FF` border and glowing electric cyan indicator text.

### Frequency & Data Readout Cards
- High-contrast modular tiles: label in 11px uppercase `inter` muted (`#94A3B8`), value in 15px `jetbrainsMono` bold (`#F8FAFC`).
- Tapping copies frequency to scratchpad or prompts 8.33 kHz channel swap.

### Input Fields & Search Bars
- Background: `#111827`. Border: 1px `#334155`. Text: 14px `jetbrainsMono` for waypoint search (e.g., `SCEL / AMB / VOR 116.1`).
- Focus state: border shifts directly to `#00A3FF` with no fuzzy outer glow.

### AIP Runway Status Strip
- Horizontal card detailing runway identification (e.g., `RWY 17L`), dimensions (`3,800m x 45m`), TORA/LDA figures in monospaced tabular rows, and an inline status pill (`ACTIVE / DRY` in terminal emerald, `WIP / CLSD` in alert red).