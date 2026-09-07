import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { MobileActionBar } from "@/components/mobile-action-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import {
  JsonLd,
  lodgingBusinessSchema,
  websiteSchema,
} from "@/components/structured-data";
import { getReviews, getRooms, getSettings } from "@/lib/content";
import { Toaster } from "@/components/ui/sonner";
import { resolveContact, site } from "@/lib/site";
import "./globals.css";

/**
 * Nunito is the only family on the site. It is a variable font, so one file
 * covers every weight we use — self-hosted by next/font, no request to Google.
 */
const nunito = Nunito({
  variable: "--font-sans",
  // `latin-ext` is not optional here: the naira sign (₦, U+20A6) sits in it,
  // and every price on the site is in naira. Declaring only `latin` still
  // rendered correctly — the browser simply discovered the latin-ext face
  // late, fetched it after hydration and repainted, which pushed Largest
  // Contentful Paint out by ~600ms. Listing it preloads it with the rest.
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  // No custom `fallback`: passing one replaces next/font's automatically
  // size-adjusted fallback face, and losing that metric match reflows the whole
  // page when Nunito arrives — worth ~0.28 CLS on the homepage.
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Hotel in Choba, Port Harcourt`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "hotel in Port Harcourt",
    "hotel in Choba",
    "hotels near University of Port Harcourt",
    "conference hotel Port Harcourt",
    "wedding venue Port Harcourt",
    "Pentagon International Hotel & Suites",
    "hotel near UNIPORT",
    "Owhipa Choba hotel",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Hotel in Choba, Port Harcourt`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Hotel in Choba, Port Harcourt`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "travel",
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefdfb" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The hotel schema quotes live inventory and the live review average, so both
  // come from the same content layer every page reads.
  const [rooms, { summary }, settings] = await Promise.all([
    getRooms(),
    getReviews(),
    getSettings(),
  ]);

  // Resolved once, here, and handed to the header, the action bar, the footer
  // and the schema — so every piece of chrome quotes the same number, and the
  // settings row is read once per render rather than by each of them.
  const contact = resolveContact(settings);

  return (
    <html
      lang="en-NG"
      suppressHydrationWarning
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only z-100 rounded-lg bg-brand px-4 py-2 font-bold text-brand-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to main content
          </a>

          <SiteHeader
            contact={contact}
            announcement={
              settings?.announcementActive && settings.announcement
                ? settings.announcement
                : undefined
            }
          />

          {/*
            Bottom padding clears the fixed mobile action bar. The top padding is
            the announcement bar's measured height, and 0 when there is no
            announcement: the bar renders inside the fixed header — anything
            above the header in flow would sit behind it — so it takes up no flow
            space of its own, while each page's `pt-28` only clears the nav row.
          */}
          <main id="main" className="flex-1 pt-[var(--announce-h,0px)] pb-16 lg:pb-0">
            {children}
          </main>

          <SiteFooter contact={contact} />
          <MobileActionBar contact={contact} />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>

        <JsonLd data={[lodgingBusinessSchema(rooms, summary, contact), websiteSchema]} />
      </body>
    </html>
  );
}
