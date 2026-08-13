/**
 * Reservation domain logic — pricing, availability and persistence.
 *
 * This is the seam where a real PMS / channel manager and a payment provider
 * plug in. `checkAvailability` and `createReservation` are the only two
 * functions the UI calls, and both are already async so swapping the mock for a
 * network call changes nothing above them.
 *
 * No card data is handled here, by design.
 */

import { extraServices, promoCodes, rooms, type Room } from "@/lib/data";
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
  promoCode,
}: {
  room: Room | null;
  nights: number;
  roomCount: number;
  extraIds: string[];
  promoCode?: string | null;
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
    const extra = extraServices.find((service) => service.id === id);
    if (!extra) return total;
    return total + (extra.unit === "night" ? extra.price * nights : extra.price);
  }, 0);

  // Promotions apply to accommodation only — never to extras or tax.
  const promo = promoCode ? promoCodes[promoCode.toUpperCase()] : undefined;
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

export function validatePromoCode(code: string) {
  const promo = promoCodes[code.trim().toUpperCase()];
  return promo ? { valid: true as const, ...promo } : { valid: false as const };
}

/**
 * Stand-in availability check.
 *
 * Deterministically derives "rooms left" from the room slug and the arrival
 * date, so the same search always returns the same answer (a random number
 * would re-roll on every render and look broken). Replace the body with a call
 * to the property management system.
 */
export async function checkAvailability(
  stay: Pick<StayDetails, "from" | "adults" | "children" | "rooms">,
): Promise<Record<string, number>> {
  await new Promise((resolve) => setTimeout(resolve, 550));

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

const STORAGE_KEY = "phs.reservations";

function generateReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return `PHS-${out}`;
}

function readStore(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeStore(reservations: Reservation[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

/**
 * Persists the reservation and returns it with a reference.
 *
 * Today that means localStorage, which is enough to demonstrate confirmation,
 * lookup, modification and cancellation end to end. Point this at the booking
 * API — and trigger the confirmation email/SMS — when one exists.
 */
export async function createReservation(
  input: Omit<Reservation, "reference" | "createdAt" | "status">,
): Promise<Reservation> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const reservation: Reservation = {
    ...input,
    reference: generateReference(),
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };
  writeStore([reservation, ...readStore()]);
  return reservation;
}

export function findReservation(reference: string): Reservation | undefined {
  const needle = reference.trim().toUpperCase();
  return readStore().find((booking) => booking.reference === needle);
}

export function cancelReservation(reference: string): Reservation | undefined {
  const all = readStore();
  const match = all.find((booking) => booking.reference === reference);
  if (!match) return undefined;
  match.status = "cancelled";
  writeStore(all);
  return match;
}

export function listReservations(): Reservation[] {
  return readStore();
}
