export interface MenuItem {
  id: number
  name: string
  price: number
  category: string
}

export interface MenuState {
  items: MenuItem[]
  loading: boolean
  error: string | null
}

