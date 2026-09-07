"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheckIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { type Contact } from "@/lib/site";

/**
 * Call · WhatsApp · Book, pinned to the bottom on phones.
 *
 * Hidden inside the booking flow, where it would compete with that page's own
 * sticky summary and Continue button.
 */
export function MobileActionBar({ contact }: { contact: Contact }) {
  const pathname = usePathname();
  if (pathname.startsWith("/booking")) return null;

  const itemClass =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-bold transition-colors";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <nav aria-label="Quick actions" className="flex items-stretch">
        <a href={contact.telHref} className={`${itemClass} hover:bg-muted`}>
          <PhoneIcon className="size-5" />
          Call
        </a>
        <a
          href={contact.whatsapp.reservations}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} border-x hover:bg-muted`}
        >
          <MessageCircleIcon className="size-5" />
          WhatsApp
        </a>
        <Link
          href="/booking"
          className={`${itemClass} bg-brand text-brand-foreground hover:bg-brand/90`}
        >
          <CalendarCheckIcon className="size-5" />
          Book now
        </Link>
      </nav>
    </div>
  );
}
