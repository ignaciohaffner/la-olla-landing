import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Phone, MapPin } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import ScrollReveal from '@/components/ScrollReveal'
import type { ContactPayload } from '@/types'

const ContactSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormData = z.infer<typeof ContactSchema>

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50'

const infoItems = [
  { icon: <Phone className="h-5 w-5 text-green-700 shrink-0" />, text: '3446-410459' },
  { icon: <MapPin className="h-5 w-5 text-green-700 shrink-0" />, text: 'Doello Jurado 1050, Gualeguaychú' },
]

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const payload: ContactPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
      }
      await apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) })
      toast.success('Mensaje enviado. Te respondemos pronto.')
      reset()
    } catch {
      toast.error('Ocurrió un error. Intentá de nuevo más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-12">
      {/* Info de contacto */}
      <section>
        <ScrollReveal>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">Contacto</h1>
        </ScrollReveal>

        <div className="flex flex-col gap-4">
          {infoItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 text-gray-700"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              {item.icon}
              <span className="text-base">{item.text}</span>
            </motion.div>
          ))}

          <motion.div
            className="flex gap-4 mt-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <a
              href="https://www.facebook.com/profile.php?id=100054471429554"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-green-700 hover:text-green-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/rotiserialaolla/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] text-green-700 hover:text-green-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Formulario */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2 className="text-xl font-bold text-green-800 mb-5">Envianos un mensaje</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
            <label className="text-sm font-medium text-gray-700">Teléfono (opcional)</label>
            <input type="tel" inputMode="tel" {...register('phone')} className={inputClass} disabled={isSubmitting} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Mensaje *</label>
            <textarea
              {...register('message')}
              rows={4}
              className={`${inputClass} h-auto resize-none`}
              disabled={isSubmitting}
            />
            {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center min-h-[44px] px-6 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </motion.section>

      {/* Mapa */}
      <ScrollReveal>
        <section>
          <h2 className="text-xl font-bold text-green-800 mb-4">Cómo llegar</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.8!2d-58.5167!3d-33.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDoello+Jurado+1050%2C+Gualeguaych%C3%BA!5e0!3m2!1ses!2sar!4v1"
            width="100%"
            className="h-[300px] md:h-[450px] border-0 rounded-xl"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Rotisería La Olla — Doello Jurado 1050, Gualeguaychú"
          />
        </section>
      </ScrollReveal>
    </div>
  )
}
