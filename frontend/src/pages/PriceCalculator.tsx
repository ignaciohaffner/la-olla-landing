import { useState } from 'react'
import type { PizzaPartyConfig, CalculatorValues } from '@/types'

interface PriceCalculatorProps {
  config: PizzaPartyConfig
  values: CalculatorValues
  onChange: (values: CalculatorValues) => void
}

const WHATSAPP_NUMBER = '543446410459'

function buildWhatsAppUrl(guests: number, eventDate: string) {
  const dateLabel = eventDate
    ? new Date(eventDate + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '[fecha a confirmar]'

  const msg = `Hola! Quiero cotizar un Pizza Party para ${guests} personas el día ${dateLabel}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default function PriceCalculator({ config, values, onChange }: PriceCalculatorProps) {
  const [eventDate, setEventDate] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleGuests = (raw: string) => {
    const parsed = parseInt(raw, 10)
    const guests = isNaN(parsed) ? config.minimumGuests : Math.max(config.minimumGuests, parsed)
    onChange({ ...values, guests })
  }

  const inputClass =
    'w-full rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] px-3 py-2 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30'

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#EDE5D8] p-6 flex flex-col gap-5">
      <h2
        className="text-xl font-semibold text-[#1B4332]"
        style={{ fontFamily: 'Lora, Georgia, serif' }}
      >
        Armá tu presupuesto
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Fecha del evento *</label>
        <input
          type="date"
          min={today}
          value={eventDate}
          onChange={e => setEventDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Cantidad de invitados <span className="text-gray-400 font-normal">(mín. {config.minimumGuests})</span>
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={config.minimumGuests}
          value={values.guests}
          onChange={e => handleGuests(e.target.value)}
          className={inputClass}
        />
      </div>

      <a
        href={buildWhatsAppUrl(values.guests, eventDate)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 min-h-[48px] px-6 bg-[#C8522A] text-white font-semibold rounded-lg hover:bg-[#A8421E] transition-colors shadow-md shadow-[#C8522A]/20"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L0 24l6.335-1.506A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.502-5.176-1.382l-.372-.22-3.76.894.944-3.654-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        Cotizar por WhatsApp
      </a>
    </div>
  )
}
