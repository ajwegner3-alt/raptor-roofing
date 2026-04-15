import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { getServiceBySlug, getRelatedServices } from "@/content/services";
import { getFaqsByService } from "@/content/faqs";
import { getTestimonialsByService } from "@/content/testimonials";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const service = getServiceBySlug("gutters")!;
const faqs = getFaqsByService("gutters");
const relatedServices = getRelatedServices("gutters");

export const metadata = buildMetadata({
  title: service.metadata.title,
  description: service.metadata.description,
  path: "/services/gutters",
  useAbsoluteTitle: true,
});

export default function GuttersPage() {
  const testimonials = getTestimonialsByService("gutters");
  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: service.shortTitle, href: "/services/gutters" },
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
