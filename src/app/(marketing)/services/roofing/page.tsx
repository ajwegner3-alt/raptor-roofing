import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { getServiceBySlug, getRelatedServices } from "@/content/services";
import { getFaqsByService } from "@/content/faqs";
import { getTestimonialsByService } from "@/content/testimonials";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const service = getServiceBySlug("roofing")!;
const faqs = getFaqsByService("roofing");
const relatedServices = getRelatedServices("roofing");

export const metadata = buildMetadata({
  title: service.metadata.title,
  description: service.metadata.description,
  path: "/services/roofing",
  useAbsoluteTitle: true,
});

export default function RoofingPage() {
  const testimonials = getTestimonialsByService("roofing");
  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: service.shortTitle, href: "/services/roofing" },
      ])} />
      <JsonLd data={faqPageSchema(faqs)} />
      <ServicePageTemplate
        service={service}
        faqs={faqs}
        testimonials={testimonials}
        relatedServices={relatedServices}
      />
    </>
  );
}
