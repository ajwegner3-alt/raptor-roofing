"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/content/testimonials";

function GoogleGIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function HeroReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = testimonials.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = () => {
    setCurrent((c) => (c - 1 + total) % total);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const review = testimonials[current];
  const truncated =
    review.quote.length > 120
      ? `${review.quote.slice(0, 120).trimEnd()}…`
      : review.quote;

  const initial = review.name.charAt(0).toUpperCase();

  return (
    <div
      className="relative mt-6 w-full max-w-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Placeholder tag */}
      {review.isPlaceholder && (
        <span className="absolute -top-2.5 right-3 z-10 rounded-sm bg-amber-400 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-amber-900">
          Placeholder
        </span>
      )}

      <div className="rounded-xl bg-white/95 backdrop-blur-sm shadow-lg px-5 py-4">
        {/* Header: Google G + label */}
        <div className="flex items-center gap-2">
          <GoogleGIcon />
          <span className="font-body text-sm text-neutral-500">Google Review</span>
        </div>

        {/* Stars */}
        <div
          className="mt-2.5 flex items-center gap-0.5"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={i < review.rating ? "#FBBC05" : "#D1D5DB"}
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>

        {/* Quote */}
        <p className="mt-2.5 font-body text-sm leading-relaxed text-neutral-700">
          &ldquo;{truncated}&rdquo;
        </p>

        {/* Footer: avatar + name + nav */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar circle */}
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white"
              aria-hidden="true"
            >
              {initial}
            </div>
            <span className="font-body text-sm font-semibold text-neutral-800">
              {review.name}&nbsp;
              <span className="font-normal text-neutral-500">· {review.city}</span>
            </span>
          </div>

          {/* Nav arrows + counter */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-600"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-body text-xs text-neutral-400 tabular-nums">
              {current + 1}/{total}
            </span>
            <button
              onClick={next}
              aria-label="Next review"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-600"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
