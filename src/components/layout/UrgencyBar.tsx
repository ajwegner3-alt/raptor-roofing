"use client";

import { useEffect, useState } from "react";
import { X, Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

const SESSION_KEY = "raptor-urgency-bar-dismissed";
const SCROLL_THRESHOLD = 500;

export function UrgencyBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check sessionStorage on mount — stay hidden if already dismissed this session
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY >= SCROLL_THRESHOLD) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  // Render nothing until scroll threshold is met or if dismissed
  if (dismissed) return null;

  return (
    <div
      role="banner"
      aria-label="Emergency roofing services available 24/7"
      className={`fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center bg-accent-600 px-4 text-white shadow-md transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Content */}
      <div className="flex items-center gap-2 text-sm font-body font-medium">
        <span className="hidden sm:inline">
          24/7 Emergency Roof Tarping Available —
        </span>
        <span className="sm:hidden">Emergency Tarping 24/7 —</span>
        <a
          href={siteConfig.phone.href}
          className="inline-flex items-center gap-1 font-display font-bold underline underline-offset-2 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-accent-600"
          aria-label={`Call Raptor Roofing 24/7 emergency line at ${siteConfig.phone.display}`}
        >
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          {siteConfig.phone.display}
        </a>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss this banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
