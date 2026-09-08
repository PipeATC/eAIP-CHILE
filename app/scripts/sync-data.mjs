// Copia los datos canónicos del repo (../data) a app/public para que Vite los
// sirva y la PWA los precachee. Se ejecuta en predev/prebuild.
// Fuente de verdad: /data del repo. Destino (regenerable): app/public.
import { cp, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..', '..')
const pub = resolve(here, '..', 'public')

const jobs = [
  { from: resolve(repo, 'data', 'aerodromes'), to: resolve(pub, 'data', 'aerodromes') },
  { from: resolve(repo, 'data', 'charts', 'SCEL'), to: resolve(pub, 'charts', 'SCEL') },
]

for (const { from, to } of jobs) {
  if (!existsSync(from)) {
    console.warn(`  ! no existe ${from} — omitido`)
    continue
  }
  await rm(to, { recursive: true, force: true })
  await mkdir(dirname(to), { recursive: true })
  await cp(from, to, { recursive: true })
  console.log(`  ✓ ${from} -> ${to}`)
}
console.log('sync-data: listo')
