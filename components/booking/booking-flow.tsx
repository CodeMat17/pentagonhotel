"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { addDays, format, parseISO, startOfToday } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BedDoubleIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  LoaderCircleIcon,
  MaximizeIcon,
  PartyPopperIcon,
  PencilLineIcon,
  TagIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AMEND_STASH_KEY,
  calculatePrice,
  checkAvailability,
  createReservation,
  nightsBetween,
  validatePromoCode,
  type AmendStash,
  type AppliedPromo,
  type GuestDetails,
  type Reservation,
} from "@/lib/booking";
import { cleanError } from "@/lib/client";
import type { ExtraService, RoomSummary } from "@/lib/content";
import { formatNaira, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const STEPS = ["Your stay", "Choose a room", "Extras & details", "Confirm"] as const;

const WIDE_QUERY = "(min-width: 768px)";

function subscribeToWide(onChange: () => void) {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const isWide = () => (window.matchMedia(WIDE_QUERY).matches ? 2 : 1);

const emptyGuest: GuestDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "Nigeria",
  specialRequests: "",
  arrivalTime: "",
};

/**
 * Guest details for an amendment travel in session storage rather than the
 * query string — see `AMEND_STASH_KEY` — so a name, phone and email never end
 * up in history, in a shared link or in a referrer.
 *
 * A missing or stale stash is not an error: the guest simply fills the fields
 * in again.
 */
function readAmendStash(reference: string | null): GuestDetails {
  if (!reference || typeof window === "undefined") return emptyGuest;
  try {
    const raw = sessionStorage.getItem(AMEND_STASH_KEY);
    if (!raw) return emptyGuest;
    const stash = JSON.parse(raw) as AmendStash;
    return stash.reference === reference ? { ...emptyGuest, ...stash.guest } : emptyGuest;
  } catch {
    return emptyGuest;
  }
}

export function BookingFlow({
  rooms,
  extraServices,
}: {
  rooms: RoomSummary[];
  extraServices: ExtraService[];
}) {
  const params = useSearchParams();
  const today = startOfToday();

  /**
   * Set when the guest came from "Change dates or room" on an existing booking.
   * Everything they already told us is carried over, so they only have to touch
   * what is actually changing.
   */
  const amendRef = params.get("amend");

  const [step, setStep] = useState(0);

  // ---------------------------------------------------------------- stay
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = params.get("from");
    const to = params.get("to");
    return {
      from: from ? parseISO(from) : addDays(today, 1),
      to: to ? parseISO(to) : addDays(today, 3),
    };
  });
  const [adults, setAdults] = useState(Number(params.get("adults")) || 2);
  const [children, setChildren] = useState(Number(params.get("children")) || 0);
  const [roomCount, setRoomCount] = useState(Number(params.get("rooms")) || 1);
  /**
   * Two months side by side once there's room for them. Read as an external
   * store so the first paint is correct without a post-mount state update.
   */
  const months = useSyncExternalStore(subscribeToWide, isWide, () => 1);

  // --------------------------------------------------------------- room
  const [roomSlug, setRoomSlug] = useState<string | null>(params.get("room"));
  const [availability, setAvailability] = useState<Record<string, number> | null>(
    null,
  );
  const [checking, setChecking] = useState(false);

  // ------------------------------------------------------------- extras
  const [extraIds, setExtraIds] = useState<string[]>(
    () => params.get("extras")?.split(",").filter(Boolean) ?? [],
  );
  const [promoInput, setPromoInput] = useState(() => params.get("promo") ?? "");
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [guest, setGuest] = useState<GuestDetails>(() => readAmendStash(amendRef));
  const [errors, setErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({});
  const [agreed, setAgreed] = useState(false);

  // -------------------------------------------------------- confirmation
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);

  /**
   * A promo code carried over from the original booking still has to be proved
   * by the server — the URL only says which code to ask about.
   */
  const promoParam = params.get("promo");
  useEffect(() => {
    if (!promoParam) return;
    let cancelled = false;
    void validatePromoCode(promoParam)
      .then((result) => {
        if (!cancelled) setPromo(result);
      })
      .catch(() => {
        // Unreachable server: the guest can still apply the code by hand.
      });
    return () => {
      cancelled = true;
    };
  }, [promoParam]);

  const nights = nightsBetween(range?.from, range?.to);
  const room = roomSlug
    ? (rooms.find((candidate) => candidate.slug === roomSlug) ?? null)
    : null;

  const price = useMemo(
    () => calculatePrice({ room, nights, roomCount, extraIds, extras: extraServices, promo }),
    [room, nights, roomCount, extraIds, extraServices, promo],
  );

  /**
   * Availability is fetched when the guest moves onto the room step, not from
   * an effect watching `step` — the transition is the event, and doing it here
   * keeps the request tied to the action that caused it.
   */
  const loadAvailability = useCallback(
    async (from: Date) => {
      setChecking(true);
      try {
        const result = await checkAvailability(
          { from, adults, children, rooms: roomCount },
          rooms,
        );
        setAvailability(result);
      } catch {
        toast.error("We couldn't load live availability", {
          description: `Call ${site.phone.display} and we'll check for you.`,
        });
      } finally {
        setChecking(false);
      }
    },
    [adults, children, roomCount, rooms],
  );

  function goToStep(next: number) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextFromStay() {
    if (!range?.from || !range?.to || nights < 1) {
      toast.error("Pick your dates", {
        description: "Choose a check-in and a checkout date to continue.",
      });
      return;
    }
    goToStep(1);
    void loadAvailability(range.from);
  }

  function nextFromRoom() {
    if (!room) {
      toast.error("Choose a room to continue");
      return;
    }
    goToStep(2);
  }

  // The server owns the discount table; the browser only learns whether the code
  // it was handed is real, and by how much.
  async function applyPromo() {
    setApplyingPromo(true);
    try {
      const result = await validatePromoCode(promoInput);
      if (!result) {
        toast.error("That code isn't valid", {
          description: "Check the spelling, or see our Offers page for live codes.",
        });
        return;
      }
      setPromo(result);
      toast.success("Promo code applied", { description: result.label });
    } catch (error) {
      toast.error(cleanError(error, "We couldn't check that code just now."));
    } finally {
      setApplyingPromo(false);
    }
  }

  /**
   * The phone number is the only hard requirement.
   *
   * It is where the instant confirmation goes, and how reception reaches a guest
   * who has not arrived by the time their hold runs out. An email address is
   * asked for insistently — it carries the full booking document — but plenty of
   * guests here book from a phone and never open a mailbox, and refusing them a
   * room over it would be absurd. So: validated when given, never demanded.
   */
  function validateGuest() {
    const next: Partial<Record<keyof GuestDetails, string>> = {};
    if (guest.firstName.trim().length < 2) next.firstName = "Enter your first name";
    if (guest.lastName.trim().length < 2) next.lastName = "Enter your last name";
    if (guest.phone.replace(/\D/g, "").length < 10)
      next.phone = "We need a phone number to confirm and hold your room";
    if (guest.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(guest.email))
      next.email = "That email address doesn't look right";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextFromDetails() {
    if (!validateGuest()) {
      toast.error("Some details need a look", {
        description: "We've highlighted the fields below.",
      });
      return;
    }
    // Not a blocker, but worth one nudge: without an email there is no booking
    // document, only the WhatsApp receipt and the reservation page.
    if (!guest.email.trim()) {
      toast.warning("No email address", {
        description:
          "You'll still get a WhatsApp confirmation with a link to your booking. Add an email if you'd like the full written confirmation too.",
      });
    }
    goToStep(3);
  }

  async function confirm() {
    if (!room || !range?.from || !range?.to) return;
    if (!agreed) {
      toast.error("Please accept the booking terms to continue");
      return;
    }
    setSubmitting(true);
    try {
      const reservation = await createReservation({
        roomSlug: room.slug,
        roomName: room.name,
        checkIn: format(range.from, "yyyy-MM-dd"),
        checkOut: format(range.to, "yyyy-MM-dd"),
        nights,
        adults,
        children,
        roomCount,
        extras: extraIds,
        promoCode: promo?.code ?? null,
        guest,
        total: price.total,
      });
      setConfirmed(reservation);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Booking confirmed", {
        description: `Your reference is ${reservation.reference}.`,
      });
    } catch {
      toast.error("We couldn't complete that booking", {
        description: `Please call us on ${site.phone.display} and we'll sort it out.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  /* ------------------------------------------------------ confirmation */

  if (confirmed) {
    return <Confirmation reservation={confirmed} price={price} />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <div>
        {amendRef && (
          <div className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl bg-brand-muted p-4 ring-1 ring-brand/25">
            <PencilLineIcon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold">Changing booking {amendRef}</p>
              <p className="mt-1 text-muted-foreground">
                Your dates, room, extras and details are filled in below — change
                whatever you need. Confirming creates a new reservation, so{" "}
                <Link
                  href={`/manage-booking?ref=${amendRef}`}
                  className="font-semibold underline underline-offset-2"
                >
                  cancel {amendRef}
                </Link>{" "}
                once the new one is in, or call {site.phone.display} and we will
                move it for you.
              </p>
            </div>
          </div>
        )}

        <Stepper current={step} onJump={(index) => index < step && goToStep(index)} />

        {/* ----------------------------------------------------- step 1 */}
        {step === 0 && (
          <StepPanel
            title="When are you coming?"
            description="Pick your dates and tell us who's travelling. Nothing is charged at this stage."
          >
            <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-6">
              <Calendar
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={setRange}
                numberOfMonths={months}
                disabled={{ before: today }}
                captionLayout="dropdown"
                className="mx-auto rounded-lg border-0"
              />
            </div>

            <p aria-live="polite" className="mt-4 text-sm font-semibold">
              {nights > 0 ? (
                <>
                  {nights} night{nights === 1 ? "" : "s"} ·{" "}
                  {range?.from && format(range.from, "EEE d MMM")} →{" "}
                  {range?.to && format(range.to, "EEE d MMM yyyy")}
                </>
              ) : (
                <span className="text-muted-foreground">
                  Select a check-in and checkout date
                </span>
              )}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <NumberField label="Adults" hint="13 and over" value={adults} min={1} max={12} onChange={setAdults} />
              <NumberField label="Children" hint="0–12 years" value={children} min={0} max={8} onChange={setChildren} />
              <NumberField label="Rooms" hint="Same floor where we can" value={roomCount} min={1} max={6} onChange={setRoomCount} />
            </div>

            <StepActions
              onNext={nextFromStay}
              nextLabel="See available rooms"
              disabled={nights < 1}
            />
          </StepPanel>
        )}

        {/* ----------------------------------------------------- step 2 */}
        {step === 1 && (
          <StepPanel
            title="Choose your room"
            description={`Availability for ${nights} night${nights === 1 ? "" : "s"} from ${
              range?.from ? format(range.from, "d MMM") : ""
            }, for ${adults + children} guest${adults + children === 1 ? "" : "s"}.`}
          >
            {checking || !availability ? (
              <ul className="space-y-4" aria-busy="true" aria-live="polite">
                <li className="sr-only">Checking availability…</li>
                {[0, 1, 2].map((index) => (
                  <li key={index} className="flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
                    <Skeleton className="size-28 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-3 py-1">
                      <Skeleton className="h-5 w-2/5" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-4">
                {rooms.map((candidate) => (
                  <li key={candidate.slug}>
                    <RoomOption
                      room={candidate}
                      nights={nights}
                      roomCount={roomCount}
                      left={availability[candidate.slug] ?? 0}
                      selected={roomSlug === candidate.slug}
                      onSelect={() => setRoomSlug(candidate.slug)}
                    />
                  </li>
                ))}
              </ul>
            )}

            <StepActions
              onBack={() => goToStep(0)}
              onNext={nextFromRoom}
              nextLabel="Add extras"
              disabled={!room}
            />
          </StepPanel>
        )}

        {/* ----------------------------------------------------- step 3 */}
        {step === 2 && (
          <StepPanel
            title="Extras and your details"
            description="Everything here is optional except your name and a phone number — that is where your confirmation goes."
          >
            <fieldset>
              <legend className="font-heading text-lg font-extrabold">
                Add to your stay
              </legend>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {extraServices.map((extra) => {
                  const checked = extraIds.includes(extra.id);
                  return (
                    <li key={extra.id}>
                      <label
                        className={cn(
                          "flex h-full cursor-pointer gap-3 rounded-xl p-4 ring-1 transition-colors",
                          checked
                            ? "bg-brand-muted ring-brand"
                            : "bg-card ring-foreground/10 hover:ring-foreground/25",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            setExtraIds((current) =>
                              value === true
                                ? [...current, extra.id]
                                : current.filter((id) => id !== extra.id),
                            )
                          }
                          className="mt-0.5"
                        />
                        <span>
                          <span className="block text-sm font-bold">{extra.name}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {extra.description}
                          </span>
                          <span className="mt-1.5 block text-sm font-extrabold text-brand">
                            {formatNaira(extra.price)}
                            <span className="font-semibold text-muted-foreground">
                              {extra.unit === "night" ? " per night" : " per stay"}
                            </span>
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <Separator className="my-8" />

            <div>
              <Label htmlFor="promo" className="font-heading text-lg font-extrabold">
                Promotional code
              </Label>
              <p id="promo-hint" className="mt-1 text-sm text-muted-foreground">
                Have a code from one of our packages? Add it here.
              </p>
              <div className="mt-3 flex gap-2">
                <Input
                  id="promo"
                  value={promoInput}
                  aria-describedby="promo-hint"
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="e.g. WEEKEND15"
                  className="h-11 max-w-xs uppercase"
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 font-bold"
                  onClick={() => void applyPromo()}
                  disabled={!promoInput.trim() || applyingPromo}
                >
                  <TagIcon /> {applyingPromo ? "Checking…" : "Apply"}
                </Button>
              </div>
              {promo && (
                <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand">
                  <CheckIcon className="size-4" aria-hidden="true" />
                  {promo.code} applied — {formatNaira(price.discount)} off
                </p>
              )}
            </div>

            <Separator className="my-8" />

            <fieldset>
              <legend className="font-heading text-lg font-extrabold">
                Guest details
              </legend>
              <p className="mt-1 text-sm text-muted-foreground">
                No account needed. We use these only to confirm your booking and hold your room.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field
                  id="firstName"
                  label="First name"
                  value={guest.firstName}
                  error={errors.firstName}
                  autoComplete="given-name"
                  onChange={(value) => setGuest({ ...guest, firstName: value })}
                />
                <Field
                  id="lastName"
                  label="Last name"
                  value={guest.lastName}
                  error={errors.lastName}
                  autoComplete="family-name"
                  onChange={(value) => setGuest({ ...guest, lastName: value })}
                />
                <Field
                  id="phone"
                  label="Phone / WhatsApp"
                  type="tel"
                  value={guest.phone}
                  error={errors.phone}
                  required
                  autoComplete="tel"
                  hint="Required. Your instant confirmation arrives here on WhatsApp."
                  onChange={(value) => setGuest({ ...guest, phone: value })}
                />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={guest.email}
                  error={errors.email}
                  autoComplete="email"
                  hint="Strongly recommended — your full booking document is emailed here."
                  onChange={(value) => setGuest({ ...guest, email: value })}
                />
                <Field
                  id="country"
                  label="Country"
                  value={guest.country}
                  autoComplete="country-name"
                  onChange={(value) => setGuest({ ...guest, country: value })}
                />
                <Field
                  id="arrivalTime"
                  label="Estimated arrival time"
                  type="time"
                  value={guest.arrivalTime}
                  hint="Optional — reception is open 24 hours."
                  onChange={(value) => setGuest({ ...guest, arrivalTime: value })}
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="requests">Special requests</Label>
                <Textarea
                  id="requests"
                  rows={4}
                  value={guest.specialRequests}
                  onChange={(event) =>
                    setGuest({ ...guest, specialRequests: event.target.value })
                  }
                  placeholder="High floor, away from the lift, cot needed, late arrival…"
                  className="mt-2"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  We&apos;ll do our best — requests aren&apos;t guaranteed and
                  aren&apos;t charged.
                </p>
              </div>
            </fieldset>

            <StepActions
              onBack={() => goToStep(1)}
              onNext={nextFromDetails}
              nextLabel="Review booking"
            />
          </StepPanel>
        )}

        {/* ----------------------------------------------------- step 4 */}
        {step === 3 && room && range?.from && range?.to && (
          <StepPanel
            title="Review and confirm"
            description="One last look. Nothing is charged now — you settle at the hotel."
          >
            <dl className="divide-y rounded-2xl bg-card ring-1 ring-foreground/10">
              <Row label="Room">
                {room.name} × {roomCount}
              </Row>
              <Row label="Dates">
                {format(range.from, "EEE d MMM yyyy")} → {format(range.to, "EEE d MMM yyyy")} ({nights} night{nights === 1 ? "" : "s"})
              </Row>
              <Row label="Guests">
                {adults} adult{adults === 1 ? "" : "s"}
                {children ? `, ${children} child${children === 1 ? "" : "ren"}` : ""}
              </Row>
              <Row label="Lead guest">
                {guest.firstName} {guest.lastName} · {guest.email} · {guest.phone}
              </Row>
              {extraIds.length > 0 && (
                <Row label="Extras">
                  {extraIds
                    .map((id) => extraServices.find((extra) => extra.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </Row>
              )}
              {guest.specialRequests && (
                <Row label="Requests">{guest.specialRequests}</Row>
              )}
              <Row label="Cancellation">{room.cancellation}</Row>
            </dl>

            <div className="mt-6 rounded-2xl bg-muted/60 p-5">
              <h3 className="flex items-center gap-2 font-heading text-base font-extrabold">
                <WalletIcon className="size-4 text-brand" aria-hidden="true" />
                Nothing to pay now
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {site.reservation.noPaymentNotice} Settle by card, bank transfer
                or cash at reception. No card details are collected on this site.
                Corporate guests can request an invoice at check-in.
              </p>
            </div>

            {/*
              The hold is what a guest is really agreeing to when no deposit
              changes hands, so it is stated in full here — before the button,
              not buried behind a link to the terms page.
            */}
            <div className="mt-4 rounded-2xl bg-brand-muted p-5">
              <h3 className="flex items-center gap-2 font-heading text-base font-extrabold text-brand">
                <ClockIcon className="size-4" aria-hidden="true" />
                How long we hold your room
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                Your room is held until{" "}
                <strong>
                  {site.reservation.holdUntilTime} on{" "}
                  {format(range.from, "EEEE d MMMM")}
                </strong>
                . If you have not arrived or contacted us by then, the
                reservation is released and the room offered to other guests.
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                Running late? Call or WhatsApp {site.phone.display} at any hour
                and we will keep it for you. {site.reservation.cancellation}
              </p>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
              <Checkbox
                checked={agreed}
                onCheckedChange={(value) => setAgreed(value === true)}
                className="mt-0.5"
                aria-describedby="terms-text"
              />
              <span id="terms-text">
                I understand the room is held until{" "}
                {site.reservation.holdUntilTime} on my arrival date and paid for
                at the hotel, and I accept the{" "}
                <Link href="/terms#booking" className="font-semibold text-brand underline underline-offset-2">
                  booking terms
                </Link>
                ,{" "}
                <Link href="/terms#cancellation" className="font-semibold text-brand underline underline-offset-2">
                  cancellation policy
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-brand underline underline-offset-2">
                  privacy policy
                </Link>
                .
              </span>
            </label>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                size="lg"
                className="h-12 font-bold"
                onClick={() => goToStep(2)}
              >
                <ArrowLeftIcon /> Back
              </Button>
              <Button
                size="lg"
                onClick={confirm}
                disabled={submitting || !agreed}
                className="h-13 bg-brand px-8 text-base font-extrabold text-brand-foreground hover:bg-brand/90"
              >
                {submitting ? (
                  <>
                    <LoaderCircleIcon className="animate-spin" /> Confirming…
                  </>
                ) : (
                  <>
                    Reserve room · {formatNaira(price.total)} at the hotel
                    <ArrowRightIcon />
                  </>
                )}
              </Button>
            </div>
          </StepPanel>
        )}
      </div>

      <BookingSummary
        room={room}
        nights={nights}
        adults={adults}
        childCount={children}
        roomCount={roomCount}
        range={range}
        extraIds={extraIds}
        price={price}
      />
    </div>
  );
}

/* ------------------------------------------------------------- sub-parts */

function Stepper({
  current,
  onJump,
}: {
  current: number;
  onJump: (index: number) => void;
}) {
  return (
    <ol className="mb-10 flex flex-wrap gap-x-2 gap-y-3">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onJump(index)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold transition-colors",
                active && "bg-brand text-brand-foreground",
                done && "text-brand hover:bg-brand-muted",
                !active && !done && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs ring-1",
                  active
                    ? "bg-brand-foreground text-brand ring-transparent"
                    : done
                      ? "bg-brand text-brand-foreground ring-transparent"
                      : "ring-border",
                )}
              >
                {done ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="h-px w-4 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-live="polite">
      <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function StepActions({
  onBack,
  onNext,
  nextLabel,
  disabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {onBack ? (
        <Button variant="outline" size="lg" className="h-12 font-bold" onClick={onBack}>
          <ArrowLeftIcon /> Back
        </Button>
      ) : (
        <span />
      )}
      <Button
        size="lg"
        onClick={onNext}
        disabled={disabled}
        className="h-12 bg-brand px-6 font-extrabold text-brand-foreground hover:bg-brand/90"
      >
        {nextLabel} <ArrowRightIcon />
      </Button>
    </div>
  );
}

function NumberField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = `field-${label.toLowerCase()}`;
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Label htmlFor={id} className="text-sm font-bold">
        {label}
      </Label>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(Math.min(max, Math.max(min, Number(event.target.value) || min)))
        }
        className="mt-2 h-11"
      />
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  hint,
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  hint?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-1 text-brand" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11"
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function RoomOption({
  room,
  nights,
  roomCount,
  left,
  selected,
  onSelect,
}: {
  room: RoomSummary;
  nights: number;
  roomCount: number;
  left: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const soldOut = left < roomCount;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-card p-4 ring-1 transition-all sm:flex-row",
        selected ? "ring-2 ring-brand" : "ring-foreground/10",
        soldOut && "opacity-60",
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl sm:size-32">
        <Image
          src={room.images[0].src}
          alt={room.images[0].alt}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, 128px"
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-base font-extrabold">{room.name}</h3>
            <p className="text-sm text-brand">{room.tagline}</p>
          </div>
          {soldOut ? (
            <Badge className="bg-muted font-bold text-muted-foreground">
              Not available
            </Badge>
          ) : left <= 3 ? (
            <Badge className="bg-brand-muted font-bold text-brand">
              Only {left} left
            </Badge>
          ) : (
            <Badge className="bg-muted font-bold text-muted-foreground">
              {left} available
            </Badge>
          )}
        </div>

        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <MaximizeIcon className="size-3.5 text-brand" aria-hidden="true" />
            {room.sizeSqm} m²
          </li>
          <li className="flex items-center gap-1.5">
            <BedDoubleIcon className="size-3.5 text-brand" aria-hidden="true" />
            {room.bed}
          </li>
          <li className="flex items-center gap-1.5">
            <UsersIcon className="size-3.5 text-brand" aria-hidden="true" />
            Up to {room.maxAdults + room.maxChildren}
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-heading text-lg font-extrabold text-foreground">
              {formatNaira(room.rate * nights * roomCount)}
            </span>{" "}
            total · {formatNaira(room.rate)}/night
          </p>
          <Button
            size="lg"
            variant={selected ? "default" : "outline"}
            disabled={soldOut}
            onClick={onSelect}
            className={cn(
              "h-11 font-bold",
              selected && "bg-brand text-brand-foreground hover:bg-brand/90",
            )}
          >
            {selected ? (
              <>
                <CheckIcon /> Selected
              </>
            ) : (
              "Select"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase sm:pt-0.5">
        {label}
      </dt>
      <dd className="text-sm font-semibold">{children}</dd>
    </div>
  );
}

function BookingSummary({
  room,
  nights,
  adults,
  childCount,
  roomCount,
  range,
  extraIds,
  price,
}: {
  room: RoomSummary | null;
  nights: number;
  adults: number;
  childCount: number;
  roomCount: number;
  range: DateRange | undefined;
  extraIds: string[];
  price: ReturnType<typeof calculatePrice>;
}) {
  return (
    <aside
      aria-label="Booking summary"
      className="lg:sticky lg:top-28 lg:h-fit"
    >
      <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="font-heading text-lg font-extrabold">Your booking</h2>

        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex gap-2.5">
            <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <span>
              {range?.from && range?.to ? (
                <>
                  {format(range.from, "d MMM")} – {format(range.to, "d MMM yyyy")}
                  <span className="block text-xs text-muted-foreground">
                    {nights} night{nights === 1 ? "" : "s"} · check-in {site.checkIn}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">Dates not set</span>
              )}
            </span>
          </li>
          <li className="flex gap-2.5">
            <UsersIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <span>
              {adults} adult{adults === 1 ? "" : "s"}
              {childCount
                ? `, ${childCount} child${childCount === 1 ? "" : "ren"}`
                : ""}
              <span className="block text-xs text-muted-foreground">
                {roomCount} room{roomCount === 1 ? "" : "s"}
              </span>
            </span>
          </li>
          <li className="flex gap-2.5">
            <BedDoubleIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            <span>
              {room ? room.name : <span className="text-muted-foreground">No room chosen yet</span>}
            </span>
          </li>
        </ul>

        <Separator className="my-5" />

        {room && nights > 0 ? (
          <dl className="space-y-2 text-sm" aria-live="polite">
            <Line
              label={`${formatNaira(room.rate)} × ${nights} night${nights === 1 ? "" : "s"} × ${roomCount}`}
              value={formatNaira(price.roomSubtotal)}
            />
            {price.discount > 0 && (
              <Line
                label={price.discountLabel ?? "Discount"}
                value={`−${formatNaira(price.discount)}`}
                accent
              />
            )}
            {extraIds.length > 0 && (
              <Line label="Extras" value={formatNaira(price.extrasSubtotal)} />
            )}
            <Line
              label={`VAT (${Math.round(site.tax.vatRate * 100)}%)`}
              value={formatNaira(price.vat)}
              muted
            />
            <Line
              label={`Service charge (${Math.round(site.tax.serviceRate * 100)}%)`}
              value={formatNaira(price.serviceCharge)}
              muted
            />
            <Separator className="my-3" />
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-heading font-extrabold">Total</dt>
              <dd className="font-heading text-2xl font-extrabold">
                {formatNaira(price.total)}
              </dd>
            </div>
            <p className="text-xs text-muted-foreground">
              All taxes and charges included. Payable at the hotel.
            </p>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Pick your dates and a room to see the full price, taxes included.
          </p>
        )}
      </div>
    </aside>
  );
}

function Line({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn(muted && "text-muted-foreground", accent && "text-brand")}>
        {label}
      </dt>
      <dd
        className={cn(
          "shrink-0 font-semibold tabular-nums",
          muted && "text-muted-foreground",
          accent && "text-brand",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Confirmation({
  reservation,
  price,
}: {
  reservation: Reservation;
  price: ReturnType<typeof calculatePrice>;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-foreground/10 sm:p-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-muted text-brand">
          <PartyPopperIcon className="size-8" aria-hidden="true" />
        </span>

        <h2 className="display mt-6 text-3xl sm:text-4xl">
          You&apos;re booked, {reservation.guest.firstName}
        </h2>
        <p className="mt-3 text-muted-foreground">
          A WhatsApp confirmation is on its way to {reservation.guest.phone}
          {reservation.guest.email ? (
            <>
              , and your full booking document to {reservation.guest.email}
            </>
          ) : null}
          . Reception is expecting you — nothing to pay until you arrive.
        </p>

        <div className="mt-8 rounded-2xl bg-brand-muted p-5">
          <p className="text-xs font-bold tracking-[0.16em] text-brand uppercase">
            Booking reference
          </p>
          <p className="mt-1 font-heading text-3xl font-extrabold tracking-wider text-brand">
            {reservation.reference}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 font-bold text-brand"
            onClick={() => {
              navigator.clipboard.writeText(reservation.reference);
              toast.success("Reference copied");
            }}
          >
            <CopyIcon /> Copy reference
          </Button>
        </div>

        <dl className="mt-8 divide-y rounded-2xl text-left ring-1 ring-foreground/10">
          <Row label="Room">
            {reservation.roomName} × {reservation.roomCount}
          </Row>
          <Row label="Check-in">
            {format(parseISO(reservation.checkIn), "EEEE d MMMM yyyy")} from {site.checkIn}
          </Row>
          <Row label="Checkout">
            {format(parseISO(reservation.checkOut), "EEEE d MMMM yyyy")} by {site.checkOut}
          </Row>
          <Row label="Guests">
            {reservation.adults} adult{reservation.adults === 1 ? "" : "s"}
            {reservation.children
              ? `, ${reservation.children} child${reservation.children === 1 ? "" : "ren"}`
              : ""}
          </Row>
          <Row label="Payment">Pay at the hotel — {formatNaira(price.total)}</Row>
          <Row label="Room held until">
            {reservation.holdUntil.split("T")[1]} on{" "}
            {format(parseISO(reservation.checkIn), "EEEE d MMMM")}
          </Row>
        </dl>

        <p className="mt-4 text-left text-xs leading-relaxed text-muted-foreground">
          {site.reservation.noPaymentNotice} If you have not arrived or contacted
          us by the time above, the reservation is released. Running late? Call
          or WhatsApp {site.phone.display} and we will hold it.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="h-12 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
            render={<Link href={`/reservation/${reservation.reference}`} />}
          >
            View your reservation
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 font-bold"
            render={<Link href={`/manage-booking?ref=${reservation.reference}`} />}
          >
            Change or cancel
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Need to change something? Call {site.phone.display} — reception answers
          24 hours a day.
        </p>
      </div>
    </div>
  );
}
