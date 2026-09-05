import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pentagon International Hotel & Suites collects, uses and protects your personal data, in line with the Nigeria Data Protection Act 2023.",
  alternates: { canonical: "/privacy" },
};

const updated = "1 July 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description={`How we handle your information. Last updated ${updated}.`}
        crumbs={[{ name: "Privacy", href: "/privacy" }]}
      />

      <Section>
        <div className="prose-style mx-auto max-w-3xl space-y-10">
          <section>
            <h2 className="font-heading text-2xl font-extrabold">Who we are</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {site.name} (RC 1839204), of {site.address.street},{" "}
              {site.address.area}, {site.address.city}, {site.address.state},
              Nigeria, is the data controller for the information described here.
              Questions go to{" "}
              <a
                href={`mailto:${site.email.general}`}
                className="font-semibold text-brand underline underline-offset-2"
              >
                {site.email.general}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">
              What we collect
            </h2>
            <ul className="mt-3 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Booking information</strong> —
                name, email, phone, country, arrival time, stay dates, room and any
                special requests you tell us about.
              </li>
              <li>
                <strong className="text-foreground">Identification</strong> — the
                photo ID we are required to sight at check-in. We record the type
                and number; we do not retain a copy beyond the statutory period.
              </li>
              <li>
                <strong className="text-foreground">Enquiries</strong> — anything
                you send through the contact, events or table-booking forms.
              </li>
              <li>
                <strong className="text-foreground">Marketing preferences</strong> —
                your email address, if you subscribe to our newsletter.
              </li>
              <li>
                <strong className="text-foreground">Technical data</strong> — basic
                server logs (IP address, page, timestamp) kept for security and
                retained for 30 days.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">
              What we do not collect
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We never collect or store card details. This website takes no payment at
              all — reservations are settled at the hotel, through a PCI-compliant
              terminal or by bank transfer — so no card number ever reaches our
              servers or passes through this site. We do not run advertising
              trackers, and we do not sell or share your data with data brokers.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">
              Why we process it
            </h2>
            <ul className="mt-3 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
              <li>To take, hold and honour your reservation (contract).</li>
              <li>To meet hospitality, tax and law-enforcement obligations (legal duty).</li>
              <li>To answer your enquiries and improve the hotel (legitimate interest).</li>
              <li>To send you offers, only if you asked us to (consent, withdrawable at any time).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">
              Who else sees it
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Our hosting provider, our email and SMS providers, our payment
              terminal provider, and the relevant authorities where the law
              requires it. Each is bound by a data-processing agreement. If you
              booked through a travel platform, that platform is a separate
              controller with its own policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">How long we keep it</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Reservation records for seven years, as tax law requires. Enquiries
              for two years. Newsletter subscriptions until you unsubscribe. Server
              logs for 30 days. CCTV footage for 30 days unless it is subject to an
              investigation.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">Your rights</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Under the Nigeria Data Protection Act 2023 you may ask for a copy of
              your data, ask us to correct or delete it, object to processing,
              restrict it, or ask for it in a portable format. Write to{" "}
              <a
                href={`mailto:${site.email.general}`}
                className="font-semibold text-brand underline underline-offset-2"
              >
                {site.email.general}
              </a>{" "}
              and we will respond within 30 days. You may also complain to the
              Nigeria Data Protection Commission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">Cookies</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              This site sets no advertising or analytics cookies. We store your
              light/dark theme choice and any in-progress booking in your own
              browser&apos;s local storage — that data never leaves your device
              unless you submit the booking. The Google Map on the Location and
              Contact pages loads only when you click to load it, and Google sets
              its own cookies at that point.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">Security</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              The site is served over HTTPS with HSTS, and we send strict security
              headers to limit framing and content injection. Access to guest data
              inside the hotel is role-restricted and logged. If a breach occurs
              that puts you at risk, we will tell you and the Commission within 72
              hours.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-extrabold">Changes</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              If this policy changes materially, we will update the date at the top
              and, where the change affects you, tell you directly.
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}
