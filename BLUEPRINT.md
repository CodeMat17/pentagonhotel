# Pentagon International Hotel & Suites — Website Blueprint

> The build spec. Written first, built from.

---

## 1. Brand & Identity

| | |
|---|---|
| **Name** | Pentagon International Hotel & Suites |
| **Address** | 1 Solomon Wali Street, Owhipa Choba, Port Harcourt, Rivers State, Nigeria |
| **Phone / WhatsApp** | 08033833628 (+234 803 383 3628) |
| **Domain / email** | pentagoninternationalhotel.com · info@pentagoninternationalhotel.com |
| **Positioning** | Refined comfort in Choba — five sides to one promise: Comfort, Cuisine, Care, Connectivity, Celebration |
| **Voice** | Warm, confident, unfussy. Nigerian hospitality without the hard sell. |

### Design language
- **Palette** — ink/charcoal neutrals with a single warm **gold** accent (`--brand`).
  Light mode is warm off-white; dark mode is deep ink. Both are first-class.
- **Type** — **Nunito** only (variable, self-hosted via `next/font/google`), for both
  display and body. Hierarchy comes from weight, tracking and size — not families.
- **Shape** — `--radius: 0.75rem`, generous whitespace, hairline `ring-1` borders
  instead of heavy shadows.
- **Motion** — Framer Motion. Entrances are ~0.6s `[0.16,1,0.3,1]` fades with 16–24px
  travel, staggered 60ms. `prefers-reduced-motion` is honoured everywhere. Motion
  never sits between a guest and the Book button.

---

## 2. Information Architecture

```
/                     Homepage
/rooms                Room index + filters (price, type, guests, bed, amenities)
/rooms/[slug]         Room detail — gallery, specs, amenities, policies, book CTA
/facilities           Amenities by category
/dining               Restaurant, bar, breakfast, room service, table reservation
/events               Conference & event spaces + Request-a-Quote form
/offers               Packages & promotions
/gallery              Filterable lightbox gallery
/location             Map, directions, distances, nearby attractions
/about                Story, values, leadership, awards, sustainability
/services             Guest services A–Z
/faq                  Categorised FAQ (FAQPage schema)
/contact              Contact form + every channel
/accessibility        Accessibility statement + accessible facilities
/booking              Multi-step reservation flow
/manage-booking       Look up / modify / cancel by reference + email or phone
/reservation/[ref]    One guest's reservation — the link sent by WhatsApp
/blog, /blog/[slug]   Journal
/privacy /terms       Legal
not-found             404
sitemap.xml robots.txt manifest.webmanifest opengraph-image
```

### Global chrome
- **Header** — sticky, transparent over the hero then frosted on scroll. Desktop nav,
  theme toggle, persistent **Book Now**. Mobile: hamburger → shadcn **Sheet** tray.
- **Footer** — four link columns (Hotel / Reservations / Information / Contact),
  newsletter, socials, dynamic copyright year, NAP block.
- **Mobile action bar** — fixed bottom: **Call · WhatsApp · Book**. Mobile only.
- **Skip link**, visible focus rings, landmark regions on every page.

---

## 3. Booking Flow (`/booking`)

Four steps, resumable, entirely usable on a phone.

1. **Stay** — shadcn **range Calendar** (`mode="range"`, responsive `numberOfMonths`),
   adults / children / rooms. Live nights count.
2. **Room** — availability-filtered room cards with the rate for the chosen dates.
3. **Extras & Details** — add-ons (airport pickup, breakfast, late checkout, spa),
   promo code, guest information, special requests.
4. **Review & Confirm** — full breakdown (room × nights, extras, 7.5% VAT, 5% service
   charge), the pay-at-hotel notice, the hold policy stated in full, policy
   acknowledgement, then confirmation with reference `PIHS-XXXXXX`.

Persistent booking summary (desktop rail, mobile sticky bar). Sonner toasts on every
state change. Skeletons during the availability check.

> **Payment**: there is none, by design. Pentagon takes no card on this site and
> holds no PSP account here — a reservation is a room held against a name and
> settled at the desk. That makes the *hold* the load-bearing rule: the room is
> kept until a stated hour on the arrival date, after which an unclaimed and
> uncommunicated reservation becomes a **no-show** and the room is released. The
> hour, the wording and the reminder switches all live in the dashboard settings.

### Confirmation & reminders

The moment a reservation commits, Convex schedules two messages — neither can
fail the booking, both are logged onto it:

- **Email (Resend)** — the whole booking. The official document.
- **WhatsApp (Meta Cloud API)** — four lines and a link. The receipt.

The link goes to `/reservation/PIHS-XXXXXX`: a private, `noindex`, uncached page
carrying the stay, the hotel's details, the policies, Add to Calendar, and
directions. A phone number is mandatory at booking; an email address is pressed
for but never required, so a guest who does not use email still gets a booking
they can open.

An hourly Convex cron sends the day-before reminder (from 18:00) and the
arrival-day welcome (from 09:00), and releases every hold that has expired.

## 4. Data Model (`lib/data.ts`)

Typed single source of truth, consumed by pages *and* by JSON-LD.

`Room` · `Facility` · `Offer` · `Venue` · `DiningVenue` · `Review` · `Attraction` ·
`FaqItem` · `Post` · `GalleryImage` · `ServiceItem`

---

## 5. Performance Budget (Lighthouse 100 target)

- Server Components by default; `"use client"` only where interaction demands it
  (calendar, filters, carousel, theme toggle, forms, lightbox, nav sheet).
- Static rendering for every route.
- `next/image` everywhere — AVIF/WebP, explicit `sizes`, `priority` on the LCP hero
  only, lazy elsewhere, aspect-ratio boxes so CLS stays at 0.
- Fonts: one variable family, `display: swap`, self-hosted, preloaded.
- Third parties: none. The map is a click-to-load iframe behind a static preview, so
  it costs nothing on first paint.
- Framer Motion imported per-component; no global animation provider.

## 6. Accessibility Bar (WCAG 2.2 AA)

Semantic landmarks · one `<h1>` per page · logical heading order · 4.5:1 contrast in
both themes · 44px touch targets · keyboard-operable everything · correct focus
trapping in Sheet/Dialog · `aria-live` on booking state · alt text on all imagery ·
reduced-motion honoured · labels + inline errors tied via `aria-describedby`.

## 7. SEO

Metadata per route · canonicals · OG + Twitter cards · dynamic OG image · `sitemap.ts`
· `robots.ts` · breadcrumbs (visual + `BreadcrumbList`) · JSON-LD for
`LodgingBusiness`, `HotelRoom`, `Offer`, `Restaurant`, `FAQPage`, `WebSite`,
`Organization`. Local SEO: consistent NAP, Choba / Port Harcourt / UNIPORT content,
nearby attractions, aggregate rating from the review data only.

## 8. Security & Legal

Security headers in `next.config.ts` (HSTS, X-Frame-Options, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy) · honeypot + timing check on public forms · input
validation on every field · no secrets client-side · no card data · Privacy, Terms,
Booking Terms, Cancellation & Refund, Cookie notice and Accessibility statement all
linked from the footer.

## 9. Deferred (documented, not built)

Multilingual routing, live currency conversion, loyalty programme, guest accounts,
real PMS/channel-manager availability. Each needs a backend and credentials; the
UI contracts they plug into are isolated in `lib/booking.ts` and `lib/data.ts`.

Online payment is **not** deferred — it is a decision. The hotel takes payment at
the desk, and the site is built around that rather than around a missing PSP.
