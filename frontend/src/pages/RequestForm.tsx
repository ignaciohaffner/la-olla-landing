import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'
import type { CalculatorValues, PizzaPartyRequestPayload } from '@/types'

const RequestSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Teléfono requerido'),
  eventDate: z.string().min(1, 'Fecha requerida'),
  message: z.string().optional(),
})

type RequestFormData = z.infer<typeof RequestSchema>

interface RequestFormProps {
  calculatorValues: CalculatorValues
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50'

export default function RequestForm({ calculatorValues }: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(RequestSchema),
  })

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true)
    try {
      const payload: PizzaPartyRequestPayload = {
        ...data,
        guests: calculatorValues.guests,
        extraHours: calculatorValues.extraHours,
        extraMozzos: calculatorValues.extraMozzos,
      }
      await apiFetch('/api/pizza-party/request', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      toast.success('¡Solicitud enviada! Te contactamos pronto.')
      reset()
    } catch {
      toast.error('Hubo un error. Contactanos por WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <h2 className="text-xl font-bold text-green-800">Solicitá el servicio</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Nombre *</label>
        <input {...register('name')} className={inputClass} disabled={isSubmitting} />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email *</label>
        <input type="email" {...register('email')} className={inputClass} disabled={isSubmitting} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Teléfono *</label>
        <input type="tel" inputMode="tel" {...register('phone')} className={inputClass} disabled={isSubmitting} />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Fecha del evento *</label>
        <input type="date" {...register('eventDate')} className={inputClass} disabled={isSubmitting} />
        {errors.eventDate && <p className="text-red-500 text-xs">{errors.eventDate.message}</p>}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
        <p>Invitados: <strong className="text-gray-700">{calculatorValues.guests}</strong></p>
        <p>Horas extra: <strong className="text-gray-700">{calculatorValues.extraHours}</strong></p>
        <p>Mozos adicionales: <strong className="text-gray-700">{calculatorValues.extraMozzos}</strong></p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Mensaje (opcional)</label>
        <textarea
          {...register('message')}
          rows={3}
          className={`${inputClass} h-auto resize-none`}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center min-h-[44px] px-6 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  )
}
