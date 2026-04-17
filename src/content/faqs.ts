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

  // Siding FAQs
  {
    id: "faq-11",
    question: "How much does siding replacement cost in Omaha?",
    // PLACEHOLDER: answer contains inline pricing placeholder — needs real material cost ranges from Raptor
    answer:
      "Siding replacement costs vary based on the material chosen, home size, and extent of existing damage. Vinyl is typically the most affordable option; fiber cement and LP SmartSide are more durable but carry a higher material cost. For an accurate range, we provide free written estimates — and if storm damage is involved, your insurance adjuster's estimate is the starting point. [PLACEHOLDER: confirm price ranges once current material costs are available]",
    category: "process",
    serviceSlug: "siding",
  },
  {
    id: "faq-12",
    question: "What siding materials do you install?",
    answer:
      "Raptor installs vinyl siding, fiber cement (including James Hardie), and LP SmartSide engineered wood siding. Each has different durability, maintenance, and aesthetic profiles. Vinyl is low-maintenance and widely available; fiber cement holds paint well and resists impact; LP SmartSide offers a wood appearance with better moisture resistance than natural wood. We'll walk you through the options with sample boards during your estimate.",
    category: "process",
    serviceSlug: "siding",
  },
  {
    id: "faq-13",
    question: "How long does a siding replacement take?",
    answer:
      "Most residential siding replacements in the Omaha area take two to five days depending on home size, number of stories, and material. Partial replacements for storm-damaged sections can often be completed in one day. Our in-house crew handles removal, moisture barrier installation, and new siding in a continuous sequence — no waiting between subcontractors.",
    category: "process",
    serviceSlug: "siding",
  },
  {
    id: "faq-14",
    question: "What warranty comes with new siding?",
    // PLACEHOLDER: answer contains inline warranty years placeholder — needs fiber cement / LP SmartSide warranty specs from Raptor
    answer:
      "Raptor provides a written workmanship warranty covering installation. Material warranties vary by product: vinyl siding typically carries a lifetime limited warranty from the manufacturer, while fiber cement and LP SmartSide offer [PLACEHOLDER: confirm warranty years] coverage. Both warranties transfer to new homeowners if you sell. We register manufacturer warranties on your behalf and give you written documentation before we leave.",
    category: "warranty",
    serviceSlug: "siding",
  },

  // Gutters FAQs
  {
    id: "faq-15",
    question: "Should I get 5-inch or 6-inch gutters?",
    answer:
      "Five-inch K-style gutters are the standard for most Omaha homes and handle typical rainfall volumes without issue. Six-inch gutters are recommended for larger roof surfaces, steeply pitched roofs, or homes that experience overflow with standard gutters during heavy downpours. During your inspection, we assess your roof's drainage area and slope to recommend the right sizing — there's no extra charge for the consultation.",
    category: "process",
    serviceSlug: "gutters",
  },
  {
    id: "faq-16",
    question: "What is the difference between seamless and sectional gutters?",
    answer:
      "Sectional gutters come in pre-cut lengths joined with connectors — each seam is a potential leak point. Seamless gutters are fabricated in one continuous piece cut to your home's exact measurements on-site, eliminating interior seams along the run. Raptor installs seamless aluminum gutters exclusively, which reduces maintenance and improves long-term watertightness.",
    category: "process",
    serviceSlug: "gutters",
  },
  {
    id: "faq-17",
    question: "Do you install gutter guards?",
    answer:
      "Yes. We offer gutter guard options that reduce debris accumulation in the gutter channel. Guards don't eliminate cleaning entirely, but they significantly extend the interval between maintenance visits. We'll discuss options and pricing during your estimate — gutter guards are an add-on, not a requirement, and we'll give you an honest assessment of whether your home's tree coverage makes them a good investment.",
    category: "process",
    serviceSlug: "gutters",
  },
  {
    id: "faq-18",
    question: "How quickly can you replace storm-damaged gutters?",
    answer:
      "Storm-damaged gutter replacements are typically scheduled within one to two weeks of your estimate, depending on the volume of storm claims in the area. Since we fabricate seamless gutters on-site, we don't wait on pre-cut materials — we arrive with the equipment and fabricate to your home's measurements the day of installation. Most full-perimeter replacements are completed in one day.",
    category: "process",
    serviceSlug: "gutters",
  },

  // Emergency Tarping FAQs
  {
    id: "faq-19",
    question: "How quickly can Raptor respond to an emergency roof call?",
    answer:
      "We answer the phone 24 hours a day, 7 days a week, including holidays. Response time depends on weather conditions and crew availability — during active storm events across Omaha, response queues can extend. We dispatch as fast as conditions safely allow and keep you updated. Same-day tarp installations are our standard target for calls received before late evening.",
    category: "process",
    serviceSlug: "emergency-tarping",
  },
  {
    id: "faq-20",
    question: "Do you document the damage before tarping?",
    answer:
      "Yes, always. When we arrive, we photograph and document all visible damage before any tarping begins. This documentation — including timestamps and detailed photos — is provided to you and can be shared directly with your insurance adjuster. Thorough pre-tarp documentation is one of the most important steps in the claims process, and we do it as a standard part of every emergency response.",
    category: "process",
    serviceSlug: "emergency-tarping",
  },
  {
    id: "faq-21",
    question: "How long will an emergency tarp hold?",
    answer:
      "A professionally installed, properly anchored tarp can protect a damaged roof area for several weeks to a few months depending on weather conditions. Our tarps are secured with weighted lumber and anchoring systems designed to resist wind uplift — not just draped in place. That said, tarping is a temporary measure, and we recommend scheduling permanent repairs as soon as possible after weather conditions allow.",
    category: "process",
    serviceSlug: "emergency-tarping",
  },
  {
    id: "faq-22",
    question: "What does emergency tarping cost?",
    // PLACEHOLDER: answer contains inline pricing placeholder — needs current emergency tarping cost range from Raptor
    answer:
      "Emergency tarping costs vary based on the size of the damaged area and roof accessibility. We provide a written estimate before work begins. In many cases, emergency tarping is a covered expense under your homeowner's policy as part of the storm damage claim — your adjuster can confirm what your specific policy covers. [PLACEHOLDER: add current pricing range once confirmed]",
    category: "process",
    serviceSlug: "emergency-tarping",
  },
];

export function getFaqsByCategory(category: FaqCategory): FAQ[] {
  return faqs.filter((f) => f.category === category);
}

export function getFaqsByService(serviceSlug: string): FAQ[] {
  return faqs.filter((f) => f.serviceSlug === serviceSlug);
}
