import { useAuth } from '../../hooks/useAuth'

export default function PanelPage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
          <button
            type="button"
            onClick={logout}
            className="min-h-[44px] px-6 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        <p className="text-gray-500">Contenido del panel (próximas funcionalidades).</p>
      </div>
    </div>
  )
}
