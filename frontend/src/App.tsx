import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ViandasPage from './pages/ViandasPage'
import PizzaPartyPage from './pages/PizzaPartyPage'
import ContactoPage from './pages/ContactoPage'
import LoginPage from './pages/admin/LoginPage'
import PanelPage from './pages/admin/PanelPage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/menu" element={<PageTransition><MenuPage /></PageTransition>} />
          <Route path="/viandas" element={<PageTransition><ViandasPage /></PageTransition>} />
          <Route path="/pizza-party" element={<PageTransition><PizzaPartyPage /></PageTransition>} />
          <Route path="/contacto" element={<PageTransition><ContactoPage /></PageTransition>} />
        </Route>

        <Route path="/admin" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/panel" element={<PanelPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
