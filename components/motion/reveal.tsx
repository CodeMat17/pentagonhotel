"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The handful of tags these wrappers need. Looked up rather than built with
 * `motion.create(tag)` at render time, which would remount on every render.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
} as const;

export type MotionTag = keyof typeof TAGS;

/**
 * Fades content in as it scrolls into view.
 *
 * Entrance motion is the only thing most sections need, and keeping it in one
 * client component means the pages around it stay server components. Honours
 * `prefers-reduced-motion` by rendering straight to the final state.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: MotionTag;
}) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Parent for `<StaggerItem>` children — reveals them one after another. */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
}) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];

  return (
    <Tag
      className={className}
      variants={listVariants}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
}) {
  const Tag = TAGS[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
