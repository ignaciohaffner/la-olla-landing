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
    <section ref={ref} className="relative flex items-center justify-center h-[100vh] md:h-[85vh] overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/assets/chuletaconpapas.jpeg')", y: bgY }}
      />

      {/* Gradient overlay — less opaque than before, lets food show through */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-[#1B4332]/75" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 gap-5"
        style={{ opacity }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.img
          src="/logo.png"
          alt="Rotisería La Olla"
          className="h-24 w-auto drop-shadow-xl ring-2 ring-white/15 rounded-full p-1"
          variants={item}
        />

        <motion.span
          className="text-xs uppercase tracking-[0.2em] text-white/70 font-medium"
          variants={item}
        >
          Gualeguaychú, Entre Ríos
        </motion.span>

        <motion.h1
          className="text-5xl md:text-6xl font-semibold text-white drop-shadow-lg leading-tight"
          style={{ fontFamily: 'Lora, Georgia, serif' }}
          variants={item}
        >
          Rotisería La Olla
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-white/80 max-w-sm leading-relaxed"
          variants={item}
        >
          Comida casera y pizzas artesanales
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row gap-3 w-full max-w-xs md:max-w-none md:justify-center mt-1"
          variants={item}
        >
          <Link
            to="/menu"
            className="flex items-center justify-center min-h-[48px] px-8 bg-[#C8522A] text-white font-semibold rounded-lg hover:bg-[#A8421E] transition-colors shadow-lg shadow-black/20 text-sm tracking-wide"
          >
            Ver Menú
          </Link>
          <Link
            to="/pizza-party"
            className="flex items-center justify-center min-h-[48px] px-8 bg-white/10 border border-white/50 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-sm tracking-wide backdrop-blur-sm"
          >
            Pizza Party
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — double chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{ opacity }}
      >
        {[0, 1].map((i) => (
          <motion.svg
            key={i}
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            className="text-white/50"
            animate={{ y: [0, 4, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.2, ease: 'easeInOut' }}
          >
            <path d="M2 2l8 8 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        ))}
      </motion.div>
    </section>
  )
}
