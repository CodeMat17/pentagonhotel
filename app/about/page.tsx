import type { Metadata } from "next";
import Image from "next/image";
import { AwardIcon, HeartHandshakeIcon, LeafIcon, TargetIcon } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { ratingSummary } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the hotel",
  description:
    "Pentagon Hotel and Suites in Owhipa Choba — a purpose-built hotel in Port Harcourt, what we stand for, and the standards we hold ourselves to.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${site.name}`,
    description: "A purpose-built hotel in Owhipa Choba, Port Harcourt.",
    url: `${site.url}/about`,
  },
};

const values = [
  {
    Icon: HeartHandshakeIcon,
    title: "Hospitality that isn't performed",
    body: "Warm, attentive service delivered by a trained team who know the hotel and the city. Requests are handled promptly, and guests are recognised and remembered on return visits.",
  },
  {
    Icon: TargetIcon,
    title: "The essentials, done properly",
    body: "Uninterrupted power, strong water pressure, quality bedding and Wi-Fi that holds up under load. These decide the quality of a stay more than anything else, so they come first.",
  },
  {
    Icon: LeafIcon,
    title: "Built to run responsibly",
    body: "Solar pre-heating on the hot-water system, LED lighting throughout, linen changed on request rather than daily by default, and no single-use plastic bottles in the rooms.",
  },
  {
    Icon: AwardIcon,
    title: "Rooted in the community",
    body: "Fresh produce is sourced from Choba Market, our team is drawn from the surrounding community, and our events desk works with local suppliers wherever possible.",
  },
];

const timeline = [
  {
    year: "2016",
    title: "Ground broken on Solomon Wali Street",
    body: "Construction begins on a purpose-built hotel designed for business travellers, visiting academics and families arriving into Choba.",
  },
  {
    year: "2019",
    title: "The hotel opens",
    body: "The main block opens with forty rooms, Solomon's Restaurant and the pool. The Rivers State hospitality licence follows the same year.",
  },
  {
    year: "2021",
    title: "The Pentagon Hall",
    body: "A dedicated conference hall opens with its own entrance and lobby, so delegates arrive and register without crossing hotel check-in.",
  },
  {
    year: "2023",
    title: "Power and connectivity upgraded",
    body: "A full-load generator on automatic changeover with a battery bridge, and the fibre line moved onto the protected circuit — power and Wi-Fi stay on, without interruption.",
  },
  {
    year: "2024",
    title: "Rooms and grounds expanded",
    body: "New bedding throughout, upgraded bathrooms on the Deluxe and Executive floors, and the Garden Terrace completed for outdoor receptions.",
  },
  {
    year: "2026",
    title: "64 rooms, four event spaces",
    body: `Six room types, three dining venues and a ${ratingSummary.value}-star average across ${ratingSummary.count} public reviews.`,
  },
];

const leadership = [
  {
    name: "Mr. Chidi Igwe",
    role: "Managing Director",
    body: "Leads the hotel's direction and investment, bringing more than twenty years of hotel operations experience from Lagos and Abuja.",
  },
  {
    name: "Mr. Tamuno George",
    role: "General Manager",
    body: "Responsible for day-to-day operations across rooms, dining and guest services, with a background in front-office management.",
  },
  {
    name: "Chef Emmanuel Okoro",
    role: "Executive Chef",
    body: "Twenty years of kitchens across Port Harcourt and Accra, overseeing all three dining venues and the banqueting menus.",
  },
  {
    name: "Ms. Blessing Nwaogu",
    role: "Head of Events",
    body: "Manages conferences, weddings and corporate functions in the Pentagon Hall, from first site visit to final run-of-show.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Pentagon Hotel and Suites"
        description="A purpose-built hotel in Owhipa Choba, Port Harcourt. Sixty-four rooms, three dining venues, four event spaces, and a standard of comfort and service designed to hold up on every stay."
        crumbs={[{ name: "About", href: "/about" }]}
        image={{
          src: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=75&w=1600",
          alt: "The hotel lobby and reception desk",
        }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Built for Port Harcourt, from the ground up"
              description="Pentagon Hotel and Suites was designed and built as a hotel — not adapted into one. Every floor, every room and every service area was planned around how guests actually use a hotel in Choba."
            />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Construction began on Solomon Wali Street in 2016 with a clear
                brief: a modern, comfortable hotel close to the University of
                Port Harcourt and the Choba business corridor, where power,
                water and connectivity never falter.
              </p>
              <p>
                The hotel opened in 2019 and has grown steadily since — the
                Pentagon Hall in 2021, a fully rebuilt power and fibre
                infrastructure in 2023, and expanded rooms and outdoor event
                space in 2024. Today it stands at sixty-four rooms across six
                room types, three dining venues and four event spaces.
              </p>
              <p>
                The result is a hotel that works equally well for a one-night
                business stay, a week-long project posting, a conference of
                three hundred, or a family weekend by the pool — with the same
                standard of comfort and service behind each one.
              </p>
            </div>
          </div>

          <Reveal delay={0.06} className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200"
              alt="The exterior of Pentagon Hotel and Suites at dusk"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Section>

      <Section muted aria-label="Our values">
        <SectionHeading
          eyebrow="What we stand for"
          title="Four standards we don't compromise on"
        />
        <Stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map(({ Icon, title, body }) => (
            <StaggerItem
              as="li"
              key={title}
              className="rounded-2xl bg-background p-6 ring-1 ring-foreground/10"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-muted text-brand">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section aria-label="Our history">
        <SectionHeading eyebrow="Milestones" title="How the hotel has grown" />
        <ol className="mt-10 space-y-0">
          {timeline.map((entry, index) => (
            <Reveal
              key={entry.year}
              delay={index * 0.04}
              as="li"
              className="relative grid gap-3 border-l-2 border-border pb-10 pl-8 last:pb-0 sm:grid-cols-[6rem_1fr] sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="absolute top-1 -left-[7px] size-3 rounded-full bg-brand ring-4 ring-background"
              />
              <span className="font-heading text-lg font-extrabold text-brand">
                {entry.year}
              </span>
              <span>
                <h3 className="font-heading text-lg font-extrabold">
                  {entry.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {entry.body}
                </p>
              </span>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section muted aria-label="Leadership">
        <SectionHeading
          eyebrow="Management"
          title="The team behind your stay"
          description="A hands-on management team, on site and available to guests."
        />
        <Stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {leadership.map((person) => (
            <StaggerItem
              as="li"
              key={person.name}
              className="rounded-2xl bg-background p-6 ring-1 ring-foreground/10"
            >
              <h3 className="font-heading text-base font-extrabold">
                {person.name}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-brand">
                {person.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {person.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section aria-label="Standards and certifications">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Licensed & registered",
              body: "Registered in Nigeria as RC 1839204 and licensed by the Rivers State Ministry of Culture and Tourism under PH/HTL/2019/0442.",
            },
            {
              title: "Health & safety",
              body: "Fire detection and suppression throughout, monthly drills, first-aid trained staff on every shift, and an on-call doctor.",
            },
            {
              title: "Food safety",
              body: "NAFDAC-compliant kitchen practice, quarterly external inspection, and a documented cold-chain from Choba Market to the pass.",
            },
          ].map((item) => (
            <Reveal
              key={item.title}
              className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
            >
              <h2 className="font-heading text-base font-extrabold">
                {item.title}
              </h2>
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
