export default function EmilyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-gray-900">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/emily" className="inline-flex items-center gap-3">
            <span className="h-8 w-8 rounded-md bg-pink-600/90" aria-hidden />
            <span className="text-[15px] tracking-tight font-semibold text-gray-900">Emily Atelier</span>
          </a>
          <div className="text-xs text-gray-500">30‑day access • One‑time purchase</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        {children}
      </main>
    </div>
  )
}
