import { unstable_cache } from "next/cache";
import { fetchQuery } from "convex/nextjs";

import {
  attractions as staticAttractions,
  diningVenues as staticDining,
  extraServices as staticExtras,
  facilityGroups as staticFacilities,
  faqs as staticFaqs,
  galleryImages as staticGallery,
  guestServices as staticServices,
  offers as staticOffers,
  posts as staticPosts,
  ratingSummary as staticRatingSummary,
  reviews as staticReviews,
  rooms as staticRooms,
  venues as staticVenues,
  type Attraction,
  type DiningVenue,
  type ExtraService,
  type FacilityGroup,
  type FaqItem,
  type GalleryImage,
  type Offer,
  type Post,
  type Review,
  type Room,
  type ServiceItem,
  type Venue,
} from "@/lib/data";
import {
  convexConfigured,
  q,
  type ConvexImage,
  type PublicReservation,
} from "@/lib/convex";

/**
 * The site's content layer.
 *
 * Every page reads through these functions instead of importing `lib/data`
 * directly. They fetch from Convex — the same deployment the dashboard writes to
 * — and shape the result into the interfaces the components already expect, so
 * the UI never learns where its content came from.
 *
 * **Fallback**: if `NEXT_PUBLIC_CONVEX_URL` is unset, or the deployment cannot be
 * reached, each function returns the original hard-coded content from
 * `lib/data.ts`. The site keeps rendering during a Convex outage, and it still
 * builds on a machine with no backend configured.
 */

/** Pages revalidate on this interval; content edits appear within five minutes. */
export const revalidate = 300;

const image = (img: ConvexImage) => ({ src: img.url, alt: img.alt });

/**
 * One call, with the static content as its safety net.
 *
 * Two things are happening here.
 *
 * **Caching.** `convex/nextjs` sets `cache: "no-store"` on its fetches, which
 * would opt every route out of static rendering — the whole site would go
 * dynamic, and each page view would hit Convex once per content type. Wrapping
 * the call in `unstable_cache` puts the result back in Next's data cache, so
 * pages prerender and revalidate on the `revalidate` interval above.
 *
 * **Fallback.** Errors are logged, never thrown: a failed content fetch must
 * degrade to the previous copy, not to a 500. Only successful reads are cached,
 * so a Convex blip is retried on the next request rather than pinned for five
 * minutes.
 */
async function load<T>(run: () => Promise<T>, fallback: T, label: string): Promise<T> {
  if (!convexConfigured) return fallback;
  try {
    return await unstable_cache(run, ["content", label], {
      revalidate,
      tags: ["content", `content:${label}`],
    })();
  } catch (error) {
    console.error(`[content] ${label} fell back to bundled content:`, error);
    return fallback;
  }
}

/* ------------------------------------------------------------------- rooms */

/** Rooms without the detail-page copy — everything an index or card needs. */
export type RoomSummary = Omit<Room, "longDescription">;

export async function getRooms(): Promise<RoomSummary[]> {
  return load<RoomSummary[]>(
    async () => {
      const rooms = await fetchQuery(q.rooms, {});
      return rooms
        .sort((a, b) => a.order - b.order)
        .map((room) => ({
          slug: room.slug,
          name: room.name,
          category: room.category,
          tagline: room.tagline,
          description: room.description,
          sizeSqm: room.sizeSqm,
          bed: room.bed,
          maxAdults: room.maxAdults,
          maxChildren: room.maxChildren,
          view: room.view,
          bathroom: room.bathroom,
          amenities: room.amenities,
          images: room.images.map(image),
          rate: room.rate,
          rackRate: room.rackRate,
          accessible: room.accessible,
          inventory: room.inventory,
          featured: room.featured,
          cancellation: room.cancellation,
        }));
    },
    staticRooms,
    "rooms",
  );
}

export async function getFeaturedRooms(): Promise<RoomSummary[]> {
  return (await getRooms()).filter((room) => room.featured);
}

export async function getRoom(slug: string): Promise<Room | null> {
  return load<Room | null>(
    async () => {
      const room = await fetchQuery(q.room, { slug });
      if (!room) return null;
      return {
        slug: room.slug,
        name: room.name,
        category: room.category,
        tagline: room.tagline,
        description: room.description,
        longDescription: room.longDescription,
        sizeSqm: room.sizeSqm,
        bed: room.bed,
        maxAdults: room.maxAdults,
        maxChildren: room.maxChildren,
        view: room.view,
        bathroom: room.bathroom,
        amenities: room.amenities,
        images: room.images.map(image),
        rate: room.rate,
        rackRate: room.rackRate,
        accessible: room.accessible,
        inventory: room.inventory,
        featured: room.featured,
        cancellation: room.cancellation,
      };
    },
    staticRooms.find((room) => room.slug === slug) ?? null,
    `room:${slug}`,
  );
}

/* ------------------------------------------------------------------ offers */

export async function getOffers(): Promise<Offer[]> {
  return load<Offer[]>(
    async () => {
      const offers = await fetchQuery(q.offers, {});
      return offers
        .sort((a, b) => a.order - b.order)
        .map((offer) => ({
          slug: offer.slug,
          title: offer.title,
          blurb: offer.blurb,
          description: offer.description,
          validity: offer.validity,
          inclusions: offer.inclusions,
          terms: offer.terms,
          discountLabel: offer.discountLabel,
          fromRate: offer.fromRate,
          image: image(offer.image),
          code: offer.code,
        }));
    },
    staticOffers,
    "offers",
  );
}

/* -------------------------------------------------------------- facilities */

export async function getFacilityGroups(): Promise<FacilityGroup[]> {
  return load<FacilityGroup[]>(
    async () => {
      const groups = await fetchQuery(q.facilities, {});
      return groups
        .sort((a, b) => a.order - b.order)
        .map((group) => ({
          category: group.category,
          blurb: group.blurb,
          items: group.items,
        }));
    },
    staticFacilities,
    "facilities",
  );
}

/* ------------------------------------------------------------------ dining */

export async function getDiningVenues(): Promise<DiningVenue[]> {
  return load<DiningVenue[]>(
    async () => {
      const venues = await fetchQuery(q.dining, {});
      return venues
        .sort((a, b) => a.order - b.order)
        .map((venue) => ({
          slug: venue.slug,
          name: venue.name,
          cuisine: venue.cuisine,
          blurb: venue.blurb,
          description: venue.description,
          hours: venue.hours,
          dressCode: venue.dressCode,
          capacity: venue.capacity,
          image: image(venue.image),
          highlights: venue.highlights,
        }));
    },
    staticDining,
    "dining",
  );
}

/* ------------------------------------------------------------- event spaces */

export async function getVenues(): Promise<Venue[]> {
  return load<Venue[]>(
    async () => {
      const venues = await fetchQuery(q.venues, {});
      return venues
        .sort((a, b) => a.order - b.order)
        .map((venue) => ({
          slug: venue.slug,
          name: venue.name,
          blurb: venue.blurb,
          description: venue.description,
          areaSqm: venue.areaSqm,
          dimensions: venue.dimensions,
          capacities: venue.capacities,
          equipment: venue.equipment,
          image: image(venue.image),
          fromRate: venue.fromRate,
        }));
    },
    staticVenues,
    "venues",
  );
}

/* ------------------------------------------------------------------ extras */

export async function getExtras(): Promise<ExtraService[]> {
  return load<ExtraService[]>(
    async () => {
      const extras = await fetchQuery(q.extras, {});
      return extras
        .sort((a, b) => a.order - b.order)
        .map((extra) => ({
          id: extra.key,
          name: extra.name,
          description: extra.description,
          price: extra.price,
          unit: extra.unit,
          icon: extra.icon,
        }));
    },
    staticExtras,
    "extras",
  );
}

/* ----------------------------------------------------------------- reviews */

export interface RatingSummary {
  value: number;
  count: number;
  best: number;
}

export async function getReviews(): Promise<{
  reviews: Review[];
  summary: RatingSummary;
}> {
  return load<{ reviews: Review[]; summary: RatingSummary }>(
    async () => {
      const result = await fetchQuery(q.reviews, {});
      return {
        reviews: result.reviews
          .sort((a, b) => a.order - b.order)
          .map((review) => ({
            author: review.author,
            rating: review.rating,
            date: review.date,
            source: review.source,
            title: review.title,
            body: review.body,
            stayType: review.stayType,
          })),
        summary: result.summary,
      };
    },
    { reviews: staticReviews, summary: staticRatingSummary },
    "reviews",
  );
}

/* ------------------------------------------------------- services & nearby */

export async function getAttractions(): Promise<Attraction[]> {
  return load<Attraction[]>(
    async () => {
      const attractions = await fetchQuery(q.attractions, {});
      return attractions
        .sort((a, b) => a.order - b.order)
        .map(({ name, category, distanceKm, minutes, note }) => ({
          name,
          category,
          distanceKm,
          minutes,
          note,
        }));
    },
    staticAttractions,
    "attractions",
  );
}

export async function getGuestServices(): Promise<ServiceItem[]> {
  return load<ServiceItem[]>(
    async () => {
      const services = await fetchQuery(q.services, {});
      return services
        .sort((a, b) => a.order - b.order)
        .map(({ name, description, icon, availability }) => ({
          name,
          description,
          icon,
          availability,
        }));
    },
    staticServices,
    "services",
  );
}

/* -------------------------------------------------------------------- faqs */

export async function getFaqs(): Promise<FaqItem[]> {
  return load<FaqItem[]>(
    async () => {
      const faqs = await fetchQuery(q.faqs, {});
      return faqs
        .sort((a, b) => a.order - b.order)
        .map(({ category, question, answer }) => ({ category, question, answer }));
    },
    staticFaqs,
    "faqs",
  );
}

/* ----------------------------------------------------------------- gallery */

export async function getGallery(): Promise<GalleryImage[]> {
  return load<GalleryImage[]>(
    async () => {
      const images = await fetchQuery(q.gallery, {});
      return images
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          src: item.image.url,
          alt: item.image.alt,
          category: item.category,
          tall: item.tall,
        }));
    },
    staticGallery,
    "gallery",
  );
}

/* ----------------------------------------------------------------- journal */

export type PostSummary = Omit<Post, "body">;

export async function getPosts(): Promise<PostSummary[]> {
  return load<PostSummary[]>(
    async () => {
      const posts = await fetchQuery(q.posts, {});
      return posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        tag: post.tag,
        readMinutes: post.readMinutes,
        image: image(post.image),
      }));
    },
    staticPosts,
    "posts",
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  return load<Post | null>(
    async () => {
      const post = await fetchQuery(q.post, { slug });
      if (!post) return null;
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        tag: post.tag,
        readMinutes: post.readMinutes,
        image: image(post.image),
        body: post.body,
      };
    },
    staticPosts.find((post) => post.slug === slug) ?? null,
    `post:${slug}`,
  );
}

/* ---------------------------------------------------------------- settings */

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  reservationsEmail: string;
  address: string;
  checkIn: string;
  checkOut: string;
  vatRate: number;
  serviceRate: number;
  announcement: string;
  announcementActive: boolean;
  bookingsOpen: boolean;
}

export async function getSettings(): Promise<SiteSettings | null> {
  return load<SiteSettings | null>(
    async () => {
      const settings = await fetchQuery(q.settings, {});
      if (!settings) return null;
      const { _id, _creationTime, key, ...rest } = settings;
      void _id;
      void _creationTime;
      void key;
      return rest;
    },
    null,
    "settings",
  );
}

/* ------------------------------------------------------------ reservations */

/**
 * One guest's reservation, for the page behind the link we send them.
 *
 * Deliberately outside `load()`: a reservation is not content, and caching one
 * for five minutes would show a guest a stay they had just cancelled. It is
 * fetched fresh on every request, and there is no bundled fallback — an
 * unreachable backend means "we cannot show this right now", never stale
 * details about somebody's stay.
 */
export async function getReservation(
  reference: string,
): Promise<PublicReservation | null> {
  if (!convexConfigured) return null;
  try {
    return await fetchQuery(q.publicReservation, {
      reference: reference.trim().toUpperCase(),
    });
  } catch (error) {
    console.error("[content] reservation lookup failed:", error);
    return null;
  }
}

/* ------------------------------------------------------------------- types */

export type { PublicReservation } from "@/lib/convex";

/**
 * The content interfaces, re-exported from one place. Pages and components
 * import their types from here so nothing outside this module needs to know that
 * `lib/data.ts` still defines them (and still holds the fallback copy).
 */
export type {
  Attraction,
  BedType,
  DiningVenue,
  ExtraService,
  Facility,
  FacilityGroup,
  FaqItem,
  GalleryImage,
  MenuHighlight,
  Offer,
  Post,
  Review,
  Room,
  RoomCategory,
  RoomImage,
  ServiceItem,
  Venue,
} from "@/lib/data";
