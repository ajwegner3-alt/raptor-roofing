// src/content/services.ts

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceMetadata {
  title: string;          // Under 60 chars: "[Service] in Omaha | Raptor Roofing"
  description: string;    // 150-155 chars
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;     // for nav / cards
  headline: string;       // H1 on service page
  subheadline: string;    // above-fold subtext
  description: string;    // intro paragraph
  problemCopy: string;    // "what happens when..." section
  processSteps: ServiceProcessStep[];
  features: string[];     // bullet list of what's included
  relatedSlugs: string[]; // internal links to other services
  heroImagePath: string;  // public/images/ — placeholder until real photos
  heroImageAlt: string;
  iconName: string;       // lucide-react icon name
  isEmergency: boolean;   // true = show 24/7 phone prominently
  metadata: ServiceMetadata;
}

export const services: Service[] = [
  {
    slug: "roofing",
    title: "Roofing Installation & Repair",
    shortTitle: "Roofing",
    headline: "Roof Replacement & Repair in Omaha",
    subheadline:
      "15 years local. No subcontractors. Every crew member is a Raptor employee.",
    description:
      "Whether you need a full roof replacement after storm damage or a targeted repair on an aging system, Raptor Roofing brings the same in-house crew and 15-year track record to every job. We work with all major insurance carriers and walk you through the claims process at no extra charge.",
    problemCopy:
      "Most Omaha homeowners don't know their roof is failing until water appears on the ceiling — by which point the damage often extends to decking, insulation, and drywall. A roof inspection costs nothing. Waiting costs significantly more.",
    processSteps: [
      {
        step: 1,
        title: "Free Damage Inspection",
        description:
          "Our estimator documents every finding with photos you keep. No pressure. No upsells.",
      },
      {
        step: 2,
        title: "Insurance Claim Support",
        description:
          "We meet with your adjuster on-site to make sure every legitimate item gets covered.",
      },
      {
        step: 3,
        title: "Installation by Our Crew",
        description:
          "No subcontractors — the same Raptor employees who gave your estimate do your roof.",
      },
      {
        step: 4,
        title: "Final Walkthrough",
        description:
          "We review the completed work with you and document the warranty before we leave.",
      },
    ],
    features: [
      "Architectural shingles (GAF, Owens Corning, CertainTeed)",
      "Full tear-off and decking inspection included",
      "Manufacturer warranty + Raptor workmanship warranty",
      "Insurance claim walkthrough at no extra charge",
      "Clean-up and haul-off of all old materials",
    ],
    relatedSlugs: ["siding", "gutters", "emergency-tarping"],
    heroImagePath: "/images/roofing-hero-placeholder.jpg", // PLACEHOLDER: replace with real project photo
    heroImageAlt: "Roof replacement in Omaha — example installation", // PLACEHOLDER: update alt with real project details
    iconName: "Home",
    isEmergency: false,
    metadata: {
      title: "Roof Replacement in Omaha | Raptor Roofing",
      description:
        "Omaha's trusted roofer for 15+ years. Full replacements, storm damage repair, insurance claim help. Licensed & insured. Call (402) 885-1462 for a free inspection.",
    },
  },
  {
    slug: "siding",
    title: "Siding Installation & Repair",
    shortTitle: "Siding",
    headline: "Siding Replacement & Repair in Omaha",
    subheadline: "Protect your home's exterior. Improve curb appeal. Done right the first time.",
    description:
      "Hail and wind damage don't stop at your roof. Raptor Roofing installs and repairs vinyl, fiber cement, and LP SmartSide siding using the same in-house crews that handle our roofing work. One contractor, one warranty, one point of contact.",
    problemCopy:
      "Cracked or dented siding is more than a cosmetic issue — moisture penetrates gaps and compromises wall insulation and framing over time. Insurance-covered siding replacement is one of the most common claims in the Omaha market after major storms.",
    processSteps: [
      {
        step: 1,
        title: "Free Siding Inspection",
        description:
          "We document all storm damage, age-related wear, and moisture intrusion points.",
      },
      {
        step: 2,
        title: "Material & Color Selection",
        description: "Choose from vinyl, fiber cement, or LP SmartSide with our sample boards.",
      },
      {
        step: 3,
        title: "Installation",
        description: "Our in-house crew handles removal, moisture barrier, and new siding.",
      },
    ],
    features: [
      "Vinyl, fiber cement, and LP SmartSide options",
      "Storm damage documentation for insurance claims",
      "Moisture barrier installation",
      "Color match for partial replacements",
      "Manufacturer warranty included",
    ],
    relatedSlugs: ["roofing", "gutters", "emergency-tarping"],
    heroImagePath: "/images/siding-hero-placeholder.jpg", // PLACEHOLDER: replace with real project photo
    heroImageAlt: "Siding replacement in Omaha — example installation", // PLACEHOLDER
    iconName: "Layers",
    isEmergency: false,
    metadata: {
      title: "Siding Replacement in Omaha | Raptor Roofing",
      description:
        "Storm damage siding repair and replacement in Omaha. Vinyl, fiber cement, and LP SmartSide. Licensed & insured. Call (402) 885-1462 for a free inspection.",
    },
  },
  {
    slug: "gutters",
    title: "Gutter Installation & Repair",
    shortTitle: "Gutters",
    headline: "Gutter Installation & Repair in Omaha",
    subheadline: "Protect your foundation. Stop water damage before it starts.",
    description:
      "Damaged or undersized gutters allow water to pool against your foundation, rot fascia boards, and flood window wells. Raptor installs seamless gutters cut on-site for a perfect fit and handles storm-damaged gutter replacement alongside roofing claims.",
    problemCopy:
      "Omaha's intense spring and summer storms deposit significant hail damage on gutters that most homeowners don't notice until a full replacement is needed. A free gutter inspection during your roof inspection catches both issues in one visit.",
    processSteps: [
      {
        step: 1,
        title: "Inspection & Measurement",
        description: "We assess slope, downspout placement, and damage extent.",
      },
      {
        step: 2,
        title: "Seamless Gutter Fabrication",
        description: "Gutters are cut to your home's exact measurements on-site — no seams, no leaks.",
      },
      {
        step: 3,
        title: "Installation & Test",
        description: "We run water through every section before we leave to confirm proper flow.",
      },
    ],
    features: [
      "Seamless aluminum gutters cut on-site",
      "5\" and 6\" profiles available",
      "K-style and half-round styles",
      "Gutter guard options available",
      "Downspout extensions and splash blocks",
    ],
    relatedSlugs: ["roofing", "siding", "emergency-tarping"],
    heroImagePath: "/images/gutters-hero-placeholder.jpg", // PLACEHOLDER: replace with real project photo
    heroImageAlt: "Seamless gutter installation in Omaha — example project", // PLACEHOLDER
    iconName: "Droplets",
    isEmergency: false,
    metadata: {
      title: "Gutter Installation in Omaha | Raptor Roofing",
      description:
        "Seamless gutter installation and repair in Omaha. Storm damage replacement, gutter guards. Licensed & insured. Call (402) 885-1462 for a free inspection.",
    },
  },
  {
    slug: "emergency-tarping",
    title: "Emergency Tarping & Board-Up",
    shortTitle: "Emergency Tarping",
    headline: "24/7 Emergency Roof Tarping in Omaha",
    subheadline: "Storm hit tonight? We respond immediately — day or night.",
    description:
      "A damaged roof doesn't wait for business hours. Raptor Roofing provides 24/7 emergency tarping and board-up services throughout the Omaha metro. We secure your home against further water intrusion until a permanent repair can be scheduled.",
    problemCopy:
      "Every hour an exposed roof goes uncovered, water damages ceilings, walls, insulation, and contents. Emergency tarping stops the immediate loss — and a professionally installed tarp is required by most insurance policies to maintain coverage for secondary damage.",
    processSteps: [
      {
        step: 1,
        title: "Call Us Immediately",
        description:
          "We dispatch a crew as fast as conditions allow, 24 hours a day, 7 days a week.",
      },
      {
        step: 2,
        title: "Emergency Tarp Installation",
        description:
          "We secure your roof with professional-grade tarps anchored to prevent wind uplift.",
      },
      {
        step: 3,
        title: "Damage Documentation",
        description:
          "We photograph and document the damage for your insurance claim while we're on-site.",
      },
      {
        step: 4,
        title: "Permanent Repair Scheduling",
        description:
          "We coordinate the full repair or replacement as soon as conditions and insurance allow.",
      },
    ],
    features: [
      "True 24/7 availability — nights, weekends, holidays",
      "Professional-grade tarps with wind anchoring",
      "Damage documentation for insurance",
      "Same crew handles permanent repair",
      "No separate contractor handoff",
    ],
    relatedSlugs: ["roofing", "siding", "gutters"],
    heroImagePath: "/images/emergency-tarping-placeholder.jpg", // PLACEHOLDER: replace with real emergency response photo
    heroImageAlt: "Emergency roof tarping in Omaha — example response", // PLACEHOLDER
    iconName: "AlertTriangle",
    isEmergency: true,
    metadata: {
      title: "Emergency Roof Tarping Omaha | Raptor Roofing",
      description:
        "24/7 emergency roof tarping and board-up in Omaha. Storm damage? Call (402) 885-1462 now — we dispatch crews day or night. Licensed & insured.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return services.filter((s) => service.relatedSlugs.includes(s.slug));
}
