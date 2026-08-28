"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  CalendarDaysIcon,
  DownloadIcon,
  PhoneIcon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

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
  cancelReservation,
  findReservation,
  type Reservation,
} from "@/lib/booking";
import { cleanError } from "@/lib/client";
import type { ExtraService } from "@/lib/content";
import { formatNaira, site, telLink } from "@/lib/site";

/**
 * Retrieve a booking by reference, then modify or cancel it.
 *
 * The reference alone is not a key: the lookup needs the email the booking was
 * made with, so a guessed or overheard reference reveals nothing. Both are
 * checked server-side.
 */
export function ManageBooking({ extraServices }: { extraServices: ExtraService[] }) {
  const params = useSearchParams();
  const deepLinkRef = params.get("ref");
  const [reference, setReference] = useState(deepLinkRef ?? "");
  const [email, setEmail] = useState("");

  const [booking, setBooking] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  async function lookup() {
    setBusy(true);
    try {
      const found = await findReservation(reference, email);
      setBooking(found);
      setSearched(true);
      if (!found) {
        toast.error("We couldn't find that booking", {
          description: "Check the reference and email, or call us and we'll look it up.",
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
      await cancelReservation(booking.reference, email);
      setBooking({ ...booking, status: "cancelled" });
      toast.success("Booking cancelled", {
        description: `${booking.reference} has been cancelled. A confirmation email is on its way.`,
      });
    } catch (error) {
      toast.error(cleanError(error, "We couldn't cancel that booking."));
    } finally {
      setBusy(false);
    }
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
          Enter the reference from your confirmation email — it starts with PHS- —
          and the email address you booked with.
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
            id="booking-email"
            type="email"
            value={email}
            aria-label="Email address on the booking"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-12 flex-1"
          />
          <Button
            type="submit"
            size="lg"
            disabled={!reference.trim() || !email.trim() || busy}
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
              The reference and email must match the booking exactly. If you booked
              by phone, or you are not sure which address you used, call reception
              and we&apos;ll pull it up in seconds.
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
                  booking.status === "confirmed"
                    ? "bg-brand font-bold text-brand-foreground"
                    : "bg-destructive/15 font-bold text-destructive"
                }
              >
                {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
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
                {formatNaira(booking.total)} — payable online or at the hotel
              </Detail>
              {booking.guest.specialRequests && (
                <Detail label="Special requests">
                  {booking.guest.specialRequests}
                </Detail>
              )}
            </dl>

            {booking.status === "confirmed" && (
              <>
                <Separator className="my-6" />
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="h-11 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
                    render={
                      <Link href={`/booking?room=${booking.roomSlug}`} />
                    }
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
                  Changing dates opens a fresh booking with your room preselected —
                  call {site.phone.display} if you would rather we moved it for you.
                </p>
              </>
            )}
          </article>
        )}
      </div>
    </div>
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
