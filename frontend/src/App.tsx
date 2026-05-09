import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ViandasPage from './pages/ViandasPage'
import PizzaPartyPage from './pages/PizzaPartyPage'
import ContactoPage from './pages/ContactoPage'
import LoginPage from './pages/admin/LoginPage'
import PanelPage from './pages/admin/PanelPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/viandas" element={<ViandasPage />} />
        <Route path="/pizza-party" element={<PizzaPartyPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
      </Route>

      <Route path="/admin" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/panel" element={<PanelPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
