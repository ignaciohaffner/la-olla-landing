# Feature Specification: React Frontend Infrastructure

**Feature Branch**: `004-react-frontend-infra`  
**Created**: 2026-05-09  
**Status**: Draft  
**Input**: User description: "Infraestructura base del frontend React del proyecto La Olla"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Navigates the Site (Priority: P1)

A visitor opens La Olla's website on any device and can navigate between all public pages. The navigation bar shows the restaurant's logo and name, and on mobile shows a hamburger menu. The footer provides contact details and social media links. A floating WhatsApp button is always visible.

**Why this priority**: Every other feature depends on working navigation and layout — without it, no page is usable.

**Independent Test**: Open the home page, click through each nav link (Inicio, Menú, Viandas, Pizza Party, Contacto), verify all pages load. On mobile, open the hamburger menu, click a link, verify the menu closes.

**Acceptance Scenarios**:

1. **Given** a visitor is on any public page, **When** they view the page, **Then** the navbar shows the La Olla logo, the restaurant name, and five navigation links.
2. **Given** a visitor is on mobile, **When** they tap the hamburger icon, **Then** a dropdown menu appears with all five links; tapping any link closes the menu and navigates to that page.
3. **Given** a visitor is on any public page, **When** they view the footer, **Then** they see the address, phone number, Facebook link, Instagram link, and a WhatsApp contact link.
4. **Given** a visitor is on any public page, **When** they view the bottom-right corner, **Then** a floating WhatsApp button is visible and opens the correct WhatsApp chat when tapped.

---

### User Story 2 - Admin Logs In and Accesses the Panel (Priority: P2)

An admin user navigates to `/admin`, enters their email and password, and is redirected to the protected `/admin/panel`. If their session expires or they are not logged in, they are redirected back to `/admin` when trying to access `/admin/panel`.

**Why this priority**: Admin functionality gates all content management; routing protection and authentication are prerequisites for the admin panel.

**Independent Test**: Visit `/admin`, submit valid credentials, verify redirect to `/admin/panel`. Then visit `/admin/panel` without a session, verify redirect to `/admin`.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user visits `/admin/panel`, **When** the page loads, **Then** they are redirected to `/admin`.
2. **Given** an admin is on `/admin`, **When** they submit valid credentials, **Then** they are redirected to `/admin/panel`.
3. **Given** an admin is on `/admin`, **When** they submit invalid credentials, **Then** an error message is shown and they remain on `/admin`.
4. **Given** an authenticated admin visits `/admin/panel`, **When** the page loads, **Then** the page renders with the admin's session intact.
5. **Given** an admin's session token is expired, **When** they visit `/admin/panel`, **Then** they are redirected to `/admin`.

---

### User Story 3 - Admin Logs Out (Priority: P3)

An authenticated admin can log out, which ends their session and redirects them to the login page.

**Why this priority**: Session management is a standard security requirement; logout is expected by all admin users.

**Independent Test**: Log in as admin, trigger logout, verify redirect to `/admin` and that revisiting `/admin/panel` redirects back to `/admin`.

**Acceptance Scenarios**:

1. **Given** an authenticated admin triggers logout, **When** the logout action completes, **Then** their session is cleared and they are redirected to `/admin`.
2. **Given** an admin has logged out, **When** they try to navigate to `/admin/panel`, **Then** they are redirected to `/admin`.

---

### User Story 4 - Site Reflects Current Opening Hours (Priority: P4)

Any page that shows whether La Olla is currently open (e.g., home page or header badge) fetches the schedule from the server and displays an accurate open/closed status. The data refreshes automatically within a reasonable window without requiring a page reload.

**Why this priority**: Real-time opening status is a key user-facing feature that depends on the schedule hook infrastructure.

**Independent Test**: Load a page with an open/closed indicator when the restaurant is within operating hours, verify it shows "Abierto"; load it outside operating hours, verify it shows "Cerrado".

**Acceptance Scenarios**:

1. **Given** the current time falls within the restaurant's scheduled hours, **When** a visitor loads any page with an open/closed indicator, **Then** the indicator shows the restaurant as open.
2. **Given** the current time falls outside the restaurant's scheduled hours, **When** a visitor loads any page with an open/closed indicator, **Then** the indicator shows the restaurant as closed.
3. **Given** schedule data was fetched recently, **When** the visitor stays on the page for up to 5 minutes, **Then** the data is not re-fetched unnecessarily.

---

### Edge Cases

- What happens when the API is unreachable and data cannot be fetched? (The page should render without crashing; schedule-dependent indicators degrade gracefully.)
- What happens when a JWT token in localStorage is malformed or tampered with? (The token is treated as invalid; the user is redirected to `/admin`.)
- What happens when a visitor directly navigates to a non-existent route? (A 404 or redirect-to-home behavior is expected.)
- What happens when the hamburger menu is open and the user resizes to desktop width? (The dropdown should not obstruct the desktop layout.)
- What happens when the WhatsApp button URL is opened on a device without WhatsApp installed? (The link opens the WhatsApp web fallback.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST expose all public routes (`/`, `/menu`, `/viandas`, `/pizza-party`, `/contacto`) and render them within the shared Layout (Navbar + Footer).
- **FR-002**: The application MUST expose an admin login route at `/admin` that does NOT use the shared Layout.
- **FR-003**: The application MUST expose a protected admin route at `/admin/panel` that redirects unauthenticated users to `/admin`.
- **FR-004**: The Navbar MUST display the restaurant logo, the name "La Olla", and five navigation links: Inicio, Menú, Viandas, Pizza Party, Contacto.
- **FR-005**: The Navbar MUST include a hamburger menu on mobile viewports that toggles a dropdown with the same five links, closing automatically after navigation.
- **FR-006**: The Footer MUST display the restaurant's address, phone number, a link to Facebook, a link to Instagram, and a link to WhatsApp.
- **FR-007**: A floating WhatsApp button MUST be visible on all public pages, anchored to the bottom-right, and MUST open `https://wa.me/543446410459` when tapped.
- **FR-008**: The authentication system MUST allow an admin to log in with email and password; on success the session token is stored and the user is redirected to `/admin/panel`.
- **FR-009**: The authentication system MUST allow an admin to log out, clearing the session and redirecting to `/admin`.
- **FR-010**: The session validation MUST check both the presence and expiry of the stored token without relying on an external JWT library.
- **FR-011**: The schedule data MUST be fetched from the server and cached for 5 minutes; consuming components MUST be able to determine whether the restaurant is currently open.
- **FR-012**: All API requests to public endpoints MUST be prefixed with the configured API base URL from environment settings.
- **FR-013**: All API requests to admin endpoints MUST include the stored session token as a bearer credential in the request header.
- **FR-014**: All interactive controls (buttons, links) MUST have a minimum touch target height of 44px.
- **FR-015**: The application MUST display an error state (not crash) when an API request fails.

### Key Entities

- **Session Token**: A short-lived credential stored client-side, containing at minimum an expiry timestamp, used to authenticate admin requests and validate protected route access.
- **Schedule**: A data structure returned by the server describing the restaurant's opening hours per day; used to compute whether the restaurant is currently open.
- **Navigation Link**: A labeled destination within the application; appears in both desktop and mobile navigation contexts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can navigate to any public page within 2 taps/clicks from the home page.
- **SC-002**: An admin can complete login and reach the panel in under 30 seconds from landing on `/admin`.
- **SC-003**: The mobile hamburger menu opens and closes within 200ms of user interaction (no janky animation).
- **SC-004**: Schedule data does not trigger a network request more than once per 5-minute window per browser session on the same page.
- **SC-005**: All public pages render correctly (no layout breakage, no JavaScript errors in the console) on viewport widths from 320px to 1440px.
- **SC-006**: An expired or invalid session token results in automatic redirect to `/admin` with no visible error crash.
- **SC-007**: The WhatsApp floating button is reachable and tappable on all public pages without overlapping critical content.

## Assumptions

- The backend API is already running and accessible at the URL configured in the environment; this spec covers only the frontend infrastructure.
- The restaurant's Facebook and Instagram URLs are known and will be provided as constants during implementation.
- The logo image file (`logo.png`) already exists in the public assets directory.
- Mobile viewport is defined as widths below 768px (standard Tailwind `md` breakpoint).
- The admin panel layout (beyond routing protection) is defined by a separate feature spec.
- Each public page's content (home, menu, viandas, pizza party, contacto) is defined by separate feature specs; this spec only establishes the routes and shared layout shell.
- The server returns a structured error body with a `message` field when a request fails, enabling the API client to surface meaningful error messages.
- Session tokens are JWTs with a standard `exp` claim in Unix epoch seconds, parseable by splitting on `.` and base64-decoding the payload.
