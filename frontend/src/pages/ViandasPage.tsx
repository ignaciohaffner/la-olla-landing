import { Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWeeklyMenu } from '@/hooks/useWeeklyMenu'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Link } from 'react-router-dom'
import ScrollReveal, { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'

const DAY_NAMES: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes',
}

const BENEFITS = [
  'Menú variado que cambia cada semana',
  'Ingredientes frescos, cocina casera',
  'Retiro en local o envío en zona',
  'Podés pedir para varios días a la vez',
]

export default function ViandasPage() {
  const { data, isLoading } = useWeeklyMenu()
  const hasMenu = !isLoading && data && data.length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-14">
      {/* Cómo funciona */}
      <section>
        <ScrollReveal>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">Servicio de Viandas</h1>
        </ScrollReveal>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {[
            {
              icon: <Calendar className="h-6 w-6 text-green-700 mt-0.5 shrink-0" />,
              title: 'Pedidos semanales',
              desc: 'Elegí los días que querés comer y pedí antes del lunes. Tenemos menú diferente cada día.',
            },
            {
              icon: <Clock className="h-6 w-6 text-green-700 mt-0.5 shrink-0" />,
              title: 'Horario de retiro',
              desc: 'Las viandas están listas de 12:00 a 14:00. También podés coordinar envío en la zona.',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUpItem}
              className="flex gap-4 items-start bg-green-50 rounded-xl p-5"
            >
              {card.icon}
              <div>
                <h3 className="font-semibold text-green-800 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Menú de la semana */}
      <section>
        <ScrollReveal>
          <h2 className="text-xl font-bold text-green-800 mb-4">Menú de esta semana</h2>
        </ScrollReveal>

        {isLoading && <p className="text-gray-400 text-sm">Cargando menú...</p>}

        {!hasMenu && !isLoading && (
          <ScrollReveal delay={0.1}>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 flex flex-col gap-4 items-start">
              <p className="text-gray-700">Consultá el menú de esta semana por WhatsApp.</p>
              <a
                href="https://wa.me/543446410459"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[44px] px-6 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
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
                  <AccordionTrigger className="min-h-[44px] text-base font-medium">
                    {DAY_NAMES[day.dayOfWeek] ?? `Día ${day.dayOfWeek}`}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 pl-2">
                      {day.dishes.map((dish, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">• {dish}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        )}
      </section>

      {/* Beneficios */}
      <section>
        <ScrollReveal>
          <h2 className="text-xl font-bold text-green-800 mb-4">¿Por qué elegirnos?</h2>
        </ScrollReveal>
        <motion.ul
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {BENEFITS.map((benefit) => (
            <motion.li
              key={benefit}
              variants={fadeUpItem}
              className="flex items-start gap-2 text-gray-700"
            >
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              {benefit}
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="flex flex-col md:flex-row gap-3">
          <Link
            to="/contacto"
            className="flex items-center justify-center min-h-[44px] px-6 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            Contactanos
          </Link>
          <a
            href="https://wa.me/543446410459"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[44px] px-6 border border-green-700 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
          >
            Escribir por WhatsApp
          </a>
        </section>
      </ScrollReveal>
    </div>
  )
}
