// src/app/(marketing)/page.tsx
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, faqPageSchema } from "@/lib/schema";
import { faqs, type FAQ } from "@/content/faqs";

import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { WhyNotChaser } from "@/components/sections/WhyNotChaser";
import { Insurance3Step } from "@/components/sections/Insurance3Step";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { InsuranceLogos } from "@/components/sections/InsuranceLogos";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { FinancingCallout } from "@/components/sections/FinancingCallout";
import { LeadForm } from "@/components/sections/LeadForm";

// SEO metadata — canonical set to site root via path: "/"
// useAbsoluteTitle bypasses root layout title template to avoid double-branding
export const metadata = buildMetadata({
  title: "Omaha Roofing Services | Raptor Roofing",
  description:
    "Family-owned Omaha roofer since 2009. Roof replacement, siding, gutters & 24/7 emergency tarping. Licensed & insured. Call for a free estimate.",
  path: "/",
  useAbsoluteTitle: true,
});

// Curated homepage FAQ slice — the SAME array feeds both the JSON-LD and
// the visible accordion so Google Rich Results can never mismatch the page.
// Selection covers the 6 topics locked in CONTEXT.md.
const HOMEPAGE_FAQ_IDS = [
  "faq-7", // how long does a roof replacement take (process)
  "faq-5", // do you work directly with insurance adjusters (insurance)
  "faq-9", // what warranty do you provide (warranty)
  "faq-2", // legitimate roofer vs storm chaser (anti-chaser)
  "faq-4", // will insurance cover replacement (insurance)
  "faq-8", // do I need to be home (process / reassurance)
] as const;

const homepageFaqs: FAQ[] = HOMEPAGE_FAQ_IDS.map((id) => {
  const found = faqs.find((f) => f.id === id);
  if (!found) {
    throw new Error(
      `[raptor-roofing] Homepage FAQ id "${id}" not found in faqs.ts — update HOMEPAGE_FAQ_IDS or add the FAQ entry.`
    );
  }
  return found;
});

export default function HomePage() {
  return (
    <>
      {/* LocalBusiness JSON-LD is already mounted in Footer — do NOT re-mount here */}
      {/* FAQPage JSON-LD — must match the exact FAQ array passed to <FaqAccordion> */}
      <JsonLd data={faqPageSchema(homepageFaqs)} />

      <Hero />
      <TrustStrip />
      <ServiceGrid />
      <WhyNotChaser />
      <Insurance3Step />
      <TestimonialCarousel />
      <InsuranceLogos />
      <FaqAccordion faqs={homepageFaqs} />
      <FinancingCallout />
      <LeadForm />
    </>
  );
}
