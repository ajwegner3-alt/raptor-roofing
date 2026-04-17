import Image from "next/image"
import { siteConfig } from "@/content/site"

function StatItem({
  value,
  label,
  isLast = false,
}: {
  value: React.ReactNode
  label: string
  isLast?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center text-center px-4 py-2 ${
        !isLast
          ? "border-b-2 border-primary-100 pb-5 lg:border-b-0 lg:border-r-2 lg:pb-2"
          : ""
      }`}
    >
      <div className="mb-1">{value}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
        {label}
      </p>
    </div>
  )
}

export function TrustStrip() {
  return (
    <section
      aria-label="Trust and credentials"
      className="border-t border-black/5 bg-neutral-50 shadow-sm"
    >
      <div className="mx-auto max-w-5xl px-4 py-5 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <StatItem
            value={
              <div className="flex flex-col items-center gap-1">
                <span
                  className="flex items-center gap-0.5"
                  aria-label={`${siteConfig.reviews.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-accent-500 text-accent-500"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="text-lg font-bold leading-none text-primary-900 lg:text-xl">
                  {siteConfig.reviews.count} Reviews
                </span>
              </div>
            }
            label="Google Rating"
          />

          <StatItem
            value={
              <span className="text-2xl font-bold leading-none text-primary-900 lg:text-3xl">
                NE Licensed
              </span>
            }
            label="Bonded & Insured"
          />

          <StatItem
            value={
              <span className="text-2xl font-bold leading-none text-primary-900 lg:text-3xl">
                Local
              </span>
            }
            label="Omaha Owned"
          />

          <StatItem
            value={
              <Image
                src="/images/bbb-accredited.png"
                alt="BBB Accredited Business"
                width={140}
                height={56}
                className="h-10 w-auto object-contain lg:h-12"
              />
            }
            label="A- Rating"
            isLast={true}
          />
        </div>
      </div>
    </section>
  )
}
