import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUpItem } from '@/components/ScrollReveal'

const SPECIALTIES = [
  {
    image: '/assets/chuletaconpapas.jpeg',
    title: 'Comidas Caseras',
    description: 'Platos del día elaborados con ingredientes frescos, listos para llevar.',
    to: '/menu',
  },
  {
    image: '/assets/pizzapalmitos.jpeg',
    title: 'Pizzas Artesanales',
    description: '13 variedades de pizza con masa propia, horneadas al momento.',
    to: '/menu',
  },
  {
    image: '/assets/pizzaparty2.jpeg',
    title: 'Pizza Party',
    description: 'Llevamos el horno a tu evento. Ideal para cumpleaños y reuniones.',
    to: '/pizza-party',
  },
]

export default function SpecialtiesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-green-800 text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Nuestras Especialidades
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {SPECIALTIES.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUpItem}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white"
            >
              <div className="overflow-hidden h-48">
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="p-4 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm flex-1">{item.description}</p>
                <Link
                  to={item.to}
                  className="flex items-center justify-center min-h-[44px] px-4 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Ver más
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
