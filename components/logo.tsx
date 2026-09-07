import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * The house mark: a pentagon with a five-point inner star, drawn inline so it
 * costs no network request and inherits `currentColor` in both themes.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      alt='logo'
      priority
      src='/logo-3.webp'
      width={55}
      height={55}
      className='shrink-0 object-cover'
    />
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
          <span className="hidden sm:block text-[0.68rem] font-semibold tracking-[0.22em] uppercase">
            International Hotel &amp; Suites
          </span>
        </span>
      )}
    </span>
  );
}
