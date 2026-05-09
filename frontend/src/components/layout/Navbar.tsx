import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Menú', to: '/menu' },
  { label: 'Viandas', to: '/viandas' },
  { label: 'Pizza Party', to: '/pizza-party' },
  { label: 'Contacto', to: '/contacto' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center min-h-[44px] px-3 text-base font-medium transition-colors hover:text-yellow-400 ${isActive ? 'text-yellow-400' : 'text-white'}`

  return (
    <nav className="bg-green-800 text-white">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <a href="/" className="flex items-center gap-2 min-h-[44px]">
          <img src="/logo.png" alt="La Olla" className="h-8 w-auto" />
          <span className="text-lg font-bold">La Olla</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] text-white"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-4 pb-3 flex flex-col">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
