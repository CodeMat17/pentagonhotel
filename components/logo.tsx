import { cn } from "@/lib/utils";

/**
 * The house mark: a pentagon with a five-point inner star, drawn inline so it
 * costs no network request and inherits `currentColor` in both themes.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 2.5 37.6 15.3 30.9 36H9.1L2.4 15.3 20 2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20 11.5 22.6 19h7.9l-6.4 4.7 2.5 7.6L20 26.6l-6.6 4.7 2.5-7.6L9.5 19h7.9L20 11.5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    // The visible wordmark supplies the accessible name; see site-header for
    // the link's aria-label, which must contain this text verbatim.
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8 shrink-0 text-brand" />
      {showText && (
        <span className="flex flex-col leading-4">
          <span className="font-heading font-extrabold tracking-tight">
            Pentagon
          </span>
          <span className="text-[0.68rem] font-semibold tracking-[0.22em] uppercase">
            Hotel &amp; Suites
          </span>
        </span>
      )}
    </span>
  );
}
