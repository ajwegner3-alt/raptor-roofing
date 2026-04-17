"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { serviceAreas } from "@/content/service-areas";

const serviceLinks = services.map((s) => ({
  label: s.shortTitle,
  href: `/services/${s.slug}`,
}));

const areaLinks = serviceAreas.map((a) => ({
  label: a.name,
  href: `/service-areas/${a.slug}`,
}));

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
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
        setServicesOpen(false);
        setAreasOpen(false);
        setTimeout(() => hamburgerRef.current?.focus(), 0);
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

  // closeAll: close menu and reset all accordion state
  // State resets live here rather than in a useEffect to avoid react-hooks/set-state-in-effect
  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
    setAreasOpen(false);
    // Return focus to hamburger button after menu closes
    // Use setTimeout to let React flush state before focusing
    setTimeout(() => hamburgerRef.current?.focus(), 0);
  };

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
          className="fixed inset-0 z-[100] flex flex-col bg-primary-900 overflow-y-auto"
          style={{ height: "100dvh" }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 h-16 shrink-0">
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
              onClick={closeAll}
              aria-label="Close navigation menu"
              className="flex h-12 w-12 items-center justify-center rounded-md text-white hover:bg-primary-700"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Nav items */}
          <nav
            aria-label="Mobile primary"
            className="flex flex-col px-6 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Services accordion */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                className="flex w-full min-h-[56px] items-center justify-between font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
              >
                Services
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {servicesOpen && (
                <ul className="flex flex-col pb-3 pl-4 gap-1">
                  {serviceLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAll}
                        className="flex min-h-[48px] items-center font-display text-lg font-medium uppercase tracking-wide text-white/80 hover:text-accent-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Service Areas accordion */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setAreasOpen((v) => !v)}
                aria-expanded={areasOpen}
                className="flex w-full min-h-[56px] items-center justify-between font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
              >
                Service Areas
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${areasOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {areasOpen && (
                <ul className="flex flex-col pb-3 pl-4 gap-1">
                  {areaLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAll}
                        className="flex min-h-[48px] items-center font-display text-lg font-medium uppercase tracking-wide text-white/80 hover:text-accent-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* About */}
            <div className="border-b border-white/10">
              <Link
                href="/about"
                onClick={closeAll}
                className="flex min-h-[56px] items-center font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400 transition-colors"
              >
                About
              </Link>
            </div>

            {/* Contact */}
            <div>
              <Link
                href="/contact"
                onClick={closeAll}
                className="flex min-h-[56px] items-center font-display text-2xl font-semibold uppercase tracking-wide text-white hover:text-accent-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* CTA */}
          <div className="mt-auto px-6 pb-10 pt-6 shrink-0">
            <a
              href={siteConfig.phone.href}
              className="flex items-center justify-center gap-3 rounded-md bg-accent-600 px-6 py-4 font-display text-lg font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)]"
              aria-label={`Call ${siteConfig.name} at ${siteConfig.phone.display}`}
              onClick={closeAll}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call Now · {siteConfig.phone.display}
            </a>
            <p className="mt-4 text-center font-body text-sm text-white/70">
              Licensed · Insured · Locally Owned in Omaha
            </p>
          </div>
        </div>
      )}
    </>
  );
}
