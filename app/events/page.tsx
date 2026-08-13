import type { Metadata } from "next";
import Image from "next/image";
import { CheckIcon, MaximizeIcon, RulerIcon } from "lucide-react";

import { EventQuoteForm } from "@/components/forms/event-quote-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { formatNaira, site } from "@/lib/site";
import { venues } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events & Conference Facilities",
  description:
    "Conference halls, meeting rooms, a boardroom and a garden terrace for weddings — up to 300 guests in Choba, Port Harcourt. Request a quote online.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: `Events & Conferences · ${site.name}`,
    description:
      "Four spaces up to 300 guests, full AV, dedicated entrance and generator-backed power.",
    url: `${site.url}/events`,
  },
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        title="Events & Conferences"
        description="Four spaces, up to 300 guests, and a hall with its own front door — so your registration desk never queues behind hotel check-in."
        crumbs={[{ name: "Events", href: "/events" }]}
        image={{
          src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=75&w=1600",
          alt: "The Pentagon Hall set theatre-style for a conference",
        }}
      />

      {venues.map((venue, index) => (
        <Section key={venue.slug} id={venue.slug} muted={index % 2 === 1}>
          <div
            className={`grid gap-10 lg:grid-cols-2 lg:gap-16 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:sticky lg:top-28 lg:h-fit">
              <Image
                src={venue.image.src}
                alt={venue.image.alt}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>

            <div>
              <SectionHeading
                eyebrow={venue.blurb}
                title={venue.name}
                description={venue.description}
              />

              <Reveal delay={0.06} className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-background p-4 ring-1 ring-foreground/10">
                  <MaximizeIcon className="size-4 text-brand" aria-hidden="true" />
                  <p className="mt-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Floor area
                  </p>
                  <p className="mt-1 font-heading text-lg font-extrabold">
                    {venue.areaSqm} m²
                  </p>
                </div>
                <div className="rounded-xl bg-background p-4 ring-1 ring-foreground/10">
                  <RulerIcon className="size-4 text-brand" aria-hidden="true" />
                  <p className="mt-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Dimensions
                  </p>
                  <p className="mt-1 text-sm font-semibold">{venue.dimensions}</p>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="mt-6">
                <h3 className="font-heading text-lg font-extrabold">
                  Capacity by layout
                </h3>
                <table className="mt-3 w-full text-sm">
                  <caption className="sr-only">
                    Seating capacity for {venue.name} by layout
                  </caption>
                  <thead>
                    <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                      <th scope="col" className="py-2 text-left font-bold">
                        Layout
                      </th>
                      <th scope="col" className="py-2 text-right font-bold">
                        Guests
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {venue.capacities.map((capacity) => (
                      <tr key={capacity.layout} className="border-b last:border-0">
                        <th scope="row" className="py-2.5 text-left font-semibold">
                          {capacity.layout}
                        </th>
                        <td className="py-2.5 text-right font-extrabold tabular-nums">
                          {capacity.seats}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>

              <Stagger as="ul" className="mt-8 grid gap-2 sm:grid-cols-2">
                {venue.equipment.map((item) => (
                  <StaggerItem
                    as="li"
                    key={item}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    {item}
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.1} className="mt-8 rounded-xl bg-brand-muted p-5">
                <p className="text-sm font-semibold text-brand">
                  From {formatNaira(venue.fromRate)} per day
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Day-delegate and residential packages available. Final price
                  depends on layout, catering and AV — request a quote below.
                </p>
              </Reveal>
            </div>
          </div>
        </Section>
      ))}

      <Section id="quote" muted aria-label="Request an event quote">
        <SectionHeading
          align="center"
          eyebrow="Request a quote"
          title="Tell us about your event"
          description="One form, everything we need to price it. Our events team replies within one working day — with availability, a layout plan and a number."
        />
        <Reveal delay={0.08} className="mx-auto mt-12 max-w-5xl">
          <EventQuoteForm />
        </Reveal>
      </Section>

      <Section aria-label="What's included">
        <SectionHeading
          eyebrow="Included with every booking"
          title="The things organisers forget to ask about"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Its own front door",
              body: "The Pentagon Hall has a separate entrance and lobby, so registration never mixes with hotel check-in.",
            },
            {
              title: "Power that holds",
              body: "Generator-backed on automatic changeover, sized for full house load. Your AV doesn't reboot mid-session.",
            },
            {
              title: "Delegate rates",
              body: "Discounted room rates for delegates staying over, and priority on connecting rooms for organisers.",
            },
            {
              title: "An AV team on site",
              body: "Not an external contractor who arrives at 8am. Someone from the hotel is in the room throughout.",
            },
          ].map((item) => (
            <Reveal
              key={item.title}
              className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
            >
              <h3 className="font-heading text-base font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
