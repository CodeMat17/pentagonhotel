import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery-grid";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of the rooms, suites, restaurant, bar, pool, gym, conference hall and the streets around Pentagon Hotel and Suites in Choba, Port Harcourt.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: `Gallery · ${site.name}`,
    description: "Rooms, dining, pool, events and the neighbourhood.",
    url: `${site.url}/gallery`,
  },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        description="The hotel as it is — rooms, dining, the pool, the hall, and the streets outside. Filter by what you want to see, then tap any image for a closer look."
        crumbs={[{ name: "Gallery", href: "/gallery" }]}
      />

      <Section>
        <GalleryGrid />
      </Section>
    </>
  );
}
