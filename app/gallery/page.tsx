import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery-grid";
import { getGallery } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of the rooms, suites, restaurant, bar, pool, gym, conference hall and the streets around Pentagon International Hotel & Suites in Choba, Port Harcourt.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: `Gallery · ${site.name}`,
    description: "Rooms, dining, pool, events and the neighbourhood.",
    url: `${site.url}/gallery`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <>
      <PageHeader
        title="Gallery"
        description="The hotel as it is — rooms, dining, the pool, the hall, and the streets outside. Filter by what you want to see, then tap any image for a closer look."
        crumbs={[{ name: "Gallery", href: "/gallery" }]}
      />

      <Section>
        <GalleryGrid gallery={gallery} />
      </Section>
    </>
  );
}
