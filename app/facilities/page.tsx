import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Icon } from "@/components/icon";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { facilityGroups } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Facilities & Amenities",
  description:
    "Pool, 24-hour gym, spa, business centre, conference halls, secure parking and 24-hour reception at Pentagon Hotel and Suites, Choba, Port Harcourt.",
  alternates: { canonical: "/facilities" },
  openGraph: {
    title: `Facilities & Amenities · ${site.name}`,
    description:
      "Recreation, business, guest services and dining — everything on site, and when it's open.",
    url: `${site.url}/facilities`,
  },
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        title="Facilities & Amenities"
        description="Everything on site, and — more usefully — when it's actually open."
        crumbs={[{ name: "Facilities", href: "/facilities" }]}
        image={{
          src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=75&w=1600",
          alt: "The hotel's outdoor swimming pool with loungers and shade",
        }}
      />

      {facilityGroups.map((group, index) => (
        <Section
          key={group.category}
          muted={index % 2 === 1}
          aria-label={group.category}
        >
          <SectionHeading
            eyebrow={group.category}
            title={group.blurb}
          />

          <Stagger
            as="ul"
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {group.items.map((item) => (
              <StaggerItem
                as="li"
                key={item.name}
                className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-muted text-brand">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-extrabold">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                {item.hours && (
                  <p className="mt-3 text-xs font-bold text-brand">{item.hours}</p>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ))}

      <Section aria-label="Book a room">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 lg:py-16">
          <h2 className="display text-3xl sm:text-4xl">
            All of it is included with your room
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base opacity-80">
            Pool, gym, Wi-Fi, parking and 24-hour reception come with every stay.
            The spa and airport transfers are the only extras.
          </p>
          <Button
            size="lg"
            className="mt-8 h-13 bg-brand px-8 text-base font-extrabold text-brand-foreground hover:bg-brand/90"
            render={<Link href="/booking" />}
          >
            Check availability <ArrowRightIcon />
          </Button>
        </div>
      </Section>
    </>
  );
}
