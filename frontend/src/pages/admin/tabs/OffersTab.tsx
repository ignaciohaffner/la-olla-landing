import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Switch } from '../../../components/ui/switch'
import { Badge } from '../../../components/ui/badge'
import { useAdminOffers } from '../../../hooks/admin/useAdminOffers'

const offerSchema = z
  .object({
    title: z.string().min(1, 'Requerido'),
    description: z.string().min(1, 'Requerido'),
    badge: z.string().optional(),
    validFrom: z.string().min(1, 'Requerido'),
    validTo: z.string().min(1, 'Requerido'),
    active: z.boolean().default(true),
  })
  .refine(d => d.validTo >= d.validFrom, {
    message: 'Fecha fin debe ser ≥ fecha inicio',
    path: ['validTo'],
  })

type OfferFormData = z.infer<typeof offerSchema>

export default function OffersTab() {
  const { data, isLoading, createOffer, patchOffer, deleteOffer } = useAdminOffers()
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: { active: true },
  })

  async function handleToggleActive(id: number, current: boolean) {
    try {
      await patchOffer.mutateAsync({ id, data: { active: !current } })
      toast.success('Oferta actualizada')
    } catch {
      toast.error('Error al actualizar oferta')
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteOffer.mutateAsync(id)
      setConfirmDelete(null)
      toast.success('Oferta eliminada')
    } catch {
      toast.error('Error al eliminar oferta')
    }
  }

  async function onSubmit(formData: OfferFormData) {
    try {
      await createOffer.mutateAsync({
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
        badge: formData.badge || undefined,
      })
      reset({ active: true })
      toast.success('Oferta creada')
    } catch {
      toast.error('Error al crear oferta')
    }
  }

  if (isLoading) return <p className="text-gray-400 text-sm">Cargando ofertas…</p>

  return (
    <div className="space-y-6">
      {/* Offers list */}
      <div className="space-y-3">
        {data?.length === 0 && (
          <p className="text-gray-500 text-sm">No hay ofertas creadas.</p>
        )}
        {data?.map(offer => (
          <div key={offer.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800">{offer.title}</span>
                {offer.badge && <Badge variant="secondary">{offer.badge}</Badge>}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={offer.active}
                  onCheckedChange={() => handleToggleActive(offer.id, offer.active)}
                />
                <span className="text-xs text-gray-500">{offer.active ? 'Activa' : 'Inactiva'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{offer.description}</p>
            <p className="text-xs text-gray-400">
              {new Date(offer.validFrom).toLocaleDateString('es-AR')} →{' '}
              {new Date(offer.validTo).toLocaleDateString('es-AR')}
            </p>
            <div className="mt-3">
              {confirmDelete === offer.id ? (
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-red-600">¿Eliminar?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(offer.id)}
                    className="min-h-[36px] px-3 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    className="min-h-[36px] px-3 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(offer.id)}
                  className="text-xs text-red-500 hover:text-red-700 min-h-[36px]"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create offer form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">Nueva oferta</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título *</label>
            <input
              type="text"
              className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
              {...register('title')}
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descripción *</label>
            <textarea
              rows={2}
              className="px-3 py-2 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Badge (opcional)</label>
            <input
              type="text"
              placeholder="ej: HOT, 2×1, NUEVO"
              className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
              {...register('badge')}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-gray-700">Válida desde *</label>
              <input
                type="date"
                className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                {...register('validFrom')}
              />
              {errors.validFrom && <p className="text-xs text-red-600">{errors.validFrom.message}</p>}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-gray-700">Válida hasta *</label>
              <input
                type="date"
                className="min-h-[44px] px-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-green-600"
                {...register('validTo')}
              />
              {errors.validTo && <p className="text-xs text-red-600">{errors.validTo.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Switch
                  id="active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label htmlFor="active" className="text-sm text-gray-700">Activa al crear</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] px-6 bg-green-700 text-white rounded hover:bg-green-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Creando…' : 'Crear oferta'}
          </button>
        </form>
      </div>
    </div>
  )
}
