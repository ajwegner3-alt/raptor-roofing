interface BeforeAfterGalleryProps {
  slotCount?: number; // default 3, valid range 2-4
}

export function BeforeAfterGallery({ slotCount = 3 }: BeforeAfterGalleryProps) {
  const count = Math.min(Math.max(slotCount, 2), 4);
  const slots = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <section
      aria-label="Before and after project gallery"
      className="bg-neutral-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="text-center font-display text-sm font-semibold uppercase tracking-widest text-accent-600">
          Our Work
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
          Before &amp; After
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center font-body text-lg text-neutral-600">
          Real Omaha projects — photos updated when real client work is approved for display.
        </p>

        <div
          className={`mt-12 grid gap-6 ${
            count === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : count === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {slots.map((n) => (
            <figure key={n} className="overflow-hidden rounded-lg border border-neutral-200 bg-surface shadow-[var(--shadow-card)]">
              {/* Placeholder image area — 4:3 aspect ratio */}
              <div
                className="relative w-full bg-neutral-200"
                style={{ paddingBottom: "75%" }}
              >
                {/* PLACEHOLDER banner */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center bg-amber-100 border-b border-amber-300 px-3 py-1.5">
                  <span
                    role="status"
                    className="font-display text-xs font-bold uppercase tracking-wide text-amber-900"
                  >
                    [PLACEHOLDER] — Real project photo coming
                  </span>
                </div>

                {/* Split before / after label indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-0 overflow-hidden rounded border border-neutral-300">
                    <span className="bg-neutral-300 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-neutral-700">
                      Before
                    </span>
                    <span className="bg-neutral-400 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-neutral-800">
                      After
                    </span>
                  </div>
                </div>
              </div>

              <figcaption className="p-4">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
                  Omaha Project {n}
                </p>
                <p className="mt-1 font-body text-xs text-neutral-500">
                  Before and after — photo pending client approval
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
