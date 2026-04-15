"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/content/site";

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll lock when overlay is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
    };
  }, [open]);

  // ESC key handler + focus trap
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusables = overlay.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    focusables[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Return focus to hamburger on close
  useEffect(() => {
    if (!open) hamburgerRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={hamburgerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-overlay"
        className="flex h-12 w-12 items-center justify-center rounded-md text-white hover:bg-primary-700"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          id="mobile-nav-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[100] flex flex-col bg-primary-900"
          style={{ height: "100dvh" }}
          onClick={() => setOpen(false)}
        >
          {/* Backdrop tap closes — root onClick handles empty-space taps.
              Interactive children each call setOpen(false) so bubbling is a no-op. */}
          <div className="flex items-center justify-between px-4 h-16">
            <span className="inline-flex items-center justify-center rounded-md bg-background px-2 py-1">
              <Image
                src="/images/raptor-roofing-logo.png"
                alt="Raptor Roofing"
                width={305}
                height={242}
                className="h-10 w-auto"
              />
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-12 w-12 items-center justify-center rounded-md text-white hover:bg-primary-700"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex flex-col gap-2 px-6 py-8"
          >
            <Link
              href="/#services"
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400"
            >
              Services
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto px-6 pb-10 pt-6">
            <a
              href={siteConfig.phone.href}
              className="flex items-center justify-center gap-3 rounded-md bg-accent-600 px-6 py-4 font-display text-lg font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)]"
              aria-label={`Call ${siteConfig.name} at ${siteConfig.phone.display}`}
              onClick={() => setOpen(false)}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call Now · {siteConfig.phone.display}
            </a>
            <p className="mt-4 text-center font-body text-sm text-white/70">
              Licensed · Insured · {siteConfig.founding.yearsInBusiness} Years
              in Omaha
            </p>
          </div>
        </div>
      )}
    </>
  );
}
