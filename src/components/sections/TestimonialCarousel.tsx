"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials as allTestimonials } from "@/content/testimonials";
import type { Testimonial } from "@/content/testimonials";

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
}

export function TestimonialCarousel({ testimonials: propTestimonials }: TestimonialCarouselProps = {}) {
  const testimonials = propTestimonials ?? allTestimonials;
  const [active, setActive] = useState(0);
  const total = testimonials.length;
  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  return (
    <section aria-label="Customer testimonials" className="bg-neutral-50 py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
          What Our Customers Say
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-lg text-neutral-600">
          Every testimonial below is flagged as placeholder content. Real Raptor customer reviews replace these before public launch.
        </p>

        {/* Card stack — absolute positioning + opacity crossfade prevents height jitter */}
        <div className="relative mt-12 min-h-[340px]">
          {testimonials.map((t, i) => (
            <article
              key={t.id}
              role="group"
              aria-label={`Testimonial from ${t.name}, ${t.city}`}
              aria-hidden={i !== active}
              className={`absolute inset-0 flex flex-col rounded-lg border border-neutral-200 bg-surface p-8 shadow-[var(--shadow-card)] transition-opacity duration-300 ${
                i === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {/* FTC placeholder banner — required on every card, non-negotiable */}
              {t.isPlaceholder && (
                <span className="placeholder-banner self-start" role="status">
                  [PLACEHOLDER] Sample testimonial — will be replaced with real review before launch
                </span>
              )}

              {/* Star rating */}
              <div
                className="mt-4 flex items-center gap-1"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-5 w-5 fill-accent-500 text-accent-500"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 font-body text-lg italic leading-relaxed text-neutral-800">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <footer className="mt-6 font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
                &mdash; {t.name}, {t.city}
              </footer>
            </article>
          ))}
        </div>

        {/* Navigation controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-surface text-primary-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-0" role="tablist" aria-label="Select testimonial">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1} of ${total}`}
                aria-selected={i === active}
                className="flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <span
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i === active
                      ? "bg-accent-600"
                      : "bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-surface text-primary-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
