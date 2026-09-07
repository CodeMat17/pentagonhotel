import { ExternalLinkIcon } from "lucide-react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The hotel address, rendered as a link that opens it on Google Maps.
 *
 * The address is the one detail a guest is most likely to want *somewhere else*
 * — in their phone's map app, in a driver's hands — so every place it appears
 * opens the hotel's Google Maps listing, with a trailing external-link mark so
 * it reads as a link rather than a decorated line of text.
 */
export function AddressLink({
  address,
  className,
  iconClassName,
  /**
   * The wrapping element. `<address>` is right almost everywhere, but it is
   * flow content and so cannot be nested inside a `<p>` — the browser closes
   * the paragraph early and the layout breaks. Pass `"span"` at the few call
   * sites that already sit inside one.
   */
  as: Wrapper = "address",
}: {
  address: string;
  className?: string;
  iconClassName?: string;
  as?: "address" | "span";
}) {
  return (
    <Wrapper className={cn("not-italic", className)}>
      <a
        href={site.mapsPlaceUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open in Google Maps"
        className="inline transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 rounded-sm"
      >
        {address}
        <ExternalLinkIcon
          aria-hidden="true"
          className={cn(
            "ml-1 inline size-3.5 shrink-0 translate-y-[-1px] text-brand",
            iconClassName,
          )}
        />
        <span className="sr-only"> — open in Google Maps</span>
      </a>
    </Wrapper>
  );
}
