import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePizzaPartyConfig } from '@/hooks/usePizzaPartyConfig'
import Carousel from '@/components/Carousel'
import ScrollReveal, { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'
import PriceCalculator from './PriceCalculator'
import RequestForm from './RequestForm'
import type { CalculatorValues } from '@/types'
import { Check, X, Plus } from 'lucide-react'

const CAROUSEL_IMAGES = [
  { src: '/assets/pizzaparty.jpg', alt: 'Pizza Party en acción' },
  { src: '/assets/pizzaparty2.jpeg', alt: 'Pizza Party 2' },
  { src: '/assets/pizzaparty3.jpeg', alt: 'Pizza Party 3' },
  { src: '/assets/pizzaparty4.jpeg', alt: 'Pizza Party 4' },
]

const INCLUDES = [
  'Empanadas de copetín',
  '13 variedades de pizza',
  'Horno móvil a leña',
  'Vajilla descartable',
  '3 horas de servicio',
]
const EXCLUDES = ['Bebidas', 'Mesas y sillas', 'Vasos']
const EXTRAS = ['Hora adicional', 'Mozos adicionales']

export default function PizzaPartyPage() {
  const { data: config, isLoading, error } = usePizzaPartyConfig()
  const formRef = useRef<HTMLDivElement>(null)

  const [calcValues, setCalcValues] = useState<CalculatorValues>({
    guests: config?.minimumGuests ?? 20,
    extraHours: 0,
    extraMozzos: 0,
  })

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <Carousel images={CAROUSEL_IMAGES} />

      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-14">
        {/* Descripción del servicio */}
        <section>
          <ScrollReveal>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
              Servicio de Pizza Party
            </h1>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <motion.div variants={fadeUpItem}>
              <h3 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                <Check className="h-4 w-4" /> Incluye
              </h3>
              <ul className="space-y-1">
                {INCLUDES.map((item) => (
                  <li key={item} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <h3 className="flex items-center gap-2 font-semibold text-red-600 mb-3">
                <X className="h-4 w-4" /> No incluye
              </h3>
              <ul className="space-y-1">
                {EXCLUDES.map((item) => (
                  <li key={item} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <h3 className="flex items-center gap-2 font-semibold text-blue-600 mb-3">
                <Plus className="h-4 w-4" /> Extras
              </h3>
              <ul className="space-y-1">
                {EXTRAS.map((item) => (
                  <li key={item} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </section>

        {/* Calculadora */}
        {isLoading && <p className="text-gray-400 text-sm">Cargando precios...</p>}
        {error && !isLoading && (
          <p className="text-gray-500">
            No pudimos cargar los precios.{' '}
            <a href="https://wa.me/543446410459" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">
              Consultanos por WhatsApp.
            </a>
          </p>
        )}
        {config && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <PriceCalculator
              config={config}
              values={{ ...calcValues, guests: Math.max(config.minimumGuests, calcValues.guests) }}
              onChange={setCalcValues}
              onRequestClick={scrollToForm}
            />
          </motion.div>
        )}

        {/* Formulario */}
        <ScrollReveal>
          <div ref={formRef} className="border-t pt-10">
            <RequestForm calculatorValues={calcValues} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
