// NOTE: The business schema (HomeAndConstructionBusiness / "Local Business" type) is
// rendered globally by the Footer component on every marketing page — do NOT duplicate it here.
// See .planning/phases/05-about-contact/05-CONTEXT.md and 05-RESEARCH.md Pitfall 4.

import Link from "next/link";
import { Phone } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/content/site";
import { AboutHero } from "@/components/sections/AboutHero";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";

// ---------------------------------------------------------------------------
// Metadata
// Title is under 60 chars (absolute); description ~150 chars with keyword + CTA
// ---------------------------------------------------------------------------
export const metadata = buildMetadata({
  path: "/about",
  title: "About Raptor Roofing | Family-Owned, No Subs, Omaha NE",
  description:
    "Meet the family behind Raptor Roofing. Every crew member works for us — no subcontractors. Locally owned and operated in Omaha, NE. Call for a free estimate.",
  useAbsoluteTitle: true,
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AboutPage() {
  return (
    <>
      {/* BreadcrumbList JSON-LD only — business schema is owned by Footer globally */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Section 1: About Hero                                               */}
      {/* ------------------------------------------------------------------ */}
      <AboutHero />

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: Chronological story                                      */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="our-story-heading"
        className="bg-white py-20 lg:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2
            id="our-story-heading"
            className="font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl"
          >
            Our Story
          </h2>

          <div className="mt-8 space-y-6 font-body text-lg leading-relaxed text-neutral-700">
            <p>
              Founded by{" "}
              <span className="font-semibold text-primary-900">
                [PLACEHOLDER: founder name]
              </span>
              , Raptor Roofing is a small family operation with one guiding
              idea: treat every Omaha homeowner the same way you&rsquo;d treat
              your own family. No shortcuts. No strangers on the roof. No
              excuses.
            </p>

            <p>
              In the early years, the work came mainly through word of mouth
              from neighbors in{" "}
              <span className="font-semibold text-primary-900">
                [PLACEHOLDER: founding neighborhood/area]
              </span>
              . Referrals built the company one roof at a time. Every job was a
              chance to demonstrate something the industry too often forgets:
              that the crew showing up on Day 1 should be the same crew closing
              out the job on the final day. Accountability starts with
              familiarity, and familiarity starts with keeping work in-house.
            </p>

            <p>
              Today, Raptor Roofing serves homeowners and property managers
              across Omaha, Bellevue, Papillion, La Vista, Elkhorn, and the
              wider Sarpy County area. The company has grown, but the core
              hasn&rsquo;t changed: every roofer on your property is a Raptor
              Roofing employee, trained by us, accountable to us, and proud to
              put the name on their work.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: Every Crew Is Raptor — no-subcontractors explainer       */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="every-crew-heading"
        className="bg-primary-950 py-20 lg:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2
            id="every-crew-heading"
            className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl"
          >
            Every Crew Is Raptor
          </h2>
          <p className="mt-3 font-display text-sm font-semibold uppercase tracking-widest text-accent-400">
            No subcontractors. Ever.
          </p>

          <div className="mt-8 space-y-6 font-body text-lg leading-relaxed text-white/85">
            <p>
              When you hire Raptor Roofing, you hire Raptor Roofing — not a
              network of independent crews we found last week. Every person who
              sets foot on your property is a direct employee. We hired them,
              we trained them, we carry their workers&rsquo; comp and liability
              insurance, and we stand behind every shingle they nail down.
            </p>

            <p>
              This matters more than most homeowners realize. When a roofing
              company subcontracts your job, the name on the truck and the name
              on the insurance policy can be two different companies. If
              something goes wrong mid-project — a damage claim, a missed
              detail, a warranty dispute — you may find yourself chasing down a
              crew that was never directly employed by the contractor you hired.
              That&rsquo;s not a risk we&rsquo;re willing to put our name next
              to.
            </p>

            <p>
              Keeping work in-house also means real quality control. Our
              foremen know every crew member personally. Our project managers
              have worked alongside them for years. When we say a job meets our
              standard, we mean it in a way that only makes sense if
              you&rsquo;re the ones who&rsquo;ve done the work from start to
              finish.
            </p>

            <p>
              The same crew that starts your roof on Monday is the same crew
              that finishes it on Friday — or sooner. No handoffs, no
              surprises, and one point of contact for everything.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 4: Storm-awareness education for homeowners                   */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="storm-tips-heading"
        className="bg-neutral-50 py-20 lg:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2
            id="storm-tips-heading"
            className="font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl"
          >
            What to Watch For After a Storm
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-neutral-600">
            After a major hailstorm or high-wind event, Omaha homeowners often
            receive a sudden wave of visits and calls from roofing companies
            they&rsquo;ve never heard of. Some are legitimate. Some are not.
            Here are five things to look for before you sign anything.
          </p>

          <div className="mt-8 space-y-6 font-body text-lg leading-relaxed text-neutral-700">
            <p>
              <strong className="font-semibold text-primary-900">
                Ask for a local address.
              </strong>{" "}
              A roofing company doing business in Nebraska should have a
              physical address in Nebraska — not a P.O. box in another state or
              a cell phone number with a 1-800 prefix. If they can&rsquo;t tell
              you where their office is, that&rsquo;s worth noting.
            </p>

            <p>
              <strong className="font-semibold text-primary-900">
                Verify the contractor license number.
              </strong>{" "}
              Nebraska requires roofing contractors to hold a valid state
              license. Any legitimate roofing company should be able to produce
              their license number on request. You can verify it directly at the
              Nebraska Department of Labor website. If they deflect or change
              the subject, consider that a signal.
            </p>

            <p>
              <strong className="font-semibold text-primary-900">
                Never pay the full amount up front.
              </strong>{" "}
              A standard roofing contract may ask for a deposit at the start of
              the job — typically tied to a materials order. Full payment before
              a single shingle is removed is not standard practice. If a
              contractor insists on full payment before work begins, get a
              second opinion.
            </p>

            <p>
              <strong className="font-semibold text-primary-900">
                Take your time with the contract.
              </strong>{" "}
              High-pressure sales tactics — &ldquo;this price is only good
              today,&rdquo; &ldquo;we have a crew in your neighborhood right
              now&rdquo; — are a pattern worth recognizing. A roof is a
              significant investment. Any contractor who won&rsquo;t give you
              24 hours to review a contract before signing probably isn&rsquo;t
              planning to be around when you need warranty service.
            </p>

            <p>
              <strong className="font-semibold text-primary-900">
                Check if they&rsquo;ll be around after the job.
              </strong>{" "}
              Post-storm contractors who follow the damage — working a region
              for a season and moving on — may be harder to reach when a
              warranty issue surfaces two years later. Before you sign, ask how
              long the company has operated in your area and how you&rsquo;d
              reach them for a callback.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 5: TrustStrip                                               */}
      {/* ------------------------------------------------------------------ */}
      <TrustStrip />

      {/* ------------------------------------------------------------------ */}
      {/* Section 6: Testimonials                                             */}
      {/* ------------------------------------------------------------------ */}
      <TestimonialCarousel />

      {/* ------------------------------------------------------------------ */}
      {/* Section 7: End CTA block — links to /contact and tel:              */}
      {/* NO embedded form — About page points to /contact for lead capture   */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-labelledby="about-end-cta-heading"
        className="bg-primary-900 py-20 lg:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2
            id="about-end-cta-heading"
            className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl"
          >
            Talk to the Crew Behind the Name
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body text-lg text-white/80">
            Ready to get a straight answer on your roof? Call us directly or
            fill out our quick estimate request — we respond same business day.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary: tel: call now */}
            <a
              href={siteConfig.phone.href}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md bg-accent-600 px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-accent-700 sm:w-auto"
              aria-label={`Call Raptor Roofing at ${siteConfig.phone.display}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {siteConfig.phone.display}
            </a>

            {/* Secondary: Link to /contact page (NOT an embedded form) */}
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-md border border-white/30 px-8 py-4 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Get a Free Estimate
            </Link>
          </div>

          {/* Micro-trust beneath CTAs */}
          <p className="mt-6 font-body text-sm text-white/50">
            {siteConfig.license.displayText} &middot; Locally Owned in Omaha
          </p>
        </div>
      </section>
    </>
  );
}
