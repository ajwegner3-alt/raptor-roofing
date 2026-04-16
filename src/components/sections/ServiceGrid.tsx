import Link from "next/link";
import { Home, Layers, Droplets, AlertTriangle, ArrowRight } from "lucide-react";
import { services } from "@/content/services";

const iconMap = {
  Home,
  Layers,
  Droplets,
  AlertTriangle,
} as const;

type IconKey = keyof typeof iconMap;

export function ServiceGrid() {
  return (
    <section
      id="services"
      className="scroll-mt-16 lg:scroll-mt-20 bg-background py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
          Services We Install and Repair
        </h2>
        <p className="mt-4 max-w-2xl font-body text-lg text-neutral-600">
          Roofing, siding, gutters, and 24/7 emergency tarping — all handled by
          the same in-house Raptor crew from estimate to final walkthrough.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = iconMap[service.iconName as IconKey];
            return (
              <article
                key={service.slug}
                className="group relative flex flex-col rounded-lg border border-neutral-200 bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-600 text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight text-primary-900">
                  {service.shortTitle}
                </h3>
                <p className="mt-3 flex-1 font-body text-sm text-neutral-700">
                  {service.description.length > 140
                    ? `${service.description.slice(0, 140).trimEnd()}…`
                    : service.description}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex min-h-[48px] items-center gap-1 font-display text-sm font-semibold uppercase tracking-wider text-accent-600 hover:text-accent-700"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
