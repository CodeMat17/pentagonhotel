"use client";

import { StarIcon } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Review } from "@/lib/data";
import { formatMonthYear } from "@/lib/format";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          aria-hidden="true"
          className={
            index < rating
              ? "size-4 fill-brand text-brand"
              : "size-4 text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}

/** Swipeable on touch, arrow-key and button navigable on desktop. */
export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full"
      aria-label="Guest reviews"
    >
      <CarouselContent className="-ml-4">
        {reviews.map((review) => (
          <CarouselItem
            key={review.author + review.date}
            className="pl-4 sm:basis-1/2 lg:basis-1/3"
          >
            <figure className="flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <Stars rating={review.rating} />
              <figcaption className="mt-4 font-heading text-base font-extrabold">
                {review.title}
              </figcaption>
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{review.body}”
              </blockquote>
              <div className="mt-5 border-t pt-4 text-xs">
                <p className="font-bold">{review.author}</p>
                <p className="text-muted-foreground">
                  {review.stayType} · via {review.source} ·{" "}
                  <time dateTime={review.date}>
                    {formatMonthYear(review.date)}
                  </time>
                </p>
              </div>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-8 flex justify-center gap-2">
        <CarouselPrevious className="static size-11 translate-y-0" />
        <CarouselNext className="static size-11 translate-y-0" />
      </div>
    </Carousel>
  );
}
