import type { Metadata } from "next";
import Image from "next/image";
import { ClockIcon, ShirtIcon, UsersIcon, UtensilsIcon } from "lucide-react";

import { TableReservationForm } from "@/components/forms/table-reservation-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { JsonLd, restaurantSchemas } from "@/components/structured-data";
import { getDiningVenues, getSettings } from "@/lib/content";
import { formatNaira, ogImage, resolveContact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dining — Solomon's, The Fifth Bar & Terrace Café",
  description:
    "All-day Nigerian and continental dining at Solomon's, cocktails at The Fifth Bar and coffee at the Terrace Café. Open to hotel guests and to Port Harcourt.",
  alternates: { canonical: "/dining" },
  openGraph: {
    images: [ogImage],
    title: `Dining · ${site.name}`,
    description:
      "Charcoal jollof, fresh fish pepper soup, cocktails on the terrace. Reserve a table online.",
    url: `${site.url}/dining`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function DiningPage() {
  // The restaurant schemas quote the hotel switchboard, so they need the live
  // settings row too.
  const [diningVenues, settings] = await Promise.all([
    getDiningVenues(),
    getSettings(),
  ]);

  return (
    <>
      <JsonLd data={restaurantSchemas(diningVenues, resolveContact(settings))} />

      <PageHeader
        title="Dining"
        description="Three kitchens under one roof, all open to the city as well as to our guests."
        crumbs={[{ name: "Dining", href: "/dining" }]}
        image={{
          src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=75&w=1600",
          alt: "Solomon's Restaurant dining room laid for dinner",
        }}
      />

      {diningVenues.map((venue, index) => (
        <Section key={venue.slug} id={venue.slug} muted={index % 2 === 1}>
          <div
            className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
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
                eyebrow={venue.cuisine}
                title={venue.name}
                description={venue.description}
              />

              <Stagger as="ul" className="mt-8 grid gap-3 sm:grid-cols-3">
                <StaggerItem
                  as="li"
                  className="rounded-xl bg-background p-4 ring-1 ring-foreground/10"
                >
                  <ClockIcon className="size-4 text-brand" aria-hidden="true" />
                  <p className="mt-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Hours
                  </p>
                  <p className="mt-1 text-sm font-semibold">{venue.hours}</p>
                </StaggerItem>
                <StaggerItem
                  as="li"
                  className="rounded-xl bg-background p-4 ring-1 ring-foreground/10"
                >
                  <ShirtIcon className="size-4 text-brand" aria-hidden="true" />
                  <p className="mt-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Dress
                  </p>
                  <p className="mt-1 text-sm font-semibold">{venue.dressCode}</p>
                </StaggerItem>
                <StaggerItem
                  as="li"
                  className="rounded-xl bg-background p-4 ring-1 ring-foreground/10"
                >
                  <UsersIcon className="size-4 text-brand" aria-hidden="true" />
                  <p className="mt-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                    Seats
                  </p>
                  <p className="mt-1 text-sm font-semibold">{venue.capacity}</p>
                </StaggerItem>
              </Stagger>

              <Reveal delay={0.1} className="mt-8">
                <h3 className="flex items-center gap-2 font-heading text-lg font-extrabold">
                  <UtensilsIcon className="size-4 text-brand" aria-hidden="true" />
                  From the menu
                </h3>
                <ul className="mt-4 divide-y rounded-xl bg-background ring-1 ring-foreground/10">
                  {venue.highlights.map((dish) => (
                    <li
                      key={dish.name}
                      className="flex items-start justify-between gap-4 p-4"
                    >
                      <span>
                        <span className="block text-sm font-bold">{dish.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {dish.description}
                        </span>
                      </span>
                      <span className="shrink-0 font-heading text-sm font-extrabold text-brand">
                        {formatNaira(dish.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  A sample of the menu — the full card is at the table, and prices
                  include VAT. Vegetarian, vegan, halal and gluten-free options are
                  always available.
                </p>
              </Reveal>
            </div>
          </div>
        </Section>
      ))}

      <Section id="reserve" aria-label="Reserve a table">
        <SectionHeading
          align="center"
          eyebrow="Reservations"
          title="Reserve a table"
          description="Walk-ins are welcome, but weekends fill after 8pm. Tell us when, and we'll call to confirm."
        />
        <Reveal delay={0.08} className="mx-auto mt-12 max-w-4xl">
          <TableReservationForm
            diningVenues={diningVenues}
            hotelPhone={resolveContact(settings).phoneDisplay}
          />
        </Reveal>
      </Section>

      <Section muted aria-label="Room service and breakfast">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Breakfast",
              body: "A hot buffet with an eggs station, 6:30–10:30 daily. Included with Executive rooms and suites; ₦4,500 per person otherwise.",
            },
            {
              title: "Room service",
              body: "The full Solomon's menu until 23:00, and a reduced overnight menu after that. Dial 9 from your room.",
            },
            {
              title: "Private dining",
              body: "A twelve-seat private room with its own service, for a dinner you'd rather not hold in the main room. Book through the concierge.",
            },
          ].map((item) => (
            <Reveal
              key={item.title}
              className="rounded-2xl bg-background p-6 ring-1 ring-foreground/10"
            >
              <h2 className="font-heading text-lg font-extrabold">{item.title}</h2>
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
