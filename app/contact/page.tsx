import type { Metadata } from "next";
import {
  CalendarIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { MapEmbed } from "@/components/map-embed";
import { AddressLink } from "@/components/address-link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { getSettings } from "@/lib/content";
import { formatTime12 } from "@/lib/format";
import { ogImage, resolveContact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Call 0803 383 3628, message us on WhatsApp or email Pentagon International Hotel & Suites, 1 Solomon Wali Street, Owhipa Choba, Port Harcourt. Reception open 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    images: [ogImage],
    title: `Contact · ${site.name}`,
    description: "Phone, WhatsApp, email and address. Reception answers 24 hours.",
    url: `${site.url}/contact`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

/** Built per request: the phone, WhatsApp and inboxes all come from the
 *  dashboard, so the cards cannot be hoisted to module scope. */
function contactChannels(contact: ReturnType<typeof resolveContact>) {
  return [
    {
      Icon: PhoneIcon,
      title: "Call reception",
      detail: contact.phoneDisplay,
      note: "24 hours a day, every day",
      href: contact.telHref,
    },
    {
      Icon: MessageCircleIcon,
      title: "WhatsApp",
      detail: "Message us",
      note: "Usually the fastest reply",
      href: contact.whatsapp.general,
      external: true,
    },
    {
      Icon: CalendarIcon,
      title: "Reservations",
      detail: contact.reservationsEmail,
      note: "Bookings, changes and group rates",
      href: `mailto:${contact.reservationsEmail}`,
    },
    {
      // The settings row models one general inbox, which is the address the
      // events team works out of; `site.email.events` is its fallback.
      Icon: MailIcon,
      title: "Events team",
      detail: contact.email,
      note: "Conferences, weddings and quotes",
      href: `mailto:${contact.email}`,
    },
  ];
}

export default async function ContactPage() {
  const contact = resolveContact(await getSettings());
  const channels = contactChannels(contact);

  return (
    <>
      <PageHeader
        title="Contact us"
        description="Reception is staffed 24 hours a day, and whoever answers works here — no call centre, no queue."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />

      <Section>
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ Icon, title, detail, note, href, external }) => (
            <StaggerItem as="li" key={title}>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10 transition-colors hover:ring-brand"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-muted text-brand">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-4 font-heading text-base font-extrabold">
                  {title}
                </span>
                <span className="mt-1 text-sm font-semibold break-all text-brand">
                  {detail}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">{note}</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section muted aria-label="Send us a message">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Write to us"
              title="Send a message"
              description="Tell us what you need and we'll come back within one working day — usually within the hour during office hours."
            />
            <Reveal delay={0.06} className="mt-8">
              <ContactForm hotelPhone={contact.phoneDisplay} />
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              <MapEmbed address={contact.address} />
            </Reveal>

            <Reveal delay={0.1} className="mt-6 space-y-4">
              <div className="flex gap-3 rounded-2xl bg-background p-5 ring-1 ring-foreground/10">
                <MapPinIcon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h2 className="font-heading text-base font-extrabold">Address</h2>
                  <AddressLink
                    address={contact.address}
                    className="mt-1 text-sm text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl bg-background p-5 ring-1 ring-foreground/10">
                <ClockIcon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <h2 className="font-heading text-base font-extrabold">Hours</h2>
                  <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between gap-4">
                      <dt>Reception</dt>
                      <dd className="font-semibold">24 hours</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Reservations desk</dt>
                      <dd className="font-semibold">7:00 – 22:00</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Events team</dt>
                      <dd className="font-semibold">Mon–Sat, 8:00 – 18:00</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Check-in / checkout</dt>
                      <dd className="font-semibold">
                        {formatTime12(contact.checkIn)} /{" "}
                        {formatTime12(contact.checkOut)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
