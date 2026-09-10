# SCEL — Aeropuerto Arturo Merino Benítez (Santiago, Chile)

Datos del aeródromo **SCEL / SCL** extraídos del AIP Chile oficial, para
consumo por otros proyectos.

| Campo | Valor |
|---|---|
| Indicador OACI / IATA | **SCEL** / SCL |
| Nombre | Aeropuerto Arturo Merino Benítez |
| Ciudad | Santiago, Chile |
| FIR | SCEZ |
| Fuentes | AIP Chile Vol. I — **AD 2 SCEL (AMDT NR 67)**; cartas Vol. II — **DGAC AMDT 103** |
| Datos legibles por máquina | [`data/aerodromes/SCEL.json`](../data/aerodromes/SCEL.json) · [`data/charts/SCEL/catalog.json`](../data/charts/SCEL/catalog.json) |

> ⚠️ **Uso de referencia / estudio.** No reemplaza la fuente oficial
> certificada para navegación. Verificar siempre contra el AIRAC vigente.

---

## 1. Datos geográficos y administrativos (AD 2.1 / 2.2)

| Campo | Valor |
|---|---|
| Coordenadas ARP | 33°23'39.99"S 070°47'37.69"W |
| Ubicación | 14 km al NW de Santiago · Comuna de Pudahuel |
| Elevación | **1.555 FT** (474 m) |
| Temperatura de referencia | 30 °C |
| Ondulación geoidal | 26,10 m |
| Variación magnética | **1.1° E** (2022) |
| Altitud de transición | **10.000 FT** |
| Tipos de tránsito | IFR / VFR |
| Clase de espacio aéreo | D (CTR) |
| Categoría SEI (ARFF) | **CAT 9** |
| Explotador | DGAC |
| Combustible | Jet A1 |
| Horario | H24 |

---

## 2. Pistas (AD 2.12 / 2.13)

| RWY | Rumbo (MAG) | Dimensiones | Superficie | Elev. umbral | TORA | TODA | ASDA | LDA | ILS |
|---|---|---|---|---|---|---|---|---|---|
| **17L** | 176° | 3.750 × 55 m | ASPH | 1.550 FT | 3.750 | 3.750 | 3.750 | 3.750 | IUEL 110.3 |
| **35R** | 356° | 3.750 × 55 m | ASPH | 1.555 FT | 3.750 | 3.750 | 3.750 | 3.200 | — |
| **17R** | 176° | 3.800 × 45 m | ASPH | 1.551 FT | 3.800 | 3.800 | 3.800 | 3.800 | IMER 111.1 |
| **35L** | 356° | 3.800 × 45 m | ASPH | 1.550 FT | 3.800 | 3.800 | 3.800 | 3.800 | — |

*Distancias declaradas en metros. Pistas paralelas 17L/35R y 17R/35L.*

---

## 3. Frecuencias ATS (AD 2.18)

| Servicio | Distintivo | Frecuencia | Alternas | Horario |
|---|---|---|---|---|
| ATIS (Arribo) | — | **132.100** | | H24 |
| ATIS (Despegue) | — | **132.700** | | H24 |
| Aproximación (APP) | Santiago Aproximación | **119.700** | 129.700 / 135.400 | H24 |
| Torre (TWR) — Local Primaria | Santiago Torre | **118.100** | | H24 |
| Torre (TWR) — Local Secundaria | Santiago Torre | 118.350 | | H24 |
| Rodaje (GND) — Este | Santiago Control Terrestre E | **122.200** | | H24 |
| Rodaje (GND) — Oeste | Santiago Control Terrestre W | 122.500 | | H24 |
| Autorizaciones (CLR/DLVRY) | Santiago Autorizaciones | 136.700 | | H24 |
| Información (INFO) | Santiago Información | 122.400 | 125.400 | |

*Frecuencias en MHz.*

---

## 4. Radioayudas para la navegación y el aterrizaje (AD 2.19)

| Tipo | ID | Frecuencia | Canal | RWY | Elev. | Horario |
|---|---|---|---|---|---|---|
| DVOR/DME | **AMB** | 116.1 MHz | 108X | 17L/35R | 1.558 FT | H24 |
| DVOR/DME | **PDH** | 117.2 MHz | 119X | 17R/35L | 1.552 FT | H24 |
| ILS / LOC | **IUEL** | 110.3 MHz | — | 17L | — | H24 |
| ILS / GP DME | — | 335.0 MHz | 40X | 17L | — | H24 |
| ILS / LOC | **IMER** | 111.1 MHz | — | 17R | — | H24 |
| ILS / GP DME | — | 331.7 MHz | 48X | 17R | — | H24 |

---

## 5. Aproximación ILS Z RWY 17L (carta SCEL IAC 1)

Datos de la lámina oficial (DGAC AMDT 103):

| Campo | Valor |
|---|---|
| LOC / ident | **110.3 MHz / IUEL** |
| Curso final de aproximación | **177° MAG** |
| Senda de planeo (GP) / TCH | 3° / 51 FT |
| Elevación de aeródromo | 1.555 FT |
| Nivel de transición | por ATC · ALT MNM 5.000 FT |
| MSA (25 NM AMB) | 19.000 FT |

**Mínimos de aterrizaje (DIRECTO RWY 17L):**

| Procedimiento | DA(H) | RVR / VIS |
|---|---|---|
| ILS CAT II (RA 100') | 1.650' (100') | RVR 350 m |
| ILS CAT II (RA 150') | 1.700' (150') | RVR 500 m |
| ILS CAT III-A | — | RVR 200 m |
| ILS CAT III-B | — | RVR 50 m |
| Fail Passive | 1.600' (50') | — |

*Requiere certificación especial de operador y tripulación (DAN 06-02 / 06-12).*

---

## 6. Inventario de cartas (Vol. II — 54 cartas)

| Tipo | Descripción | N.º de cartas |
|---|---|---|
| IAC | Aproximaciones instrumentales | 20 |
| SID | Salidas normalizadas | 14 |
| STAR | Llegadas normalizadas | 11 |
| ADC | Plano de aeródromo | 2 |
| GMC | Movimiento en superficie / rodaje | 2 |
| PDC | Estacionamiento (parking) | 3 |
| VAC | Aproximación visual | 2 |

**Aproximaciones (IAC) identificadas:**
ILS Z RWY 17L · ILS Z RWY 17R · ILS Y RWY 17L · ILS Y RWY 17R ·
VOR RWY 17L · VOR RWY 17R · VOR RWY 35R · VOR RWY 35L ·
RNP Y RWY 17L · RNP Z RWY 17R · RNP Y RWY 17R · RNP RWY 35R · RNP RWY 35L
*(más variantes/continuaciones IAC 5–8, 18–20).*

---

_Generado desde el repositorio **eAIP-CHILE** (datos reales del AIP Chile).
Ciclo de referencia: AD 2 AMDT 67 (Vol. I) · Cartas AMDT 103 (Vol. II)._
