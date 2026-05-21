import { toast } from 'sonner'
import { useAdminMessages } from '../../../hooks/admin/useAdminMessages'

export default function MessagesTab() {
  const { messages, setRead } = useAdminMessages()

  async function handleToggleRead(id: number, currentRead: boolean) {
    try {
      await setRead.mutateAsync({ id, read: !currentRead })
      toast.success(currentRead ? 'Marcado como no leído' : 'Marcado como leído')
    } catch {
      toast.error('Error al actualizar mensaje')
    }
  }

  if (messages.isLoading) return <p className="text-gray-400 text-sm">Cargando mensajes…</p>

  if (!messages.data || messages.data.length === 0) {
    return <p className="text-gray-500 text-sm">No hay mensajes.</p>
  }

  return (
    <div className="space-y-3">
      {messages.data.map(msg => (
        <div
          key={msg.id}
          className={`bg-white border rounded-lg p-4 space-y-2 ${msg.read ? 'border-gray-200' : 'border-green-300 bg-green-50/30'}`}
        >
          <div className="flex flex-wrap gap-2 items-start justify-between">
            <div>
              <span className="font-semibold text-gray-800">{msg.name}</span>
              {!msg.read && (
                <span className="ml-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">Nuevo</span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(msg.createdAt).toLocaleString('es-AR')}
            </span>
          </div>

          <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
            <span>{msg.email}</span>
            {msg.phone && <span>{msg.phone}</span>}
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3">
            {msg.message}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleToggleRead(msg.id, msg.read)}
              className="min-h-[44px] px-4 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700"
            >
              {msg.read ? 'Marcar como no leído' : 'Marcar como leído'}
            </button>
            <a
              href={`mailto:${msg.email}`}
              className="min-h-[44px] px-4 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700 flex items-center"
            >
              Responder por email
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
