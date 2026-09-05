import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/content";
import { formatDateLong } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "City guides, hotel news and notes from the kitchen — written by the people who work at Pentagon International Hotel & Suites in Choba, Port Harcourt.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Journal · ${site.name}`,
    description: "Port Harcourt guides, event notes and news from the hotel.",
    url: `${site.url}/blog`,
  },
};

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        title="Journal"
        description="Guides to the city, notes from the kitchen, and the occasional explanation of how something here actually works."
        crumbs={[{ name: "Journal", href: "/blog" }]}
      />

      <Section>
        <Stagger as="ul" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <StaggerItem as="li" key={post.slug}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    fill
                    priority={index < 3}
                    loading={index < 3 ? undefined : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-background/90 font-bold text-foreground backdrop-blur">
                    {post.tag}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold text-muted-foreground">
                    <time dateTime={post.date}>
                      {formatDateLong(post.date)}
                    </time>{" "}
                    · {post.readMinutes} min read
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-extrabold">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="after:absolute after:inset-0 hover:text-brand"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
