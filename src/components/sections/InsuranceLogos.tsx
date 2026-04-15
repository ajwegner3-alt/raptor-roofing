const carriers = [
  "State Farm",
  "Allstate",
  "American Family",
  "Farmers",
  "Liberty Mutual",
] as const;

export function InsuranceLogos() {
  return (
    <section
      aria-label="Insurance carriers we work with"
      className="bg-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary-900 sm:text-3xl">
          Works with every major insurance carrier
        </h2>
        <p className="mt-3 font-body text-base text-neutral-600">
          We document and coordinate with all major homeowner insurance providers in Nebraska.
        </p>

        {/* Carrier logo row — grayscale inline SVG placeholder rects */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 grayscale opacity-80">
          {carriers.map((name) => (
            <div
              key={name}
              role="img"
              aria-label={`${name} — logo placeholder`}
              className="flex h-16 w-40 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100"
            >
              <svg
                viewBox="0 0 160 64"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
                aria-hidden="true"
              >
                <rect x="0" y="0" width="160" height="64" fill="#e5e7eb" rx="6" />
                <text
                  x="80"
                  y="38"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize="13"
                  fontWeight="700"
                  fill="#4b5563"
                >
                  {name}
                </text>
              </svg>
            </div>
          ))}
        </div>

        {/* Placeholder disclosure — visible to any visitor reading the live site */}
        <p className="mt-6 font-display text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <span className="placeholder-banner">
            [PLACEHOLDER] Carrier logos are stand-ins &mdash; real brand assets added before launch
          </span>
        </p>
      </div>
    </section>
  );
}
