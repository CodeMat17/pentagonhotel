/**
 * Single source of truth for hotel identity (NAP), contact channels and URLs.
 * Everything user-facing — header, footer, schema.org, sitemap, WhatsApp links —
 * reads from here so the details stay consistent for local SEO.
 */

export const site = {
  name: "Pentagon International Hotel & Suites",
  /** For the home-screen icon label and short aria-labels, where the full
   * legal name would be truncated anyway. */
  shortName: "Pentagon International",
  tagline: "Refined comfort in the heart of Choba",
  description:
    "Pentagon International Hotel & Suites offers refined rooms and suites, all-day dining, conference and event spaces in Owhipa Choba, Port Harcourt. Book direct for the best rate.",
  url: "https://pentagoninternationalhotel.com",
  locale: "en_NG",
  currency: "NGN",
  address: {
    street: "1 Solomon Wali Street",
    area: "Owhipa Choba",
    city: "Port Harcourt",
    state: "Rivers State",
    country: "Nigeria",
    countryCode: "NG",
    postalCode: "500102",
  },
  geo: { latitude: 4.8799996, longitude: 6.9103582 },
  /**
   * The hotel's own Google Maps place, not a text search. A search has to
   * resolve and can land on a neighbouring business or nothing at all; this
   * URL carries the place id, so it always opens the hotel's listing with the
   * correct pin. Google's own share link, with its `entry`/`g_ep` session
   * tracking parameters stripped — those are per-session and go stale.
   */
  mapsPlaceUrl:
    "https://www.google.com/maps/place/Pentagon+International+Hotel/@4.8799996,6.9101973,21z/data=!4m9!3m8!1s0x1069ce9d49e8cdab:0x8a41f49dc13ae02f!5m2!4m1!1i2!8m2!3d4.8799996!4d6.9103582!16s%2Fg%2F11g2_5xzcp",
  phone: {
    display: "0803 383 3628",
    local: "08033833628",
    intl: "+2348033833628",
    e164: "2348033833628",
  },
  email: {
    general: "info@pentagoninternationalhotel.com",
    reservations: "reservations@pentagoninternationalhotel.com",
    events: "info@pentagoninternationalhotel.com",
  },
  checkIn: "14:00",
  checkOut: "12:00",
  social: {
    instagram: "https://instagram.com/pentagoninternationalhotel",
    facebook: "https://facebook.com/pentagoninternationalhotel",
    x: "https://x.com/pentagonhotelng",
  },
  /** Rivers State occupancy/consumption tax plus the house service charge. */
  tax: { vatRate: 0.075, serviceRate: 0.05 },

  /**
   * Reservations are free to make and settled at the hotel, so the *hold* is
   * what the guest is really agreeing to. Everything here is stated before the
   * guest confirms, repeated in the confirmation email, and shown again on their
   * reservation page — a policy a guest only meets when it is enforced is not a
   * policy, it is a complaint waiting to happen.
   *
   * The hotel can override the wording and the hour from the dashboard; these
   * are the fallbacks when no settings row has been saved.
   */
  reservation: {
    holdUntilTime: "20:00",
    payment: "Pay at hotel",
    noPaymentNotice:
      "No payment is required to make this reservation. Your room is held according to our reservation and cancellation policy, and you settle at the hotel.",
    cancellation:
      "Cancel free of charge up to 24 hours before your arrival date. Inside 24 hours, one night may be charged.",
    noShow:
      "Your room is held until 20:00 on your arrival date. If you have not arrived or contacted us by then, the reservation is released and the room offered to other guests. Call or WhatsApp us any time if you are running late — we will hold it for you.",
  },
} as const;

/**
 * Everything map-related is driven off the hotel's own listing rather than a
 * text search: `site.geo` are the listing's coordinates, so directions and the
 * embedded map drop the pin on the building instead of resolving a street name
 * that several businesses on this road share.
 */
const pin = `${site.geo.latitude},${site.geo.longitude}`;

/** Turn-by-turn to the hotel, from wherever the guest is. */
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pin}`;

/** The iframe source behind the click-to-load map. */
export const mapsEmbedUrl = `https://www.google.com/maps?q=${pin}&z=17&output=embed`;

export const fullAddress = `${site.address.street}, ${site.address.area}, ${site.address.city}, ${site.address.state}, ${site.address.country}`;

/** Pre-fills the WhatsApp composer so the guest never types the boring part. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${site.phone.e164}?text=${encodeURIComponent(message)}`;
}

export const whatsapp = {
  general: whatsappLink(
    `Hello ${site.name}, I have an enquiry about my stay.`,
  ),
  reservations: whatsappLink(
    `Hello ${site.name}, I would like to make a reservation.`,
  ),
  events: whatsappLink(
    `Hello ${site.name}, I would like to enquire about your event spaces.`,
  ),
  transfer: whatsappLink(
    `Hello ${site.name}, I would like to arrange an airport transfer.`,
  ),
};

export const telLink = `tel:${site.phone.intl}`;

/** Formats kobo-free naira amounts the way Nigerian guests expect. */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ------------------------------------------------------- live contact details

   The dashboard's settings row is the single source of truth for the hotel's
   contact details: an admin changes a number or an address there and the site
   follows. Everything in `site` above is the fallback for the moments the row
   cannot be read — a cold deploy before the first save, or a Convex fetch that
   failed — so a page never renders a blank phone number.                      */

/** The shape `getSettings()` returns, narrowed to what contact display needs. */
export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  reservationsEmail: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

/** "08033833628" → "0803 383 3628". Anything that is not a plain 11-digit
 *  Nigerian local number is left exactly as the admin typed it. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11 || !digits.startsWith("0")) return phone.trim();
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/** A dialable `tel:` target in E.164, from however the number was entered. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+234${digits.slice(1)}`;
  return `tel:${phone.trim()}`;
}

/** The E.164 digits (no `+`) behind a wa.me link, from however it was entered. */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

/** Pre-fills the WhatsApp composer on a number resolved from the dashboard. */
export function waLink(e164: string, message: string): string {
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}

/**
 * Every field is a plain string, deliberately: a resolved `Contact` is handed
 * straight to client components (the header, the mobile action bar) from the
 * root layout, and a function on this object would fail to serialise across
 * that boundary. Pages that need a bespoke WhatsApp message build it with
 * `waLink(contact.whatsappE164, …)` instead.
 */
export interface Contact {
  phoneDisplay: string;
  /** E.164 with the `+`, for `schema.org` and anything expecting a full number. */
  phoneIntl: string;
  telHref: string;
  /** Digits only — the argument `waLink` expects. */
  whatsappE164: string;
  whatsapp: {
    general: string;
    reservations: string;
    events: string;
    transfer: string;
  };
  email: string;
  reservationsEmail: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

/**
 * Resolves the contact details a page should render, preferring the dashboard
 * row and falling back to `site` field by field — a settings row saved before a
 * field existed, or left empty, still yields a usable value.
 */
export function resolveContact(
  settings?: Partial<ContactSettings> | null,
): Contact {
  const phone = settings?.phone?.trim() || site.phone.local;
  const e164 = settings?.whatsapp?.trim()
    ? toE164(settings.whatsapp)
    : site.phone.e164;
  const wa = (message: string) => waLink(e164, message);

  return {
    phoneDisplay: formatPhone(phone),
    phoneIntl: `+${toE164(phone)}`,
    telHref: telHref(phone),
    whatsappE164: e164,
    whatsapp: {
      general: wa(`Hello ${site.name}, I have an enquiry about my stay.`),
      reservations: wa(`Hello ${site.name}, I would like to make a reservation.`),
      events: wa(`Hello ${site.name}, I would like to enquire about your event spaces.`),
      transfer: wa(`Hello ${site.name}, I would like to arrange an airport transfer.`),
    },
    email: settings?.email?.trim() || site.email.general,
    reservationsEmail:
      settings?.reservationsEmail?.trim() || site.email.reservations,
    address: settings?.address?.trim() || fullAddress,
    checkIn: settings?.checkIn?.trim() || site.checkIn,
    checkOut: settings?.checkOut?.trim() || site.checkOut,
  };
}

/** VAT and service charge, as fractions. The dashboard is authoritative. */
export interface TaxRates {
  vatRate: number;
  serviceRate: number;
}

/**
 * A rate is only taken from the settings row when it is a real fraction between
 * 0 and 1 — the dashboard already enforces that on save, and this keeps a
 * malformed or half-migrated row from quoting a guest a nonsense total.
 */
export function resolveTaxRates(
  settings?: Partial<TaxRates> | null,
): TaxRates {
  const usable = (rate: unknown): rate is number =>
    typeof rate === "number" && Number.isFinite(rate) && rate >= 0 && rate <= 1;

  return {
    vatRate: usable(settings?.vatRate) ? settings.vatRate : site.tax.vatRate,
    serviceRate: usable(settings?.serviceRate)
      ? settings.serviceRate
      : site.tax.serviceRate,
  };
}

/** The reservation policy wording a page should quote. */
export interface Policies {
  holdUntilTime: string;
  cancellation: string;
  noShow: string;
}

/**
 * The hold hour and the policy copy, preferring the dashboard row. These three
 * fields were added after the first release, so an older settings row carries
 * none of them — each falls back independently to the wording in `site`.
 */
export function resolvePolicies(
  settings?: {
    holdUntilTime?: string;
    cancellationPolicy?: string;
    noShowPolicy?: string;
  } | null,
): Policies {
  return {
    holdUntilTime:
      settings?.holdUntilTime?.trim() || site.reservation.holdUntilTime,
    cancellation:
      settings?.cancellationPolicy?.trim() || site.reservation.cancellation,
    noShow: settings?.noShowPolicy?.trim() || site.reservation.noShow,
  };
}

/* ------------------------------------------------------------- social card

   Next merges `app/opengraph-image.jpg` into the metadata of the segment that
   owns the file — the root layout — and a page that declares its own
   `openGraph` block replaces that resolved object wholesale, images included.
   So every page with an `openGraph` block spreads this in explicitly, or it
   ships to Facebook, WhatsApp and X with no card image at all.

   `alt` is kept in step with `app/opengraph-image.alt.txt`, which is what the
   root layout and the pages without an `openGraph` block use.               */

export const ogImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: `${site.name}, ${site.address.area}, ${site.address.city}`,
} as const;
