import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDoubleIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  UsersIcon,
  WalletIcon,
  XCircleIcon,
} from "lucide-react";

import {
  AddToCalendar,
  CopyReference,
} from "@/components/booking/reservation-actions";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getReservation } from "@/lib/content";
import { formatDateLong, formatTime12 } from "@/lib/format";
import {
  formatNaira,
  fullAddress,
  site,
  telLink,
  whatsappLink,
} from "@/lib/site";

/**
 * A guest's own reservation, at `/reservation/PIHS-XXXXXX`.
 *
 * This page exists because the WhatsApp message deliberately does not carry the
 * booking. A phone message should be a receipt — glanceable, three lines, one
 * link — and everything else belongs somewhere it can be laid out properly, kept
 * current after the booking changes, and read at the door of the hotel.
 *
 * The reference alone opens it. That is the point: it reaches the guest and
 * nobody else, and the server hands back a redacted view with no contact details
 * on it, so a guessed reference is worth nothing. Anything that *changes* the
 * booking still goes through `/manage-booking`, which asks for a second factor.
 */

/**
 * Never cached and never prerendered: a guest who has just cancelled must not be
 * shown a confirmed stay, and this content belongs to one person.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/reservation/[reference]">): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Reservation ${reference.toUpperCase()}`,
    description: `Your reservation at ${site.name}.`,
    // A private page. Out of the index, out of the sitemap, and no referrer
    // leaking the reference to anywhere the guest taps through to.
    robots: { index: false, follow: false, nocache: true },
    referrer: "no-referrer",
  };
}

export default async function ReservationPage({
  params,
}: PageProps<"/reservation/[reference]">) {
  const { reference } = await params;
  const reservation = await getReservation(reference);
  if (!reservation) notFound();

  const cancelled = reservation.status === "cancelled";
  const released = reservation.status === "no-show";
  const arrived =
    reservation.status === "checked-in" || reservation.status === "completed";
  const live = !cancelled && !released;

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  const whatsapp = whatsappLink(
    `Hello ${site.name}, I have a question about my reservation ${reservation.reference}.`,
  );

  return (
    <Section className="pt-28 lg:pt-36">
      <div className="mx-auto max-w-2xl">
        <Banner
          cancelled={cancelled}
          released={released}
          arrived={arrived}
          guestName={reservation.guestName}
        />

        <div className="mt-8 rounded-3xl bg-card ring-1 ring-foreground/10">
          <div className="border-b p-6 text-center sm:p-8">
            <p className="eyebrow justify-center">{site.name}</p>
            <p className="mt-4 text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
              Booking reference
            </p>
            <p className="mt-1 font-heading text-3xl font-extrabold tracking-wider text-brand sm:text-4xl">
              {reservation.reference}
            </p>
            <CopyReference reference={reservation.reference} />
          </div>

          <dl className="divide-y">
            <Row Icon={UsersIcon} label="Guest">
              {reservation.guestName}
            </Row>
            <Row Icon={BedDoubleIcon} label="Room">
              {reservation.roomName}
              {reservation.roomCount > 1 && ` × ${reservation.roomCount}`}
            </Row>
            <Row Icon={CalendarDaysIcon} label="Check-in">
              {formatDateLong(reservation.checkIn)}
              <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                From {formatTime12(reservation.policy.checkIn)}
              </span>
            </Row>
            <Row Icon={CalendarDaysIcon} label="Check-out">
              {formatDateLong(reservation.checkOut)}
              <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                By {formatTime12(reservation.policy.checkOut)} · {reservation.nights} night
                {reservation.nights === 1 ? "" : "s"}
              </span>
            </Row>
            <Row Icon={UsersIcon} label="Guests">
              {reservation.adults} adult{reservation.adults === 1 ? "" : "s"}
              {reservation.children
                ? `, ${reservation.children} child${reservation.children === 1 ? "" : "ren"}`
                : ""}
            </Row>
            <Row Icon={WalletIcon} label="Payment">
              {cancelled || released ? "Nothing due" : "Pay at hotel"}
            </Row>
            <Row Icon={WalletIcon} label="Estimated total">
              <span className="font-heading text-xl font-extrabold">
                {formatNaira(reservation.total)}
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
                Taxes and service charge included. Extras taken during your stay
                are added at checkout.
              </span>
            </Row>
            {reservation.specialRequests && (
              <Row Icon={MessageCircleIcon} label="Your requests">
                {reservation.specialRequests}
              </Row>
            )}
          </dl>
        </div>

        {live && (
          <div className="mt-6 rounded-2xl bg-brand-muted p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-extrabold text-brand">
              <ClockIcon className="size-4" aria-hidden="true" />
              We hold your room until{" "}
              {formatTime12(reservation.holdUntil.split("T")[1])} on{" "}
              {formatDateLong(reservation.checkIn)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              {reservation.policy.noShow}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="h-12 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
            render={<a href={directions} target="_blank" rel="noreferrer" />}
          >
            <MapPinIcon /> Get directions
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 font-bold"
            render={<a href={whatsapp} target="_blank" rel="noreferrer" />}
          >
            <MessageCircleIcon /> Contact the hotel
          </Button>
          {live && (
            <AddToCalendar
              reference={reservation.reference}
              roomName={reservation.roomName}
              checkIn={reservation.checkIn}
              checkOut={reservation.checkOut}
              checkInTime={reservation.policy.checkIn}
            />
          )}
        </div>

        <HotelInformation />

        <div className="mt-8 rounded-2xl bg-muted/60 p-6">
          <h2 className="font-heading text-base font-extrabold">
            Cancellation policy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {reservation.policy.cancellation}
          </p>
          {live && (
            <>
              <Separator className="my-5" />
              <p className="text-sm text-muted-foreground">
                Need to move your dates or cancel? You can do it yourself with
                your reference and the email or phone number you booked with.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 font-bold"
                  render={
                    <Link href={`/manage-booking?ref=${reservation.reference}`} />
                  }
                >
                  <CalendarDaysIcon /> Modify reservation
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 font-bold"
                  render={
                    <Link href={`/manage-booking?ref=${reservation.reference}`} />
                  }
                >
                  <XCircleIcon /> Cancel reservation
                </Button>
              </div>
            </>
          )}
        </div>

        {!reservation.hasEmail && live && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            We don&apos;t have an email address for this booking, so this page and
            your WhatsApp message are your record of it. Call{" "}
            {site.phone.display} if you would like it emailed to you.
          </p>
        )}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- sub-parts */

function Banner({
  cancelled,
  released,
  arrived,
  guestName,
}: {
  cancelled: boolean;
  released: boolean;
  arrived: boolean;
  guestName: string;
}) {
  if (cancelled || released) {
    return (
      <header className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircleIcon className="size-8" aria-hidden="true" />
        </span>
        <h1 className="display mt-6 text-3xl sm:text-4xl">
          {cancelled ? "Reservation cancelled" : "Reservation released"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {cancelled
            ? "This booking has been cancelled and nothing is owed. We would be glad to welcome you another time."
            : `This room was held for you but we did not hear from you, so it has been released. Call ${site.phone.display} — if it is still free, we will book you straight back in.`}
        </p>
      </header>
    );
  }

  return (
    <header className="text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-muted text-brand">
        <CheckCircle2Icon className="size-8" aria-hidden="true" />
      </span>
      <h1 className="display mt-6 text-3xl sm:text-4xl">
        {arrived ? "Welcome, " : "Reservation confirmed"}
        {arrived && guestName.split(" ")[0]}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        {arrived
          ? "You are checked in. Anything you need, reception is there around the clock."
          : "Your room is allocated and waiting. There is nothing to pay until you arrive."}
      </p>
    </header>
  );
}

function Row({
  Icon,
  label,
  children,
}: {
  Icon: typeof UsersIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 p-5 sm:px-8">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0 flex-1 sm:flex sm:gap-4">
        <dt className="w-36 shrink-0 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase sm:pt-0.5">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold sm:mt-0">{children}</dd>
      </div>
    </div>
  );
}

function HotelInformation() {
  return (
    <section className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
      <h2 className="font-heading text-base font-extrabold">Hotel information</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <Info Icon={MapPinIcon} label="Address">
          {fullAddress}
        </Info>
        <Info Icon={PhoneIcon} label="Phone">
          <a href={telLink} className="hover:text-brand">
            {site.phone.display}
          </a>
          <span className="block text-xs font-normal text-muted-foreground">
            Reception answers 24 hours a day
          </span>
        </Info>
        <Info Icon={MailIcon} label="Email">
          <a href={`mailto:${site.email.reservations}`} className="break-all hover:text-brand">
            {site.email.reservations}
          </a>
        </Info>
        <Info Icon={ClockIcon} label="Check-in / check-out">
          From {formatTime12(site.checkIn)} · by {formatTime12(site.checkOut)}
        </Info>
      </dl>
    </section>
  );
}

function Info({
  Icon,
  label,
  children,
}: {
  Icon: typeof UsersIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold">{children}</dd>
      </div>
    </div>
  );
}
