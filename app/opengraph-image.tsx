import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — hotel in Choba, Port Harcourt`;

/**
 * Social share card, generated at build time. Kept to flexbox and system fonts,
 * which is all Satori supports reliably.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #17140f 0%, #2b2318 100%)",
          padding: 72,
          color: "#fdfbf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 40 40">
            <path
              d="M20 2.5 37.6 15.3 30.9 36H9.1L2.4 15.3 20 2.5Z"
              fill="none"
              stroke="#e0a54a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M20 11.5 22.6 19h7.9l-6.4 4.7 2.5 7.6L20 26.6l-6.6 4.7 2.5-7.6L9.5 19h7.9L20 11.5Z"
              fill="#e0a54a"
            />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#e0a54a",
              fontWeight: 700,
            }}
          >
            Owhipa Choba · Port Harcourt
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
            Pentagon Hotel
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
            <span style={{ color: "#e0a54a" }}>&amp;</span>&nbsp;Suites
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              color: "rgba(253,251,247,0.78)",
              maxWidth: 900,
            }}
          >
            Rooms that stay lit. A kitchen worth staying in for. Five minutes from
            UNIPORT.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "rgba(253,251,247,0.6)",
          }}
        >
          <div style={{ display: "flex" }}>pentagonhotelandsuites.com</div>
          <div style={{ display: "flex" }}>{site.phone.display}</div>
        </div>
      </div>
    ),
    size,
  );
}
