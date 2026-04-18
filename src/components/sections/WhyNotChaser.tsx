import { X, Check, XCircle, CheckCircle } from "lucide-react";

const comparison = [
  {
    chaser: "Based out of state — here this week, gone next",
    raptor: "Omaha-owned and operated — this is our community, our home",
  },
  {
    chaser: "Work subcontracted to day labor — quality varies job to job",
    raptor: "In-house crew only — every worker is a Raptor employee",
  },
  {
    chaser: "Door-knocking pressure: \"Sign today before the adjuster arrives\"",
    raptor: "No pressure, no deposits — we wait for your insurance estimate",
  },
  {
    chaser: "Disappear after collecting the insurance check",
    raptor: "Local warranty service — call us in 2030 and we'll still answer",
  },
  {
    chaser: "Unfamiliar with Nebraska code and local adjuster patterns",
    raptor: "Licensed in Nebraska — know every local code and carrier process",
  },
] as const;

export function WhyNotChaser() {
  return (
    <section
      aria-labelledby="family-vs-chaser-heading"
      className="bg-neutral-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2
          id="family-vs-chaser-heading"
          className="font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl"
        >
          Family-Owned Businesses Care More Than Storm Chasers
        </h2>
        <p className="mt-4 max-w-2xl font-body text-lg text-neutral-600">
          After every major Omaha hailstorm, out-of-state crews flood the
          neighborhoods. Here&apos;s how Raptor is different — and why it matters for
          your roof and your insurance claim.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Left column — Storm Chaser Crews */}
          <div className="rounded-lg border-2 border-accent-200 bg-accent-50 p-8">
            <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-tight text-accent-800">
              <XCircle className="h-6 w-6 text-accent-600" aria-hidden="true" />
              Storm Chaser Crews
            </h3>
            <ul className="mt-6 space-y-4">
              {comparison.map((pair, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600"
                    aria-hidden="true"
                  />
                  <span className="font-body text-base text-neutral-800">
                    {pair.chaser}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — Raptor Roofing */}
          <div className="rounded-lg border-2 border-primary-600 bg-primary-50 p-8">
            <h3 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-tight text-primary-700">
              <CheckCircle
                className="h-6 w-6 text-primary-600"
                aria-hidden="true"
              />
              Raptor Roofing
            </h3>
            <ul className="mt-6 space-y-4">
              {comparison.map((pair, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                  <span className="font-body text-base text-neutral-800">
                    {pair.raptor}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
