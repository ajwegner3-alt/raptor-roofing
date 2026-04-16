"use client";
// MapFacade — lazy-load Google Maps iframe on user interaction.
// Eliminates the ~300 kB Maps API JS from the initial page load,
// which was the primary cause of /contact's low Lighthouse Performance score.
//
// Pattern: show a static placeholder with a "View Map" button.
// On click, swap in the real Google Maps iframe.
// Users who don't interact with the map never download the Maps API.

import { useState } from "react";
import { MapPin } from "lucide-react";

interface MapFacadeProps {
  /** Full Google Maps embed URL (the src that would go in the iframe) */
  embedUrl: string;
  /** URL for the "Get Directions" / external link */
  directionsUrl: string;
  /** Human-readable location label shown on the placeholder */
  locationLabel: string;
  /** iframe height in px (default 320) */
  height?: number;
}

export function MapFacade({
  embedUrl,
  directionsUrl,
  locationLabel,
  height = 320,
}: MapFacadeProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div style={{ height }}>
        <iframe
          src={embedUrl}
          title="Raptor Roofing location map"
          width="100%"
          height={height}
          style={{ border: 0, display: "block" }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center bg-neutral-100 text-neutral-600"
      style={{ height }}
    >
      {/* Simple placeholder — map pin icon + city label + CTA buttons */}
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <MapPin
          className="h-10 w-10 text-primary-700"
          aria-hidden="true"
        />
        <p className="font-body text-base font-medium text-neutral-700">
          {locationLabel}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="rounded-md bg-primary-700 px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 min-h-[48px]"
          >
            View Map
          </button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-primary-700 bg-white px-5 py-2.5 font-body text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 min-h-[48px] flex items-center"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
