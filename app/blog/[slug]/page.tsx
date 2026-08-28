import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPost,
  getPosts
} from "@/lib/content";
import { formatDateLong } from "@/lib/format";
import { site } from "@/lib/site";

/** Content edits appear within five minutes; see `revalidate` in lib/content.ts. */
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: post.image.src, alt: post.image.alt }],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  const others = posts.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image.src,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@id": `${site.url}/#hotel` },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <PageHeader
        title={post.title}
        crumbs={[
          { name: "Journal", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <Section>
        <article className="mx-auto max-w-3xl">
          <Reveal className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge className="bg-brand-muted font-bold text-brand">{post.tag}</Badge>
            <time dateTime={post.date}>{formatDateLong(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readMinutes} min read</span>
          </Reveal>

          <Reveal delay={0.05} className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.08} className="mt-10 space-y-6 text-lg leading-relaxed text-pretty text-muted-foreground">
            <p className="text-xl font-semibold text-foreground">{post.excerpt}</p>
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="mt-12 rounded-2xl bg-muted/60 p-6 text-center">
            <h2 className="font-heading text-xl font-extrabold">
              Coming to Port Harcourt?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We&apos;re five minutes from UNIPORT with 24-hour power, fibre Wi-Fi
              and a kitchen worth staying in for.
            </p>
            <Button
              size="lg"
              className="mt-5 h-12 bg-brand px-6 font-extrabold text-brand-foreground hover:bg-brand/90"
              render={<Link href="/booking" />}
            >
              Check availability <ArrowRightIcon />
            </Button>
          </Reveal>
        </article>
      </Section>

      <Section muted aria-label="More from the journal">
        <h2 className="font-heading text-2xl font-extrabold">
          More from the journal
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug}>
              <article className="group relative flex gap-4 rounded-2xl bg-background p-4 ring-1 ring-foreground/10">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={other.image.src}
                    alt={other.image.alt}
                    fill
                    loading="lazy"
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand">{other.tag}</p>
                  <h3 className="mt-1 font-heading text-base font-extrabold">
                    <Link
                      href={`/blog/${other.slug}`}
                      className="after:absolute after:inset-0 hover:text-brand"
                    >
                      {other.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {other.excerpt}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
