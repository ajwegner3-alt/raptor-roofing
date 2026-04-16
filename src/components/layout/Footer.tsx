import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Share2, Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { getPrimaryServiceAreas } from "@/content/service-areas";
import { JsonLd, localBusinessSchema } from "@/lib/schema";

export function Footer() {
  const areas = getPrimaryServiceAreas();
  return (
    <footer className="bg-primary-900 text-white">
      <JsonLd data={localBusinessSchema()} />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: NAP + hours */}
          <div>
            <h2 className="sr-only">{siteConfig.name}</h2>
            <span className="inline-flex items-center justify-center rounded-md bg-background px-2 py-1">
              <Image
                src="/images/raptor-roofing-logo.png"
                alt={`${siteConfig.name} — Omaha roofing contractor`}
                width={305}
                height={242}
                className="h-12 w-auto"
              />
            </span>
            <address className="mt-4 not-italic font-body text-sm text-white/80 space-y-2">
              <p className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.state}{" "}
                  {siteConfig.address.zip}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href={siteConfig.phone.href}
                  className="hover:text-accent-400 min-h-12 inline-flex items-center"
                  aria-label={`Call ${siteConfig.phone.display}`}
                >
                  {siteConfig.phone.display}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex min-h-[48px] items-center hover:text-accent-400 transition-colors"
                >
                  {siteConfig.email}
                </a>
              </p>
            </address>
            <div className="mt-6">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-white/90">
                <Clock className="h-4 w-4" aria-hidden="true" /> Hours
              </h3>
              <ul className="mt-2 space-y-1 font-body text-sm text-white/70">
                {siteConfig.hours.map((h) => (
                  <li key={h.day}>
                    <span className="inline-block w-20">{h.day}</span>
                    <span>
                      {h.closed || h.open === ""
                        ? "Closed"
                        : `${h.open}–${h.close}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Services
            </h2>
            <ul className="mt-4 font-body text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex min-h-[48px] items-center py-1 text-white/80 transition-colors hover:text-accent-400"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Service areas */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Service Areas
            </h2>
            <ul className="mt-4 font-body text-sm">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/service-areas/${a.slug}`}
                    className="flex min-h-[48px] items-center py-1 text-white/80 transition-colors hover:text-accent-400"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal + social */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Trust &amp; Legal
            </h2>
            <ul className="mt-4 font-body text-sm text-white/80">
              <li className="flex min-h-[48px] items-center py-1">NE License #{siteConfig.license.number}</li>
              <li className="flex min-h-[48px] items-center py-1">Bonded &amp; Insured</li>
              <li className="flex min-h-[48px] items-center py-1">BBB Accredited</li>
              <li>
                <Link href="/privacy" className="flex min-h-[48px] items-center py-1 hover:text-accent-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90">
                Follow
              </h3>
              <ul className="mt-3 flex gap-3">
                {siteConfig.socialLinks.facebook && (
                  <li>
                    <a
                      href={siteConfig.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-700 hover:bg-accent-600"
                    >
                      <ExternalLink className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                )}
                {siteConfig.socialLinks.instagram && (
                  <li>
                    <a
                      href={siteConfig.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-700 hover:bg-accent-600"
                    >
                      <Share2 className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 font-body text-xs text-white/60">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved. Locally owned and operated in Omaha, Nebraska.
          </p>
        </div>
      </div>
    </footer>
  );
}
