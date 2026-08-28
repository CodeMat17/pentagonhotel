import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleIcon, PhoneIcon } from "lucide-react";

import { Icon } from "@/components/icon";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { getGuestServices } from "@/lib/content";
import { site, telLink, whatsapp } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guest Services",
  description:
    "Concierge, airport transfers, laundry, 24-hour room service, car hire, babysitting, currency exchange and medical assistance at Pentagon Hotel and Suites.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Guest Services · ${site.name}`,
    description: "Everything reception can arrange, and when it's available.",
    url: `${site.url}/services`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function ServicesPage() {
  const guestServices = await getGuestServices();

  return (
    <>
      <PageHeader
        title="Guest Services"
        description="Everything reception can arrange for you, with the hours it's available and how much notice we need."
        crumbs={[{ name: "Guest services", href: "/services" }]}
      />

      <Section>
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guestServices.map((service) => (
            <StaggerItem
              as="li"
              key={service.name}
              className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-muted text-brand">
                <Icon name={service.icon} className="size-5" />
              </span>
              <h2 className="mt-4 font-heading text-lg font-extrabold">
                {service.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-3 text-xs font-bold text-brand">
                {service.availability}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section muted aria-label="Airport transfers">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Airport transfer"
              title="We track your flight, so a delay isn't your problem"
              description="Give us your flight number when you book and the driver leaves when the plane actually lands — not when it was scheduled to."
            />
            <dl className="mt-8 divide-y rounded-2xl bg-background ring-1 ring-foreground/10">
              {[
                ["Saloon car (up to 3 guests)", "₦25,000 each way"],
                ["SUV (up to 5 guests)", "₦40,000 each way"],
                ["Notice required", "3 hours minimum"],
                ["Waiting time included", "60 minutes after landing"],
                ["Luggage", "Two large cases per guest"],
                ["Payment", "Added to your room bill"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <dt className="text-sm font-semibold">{label}</dt>
                  <dd className="shrink-0 text-sm font-extrabold text-brand">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl bg-background p-8 ring-1 ring-foreground/10">
            <h2 className="font-heading text-xl font-extrabold">
              Arrange anything
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Reception is staffed 24 hours a day and can arrange every service on
              this page — before you arrive or while you&apos;re here. The fastest
              route is usually WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                className="h-12 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
                render={
                  <a
                    href={whatsapp.transfer}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircleIcon /> Arrange a transfer on WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 font-bold"
                render={<a href={telLink} />}
              >
                <PhoneIcon /> Call {site.phone.display}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-12 font-bold"
                render={<Link href="/contact" />}
              >
                Or send us a message
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
