import type { Metadata } from "next";
import { Suspense } from "react";

import { ManageBooking } from "@/components/booking/manage-booking";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Manage your booking",
  description:
    "Look up, change or cancel a reservation at Pentagon Hotel and Suites using your booking reference.",
  alternates: { canonical: "/manage-booking" },
  robots: { index: false, follow: true },
};

export default function ManageBookingPage() {
  return (
    <>
      <PageHeader
        title="Manage your booking"
        description="Look it up with your reference, change the dates, or cancel — no phone queue required."
        crumbs={[{ name: "Manage booking", href: "/manage-booking" }]}
      />

      <Section>
        <Suspense
          fallback={
            <Skeleton className="mx-auto h-56 w-full max-w-3xl rounded-2xl" />
          }
        >
          <ManageBooking />
        </Suspense>
      </Section>
    </>
  );
}
