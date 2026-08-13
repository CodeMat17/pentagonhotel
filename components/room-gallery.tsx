"use client";

import Image from "next/image";
import { useState } from "react";

import type { RoomImage } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Room detail gallery: one large image with thumbnails beneath. All images share
 * the same aspect box, so switching never shifts the layout.
 */
export function RoomGallery({ images }: { images: RoomImage[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted sm:aspect-[3/2]">
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              index === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 transition-all",
                  index === active
                    ? "ring-2 ring-brand"
                    : "opacity-70 ring-border hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 33vw, 15vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
