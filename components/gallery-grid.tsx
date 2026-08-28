"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryImage } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Filterable gallery with a keyboard-navigable lightbox.
 *
 * Filtering happens client-side over a fixed list, so there is no request and no
 * loading state — the grid re-lays out immediately.
 */
export function GalleryGrid({
  gallery,
  limit,
}: {
  gallery: GalleryImage[];
  limit?: number;
}) {
  // Derived from the content itself, so a new category needs no code change.
  const galleryCategories = [
    "All",
    ...Array.from(new Set(gallery.map((image) => image.category))),
  ];

  const [category, setCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = (
    category === "All"
      ? gallery
      : gallery.filter((image) => image.category === category)
  ).slice(0, limit);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null
          ? null
          : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  const active = openIndex === null ? null : visible[openIndex];

  return (
    <div>
      {!limit && (
        <div
          role="group"
          aria-label="Filter gallery by category"
          className="mb-8 flex flex-wrap gap-2"
        >
          {galleryCategories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              onClick={() => {
                setCategory(name);
                setOpenIndex(null);
              }}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm font-bold ring-1 transition-colors",
                category === name
                  ? "bg-brand text-brand-foreground ring-brand"
                  : "bg-background text-muted-foreground ring-border hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <ul className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-3 lg:grid-cols-4">
        {visible.map((image, index) => (
          <li
            key={image.src + index}
            className={cn("relative", image.tall && "row-span-2")}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative size-full overflow-hidden rounded-xl ring-1 ring-foreground/10"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="text-left text-xs font-bold text-white">
                  {image.category}
                </span>
                <ExpandIcon className="size-4 text-white" aria-hidden="true" />
              </span>
              <span className="sr-only">View larger: {image.alt}</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={openIndex !== null}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <DialogContent className="max-w-5xl gap-0 border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {active?.alt ?? "Gallery image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Use the left and right arrow keys to move between images.
          </DialogDescription>

          {active && (
            <figure className="relative">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-background/95 p-3 text-sm backdrop-blur">
                <span className="text-muted-foreground">{active.alt}</span>
                <span className="flex shrink-0 gap-1">
                  <Button
                    variant="outline"
                    size="icon-lg"
                    aria-label="Previous image"
                    onClick={() => step(-1)}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-lg"
                    aria-label="Next image"
                    onClick={() => step(1)}
                  >
                    <ChevronRightIcon />
                  </Button>
                </span>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
