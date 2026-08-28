import { makeFunctionReference } from "convex/server";

/**
 * The website's view of the Convex backend.
 *
 * The backend itself lives in the dashboard repo (`pentagon-dashboard/convex`).
 * Rather than copy its generated `_generated/api` here — two copies that would
 * drift the first time either side changed — the site declares only the handful
 * of public functions it actually calls, with the shapes it expects.
 *
 * If a name or shape ever stops matching, it fails here, in one file, instead of
 * in a page.
 */

export interface ConvexImage {
  storageId: string;
  url: string;
  alt: string;
}

interface Doc {
  _id: string;
  _creationTime: number;
}

export interface RoomDoc extends Doc {
  slug: string;
  name: string;
  category: "Standard" | "Deluxe" | "Executive" | "Suite" | "Family";
  tagline: string;
  description: string;
  sizeSqm: number;
  bed: "King" | "Queen" | "Twin" | "Double";
  maxAdults: number;
  maxChildren: number;
  view: string;
  bathroom: string;
  amenities: string[];
  images: ConvexImage[];
  rate: number;
  rackRate?: number;
  accessible: boolean;
  inventory: number;
  featured: boolean;
  cancellation: string;
  order: number;
  published: boolean;
}

export interface RoomDetailDoc extends RoomDoc {
  longDescription: string[];
}

export interface OfferDoc extends Doc {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  validity: string;
  inclusions: string[];
  terms: string;
  discountLabel: string;
  fromRate: number;
  image: ConvexImage;
  code: string;
  order: number;
}

export interface FacilityGroupDoc extends Doc {
  category: string;
  blurb: string;
  items: { name: string; description: string; icon: string; hours?: string }[];
  order: number;
}

export interface DiningVenueDoc extends Doc {
  slug: string;
  name: string;
  cuisine: string;
  blurb: string;
  description: string;
  hours: string;
  dressCode: string;
  capacity: number;
  image: ConvexImage;
  highlights: { name: string; description: string; price: number }[];
  order: number;
}

export interface VenueDoc extends Doc {
  slug: string;
  name: string;
  blurb: string;
  description: string;
  areaSqm: number;
  dimensions: string;
  capacities: { layout: string; seats: number }[];
  equipment: string[];
  image: ConvexImage;
  fromRate: number;
  order: number;
}

export interface ExtraDoc extends Doc {
  key: string;
  name: string;
  description: string;
  price: number;
  unit: "stay" | "night";
  icon: string;
  order: number;
}

export interface ReviewDoc extends Doc {
  author: string;
  rating: number;
  date: string;
  source: string;
  title: string;
  body: string;
  stayType: string;
  order: number;
}

export interface AttractionDoc extends Doc {
  name: string;
  category: string;
  distanceKm: number;
  minutes: number;
  note: string;
  order: number;
}

export interface ServiceDoc extends Doc {
  name: string;
  description: string;
  icon: string;
  availability: string;
  order: number;
}

export interface FaqDoc extends Doc {
  category: string;
  question: string;
  answer: string;
  order: number;
}

export interface GalleryDoc extends Doc {
  image: ConvexImage;
  category: string;
  tall: boolean;
  order: number;
}

export interface PostDoc extends Doc {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readMinutes: number;
  image: ConvexImage;
  published: boolean;
}

export interface PostDetailDoc extends PostDoc {
  body: string[];
}

export interface SettingsDoc extends Doc {
  key: "site";
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

export interface BookingDoc extends Doc {
  reference: string;
  status: "pending" | "confirmed" | "checked-in" | "completed" | "cancelled";
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomCount: number;
  extras: string[];
  promoCode: string | null;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    specialRequests: string;
    arrivalTime: string;
  };
  total: number;
}

type Empty = Record<string, never>;

/* ------------------------------------------------------------------ queries */

export const q = {
  rooms: makeFunctionReference<"query", Empty, RoomDoc[]>("rooms:list"),
  room: makeFunctionReference<"query", { slug: string }, RoomDetailDoc | null>(
    "rooms:bySlug",
  ),
  offers: makeFunctionReference<"query", Empty, OfferDoc[]>("offers:list"),
  facilities: makeFunctionReference<"query", Empty, FacilityGroupDoc[]>(
    "facilities:list",
  ),
  dining: makeFunctionReference<"query", Empty, DiningVenueDoc[]>("dining:list"),
  venues: makeFunctionReference<"query", Empty, VenueDoc[]>("venues:list"),
  extras: makeFunctionReference<"query", Empty, ExtraDoc[]>("pricing:extras"),
  promo: makeFunctionReference<
    "query",
    { code: string },
    { valid: true; discount: number; label: string } | { valid: false }
  >("pricing:validatePromo"),
  reviews: makeFunctionReference<
    "query",
    Empty,
    { reviews: ReviewDoc[]; summary: { value: number; count: number; best: number } }
  >("reviews:list"),
  attractions: makeFunctionReference<"query", Empty, AttractionDoc[]>(
    "directory:attractions",
  ),
  services: makeFunctionReference<"query", Empty, ServiceDoc[]>("directory:services"),
  faqs: makeFunctionReference<"query", Empty, FaqDoc[]>("faqs:list"),
  gallery: makeFunctionReference<"query", Empty, GalleryDoc[]>("gallery:list"),
  posts: makeFunctionReference<"query", Empty, PostDoc[]>("posts:list"),
  post: makeFunctionReference<"query", { slug: string }, PostDetailDoc | null>(
    "posts:bySlug",
  ),
  settings: makeFunctionReference<"query", Empty, SettingsDoc | null>("settings:get"),
  lookupBooking: makeFunctionReference<
    "query",
    { reference: string; email: string },
    BookingDoc | null
  >("bookings:lookup"),
} as const;

/* ---------------------------------------------------------------- mutations */

export const m = {
  createBooking: makeFunctionReference<
    "mutation",
    Omit<BookingDoc, "_id" | "_creationTime" | "reference" | "status">,
    { reference: string }
  >("bookings:create"),
  cancelBooking: makeFunctionReference<
    "mutation",
    { reference: string; email: string },
    string
  >("bookings:cancel"),
  sendMessage: makeFunctionReference<
    "mutation",
    {
      kind: "contact" | "event-quote" | "table-reservation";
      name: string;
      email: string;
      phone: string;
      subject: string;
      body: string;
      details: { label: string; value: string }[];
    },
    null
  >("messages:send"),
  subscribe: makeFunctionReference<
    "mutation",
    { email: string; source?: string },
    null
  >("subscribers:subscribe"),
} as const;

/** True once a deployment URL is configured. */
export const convexConfigured = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
