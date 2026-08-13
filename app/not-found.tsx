import Link from "next/link";
import { ArrowRightIcon, PhoneIcon } from "lucide-react";

import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/nav";
import { site, telLink } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70svh] flex-col items-center justify-center py-24 text-center">
      <LogoMark className="size-14 text-brand" />

      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">
        That page has checked out
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
        The link is broken or the page has moved. Reception is still open,
        though — it always is.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="h-12 bg-brand px-6 font-extrabold text-brand-foreground hover:bg-brand/90"
          render={<Link href="/" />}
        >
          Back to the homepage <ArrowRightIcon />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 font-bold"
          render={<a href={telLink} />}
        >
          <PhoneIcon /> Call {site.phone.display}
        </Button>
      </div>

      <nav aria-label="Popular pages" className="mt-12">
        <h2 className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
          Or try one of these
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {primaryNav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ring-1 ring-border transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
