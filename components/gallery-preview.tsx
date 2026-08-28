import Image from "next/image";
import Link from "next/link";

import type { GalleryImage } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Homepage gallery teaser.
 *
 * Deliberately not the interactive `GalleryGrid`: the homepage does not need a
 * lightbox or filters, and shipping them costs hydration time on the page that
 * can least afford it. Each tile is a plain link to /gallery, which is where
 * the full interactive version lives.
 */
export function GalleryPreview({
  gallery,
  count = 8,
}: {
  gallery: GalleryImage[];
  count?: number;
}) {
  const images = gallery.slice(0, count);

  return (
    <ul className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, index) => (
        <li key={image.src} className={cn(image.tall && "row-span-2")}>
          <Link
            href="/gallery"
            className="group relative block size-full overflow-hidden rounded-xl ring-1 ring-foreground/10"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="text-xs font-bold text-white">
                {index === images.length - 1 ? "See all photos" : image.category}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
