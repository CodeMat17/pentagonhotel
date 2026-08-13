import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { JsonLd, breadcrumbSchema } from "@/components/structured-data";
import { Reveal } from "@/components/motion/reveal";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * The banner every inner page opens with: breadcrumbs, h1, standfirst, and an
 * optional background image. The image is `priority` because on these pages it
 * is the LCP element.
 */
export function PageHeader({
  title,
  description,
  crumbs,
  image,
}: {
  title: string;
  description?: string;
  crumbs: Crumb[];
  image?: { src: string; alt: string };
}) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...crumbs];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <section
        className={
          image
            ? "relative isolate flex min-h-[58vh] items-end overflow-hidden pt-28 pb-12 text-white sm:min-h-[62vh] lg:pb-16"
            : "relative border-b bg-muted/40 pt-28 pb-12 lg:pt-36 lg:pb-16"
        }
      >
        {image && (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="-z-20 object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/35"
            />
          </>
        )}

        <div className="container-page">
          <Reveal y={12}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold">
                {trail.map((crumb, index) => {
                  const last = index === trail.length - 1;
                  return (
                    <li key={crumb.href} className="flex items-center gap-1">
                      {last ? (
                        <span
                          aria-current="page"
                          className={image ? "text-white/70" : "text-muted-foreground"}
                        >
                          {crumb.name}
                        </span>
                      ) : (
                        <>
                          <Link
                            href={crumb.href}
                            className={
                              image
                                ? "text-white/80 transition-colors hover:text-white"
                                : "text-muted-foreground transition-colors hover:text-foreground"
                            }
                          >
                            {crumb.name}
                          </Link>
                          <ChevronRightIcon
                            aria-hidden="true"
                            className={
                              image
                                ? "size-3.5 text-white/50"
                                : "size-3.5 text-muted-foreground/60"
                            }
                          />
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </Reveal>

          <Reveal delay={0.05} className="mt-5 max-w-3xl">
            <h1 className="display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              {title}
            </h1>
            {description && (
              <p
                className={`mt-5 max-w-2xl text-lg leading-relaxed text-pretty ${
                  image ? "text-white/85" : "text-muted-foreground"
                }`}
              >
                {description}
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
