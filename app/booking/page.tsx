import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";

import { BookingFlow } from "@/components/booking/booking-flow";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getExtras,
  getRooms,
  getSettings
} from "@/lib/content";
import {
  ogImage,
  resolvePolicies,
  resolveContact,
  resolveTaxRates,
  site,
  type Contact,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a room",
  description:
    "Reserve a room at Pentagon International Hotel & Suites, Choba, Port Harcourt. No online payment — reserve in two minutes and pay at the hotel. Best rate guaranteed when you book direct.",
  alternates: { canonical: "/booking" },
  robots: { index: true, follow: true },
  openGraph: {
    images: [ogImage],
    title: `Book a room · ${site.name}`,
    description:
      "Two minutes, no account, no payment online. Reserve now, pay at the hotel.",
    url: `${site.url}/booking`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function BookingPage() {
  // VAT and the service charge are the dashboard's to set, so they are resolved
  // here and handed to the flow — the browser never picks its own rate.
  const [rooms, extraServices, settings] = await Promise.all([
    getRooms(),
    getExtras(),
    getSettings(),
  ]);

  const contact = resolveContact(settings);

  // The dashboard's kill switch. It defaults to open: a settings row that could
  // not be read must not take the booking form off the site, so only an explicit
  // `false` closes it.
  const bookingsOpen = settings?.bookingsOpen !== false;

  return (
    <>
      <PageHeader
        title="Book your stay"
        description="Two minutes, no account, no payment. Reserve online and settle at the hotel when you arrive."
        crumbs={[{ name: "Book", href: "/booking" }]}
      />

      <Section>
        {bookingsOpen ? (
          /* useSearchParams needs a Suspense boundary to keep the route static. */
          <Suspense fallback={<BookingSkeleton />}>
            <BookingFlow
              rooms={rooms}
              extraServices={extraServices}
              taxRates={resolveTaxRates(settings)}
              contact={contact}
              policies={resolvePolicies(settings)}
            />
          </Suspense>
        ) : (
          <BookingsClosed contact={contact} />
        )}
      </Section>
    </>
  );
}

/**
 * Shown when the dashboard has closed online booking.
 *
 * Closing the form must never mean closing the hotel: the guest still gets the
 * phone and WhatsApp, because a guest who cannot book online is exactly the one
 * most likely to want to talk to somebody.
 */
function BookingsClosed({ contact }: { contact: Contact }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-card p-8 text-center ring-1 ring-foreground/10">
      <h2 className="font-heading text-2xl font-extrabold">
        Online booking is paused
      </h2>
      <p className="mt-3 text-muted-foreground">
        We are not taking reservations through the website just now — but
        reception is staffed 24 hours and can book you in directly.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button size="lg" className="h-12 font-bold" render={<a href={contact.telHref} />}>
          <PhoneIcon /> Call {contact.phoneDisplay}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 font-bold"
          render={
            <a
              href={contact.whatsapp.reservations}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <MessageCircleIcon /> WhatsApp
        </Button>
      </div>
    </div>
  );
}

function BookingSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]" aria-busy="true">
      <div className="space-y-6">
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
}
