import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Menú', to: '/menu' },
  { label: 'Viandas', to: '/viandas' },
  { label: 'Pizza Party', to: '/pizza-party' },
  { label: 'Contacto', to: '/contacto' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center min-h-[44px] px-3 text-sm font-medium tracking-wide transition-colors hover:text-[#C8522A] ${
      isActive ? 'text-[#C8522A]' : 'text-white/85'
    } ${isActive ? 'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#C8522A] after:rounded-full' : ''}`

  return (
    <nav
      ref={navRef}
      className={`bg-[#1B4332] text-white sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-xl shadow-black/20' : ''}`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2.5 min-h-[44px]">
          <img src="/logo.png" alt="La Olla" className="h-9 w-auto" />
          <span
            className="text-lg font-semibold tracking-tight text-white"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            La Olla
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-white/85 hover:text-white transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          <motion.div
            animate={isOpen ? 'open' : 'closed'}
            className="relative w-6 h-5 flex flex-col justify-between"
          >
            <motion.span
              className="block h-0.5 bg-current rounded-full origin-center"
              variants={{ open: { rotate: 45, y: 9 }, closed: { rotate: 0, y: 0 } }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block h-0.5 bg-current rounded-full"
              variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 bg-current rounded-full origin-center"
              variants={{ open: { rotate: -45, y: -9 }, closed: { rotate: 0, y: 0 } }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden border-t border-white/10 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 pt-1 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={linkClass}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
