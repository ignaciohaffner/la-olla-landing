import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import ScrollReveal, { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'
import type { ContactPayload } from '@/types'

const ContactSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormData = z.infer<typeof ContactSchema>

const inputClass =
  'w-full rounded-lg border border-[#EDE5D8] bg-[#FAF7F2] px-3 py-2 text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 disabled:opacity-50 placeholder:text-stone-300'

const CONTACT_INFO = [
  {
    label: 'Teléfono',
    value: '3446-410459',
    href: 'tel:+543446410459',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Dirección',
    value: 'Maipú y Doello Jurado, Gualeguaychú',
    href: 'https://maps.google.com/?q=Doello+Jurado+1050+Gualeguaychú',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@rotiserialaolla',
    href: 'https://www.instagram.com/rotiserialaolla/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    value: 'Rotisería La Olla',
    href: 'https://www.facebook.com/profile.php?id=100054471429554',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
]

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

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
      setSent(true)
    } catch {
      toast.error('Ocurrió un error. Intentá de nuevo más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-[#1B4332] px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-[#C8522A] text-xs uppercase tracking-[0.2em] font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Rotisería La Olla
          </motion.p>
          <motion.h1
            className="text-3xl md:text-4xl font-semibold text-white"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.07 }}
          >
            Contacto
          </motion.h1>
          <motion.p
            className="text-white/50 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Estamos para ayudarte
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-12">

        {/* Info de contacto */}
        <section>
          <ScrollReveal>
            <h2
              className="text-xl font-semibold text-[#1B4332] mb-6"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              Encontranos
            </h2>
          </ScrollReveal>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {CONTACT_INFO.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                variants={fadeUpItem}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-[#FAF7F2] border border-[#EDE5D8] hover:border-[#1B4332]/30 hover:bg-white transition-colors group"
              >
                <span className="text-[#1B4332] group-hover:text-[#C8522A] transition-colors shrink-0">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-[#1C1A18] font-medium mt-0.5">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </section>

        {/* Formulario */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-xl font-semibold text-[#1B4332] mb-6"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            Envianos un mensaje
          </h2>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-[#1B4332]/6 border border-[#1B4332]/20 p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-semibold text-[#1B4332] mb-1" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                Mensaje enviado
              </p>
              <p className="text-stone-500 text-sm">Te respondemos a la brevedad.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-[#1B4332] underline underline-offset-2 hover:text-[#C8522A] transition-colors"
              >
                Enviar otro mensaje
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nombre *</label>
                  <input {...register('name')} className={inputClass} disabled={isSubmitting} placeholder="Tu nombre" />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Teléfono</label>
                  <input type="tel" inputMode="tel" {...register('phone')} className={inputClass} disabled={isSubmitting} placeholder="Opcional" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Email *</label>
                <input type="email" {...register('email')} className={inputClass} disabled={isSubmitting} placeholder="tu@email.com" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Mensaje *</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className={`${inputClass} h-auto resize-none`}
                  disabled={isSubmitting}
                  placeholder="¿En qué te podemos ayudar?"
                />
                {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center min-h-[48px] px-6 bg-[#1B4332] text-white font-semibold rounded-lg hover:bg-[#2D6A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </motion.section>

        {/* Mapa */}
        <ScrollReveal>
          <section>
            <h2
              className="text-xl font-semibold text-[#1B4332] mb-4"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              Cómo llegar
            </h2>
            <p className="text-stone-500 text-sm mb-4">Maipú y Doello Jurado, Gualeguaychú, Entre Ríos</p>
            <div className="rounded-xl overflow-hidden border border-[#EDE5D8] shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.8!2d-58.5167!3d-33.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDoello+Jurado+1050%2C+Gualeguaych%C3%BA!5e0!3m2!1ses!2sar!4v1"
                width="100%"
                className="h-[280px] md:h-[380px] border-0 block"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Rotisería La Olla"
              />
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
