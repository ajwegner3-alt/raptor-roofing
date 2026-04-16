import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { serviceAreas, getServiceAreaBySlug } from "@/content/service-areas";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceAreaBySlug(slug);
  if (!area) return {};
  return buildMetadata({
    title: `Roofing & Exterior Services in ${area.name}, NE | Raptor Roofing`,
    description: `Raptor Roofing serves ${area.name}, ${area.county} County with roof replacement, siding, gutters, and emergency tarping. Family-owned, no subcontractors. Call ${siteConfig.phone.display}.`,
    path: `/service-areas/${area.slug}`,
    useAbsoluteTitle: true,
  });
}

export default async function ServiceAreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getServiceAreaBySlug(slug);
  if (!area) notFound();

  const neighborAreas = serviceAreas
    .filter((a) => a.slug !== area.slug)
    .slice(0, 4);

  // Split description into paragraphs
  const descriptionParagraphs = area.description
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Service Areas", href: "/service-areas/" + area.slug },
          { name: area.name, href: `/service-areas/${area.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="bg-primary-900 text-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Service Area
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Roofing &amp; Exterior Services in {area.name}, Nebraska
          </h1>
          <p className="text-lg text-neutral-300 max-w-2xl mb-6">
            Raptor Roofing proudly serves {area.name} and surrounding {area.county} County
            communities. Every crew on your property works for us — no subcontractors,
            no out-of-state crews passing through.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={siteConfig.phone.href}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors"
            >
              Call {siteConfig.phone.display}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 border-2 border-white/30 hover:border-white text-white font-semibold rounded-lg transition-colors"
            >
              Get a Free Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* Why Raptor in [City] */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
            Why {area.name} Homeowners Choose Raptor Roofing
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Local Crews, Not Subcontractors</h3>
              <p className="text-neutral-600 text-sm">
                Every crew member on your {area.name} property is a Raptor employee —
                trained, insured, and accountable to us. We never subcontract your roof.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">We Know {area.county} County</h3>
              <p className="text-neutral-600 text-sm">
                From {area.county} County permit requirements to the specific wind and hail
                patterns in {area.name}, we build for what Nebraska weather actually does.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">Family-Owned Since Day One</h3>
              <p className="text-neutral-600 text-sm">
                We&apos;re not a franchise or a storm-chasing outfit passing through.
                Our name is on the truck and the warranty. We live here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Context — Description */}
      <section className="py-12 sm:py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
            Roofing in {area.name}: What We See Every Day
          </h2>
          <div className="max-w-3xl space-y-5">
            {descriptionParagraphs.map((paragraph, i) => (
              <p key={i} className="text-neutral-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          {area.funFact && (
            <div className="mt-8 p-5 rounded-xl bg-primary-900 text-white max-w-3xl">
              <p className="text-sm font-semibold text-accent-400 uppercase tracking-wider mb-1">
                Local Context
              </p>
              <p className="text-neutral-200 text-sm leading-relaxed">{area.funFact}</p>
            </div>
          )}
        </div>
      </section>

      {/* Housing Context Callout */}
      <section className="py-8 bg-white border-y border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mt-0.5">
              <svg
                className="w-5 h-5 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 mb-1">
                Housing Stock in {area.name}
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed">{area.housingContext}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Roofing Challenges */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Common Roofing Challenges in {area.name}
          </h2>
          <p className="text-neutral-500 mb-8 max-w-2xl">
            Every neighborhood has its own set of roofing pressures. Here&apos;s what we encounter
            most often on {area.name} properties.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {area.localChallenges.map((challenge, i) => (
              <div
                key={i}
                className="flex gap-3 p-5 rounded-xl border border-neutral-200 bg-neutral-50"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-accent-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-neutral-700 text-sm leading-relaxed">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods We Serve */}
      <section className="py-12 sm:py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Neighborhoods We Serve in {area.name}
          </h2>
          <p className="text-neutral-500 mb-8">
            Our crews work throughout {area.name} — from established areas to newer
            subdivisions and everything in between.
          </p>
          <div className="flex flex-wrap gap-3">
            {area.neighborhoods.map((neighborhood) => (
              <span
                key={neighborhood}
                className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-neutral-700 text-sm font-medium shadow-sm"
              >
                {neighborhood}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Available */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8">
            Services We Offer in {area.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="flex items-center gap-4 p-5 rounded-xl bg-white border border-neutral-200 hover:border-accent-500 hover:shadow-md transition-all min-h-[48px] group"
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary-900 text-accent-400 flex items-center justify-center font-bold text-lg">
                  {svc.shortTitle.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-accent-600 transition-colors">
                    {svc.shortTitle}
                  </p>
                  <p className="text-sm text-neutral-500 line-clamp-1">
                    {svc.metadata.description.split(".")[0]}.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ZIP Codes */}
      {area.zipCodes.length > 0 && (
        <section className="py-12 sm:py-16 bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              ZIP Codes We Serve in {area.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {area.zipCodes.map((zip) => (
                <span
                  key={zip}
                  className="px-3 py-1 text-sm rounded-full bg-primary-50 text-primary-800 border border-primary-200"
                >
                  {zip}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Areas */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Also Serving Nearby Communities
          </h2>
          <div className="flex flex-wrap gap-3">
            {neighborAreas.map((neighbor) => (
              <Link
                key={neighbor.slug}
                href={`/service-areas/${neighbor.slug}`}
                className="px-4 py-2 rounded-full bg-white border border-neutral-200 hover:border-accent-500 text-neutral-700 hover:text-accent-600 text-sm font-medium transition-colors min-h-[48px] flex items-center"
              >
                {neighbor.name}, NE
              </Link>
            ))}
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            Plus surrounding Douglas and Sarpy County communities.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Talk to a Local Roofer in {area.name}?
          </h2>
          <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
            Call us or request a free estimate. We&apos;ll have a crew member — not a
            call center — get back to you within 2 hours during business hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={siteConfig.phone.href}
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Call {siteConfig.phone.display}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 border-2 border-white/30 hover:border-white text-white font-semibold rounded-lg transition-colors"
            >
              Request a Free Estimate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
