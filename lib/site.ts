/**
 * Single source of truth for hotel identity (NAP), contact channels and URLs.
 * Everything user-facing — header, footer, schema.org, sitemap, WhatsApp links —
 * reads from here so the details stay consistent for local SEO.
 */

export const site = {
  name: "Pentagon Hotel and Suites",
  shortName: "Pentagon Hotel",
  tagline: "Refined comfort in the heart of Choba",
  description:
    "Pentagon Hotel and Suites offers refined rooms and suites, all-day dining, conference and event spaces in Owhipa Choba, Port Harcourt. Book direct for the best rate.",
  url: "https://pentagonhotelandsuites.com",
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
  geo: { latitude: 4.8968, longitude: 6.9128 },
  phone: {
    display: "0803 383 3628",
    local: "08033833628",
    intl: "+2348033833628",
    e164: "2348033833628",
  },
  email: {
    general: "hello@pentagonhotelandsuites.com",
    reservations: "reservations@pentagonhotelandsuites.com",
    events: "events@pentagonhotelandsuites.com",
  },
  checkIn: "14:00",
  checkOut: "12:00",
  social: {
    instagram: "https://instagram.com/pentagonhotelandsuites",
    facebook: "https://facebook.com/pentagonhotelandsuites",
    x: "https://x.com/pentagonhotelng",
  },
  /** Rivers State occupancy/consumption tax plus the house service charge. */
  tax: { vatRate: 0.075, serviceRate: 0.05 },
} as const;

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
