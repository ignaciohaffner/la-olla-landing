import { motion } from 'framer-motion'
import { useCurrentSchedule } from '@/hooks/useCurrentSchedule'
import { Badge } from '@/components/ui/badge'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const todayIndex = new Date().getDay()

function formatHours(day: { isOpen: boolean; openTime: string; closeTime: string; openTime2: string | null; closeTime2: string | null }) {
  if (!day.isOpen) return 'Cerrado'
  const slot1 = `${day.openTime} – ${day.closeTime}`
  if (day.openTime2 && day.closeTime2) return `${slot1} / ${day.openTime2} – ${day.closeTime2}`
  return slot1
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' },
  }),
}

export default function ScheduleSection() {
  const { schedule, isOpenNow, isLoading, error } = useCurrentSchedule()

  return (
    <section className="py-12 px-4 bg-[#FAF7F2]">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
          <motion.h2
            className="text-xl md:text-2xl font-semibold text-[#1B4332]"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Horarios
          </motion.h2>

          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            >
              <Badge
                className={
                  isOpenNow
                    ? 'bg-green-600 text-white hover:bg-green-600 text-sm px-3 py-1'
                    : 'bg-red-500 text-white hover:bg-red-500 text-sm px-3 py-1'
                }
              >
                {isOpenNow ? 'Abierto ahora' : 'Cerrado'}
              </Badge>
            </motion.div>
          )}
        </div>

        {isLoading && <p className="text-stone-400 text-sm">Cargando horarios...</p>}

        {error && !isLoading && (
          <p className="text-stone-500 text-sm">Verificá nuestros horarios por WhatsApp.</p>
        )}

        {schedule && !isLoading && (
          <ul className="divide-y divide-[#EDE5D8]">
            {schedule.map((day, i) => {
              const isToday = day.dayOfWeek === todayIndex
              return (
                <motion.li
                  key={day.dayOfWeek}
                  className={`py-3 px-3 rounded-lg transition-colors ${isToday ? 'bg-[#C8522A]/8' : ''}`}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-20px' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium text-sm ${isToday ? 'text-[#C8522A] font-semibold' : 'text-stone-700'}`}>
                      {DAY_NAMES[day.dayOfWeek]}
                      {isToday && <span className="ml-2 text-xs text-[#C8522A]/70 font-normal">hoy</span>}
                    </span>
                    <span className={`text-sm tabular-nums ${isToday ? 'text-[#C8522A] font-medium' : 'text-stone-500'}`}>
                      {formatHours(day)}
                    </span>
                  </div>
                  {day.specialNote && (
                    <p className="text-xs text-[#C8522A]/80 mt-1">{day.specialNote}</p>
                  )}
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
