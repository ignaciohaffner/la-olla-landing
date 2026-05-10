import type { PizzaPartyConfig, CalculatorValues } from '@/types'

interface PriceCalculatorProps {
  config: PizzaPartyConfig
  values: CalculatorValues
  onChange: (values: CalculatorValues) => void
  onRequestClick: () => void
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

export default function PriceCalculator({ config, values, onChange, onRequestClick }: PriceCalculatorProps) {
  const total =
    values.guests * config.pricePerPerson +
    values.extraHours * config.extraHourPrice +
    values.extraMozzos * config.mozzoPrice

  const handleGuests = (raw: string) => {
    const parsed = parseInt(raw, 10)
    const guests = isNaN(parsed) ? config.minimumGuests : Math.max(config.minimumGuests, parsed)
    onChange({ ...values, guests })
  }

  const handleExtraHours = (raw: string) => {
    const parsed = parseInt(raw, 10) as 0 | 1 | 2
    onChange({ ...values, extraHours: [0, 1, 2].includes(parsed) ? parsed : 0 })
  }

  const handleExtraMozzos = (raw: string) => {
    const parsed = parseInt(raw, 10)
    const extraMozzos = isNaN(parsed) ? 0 : Math.max(0, parsed)
    onChange({ ...values, extraMozzos })
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-green-500'

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold text-green-800">Calculá tu presupuesto</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Cantidad de invitados <span className="text-gray-400">(mín. {config.minimumGuests})</span>
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={config.minimumGuests}
          value={values.guests}
          onChange={(e) => handleGuests(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Horas extra <span className="text-gray-400">(además de las 3 base)</span>
        </label>
        <select
          value={values.extraHours}
          onChange={(e) => handleExtraHours(e.target.value)}
          className={inputClass}
        >
          <option value={0}>Sin horas extra</option>
          <option value={1}>+1 hora</option>
          <option value={2}>+2 horas</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Mozos adicionales</label>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={values.extraMozzos}
          onChange={(e) => handleExtraMozzos(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="mt-2 rounded-xl bg-green-50 border border-green-200 p-4 text-center">
        <p className="text-sm text-green-700 mb-1">Total estimado</p>
        <p className="text-3xl font-bold text-green-800">{formatCurrency(total)}</p>
      </div>

      <button
        onClick={onRequestClick}
        className="flex items-center justify-center min-h-[44px] px-6 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
      >
        Solicitar este servicio
      </button>
    </div>
  )
}
