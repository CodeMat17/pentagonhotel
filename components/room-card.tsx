import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BedDoubleIcon,
  MaximizeIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/site";
import type { Room } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * The room card used on the homepage, the rooms index and the booking flow.
 * `priority` is passed only for above-the-fold cards on the rooms index.
 */
export function RoomCard({
  room,
  priority = false,
  className,
}: {
  room: Room;
  priority?: boolean;
  className?: string;
}) {
  const cover = room.images[0];

  return (
    <article
      className={cn(
        "card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 hover:ring-brand/40",
        className,
      )}
    >
      {/* Not a link: the card title below is a stretched link covering the card. */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className="bg-background/90 font-bold text-foreground backdrop-blur">
            {room.category}
          </Badge>
          {room.accessible && (
            <Badge className="bg-background/90 font-bold text-foreground backdrop-blur">
              Step-free
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-extrabold tracking-tight">
          <Link
            href={`/rooms/${room.slug}`}
            className="after:absolute after:inset-0 transition-colors hover:text-brand"
          >
            {room.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-semibold text-brand">{room.tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {room.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <MaximizeIcon className="size-3.5 text-brand" aria-hidden="true" />
            {room.sizeSqm} m²
          </li>
          <li className="flex items-center gap-1.5">
            <BedDoubleIcon className="size-3.5 text-brand" aria-hidden="true" />
            {room.bed}
          </li>
          <li className="flex items-center gap-1.5">
            <UsersIcon className="size-3.5 text-brand" aria-hidden="true" />
            Up to {room.maxAdults + room.maxChildren}
          </li>
        </ul>

        <div className="mt-5 flex items-end justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {room.rackRate && (
              // No opacity here — a faded strike-through fails contrast.
              <span className="mr-1.5 line-through">
                {formatNaira(room.rackRate)}
              </span>
            )}
            <span className="font-heading text-xl font-extrabold text-foreground">
              {formatNaira(room.rate)}
            </span>
            <span className="block text-xs">per night, excl. taxes</span>
          </p>
          <Button
            variant="outline"
            size="lg"
            className="relative z-10 h-10 shrink-0 font-bold"
            render={<Link href={`/booking?room=${room.slug}`} />}
          >
            Book <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </article>
  );
}
