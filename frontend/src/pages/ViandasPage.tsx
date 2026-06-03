import { motion } from 'framer-motion'
import { useWeeklyMenu } from '@/hooks/useWeeklyMenu'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import ScrollReveal, { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'

const DAY_NAMES: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado',
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pedís la semana anterior',
    description: 'Los pedidos se cierran el viernes. Confirmás los días que querés y la cantidad de viandas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Cocinamos para vos',
    description: 'Menú diferente cada día, con ingredientes frescos. Cocina casera de verdad.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v4M10 1v4M14 1v4" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Retirás o recibís',
    description: 'Pasás a buscar de 12 a 14 hs, o coordinamos envío a domicilio en la zona.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

const BENEFITS = [
  { label: 'Menú variado', detail: 'Cambia cada semana, nunca repetís.' },
  { label: 'Cocina casera', detail: 'Ingredientes frescos, sin conservantes.' },
  { label: 'Lunes a viernes o sábado', detail: 'Elegís los días que necesitás.' },
  { label: 'Delivery disponible', detail: 'Retiro en local o envío en zona.' },
]

export default function ViandasPage() {
  const { data, isLoading } = useWeeklyMenu()
  const hasMenu = !isLoading && data && data.length > 0

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
            Servicio de Viandas
          </motion.h1>
          <motion.p
            className="text-white/50 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Comida casera para toda la semana · Gualeguaychú
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-14">

        {/* Cómo funciona */}
        <section>
          <ScrollReveal>
            <h2
              className="text-xl md:text-2xl font-semibold text-[#1B4332] mb-8"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              ¿Cómo funciona?
            </h2>
          </ScrollReveal>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {HOW_IT_WORKS.map((step) => (
              <motion.div
                key={step.step}
                variants={fadeUpItem}
                className="bg-[#FAF7F2] border border-[#EDE5D8] rounded-xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-[#1B4332] text-white flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span
                    className="text-3xl font-bold text-[#EDE5D8]"
                    style={{ fontFamily: 'Lora, Georgia, serif' }}
                  >
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-semibold text-[#1C1A18] mb-1 text-sm"
                    style={{ fontFamily: 'Lora, Georgia, serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Menú de la semana */}
        <section>
          <ScrollReveal>
            <h2
              className="text-xl md:text-2xl font-semibold text-[#1B4332] mb-2"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              Menú de esta semana
            </h2>
            <p className="text-stone-500 text-sm mb-6">
              Recordá que los pedidos se hacen la semana anterior.
            </p>
          </ScrollReveal>

          {isLoading && <p className="text-stone-400 text-sm">Cargando menú...</p>}

          {!hasMenu && !isLoading && (
            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-[#EDE5D8] bg-[#FAF7F2] p-6 flex flex-col gap-4 items-start">
                <p className="text-stone-600 text-sm">El menú de esta semana todavía no fue publicado. Consultanos por WhatsApp.</p>
                <a
                  href="https://wa.me/543446410459"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 min-h-[44px] px-6 bg-[#C8522A] text-white font-semibold rounded-lg hover:bg-[#A8421E] transition-colors text-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L0 24l6.335-1.506A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.502-5.176-1.382l-.372-.22-3.76.894.944-3.654-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </ScrollReveal>
          )}

          {hasMenu && (
            <ScrollReveal delay={0.1}>
              <Accordion openMultiple={false}>
                {data.map((day) => (
                  <AccordionItem key={day.id} value={String(day.id)}>
                    <AccordionTrigger className="min-h-[48px] text-sm font-medium text-[#1C1A18] hover:text-[#1B4332]">
                      {DAY_NAMES[day.dayOfWeek] ?? `Día ${day.dayOfWeek}`}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1.5 pl-1 pb-2">
                        {day.dishes.map((dish, idx) => (
                          <li key={idx} className="text-stone-600 text-sm flex items-start gap-2">
                            <span className="text-[#C8522A] mt-0.5 shrink-0">•</span>
                            {dish}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          )}
        </section>

        {/* Por qué elegirnos */}
        <section>
          <ScrollReveal>
            <h2
              className="text-xl md:text-2xl font-semibold text-[#1B4332] mb-6"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              ¿Por qué elegirnos?
            </h2>
          </ScrollReveal>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {BENEFITS.map((b) => (
              <motion.div
                key={b.label}
                variants={fadeUpItem}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#EDE5D8]"
              >
                <span className="w-5 h-5 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1C1A18]">{b.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{b.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <ScrollReveal>
          <section className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/543446410459"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 min-h-[48px] px-6 bg-[#C8522A] text-white font-semibold rounded-lg hover:bg-[#A8421E] transition-colors text-sm shadow-md shadow-[#C8522A]/20"
            >
              Pedir mis viandas
            </a>
            <Link
              to="/contacto"
              className="flex items-center justify-center min-h-[48px] px-6 border border-[#1B4332] text-[#1B4332] font-semibold rounded-lg hover:bg-[#FAF7F2] transition-colors text-sm"
            >
              Más información
            </Link>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
