/**
 * Reservation domain logic — pricing, availability and persistence.
 *
 * Pricing is pure and runs in the browser so the summary updates as the guest
 * types. Everything that must be authoritative — whether a promo code is real,
 * and the reservation itself — is a Convex call, because a discount the client
 * could invent is not a discount.
 *
 * No card data is handled here, by design.
 */

import { m, q } from "@/lib/convex";
import { runMutation, runQuery } from "@/lib/client";
import type { ExtraService, RoomSummary } from "@/lib/content";
import { site } from "@/lib/site";

export interface StayDetails {
  from: Date;
  to: Date;
  adults: number;
  children: number;
  rooms: number;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests: string;
  arrivalTime: string;
}

export interface Reservation {
  reference: string;
  createdAt: string;
  status: "confirmed" | "cancelled";
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomCount: number;
  extras: string[];
  promoCode: string | null;
  guest: GuestDetails;
  total: number;
}

/** A promo code the server has confirmed. */
export interface AppliedPromo {
  code: string;
  discount: number;
  label: string;
}

/** Whole nights between two dates, floored at zero. */
export function nightsBetween(from?: Date, to?: Date): number {
  if (!from || !to) return 0;
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export interface PriceBreakdown {
  nights: number;
  roomCount: number;
  roomSubtotal: number;
  extrasSubtotal: number;
  discount: number;
  discountLabel: string | null;
  vat: number;
  serviceCharge: number;
  total: number;
}

export function calculatePrice({
  room,
  nights,
  roomCount,
  extraIds,
  extras,
  promo,
}: {
  room: RoomSummary | null;
  nights: number;
  roomCount: number;
  extraIds: string[];
  extras: ExtraService[];
  promo?: AppliedPromo | null;
}): PriceBreakdown {
  const empty: PriceBreakdown = {
    nights,
    roomCount,
    roomSubtotal: 0,
    extrasSubtotal: 0,
    discount: 0,
    discountLabel: null,
    vat: 0,
    serviceCharge: 0,
    total: 0,
  };
  if (!room || nights <= 0) return empty;

  const roomSubtotal = room.rate * nights * roomCount;

  const extrasSubtotal = extraIds.reduce((total, id) => {
    const extra = extras.find((service) => service.id === id);
    if (!extra) return total;
    return total + (extra.unit === "night" ? extra.price * nights : extra.price);
  }, 0);

  // Promotions apply to accommodation only — never to extras or tax.
  const discount = promo ? Math.round(roomSubtotal * promo.discount) : 0;

  const taxable = roomSubtotal - discount + extrasSubtotal;
  const vat = Math.round(taxable * site.tax.vatRate);
  const serviceCharge = Math.round(taxable * site.tax.serviceRate);

  return {
    nights,
    roomCount,
    roomSubtotal,
    extrasSubtotal,
    discount,
    discountLabel: promo?.label ?? null,
    vat,
    serviceCharge,
    total: taxable + vat + serviceCharge,
  };
}

/**
 * Codes are never shipped to the browser — the server decides, so a guest
 * cannot read the discount table out of the bundle or invent a code.
 */
export async function validatePromoCode(code: string): Promise<AppliedPromo | null> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return null;
  const result = await runQuery(q.promo, { code: trimmed });
  return result.valid
    ? { code: trimmed, discount: result.discount, label: result.label }
    : null;
}

/**
 * Stand-in availability check.
 *
 * Deterministically derives "rooms left" from the room slug and the arrival
 * date, so the same search always returns the same answer (a random number
 * would re-roll on every render and look broken). Replace the body with a call
 * to the property management system — the signature already allows it to be
 * async and to fail.
 */
export async function checkAvailability(
  stay: Pick<StayDetails, "from" | "adults" | "children" | "rooms">,
  rooms: RoomSummary[],
): Promise<Record<string, number>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const dayKey = Math.floor(stay.from.getTime() / 86_400_000);
  const guests = stay.adults + stay.children;

  return Object.fromEntries(
    rooms.map((room) => {
      if (room.maxAdults + room.maxChildren < Math.ceil(guests / stay.rooms)) {
        return [room.slug, 0];
      }
      const seed = [...room.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
      const booked = (seed + dayKey) % (room.inventory + 1);
      return [room.slug, Math.max(0, room.inventory - booked)];
    }),
  );
}

/**
 * Writes the reservation to Convex and returns it with its reference.
 *
 * The reference is minted server-side and checked for collisions there, so two
 * guests booking at the same instant can never share one.
 */
export async function createReservation(
  input: Omit<Reservation, "reference" | "createdAt" | "status">,
): Promise<Reservation> {
  const { reference } = await runMutation(m.createBooking, input);
  return {
    ...input,
    reference,
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };
}

/** Looks a booking up by reference *and* email — a reference alone is not a key. */
export async function findReservation(
  reference: string,
  email: string,
): Promise<Reservation | null> {
  const booking = await runQuery(q.lookupBooking, {
    reference: reference.trim().toUpperCase(),
    email: email.trim(),
  });
  if (!booking) return null;

  return {
    reference: booking.reference,
    createdAt: new Date(booking._creationTime).toISOString(),
    status: booking.status === "cancelled" ? "cancelled" : "confirmed",
    roomSlug: booking.roomSlug,
    roomName: booking.roomName,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    adults: booking.adults,
    children: booking.children,
    roomCount: booking.roomCount,
    extras: booking.extras,
    promoCode: booking.promoCode,
    guest: booking.guest,
    total: booking.total,
  };
}

export async function cancelReservation(reference: string, email: string) {
  await runMutation(m.cancelBooking, {
    reference: reference.trim().toUpperCase(),
    email: email.trim(),
  });
}
