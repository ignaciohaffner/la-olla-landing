import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Switch } from '../../../components/ui/switch'
import { useAdminWeeklyMenu } from '../../../hooks/admin/useAdminWeeklyMenu'

const DAY_LABELS: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

const DAYS_BASE = [1, 2, 3, 4, 5]

export default function WeeklyMenuTab() {
  const { data, isLoading, publishWeeklyMenu } = useAdminWeeklyMenu()
  const [includeSaturday, setIncludeSaturday] = useState(false)
  const [textareas, setTextareas] = useState<Record<number, string>>({
    1: '', 2: '', 3: '', 4: '', 5: '', 6: '',
  })

  useEffect(() => {
    if (data && data.length > 0) {
      const map: Record<number, string> = {}
      data.forEach(d => { map[d.dayOfWeek] = d.dishes.join('\n') })
      setTextareas(prev => ({ ...prev, ...map }))
      // if there's saved data for Saturday, auto-enable it
      if (data.some(d => d.dayOfWeek === 6 && d.dishes.length > 0)) {
        setIncludeSaturday(true)
      }
    }
  }, [data])

  const activeDays = includeSaturday ? [...DAYS_BASE, 6] : DAYS_BASE

  async function handlePublish() {
    const body = activeDays
      .map(day => ({
        dayOfWeek: day,
        dishes: (textareas[day] ?? '').split('\n').map(s => s.trim()).filter(Boolean),
      }))
      .filter(d => d.dishes.length > 0)

    if (body.length === 0) {
      toast.warning('Ingresá al menos un plato en algún día')
      return
    }

    try {
      await publishWeeklyMenu.mutateAsync(body)
      toast.success('Menú semanal publicado')
    } catch {
      toast.error('Error al publicar el menú')
    }
  }

  if (isLoading) return <p className="text-gray-400 text-sm py-4">Cargando menú semanal…</p>

  return (
    <div className="space-y-4">

      {/* Info banner */}
      <div className="bg-[#1B4332]/6 border border-[#1B4332]/20 rounded-xl p-4 flex gap-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#1B4332] shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
        </svg>
        <div className="text-sm text-[#1B4332]">
          <p className="font-semibold mb-0.5">Menú para la semana siguiente</p>
          <p className="text-[#1B4332]/70">
            Los pedidos semanales se contratan con semana previa de anticipación.
            Publicá este menú para que los clientes puedan planificar sus pedidos.
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">Incluir sábado</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {includeSaturday ? 'Menú de lunes a sábado' : 'Menú de lunes a viernes'}
          </p>
        </div>
        <Switch
          checked={includeSaturday}
          onCheckedChange={setIncludeSaturday}
        />
      </div>

      {/* Day textareas */}
      <div className="space-y-2">
        {activeDays.map(day => (
          <div key={day} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                {DAY_LABELS[day]}
              </label>
              {textareas[day] && (
                <span className="text-xs text-gray-400">
                  {textareas[day].split('\n').filter(l => l.trim()).length} platos
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={textareas[day] ?? ''}
              onChange={e => setTextareas(prev => ({ ...prev, [day]: e.target.value }))}
              placeholder="Un plato por línea…"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 resize-none placeholder:text-gray-300"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handlePublish}
        disabled={publishWeeklyMenu.isPending}
        className="min-h-[42px] px-6 bg-[#1B4332] text-white rounded-lg hover:bg-[#2D6A4F] transition-colors text-sm font-medium disabled:opacity-50"
      >
        {publishWeeklyMenu.isPending ? 'Publicando…' : 'Publicar menú de la próxima semana'}
      </button>
    </div>
  )
}
