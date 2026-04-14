import Link from "next/link"
import { Phone } from "lucide-react"
import { siteConfig } from "@/content/site"

export function StickyMobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex md:hidden bg-accent-600 text-white shadow-[var(--shadow-cta)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="group"
      aria-label="Contact actions"
    >
      <a
        href={siteConfig.phone.href}
        className="flex flex-1 items-center justify-center gap-2 px-4 py-4 font-display text-base font-bold uppercase tracking-wide border-r border-white/20"
        aria-label={`Call ${siteConfig.name} at ${siteConfig.phone.display}`}
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call Now
      </a>
      <Link
        href="/#estimate-form"
        className="flex flex-1 items-center justify-center gap-2 px-4 py-4 font-display text-base font-bold uppercase tracking-wide"
      >
        Free Estimate
      </Link>
    </div>
  )
}
