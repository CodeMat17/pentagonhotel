"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: (delay: number = 0) => ({
    transition: { delayChildren: delay, staggerChildren: 0.075 },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

/**
 * Reveals a headline one word at a time, each rising out of a clipped line.
 *
 * `children` is a list of nodes rather than a string so a word can carry its
 * own decoration — the hero passes "Pentagon" wrapped in its brush underline.
 */
export function WordReveal({
  children,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  children: ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
}) {
  const reduced = useReducedMotion();
  const MotionTag = Tag === "h1" ? motion.h1 : motion.h2;

  return (
    <MotionTag
      className={className}
      custom={delay}
      variants={container}
      initial={reduced ? false : "hidden"}
      animate="visible"
    >
      {children.map((node, i) => (
        // Each word gets its own transform origin; the trailing gap is padding
        // rather than a text space so the inline-block keeps it.
        <motion.span
          key={i}
          variants={word}
          className={i < children.length - 1 ? "inline-block pe-[0.26em]" : "inline-block"}
        >
          {node}
        </motion.span>
      ))}
    </MotionTag>
  );
}
