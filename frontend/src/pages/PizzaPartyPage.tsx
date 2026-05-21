import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePizzaPartyConfig } from '@/hooks/usePizzaPartyConfig'
import Carousel from '@/components/Carousel'
import ScrollReveal, { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'
import PriceCalculator from './PriceCalculator'
import PizzaPartyServiceSection from './sections/PizzaPartyServiceSection'
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
  'Horno móvil',
  'Platos, cubiertos y servilletas',
  '3 horas de servicio',
]
const EXCLUDES = ['Bebidas', 'Mesas y sillas', 'Vasos']
const EXTRAS = ['Hora adicional', 'Mozos adicionales']

export default function PizzaPartyPage() {
  const { data: config, isLoading, error } = usePizzaPartyConfig()

  const [calcValues, setCalcValues] = useState<CalculatorValues>({
    guests: config?.minimumGuests ?? 20,
    extraHours: 0,
    extraMozzos: 0,
  })

  return (
    <div>
      <Carousel images={CAROUSEL_IMAGES} />

      {/* Descripción del servicio */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <ScrollReveal>
          <h1
            className="text-2xl md:text-3xl font-semibold text-[#1B4332] mb-6"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
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
            <h3 className="flex items-center gap-2 font-semibold text-[#1B4332] mb-3 text-sm">
              <Check className="h-4 w-4" /> Incluye
            </h3>
            <ul className="space-y-1.5">
              {INCLUDES.map((item) => (
                <li key={item} className="text-sm text-stone-600">• {item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpItem}>
            <h3 className="flex items-center gap-2 font-semibold text-red-600 mb-3 text-sm">
              <X className="h-4 w-4" /> No incluye
            </h3>
            <ul className="space-y-1.5">
              {EXCLUDES.map((item) => (
                <li key={item} className="text-sm text-stone-600">• {item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpItem}>
            <h3 className="flex items-center gap-2 font-semibold text-[#C8522A] mb-3 text-sm">
              <Plus className="h-4 w-4" /> Extras
            </h3>
            <ul className="space-y-1.5">
              {EXTRAS.map((item) => (
                <li key={item} className="text-sm text-stone-600">• {item}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Ocasiones + Timeline — full width con sus propios fondos */}
      <PizzaPartyServiceSection />

      {/* Cotizador */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {isLoading && <p className="text-gray-400 text-sm">Cargando configuración...</p>}
        {error && !isLoading && (
          <p className="text-stone-500">
            No pudimos cargar la info.{' '}
            <a href="https://wa.me/543446410459" className="text-[#1B4332] underline" target="_blank" rel="noopener noreferrer">
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
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
