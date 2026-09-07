import type { Metadata } from "next";
import {
  BusIcon,
  CarFrontIcon,
  CompassIcon,
  MapPinIcon,
  PlaneIcon,
} from "lucide-react";

import { MapEmbed } from "@/components/map-embed";
import { AddressLink } from "@/components/address-link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { getAttractions, getSettings } from "@/lib/content";
import { formatTime12 } from "@/lib/format";
import { ogImage, resolveContact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Location & Directions",
  description:
    "Pentagon International Hotel & Suites is at 1 Solomon Wali Street, Owhipa Choba, Port Harcourt — 1.2km from UNIPORT and 22km from Port Harcourt International Airport.",
  alternates: { canonical: "/location" },
  openGraph: {
    images: [ogImage],
    title: `Location & Directions · ${site.name}`,
    description:
      "Five minutes from the University of Port Harcourt, 35 minutes from the airport.",
    url: `${site.url}/location`,
  },
};

const gettingHere = [
  {
    Icon: PlaneIcon,
    title: "From the airport",
    body: "Port Harcourt International (PHC) at Omagwa is 22km — around 35 minutes outside rush hour, up to an hour in it. Our transfer is ₦25,000 each way in a saloon car; give us your flight number and we track it, so a delayed landing never means a missed driver.",
  },
  {
    Icon: CarFrontIcon,
    title: "Driving",
    body: "From the East-West Road, turn at Choba junction toward the university and take the second right onto Solomon Wali Street. We are 300m down on the left, behind a cream wall with a manned gate. Forty free spaces on site, CCTV covered.",
  },
  {
    Icon: BusIcon,
    title: "Public transport",
    body: "Keke and bus routes run constantly along the East-West Road to Choba junction, a five-minute walk away. Ask for 'Owhipa' rather than the hotel name and you'll be dropped at the right turning.",
  },
  {
    Icon: CompassIcon,
    title: "GPS",
    body: `${site.geo.latitude}° N, ${site.geo.longitude}° E. Search "Pentagon International Hotel & Suites Choba" — we're on Google Maps with the correct pin, which is not something every hotel on this road can say.`,
  },
];

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function LocationPage() {
  const [attractions, settings] = await Promise.all([
    getAttractions(),
    getSettings(),
  ]);
  const contact = resolveContact(settings);

  const categories = Array.from(
    new Set(attractions.map((place) => place.category)),
  );

  return (
    <>
      <PageHeader
        title="Location & Directions"
        description="On the Choba side of Port Harcourt — walking distance from UNIPORT, a clear run to Onne, and 35 minutes from the airport."
        crumbs={[{ name: "Location", href: "/location" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Find us"
              title={site.name}
              description={
                <>
                  <AddressLink address={contact.address} />
                  <p className="mt-3">
                    Reception is staffed 24 hours. Check-in from{" "}
                    {formatTime12(contact.checkIn)}, checkout by{" "}
                    {formatTime12(contact.checkOut)}.
                  </p>
                </>
              }
            />

            <Stagger className="mt-10 space-y-5">
              {gettingHere.map(({ Icon, title, body }) => (
                <StaggerItem
                  key={title}
                  className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <h2 className="font-heading text-base font-extrabold">
                      {title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.06} className="lg:sticky lg:top-28 lg:h-fit">
            <MapEmbed address={contact.address} />
            <div className="mt-5 rounded-2xl bg-muted/60 p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-extrabold">
                <MapPinIcon className="size-4 text-brand" aria-hidden="true" />
                Parking
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Forty free on-site spaces, covered by CCTV, with security on the
                gate around the clock. No booking needed, and no charge for guests
                or for diners at Solomon&apos;s.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section muted aria-label="Nearby attractions">
        <SectionHeading
          eyebrow="Nearby"
          title="What's around us, and how long it takes"
          description="Times are real-world estimates for a weekday outside rush hour. Add half again between 7–9am and 4–7pm."
        />

        {categories.map((category) => (
          <div key={category} className="mt-10">
            <h3 className="text-xs font-bold tracking-[0.16em] text-brand uppercase">
              {category}
            </h3>
            <Stagger as="ul" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {attractions
                .filter((place) => place.category === category)
                .map((place) => (
                  <StaggerItem
                    as="li"
                    key={place.name}
                    className="rounded-2xl bg-background p-5 ring-1 ring-foreground/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-heading text-base font-extrabold">
                        {place.name}
                      </h4>
                      <span className="shrink-0 text-right">
                        <span className="block font-heading text-sm font-extrabold text-brand">
                          {place.minutes} min
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {place.distanceKm} km
                        </span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {place.note}
                    </p>
                  </StaggerItem>
                ))}
            </Stagger>
          </div>
        ))}
      </Section>
    </>
  );
}
