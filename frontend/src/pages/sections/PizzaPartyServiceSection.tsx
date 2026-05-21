import { motion } from 'framer-motion'

const OCCASIONS = [
  {
    title: 'Cumpleaños y fiestas',
    description: 'El show del horno en vivo se convierte en el centro de la celebración.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M12 3v-.5M12 3c0-.828.448-1.5 1-1.5" />
      </svg>
    ),
  },
  {
    title: 'Reuniones familiares',
    description: 'Comida abundante y variada para todas las edades, sin que nadie tenga que cocinar.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Eventos corporativos',
    description: 'Una experiencia diferente para team buildings, cierres de año o kick-offs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
]

const TIMELINE = [
  {
    time: '30 min antes',
    title: 'Llegamos y armamos',
    description: 'Traemos el horno móvil y todo el equipamiento. Nos instalamos en tu espacio sin que tengas que mover un dedo.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    time: 'Al inicio',
    title: 'Empanadas de copetín',
    description: 'Mientras el horno alcanza temperatura, servimos las empanadas de copetín para que los invitados ya empiecen a disfrutar.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    time: 'Las 3 horas',
    title: 'Pizza en vivo',
    description: 'Pizzas horneadas al momento, de corrido. Los invitados eligen entre las 13 variedades y nosotros las servimos frescas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 000 20" />
        <path d="M2 12h20" />
        <path d="M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10" />
      </svg>
    ),
  },
  {
    time: 'Al finalizar',
    title: 'Retiro y limpieza',
    description: 'Levantamos todo y dejamos el espacio como estaba. Vos solo te ocupás de disfrutar.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' } }),
}

export default function PizzaPartyServiceSection() {
  return (
    <>
      {/* ── Ideal para ── */}
      <section className="bg-[#1B4332] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-2xl md:text-3xl font-semibold text-white mb-3"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              ¿Para qué ocasión?
            </h2>
            <p className="text-white/50 text-sm">
              El Pizza Party se adapta a cualquier reunión
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {OCCASIONS.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="flex gap-4 items-start bg-white/6 hover:bg-white/10 transition-colors rounded-xl p-4 border border-white/8"
              >
                <div className="text-[#C8522A] shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3
                    className="text-white font-semibold text-sm mb-1"
                    style={{ fontFamily: 'Lora, Georgia, serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/55 text-xs leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── El día del evento ── */}
      <section className="bg-[#FAF7F2] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-2xl md:text-3xl font-semibold text-[#1B4332] mb-3"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              El día del evento
            </h2>
            <p className="text-stone-500 text-sm">Así funciona el servicio de principio a fin</p>
          </motion.div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:grid grid-cols-4 gap-0 relative">
            {/* Connector line */}
            <div className="absolute top-[2.25rem] left-[calc(12.5%+1.25rem)] right-[calc(12.5%+1.25rem)] h-px bg-[#EDE5D8]" />

            {TIMELINE.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="flex flex-col items-center text-center px-3 relative"
              >
                <div className="relative z-10 w-[2.75rem] h-[2.75rem] rounded-full bg-[#1B4332] text-white flex items-center justify-center mb-4 shadow-md shadow-[#1B4332]/20">
                  {step.icon}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#C8522A] font-semibold mb-1">
                  {step.time}
                </span>
                <h3
                  className="text-sm font-semibold text-[#1C1A18] mb-1.5 leading-snug"
                  style={{ fontFamily: 'Lora, Georgia, serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden flex flex-col gap-0 relative">
            <div className="absolute left-[1.375rem] top-[2.75rem] bottom-[2.75rem] w-px bg-[#EDE5D8]" />

            {TIMELINE.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-30px' }}
                className="flex gap-5 pb-8 last:pb-0"
              >
                <div className="relative z-10 w-11 h-11 shrink-0 rounded-full bg-[#1B4332] text-white flex items-center justify-center shadow-md shadow-[#1B4332]/20">
                  {step.icon}
                </div>
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#C8522A] font-semibold">
                    {step.time}
                  </span>
                  <h3
                    className="text-sm font-semibold text-[#1C1A18] mt-0.5 mb-1.5"
                    style={{ fontFamily: 'Lora, Georgia, serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
