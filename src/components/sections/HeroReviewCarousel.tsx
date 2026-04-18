"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/content/testimonials";

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
    review.quote.length > 100
      ? `${review.quote.slice(0, 100).trimEnd()}…`
      : review.quote;

  return (
    <div
      className="mt-6 max-w-sm rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Placeholder banner */}
      {review.isPlaceholder && (
        <span className="placeholder-banner mb-2 inline-flex">
          [Placeholder Review]
        </span>
      )}

      {/* Stars */}
      <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={i < review.rating ? "#FBBC05" : "rgba(255,255,255,0.3)"}
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="mt-1.5 font-body text-sm leading-snug text-white/90">
        &ldquo;{truncated}&rdquo;
      </p>

      {/* Attribution + nav */}
      <div className="mt-2 flex items-center justify-between">
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-white/70">
          — {review.name}, {review.city}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs text-white/50 tabular-nums">
            {current + 1}/{total}
          </span>
          <button
            onClick={next}
            aria-label="Next review"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
