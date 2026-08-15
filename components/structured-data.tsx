import { faqs, ratingSummary, rooms, diningVenues } from "@/lib/data";
import { fullAddress, site } from "@/lib/site";

/**
 * Renders a JSON-LD block. `JSON.stringify` escapes the payload, and we
 * additionally neutralise `<` so a stray "</script>" in content can never break
 * out of the tag.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.street}, ${site.address.area}`,
  addressLocality: site.address.city,
  addressRegion: site.address.state,
  postalCode: site.address.postalCode,
  addressCountry: site.address.countryCode,
};

/** The property itself — the anchor every other entity references. */
export const lodgingBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": `${site.url}/#hotel`,
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone.intl,
  email: site.email.reservations,
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  },
  hasMap: `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`,
  priceRange: "₦₦",
  currenciesAccepted: "NGN",
  paymentAccepted: "Cash, Credit Card, Bank Transfer, Online Payment",
  checkinTime: site.checkIn,
  checkoutTime: site.checkOut,
  starRating: { "@type": "Rating", ratingValue: 4 },
  petsAllowed: false,
  smokingAllowed: false,
  numberOfRooms: rooms.reduce((total, room) => total + room.inventory, 0),
  sameAs: [site.social.instagram, site.social.facebook, site.social.x],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: ratingSummary.value,
    reviewCount: ratingSummary.count,
    bestRating: ratingSummary.best,
  },
  amenityFeature: [
    "Free Wi-Fi",
    "Outdoor swimming pool",
    "Fitness centre",
    "Spa",
    "Restaurant",
    "Bar",
    "Free parking",
    "Airport shuttle",
    "24-hour front desk",
    "Room service",
    "Business centre",
    "Conference facilities",
    "Backup power",
    "Wheelchair accessible",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  makesOffer: rooms.map((room) => ({
    "@type": "Offer",
    name: room.name,
    price: room.rate,
    priceCurrency: "NGN",
    url: `${site.url}/rooms/${room.slug}`,
    availability: "https://schema.org/InStock",
  })),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  inLanguage: "en-NG",
  publisher: { "@id": `${site.url}/#hotel` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${site.url}/rooms?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export const restaurantSchemas = diningVenues.map((venue) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: venue.name,
  servesCuisine: venue.cuisine,
  description: venue.description,
  address: postalAddress,
  telephone: site.phone.intl,
  url: `${site.url}/dining#${venue.slug}`,
  priceRange: "₦₦",
  containedInPlace: { "@id": `${site.url}/#hotel` },
}));

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.href}`,
    })),
  };
}

export function roomSchema(slug: string) {
  const room = rooms.find((candidate) => candidate.slug === slug);
  if (!room) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    description: room.description,
    url: `${site.url}/rooms/${room.slug}`,
    image: room.images.map((image) => image.src),
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxAdults + room.maxChildren,
      unitText: "guests",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: room.sizeSqm,
      unitCode: "MTK",
    },
    bed: { "@type": "BedDetails", typeOfBed: room.bed, numberOfBeds: room.bed === "Twin" ? 2 : 1 },
    containedInPlace: { "@id": `${site.url}/#hotel` },
    offers: {
      "@type": "Offer",
      price: room.rate,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${site.url}/booking?room=${room.slug}`,
    },
  };
}
