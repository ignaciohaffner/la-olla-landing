import { motion } from 'framer-motion'
import { useOffers } from '@/hooks/useOffers'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function OffersSection() {
  const { data, isLoading, error } = useOffers()

  if (isLoading || error || !data || data.length === 0) return null

  return (
    <section className="py-16 px-4 bg-yellow-50">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-green-800 text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ofertas
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {data.map((offer) => (
            <motion.div
              key={offer.id}
              variants={fadeUpItem}
              whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-sm border border-yellow-100 p-5 flex flex-col gap-3"
            >
              <Badge className="self-start bg-yellow-400 text-green-900 hover:bg-yellow-400">
                {offer.badge}
              </Badge>
              <h3 className="font-semibold text-gray-800 text-lg leading-tight">{offer.title}</h3>
              <p className="text-gray-500 text-sm flex-1">{offer.description}</p>
              <p className="text-xs text-gray-400">Válido hasta {formatDate(offer.validTo)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
