"use client";

import { useEffect, useRef } from "react";

/**
 * The strip above the navigation, shown when an admin switches an announcement
 * on in the dashboard.
 *
 * It lives inside the fixed header rather than in the document flow: the header
 * is `fixed`, so anything rendered above it in flow would sit *behind* it and
 * never be seen.
 *
 * Because it is fixed it takes up no flow space, and every page's `pt-28` only
 * clears the navigation row. So the bar measures itself and publishes its height
 * as `--announce-h`, which the layout adds to the top of `<main>`. The height is
 * measured rather than assumed because the text wraps to a second line on narrow
 * screens.
 */
export function AnnouncementBar({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty("--announce-h", `${entry.contentRect.height}px`);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.style.removeProperty("--announce-h");
    };
  }, []);

  return (
    <p
      ref={ref}
      role="status"
      className="bg-brand px-4 py-2 text-center text-sm font-semibold text-brand-foreground"
    >
      {text}
    </p>
  );
}
