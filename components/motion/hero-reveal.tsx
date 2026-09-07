import type { CSSProperties, ReactNode } from "react";

/**
 * The hero's entrance, on the CSS timeline instead of framer-motion's.
 *
 * `<Reveal>` is a client component: everything it wraps sits at opacity 0
 * until React hydrates. That is free for the scroll-triggered sections below
 * the fold, but in the hero it made the sub-headline the LCP element with
 * ~1.25s of render delay — the paint was waiting on hydration, not on the
 * network. These wrappers render no JavaScript at all, so the cascade starts
 * at first paint.
 *
 * Delays are deliberately tighter than the framer-motion ones they replace:
 * the animation now begins ~1s earlier, so the same stagger that read as
 * elegant when it started late would read as sluggish here.
 *
 * `prefers-reduced-motion` is honoured globally in `globals.css`, which
 * collapses these animations rather than skipping them.
 */
export function HeroReveal({
  children,
  className,
  delay = 0,
  opaque = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Milliseconds after first paint. */
  delay?: number;
  /**
   * Rise without fading. Set this on whichever block holds the LCP element:
   * Chrome does not count a transparent element as painted, so fading it in
   * charges the whole animation to Largest Contentful Paint.
   */
  opaque?: boolean;
  as?: "div" | "p" | "section";
}) {
  return (
    <Tag
      className={`${opaque ? "hero-rise-opaque" : "hero-rise"}${
        className ? ` ${className}` : ""
      }`}
      style={{ "--hero-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * The headline, revealed a word at a time.
 *
 * Mirrors what `<WordReveal>` did, but each word carries its own
 * `animation-delay` rather than a framer-motion variant, so the h1 stays in
 * the server tree. `children` is a list of nodes so a word can bring its own
 * decoration — the hero passes "Pentagon" wrapped in its brush underline.
 */
export function HeroWords({
  children,
  className,
  delay = 0,
  stagger = 55,
  as: Tag = "h1",
}: {
  children: ReactNode[];
  className?: string;
  delay?: number;
  /** Milliseconds between consecutive words. */
  stagger?: number;
  as?: "h1" | "h2";
}) {
  return (
    <Tag className={className}>
      {children.map((node, i) => (
        <span
          key={i}
          // The trailing gap is padding rather than a text space, so the
          // inline-block the animation needs does not swallow it.
          className={`hero-rise ${
            i < children.length - 1 ? "inline-block pe-[0.26em]" : "inline-block"
          }`}
          style={{ "--hero-delay": `${delay + i * stagger}ms` } as CSSProperties}
        >
          {node}
        </span>
      ))}
    </Tag>
  );
}
