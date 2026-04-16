import Link from "next/link";
import Image from "next/image";
import { Phone, ChevronDown } from "lucide-react";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { serviceAreas } from "@/content/service-areas";
import { MobileMenuButton } from "./MobileMenuButton";

const serviceLinks = services.map((s) => ({
  label: s.shortTitle,
  href: `/services/${s.slug}`,
}));

const areaLinks = serviceAreas.map((a) => ({
  label: a.name,
  href: `/service-areas/${a.slug}`,
}));

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary-600 shadow-[var(--shadow-nav)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20 lg:px-8">
        {/* Left: Logo + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Raptor Roofing home"
        >
          <span className="inline-flex items-center justify-center rounded-md bg-background px-2 py-1 shadow-[var(--shadow-cta)]">
            <Image
              src="/images/raptor-roofing-logo.png"
              alt="Raptor Roofing"
              width={305}
              height={242}
              priority
              className="h-10 w-auto lg:h-12"
            />
          </span>
          <span className="font-display text-lg font-bold uppercase tracking-wide text-white sm:text-xl lg:text-2xl">
            Raptor Roofing
          </span>
        </Link>

        {/* Right: Desktop nav + phone button (lg+) */}
        <div className="hidden lg:flex items-center gap-8">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 font-display text-sm font-medium uppercase tracking-wider text-white">

              {/* Services dropdown */}
              <li className="group/services relative">
                <button
                  type="button"
                  className="flex min-h-[48px] items-center gap-1 px-2 hover:text-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
                  aria-haspopup="true"
                >
                  Services
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200 group-hover/services:rotate-180"
                    aria-hidden="true"
                  />
                </button>
                {/* Dropdown panel — visible on hover or focus-within */}
                <ul
                  className="absolute left-0 top-full z-10 hidden min-w-[180px] flex-col rounded-b-md bg-primary-800 py-1 shadow-lg group-hover/services:flex group-focus-within/services:flex"
                  role="menu"
                >
                  {serviceLinks.map((link) => (
                    <li key={link.href} role="none">
                      <Link
                        href={link.href}
                        role="menuitem"
                        className="flex min-h-[48px] items-center px-4 py-2 text-sm text-white hover:bg-primary-700 hover:text-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Service Areas dropdown */}
              <li className="group/areas relative">
                <button
                  type="button"
                  className="flex min-h-[48px] items-center gap-1 px-2 hover:text-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
                  aria-haspopup="true"
                >
                  Service Areas
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200 group-hover/areas:rotate-180"
                    aria-hidden="true"
                  />
                </button>
                {/* Dropdown panel */}
                <ul
                  className="absolute left-0 top-full z-10 hidden min-w-[180px] flex-col rounded-b-md bg-primary-800 py-1 shadow-lg group-hover/areas:flex group-focus-within/areas:flex"
                  role="menu"
                >
                  {areaLinks.map((link) => (
                    <li key={link.href} role="none">
                      <Link
                        href={link.href}
                        role="menuitem"
                        className="flex min-h-[48px] items-center px-4 py-2 text-sm text-white hover:bg-primary-700 hover:text-accent-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <Link
                  href="/about"
                  className="flex min-h-[48px] items-center px-2 hover:text-accent-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex min-h-[48px] items-center px-2 hover:text-accent-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <a
            href={siteConfig.phone.href}
            className="inline-flex items-center gap-2 rounded-md bg-accent-600 px-5 py-3 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
            aria-label={`Call ${siteConfig.name} at ${siteConfig.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {siteConfig.phone.display}
          </a>
        </div>

        {/* Right: Mobile — phone icon + hamburger (<lg) */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={siteConfig.phone.href}
            className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-600 text-white"
            aria-label={`Call ${siteConfig.phone.display}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
          <MobileMenuButton />
        </div>
      </div>
    </header>
  );
}
