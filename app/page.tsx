import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BatteryChargingIcon,
  CarFrontIcon,
  ChefHatIcon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  UtensilsIcon,
  WavesIcon,
  WifiIcon,
} from "lucide-react";

import { BookingSearch } from "@/components/booking/booking-search";
import { GalleryPreview } from "@/components/gallery-preview";
import { MapEmbed } from "@/components/map-embed";
import { BrushUnderline } from "@/components/motion/brush-underline";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { WordReveal } from "@/components/motion/text-reveal";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import { RoomCard } from "@/components/room-card";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  attractions,
  diningVenues,
  featuredRooms,
  offers,
  ratingSummary,
  venues,
} from "@/lib/data";
import { formatNaira, fullAddress, site, telLink, whatsapp } from "@/lib/site";

const heroImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=75&w=1600";

/** The five sides of the Pentagon — the brand promise, made concrete. */
const pillars = [
  {
    Icon: BatteryChargingIcon,
    title: "Power that never blinks",
    body: "Full-load generator on automatic changeover with a battery bridge. Your call doesn't drop when the street goes dark.",
  },
  {
    Icon: WifiIcon,
    title: "Fibre that holds",
    body: "100 Mbps in guest rooms on a protected circuit, no login walls, no device limits, no fair-use throttle.",
  },
  {
    Icon: ChefHatIcon,
    title: "A kitchen worth staying in for",
    body: "Charcoal-finished jollof, fresh fish pepper soup and a breakfast eggs station from 6:30am.",
  },
  {
    Icon: UsersIcon,
    title: "Events with their own front door",
    body: "The Pentagon Hall seats 300 and never queues behind hotel check-in.",
  },
  {
    Icon: MapPinIcon,
    title: "Five minutes from UNIPORT",
    body: "The closest full-service hotel to the Choba campus, and 35 minutes from the airport.",
  },
];

const quickFacts = [
  { Icon: ClockIcon, label: "Reception", value: "Open 24 hours" },
  { Icon: CarFrontIcon, label: "Parking", value: "40 free spaces" },
  { Icon: WavesIcon, label: "Pool", value: "6:00 – 21:00" },
  { Icon: ShieldCheckIcon, label: "Security", value: "CCTV & manned gate" },
];

export default function HomePage() {
  const topOffers = offers.slice(0, 3);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className='relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28 pb-14 text-white lg:pb-20'>
        <div className='absolute inset-0 -z-20 overflow-hidden'>
          <Image
            src={heroImage}
            alt='A made-up guest room at Pentagon Hotel and Suites, lit warmly at dusk'
            fill
            priority
            fetchPriority='high'
            sizes='100vw'
            className='ken-burns object-cover'
          />
        </div>

        {/*
         * Three scrims, not one. The bottom ramp carries the copy, the left
         * wash protects the headline on wide screens, and the vignette stops
         * the corners from pulling the eye off the page.
         */}
        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 bg-gradient-to-t from-black/92 via-black/62 to-black/35'
        />
        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent'
        />
        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 [background:radial-gradient(120%_85%_at_50%_15%,transparent_35%,rgb(0_0_0/0.45)_100%)]'
        />

        <div className='container-page'>
          <Reveal y={20} className='max-w-3xl'>
            <p className='eyebrow text-on-image text-[#EBC98A]'>
              <span
                aria-hidden='true'
                className='h-px w-6 bg-[#EBC98A]'
              />
              Owhipa Choba · Port Harcourt
            </p>
          </Reveal>

          <WordReveal
            delay={0.15}
            className='display text-on-image mt-5 max-w-4xl text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-7xl'>
            {[
              <span key='pentagon' className='relative inline-block'>
                Pentagon
                <BrushUnderline delay={0.75} />
              </span>,
              "Hotel",
              <span key='amp' className='text-[#EBC98A]'>
                &amp;
              </span>,
              "Suites",
            ]}
          </WordReveal>

          <Reveal y={20} delay={0.45} className='max-w-3xl'>
            <p className='text-on-image mt-7 max-w-xl text-lg leading-relaxed text-pretty text-white/90 sm:text-xl'>
              Rooms that stay cool and lit when the street doesn&apos;t. A
              kitchen people drive across town for. Event spaces with their own
              front door. Five minutes from UNIPORT.
            </p>

            <div className='mt-7 flex flex-wrap items-center gap-2.5 text-sm font-semibold'>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur-md'>
                <StarIcon
                  className='size-4 fill-[#EBC98A] text-[#EBC98A]'
                  aria-hidden='true'
                />
                {ratingSummary.value} / 5 · {ratingSummary.count} guest reviews
              </span>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur-md'>
                <ShieldCheckIcon
                  className='size-4 text-[#EBC98A]'
                  aria-hidden='true'
                />
                Best rate guaranteed, booked direct
              </span>
            </div>
          </Reveal>

          <Reveal y={28} delay={0.6} className='mt-9 lg:mt-12'>
            <BookingSearch />
          </Reveal>

          <Reveal
            y={16}
            delay={0.75}
            className='mt-7 hidden grid-cols-4 gap-4 lg:grid'>
            {quickFacts.map(({ Icon, label, value }) => (
              <div
                key={label}
                className='group flex items-center gap-2.5 rounded-xl px-1 py-1 text-sm transition-colors'>
                <Icon
                  className='size-4 shrink-0 text-[#EBC98A] transition-transform duration-500 group-hover:scale-110'
                  aria-hidden='true'
                />
                <span className='text-on-image'>
                  <span className='block text-xs text-white/70'>{label}</span>
                  <span className='font-bold'>{value}</span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center lg:flex'>
          <span className='animate-scroll-cue flex h-9 w-5 items-start justify-center rounded-full pt-1.5 ring-1 ring-white/40'>
            <span className='h-1.5 w-0.5 rounded-full bg-white/80' />
          </span>
        </div>
      </section>

      {/* -------------------------------------------------------- pillars */}
      <Section aria-label='Why stay with us'>
        <SectionHeading
          eyebrow='Five sides, one promise'
          title='What actually makes a stay here different'
          description='Not the marble in the lobby. The things you notice at 3am, on a deadline, or with two tired children in the back of the car.'
        />

        <Stagger
          as='ul'
          className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {pillars.map(({ Icon, title, body }) => (
            <StaggerItem
              as='li'
              key={title}
              className='card-lift sheen rounded-2xl bg-card p-6 ring-1 ring-foreground/10 hover:ring-brand/40'>
              <span className='inline-flex size-11 items-center justify-center rounded-xl bg-brand-muted text-brand'>
                <Icon className='size-5' aria-hidden='true' />
              </span>
              <h3 className='mt-4 font-heading text-lg font-extrabold'>
                {title}
              </h3>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                {body}
              </p>
            </StaggerItem>
          ))}

          <StaggerItem
            as='li'
            className='card-lift sheen flex flex-col justify-between rounded-2xl bg-brand p-6 text-brand-foreground'>
            <div>
              <SparklesIcon className='size-6' aria-hidden='true' />
              <h3 className='mt-4 font-heading text-lg font-extrabold'>
                Book direct, pay less
              </h3>
              <p className='mt-2 text-sm leading-relaxed opacity-90'>
                We hold back a rate the travel sites never see, and direct
                guests get free parking and first call on room requests.
              </p>
            </div>
            <Button
              size='lg'
              variant='secondary'
              className='mt-5 h-11 w-fit font-bold'
              render={<Link href='/booking' />}>
              Check availability <ArrowRightIcon />
            </Button>
          </StaggerItem>
        </Stagger>
      </Section>

      {/* ---------------------------------------------------------- rooms */}
      <Section muted aria-label='Featured rooms'>
        <SectionHeading
          eyebrow='Rooms & suites'
          title='Six room types. Every one of them quiet.'
          description='From a well-judged Standard Queen Room at ₦20,000 to the Executive Spring Suite with its own living room — eight room types, one standard of upkeep.'
          action={
            <Button
              variant='outline'
              size='lg'
              className='h-11 font-bold'
              render={<Link href='/rooms' />}>
              All rooms <ArrowRightIcon />
            </Button>
          }
        />

        <Stagger className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {featuredRooms.map((room) => (
            <StaggerItem key={room.slug} className='h-full'>
              <RoomCard room={room} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* --------------------------------------------------------- offers */}
      <Section aria-label='Offers and packages'>
        <SectionHeading
          eyebrow='Offers & packages'
          title='Worth booking direct for'
          description='Six packages, all bookable on this site, none of them available on the travel platforms.'
          action={
            <Button
              variant='outline'
              size='lg'
              className='h-11 font-bold'
              render={<Link href='/offers' />}>
              All offers <ArrowRightIcon />
            </Button>
          }
        />

        <Stagger className='mt-12 grid gap-6 lg:grid-cols-3'>
          {topOffers.map((offer) => (
            <StaggerItem key={offer.slug} className='h-full'>
              <article className='card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 hover:ring-brand/40'>
                <div className='relative aspect-[16/10] overflow-hidden'>
                  <Image
                    src={offer.image.src}
                    alt={offer.image.alt}
                    fill
                    loading='lazy'
                    sizes='(max-width: 1024px) 100vw, 33vw'
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <Badge className='absolute top-3 left-3 bg-brand font-bold text-brand-foreground'>
                    {offer.discountLabel}
                  </Badge>
                </div>
                <div className='flex flex-1 flex-col p-6'>
                  <h3 className='font-heading text-xl font-extrabold'>
                    <Link
                      href={`/offers#${offer.slug}`}
                      className='after:absolute after:inset-0 hover:text-brand'>
                      {offer.title}
                    </Link>
                  </h3>
                  <p className='mt-2 flex-1 text-sm leading-relaxed text-muted-foreground'>
                    {offer.description}
                  </p>
                  <p className='mt-5 border-t pt-4 text-sm text-muted-foreground'>
                    From{" "}
                    <span className='font-heading text-lg font-extrabold text-foreground'>
                      {formatNaira(offer.fromRate)}
                    </span>{" "}
                    · {offer.validity}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* --------------------------------------------------------- dining */}
      <Section muted aria-label='Dining'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
          <Reveal className='relative aspect-[4/3] overflow-hidden rounded-2xl'>
            <Image
              src={diningVenues[0].image.src}
              alt={diningVenues[0].image.alt}
              fill
              loading='lazy'
              sizes='(max-width: 1024px) 100vw, 50vw'
              className='object-cover'
            />
          </Reveal>

          <div>
            <SectionHeading
              eyebrow='Dining'
              title='Three kitchens, one building'
              description="Solomon's serves from 6:30am to 11pm. The Fifth Bar catches the evening breeze. The Terrace Café has the strongest Wi-Fi in the building and a power outlet at every table."
            />

            <Stagger as='ul' className='mt-8 space-y-4'>
              {diningVenues.map((venue) => (
                <StaggerItem
                  as='li'
                  key={venue.slug}
                  className='flex gap-4 rounded-xl bg-background p-4 ring-1 ring-foreground/10 transition-colors duration-300 hover:ring-brand/40'>
                  <UtensilsIcon
                    className='mt-0.5 size-5 shrink-0 text-brand'
                    aria-hidden='true'
                  />
                  <span>
                    <span className='block font-heading font-extrabold'>
                      {venue.name}
                    </span>
                    <span className='mt-0.5 block text-sm text-muted-foreground'>
                      {venue.blurb} · {venue.cuisine}
                    </span>
                    <span className='mt-1 block text-xs font-semibold text-brand'>
                      {venue.hours}
                    </span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1} className='mt-8 flex flex-wrap gap-3'>
              <Button
                size='lg'
                className='h-11 bg-brand font-bold text-brand-foreground hover:bg-brand/90'
                render={<Link href='/dining' />}>
                See the menus <ArrowRightIcon />
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='h-11 font-bold'
                render={<Link href='/dining#reserve' />}>
                Reserve a table
              </Button>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- events */}
      <Section aria-label='Events and conferences'>
        <SectionHeading
          eyebrow='Events & conferences'
          title='Four spaces, up to 300 guests'
          description='A column-free hall with its own entrance and lobby, a daylight training room, a soundproofed boardroom, and a walled garden for receptions.'
          action={
            <Button
              variant='outline'
              size='lg'
              className='h-11 font-bold'
              render={<Link href='/events' />}>
              Request a quote <ArrowRightIcon />
            </Button>
          }
        />

        <Stagger className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {venues.map((venue) => (
            <StaggerItem key={venue.slug} className='h-full'>
              <article className='card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 hover:ring-brand/40'>
                <div className='relative aspect-[4/3] overflow-hidden'>
                  <Image
                    src={venue.image.src}
                    alt={venue.image.alt}
                    fill
                    loading='lazy'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                </div>
                <div className='flex flex-1 flex-col p-5'>
                  <h3 className='font-heading text-base font-extrabold'>
                    <Link
                      href={`/events#${venue.slug}`}
                      className='after:absolute after:inset-0 hover:text-brand'>
                      {venue.name}
                    </Link>
                  </h3>
                  <p className='mt-1.5 flex-1 text-sm text-muted-foreground'>
                    {venue.blurb}
                  </p>
                  <p className='mt-4 text-xs font-bold text-brand'>
                    Up to {Math.max(...venue.capacities.map((c) => c.seats))}{" "}
                    guests · {venue.areaSqm} m²
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* -------------------------------------------------------- reviews */}
      <Section muted aria-label='Guest reviews'>
        <SectionHeading
          align='center'
          eyebrow='Guest reviews'
          title={`${ratingSummary.value} out of 5, across ${ratingSummary.count} reviews`}
          description='Collected from Google, Booking.com and TripAdvisor. We publish them as written.'
        />
        <div className='mt-12'>
          <ReviewsCarousel />
        </div>
      </Section>

      {/* -------------------------------------------------------- gallery */}
      <Section aria-label='Photo highlights'>
        <SectionHeading
          eyebrow='Gallery'
          title='See it before you arrive'
          description="Rooms, dining, the pool, the hall and the streets around us — no stock photography of somebody else's hotel."
          action={
            <Button
              variant='outline'
              size='lg'
              className='h-11 font-bold'
              render={<Link href='/gallery' />}>
              Full gallery <ArrowRightIcon />
            </Button>
          }
        />
        <div className='mt-12'>
          <GalleryPreview />
        </div>
      </Section>

      {/* ------------------------------------------------------- location */}
      <Section muted aria-label='Location'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-start'>
          <div>
            <SectionHeading
              eyebrow='Location'
              title='1 Solomon Wali Street, Owhipa Choba'
              description='On the Choba side of Port Harcourt — walking distance from the University of Port Harcourt, a clear run to Onne, and 35 minutes from the airport outside rush hour.'
            />

            <Stagger
              as='ul'
              className='mt-8 divide-y rounded-2xl bg-background ring-1 ring-foreground/10'>
              {attractions.slice(0, 6).map((place) => (
                <StaggerItem
                  as='li'
                  key={place.name}
                  className='flex items-center justify-between gap-4 p-4 transition-colors duration-300 hover:bg-brand-muted/40'>
                  <span>
                    <span className='block text-sm font-bold'>
                      {place.name}
                    </span>
                    <span className='block text-xs text-muted-foreground'>
                      {place.category}
                    </span>
                  </span>
                  <span className='shrink-0 text-right'>
                    <span className='block font-heading text-sm font-extrabold text-brand'>
                      {place.minutes} min
                    </span>
                    <span className='block text-xs text-muted-foreground'>
                      {place.distanceKm} km
                    </span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1} className='mt-6'>
              <Button
                variant='outline'
                size='lg'
                className='h-11 font-bold'
                render={<Link href='/location' />}>
                Directions & nearby <ArrowRightIcon />
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.05} className='lg:sticky lg:top-28'>
            <MapEmbed />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------------ cta */}
      <Section aria-label='Contact and booking'>
        <Reveal className='overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 lg:px-16 lg:py-20'>
          <div className='grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center'>
            <div>
              <p className='eyebrow'>
                <span aria-hidden='true' className='h-px w-6 bg-brand' />
                Ready when you are
              </p>
              <h2 className='display mt-4 text-3xl sm:text-4xl lg:text-5xl'>
                Two minutes to book. No account, no deposit.
              </h2>
              <p className='mt-5 max-w-xl text-base leading-relaxed opacity-80'>
                Reception is staffed 24 hours, so a late arrival is never a
                problem. Prefer to talk it through? Call or message us — someone
                who works here will answer.
              </p>
              <address className='mt-6 text-sm not-italic opacity-75'>
                {fullAddress}
              </address>
            </div>

            <div className='flex flex-col gap-3'>
              <Button
                size='lg'
                className='h-14 bg-brand text-base font-extrabold text-brand-foreground hover:bg-brand/90'
                render={<Link href='/booking' />}>
                Check availability <ArrowRightIcon />
              </Button>
              <Button
                variant='secondary'
                size='lg'
                className='h-12 font-bold'
                render={<a href={telLink} />}>
                <PhoneIcon /> {site.phone.display}
              </Button>
              <Button
                variant='secondary'
                size='lg'
                className='h-12 font-bold'
                render={
                  <a
                    href={whatsapp.reservations}
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                }>
                <MessageCircleIcon /> Message on WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
