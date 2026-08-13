import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, PhoneIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { site, telLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessible rooms, step-free entrances, lifts, accessible parking and bathroom facilities at Pentagon Hotel and Suites — plus our website accessibility statement.",
  alternates: { canonical: "/accessibility" },
};

const hotelAccess = [
  {
    title: "Getting in",
    items: [
      "Step-free main entrance with a 1:15 ramp and automatic doors",
      "Level approach from the car park to reception",
      "Two accessible parking bays beside the entrance",
      "Reception desk with a lowered section for wheelchair users",
      "Staff on every shift trained in assisting guests with disabilities",
    ],
  },
  {
    title: "Moving around",
    items: [
      "Lift to all floors, 1100mm × 1400mm car, with braille and audible floor announcements",
      "Corridors at least 1200mm wide throughout",
      "No steps between reception, the restaurant, the bar and the pool terrace",
      "The Pentagon Hall and Choba Room are step-free from their own entrance",
    ],
  },
  {
    title: "Accessible rooms",
    items: [
      "Four accessible rooms — one Double King, one Family Spring, one Executive Suite, one Executive Spring Suite",
      "800mm clear door widths and 1500mm turning circles",
      "Roll-in wet-room showers with fold-down seats and grab rails",
      "Raised WC with grab rails on both sides",
      "Lowered wardrobe rails, light switches and peepholes",
      "Emergency pull cords by the bed and in the bathroom",
      "Vibrating pillow alarms and visual smoke alerts on request",
    ],
  },
  {
    title: "Dining and events",
    items: [
      "Accessible tables in Solomon's, The Fifth Bar and the Terrace Café",
      "Menus available in large print and read aloud by staff on request",
      "Accessible WC on the ground floor and adjoining the Pentagon Hall",
      "Hearing loop available in the Pentagon Hall and the Choba Room",
      "Assistance dogs welcome throughout, at no charge",
    ],
  },
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        title="Accessibility"
        description="What we have, what we don't, and who to call. We'd rather tell you plainly in advance than have you find out on arrival."
        crumbs={[{ name: "Accessibility", href: "/accessibility" }]}
      />

      <Section>
        <SectionHeading
          eyebrow="At the hotel"
          title="Accessible facilities in detail"
          description="Measurements are real and were taken on site. If something you need isn't listed, call us — we will tell you honestly whether we can accommodate it."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {hotelAccess.map((group) => (
            <Reveal
              key={group.title}
              className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
            >
              <h2 className="font-heading text-lg font-extrabold">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 rounded-2xl bg-muted/60 p-6">
          <h2 className="font-heading text-lg font-extrabold">
            Where we fall short
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              The pool has step entry only — there is no hoist. Staff will assist,
              but we would rather you knew before booking.
            </li>
            <li>
              The Garden Terrace is reached by a paved path with a 1:12 section that
              some manual wheelchair users find steep without assistance.
            </li>
            <li>
              The fitness centre is on the first floor and reached by lift, but the
              equipment is not adaptive.
            </li>
          </ul>
        </Reveal>
      </Section>

      <Section muted aria-label="Website accessibility statement">
        <SectionHeading
          eyebrow="This website"
          title="Accessibility statement"
          description="We aim to meet WCAG 2.2 Level AA across this site."
        />

        <Reveal className="mt-8 max-w-3xl space-y-4 leading-relaxed text-muted-foreground">
          <p>
            This website is built to be usable with a keyboard alone, with a screen
            reader, at 200% zoom, and with animation switched off. Specifically:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Every interactive element is reachable and operable by keyboard, with a visible focus ring.</li>
            <li>Text meets a 4.5:1 contrast ratio against its background in both light and dark themes.</li>
            <li>Touch targets are at least 44 × 44 pixels.</li>
            <li>All images carry meaningful alternative text; decorative images are hidden from assistive technology.</li>
            <li>Headings follow a logical order and each page has exactly one level-one heading.</li>
            <li>Form fields have visible labels, and errors are announced and tied to their field.</li>
            <li>Motion respects your <code className="rounded bg-muted px-1 py-0.5 text-xs">prefers-reduced-motion</code> setting.</li>
            <li>The booking flow announces state changes to screen readers as they happen.</li>
          </ul>
          <p>
            <strong className="font-bold text-foreground">Known limitations:</strong>{" "}
            the embedded Google Map is a third-party component we do not control; it
            only loads when you choose to load it, and every piece of information it
            shows is also available as text on the Location page.
          </p>
          <p>
            If you hit a barrier anywhere on this site or in the hotel, tell us and
            we will fix it. Email{" "}
            <a
              href={`mailto:${site.email.general}`}
              className="font-semibold text-brand underline underline-offset-2"
            >
              {site.email.general}
            </a>{" "}
            or call {site.phone.display}. We aim to respond within two working days.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="h-12 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
            render={<a href={telLink} />}
          >
            <PhoneIcon /> Talk to us about access needs
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 font-bold"
            render={<Link href="/rooms?accessible=1" />}
          >
            See accessible rooms
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
