import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/content/faqs";

interface FaqAccordionProps {
  faqs: FAQ[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  return (
    <section
      aria-label="Frequently Asked Questions"
      className="bg-background py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-lg text-neutral-600">
          Straight answers from a family-owned Omaha roofer.
        </p>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-lg border border-neutral-200 bg-surface p-6 shadow-[var(--shadow-card)] open:border-primary-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-primary-900">
                <span>{faq.question}</span>
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 text-primary-600 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-4 font-body text-base leading-relaxed text-neutral-700">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
