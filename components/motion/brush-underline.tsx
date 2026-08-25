"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The hand-drawn gold underline that sits beneath "Pentagon" in the hero.
 *
 * Two strokes on purpose: a confident main sweep and a lighter second pass
 * that overshoots on the right, which is what makes it read as drawn by hand
 * rather than as a border. Both draw themselves in with `pathLength`, and a
 * gradient carries the stroke from deep gold into a highlight so it stays
 * visible against a dark hero image in either theme.
 */
export function BrushUnderline({
  delay = 0.55,
  className,
}: {
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const draw = (i: number, opacity = 1) => ({
    initial: reduced ? undefined : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity },
    transition: {
      pathLength: {
        duration: 0.85,
        delay: delay + i * 0.18,
        ease: [0.16, 1, 0.3, 1] as const,
      },
      opacity: { duration: 0.15, delay: delay + i * 0.18 },
    },
  });

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 26"
      fill="none"
      preserveAspectRatio="none"
      className={
        "pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.32em] w-full overflow-visible " +
        (className ?? "")
      }
    >
      <defs>
        <linearGradient id="brush-underline-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B8863B" />
          <stop offset="45%" stopColor="#E3B161" />
          <stop offset="100%" stopColor="#F7DDA8" />
        </linearGradient>
      </defs>

      <motion.path
        d="M3 17.5C54 8.5 121 4.5 178 6.5C223 8 268 12 296 18"
        stroke="url(#brush-underline-gold)"
        strokeWidth={7}
        strokeLinecap="round"
        {...draw(0)}
      />
      <motion.path
        d="M22 24C79 18.5 152 16.5 213 18.5C246 19.6 271 21.4 288 23.5"
        stroke="url(#brush-underline-gold)"
        strokeWidth={3}
        strokeLinecap="round"
        {...draw(1, 0.6)}
      />
    </svg>
  );
}
