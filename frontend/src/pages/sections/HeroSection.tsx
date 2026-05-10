import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section ref={ref} className="relative flex items-center justify-center h-[100vh] md:h-[80vh] overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/assets/chuletaconpapas.jpeg')", y: bgY }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 gap-6"
        style={{ opacity }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.img
          src="/logo.png"
          alt="Rotisería La Olla"
          className="h-20 w-auto drop-shadow-lg"
          variants={item}
        />
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white drop-shadow-md"
          variants={item}
        >
          Rotisería La Olla
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/90 max-w-sm drop-shadow"
          variants={item}
        >
          Comida casera y pizzas artesanales en Gualeguaychú
        </motion.p>
        <motion.div
          className="flex flex-col md:flex-row gap-3 w-full max-w-xs md:max-w-none md:justify-center"
          variants={item}
        >
          <Link
            to="/menu"
            className="flex items-center justify-center min-h-[44px] px-6 bg-yellow-400 text-green-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Ver Menú
          </Link>
          <Link
            to="/pizza-party"
            className="flex items-center justify-center min-h-[44px] px-6 bg-white/10 border border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            Pizza Party
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ opacity }}
      >
        <motion.div
          className="w-0.5 h-8 bg-white/60 rounded-full origin-top"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
