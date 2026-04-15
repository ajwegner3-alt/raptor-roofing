export function FinancingCallout() {
  return (
    <section
      aria-label="Financing available"
      className="bg-warm-50 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary-900 sm:text-4xl">
          Financing Available
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-neutral-700">
          We partner with trusted home improvement lenders so your roof replacement fits your budget, not your savings account.
        </p>
        <p className="mt-8 font-display text-2xl font-bold uppercase tracking-tight text-primary-900 sm:text-3xl">
          As low as{" "}
          <span className="placeholder-banner">$[PLACEHOLDER]/mo</span>
        </p>
        <p className="mt-4 font-body text-sm text-neutral-600">
          Final terms and monthly payment depend on credit approval and project scope. Ask during your free estimate.
        </p>
      </div>
    </section>
  );
}
