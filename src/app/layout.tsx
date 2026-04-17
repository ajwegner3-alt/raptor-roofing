// src/app/layout.tsx
import type { Metadata } from "next";
import { Oswald, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// ============================================================
// Font Configuration — next/font/google
// Self-hosted at build time — eliminates Google DNS round-trip
// ============================================================

const displayFont = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

// ============================================================
// Root Metadata
// metadataBase MUST be set here — without it, all OG image
// paths are relative and social crawlers cannot resolve them.
// (PITFALL C-1 from project research)
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app"
  ),

  title: {
    template: "%s | Raptor Roofing — Omaha Roofer",
    default: "Raptor Roofing — Omaha's Trusted Local Roofer Since 2009",
  },

  description:
    "Family-owned Omaha roofing contractor. 15+ years local, no subcontractors, licensed and insured. Free storm damage inspections and insurance claim help. Call (402) 885-1462.",

  openGraph: {
    siteName: "Raptor Roofing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "Raptor Roofing — Omaha's trusted local roofer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================
// Root Layout
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <a href="#main" className="skip-to-main">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
