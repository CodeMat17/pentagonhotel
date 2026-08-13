import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * The heading block that opens most sections: gold eyebrow, display title,
 * supporting line. Kept in one place so vertical rhythm never drifts.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        action && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto flex flex-col items-center",
        )}
      >
        {eyebrow && (
          <p className="eyebrow mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-brand" />
            {eyebrow}
          </p>
        )}
        <Tag
          className={cn(
            "display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
            Tag === "h1" && "text-4xl sm:text-5xl lg:text-6xl",
          )}
        >
          {title}
        </Tag>
        {description && (
          <div className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

/** A page section with consistent vertical padding and a gutter. */
export function Section({
  children,
  className,
  id,
  muted = false,
  as: Tag = "section",
  labelledBy,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  muted?: boolean;
  as?: "section" | "div";
  labelledBy?: string;
  "aria-label"?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      className={cn("py-16 sm:py-20 lg:py-24", muted && "bg-muted/40", className)}
    >
      <div className="container-page">{children}</div>
    </Tag>
  );
}
