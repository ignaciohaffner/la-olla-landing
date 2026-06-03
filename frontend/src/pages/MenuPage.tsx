import { motion, AnimatePresence } from 'framer-motion'
import { useMenu } from '@/hooks/useMenu'
import { useState } from 'react'
import ScheduleSection from './sections/ScheduleSection'
import type { MenuItem } from '@/types'

function MenuItemRow({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.li
      className="flex items-baseline gap-2 py-2.5 border-b border-[#EDE5D8] last:border-0 group"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, delay: index * 0.035 }}
    >
      <span className="text-[#1C1A18] text-sm flex-1">{item.name}</span>
      {item.description && (
        <span className="text-stone-400 text-xs hidden sm:inline truncate max-w-[160px]">
          {item.description}
        </span>
      )}
      {/* Dotted leader */}
      <span className="flex-1 border-b border-dotted border-[#D4C4B0] mx-1 mb-0.5 min-w-4" />
      <span className="text-[#1B4332] text-sm font-semibold shrink-0 tabular-nums">
        ${item.price.toLocaleString('es-AR')}
      </span>
    </motion.li>
  )
}

export default function MenuPage() {
  const { data, isLoading, error } = useMenu()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const activeCategory = activeSlug ?? (data?.[0]?.category.slug ?? null)

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
            Nuestro Menú
          </motion.h1>
          <motion.p
            className="text-white/50 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Precios actualizados · Gualeguaychú
          </motion.p>
        </div>
      </div>

      <ScheduleSection />

      <section className="py-10 px-4 max-w-3xl mx-auto">
        {isLoading && <p className="text-stone-400 text-sm">Cargando menú...</p>}
        {error && !isLoading && (
          <p className="text-stone-500">No pudimos cargar el menú. Intentá de nuevo más tarde.</p>
        )}
        {data && data.length === 0 && (
          <p className="text-stone-400">No hay categorías disponibles.</p>
        )}

        {data && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {/* Category pills */}
            <div className="overflow-x-auto -mx-4 px-4 mb-8">
              <div className="flex gap-2 w-max">
                {data.map(({ category }) => {
                  const isActive = activeCategory === category.slug
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => setActiveSlug(category.slug)}
                      className={`min-h-[40px] px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#1B4332] text-white shadow-sm'
                          : 'bg-[#FAF7F2] text-stone-600 hover:bg-[#EDE5D8]'
                      }`}
                    >
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Items */}
            <AnimatePresence mode="wait">
              {data.map(({ category, items }) => {
                if (category.slug !== activeCategory) return null

                const pricedItems = items.filter(i => i.price > 0)
                const freeItems = items.filter(i => i.price === 0)

                return (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    {pricedItems.length > 0 && (
                      <ul className="mb-6">
                        {pricedItems.map((item, i) => (
                          <MenuItemRow key={item.id} item={item} index={i} />
                        ))}
                      </ul>
                    )}

                    {freeItems.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                          Variedades disponibles
                        </h3>
                        <ul className="columns-1 sm:columns-2 gap-x-6 space-y-1">
                          {freeItems.map((item, i) => (
                            <motion.li
                              key={item.id}
                              className="text-sm text-stone-700 py-1 border-b border-[#EDE5D8] break-inside-avoid"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.04 }}
                            >
                              {item.name}
                              {item.description && (
                                <span className="text-stone-400 text-xs ml-1.5">— {item.description}</span>
                              )}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  )
}
