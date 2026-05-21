import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { PizzaPartyConfig, PizzaPartyRequest, PizzaPartyRequestsResponse } from '../../types'

export function useAdminPizzaParty(statusFilter?: string) {
  const queryClient = useQueryClient()

  const config = useQuery({
    queryKey: ['admin', 'pizza-party', 'config'],
    queryFn: () => apiFetch<PizzaPartyConfig>('/api/admin/pizza-party/config'),
  })

  const patchConfig = useMutation({
    mutationFn: (data: Partial<PizzaPartyConfig>) =>
      apiFetch<PizzaPartyConfig>('/api/admin/pizza-party/config', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'pizza-party', 'config'] }),
  })

  const requestsUrl = statusFilter
    ? `/api/admin/pizza-party/requests?status=${statusFilter}`
    : '/api/admin/pizza-party/requests'

  const requests = useQuery({
    queryKey: ['admin', 'pizza-party', 'requests', statusFilter ?? 'all'],
    queryFn: () => apiFetch<PizzaPartyRequestsResponse>(requestsUrl),
  })

  const patchRequest = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: { status?: PizzaPartyRequest['status']; adminNotes?: string | null }
    }) =>
      apiFetch<PizzaPartyRequest>(`/api/admin/pizza-party/requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['admin', 'pizza-party', 'requests'],
      }),
  })

  return { config, patchConfig, requests, patchRequest }
}
