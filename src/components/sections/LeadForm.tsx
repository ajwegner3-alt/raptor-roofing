"use client";

import { useState, type FormEvent } from "react";
import { Phone } from "lucide-react";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

type Status = "idle" | "success";
type FieldErrors = Partial<Record<"name" | "phone" | "service" | "zip", string>>;

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Please enter a valid 10-digit phone number.";
    if (!service) next.service = "Please choose a service.";
    if (!/^\d{5}$/.test(zip)) next.zip = "Please enter a 5-digit ZIP code.";
    return next;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    // PHASE 5 TODO: replace with fetch() to POST handler (n8n webhook or Formspree)
    console.log("[Phase 3 stub] lead form data:", { name, phone, service, zip });
    setStatus("success");
  }

  return (
    <section
      id="estimate-form"
      aria-label="Request a free estimate"
      className="scroll-mt-16 lg:scroll-mt-20 bg-primary-600 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Get a Free Estimate
          </h2>
          <p className="mt-4 font-body text-lg text-white/90">
            Tell us about your roof. We&apos;ll call you within 2 hours — no
            pressure, no obligation.
          </p>
          <p className="mt-2 font-display text-xs font-semibold uppercase tracking-widest text-white/80">
            Licensed NE #[PLACEHOLDER] · Bonded &amp; Insured
          </p>
        </div>

        {status === "success" ? (
          <div
            role="status"
            className="mt-10 rounded-lg bg-surface p-8 text-center shadow-xl"
          >
            <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-primary-900">
              Thanks, {name || "we got it"}!
            </h3>
            <p className="mt-4 font-body text-base text-neutral-700">
              We&apos;ll call you within 2 hours to schedule your free estimate.
              Prefer to talk now?
            </p>
            <a
              href={siteConfig.phone.href}
              className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-3 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {siteConfig.phone.display}
            </a>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-10 rounded-lg bg-surface p-8 shadow-xl"
          >
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="lead-name"
                  className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
                >
                  Name
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={
                    errors.name ? "lead-name-error" : undefined
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.name && (
                  <p
                    id="lead-name-error"
                    role="alert"
                    className="mt-1 font-body text-sm text-accent-700"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone — primary required field */}
              <div>
                <label
                  htmlFor="lead-phone"
                  className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
                >
                  Phone <span className="text-accent-600">(required)</span>
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  aria-required="true"
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={
                    errors.phone ? "lead-phone-error" : undefined
                  }
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(402) 555-1234"
                  className="mt-2 block w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.phone && (
                  <p
                    id="lead-phone-error"
                    role="alert"
                    className="mt-1 font-body text-sm text-accent-700"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Service select */}
              <div>
                <label
                  htmlFor="lead-service"
                  className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
                >
                  Service Needed
                </label>
                <select
                  id="lead-service"
                  name="service"
                  required
                  aria-required="true"
                  aria-invalid={errors.service ? "true" : undefined}
                  aria-describedby={
                    errors.service ? "lead-service-error" : undefined
                  }
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a service...</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.shortTitle}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p
                    id="lead-service-error"
                    role="alert"
                    className="mt-1 font-body text-sm text-accent-700"
                  >
                    {errors.service}
                  </p>
                )}
              </div>

              {/* ZIP */}
              <div>
                <label
                  htmlFor="lead-zip"
                  className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
                >
                  ZIP Code
                </label>
                <input
                  id="lead-zip"
                  name="zip"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                  aria-required="true"
                  aria-invalid={errors.zip ? "true" : undefined}
                  aria-describedby={
                    errors.zip ? "lead-zip-error" : undefined
                  }
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="68102"
                  className="mt-2 block w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.zip && (
                  <p
                    id="lead-zip-error"
                    role="alert"
                    className="mt-1 font-body text-sm text-accent-700"
                  >
                    {errors.zip}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-md bg-accent-600 px-6 py-4 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
            >
              Request Free Estimate
            </button>
          </form>
        )}

        <p className="mt-6 text-center font-body text-sm text-white/80">
          Prefer to talk?{" "}
          <a
            href={siteConfig.phone.href}
            className="font-semibold text-white underline underline-offset-2 hover:text-accent-300"
          >
            Call {siteConfig.phone.display}
          </a>
        </p>
      </div>
    </section>
  );
}
