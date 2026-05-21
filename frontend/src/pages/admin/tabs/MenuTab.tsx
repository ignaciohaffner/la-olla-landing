import { useState } from 'react'
import { toast } from 'sonner'
import { Switch } from '../../../components/ui/switch'
import { useAdminMenu } from '../../../hooks/admin/useAdminMenu'
import { useAdminCategories } from '../../../hooks/admin/useAdminCategories'

type DirtyEntry = { name?: string; price?: number }

export default function MenuTab() {
  const { data: menuData, isLoading: menuLoading, createItem, patchItem, deleteItem, bulkUpdatePrices } = useAdminMenu()
  const { data: categories, isLoading: catLoading, createCategory, deleteCategory } = useAdminCategories()

  const [dirty, setDirty] = useState<Map<number, DirtyEntry>>(new Map())
  const [openCatId, setOpenCatId] = useState<number | null>(null)
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<number | null>(null)
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<number | null>(null)
  const [addingToCat, setAddingToCat] = useState<number | null>(null)
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' })
  const [newCatName, setNewCatName] = useState('')
  const [showCatForm, setShowCatForm] = useState(false)

  function setDirtyField(id: number, field: keyof DirtyEntry, value: string | number) {
    setDirty(prev => {
      const next = new Map(prev)
      next.set(id, { ...next.get(id), [field]: value })
      return next
    })
  }

  async function handleSave() {
    const priceUpdates: { id: number; price: number }[] = []
    const namePatches: { id: number; name: string }[] = []
    dirty.forEach((entry, id) => {
      if (entry.price !== undefined) priceUpdates.push({ id, price: entry.price })
      if (entry.name !== undefined) namePatches.push({ id, name: entry.name })
    })
    try {
      await Promise.all([
        priceUpdates.length > 0 ? bulkUpdatePrices.mutateAsync(priceUpdates) : Promise.resolve(),
        ...namePatches.map(({ id, name }) => patchItem.mutateAsync({ id, data: { name } })),
      ])
      setDirty(new Map())
      toast.success('Cambios guardados')
    } catch {
      toast.error('Error al guardar cambios')
    }
  }

  async function handleDeleteItem(id: number) {
    try {
      await deleteItem.mutateAsync(id)
      setConfirmDeleteItem(null)
      toast.success('Ítem eliminado')
    } catch {
      toast.error('Error al eliminar ítem')
    }
  }

  async function handleToggleAvailable(id: number, current: boolean) {
    try {
      await patchItem.mutateAsync({ id, data: { available: !current } })
    } catch {
      toast.error('Error al actualizar disponibilidad')
    }
  }

  async function handleAddItem(categoryId: number) {
    if (!newItem.name || !newItem.price) return
    try {
      await createItem.mutateAsync({
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
        categoryId,
        description: newItem.description.trim() || undefined,
      })
      setNewItem({ name: '', price: '', description: '' })
      setAddingToCat(null)
      toast.success('Ítem agregado')
    } catch {
      toast.error('Error al agregar ítem')
    }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    const name = newCatName.trim()
    if (!name) return
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    try {
      await createCategory.mutateAsync({ name, slug, sortOrder: 0 })
      setNewCatName('')
      setShowCatForm(false)
      toast.success('Categoría creada')
    } catch {
      toast.error('Error al crear categoría')
    }
  }

  async function handleDeleteCategory(id: number) {
    try {
      await deleteCategory.mutateAsync(id)
      setConfirmDeleteCat(null)
      toast.success('Categoría eliminada')
    } catch (err) {
      setConfirmDeleteCat(null)
      toast.error(err instanceof Error ? err.message : 'Error al eliminar categoría')
    }
  }

  async function handleDownloadPriceList() {
    try {
      const token = localStorage.getItem('laolla_token')
      const res = await fetch('/api/admin/price-list/image', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'precios.png'; a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Error al descargar lista de precios')
    }
  }

  function categoryHasItems(catId: number) {
    return menuData?.some(mc => mc.id === catId && mc.items.length > 0) ?? false
  }

  if (menuLoading || catLoading) {
    return <p className="text-gray-400 text-sm py-4">Cargando menú…</p>
  }

  return (
    <div className="space-y-4">

      {/* ── Action bar ── */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={dirty.size === 0}
          onClick={handleSave}
          className="flex items-center gap-1.5 min-h-[38px] px-4 bg-[#1B4332] text-white rounded-lg disabled:opacity-40 hover:bg-[#2D6A4F] transition-colors text-sm font-medium"
        >
          {dirty.size > 0 && (
            <span className="bg-white text-[#1B4332] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {dirty.size}
            </span>
          )}
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={handleDownloadPriceList}
          className="min-h-[38px] px-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Descargar lista de precios
        </button>
      </div>

      {/* ── Categorías (chips) ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categorías</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories?.map(cat => (
            <div key={cat.id} className="flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
              <span>{cat.name}</span>
              {confirmDeleteCat === cat.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-bold ml-1"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteCat(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={categoryHasItems(cat.id)}
                  title={categoryHasItems(cat.id) ? 'Tiene ítems — eliminá los ítems primero' : 'Eliminar categoría'}
                  onClick={() => setConfirmDeleteCat(cat.id)}
                  className="ml-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))}

          {showCatForm ? (
            <form onSubmit={handleCreateCategory} className="flex gap-1">
              <input
                type="text"
                autoFocus
                placeholder="Nombre…"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="h-8 px-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
              />
              <button type="submit" className="h-8 px-3 bg-[#1B4332] text-white rounded-full text-sm font-medium hover:bg-[#2D6A4F]">
                OK
              </button>
              <button type="button" onClick={() => { setShowCatForm(false); setNewCatName('') }} className="h-8 px-2 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowCatForm(true)}
              className="flex items-center gap-1 h-8 px-3 border border-dashed border-gray-300 text-gray-500 hover:border-[#1B4332] hover:text-[#1B4332] rounded-full text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Nueva
            </button>
          )}
        </div>
      </div>

      {/* ── Accordion por categoría ── */}
      <div className="space-y-2">
        {menuData?.map(mc => {
          const isOpen = openCatId === mc.id
          const isAdding = addingToCat === mc.id

          return (
            <div key={mc.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Category header */}
              <button
                type="button"
                onClick={() => setOpenCatId(isOpen ? null : mc.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-gray-800 text-sm">{mc.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {mc.items.length} ítems
                  </span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Items table */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {mc.items.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">Sin ítems todavía.</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {/* Header row */}
                      <div className="grid grid-cols-[1fr_90px_80px_60px] gap-2 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                        <span>Nombre</span>
                        <span>Precio</span>
                        <span>Disponible</span>
                        <span />
                      </div>
                      {mc.items.map(item => (
                        <div key={item.id} className="grid grid-cols-[1fr_90px_80px_60px] gap-2 px-4 py-2 items-center">
                          <input
                            type="text"
                            defaultValue={item.name}
                            onChange={e => setDirtyField(item.id, 'name', e.target.value)}
                            className={`h-9 px-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 w-full ${dirty.has(item.id) && dirty.get(item.id)?.name !== undefined ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-transparent'}`}
                          />
                          <input
                            type="number"
                            inputMode="numeric"
                            defaultValue={item.price}
                            onChange={e => setDirtyField(item.id, 'price', parseFloat(e.target.value))}
                            className={`h-9 px-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 w-full ${dirty.has(item.id) && dirty.get(item.id)?.price !== undefined ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-transparent'}`}
                          />
                          <div className="flex items-center">
                            <Switch
                              checked={item.available}
                              onCheckedChange={() => handleToggleAvailable(item.id, item.available)}
                            />
                          </div>
                          <div className="flex justify-end">
                            {confirmDeleteItem === item.id ? (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="h-7 w-7 flex items-center justify-center bg-red-500 text-white rounded text-xs"
                                >
                                  ✓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteItem(null)}
                                  className="h-7 w-7 flex items-center justify-center bg-gray-200 text-gray-600 rounded text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteItem(item.id)}
                                className="h-7 w-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                                aria-label="Eliminar ítem"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                                  <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                                  <path d="M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add item inline form */}
                  <div className="border-t border-gray-100 px-4 py-3">
                    {isAdding ? (
                      <div className="flex flex-wrap gap-2 items-end">
                        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                          <label className="text-xs text-gray-400">Nombre *</label>
                          <input
                            type="text"
                            autoFocus
                            placeholder="Nombre del ítem"
                            value={newItem.name}
                            onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                            className="h-9 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-400">Precio *</label>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="0"
                            value={newItem.price}
                            onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}
                            className="h-9 w-24 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                          <label className="text-xs text-gray-400">Descripción</label>
                          <input
                            type="text"
                            placeholder="Opcional"
                            value={newItem.description}
                            onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))}
                            className="h-9 px-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
                          />
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleAddItem(mc.id)}
                            disabled={!newItem.name || !newItem.price || createItem.isPending}
                            className="h-9 px-4 bg-[#1B4332] text-white rounded text-sm font-medium hover:bg-[#2D6A4F] disabled:opacity-40 transition-colors"
                          >
                            Agregar
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAddingToCat(null); setNewItem({ name: '', price: '', description: '' }) }}
                            className="h-9 px-3 text-gray-400 hover:text-gray-600 text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setAddingToCat(mc.id); setNewItem({ name: '', price: '', description: '' }) }}
                        className="flex items-center gap-1.5 text-sm text-[#1B4332] hover:text-[#2D6A4F] font-medium transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                        Agregar ítem
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
