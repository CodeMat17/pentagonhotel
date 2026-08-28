import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingFlow } from "@/components/booking/booking-flow";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getExtras,
  getRooms
} from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a room",
  description:
    "Check live availability and book direct at Pentagon Hotel and Suites, Choba, Port Harcourt. Best rate guaranteed, no deposit, free cancellation on most rates.",
  alternates: { canonical: "/booking" },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Book a room · ${site.name}`,
    description:
      "Two minutes, no account, no deposit. Best rate guaranteed when you book direct.",
    url: `${site.url}/booking`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function BookingPage() {
  const [rooms, extraServices] = await Promise.all([getRooms(), getExtras()]);

  return (
    <>
      <PageHeader
        title="Book your stay"
        description="Two minutes, no account, no deposit. Cancel free on most rates, and pay online or at the hotel."
        crumbs={[{ name: "Book", href: "/booking" }]}
      />

      <Section>
        {/* useSearchParams needs a Suspense boundary to keep the route static. */}
        <Suspense fallback={<BookingSkeleton />}>
          <BookingFlow rooms={rooms} extraServices={extraServices} />
        </Suspense>
      </Section>
    </>
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
