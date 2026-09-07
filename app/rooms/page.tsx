import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { RoomsExplorer } from "@/components/rooms-explorer";
import { getRooms } from "@/lib/content";
import { Section } from "@/components/section";
import { ogImage, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Eight room types at Pentagon International Hotel & Suites, Choba — from the Standard Queen Room at ₦20,000 to the Executive Spring Suite. Every room has 24-hour power, fibre Wi-Fi and air conditioning.",
  alternates: { canonical: "/rooms" },
  openGraph: {
    images: [ogImage],
    title: `Rooms & Suites · ${site.name}`,
    description:
      "Eight room types, all with 24-hour power and fibre Wi-Fi. Filter by price, size, bed type and amenities.",
    url: `${site.url}/rooms`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <>
      <PageHeader
        title="Rooms & Suites"
        description="Eight room types, all with 24-hour power, fibre Wi-Fi and air conditioning that stays on when the street goes dark. Filter by what matters to you."
        crumbs={[{ name: "Rooms & Suites", href: "/rooms" }]}
        image={{
          src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=75&w=1600",
          alt: "A Double King Room with an armchair and warm evening lighting",
        }}
      />

      <Section>
        {/* Keeps the heading order h1 → h2 → h3 intact above the room cards. */}
        <h2 className="sr-only">Available rooms</h2>
        <RoomsExplorer rooms={rooms} />
      </Section>
    </>
  );
}
