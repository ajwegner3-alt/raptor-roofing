import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { getServiceBySlug, getRelatedServices } from "@/content/services";
import { getFaqsByService } from "@/content/faqs";
import { getTestimonialsByService } from "@/content/testimonials";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const service = getServiceBySlug("emergency-tarping")!;
const faqs = getFaqsByService("emergency-tarping");
const relatedServices = getRelatedServices("emergency-tarping");

export const metadata = buildMetadata({
  title: service.metadata.title,
  description: service.metadata.description,
  path: "/services/emergency-tarping",
  useAbsoluteTitle: true,
});

export default function EmergencyTarpingPage() {
  const testimonials = getTestimonialsByService("emergency-tarping");
  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: service.shortTitle, href: "/services/emergency-tarping" },
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
