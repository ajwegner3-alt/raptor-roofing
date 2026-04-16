"use client";

import { useState, type FormEvent } from "react";
import { Phone } from "lucide-react";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "service" | "zip", string>>;

interface LeadFormProps {
  defaultService?: string;
}

export function LeadForm({ defaultService = "" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(defaultService);
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setStatus("loading");

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, zip }),
        // NOTE: no recaptchaToken — LeadForm intentionally omits reCAPTCHA so service pages
        // don't load the reCAPTCHA script. The /api/contact route handles missing token gracefully.
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setStatus("success");
      } else {
        console.error('[LeadForm] submit failed', data.error);
        setStatus("error");
      }
    } catch (err) {
      console.error('[LeadForm] network error', err);
      setStatus("error");
    }
  }

  return (
    <div
      id="estimate-form"
      className="scroll-mt-20 lg:scroll-mt-24 w-full rounded-lg bg-surface p-6 shadow-2xl ring-1 ring-black/5 lg:p-8"
    >
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary-900 sm:text-3xl">
          Get a Free Estimate
        </h2>
        <p className="mt-2 font-body text-sm text-neutral-600 sm:text-base">
          We&apos;ll call within 2 hours. No pressure, no obligation.
        </p>
      </div>

      {status === "success" ? (
        <div role="status" className="mt-8 text-center">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-primary-900">
            Thanks, {name || "we got it"}!
          </h3>
          <p className="mt-3 font-body text-sm text-neutral-700">
            We&apos;ll call you within 2 hours to schedule your free estimate.
            Prefer to talk now?
          </p>
          <a
            href={siteConfig.phone.href}
            className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {siteConfig.phone.display}
          </a>
        </div>
      ) : status === "error" ? (
        <div role="alert" className="mt-8 text-center">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-primary-900">
            We couldn&apos;t send your request.
          </h3>
          <p className="mt-3 font-body text-sm text-neutral-700">
            Please call us directly — we&apos;ll answer within 2 hours.
          </p>
          <a
            href={siteConfig.phone.href}
            className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {siteConfig.phone.display}
          </a>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="font-body text-sm font-semibold text-accent-600 underline-offset-2 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4">
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
                  className="mt-2 block min-h-[48px] w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500"
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
                  className="mt-2 block min-h-[48px] w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500"
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
                  className="mt-2 block min-h-[48px] w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500"
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
                  className="mt-2 block min-h-[48px] w-full rounded-md border border-neutral-300 bg-surface px-4 py-3 font-body text-base text-neutral-900 focus:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500"
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
            disabled={status === "loading"}
            className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-md bg-accent-600 px-6 py-4 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending\u2026" : "Get My Free Estimate"}
          </button>

          <p className="mt-3 text-center font-body text-xs text-neutral-500">
            Licensed NE #[PLACEHOLDER] · Bonded &amp; Insured
          </p>
          <p className="mt-1 text-center font-body text-xs text-neutral-500">
            Prefer to talk?{" "}
            <a
              href={siteConfig.phone.href}
              className="font-semibold text-accent-600 underline-offset-2 hover:underline"
            >
              Call {siteConfig.phone.display}
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
