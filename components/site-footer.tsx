import Link from "next/link";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/social-icons";
import { AddressLink } from "@/components/address-link";

import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { Separator } from "@/components/ui/separator";
import { formatTime12 } from "@/lib/format";
import { footerNav } from "@/lib/nav";
import { site, type Contact } from "@/lib/site";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.x, label: "X", Icon: XIcon },
];

/**
 * The contact block shows the dashboard's settings row — the single source of
 * truth for the hotel's contact details — already resolved by the root layout,
 * which reads it once for the header, the action bar and the schema too.
 * `resolveContact` supplies the static fallbacks, so the footer still renders
 * if no row has been saved.
 */
export function SiteFooter({ contact }: { contact: Contact }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t bg-muted/40">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.tagline}. Rooms, suites, all-day dining and event spaces for
              up to 300, five minutes from the University of Port Harcourt.
            </p>
            <NewsletterForm />
            <div className="flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.shortName} on ${label}`}
                  className="inline-flex size-11 items-center justify-center rounded-lg ring-1 ring-border transition-colors hover:bg-brand hover:text-brand-foreground hover:ring-brand"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="font-heading text-sm font-bold">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="font-heading text-sm font-bold">Contact</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2.5">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <AddressLink address={contact.address} />
                </li>
                <li className="flex gap-2.5">
                  <PhoneIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={contact.telHref}
                    className="transition-colors hover:text-foreground"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={contact.whatsapp.general}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    WhatsApp us
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <MailIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-all transition-colors hover:text-foreground"
                  >
                    {contact.email}
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <ClockIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>
                    Reception open 24 hours
                    <br />
                    Check-in {formatTime12(contact.checkIn)} · Checkout{" "}
                    {formatTime12(contact.checkOut)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="sm:text-right">
            Registered in Nigeria · RC 1839204 · Rivers State Hospitality
            Licence PH/HTL/2019/0442
          </p>
        </div>
      </div>
    </footer>
  );
}
