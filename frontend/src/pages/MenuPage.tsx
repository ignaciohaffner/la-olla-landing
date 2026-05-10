import { motion, AnimatePresence } from 'framer-motion'
import { useMenu } from '@/hooks/useMenu'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ScheduleSection from './sections/ScheduleSection'
import type { MenuItem } from '@/types'

function PricedItem({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.li
      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <span className="text-gray-700">{item.name}</span>
      <span className="text-gray-500 text-sm font-medium ml-4 shrink-0">
        ${item.price.toLocaleString('es-AR')}
      </span>
    </motion.li>
  )
}

export default function MenuPage() {
  const { data, isLoading, error } = useMenu()

  return (
    <div>
      <ScheduleSection />

      <section className="py-10 px-4 max-w-3xl mx-auto">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-green-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Menú
        </motion.h1>

        {isLoading && <p className="text-gray-400 text-sm">Cargando menú...</p>}
        {error && !isLoading && (
          <p className="text-gray-500">No pudimos cargar el menú. Intentá de nuevo más tarde.</p>
        )}
        {data && data.length === 0 && (
          <p className="text-gray-400">No hay categorías disponibles.</p>
        )}

        {data && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs defaultValue={data[0].category.slug}>
              <div className="overflow-x-auto -mx-4 px-4">
                <TabsList className="flex w-max gap-1 h-auto p-1 mb-6">
                  {data.map(({ category }) => (
                    <TabsTrigger
                      key={category.slug}
                      value={category.slug}
                      className="min-h-[44px] px-4 whitespace-nowrap"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {data.map(({ category, items }) => {
                const pricedItems = items.filter((i) => i.price > 0)
                const freeItems = items.filter((i) => i.price === 0)

                return (
                  <TabsContent key={category.slug} value={category.slug}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={category.slug}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        {pricedItems.length > 0 && (
                          <ul className="mb-6">
                            {pricedItems.map((item, i) => (
                              <PricedItem key={item.id} item={item} index={i} />
                            ))}
                          </ul>
                        )}

                        {freeItems.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Variedades disponibles
                            </h3>
                            <ul className="divide-y divide-gray-100">
                              {freeItems.map((item, i) => (
                                <motion.li
                                  key={item.id}
                                  className="py-2 text-gray-700"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  {item.name}
                                  {item.description && (
                                    <span className="text-gray-400 text-sm ml-2">— {item.description}</span>
                                  )}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>
                )
              })}
            </Tabs>
          </motion.div>
        )}
      </section>
    </div>
  )
}
