// src/content/testimonials.ts

export interface Testimonial {
  id: string;
  name: string;           // First name + last initial only
  city: string;           // Omaha suburb
  rating: number;         // 1-5
  quote: string;
  date: string;           // ISO date string
  serviceSlug: string;    // which service this relates to
  isPlaceholder: boolean; // MUST be true for all placeholder content — FTC compliance
}

// IMPORTANT: All entries below are PLACEHOLDER content.
// isPlaceholder: true triggers a visible amber warning banner in the UI.
// These MUST be replaced with real customer testimonials before public launch.
// See HANDOFF.md for replacement instructions.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mike T.",
    city: "Papillion",
    rating: 5,
    quote:
      "After the June hailstorm, I called three roofers before Raptor. The other two pushed me to sign the same day. Raptor's estimator came out, documented everything, and told me to take my time. They met with my State Farm adjuster and got the full replacement covered. The crew was on my roof five days after approval.",
    date: "2025-08-14",
    serviceSlug: "roofing",
    isPlaceholder: true,
  },
  {
    id: "t2",
    name: "Sandra K.",
    city: "Elkhorn",
    rating: 5,
    quote:
      "I've lived in this house 22 years and put off re-roofing because I didn't trust the sales pressure I kept getting. Raptor was different — no urgency, just honest answers. They explained exactly what needed replacing and what didn't. Professional from first call to final walkthrough.",
    date: "2025-09-02",
    serviceSlug: "roofing",
    isPlaceholder: true,
  },
  {
    id: "t3",
    name: "Dave R.",
    city: "Millard",
    rating: 5,
    quote:
      "Emergency tarp call at 11pm after a severe storm took out part of my roof. Crew was at my house within two hours. They tarped everything properly, documented the damage while they were there, and had a full repair estimate in my inbox by 8am. That's local contractors who actually care.",
    date: "2025-07-21",
    serviceSlug: "emergency-tarping",
    isPlaceholder: true,
  },
  {
    id: "t4",
    name: "Jennifer M.",
    city: "La Vista",
    rating: 5,
    quote:
      "Raptor replaced both my roof and siding after the April storm. One crew, one contract, one warranty. Made the insurance process so much simpler. My neighbor used a different company and had two separate contractors who couldn't coordinate their schedules. My job was done in three days.",
    date: "2025-10-08",
    serviceSlug: "siding",
    isPlaceholder: true,
  },
  {
    id: "t5",
    name: "Tom B.",
    city: "Bellevue",
    rating: 5,
    quote:
      "15-year-old gutters finally gave out. Raptor came out the same week I called, fabricated the seamless gutters on-site, and the whole install took one day. They found two soft spots on my fascia board while they were at it and patched them before installing. Guys clearly know what they're doing.",
    date: "2025-11-15",
    serviceSlug: "gutters",
    isPlaceholder: true,
  },
  {
    id: "t6",
    name: "Carol H.",
    city: "Omaha",
    rating: 5,
    quote:
      "I was skeptical because I'd heard so many horror stories about storm chasers after 2024. My neighbor recommended Raptor — been using them for years. From the inspection to the final walkthrough, I never felt pressured. The workmanship warranty is in writing. Exactly what a local family business should look like.",
    date: "2025-09-28",
    serviceSlug: "roofing",
    isPlaceholder: true,
  },
];

export function getTestimonialsByService(serviceSlug: string): Testimonial[] {
  return testimonials.filter((t) => t.serviceSlug === serviceSlug);
}
