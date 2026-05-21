import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PizzaPartyCTASection() {
  return (
    <section
      className="relative flex items-center justify-center min-h-[260px] bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/pizzaparty.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 py-12">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white drop-shadow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Hacé tu Pizza Party con nosotros
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Link
            to="/pizza-party"
            className="flex items-center justify-center min-h-[44px] px-8 bg-[#C8522A] text-white font-semibold rounded-lg hover:bg-[#A8421E] transition-colors shadow-lg shadow-black/20"
          >
            Conocé más
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
