# Feature Specification: 5 Public Pages — La Olla Website

**Feature Branch**: `005-public-pages`  
**Created**: 2026-05-09  
**Status**: Draft  

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor explores the Home page (Priority: P1)

A potential customer visits the La Olla website for the first time on their mobile phone. They see a visually appealing landing page that immediately communicates the brand and invites them to navigate to the menu or learn about the Pizza Party service.

**Why this priority**: The Home page is the primary entry point. It must work flawlessly before any other page adds value.

**Independent Test**: A new visitor can land on `/`, understand what La Olla offers, see current opening hours, and navigate to either the menu or the pizza party page — all without any other page existing.

**Acceptance Scenarios**:

1. **Given** a visitor opens the Home page, **When** the page loads, **Then** they see a full-screen hero with the La Olla logo, name, a subtitle, and two prominent call-to-action buttons ("Ver Menú" and "Pizza Party").
2. **Given** the restaurant is currently open, **When** the visitor views the schedule section, **Then** a green "Abierto ahora" badge is visible alongside the weekly timetable.
3. **Given** the restaurant is currently closed, **When** the visitor views the schedule section, **Then** a red "Cerrado" badge is visible.
4. **Given** a day has a special note, **When** the visitor views that day's entry in the schedule, **Then** the special note appears below the day's hours.
5. **Given** a day is marked as closed in the schedule data, **When** the visitor views that day, **Then** "Cerrado" is displayed instead of hours.
6. **Given** there are active offers, **When** the visitor scrolls through the Home page, **Then** an "Ofertas" section appears with one card per active offer (badge, title, description, expiry date).
7. **Given** there are no active offers, **When** the visitor scrolls through the Home page, **Then** no "Ofertas" section or title is shown.
8. **Given** a visitor on mobile (375px), **When** the specialties section loads, **Then** the three specialty cards stack vertically.
9. **Given** a visitor on a medium-or-larger screen, **When** the specialties section loads, **Then** the three specialty cards appear in a horizontal row.

---

### User Story 2 — Customer browses the Menu (Priority: P1)

A hungry customer wants to see what dishes are available and at what prices. They navigate to `/menu`, pick a category, and scan the items.

**Why this priority**: The menu is the most commonly visited page after the home page; it directly drives ordering decisions.

**Independent Test**: A visitor can open `/menu`, switch between food categories, and read all prices — without any other page existing.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/menu`, **When** the page loads, **Then** the first category is selected by default and its items are displayed.
2. **Given** a visitor on mobile views the category tabs, **When** there are more categories than fit on screen, **Then** the tab bar scrolls horizontally without line-wrapping.
3. **Given** a visitor selects a category tab, **When** the tab is clicked, **Then** only the items belonging to that category are shown.
4. **Given** a menu item has a price greater than zero, **When** the visitor views that item, **Then** the item name and price are shown side by side.
5. **Given** a menu item has a price of zero, **When** the visitor views that category, **Then** the item appears in a sub-list titled "Variedades disponibles" without a price.
6. **Given** the schedule data is available, **When** the visitor views `/menu`, **Then** the current open/closed status is shown (reusing the same schedule indicator as the Home page).

---

### User Story 3 — Customer books a Pizza Party (Priority: P2)

A customer wants to organize a pizza party. They visit `/pizza-party`, browse photos, understand what is included, calculate the estimated cost, and submit a booking request.

**Why this priority**: Pizza Party is a high-value service; converting interest into a submitted request is a core business goal.

**Independent Test**: A visitor can open `/pizza-party`, see all photos, understand what is included/excluded, calculate a price, and submit a request form — without any other page existing.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/pizza-party`, **When** the photo carousel loads, **Then** four images cycle automatically every 5 seconds, with previous/next buttons and dot indicators visible.
2. **Given** a visitor taps the previous or next button on the carousel, **When** the button is tapped, **Then** the carousel moves to the adjacent image immediately.
3. **Given** the service description section, **When** the visitor reads it, **Then** the included items (empanadas de copetín, 13 pizza varieties, mobile oven, tableware, 3 hours), excluded items (drinks, tables, chairs, glasses), and available extras (additional hour, additional waiters) are clearly listed.
4. **Given** the price calculator, **When** the visitor enters a guest count below the minimum allowed, **Then** the input enforces the minimum value and the calculator reflects the minimum.
5. **Given** the visitor enters a valid guest count, extra hours (0, 1, or 2), and extra waiters count, **When** any value changes, **Then** the total price updates instantly using the formula: `(guests × price per person) + (extra hours × hourly rate) + (extra waiters × waiter rate)`.
6. **Given** the visitor clicks "Solicitar este servicio", **When** clicked, **Then** the page scrolls to the request form.
7. **Given** the visitor submits the request form with valid data, **When** the submission succeeds, **Then** a success message "¡Solicitud enviada! Te contactamos pronto." is shown.
8. **Given** the visitor submits the form and the server returns an error, **When** the submission fails, **Then** an error message "Hubo un error. Contactanos por WhatsApp." is shown.
9. **Given** the visitor has used the price calculator, **When** they scroll down to the request form, **Then** the guest count, extra hours, and extra waiter values from the calculator are pre-filled in the form.

---

### User Story 4 — Customer learns about Viandas (lunch boxes) (Priority: P2)

A customer wants to order daily lunch boxes. They visit `/viandas` to understand how the service works, see the weekly menu if available, and get in touch.

**Why this priority**: Viandas is a recurring revenue service; the page must clearly communicate the offering and lower the barrier to ordering.

**Independent Test**: A visitor can open `/viandas`, understand the service, and either view the weekly menu or contact the restaurant — without any other page existing.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/viandas`, **When** the page loads, **Then** a static "Cómo funciona" section with calendar and clock icons is visible.
2. **Given** weekly menu data is available, **When** the visitor views the weekly menu section, **Then** an accordion with one entry per weekday (Mon–Fri) is shown, each expandable to reveal the day's dishes.
3. **Given** no weekly menu data is available, **When** the visitor views the weekly menu section, **Then** a card with the message "Consultá el menú de esta semana por WhatsApp" and a WhatsApp button is shown instead.
4. **Given** a visitor reads the benefits section, **When** viewing `/viandas`, **Then** a static list of service benefits is visible.
5. **Given** a visitor wants to order, **When** they reach the bottom CTA, **Then** a button linking to the contact page or WhatsApp is visible.

---

### User Story 5 — Customer contacts the restaurant (Priority: P2)

A customer needs the restaurant's address, phone number, or social media links, or wants to send a message directly through the site.

**Why this priority**: Contact information and inquiry forms build trust and enable customer acquisition outside of direct walk-in traffic.

**Independent Test**: A visitor can open `/contacto`, find the phone number and address, navigate to social media, submit a contact form, and view the map — without any other page existing.

**Acceptance Scenarios**:

1. **Given** a visitor opens `/contacto`, **When** the page loads, **Then** the phone number (3446-410459), address (Doello Jurado 1050, Gualeguaychú), Facebook link, and Instagram link are all visible.
2. **Given** a visitor submits the contact form with a valid name, email, and message of at least 10 characters, **When** the submission succeeds, **Then** a success message "Mensaje enviado. Te respondemos pronto." appears.
3. **Given** a visitor attempts to submit the form with an invalid email or a message shorter than 10 characters, **When** the form is submitted, **Then** inline validation errors are shown and submission is blocked.
4. **Given** the form is being submitted, **When** the request is in progress, **Then** the submit button is disabled.
5. **Given** the server returns an error on form submission, **When** the failure occurs, **Then** a generic error message is displayed.
6. **Given** a visitor on mobile views the map, **When** the page loads, **Then** an embedded map of Doello Jurado 1050, Gualeguaychú occupies the full width at 300px height.
7. **Given** a visitor on a larger screen views the map, **When** the page loads, **Then** the map height is 450px.

---

### Edge Cases

- What happens when the schedule API is unavailable? → The schedule section displays a neutral fallback ("Verificá nuestros horarios por WhatsApp") and the open/closed badge is hidden.
- What happens when the menu API returns an empty category list? → A message "No hay categorías disponibles" is shown instead of tabs.
- What happens when the pizza party config API is unavailable? → The price calculator shows a loading state; if it fails to load, an error message prompts the user to contact via WhatsApp.
- What happens when the offers API is unavailable? → The offers section is hidden entirely (same behavior as zero active offers).
- What happens when the weekly menu API returns empty data (null or empty array)? → The WhatsApp fallback card is shown (same as no data case).
- What happens when a user enters a guest count above a very large number in the pizza party calculator? → No upper bound is enforced in the UI; the total is calculated and displayed regardless.

## Requirements *(mandatory)*

### Functional Requirements

**Home Page (/)**

- **FR-001**: The home page MUST display a full-height hero section on mobile (entire viewport height) and a reduced-height hero on larger screens (80% of viewport height), with the restaurant's logo, name, a subtitle, and two navigation buttons.
- **FR-002**: The schedule section MUST fetch live opening-hours data and display a green "Abierto ahora" badge if the restaurant is currently open, or a red "Cerrado" badge if it is not.
- **FR-003**: The schedule section MUST list all weekdays with their respective hours; days marked as closed MUST show "Cerrado" instead of hours; days with a special note MUST show that note below the hours.
- **FR-004**: The specialties section MUST display three cards: "Comidas Caseras" (linking to /menu), "Pizzas Artesanales" (linking to /menu), and "Pizza Party" (linking to /pizza-party), each with a photo, title, brief description, and link.
- **FR-005**: The offers section MUST fetch live offer data; if active offers exist, the section MUST display each offer with a badge, title, description, and expiry date; if no active offers exist, the entire section (including its heading) MUST be hidden.
- **FR-006**: The home page MUST include a Pizza Party CTA banner with background photo, overlay, headline ("Hacé tu Pizza Party con nosotros"), and a link to /pizza-party.

**Menu Page (/menu)**

- **FR-007**: The menu page MUST fetch and display all menu categories as horizontally scrollable tabs; the first category MUST be selected by default.
- **FR-008**: Selecting a category tab MUST display only that category's items.
- **FR-009**: Menu items with a price greater than zero MUST show the item name and price; items with a price of zero MUST appear in a "Variedades disponibles" sub-list without a price.
- **FR-010**: The menu page MUST display the current open/closed schedule status using the same data and visual indicator as the Home page.

**Viandas Page (/viandas)**

- **FR-011**: The viandas page MUST display a static "Cómo funciona" section with calendar and clock visual elements.
- **FR-012**: If weekly menu data is available, the page MUST display an accordion with one collapsible entry per weekday (Monday through Friday), each listing the day's dishes.
- **FR-013**: If no weekly menu data is available, the page MUST display a card with the message "Consultá el menú de esta semana por WhatsApp" and a button that opens WhatsApp.
- **FR-014**: The viandas page MUST display a static benefits list and a CTA button linking to /contacto or WhatsApp.

**Pizza Party Page (/pizza-party)**

- **FR-015**: The pizza party page MUST display a photo carousel with four images that auto-advances every 5 seconds, with previous/next controls and dot position indicators. On mobile, the carousel MUST span the full screen width at a 4:3 aspect ratio.
- **FR-016**: The service description MUST list what is included (empanadas de copetín, 13 pizza varieties, mobile oven, tableware, 3 hours), what is NOT included (drinks, tables, chairs, glasses), and available extras (additional hour, additional waiters).
- **FR-017**: The price calculator MUST accept: guest count (minimum = the configured minimum from service settings), extra hours (0, 1, or 2), and extra waiter count (minimum 0). All numeric inputs on mobile MUST use a numeric keyboard.
- **FR-018**: The price calculator MUST update the total in real time as inputs change, using the formula: total = (guests × price per person) + (extra hours × hourly rate) + (extra waiters × waiter rate). The total MUST be prominently displayed.
- **FR-019**: Clicking the calculator's CTA ("Solicitar este servicio") MUST scroll the page to the request form.
- **FR-020**: The request form MUST include: Name (required), Email (required), Phone (required), Event Date (required), Message (optional). The guest count, extra hours, and extra waiter values from the calculator MUST be pre-filled.
- **FR-021**: On successful form submission, the page MUST show a success toast: "¡Solicitud enviada! Te contactamos pronto."
- **FR-022**: On form submission failure, the page MUST show an error toast: "Hubo un error. Contactanos por WhatsApp."

**Contact Page (/contacto)**

- **FR-023**: The contact page MUST display: phone number (3446-410459), address (Doello Jurado 1050, Gualeguaychú), and links to the restaurant's Facebook and Instagram profiles.
- **FR-024**: The contact form MUST include: Name (required), Email (required, valid format), Phone (optional), Message (required, minimum 10 characters). The submit button MUST be disabled while the request is in progress.
- **FR-025**: On successful submission, a success toast "Mensaje enviado. Te respondemos pronto." MUST appear.
- **FR-026**: On submission failure, a generic error toast MUST appear.
- **FR-027**: The contact page MUST embed a map of Doello Jurado 1050, Gualeguaychú at full width; the map height MUST be 300px on mobile and 450px on larger screens.

**Cross-Cutting**

- **FR-028**: All five pages MUST be designed mobile-first at 375px base width and scale gracefully to larger screens.
- **FR-029**: All live data sections MUST show an appropriate loading state while data is being fetched.
- **FR-030**: All live data sections MUST show a user-friendly fallback if the data fetch fails.

### Key Entities

- **Schedule**: A weekly timetable with per-day open/closed flags, opening/closing times, and optional special notes. Includes a derived "currently open" status.
- **Menu Category**: A named grouping of menu items (e.g., "Pizzas", "Empanadas").
- **Menu Item**: A dish with a name and a price (zero means "variety item" with no fixed price).
- **Offer**: A promotional offer with a badge, title, description, and expiry date; may be active or inactive.
- **Pizza Party Config**: Service configuration including price per person, minimum guest count, hourly rate for extra hours, and rate per extra waiter.
- **Pizza Party Request**: A customer's booking request including personal details, event date, guest count, extras selected, and an optional message.
- **Contact Message**: A general inquiry from a visitor with name, email, optional phone, and message body.
- **Weekly Menu**: A set of daily dish lists for Monday through Friday.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can find the restaurant's address, phone number, and current opening status within 10 seconds of landing on any page.
- **SC-002**: A customer can calculate a pizza party quote and submit a request in under 3 minutes from arriving on `/pizza-party`.
- **SC-003**: The contact form and pizza party request form each have a submission success rate of 100% when the backend is available (no silent failures).
- **SC-004**: All five pages load their primary content within 3 seconds on a standard mobile connection.
- **SC-005**: The schedule open/closed indicator is always current (reflects the actual day and time without requiring a page refresh beyond the initial load).
- **SC-006**: The offers section correctly shows or hides based on active offers data — no static placeholder is ever shown in place of live content.
- **SC-007**: 100% of form validation errors are surfaced to the user inline before submission reaches the server.
- **SC-008**: All pages are fully usable on a 375px-wide mobile screen with no horizontal overflow or truncated content.

## Assumptions

- All five pages are publicly accessible without authentication.
- The backend API endpoints (`/api/schedule`, `/api/menu`, `/api/offers`, `/api/weekly-menu`, `/api/pizza-party/config`, `/api/pizza-party/request`, `/api/contact`) are already implemented and match the contracts established in feature 002 (Public API Routes).
- The WhatsApp link for viandas and fallback messages uses the restaurant's actual WhatsApp number; the exact number will be confirmed during implementation.
- The Google Maps embed for the contact page uses a standard iframe embed; no API key is required for the basic embed.
- The pizza party photo carousel loops indefinitely (wraps from last image back to first).
- The "extra waiters" minimum in the pizza party calculator is zero (none required by default).
- Social media links (Facebook, Instagram) open in a new browser tab.
- The site's navigation structure (header, footer, links between pages) is handled by the existing frontend infrastructure (feature 004) and is out of scope for this specification.
- No admin-facing functionality is included in these five pages; all content displayed is read-only from the visitor's perspective (except form submissions).
