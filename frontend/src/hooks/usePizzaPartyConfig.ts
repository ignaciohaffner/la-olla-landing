import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import type { PizzaPartyConfig } from '../types'

export function usePizzaPartyConfig() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pizza-party-config'],
    queryFn: () => apiFetch<PizzaPartyConfig>('/api/pizza-party/config'),
  })

  return { data, isLoading, error: error as Error | null }
}
