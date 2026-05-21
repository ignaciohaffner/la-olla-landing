import { motion } from 'framer-motion'

const STATS = [
  {
    value: '25',
    unit: 'años',
    label: 'siendo un negocio de confianza en Gualeguaychú',
  },
  {
    value: '13',
    unit: 'variedades',
    label: 'de pizza artesanal con masa propia',
  },
  {
    value: '100%',
    unit: '',
    label: 'casero, con ingredientes frescos todos los días',
  },
]

export default function TrustSection() {
  return (
    <section className="bg-[#1B4332] py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.value}
              className="flex flex-col items-center text-center gap-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
              }}
            >
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-5xl md:text-6xl font-bold text-white leading-none"
                  style={{ fontFamily: 'Lora, Georgia, serif' }}
                >
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-lg text-[#C8522A] font-semibold">{stat.unit}</span>
                )}
              </div>
              <p className="text-sm text-white/55 leading-relaxed max-w-[200px]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
