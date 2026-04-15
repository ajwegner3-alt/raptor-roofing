import { FileSearch, Camera, Handshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Inspect",
    description:
      "We walk your roof at no cost and photograph every sign of storm damage — shingles, flashing, vents, gutters, and siding.",
    Icon: FileSearch,
  },
  {
    number: 2,
    title: "Document",
    description:
      "We itemize every damaged area in the format your insurance carrier requires, so nothing gets missed during the adjuster visit.",
    Icon: Camera,
  },
  {
    number: 3,
    title: "Coordinate",
    description:
      "We meet your adjuster on-site and handle the back-and-forth directly — you never have to relay technical messages between contractor and carrier.",
    Icon: Handshake,
  },
];

export function Insurance3Step() {
  return (
    <section
      aria-labelledby="insurance-3step-heading"
      className="bg-background py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2
          id="insurance-3step-heading"
          className="font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl"
        >
          How We Handle Your Insurance Claim
        </h2>
        <p className="mt-4 max-w-2xl font-body text-lg text-neutral-600">
          Three steps. One in-house crew. No scheduling gaps, no
          contractor-adjuster finger-pointing.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const { Icon } = step;
            return (
              <article
                key={step.number}
                className="relative rounded-lg border border-neutral-200 bg-surface p-8 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-600 font-display text-2xl font-bold text-white">
                    {step.number}
                  </span>
                  <Icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight text-primary-900">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-base text-neutral-700">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
