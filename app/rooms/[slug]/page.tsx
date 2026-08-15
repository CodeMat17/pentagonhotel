import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRightIcon,
  BedDoubleIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  MaximizeIcon,
  MessageCircleIcon,
  PhoneIcon,
  ShowerHeadIcon,
  UsersIcon,
  AccessibilityIcon,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/motion/reveal";
import { RoomCard } from "@/components/room-card";
import { RoomGallery } from "@/components/room-gallery";
import { Section, SectionHeading } from "@/components/section";
import { JsonLd, roomSchema } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRoom, rooms } from "@/lib/data";
import { formatNaira, site, telLink, whatsappLink } from "@/lib/site";

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/rooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Room not found" };

  return {
    title: room.name,
    description: room.description,
    alternates: { canonical: `/rooms/${room.slug}` },
    openGraph: {
      title: `${room.name} · ${site.name}`,
      description: room.description,
      url: `${site.url}/rooms/${room.slug}`,
      images: [{ url: room.images[0].src, alt: room.images[0].alt }],
    },
  };
}

export default async function RoomPage({ params }: PageProps<"/rooms/[slug]">) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const others = rooms.filter((candidate) => candidate.slug !== room.slug).slice(0, 3);
  const schema = roomSchema(room.slug);

  const specs = [
    { Icon: MaximizeIcon, label: "Room size", value: `${room.sizeSqm} m²` },
    { Icon: BedDoubleIcon, label: "Bed", value: room.bed },
    {
      Icon: UsersIcon,
      label: "Sleeps",
      value: `${room.maxAdults} adults + ${room.maxChildren} children`,
    },
    { Icon: EyeIcon, label: "View", value: room.view },
    { Icon: ShowerHeadIcon, label: "Bathroom", value: room.bathroom },
    {
      Icon: AccessibilityIcon,
      label: "Accessibility",
      value: room.accessible
        ? "Step-free access available on request"
        : "Stair access — ask us about step-free alternatives",
    },
  ];

  return (
    <>
      {schema && <JsonLd data={schema} />}

      <PageHeader
        title={room.name}
        description={room.tagline}
        crumbs={[
          { name: "Rooms & Suites", href: "/rooms" },
          { name: room.name, href: `/rooms/${room.slug}` },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div>
            <RoomGallery images={room.images} />

            <Reveal className="mt-10">
              <h2 className="font-heading text-2xl font-extrabold">
                About this room
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                {room.longDescription.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-heading text-2xl font-extrabold">
                Room details
              </h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* dt/dd must be direct children of this div for the markup to
                    be a valid definition list. */}
                {specs.map(({ Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-muted/60 p-4">
                    <dt className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
                      <Icon className="size-4 shrink-0 text-brand" aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-heading text-2xl font-extrabold">
                What&apos;s in the room
              </h2>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    {amenity}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10 rounded-2xl bg-muted/60 p-6">
              <h2 className="font-heading text-xl font-extrabold">
                Policies for this room
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Cancellation:</dt>
                  <dd className="text-muted-foreground">{room.cancellation}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Check-in / checkout:</dt>
                  <dd className="text-muted-foreground">
                    From {site.checkIn} · by {site.checkOut}. Reception is staffed
                    24 hours.
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Children:</dt>
                  <dd className="text-muted-foreground">
                    Under 12s stay free sharing with adults. Cots are free;
                    rollaway beds are {formatNaira(12000)} per night.
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Payment:</dt>
                  <dd className="text-muted-foreground">
                    No deposit required. Pay online when you book, or settle by
                    card, transfer or cash at the hotel.
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-bold">Smoking:</dt>
                  <dd className="text-muted-foreground">
                    Non-smoking. Designated areas in the garden and on the bar
                    terrace.
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* -------------------------------------------------- booking rail */}
          <Reveal delay={0.08} className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="bg-brand-muted font-bold text-brand">
                    {room.category}
                  </Badge>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {room.rackRate && (
                      <span className="mr-2 line-through">
                        {formatNaira(room.rackRate)}
                      </span>
                    )}
                  </p>
                  <p className="font-heading text-3xl font-extrabold">
                    {formatNaira(room.rate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per night, before {Math.round(site.tax.vatRate * 100)}% VAT and{" "}
                    {Math.round(site.tax.serviceRate * 100)}% service
                  </p>
                </div>
              </div>

              <Separator className="my-5" />

              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  {room.cancellation}
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  Best rate guaranteed when you book direct
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  No deposit — pay online securely or at the hotel
                </li>
                <li className="flex items-start gap-2.5">
                  <ClockIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  Takes about two minutes
                </li>
              </ul>

              <Button
                size="lg"
                className="mt-6 h-13 w-full bg-brand text-base font-extrabold text-brand-foreground hover:bg-brand/90"
                render={<Link href={`/booking?room=${room.slug}`} />}
              >
                Book this room <ArrowRightIcon />
              </Button>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 font-bold"
                  render={<a href={telLink} />}
                >
                  <PhoneIcon /> Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 font-bold"
                  render={
                    <a
                      href={whatsappLink(
                        `Hello ${site.name}, I would like to book the ${room.name}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MessageCircleIcon /> WhatsApp
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Questions? Reception answers 24 hours on {site.phone.display}.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section muted aria-label="Other rooms">
        <SectionHeading
          eyebrow="Compare"
          title="Other rooms you might prefer"
          action={
            <Button
              variant="outline"
              size="lg"
              className="h-11 font-bold"
              render={<Link href="/rooms" />}
            >
              All rooms <ArrowRightIcon />
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <RoomCard key={other.slug} room={other} />
          ))}
        </div>
      </Section>
    </>
  );
}
