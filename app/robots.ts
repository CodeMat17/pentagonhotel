import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // One guest's reservation, and the form that finds it. Neither has any
        // business in an index — /reservation/* is a private page whose URL is
        // its own credential.
        disallow: ["/manage-booking", "/reservation/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
