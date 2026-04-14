// src/app/page.tsx
// Phase 1 placeholder root page — replaced once (marketing) route group
// owns "/" via 01-03's app/(marketing)/page.tsx.
// HANDOFF TO 01-03: Delete this file before creating src/app/(marketing)/page.tsx
// to avoid Next.js route conflict between app/page.tsx and app/(marketing)/page.tsx.
export default function RootPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3 p-8">
        <h1 className="text-4xl font-bold text-primary-600">
          Raptor Roofing
        </h1>
        <p className="text-neutral-700">Phase 1 scaffold OK</p>
      </div>
    </main>
  );
}
