import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Switch } from '../../../components/ui/switch'
import { useAdminSchedule } from '../../../hooks/admin/useAdminSchedule'
import type { AdminScheduleDay } from '../../../types'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const DEFAULT_DAYS: AdminScheduleDay[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  isOpen: i >= 1 && i <= 6,
  openTime: '09:00',
  closeTime: '13:00',
  openTime2: null,
  closeTime2: null,
  specialNote: null,
}))

export default function ScheduleTab() {
  const { data, isLoading, saveSchedule } = useAdminSchedule()
  const [localDays, setLocalDays] = useState<AdminScheduleDay[]>(DEFAULT_DAYS)

  useEffect(() => {
    if (data && data.length === 7) {
      setLocalDays([...data].sort((a, b) => a.dayOfWeek - b.dayOfWeek))
    }
  }, [data])

  function updateDay(dayOfWeek: number, changes: Partial<AdminScheduleDay>) {
    setLocalDays(prev =>
      prev.map(d => d.dayOfWeek === dayOfWeek ? { ...d, ...changes } : d)
    )
  }

  function handleToggleOpen(day: AdminScheduleDay) {
    if (day.isOpen) {
      updateDay(day.dayOfWeek, { isOpen: false, openTime2: null, closeTime2: null })
    } else {
      updateDay(day.dayOfWeek, { isOpen: true })
    }
  }

  function handleToggleSplit(day: AdminScheduleDay) {
    if (day.openTime2 && day.closeTime2) {
      updateDay(day.dayOfWeek, { openTime2: null, closeTime2: null })
    } else {
      updateDay(day.dayOfWeek, { openTime2: '18:00', closeTime2: '22:00' })
    }
  }

  async function handleSave() {
    try {
      await saveSchedule.mutateAsync(localDays)
      toast.success('Horarios guardados')
    } catch {
      toast.error('Error al guardar horarios')
    }
  }

  if (isLoading) return <p className="text-gray-400 text-sm">Cargando horarios…</p>

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-100">
          {localDays.map(day => (
            <div key={day.dayOfWeek} className="p-4 space-y-3">
              {/* Row header */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={day.isOpen}
                  onCheckedChange={() => handleToggleOpen(day)}
                />
                <span className={`font-medium text-sm ${day.isOpen ? 'text-gray-800' : 'text-gray-400'}`}>
                  {DAY_NAMES[day.dayOfWeek]}
                </span>
                {!day.isOpen && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Cerrado</span>
                )}
              </div>

              {day.isOpen && (
                <>
                  {/* Primer turno */}
                  <div className="flex flex-wrap gap-3 ml-10">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500">Apertura</label>
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={e => updateDay(day.dayOfWeek, { openTime: e.target.value })}
                        className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500">Cierre</label>
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={e => updateDay(day.dayOfWeek, { closeTime: e.target.value })}
                        className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  </div>

                  {/* Segundo turno */}
                  {day.openTime2 && day.closeTime2 && (
                    <div className="flex flex-wrap gap-3 ml-10">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Apertura tarde</label>
                        <input
                          type="time"
                          value={day.openTime2}
                          onChange={e => updateDay(day.dayOfWeek, { openTime2: e.target.value })}
                          className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Cierre tarde</label>
                        <input
                          type="time"
                          value={day.closeTime2}
                          onChange={e => updateDay(day.dayOfWeek, { closeTime2: e.target.value })}
                          className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* Toggle turno partido */}
                  <div className="ml-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSplit(day)}
                      className="text-xs text-green-700 underline underline-offset-2 hover:text-green-600 transition-colors"
                    >
                      {day.openTime2 ? '− Quitar turno tarde' : '+ Agregar turno tarde'}
                    </button>
                  </div>
                </>
              )}

              {/* Nota especial */}
              <div className="ml-10">
                <input
                  type="text"
                  value={day.specialNote ?? ''}
                  onChange={e => updateDay(day.dayOfWeek, { specialNote: e.target.value || null })}
                  placeholder="Nota especial (opcional)"
                  className="min-h-[44px] w-full px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveSchedule.isPending}
        className="min-h-[44px] px-6 bg-green-700 text-white rounded hover:bg-green-800 transition-colors text-sm font-medium disabled:opacity-50 w-full md:w-auto"
      >
        {saveSchedule.isPending ? 'Guardando…' : 'Guardar horarios'}
      </button>
    </div>
  )
}
