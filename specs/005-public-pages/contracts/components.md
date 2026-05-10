# Component Contracts: 5 Public Pages — La Olla Website

**Branch**: `005-public-pages` | **Date**: 2026-05-09

This document defines the public TypeScript props interface for each new non-trivial component. Page-level components (HomePage, MenuPage, etc.) take no props — they are routed directly by React Router.

---

## Hooks

### `useMenu()`
```typescript
// frontend/src/hooks/useMenu.ts
function useMenu(): {
  data: MenuResponse | undefined
  isLoading: boolean
  error: Error | null
}
```
- QueryKey: `['menu']`
- QueryFn: `apiFetch<MenuResponse>('/api/menu')`

### `useOffers()`
```typescript
// frontend/src/hooks/useOffers.ts
function useOffers(): {
  data: OffersResponse | undefined
  isLoading: boolean
  error: Error | null
}
```
- QueryKey: `['offers']`
- QueryFn: `apiFetch<OffersResponse>('/api/offers')`

### `usePizzaPartyConfig()`
```typescript
// frontend/src/hooks/usePizzaPartyConfig.ts
function usePizzaPartyConfig(): {
  data: PizzaPartyConfig | undefined
  isLoading: boolean
  error: Error | null
}
```
- QueryKey: `['pizza-party-config']`
- QueryFn: `apiFetch<PizzaPartyConfig>('/api/pizza-party/config')`

### `useWeeklyMenu()`
```typescript
// frontend/src/hooks/useWeeklyMenu.ts
function useWeeklyMenu(): {
  data: WeeklyMenuResponse | undefined
  isLoading: boolean
  error: Error | null
}
```
- QueryKey: `['weekly-menu']`
- QueryFn: `apiFetch<WeeklyMenuResponse>('/api/weekly-menu')`

---

## Reusable Components

### `Carousel`
```typescript
// frontend/src/components/Carousel.tsx
interface CarouselProps {
  images: Array<{
    src: string       // URL path, e.g. "/assets/pizzaparty.jpg"
    alt: string
  }>
  autoAdvanceMs?: number  // default: 5000
  aspectRatio?: string    // default: "4/3" (CSS aspect-ratio value)
}

function Carousel(props: CarouselProps): JSX.Element
```
Behavior:
- Internal state: `currentIndex` (number)
- `useEffect` for auto-advance timer — the timer is the ONLY permitted `useEffect` in this feature (it is not data fetching; it drives UI animation)
- Resets timer on manual prev/next press
- Wraps from last image back to index 0 (infinite loop)
- Dots are rendered as `<button>` elements for accessibility

---

## Page-Section Components

These components are co-located inside their page directory. They are not exported globally.

### `HeroSection` (used in HomePage)
```typescript
// frontend/src/pages/sections/HeroSection.tsx
function HeroSection(): JSX.Element
```
No props. Renders static content: background image (`/assets/pizzaparty.jpg` or `chuletaconpapas.jpeg`), dark overlay, logo, restaurant name, subtitle, two CTA buttons.

### `ScheduleSection` (used in HomePage and MenuPage)
```typescript
// frontend/src/pages/sections/ScheduleSection.tsx
function ScheduleSection(): JSX.Element
```
No props. Uses `useCurrentSchedule()` internally. Renders open/closed badge + day table. Handles loading and error states.

### `SpecialtiesSection` (used in HomePage)
```typescript
// frontend/src/pages/sections/SpecialtiesSection.tsx
function SpecialtiesSection(): JSX.Element
```
No props. Purely static — three image cards with links.

### `OffersSection` (used in HomePage)
```typescript
// frontend/src/pages/sections/OffersSection.tsx
function OffersSection(): JSX.Element
```
No props. Uses `useOffers()` internally. Returns `null` when offers array is empty or loading fails.

### `PizzaPartyCTASection` (used in HomePage)
```typescript
// frontend/src/pages/sections/PizzaPartyCTASection.tsx
function PizzaPartyCTASection(): JSX.Element
```
No props. Purely static banner.

### `PriceCalculator` (used in PizzaPartyPage)
```typescript
// frontend/src/pages/PriceCalculator.tsx
interface PriceCalculatorProps {
  config: PizzaPartyConfig
  values: CalculatorValues
  onChange: (values: CalculatorValues) => void
  onRequestClick: () => void   // triggers scroll to RequestForm
}

function PriceCalculator(props: PriceCalculatorProps): JSX.Element
```

### `RequestForm` (used in PizzaPartyPage)
```typescript
// frontend/src/pages/RequestForm.tsx
interface RequestFormProps {
  calculatorValues: CalculatorValues
}

function RequestForm(props: RequestFormProps): JSX.Element
```
Uses React Hook Form + Zod internally. On submit, merges `calculatorValues` into the payload before POSTing to `/api/pizza-party/request`. Shows sonner toasts on success/error.

---

## API Mutation Calls (no custom hooks — inline in components)

### POST /api/pizza-party/request
Called directly inside `RequestForm` via `apiFetch`:
```typescript
await apiFetch<void>('/api/pizza-party/request', {
  method: 'POST',
  body: JSON.stringify(payload satisfies PizzaPartyRequestPayload),
})
```

### POST /api/contact
Called directly inside `ContactoPage` (or a `ContactForm` sub-component):
```typescript
await apiFetch<void>('/api/contact', {
  method: 'POST',
  body: JSON.stringify(payload satisfies ContactPayload),
})
```

Both mutations use manual `useState<boolean>` for the loading flag (since they are one-off form submissions, not React Query mutations — adding `useMutation` for two POST calls is over-engineering per Constitution §V).
