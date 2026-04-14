// src/content/faqs.ts

export type FaqCategory =
  | "storm-damage"
  | "insurance"
  | "process"
  | "warranty"
  | "general";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  serviceSlug?: string; // optional — links FAQ to a specific service page
}

export const faqs: FAQ[] = [
  // Storm Damage
  {
    id: "faq-1",
    question: "How do I know if my roof was damaged in a hailstorm?",
    answer:
      "Hail damage on asphalt shingles appears as dark circular dents (bruising) in the granule surface. You may also see dented metal on vents, gutters, and flashing. The damage isn't always visible from the ground — a free inspection from a licensed contractor is the only reliable way to assess severity before filing a claim.",
    category: "storm-damage",
    serviceSlug: "roofing",
  },
  {
    id: "faq-2",
    question: "What is the difference between a legitimate roofer and a storm chaser?",
    answer:
      "Storm chasers are out-of-state contractors who follow severe weather events, take deposits from homeowners, and disappear or do poor-quality work before the next storm rolls through. Legitimate Omaha roofers have a permanent address, a Nebraska contractor license, and references from customers you can call. Raptor has been in Omaha since 2009 and we'll still be here in 2034.",
    category: "storm-damage",
  },
  {
    id: "faq-3",
    question: "How long after a storm do I have to file a hail damage claim?",
    answer:
      "Nebraska homeowner insurance policies typically allow one to two years from the date of loss to file a claim, but this varies by carrier and policy. Filing sooner is better — insurers can dispute whether damage occurred in the most recent storm if too much time passes. We recommend calling for an inspection within 30 days of any major hailstorm.",
    category: "storm-damage",
    serviceSlug: "roofing",
  },

  // Insurance
  {
    id: "faq-4",
    question: "Will my homeowner's insurance cover a full roof replacement?",
    answer:
      "If your roof sustained hail or wind damage in a covered event, most policies cover the cost of replacement minus your deductible. The key factor is your policy's replacement cost value (RCV) vs. actual cash value (ACV) clause — RCV policies pay the full replacement cost, while ACV policies depreciate the value based on roof age. Raptor reviews your policy summary with you before the adjuster visit.",
    category: "insurance",
    serviceSlug: "roofing",
  },
  {
    id: "faq-5",
    question: "Do you work directly with insurance adjusters?",
    answer:
      "Yes. We meet with your insurance adjuster on-site during their inspection to make sure every storm-damaged item is documented correctly. We don't 'work around' insurers — we work with them. Our estimators know what adjusters look for and how to document damage in the format that leads to a fair settlement.",
    category: "insurance",
  },
  {
    id: "faq-6",
    question: "What is my deductible and do I have to pay it?",
    answer:
      "Your deductible is the amount you pay before insurance covers the rest. Nebraska law prohibits contractors from waiving or absorbing your deductible — any contractor who offers to 'cover your deductible' is engaging in insurance fraud. Your deductible is your responsibility and is paid directly to us when work is complete.",
    category: "insurance",
  },

  // Process
  {
    id: "faq-7",
    question: "How long does a roof replacement take?",
    answer:
      "A typical residential roof replacement in Omaha takes one to two days, depending on size, pitch, and complexity. We work with a single in-house crew — no subcontractor handoffs — so there's no scheduling gap between tear-off and installation. We handle cleanup and haul-off the same day.",
    category: "process",
    serviceSlug: "roofing",
  },
  {
    id: "faq-8",
    question: "Do I need to be home during the installation?",
    answer:
      "You don't need to be home during the installation itself, but we do ask that you're available for a 15-minute walkthrough when we finish to review the completed work and document the warranty transfer together. We'll schedule your installation day at a time that works for you.",
    category: "process",
  },

  // Warranty
  {
    id: "faq-9",
    question: "What warranty do you provide on roofing work?",
    answer:
      "Raptor provides a written workmanship warranty on all roofing installations covering labor and installation defects. We also register manufacturer warranties (GAF, Owens Corning) on your behalf — most architectural shingles carry 30 to lifetime coverage for the materials themselves. Both warranties are in writing and transfer to the new homeowner if you sell.",
    category: "warranty",
    serviceSlug: "roofing",
  },
  {
    id: "faq-10",
    question: "What is the difference between a manufacturer warranty and a workmanship warranty?",
    answer:
      "A manufacturer warranty covers defects in the roofing materials themselves — shingles that crack, curl, or fail prematurely under normal conditions. A workmanship warranty covers installation errors — improper flashing, inadequate nailing patterns, or ventilation mistakes that cause premature failure. You need both. Raptor provides both in writing.",
    category: "warranty",
  },
];

export function getFaqsByCategory(category: FaqCategory): FAQ[] {
  return faqs.filter((f) => f.category === category);
}

export function getFaqsByService(serviceSlug: string): FAQ[] {
  return faqs.filter((f) => f.serviceSlug === serviceSlug);
}
