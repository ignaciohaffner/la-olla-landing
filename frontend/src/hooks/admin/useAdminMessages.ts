import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { ContactMessagesResponse } from '../../types'

export function useAdminMessages() {
  const queryClient = useQueryClient()

  const messages = useQuery({
    queryKey: ['admin', 'contact'],
    queryFn: () => apiFetch<ContactMessagesResponse>('/api/admin/contact'),
  })

  const unreadCount = useQuery({
    queryKey: ['admin', 'contact', 'unread'],
    queryFn: () => apiFetch<{ count: number }>('/api/admin/contact/unread-count'),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  const setRead = useMutation({
    mutationFn: ({ id, read }: { id: number; read: boolean }) =>
      apiFetch<{ id: number; read: boolean }>(`/api/admin/contact/${id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ read }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact', 'unread'] })
    },
  })

  return { messages, unreadCount, setRead }
}
