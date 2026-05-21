import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAdminMessages } from '../../hooks/admin/useAdminMessages'
import MenuTab from './tabs/MenuTab'
import PizzaPartyTab from './tabs/PizzaPartyTab'
import OffersTab from './tabs/OffersTab'
import ScheduleTab from './tabs/ScheduleTab'
import WeeklyMenuTab from './tabs/WeeklyMenuTab'
import MessagesTab from './tabs/MessagesTab'
import PreciosTab from './tabs/PreciosTab'

const NAV_ITEMS = [
  {
    id: 'menu',
    label: 'Menú',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    id: 'menu-semanal',
    label: 'Menú Semanal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: 'horarios',
    label: 'Horarios',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: 'ofertas',
    label: 'Ofertas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 'pizza-party',
    label: 'Pizza Party',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 010 20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    id: 'precios',
    label: 'Carteles',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: 'mensajes',
    label: 'Mensajes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
]

const TAB_CONTENT: Record<string, React.ReactNode> = {
  menu: <MenuTab />,
  'menu-semanal': <WeeklyMenuTab />,
  horarios: <ScheduleTab />,
  ofertas: <OffersTab />,
  'pizza-party': <PizzaPartyTab />,
  precios: <PreciosTab />,
  mensajes: <MessagesTab />,
}

export default function PanelPage() {
  const { logout } = useAuth()
  const { unreadCount } = useAdminMessages()
  const unread = unreadCount.data?.count ?? 0
  const [activeTab, setActiveTab] = useState('menu')
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#1B4332] text-white px-4 h-14 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <img src="/logo.png" alt="La Olla" className="h-7 w-auto" />
          <span className="font-semibold text-sm hidden sm:inline">Panel de Administración</span>
          <span className="font-semibold text-sm sm:hidden">{activeLabel}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 min-h-[36px] px-3 text-xs font-medium bg-white/10 hover:bg-white/20 rounded transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
          </svg>
          Salir
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — desktop always visible, mobile as overlay */}
        <>
          {/* Mobile overlay */}
          {mobileOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/40 z-20"
              onClick={() => setMobileOpen(false)}
            />
          )}

          <aside
            className={`
              fixed md:static top-14 left-0 h-[calc(100vh-3.5rem)] md:h-auto
              w-56 bg-white border-r border-gray-200 z-20
              flex flex-col transition-transform duration-200
              md:translate-x-0
              ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <nav className="flex-1 py-3 overflow-y-auto">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false) }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors
                    ${activeTab === item.id
                      ? 'bg-[#1B4332]/8 text-[#1B4332] border-r-2 border-[#1B4332]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className={activeTab === item.id ? 'text-[#1B4332]' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.id === 'mensajes' && unread > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>
        </>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
          <div className="max-w-4xl">
            {TAB_CONTENT[activeTab]}
          </div>
        </main>
      </div>
    </div>
  )
}
