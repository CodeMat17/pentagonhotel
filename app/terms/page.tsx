import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Booking terms, cancellation and refund policy, house rules and payment terms for Pentagon International Hotel & Suites, Owhipa Choba, Port Harcourt.",
  alternates: { canonical: "/terms" },
};

const updated = "1 July 2026";

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        description={`Booking terms, cancellation, refunds and house rules. Last updated ${updated}.`}
        crumbs={[{ name: "Terms", href: "/terms" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          <section id="booking" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">Booking terms</h2>
            <ul className="mt-3 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
              <li>A booking is confirmed when you receive a reference beginning PHS-. Until then, no room is held.</li>
              <li>No payment is taken to make a reservation. The room is held against your name until {site.reservation.holdUntilTime} on your arrival date; if you have neither arrived nor contacted us by then it is treated as a no-show and released.</li>
              <li>Rates are quoted per room per night in Nigerian naira and exclude {Math.round(site.tax.vatRate * 100)}% VAT and a {Math.round(site.tax.serviceRate * 100)}% service charge unless stated otherwise.</li>
              <li>The lead guest must be 18 or over and present government-issued photo ID at check-in.</li>
              <li>Room allocation requests (floor, view, connecting rooms) are noted and honoured where possible, but are not guaranteed.</li>
              <li>Group bookings of five rooms or more, and all event bookings, require a 50% deposit and are governed by a separate agreement.</li>
              <li>We may decline or cancel a booking where we reasonably suspect fraud, or where a guest has previously breached these terms.</li>
            </ul>
          </section>

          <section id="cancellation" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">
              Cancellation policy
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Free cancellation window by room type
                </caption>
                <thead>
                  <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                    <th scope="col" className="py-2 text-left font-bold">Room type</th>
                    <th scope="col" className="py-2 text-right font-bold">Free until</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Standard (Standard Queen, Standard King)", "24 hours before arrival"],
                    ["Double Spring, Double King, Double Queen", "24 hours before arrival"],
                    ["Family Spring Room", "48 hours before arrival"],
                    ["Executive Suite", "48 hours before arrival"],
                    ["Executive Spring Suite", "72 hours before arrival"],
                    ["Package and promotional rates", "As stated on the offer"],
                    ["Group bookings (5+ rooms)", "14 days before arrival"],
                  ].map(([type, window]) => (
                    <tr key={type} className="border-b last:border-0">
                      <th scope="row" className="py-3 text-left font-semibold">{type}</th>
                      <td className="py-3 text-right font-extrabold text-brand">{window}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-4 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
              <li>Cancel inside the window and one night&apos;s accommodation is charged.</li>
              <li>Your room is held until {site.reservation.holdUntilTime} on the arrival date. Tell us you are arriving later — by phone, WhatsApp or email, at any hour — and we hold it for as long as you need.</li>
              <li>A no-show is a reservation where the guest neither arrives nor makes contact by the hold time. The reservation is released, the room offered to other guests, and one night may be charged.</li>
              <li>Early departure is charged for the nights booked unless we can re-let the room.</li>
              <li>Cancel through Manage Booking, by phone, by WhatsApp or by email — all four count, and we confirm each in writing.</li>
            </ul>
          </section>

          <section id="refunds" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">Refunds</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Where a refund is due, we return it by the original payment method
              within 10 working days of the cancellation being confirmed. Bank
              transfers may take longer to clear at your end; we will send you the
              transfer reference on the day we send it. Deposits on event bookings
              are refundable on the terms in your event agreement.
            </p>
          </section>

          <section id="payment" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">Payment</h2>
            <ul className="mt-3 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
              <li>There is no online payment. Reserve on this website and settle at the hotel by card, bank transfer or cash. No deposit is required for standard bookings.</li>
              <li>We collect no card details anywhere on this website, and we never ask for them by email or over the phone. If anyone asks you for them in our name that way, it is not us — call {site.phone.display} and tell us.</li>
              <li>A pre-authorisation of ₦25,000 per room may be taken at check-in against incidentals, and is released at checkout.</li>
              <li>Corporate accounts may be invoiced monthly on 30-day terms by prior arrangement.</li>
            </ul>
          </section>

          <section id="house-rules" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">House rules</h2>
            <ul className="mt-3 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
              <li>Check-in from {site.checkIn}, checkout by {site.checkOut}. Reception is staffed 24 hours.</li>
              <li>All rooms and indoor areas are non-smoking. Smoking in a room incurs a ₦50,000 cleaning charge.</li>
              <li>Quiet hours run from 22:00 to 07:00. Music in rooms should not be audible from the corridor.</li>
              <li>Visitors must be registered at reception and may not stay overnight in the room without being added to the booking.</li>
              <li>Pets are not permitted. Assistance dogs are always welcome, at no charge.</li>
              <li>Guests are responsible for damage to the room and its contents beyond fair wear.</li>
              <li>Children under 16 must be accompanied by an adult in the pool, gym, sauna and games lounge.</li>
            </ul>
          </section>

          <section id="liability" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">
              Liability and force majeure
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We insure the building and our own equipment. Guests should insure
              their own valuables; safes are provided in every room and we accept no
              liability for items left outside them. Nothing here limits our
              liability for death or personal injury caused by our negligence. If
              events beyond our reasonable control prevent us from providing the
              room — flooding, civil unrest, prolonged grid and fuel failure — we
              will offer an alternative or a full refund of amounts paid for the
              affected nights.
            </p>
          </section>

          <section id="law" className="scroll-mt-28">
            <h2 className="font-heading text-2xl font-extrabold">Governing law</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              These terms are governed by the laws of the Federal Republic of
              Nigeria, and the courts of Rivers State have jurisdiction. We would
              always rather resolve a complaint directly — raise it with the duty
              manager before you leave, and if that fails, in writing to{" "}
              <a
                href={`mailto:${site.email.general}`}
                className="font-semibold text-brand underline underline-offset-2"
              >
                {site.email.general}
              </a>
              .
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
