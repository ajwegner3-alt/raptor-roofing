"use client";

import { useState, type FormEvent } from "react";
import { Phone, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

type Status = "idle" | "loading" | "success" | "booked" | "error";
type FieldErrors = Partial<Record<"name" | "phone" | "service" | "zip", string>>;

interface LeadFormProps {
  defaultService?: string;
}

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

function formatDayFull(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

interface DemoCalendarProps {
  name: string;
  onBooked: (date: Date, time: string) => void;
}

function DemoCalendar({ name, onBooked }: DemoCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Build calendar grid
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startDow = firstOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Cells: nulls for padding, then 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array<null>(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function isDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return true; // past
    if (d.getDay() === 0) return true; // Sunday
    return false;
  }

  function isSelected(day: number): boolean {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  }

  function isToday(day: number): boolean {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function handleDayClick(day: number) {
    if (isDisabled(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setSelectedTime(null);
  }

  function handleTimeClick(time: string) {
    setSelectedTime(time);
  }

  function handleConfirmBooking() {
    if (selectedDate && selectedTime) {
      onBooked(selectedDate, selectedTime);
    }
  }

  return (
    <div role="region" aria-label="Schedule your estimate appointment" className="mt-6">
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-primary-900 text-center">
        Book Your Estimate
      </h3>
      <p className="mt-1 text-center font-body text-sm text-neutral-600">
        Pick a date and time — {name ? `we'll see you then, ${name.split(" ")[0]}` : "we'll confirm same business day"}.
      </p>

      {/* Month navigation */}
      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="font-display text-base font-semibold text-primary-900">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="mt-3 grid grid-cols-7 text-center">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className={`font-display text-xs font-semibold uppercase tracking-wide pb-2 ${
              d === "Sun" ? "text-neutral-300" : "text-neutral-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const todayCell = isToday(day);
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              aria-label={`${MONTHS[viewMonth]} ${day}, ${viewYear}${disabled ? " (unavailable)" : ""}`}
              aria-pressed={selected}
              className={[
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full font-body text-sm transition-colors",
                selected
                  ? "bg-accent-600 text-white font-semibold shadow"
                  : disabled
                  ? "text-neutral-300 cursor-not-allowed"
                  : todayCell
                  ? "ring-1 ring-accent-600 text-accent-600 font-semibold hover:bg-accent-50"
                  : "text-primary-900 hover:bg-neutral-100",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mt-6">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary-900">
            Available times for {formatDayFull(selectedDate)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => handleTimeClick(slot)}
                aria-pressed={selectedTime === slot}
                className={[
                  "flex min-h-[48px] items-center justify-center rounded-md border font-body text-sm font-medium transition-colors",
                  selectedTime === slot
                    ? "border-accent-600 bg-accent-600 text-white shadow"
                    : "border-neutral-300 bg-surface text-primary-900 hover:border-accent-500 hover:bg-accent-50",
                ].join(" ")}
              >
                {slot}
              </button>
            ))}
          </div>
          {selectedTime && (
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-md bg-accent-600 px-6 py-3 font-display text-base font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
            >
              Confirm {formatDayFull(selectedDate)} at {selectedTime}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ConfirmationProps {
  name: string;
  date: Date;
  time: string;
}

function BookingConfirmation({ name, date, time }: ConfirmationProps) {
  const firstName = name ? name.split(" ")[0] : "there";
  const dateStr = formatDayFull(date);

  return (
    <div role="status" aria-live="polite" className="mt-8 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-12 w-12 text-accent-600" aria-hidden="true" />
      </div>
      <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight text-primary-900">
        Estimate Scheduled!
      </h3>
      <div className="mt-3 rounded-md bg-neutral-50 p-4 ring-1 ring-neutral-200">
        <p className="font-display text-base font-semibold text-primary-900">{dateStr}</p>
        <p className="font-display text-lg font-bold text-accent-600">{time}</p>
      </div>
      <p className="mt-4 font-body text-sm text-neutral-700">
        {firstName}, we&apos;ll see you on {dateStr} at {time}.
      </p>
      <p className="mt-1 font-body text-xs text-neutral-500">
        A confirmation will be sent to your phone.
      </p>
      <a
        href={siteConfig.phone.href}
        className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-[var(--shadow-cta)] hover:bg-accent-700 transition-colors"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Questions? Call {siteConfig.phone.display}
      </a>
      <p className="mt-3 font-body text-xs text-neutral-500">
        Free estimate · No obligation · ~30 minutes
      </p>
    </div>
  );
}

export function LeadForm({ defaultService = "" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(defaultService);
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [bookedDate, setBookedDate] = useState<Date | null>(null);
  const [bookedTime, setBookedTime] = useState<string | null>(null);

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
      // DEMO MODE: always show success regardless of API response.
      // Reason: zero-env-vars policy means /api/contact returns {success:false}
      // without NOTIFICATION_EMAIL. Remove this stub before real deploy.
      void data;
      setStatus("success");
    } catch (err) {
      console.error('[LeadForm] network error', err);
      setStatus("error");
    }
  }

  function handleBooked(date: Date, time: string) {
    setBookedDate(date);
    setBookedTime(time);
    setStatus("booked");
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
          Book your free estimate appointment. No pressure, no obligation.
        </p>
      </div>

      {status === "booked" && bookedDate && bookedTime ? (
        <BookingConfirmation name={name} date={bookedDate} time={bookedTime} />
      ) : status === "success" ? (
        <DemoCalendar name={name} onBooked={handleBooked} />
      ) : status === "error" ? (
        <div role="alert" className="mt-8 text-center">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-primary-900">
            We couldn&apos;t send your request.
          </h3>
          <p className="mt-3 font-body text-sm text-neutral-700">
            Please call us directly — we&apos;ll get back to you same business day.
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

          {/* PLACEHOLDER: hardcoded license string — replace with siteConfig.license.number when confirmed */}
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
