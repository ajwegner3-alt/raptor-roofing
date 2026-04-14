// src/app/(marketing)/layout.tsx

// Phase 1 stubs — replaced with real components in Phase 2
// These exist so the (marketing) layout shell can be tested in Phase 1
// without component implementation blocking progress
import Header from "@/components/stubs/Header";
import Footer from "@/components/stubs/Footer";
import StickyMobileCTA from "@/components/stubs/StickyMobileCTA";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
