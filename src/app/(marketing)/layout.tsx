import type { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA"
import { UrgencyBar } from "@/components/layout/UrgencyBar"

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* UrgencyBar: fixed, appears after 500px scroll, slides in above the viewport */}
      <UrgencyBar />
      <Header />
      <main id="main" tabIndex={-1} className="pb-[var(--sticky-cta-height)] md:pb-0">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  )
}
