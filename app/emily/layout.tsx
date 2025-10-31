export default function EmilyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50 to-white text-gray-900">
      <header className="max-w-4xl mx-auto px-4 py-6">
        <a href="/emily" className="inline-flex items-center gap-2 font-semibold text-pink-600">
          <span className="text-xl">Emily</span>
          <span className="opacity-70">• exclusives</span>
        </a>
      </header>
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {children}
      </main>
    </div>
  )
}
