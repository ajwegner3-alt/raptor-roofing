import Link from "next/link";
import Image from "next/image";
import { Home, Layers, Droplets, AlertTriangle, ArrowRight } from "lucide-react";
import { services } from "@/content/services";

const iconMap = {
  Home,
  Layers,
  Droplets,
  AlertTriangle,
} as const;

const serviceImageMap: Record<string, string> = {
  roofing:
    "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=400&h=250&fit=crop",
  siding:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
  gutters:
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop",
  "emergency-tarping":
    "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&h=250&fit=crop",
};

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
                className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
              >
                {/* Service image */}
                {serviceImageMap[service.slug] && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={serviceImageMap[service.slug]}
                      alt={service.shortTitle}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
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
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
