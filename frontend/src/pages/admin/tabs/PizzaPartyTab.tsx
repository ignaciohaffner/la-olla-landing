import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useAdminPizzaParty } from '../../../hooks/admin/useAdminPizzaParty'
import type { PizzaPartyConfig, PizzaPartyRequest } from '../../../types'

const configSchema = z.object({
  pricePerPerson: z.number({ invalid_type_error: 'Requerido' }).positive(),
  minimumGuests: z.number({ invalid_type_error: 'Requerido' }).int().positive(),
  baseHours: z.number({ invalid_type_error: 'Requerido' }).int().positive(),
  extraHourPrice: z.number({ invalid_type_error: 'Requerido' }).positive(),
  mozzoPrice: z.number({ invalid_type_error: 'Requerido' }).positive(),
  serviceDetails: z.string().min(1, 'Requerido'),
})

type ConfigFormData = z.infer<typeof configSchema>

function ConfigSubTab() {
  const { config, patchConfig } = useAdminPizzaParty()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConfigFormData>({ resolver: zodResolver(configSchema) })

  useEffect(() => {
    if (config.data) reset(config.data)
  }, [config.data, reset])

  async function onSubmit(data: ConfigFormData) {
    try {
      await patchConfig.mutateAsync(data)
      toast.success('Configuración guardada')
    } catch {
      toast.error('Error al guardar configuración')
    }
  }

  if (config.isLoading) return <p className="text-gray-400 text-sm">Cargando…</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {(
        [
          { name: 'pricePerPerson', label: 'Precio por persona ($)' },
          { name: 'minimumGuests', label: 'Mínimo de invitados' },
          { name: 'baseHours', label: 'Horas base incluidas' },
          { name: 'extraHourPrice', label: 'Precio hora extra ($)' },
          { name: 'mozzoPrice', label: 'Precio mozo ($)' },
        ] as const
      ).map(({ name, label }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <input
            type="number"
            inputMode="numeric"
            className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
            {...register(name, { valueAsNumber: true })}
          />
          {errors[name] && <p className="text-xs text-red-600">{errors[name]?.message}</p>}
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Descripción del servicio</label>
        <textarea
          rows={4}
          className="px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
          {...register('serviceDetails')}
        />
        {errors.serviceDetails && <p className="text-xs text-red-600">{errors.serviceDetails.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-[44px] px-6 bg-green-700 text-white rounded hover:bg-green-800 transition-colors text-sm font-medium disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando…' : 'Guardar configuración'}
      </button>
    </form>
  )
}

const STATUS_LABELS: Record<PizzaPartyRequest['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  rejected: 'Rechazada',
}

const STATUS_COLORS: Record<PizzaPartyRequest['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

function RequestCard({ req }: { req: PizzaPartyRequest }) {
  const [status, setStatus] = useState<PizzaPartyRequest['status']>(req.status)
  const [notes, setNotes] = useState(req.adminNotes ?? '')
  const { patchRequest } = useAdminPizzaParty()

  async function handleSave() {
    try {
      await patchRequest.mutateAsync({ id: req.id, data: { status, adminNotes: notes || null } })
      toast.success('Solicitud actualizada')
    } catch {
      toast.error('Error al actualizar solicitud')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex flex-wrap gap-2 items-start justify-between">
        <div>
          <p className="font-semibold text-gray-800">{req.name}</p>
          <p className="text-sm text-gray-500">{req.email} · {req.phone}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${STATUS_COLORS[req.status]}`}>
          {STATUS_LABELS[req.status]}
        </span>
      </div>
      <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
        <span>Fecha: {new Date(req.eventDate).toLocaleDateString('es-AR')}</span>
        <span>Invitados: {req.guests}</span>
        <span>Horas extra: {req.extraHours}</span>
        <span>Mozos extra: {req.extraMozzos}</span>
        <span className="col-span-2 font-medium">Total: ${req.totalPrice.toLocaleString('es-AR')}</span>
      </div>
      {req.message && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 whitespace-pre-wrap">{req.message}</p>
      )}
      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Estado</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as PizzaPartyRequest['status'])}
            className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="rejected">Rechazada</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Notas internas</label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notas para uso interno…"
            className="px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="min-h-[44px] px-4 bg-green-700 text-white rounded hover:bg-green-800 transition-colors text-sm font-medium"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

function RequestsSubTab() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { requests } = useAdminPizzaParty(statusFilter === 'all' ? undefined : statusFilter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Filtrar:</label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="rejected">Rechazadas</option>
        </select>
      </div>

      {requests.isLoading && <p className="text-gray-400 text-sm">Cargando solicitudes…</p>}

      {!requests.isLoading && requests.data?.length === 0 && (
        <p className="text-gray-500 text-sm">No hay solicitudes{statusFilter !== 'all' ? ' con este estado' : ''}.</p>
      )}

      {requests.data?.map(req => <RequestCard key={req.id} req={req} />)}
    </div>
  )
}

export default function PizzaPartyTab() {
  return (
    <Tabs defaultValue="config">
      <TabsList className="mb-4">
        <TabsTrigger value="config" className="min-h-[44px]">Configuración</TabsTrigger>
        <TabsTrigger value="requests" className="min-h-[44px]">Solicitudes</TabsTrigger>
      </TabsList>
      <TabsContent value="config">
        <ConfigSubTab />
      </TabsContent>
      <TabsContent value="requests">
        <RequestsSubTab />
      </TabsContent>
    </Tabs>
  )
}
