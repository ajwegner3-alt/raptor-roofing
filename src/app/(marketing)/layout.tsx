import type { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA"

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="pb-[var(--sticky-cta-height)] md:pb-0">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  )
}
