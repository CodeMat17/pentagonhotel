"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { format, parseISO } from "date-fns";
import {
  CalendarDaysIcon,
  DownloadIcon,
  PhoneIcon,
  SearchIcon,
  TicketIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AMEND_STASH_KEY,
  amendBookingHref,
  cancelReservation,
  findReservation,
  isLiveReservation,
  type AmendStash,
  type Reservation,
} from "@/lib/booking";
import { cleanError } from "@/lib/client";
import type { ExtraService } from "@/lib/content";
import { formatNaira, fullAddress, site, telLink } from "@/lib/site";

/**
 * Retrieve a booking by reference, then modify or cancel it.
 *
 * The reference alone is not a key here: cancelling somebody's stay is not
 * something an overheard code should be able to do, so the lookup also wants the
 * email *or* the phone number on the booking. Both are checked server-side.
 *
 * Accepting either matters. Email is strongly encouraged at booking but never
 * required — a guest who booked with a phone number alone must still be able to
 * reach their own reservation.
 */

const STATUS_LABELS: Record<Reservation["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed — pay at hotel",
  "checked-in": "Checked in",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "Released — no show",
};

export function ManageBooking({ extraServices }: { extraServices: ExtraService[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const deepLinkRef = params.get("ref");
  const [reference, setReference] = useState(deepLinkRef ?? "");
  /** The email *or* the phone on the booking — plenty of guests never gave us one. */
  const [contact, setContact] = useState("");

  const [booking, setBooking] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  async function lookup() {
    setBusy(true);
    try {
      const found = await findReservation(reference, contact);
      setBooking(found);
      setSearched(true);
      if (!found) {
        toast.error("We couldn't find that booking", {
          description: "Check the reference and the email or phone you booked with, or call us and we'll look it up.",
        });
      }
    } catch (error) {
      toast.error(cleanError(error, "We couldn't reach the booking system."));
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!booking) return;
    setBusy(true);
    try {
      await cancelReservation(booking.reference, contact);
      setBooking({ ...booking, status: "cancelled" });
      toast.success("Booking cancelled", {
        description: `${booking.reference} has been cancelled and the room released. Nothing is owed.`,
      });
    } catch (error) {
      toast.error(cleanError(error, "We couldn't cancel that booking."));
    } finally {
      setBusy(false);
    }
  }

  /**
   * Reopens the booking flow on this reservation with every field carried over.
   *
   * The stay goes in the query string so the link survives a refresh or a share
   * between the guest's own devices; the guest's name, phone and email go in
   * session storage instead, where they stay out of history and referrers.
   */
  function changeBooking() {
    if (!booking) return;
    const stash: AmendStash = {
      reference: booking.reference,
      guest: booking.guest,
    };
    try {
      sessionStorage.setItem(AMEND_STASH_KEY, JSON.stringify(stash));
    } catch {
      // Private-mode storage refusals only cost the guest a retyped name.
    }
    router.push(amendBookingHref(booking));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void lookup();
        }}
        className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
      >
        <Label htmlFor="reference" className="font-heading text-lg font-extrabold">
          Find your booking
        </Label>
        <p id="reference-hint" className="mt-1 text-sm text-muted-foreground">
          Enter the reference we sent you — it starts with PHS- — and the email
          address or phone number you booked with.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            id="reference"
            value={reference}
            aria-describedby="reference-hint"
            onChange={(event) => setReference(event.target.value.toUpperCase())}
            placeholder="PHS-XXXXXX"
            className="h-12 flex-1 font-mono tracking-wider"
          />
          <Input
            id="booking-contact"
            type="text"
            value={contact}
            aria-label="Email address or phone number on the booking"
            onChange={(event) => setContact(event.target.value)}
            placeholder="you@example.com or 0803 383 3628"
            className="h-12 flex-1"
          />
          <Button
            type="submit"
            size="lg"
            disabled={!reference.trim() || !contact.trim() || busy}
            className="h-12 bg-brand px-6 font-extrabold text-brand-foreground hover:bg-brand/90"
          >
            <SearchIcon /> Find booking
          </Button>
        </div>
      </form>

      <div aria-live="polite">
        {searched && !booking && (
          <div className="mt-6 rounded-2xl border border-dashed p-8 text-center">
            <h2 className="font-heading text-xl font-extrabold">
              No booking with that reference
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              The reference must match, along with the email or phone number on
              the booking. If you booked by phone, or you are not sure which
              details you used, call reception and we&apos;ll pull it up in seconds.
            </p>
            <Button
              size="lg"
              className="mt-6 h-11 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
              render={<a href={telLink} />}
            >
              <PhoneIcon /> Call {site.phone.display}
            </Button>
          </div>
        )}

        {booking && (
          <article className="mt-6 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                  Booking reference
                </p>
                <h2 className="font-heading text-2xl font-extrabold tracking-wider">
                  {booking.reference}
                </h2>
              </div>
              <Badge
                className={
                  isLiveReservation(booking.status)
                    ? "bg-brand font-bold text-brand-foreground"
                    : "bg-destructive/15 font-bold text-destructive"
                }
              >
                {STATUS_LABELS[booking.status]}
              </Badge>
            </div>

            <Separator className="my-6" />

            <dl className="grid gap-5 sm:grid-cols-2">
              <Detail label="Guest">
                {booking.guest.firstName} {booking.guest.lastName}
              </Detail>
              <Detail label="Room">
                {booking.roomName} × {booking.roomCount}
              </Detail>
              <Detail label="Check-in">
                {format(parseISO(booking.checkIn), "EEE d MMM yyyy")} from {site.checkIn}
              </Detail>
              <Detail label="Checkout">
                {format(parseISO(booking.checkOut), "EEE d MMM yyyy")} by {site.checkOut}
              </Detail>
              <Detail label="Nights">{booking.nights}</Detail>
              <Detail label="Guests">
                {booking.adults} adult{booking.adults === 1 ? "" : "s"}
                {booking.children
                  ? `, ${booking.children} child${booking.children === 1 ? "" : "ren"}`
                  : ""}
              </Detail>
              {booking.extras.length > 0 && (
                <Detail label="Extras">
                  {booking.extras
                    .map((id) => extraServices.find((extra) => extra.id === id)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </Detail>
              )}
              <Detail label="Total">
                {formatNaira(booking.total)} — payable at the hotel
              </Detail>
              <Detail label="Room held until">
                {booking.holdUntil.split("T")[1]} on{" "}
                {format(parseISO(booking.checkIn), "EEE d MMM yyyy")}
              </Detail>
              {booking.guest.specialRequests && (
                <Detail label="Special requests">
                  {booking.guest.specialRequests}
                </Detail>
              )}
            </dl>

            {isLiveReservation(booking.status) && (
              <>
                <Separator className="my-6" />
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="h-11 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
                    render={<Link href={`/reservation/${booking.reference}`} />}
                  >
                    <TicketIcon /> View reservation page
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 font-bold"
                    onClick={changeBooking}
                  >
                    <CalendarDaysIcon /> Change dates or room
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 font-bold"
                    onClick={() => window.print()}
                  >
                    <DownloadIcon /> Print / save receipt
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="destructive"
                          size="lg"
                          className="h-11 font-bold"
                        />
                      }
                    >
                      <XCircleIcon /> Cancel booking
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {booking.reference} will be released and the room offered
                          to other guests. If you are inside the free-cancellation
                          window there is nothing to pay; otherwise one night may be
                          charged. This cannot be undone from here.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep booking</AlertDialogCancel>
                        <AlertDialogAction onClick={cancel}>
                          Yes, cancel it
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Changing dates reopens the booking form with everything from{" "}
                  {booking.reference} already filled in; confirming it creates a
                  new reservation, which you can then cancel this one against.
                  Call {site.phone.display} if you would rather we moved it for you.
                </p>
              </>
            )}
            <PrintReceipt booking={booking} extraServices={extraServices} />
          </article>
        )}
      </div>
    </div>
  );
}

/**
 * The one-page receipt.
 *
 * Portalled to `<body>` rather than left inside the article, because print
 * pagination follows the document flow: hiding the rest of the page in place
 * still leaves its height behind, and the guest gets the receipt followed by
 * two blank sheets. As a direct child of body it is the only block left
 * standing (see `#booking-receipt` in globals.css), so the sheet ends where the
 * receipt does.
 */
function PrintReceipt({
  booking,
  extraServices,
}: {
  booking: Reservation;
  extraServices: ExtraService[];
}) {
  const extras = booking.extras
    .map((id) => extraServices.find((extra) => extra.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const receipt = (
    <section id="booking-receipt" className="hidden print:block">
      <header>
        <LogoMark className="receipt-logo" />
        <div>
          <h2>{site.name}</h2>
          <p>
            {fullAddress} · {site.phone.display}
          </p>
        </div>
      </header>

      <h3>
        Booking {booking.reference} — {STATUS_LABELS[booking.status]}
      </h3>

      <table>
        <tbody>
          <ReceiptRow label="Guest">
            {booking.guest.firstName} {booking.guest.lastName}
          </ReceiptRow>
          <ReceiptRow label="Room">
            {booking.roomName} × {booking.roomCount}
          </ReceiptRow>
          <ReceiptRow label="Check-in">
            {format(parseISO(booking.checkIn), "EEE d MMM yyyy")} from {site.checkIn}
          </ReceiptRow>
          <ReceiptRow label="Checkout">
            {format(parseISO(booking.checkOut), "EEE d MMM yyyy")} by {site.checkOut}
          </ReceiptRow>
          <ReceiptRow label="Nights">{booking.nights}</ReceiptRow>
          <ReceiptRow label="Guests">
            {booking.adults} adult{booking.adults === 1 ? "" : "s"}
            {booking.children
              ? `, ${booking.children} child${booking.children === 1 ? "" : "ren"}`
              : ""}
          </ReceiptRow>
          {extras && <ReceiptRow label="Extras">{extras}</ReceiptRow>}
          <ReceiptRow label="Total">
            {formatNaira(booking.total)} — payable at the hotel
          </ReceiptRow>
          <ReceiptRow label="Room held until">
            {booking.holdUntil.split("T")[1]} on{" "}
            {format(parseISO(booking.checkIn), "EEE d MMM yyyy")}
          </ReceiptRow>
        </tbody>
      </table>

      <p>{site.reservation.noPaymentNotice}</p>
    </section>
  );

  // Nothing to portal into until the browser has a document; this subtree is
  // client-rendered anyway (the page reads search params).
  return typeof document === "undefined"
    ? null
    : createPortal(receipt, document.body);
}

function ReceiptRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{children}</td>
    </tr>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{children}</dd>
    </div>
  );
}
