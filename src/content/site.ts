// src/content/site.ts

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  phone: {
    display: string;
    href: string;     // tel: format
    emergency: string; // display for 24/7 emergency
  };
  address: {
    street: string;   // PLACEHOLDER: confirm street address with Raptor
    city: string;
    state: string;
    zip: string;
    full: string;     // formatted full address
  };
  email: string;      // PLACEHOLDER: confirm contact email with Raptor
  hours: BusinessHours[];
  license: {
    number: string;   // PLACEHOLDER: confirm NE contractor license number
    bonded: boolean;
    insured: boolean;
    displayText: string;
  };
  founding: {
    year: number;
    yearsInBusiness: number; // derive at render time or set explicitly
  };
  reviews: {
    count: number;    // PLACEHOLDER: verify on Google Business Profile
    rating: number;   // PLACEHOLDER: verify on Google Business Profile
    platform: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    google?: string;  // Google Business Profile URL
  };
  serviceAreas: string[]; // display list for footer
  certifications: string[]; // manufacturer certs
}

export const siteConfig: SiteConfig = {
  name: "Raptor Roofing",
  tagline: "Omaha's Anti-Chaser Roofer Since 2009",
  description:
    "Family-owned Omaha roofing contractor. 15+ years local, no subcontractors, licensed and insured. Free storm damage inspections. Call (402) 885-1462.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app",

  phone: {
    display: "(402) 885-1462",
    href: "tel:+14028851462",
    emergency: "(402) 885-1462 — 24/7",
  },

  address: {
    street: "// PLACEHOLDER: confirm street address with Raptor",
    city: "Omaha",
    state: "NE",
    zip: "68102", // PLACEHOLDER: confirm ZIP with Raptor
    full: "Omaha, NE", // PLACEHOLDER: update with full address after confirmation
  },

  email: "info@raptorroofingllc.com", // PLACEHOLDER: confirm contact email with Raptor

  hours: [
    { day: "Monday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Tuesday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Wednesday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Thursday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Friday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Saturday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Sunday", open: "", close: "", closed: true },
  ],

  license: {
    number: "// PLACEHOLDER: NE contractor license number — verify with Raptor",
    bonded: true,
    insured: true,
    displayText: "Licensed • Bonded • Insured",
  },

  founding: {
    year: 2009,
    yearsInBusiness: new Date().getFullYear() - 2009,
  },

  reviews: {
    count: 127,   // PLACEHOLDER: verify on Google Business Profile before launch
    rating: 4.9,  // PLACEHOLDER: verify on Google Business Profile before launch
    platform: "Google",
  },

  socialLinks: {
    facebook: undefined,  // PLACEHOLDER: add Raptor Facebook URL if available
    instagram: undefined, // PLACEHOLDER: add Raptor Instagram URL if available
    google: "https://g.page/raptor-roofing-omaha", // PLACEHOLDER: confirm GBP URL
  },

  serviceAreas: [
    "Omaha",
    "Bellevue",
    "Papillion",
    "La Vista",
    "Elkhorn",
    "Millard",
    "Gretna",
    "Sarpy County",
  ],

  certifications: [
    "GAF Certified Contractor",         // PLACEHOLDER: confirm Raptor certifications
    "Owens Corning Preferred Contractor", // PLACEHOLDER: confirm if applicable
  ],
};
