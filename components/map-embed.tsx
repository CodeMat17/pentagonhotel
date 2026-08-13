"use client";

import { useState } from "react";
import { MapPinIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fullAddress, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Click-to-load Google Map.
 *
 * An embedded map is one of the heaviest third parties on a hotel site and it
 * lands directly on the Lighthouse score. This renders a lightweight static
 * placeholder and only injects the iframe when a guest asks for it — which also
 * means Google sets no cookies until they do.
 */
export function MapEmbed({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  const query = encodeURIComponent(fullAddress);
  const embedSrc = `https://www.google.com/maps?q=${query}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div
      className={cn(
        "relative isolate aspect-[16/10] overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10 sm:aspect-[16/9]",
        className,
      )}
    >
      {loaded ? (
        <iframe
          title={`Map showing ${site.name}, ${fullAddress}`}
          src={embedSrc}
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
              {fullAddress}
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
                <a href={directions} target="_blank" rel="noopener noreferrer" />
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
