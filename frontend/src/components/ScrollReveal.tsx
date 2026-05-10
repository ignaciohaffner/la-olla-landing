import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  duration?: number
  once?: boolean
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const axis = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...axis }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// Stagger container — anima los hijos en cascada
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export const fadeLeftItem = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}
