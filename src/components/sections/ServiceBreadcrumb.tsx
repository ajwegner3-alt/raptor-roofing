import Link from "next/link";

interface ServiceBreadcrumbProps {
  serviceShortTitle: string;
  serviceSlug: string;
}

export function ServiceBreadcrumb({ serviceShortTitle }: ServiceBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-neutral-50 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <ol className="flex items-center gap-2 font-body text-sm text-neutral-600">
          <li>
            <Link href="/" className="hover:text-accent-600 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#services" className="hover:text-accent-600 transition-colors">
              Services
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-primary-900 font-semibold">
            {serviceShortTitle}
          </li>
        </ol>
      </div>
    </nav>
  );
}
