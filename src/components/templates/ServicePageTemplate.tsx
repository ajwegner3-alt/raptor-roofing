import { Check } from "lucide-react";
import type { Service } from "@/content/services";
import type { FAQ } from "@/content/faqs";
import type { Testimonial } from "@/content/testimonials";
import { ServiceBreadcrumb } from "@/components/sections/ServiceBreadcrumb";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServiceCTABand } from "@/components/sections/ServiceCTABand";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { RelatedServicesBlock } from "@/components/sections/RelatedServicesBlock";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { LeadForm } from "@/components/sections/LeadForm";

interface ServicePageTemplateProps {
  service: Service;
  faqs: FAQ[];
  testimonials: Testimonial[];
  relatedServices: Service[];
}

export function ServicePageTemplate({
  service,
  faqs,
  testimonials,
  relatedServices,
}: ServicePageTemplateProps) {
  return (
    <>
      {/* Section 1: Breadcrumbs */}
      <ServiceBreadcrumb
        serviceShortTitle={service.shortTitle}
        serviceSlug={service.slug}
      />

      {/* Section 2: Service Hero */}
      <ServiceHero service={service} />

      {/* Emergency-only: Insurance Documentation block */}
      {service.isEmergency && (
        <section
          aria-label="Insurance documentation"
          className="bg-surface py-20 lg:py-24"
        >
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent-600">
              Before we tarp
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
              We document damage for your claim before we tarp.
            </h2>
            <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-neutral-700">
              <p>
                When Raptor arrives at a storm-damaged property, the first thing we
                do is photograph and document every area of visible damage — before
                a single tarp goes up. We timestamp each photo and record the
                condition of the roof, decking, and surrounding structure in detail.
              </p>
              <p>
                This documentation package is yours to keep and share with your
                insurance adjuster. Having a thorough, time-stamped record from
                the night of the event is one of the most valuable assets you can
                bring to a claim — it eliminates disputes about pre-existing
                conditions and makes the adjuster&apos;s job straightforward.
              </p>
              <p>
                We coordinate with insurance professionals routinely and understand
                what documentation carriers require. Our approach puts you in the
                strongest possible position when your adjuster reviews the file —
                without any pressure, promises about outcomes, or involvement in
                the claims negotiation itself.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Problem checklist */}
      <section
        aria-label="Signs you may need service"
        className="bg-neutral-50 py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-accent-600">
                Know the signs
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
                Is your {service.shortTitle.toLowerCase()} showing these signs?
              </h2>
              <p className="mt-4 font-body text-lg leading-relaxed text-neutral-700">
                {service.problemCopy}
              </p>
            </div>

            <div>
              <ul className="space-y-3" role="list">
                {service.problemChecklist.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-surface px-4 py-3 shadow-sm"
                  >
                    <Check
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600"
                      aria-hidden="true"
                    />
                    <span className="font-body text-base text-neutral-800">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Process steps */}
      <section
        aria-label="Our process"
        className="bg-surface py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center font-display text-sm font-semibold uppercase tracking-widest text-accent-600">
            How it works
          </p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
            How we do it
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center font-body text-lg text-neutral-600">
            Every Raptor job follows the same disciplined process — from first call
            to final walkthrough.
          </p>

          <div
            className={`mt-12 grid grid-cols-1 gap-8 ${
              service.processSteps.length === 3
                ? "lg:grid-cols-3"
                : "lg:grid-cols-4"
            }`}
          >
            {service.processSteps.map((step) => (
              <div key={step.step} className="relative flex flex-col">
                {/* Step number */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-600 font-display text-lg font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-primary-900">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-base leading-relaxed text-neutral-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Mid-page CTA band */}
      <ServiceCTABand />

      {/* Section 6: TrustStrip */}
      <TrustStrip />

      {/* Section 7: Before/after gallery */}
      <BeforeAfterGallery slotCount={3} />

      {/* Section 8: Testimonials — skip section if no testimonials provided */}
      {testimonials.length > 0 ? (
        <TestimonialCarousel testimonials={testimonials} />
      ) : null}

      {/* Section 9: FAQ accordion */}
      <FaqAccordion faqs={faqs} />

      {/* Section 10: Related services */}
      <RelatedServicesBlock relatedServices={relatedServices} />

      {/* Section 11: Lead form */}
      <section
        aria-label="Get a free estimate"
        className="bg-neutral-50 py-20 lg:py-24"
      >
        <div className="mx-auto max-w-xl px-4 lg:px-8">
          <LeadForm defaultService={service.slug} />
        </div>
      </section>
    </>
  );
}
