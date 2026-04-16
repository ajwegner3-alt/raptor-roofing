"use client";

import { useState, useCallback, type FormEvent } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/content/site';

type Status = 'idle' | 'loading' | 'success' | 'error';
type FieldErrors = Partial<Record<'name' | 'phone' | 'service' | 'zip', string>>;

const SERVICE_OPTIONS = [
  { value: '', label: 'Choose a service...' },
  { value: 'roofing', label: 'Roofing replacement' },
  { value: 'siding', label: 'Siding' },
  { value: 'gutters', label: 'Gutters' },
  { value: 'emergency-tarping', label: 'Emergency tarping' },
  { value: 'inspection', label: 'Free inspection / estimate' },
  { value: 'other', label: 'Something else' },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SuccessCard({ name, phone }: { name: string; phone: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-8 text-center"
    >
      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-primary-900">
        Got it, {name || 'we got it'}!
      </h3>
      <p className="mt-3 font-body text-sm text-neutral-700">
        We&apos;ll call you within 2 hours to schedule your free estimate.
        Prefer to talk now?
      </p>
      <a
        href={`tel:${phone.replace(/\D/g, '')}`}
        className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call {phone}
      </a>
    </div>
  );
}

function ErrorCard({ phone, onRetry }: { phone: string; onRetry: () => void }) {
  return (
    <div role="alert" className="mt-8 text-center">
      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-primary-900">
        We couldn&apos;t send your request.
      </h3>
      <p className="mt-3 font-body text-sm text-neutral-700">
        Please call us directly — we&apos;ll answer within 2 hours.
      </p>
      <a
        href={`tel:${phone.replace(/\D/g, '')}`}
        className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call {phone}
      </a>
      <div className="mt-4">
        <button
          type="button"
          onClick={onRetry}
          className="font-body text-sm font-semibold text-accent-600 underline-offset-2 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner form — uses useGoogleReCaptcha hook (must be inside provider)
// ---------------------------------------------------------------------------

function ContactFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [zip, setZip] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submittedName, setSubmittedName] = useState('');

  // Validate on submit only — per CONTEXT.md
  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = 'Name required';
    if (!phone.replace(/\D/g, '').match(/^\d{10}$/)) e.phone = 'Valid 10-digit phone required';
    if (!service) e.service = 'Please select a service';
    if (!zip.match(/^\d{5}$/)) e.zip = 'Valid 5-digit ZIP required';
    return e;
  }

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setStatus('loading');

    // Get reCAPTCHA token (guard if script not loaded yet)
    let recaptchaToken: string | undefined;
    if (executeRecaptcha) {
      try {
        recaptchaToken = await executeRecaptcha('contact_form');
      } catch (err) {
        console.warn('[ContactForm] reCAPTCHA execute failed, submitting without token', err);
      }
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, zip, recaptchaToken }),
      });
      const data = await res.json() as { success: boolean; messageId?: string; error?: string };

      if (data.success) {
        setSubmittedName(name);
        setStatus('success');
      } else {
        console.error('[ContactForm] submit failed', data.error);
        setStatus('error');
      }
    } catch (err) {
      console.error('[ContactForm] network error', err);
      setStatus('error');
    }
    // intentionally no finally — status stays loading until success/error
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executeRecaptcha, name, phone, service, zip]);

  // Inline replace pattern: success/error cards replace the form in same DOM position
  if (status === 'success') {
    return <SuccessCard name={submittedName} phone={siteConfig.phone.display} />;
  }

  if (status === 'error') {
    return <ErrorCard phone={siteConfig.phone.display} onRetry={() => setStatus('idle')} />;
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Contact form" className="mt-6">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-2 block min-h-[48px] w-full rounded-md border px-4 py-3 font-body text-base text-neutral-900 bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${errors.name ? 'border-accent-600 focus-visible:border-accent-600' : 'border-neutral-300 focus-visible:border-accent-500'}`}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="mt-1 font-body text-sm text-accent-700">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone — primary required field */}
        <div>
          <label
            htmlFor="contact-phone"
            className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
          >
            Phone <span className="text-accent-600">(required)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-required="true"
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(402) 555-1234"
            className={`mt-2 block min-h-[48px] w-full rounded-md border px-4 py-3 font-body text-base text-neutral-900 bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${errors.phone ? 'border-accent-600 focus-visible:border-accent-600' : 'border-neutral-300 focus-visible:border-accent-500'}`}
          />
          {errors.phone && (
            <p id="contact-phone-error" role="alert" className="mt-1 font-body text-sm text-accent-700">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Service select */}
        <div>
          <label
            htmlFor="contact-service"
            className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
          >
            Service Needed
          </label>
          <select
            id="contact-service"
            name="service"
            required
            aria-required="true"
            aria-invalid={errors.service ? 'true' : undefined}
            aria-describedby={errors.service ? 'contact-service-error' : undefined}
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={`mt-2 block min-h-[48px] w-full rounded-md border px-4 py-3 font-body text-base text-neutral-900 bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${errors.service ? 'border-accent-600 focus-visible:border-accent-600' : 'border-neutral-300 focus-visible:border-accent-500'}`}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id="contact-service-error" role="alert" className="mt-1 font-body text-sm text-accent-700">
              {errors.service}
            </p>
          )}
        </div>

        {/* ZIP */}
        <div>
          <label
            htmlFor="contact-zip"
            className="block font-display text-sm font-semibold uppercase tracking-wide text-primary-900"
          >
            ZIP Code
          </label>
          <input
            id="contact-zip"
            name="zip"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            required
            aria-required="true"
            aria-invalid={errors.zip ? 'true' : undefined}
            aria-describedby={errors.zip ? 'contact-zip-error' : undefined}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="68102"
            className={`mt-2 block min-h-[48px] w-full rounded-md border px-4 py-3 font-body text-base text-neutral-900 bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${errors.zip ? 'border-accent-600 focus-visible:border-accent-600' : 'border-neutral-300 focus-visible:border-accent-500'}`}
          />
          {errors.zip && (
            <p id="contact-zip-error" role="alert" className="mt-1 font-body text-sm text-accent-700">
              {errors.zip}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-md bg-accent-600 px-6 py-4 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending\u2026' : 'Get a free estimate'}
      </button>

      <p className="mt-3 text-center font-body text-xs text-neutral-500">
        Licensed NE #[PLACEHOLDER] · Bonded &amp; Insured
      </p>
      <p className="mt-1 text-center font-body text-xs text-neutral-500">
        Prefer to talk?{' '}
        <a
          href={siteConfig.phone.href}
          className="font-semibold text-accent-600 underline-offset-2 hover:underline"
        >
          Call {siteConfig.phone.display}
        </a>
      </p>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Public export — wraps inner form in GoogleReCaptchaProvider so reCAPTCHA
// only loads on /contact, not sitewide.
// ---------------------------------------------------------------------------

export function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    // dev fallback — render the form without the provider so localhost without keys still works
    return (
      <div
        id="contact-form"
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
        <ContactFormInner />
      </div>
    );
  }
  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <div
        id="contact-form"
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
        <ContactFormInner />
      </div>
    </GoogleReCaptchaProvider>
  );
}
