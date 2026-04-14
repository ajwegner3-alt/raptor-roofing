import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/content/site";
import { MobileMenuButton } from "./MobileMenuButton";

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
          <div className="h-10 w-10 rounded bg-accent-600 flex items-center justify-center font-display text-white text-xl">
            R
          </div>
          <span className="font-display text-xl font-bold uppercase tracking-wide text-white lg:text-2xl">
            Raptor Roofing
          </span>
        </Link>

        {/* Right: Desktop nav + phone button (lg+) */}
        <div className="hidden lg:flex items-center gap-8">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 font-display text-sm font-medium uppercase tracking-wider text-white">
              <li>
                <Link
                  href="/#services"
                  className="hover:text-accent-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-accent-400 transition-colors"
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
