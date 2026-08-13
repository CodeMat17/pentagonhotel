# Pentagon Hotel & Suites — Website Blueprint

> The build spec. Written first, built from.

---

## 1. Brand & Identity

| | |
|---|---|
| **Name** | Pentagon Hotel and Suites |
| **Address** | 1 Solomon Wali Street, Owhipa Choba, Port Harcourt, Rivers State, Nigeria |
| **Phone / WhatsApp** | 08033833628 (+234 803 383 3628) |
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
/manage-booking       Look up / modify / cancel by reference
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
   charge), policy acknowledgement, confirmation with reference `PHS-XXXXXX`, stored
   locally so `/manage-booking` can retrieve, modify and cancel it.

Persistent booking summary (desktop rail, mobile sticky bar). Sonner toasts on every
state change. Skeletons during the availability check.

> **Payment**: the flow is checkout-complete but ends at a clearly-labelled
> "pay on arrival / pay by transfer" confirmation. No card data is collected or stored
> anywhere in this codebase. A PSP (Paystack/Flutterwave) drops into
> `createReservation()` in `lib/booking.ts` once credentials exist.

---

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
real PMS/channel-manager availability, live payment capture. Each needs a backend and
credentials; the UI contracts they plug into are isolated in `lib/booking.ts` and
`lib/data.ts`.
