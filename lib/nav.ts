/** Navigation model shared by the header, mobile tray and footer. */

export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export const primaryNav: NavLink[] = [
  { href: "/rooms", label: "Rooms & Suites", description: "Six room types, every one with 24-hour power" },
  { href: "/facilities", label: "Facilities", description: "Pool, gym, spa, business centre and more" },
  { href: "/dining", label: "Dining", description: "Two restaurants, a bar and a café" },
  { href: "/events", label: "Events", description: "Conferences, weddings and meetings up to 300" },
  { href: "/offers", label: "Offers", description: "Packages and direct-booking rates" },
  { href: "/gallery", label: "Gallery", description: "See the hotel before you arrive" },
];

export const secondaryNav: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Guest services" },
  { href: "/location", label: "Location" },
  { href: "/blog", label: "Journal" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Hotel",
    links: [
      { href: "/about", label: "About us" },
      { href: "/rooms", label: "Rooms & suites" },
      { href: "/facilities", label: "Facilities" },
      { href: "/dining", label: "Dining" },
      { href: "/events", label: "Events & conferences" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Reservations",
    links: [
      { href: "/booking", label: "Book a room" },
      { href: "/manage-booking", label: "Manage booking" },
      { href: "/offers", label: "Offers & packages" },
      { href: "/terms#cancellation", label: "Cancellation policy" },
      { href: "/terms#booking", label: "Booking terms" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/location", label: "Location & directions" },
      { href: "/services", label: "Guest services" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/blog", label: "Journal" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & conditions" },
    ],
  },
];
