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
  geo: { latitude: 4.8968, longitude: 6.9128 },
  phone: {
    display: "0803 383 3628",
    local: "08033833628",
    intl: "+2348033833628",
    e164: "2348033833628",
  },
  email: {
    general: "info@pentagoninternationalhotel.com",
    reservations: "info@pentagoninternationalhotel.com",
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
