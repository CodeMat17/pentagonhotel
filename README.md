# Pentagon International Hotel & Suites

The website for Pentagon International Hotel & Suites — 1 Solomon Wali Street, Owhipa Choba,
Port Harcourt. Built with Next.js 16 (App Router), React 19, Tailwind v4,
shadcn/ui on Base UI, Framer Motion and Nunito.

The design spec this was built from is in [BLUEPRINT.md](BLUEPRINT.md).

## Content comes from Convex

Rooms, offers, dining, event spaces, facilities, services, reviews, FAQs, the
gallery and the journal are all managed in the **dashboard**
(`../pentagon-dashboard`) and stored in Convex. This site reads them through
`lib/content.ts` and writes to the same backend when a guest books, sends an
enquiry or joins the newsletter.

Point it at the deployment by copying the URL from the dashboard's `.env.local`:

```bash
cp .env.example .env.local     # then set NEXT_PUBLIC_CONVEX_URL
```

With that variable unset, every content read falls back to the bundled copy in
`lib/data.ts`, so the site still builds and serves — useful in CI, and a safety
net if Convex is unreachable. Guest-facing writes have nothing to fall back to,
so those forms tell the guest to call instead.

Pages revalidate every five minutes (`revalidate = 300`), so an edit made in the
dashboard is live within five.

## Running it

```bash
yarn dev          # http://localhost:3000
yarn build        # production build (all routes prerender statically)
yarn start        # serve the production build
yarn lint         # eslint
npx tsc --noEmit  # typecheck
```

## How it's laid out

```
app/                    one folder per route, all statically rendered
  layout.tsx            fonts, theme, header/footer, global JSON-LD
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx
components/
  booking/              booking-search (hero widget), booking-flow, manage-booking
  forms/                contact, event quote, table reservation
  motion/reveal.tsx     the only Framer Motion wrappers on the site
  ui/                   shadcn components (Base UI primitives)
lib/
  site.ts               NAP, contact channels, tax rates, currency formatting
  convex.ts             the public Convex functions this site calls, and their shapes
  content.ts            every content read, with the bundled fallback
  client.ts             browser-side Convex calls (bookings, enquiries, promos)
  data.ts               type definitions + the fallback copy of all content
  booking.ts            pricing, availability and persistence
  format.ts             hydration-safe date formatting
  nav.ts                navigation model shared by header, tray and footer
```

Everything is a Server Component unless it needs interaction. The client
components are: the header (scroll state + nav tray), theme toggle, booking
search, booking flow, manage-booking, the three forms, the room gallery, the
gallery lightbox, the reviews carousel and the map.

## Things to change before launch

1. **Photography.** Every image currently points at Unsplash and is a stand-in.
   Replace them in `lib/data.ts` (and the handful of hero URLs in `app/*/page.tsx`).
   Prefer local files in `/public` — Next then generates blur placeholders
   automatically and you can drop the `remotePatterns` entry from
   `next.config.ts`.
2. **Domain.** `site.url` in `lib/site.ts` drives canonicals, OG URLs, the
   sitemap and every JSON-LD `@id`.
3. **Email addresses and registration numbers.** `lib/site.ts` and the footer.
4. **Reviews.** `lib/data.ts` holds sample reviews and they feed the
   `aggregateRating` in structured data. Google requires these to be genuine —
   replace them with real ones or remove the `aggregateRating` block from
   `components/structured-data.tsx`.
5. **Content accuracy.** Rates, hours, capacities, distances and policies are
   plausible placeholders written to the brief. Have the hotel check every number.

## Wiring up the real backend

Three functions in `lib/booking.ts` are the entire integration surface:

| Function | Currently | Should become |
|---|---|---|
| `checkAvailability()` | deterministic mock derived from date + room slug | a call to the PMS / channel manager |
| `createReservation()` | writes to `localStorage`, returns a `PHS-` reference | a POST to the booking API, which also sends the confirmation email/SMS |
| `findReservation()` / `cancelReservation()` | reads/writes `localStorage` | authenticated lookup by reference |

All three are already `async` and the UI awaits them, so nothing above them
changes. The forms (contact, events, table booking) resolve locally in the same
way and each has a single `await` to replace with a POST.

**Payment:** the booking flow deliberately stops at "settle at the hotel". No
card data is collected, transmitted or stored anywhere in this codebase. Adding
Paystack or Flutterwave means adding a step after `createReservation()` and
redirecting to the provider's hosted checkout — keep it hosted, and the PCI
scope stays where it is.

## Quality bars

- **Static everything.** All routes prerender; there is no server work per request.
- **Lighthouse.** Run against `yarn build && yarn start`, desktop preset.
  Accessibility, best practices and SEO score 100; performance is high 80s to
  100 depending on the page (the image-heavy homepage is the floor). Local runs
  are dominated by fetching remote Unsplash originals — swapping in local
  photography removes that variable entirely.
- **Accessibility.** WCAG 2.2 AA is the target: landmarks, one `h1` per page,
  4.5:1 contrast in both themes, 44px targets, keyboard-operable everything,
  `prefers-reduced-motion` honoured, and no `aria-hidden` on anything focusable.
- **Security headers** are set in `next.config.ts`. Public forms carry a honeypot
  field and a submission-timing check.

## Notes on the stack

- **shadcn style is `base-nova`**, so the primitives are Base UI, not Radix.
  Practical consequences: `render={<Link/>}` instead of `asChild`, `Select`
  takes an `items` array, and `Accordion`/`Tabs` use Base UI's prop names.
- **lucide-react no longer ships brand icons** — Instagram, Facebook and X are
  hand-drawn in `components/social-icons.tsx`.
- **The map never loads until asked.** `components/map-embed.tsx` renders a
  static preview and only injects the Google iframe on click, so no third-party
  request or cookie happens on first paint.
