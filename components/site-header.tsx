"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { MenuIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { AddressLink } from "@/components/address-link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { type Contact } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Subscribes to scroll as an external store — no setState cascade on mount. */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export function SiteHeader({
  announcement,
  contact,
}: {
  announcement?: string;
  /** Live contact details, resolved on the server and passed down — every field
   *  is a plain string so it crosses the server/client boundary. */
  contact: Contact;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 24,
    () => false,
  );

  /** The homepage hero sits under a transparent header until you scroll. */
  const overHero = pathname === "/" && !scrolled;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        overHero
          ? "border-b border-transparent bg-transparent text-white"
          : "border-b border-border/80 bg-background/85 backdrop-blur-lg supports-backdrop-filter:bg-background/70",
      )}
    >
      {announcement ? <AnnouncementBar text={announcement} /> : null}

      <div className="container-page flex pt-1 items-center justify-between gap-4">
        <Link
          href="/"
          // No aria-label: the visible wordmark is the accessible name, so
          // voice-control users can say what they see.
          className="rounded-lg py-1"
        >
          <Logo />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "link-underline rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                overHero
                  ? "text-white/85 hover:text-white"
                  : "text-foreground/70 hover:text-foreground",
                isActive(link.href) &&
                  (overHero
                    ? "text-white after:w-full"
                    : "text-foreground after:w-full"),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-lg"
            className={cn("hidden sm:inline-flex", overHero && "hover:bg-white/15")}
            render={<a href={contact.telHref} aria-label={`Call ${contact.phoneDisplay}`} />}
          >
            <PhoneIcon className="size-[18px]" />
          </Button>

          <ThemeToggle className={cn(overHero && "hover:bg-white/15")} />

          <Button
            size="lg"
            className={cn(
              "hidden h-10 px-5 font-bold sm:inline-flex",
              overHero
                ? "bg-brand text-brand-foreground hover:bg-brand/90"
                : "bg-brand text-brand-foreground hover:bg-brand/90",
            )}
            render={<Link href="/booking" />}
          >
            Book now
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Open menu"
                  className={cn("lg:hidden", overHero && "hover:bg-white/15")}
                />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full gap-0 overflow-y-auto sm:max-w-sm"
            >
              <SheetHeader className="p-5 pb-3">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation and contact options
                </SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-col px-3 pb-4">
                {primaryNav.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 flex-col justify-center rounded-lg px-3 py-2.5 transition-colors hover:bg-muted",
                          isActive(link.href) && "bg-muted",
                        )}
                      />
                    }
                  >
                    <span className="font-heading text-[0.95rem] font-bold">
                      {link.label}
                    </span>
                    {link.description && (
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    )}
                  </SheetClose>
                ))}

                <Separator className="my-3" />

                <div className="grid grid-cols-2 gap-1">
                  {secondaryNav.map((link) => (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </div>
              </nav>

              <div className="mt-auto space-y-2.5 border-t p-5">
                <Button
                  size="lg"
                  className="h-12 w-full bg-brand text-base font-bold text-brand-foreground hover:bg-brand/90"
                  render={<Link href="/booking" />}
                >
                  Check availability
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11"
                    render={<a href={contact.telHref} />}
                  >
                    <PhoneIcon /> Call
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11"
                    render={
                      <a
                        href={contact.whatsapp.reservations}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <MessageCircleIcon /> WhatsApp
                  </Button>
                </div>
                <p className="pt-1 text-center text-xs text-muted-foreground">
                  <AddressLink as="span" address={contact.address} />
                  <br />
                  {contact.phoneDisplay}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
