"use client";

import { useState } from "react";
import { MapPinIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  fullAddress,
  mapsDirectionsUrl,
  mapsEmbedUrl,
  site,
} from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Click-to-load Google Map.
 *
 * An embedded map is one of the heaviest third parties on a hotel site and it
 * lands directly on the Lighthouse score. This renders a lightweight static
 * placeholder and only injects the iframe when a guest asks for it — which also
 * means Google sets no cookies until they do.
 */
export function MapEmbed({
  className,
  /** The dashboard address. Falls back to the static one when not passed. */
  address = fullAddress,
}: {
  className?: string;
  address?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate aspect-[16/10] overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10 sm:aspect-[16/9]",
        className,
      )}
    >
      {loaded ? (
        <iframe
          title={`Map showing ${site.name}, ${address}`}
          src={mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
          allowFullScreen
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_30%_20%,var(--brand-muted),transparent_60%),radial-gradient(circle_at_75%_75%,var(--accent),transparent_55%)] p-6 text-center">
          <MapPinIcon className="size-9 text-brand" aria-hidden="true" />
          <div>
            <p className="font-heading text-lg font-extrabold">{site.name}</p>
            <address className="mt-1 text-sm not-italic text-muted-foreground">
              {address}
            </address>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              size="lg"
              onClick={() => setLoaded(true)}
              className="h-11 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
            >
              <PlayIcon /> Load interactive map
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 font-bold"
              render={
                <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              Get directions
            </Button>
          </div>
          <p className="max-w-sm text-xs text-muted-foreground">
            The map loads from Google only when you choose to load it, so no
            third-party cookies are set before then.
          </p>
        </div>
      )}
    </div>
  );
}
