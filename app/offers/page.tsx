import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, TagIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { JsonLd } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getOffers,
  type Offer,
} from "@/lib/content";
import { formatNaira, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offers & Packages",
  description:
    "Weekend escapes, business-week rates, honeymoon and family packages, long-stay and early-booking discounts at Pentagon Hotel and Suites, Port Harcourt.",
  alternates: { canonical: "/offers" },
  openGraph: {
    title: `Offers & Packages · ${site.name}`,
    description:
      "Six packages, bookable only when you book direct with us.",
    url: `${site.url}/offers`,
  },
};

const offerSchema = (offers: Offer[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Offers and packages at ${site.name}`,
  itemListElement: offers.map((offer, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Offer",
      name: offer.title,
      description: offer.description,
      price: offer.fromRate,
      priceCurrency: "NGN",
      url: `${site.url}/offers#${offer.slug}`,
      availability: "https://schema.org/InStock",
    },
  })),
});

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <>
      <JsonLd data={offerSchema(offers)} />

      <PageHeader
        title="Offers & Packages"
        description="Six packages you won't find on the travel platforms — because we don't give them to the travel platforms."
        crumbs={[{ name: "Offers", href: "/offers" }]}
        image={{
          src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=75&w=1600",
          alt: "Poolside loungers in the afternoon sun",
        }}
      />

      <Section>
        <div className="space-y-8">
          {offers.map((offer, index) => (
            <Reveal
              key={offer.slug}
              delay={index * 0.04}
              className="scroll-mt-28"
            >
              <article
                id={offer.slug}
                className="grid overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10 lg:grid-cols-[1fr_1.3fr]"
              >
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-full">
                  <Image
                    src={offer.image.src}
                    alt={offer.image.alt}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-brand text-sm font-extrabold text-brand-foreground">
                    {offer.discountLabel}
                  </Badge>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <h2 className="display text-2xl sm:text-3xl">{offer.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-brand">
                    {offer.validity}
                  </p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {offer.description}
                  </p>

                  <h3 className="mt-6 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                    What&apos;s included
                  </h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {offer.inclusions.map((inclusion) => (
                      <li
                        key={inclusion}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <CheckIcon
                          className="mt-0.5 size-4 shrink-0 text-brand"
                          aria-hidden="true"
                        />
                        {inclusion}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t pt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-heading text-2xl font-extrabold">
                        {formatNaira(offer.fromRate)}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-muted px-2.5 py-1 text-xs font-bold text-brand">
                        <TagIcon className="size-3.5" aria-hidden="true" />
                        Code {offer.code}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="h-12 bg-brand px-6 font-extrabold text-brand-foreground hover:bg-brand/90"
                      render={<Link href="/booking" />}
                    >
                      Book this offer <ArrowRightIcon />
                    </Button>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground">
                    <strong className="font-bold">Terms:</strong> {offer.terms}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section muted aria-label="How our rates work">
        <SectionHeading
          eyebrow="Straight answers"
          title="How our rates actually work"
          description="No dynamic pricing games, no fake countdown timers, no 'only 1 room left!' when there are nine."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              title: "Direct is cheapest",
              body: "We hold back a rate the travel platforms never see. If you find our room cheaper elsewhere on the same terms, we'll match it and take another 5% off.",
            },
            {
              title: "One code per booking",
              body: "Packages don't stack. Apply the code at the extras step and the discount comes off accommodation, before tax.",
            },
            {
              title: "Cancel free, mostly",
              body: "Standard and Deluxe cancel free until 24 hours out, Executive 48, suites 72. Package terms are shown before you confirm.",
            },
          ].map((item) => (
            <Reveal
              key={item.title}
              className="rounded-2xl bg-background p-6 ring-1 ring-foreground/10"
            >
              <h3 className="font-heading text-lg font-extrabold">{item.title}</h3>
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
