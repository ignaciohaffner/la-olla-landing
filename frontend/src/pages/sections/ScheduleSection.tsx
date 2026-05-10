import { motion } from 'framer-motion'
import { useCurrentSchedule } from '@/hooks/useCurrentSchedule'
import { Badge } from '@/components/ui/badge'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

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
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <motion.h2
            className="text-xl md:text-2xl font-bold text-green-800"
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
                    ? 'bg-green-500 text-white hover:bg-green-500 text-sm px-3 py-1'
                    : 'bg-red-500 text-white hover:bg-red-500 text-sm px-3 py-1'
                }
              >
                {isOpenNow ? 'Abierto ahora' : 'Cerrado'}
              </Badge>
            </motion.div>
          )}
        </div>

        {isLoading && <p className="text-gray-400 text-sm">Cargando horarios...</p>}

        {error && !isLoading && (
          <p className="text-gray-500 text-sm">Verificá nuestros horarios por WhatsApp.</p>
        )}

        {schedule && !isLoading && (
          <ul className="divide-y divide-gray-200">
            {schedule.map((day, i) => (
              <motion.li
                key={day.dayOfWeek}
                className="py-3"
                custom={i}
                variants={rowVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-20px' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{DAY_NAMES[day.dayOfWeek]}</span>
                  <span className="text-gray-500 text-sm">
                    {day.isOpen ? `${day.openTime} – ${day.closeTime}` : 'Cerrado'}
                  </span>
                </div>
                {day.specialNote && (
                  <p className="text-xs text-yellow-600 mt-1">{day.specialNote}</p>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
