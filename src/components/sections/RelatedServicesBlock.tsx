import Link from "next/link";
import type { Service } from "@/content/services";

interface RelatedServicesBlockProps {
  relatedServices: Service[];
}

export function RelatedServicesBlock({ relatedServices }: RelatedServicesBlockProps) {
  if (relatedServices.length === 0) return null;

  return (
    <section
      aria-label="Related services"
      className="bg-neutral-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="text-center font-display text-sm font-semibold uppercase tracking-widest text-accent-600">
          While we&apos;re there
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
          Related Services
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-lg text-neutral-600">
          One Raptor crew covers roofing, siding, gutters, and emergency response —
          no subcontractor handoffs, one warranty.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedServices.map((related) => (
            <Link
              key={related.slug}
              href={`/services/${related.slug}`}
              className="group flex flex-col rounded-lg border border-neutral-200 bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-cta)]"
            >
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-primary-900 group-hover:text-accent-600 transition-colors">
                {related.shortTitle}
              </h3>
              <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-neutral-600">
                {related.subheadline}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold uppercase tracking-wide text-accent-600">
                Learn more
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
