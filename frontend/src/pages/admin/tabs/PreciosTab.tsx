import { useState } from 'react'
import { useAdminMenu } from '../../../hooks/admin/useAdminMenu'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AdminMenuItem } from '../../../types'

// ── Canvas: 1080×1440 (3:4 Instagram portrait) ────────────────────────────
const CW = 1080
const CH = 1440

const C_BG    = '#1b1e23'
const C_WHITE = '#ffffff'
const C_DIM   = 'rgba(255,255,255,0.55)'
const C_BOX   = '#005128'

function fmt(price: number) {
  return price > 0 ? `$${price.toLocaleString('es-AR')}` : '–'
}

function f(px: number, bold = false) {
  return `${bold ? '700 ' : '400 '}${Math.round(px)}px Arial, Helvetica, sans-serif`
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ── Drawing primitives ─────────────────────────────────────────────────────

/** Section title ("Pizzas", "Tartas", …). Returns Y after the title. */
function secTitle(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, px: number): number {
  ctx.font      = f(px * 1.15, true)
  ctx.fillStyle = C_WHITE
  ctx.textAlign = 'left'
  ctx.fillText(text, x, y)
  return y + px * 1.6
}

/** One name + price row. Name is bold, price is right-aligned. Returns Y after the row. */
function row(
  ctx: CanvasRenderingContext2D,
  name: string, price: string,
  x: number, y: number, w: number, px: number,
): number {
  const lh = px * 1.4
  ctx.font = f(px, false)
  const priceW = ctx.measureText('$99.999').width * 1.15
  const nameW  = w - priceW - px * 0.5
  ctx.textAlign = 'left'

  // Name – truncate if still too long after bold font
  ctx.font = f(px, true)
  let nm = name
  while (ctx.measureText(nm).width > nameW && nm.length > 4) nm = nm.slice(0, -1)
  if (nm !== name) nm = nm.trimEnd() + '…'
  ctx.fillStyle = C_WHITE
  ctx.fillText(nm, x, y)

  // Price
  ctx.font      = f(px, false)
  ctx.fillStyle = C_WHITE
  ctx.textAlign = 'right'
  ctx.fillText(price, x + w, y)
  ctx.textAlign = 'left'
  return y + lh
}

/** Simple text line (not a name/price pair). Returns Y after. */
function line(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number, px: number,
  bold = false, color = C_WHITE, align: CanvasTextAlign = 'left',
): number {
  ctx.font      = f(px, bold)
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.fillText(text, x, y)
  ctx.textAlign = 'left'
  return y + px * 1.4
}

/** Pasta grid: tipo × salsa. Returns Y after grid. */
function pastaGrid(
  ctx: CanvasRenderingContext2D,
  tipos: string[], salsas: string[],
  priceOf: (t: string, s: string) => string,
  x: number, y: number, w: number, px: number,
): number {
  const rh     = px * 1.4
  const nameW  = w * 0.33
  const colW   = (w - nameW) / salsas.length

  // Column headers
  ctx.font      = f(px * 0.82, true)
  ctx.fillStyle = C_DIM
  salsas.forEach((s, si) => {
    ctx.textAlign = 'center'
    const cx = x + nameW + colW * si + colW / 2
    ctx.fillText(s.replace('con ', ''), cx, y)
  })
  ctx.textAlign = 'left'
  y += px * 1.3

  tipos.forEach(tipo => {
    // Tipo name
    ctx.font = f(px, true)
    ctx.fillStyle = C_WHITE
    ctx.textAlign = 'left'
    ctx.fillText(tipo, x, y)

    // Prices
    salsas.forEach((s, si) => {
      const cx = x + nameW + colW * si + colW / 2
      ctx.font      = f(px * 0.9, false)
      ctx.fillStyle = C_WHITE
      ctx.textAlign = 'center'
      ctx.fillText(priceOf(tipo, s), cx, y)
    })
    ctx.textAlign = 'left'
    y += rh
  })
  return y
}

/** Green-bordered contact box. Returns Y after box. */
function contactBox(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, px: number,
): number {
  const bw  = px * 0.6
  const lh  = px * 1.5
  const pad = px * 1.0
  const h   = pad + lh * 3 + pad

  ctx.strokeStyle = C_BOX
  ctx.lineWidth   = bw
  ctx.strokeRect(x + bw / 2, y + bw / 2, w - bw, h - bw)

  const cx = x + w / 2
  let ly = y + pad + px
  const texts = ['Rotisería "La Olla"', '3446-410459', 'Maipu y Doello Jurado']
  for (const t of texts) {
    ctx.font      = f(px, true)
    ctx.fillStyle = C_WHITE
    ctx.textAlign = 'center'
    ctx.fillText(t, cx, ly)
    ly += lh
  }
  ctx.textAlign = 'left'
  return y + h
}

// ── Two-pass render ────────────────────────────────────────────────────────

type DrawFn = (ctx: CanvasRenderingContext2D, logo: HTMLImageElement, px: number) => number

async function renderCard(drawFn: DrawFn, basePx = 15): Promise<HTMLCanvasElement> {
  const logo = await loadImage('/logo.png')

  // Pass 1: measure total height at basePx
  const tmp  = document.createElement('canvas')
  tmp.width  = CW; tmp.height = 6000
  const tctx = tmp.getContext('2d')!
  const h1   = drawFn(tctx, logo, basePx)

  // Scale px so total height fills CH (generous cap to stay readable)
  let px = basePx * (CH / h1)
  px = Math.min(px, basePx * 2.8)

  // Pass 2: final canvas
  const canvas  = document.createElement('canvas')
  canvas.width  = CW; canvas.height = CH
  const ctx     = canvas.getContext('2d')!
  ctx.fillStyle = C_BG
  ctx.fillRect(0, 0, CW, CH)
  drawFn(ctx, logo, px)
  return canvas
}

function triggerDownload(canvas: HTMLCanvasElement, nombre: string) {
  canvas.toBlob(blob => {
    if (!blob) { toast.error('No se pudo generar la imagen'); return }
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href    = url
    a.download = `${nombre}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

// ── Component ──────────────────────────────────────────────────────────────

const TIPOS_PASTA = ['Ñoquis', 'Ravioles', 'Tallarines', 'Sorrentinos']
const SALSAS      = ['con Salsa', 'con Bolognesa', 'con Estofado']

export default function PreciosTab() {
  const { data, isLoading } = useAdminMenu()
  const [lP, setLP]         = useState(false)
  const [lC, setLC]         = useState(false)

  const byCat = (slug: string): AdminMenuItem[] =>
    data?.find(c => c.slug === slug)?.items ?? []

  const pizzas     = byCat('pizzas')
  const tartas     = byCat('tartas')
  const empanadas  = byCat('empanadas')
  const comidas    = byCat('comidas')
  const pastas     = byCat('pastas')
  const guarnicion = byCat('guarnicion')

  const pastaPrice = (tipo: string, salsa: string) =>
    fmt(pastas.find(p => p.name === `${tipo} ${salsa}`)?.price ?? 0)

  // Empanadas: use first non-zero price as unit price
  const empPrecioUnit = empanadas.find(e => e.price > 0)?.price ?? 0

  async function handlePizzas() {
    setLP(true)
    try {
      const canvas = await renderCard((ctx, logo, px) => {
        const pad  = px * 3.2
        const gap  = px * 2.5
        const colW = (CW - pad * 2 - gap) / 2
        const lx   = pad
        const rx   = pad + colW + gap

        // Logo centered
        const logoH = px * 7
        const logoW = (logo.width / logo.height) * logoH
        const logoX = (CW - logoW) / 2
        ctx.drawImage(logo, logoX, pad, logoW, logoH)
        let ly = pad + logoH + pad * 1.2
        let ry = ly

        // LEFT: Pizzas
        ly = secTitle(ctx, 'Pizzas', lx, ly, px)
        for (const p of pizzas) {
          ly = row(ctx, p.name, fmt(p.price), lx, ly, colW, px)
        }

        // RIGHT: Tartas
        ry = secTitle(ctx, 'Tartas', rx, ry, px)
        for (const t of tartas) {
          ry = row(ctx, t.name, fmt(t.price), rx, ry, colW, px)
        }
        ry += px * 1.2

        // RIGHT: Empanadas (names only, price at bottom)
        ry = secTitle(ctx, 'Empanadas', rx, ry, px)
        for (const e of empanadas) {
          ctx.font      = f(px, true)
          ctx.fillStyle = C_WHITE
          ctx.textAlign = 'left'
          ctx.fillText(e.name, rx, ry)
          ry += px * 1.4
        }
        ry += px * 0.4
        const docena = empPrecioUnit > 0 ? `$${(empPrecioUnit * 12).toLocaleString('es-AR')} DOCENA  –  ${fmt(empPrecioUnit)} C/U` : '–'
        ry = line(ctx, docena, rx, ry, px * 0.95, true)

        return Math.max(ly, ry) + pad
      })
      triggerDownload(canvas, 'Precios Pizzas')
    } catch (e) {
      console.error(e); toast.error('Error al generar imagen')
    } finally { setLP(false) }
  }

  async function handleComidas() {
    setLC(true)
    try {
      const canvas = await renderCard((ctx, logo, px) => {
        const pad  = px * 3.2
        const gap  = px * 2.5
        const colW = (CW - pad * 2 - gap) / 2
        const lx   = pad
        const rx   = pad + colW + gap

        // Logo centered
        const logoH = px * 7
        const logoW = (logo.width / logo.height) * logoH
        const logoX = (CW - logoW) / 2
        ctx.drawImage(logo, logoX, pad, logoW, logoH)
        let ly = pad + logoH + pad * 1.2
        let ry = ly

        // LEFT: Comidas
        ly = secTitle(ctx, 'Comidas', lx, ly, px)
        for (const c of comidas) {
          ly = row(ctx, c.name, fmt(c.price), lx, ly, colW, px)
        }
        ly += px * 1.0

        // LEFT continued: Guarnición
        ly = secTitle(ctx, 'Guarnición', lx, ly, px)
        for (const g of guarnicion) {
          ly = row(ctx, g.name, fmt(g.price), lx, ly, colW, px)
        }

        // RIGHT: Pastas
        ry = secTitle(ctx, 'Pastas', rx, ry, px)
        ry = pastaGrid(ctx, TIPOS_PASTA, SALSAS, pastaPrice, rx, ry, colW, px)
        ry += px * 2.5

        // RIGHT: Contact box
        ry = contactBox(ctx, rx, ry, colW, px)

        return Math.max(ly, ry) + pad
      })
      triggerDownload(canvas, 'Precios Comidas')
    } catch (e) {
      console.error(e); toast.error('Error al generar imagen')
    } finally { setLC(false) }
  }

  if (isLoading) return <p className="text-gray-400 text-sm">Cargando precios…</p>

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        1080 × 1440 px · formato 3:4 Instagram portrait
      </p>
      {[
        { label: 'Cartel 1 — Pizzas, Tartas y Empanadas',   loading: lP, onClick: handlePizzas  },
        { label: 'Cartel 2 — Comidas, Pastas y Guarnición', loading: lC, onClick: handleComidas },
      ].map(card => (
        <div key={card.label} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
          <span className="font-medium text-gray-800 text-sm">{card.label}</span>
          <button
            type="button"
            onClick={card.onClick}
            disabled={card.loading}
            className="flex items-center gap-2 min-h-[44px] px-4 bg-green-700 text-white rounded text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-60"
          >
            {card.loading
              ? <><Loader2 className="h-4 w-4 animate-spin" />Generando…</>
              : <><Download className="h-4 w-4" />Descargar</>}
          </button>
        </div>
      ))}
    </div>
  )
}
