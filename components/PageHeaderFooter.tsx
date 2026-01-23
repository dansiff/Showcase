"use client"

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'

type Theme = 'taco' | 'sushi' | 'italian' | 'game' | 'morelia' | 'default'

const themes: Record<Theme, { bg: string; text: string; accent: string; border: string }> = {
  taco: {
    bg: 'bg-amber-900/40 border-amber-800/50',
    text: 'text-amber-100',
    accent: 'text-amber-400 hover:text-amber-300',
    border: 'border-amber-800'
  },
  sushi: {
    bg: 'bg-red-950/60 border-red-900/30',
    text: 'text-red-100',
    accent: 'text-red-300 hover:text-red-200',
    border: 'border-red-900/30'
  },
  italian: {
    bg: 'bg-green-900/40 border-green-800/50',
    text: 'text-green-100',
    accent: 'text-green-300 hover:text-green-200',
    border: 'border-green-800'
  },
  game: {
    bg: 'bg-purple-900/40 border-purple-800/50',
    text: 'text-purple-100',
    accent: 'text-pink-300 hover:text-pink-200',
    border: 'border-purple-800'
  },
  morelia: {
    bg: 'bg-red-900/40 border-red-800/50',
    text: 'text-red-100',
    accent: 'text-yellow-400 hover:text-yellow-300',
    border: 'border-red-800'
  },
  default: {
    bg: 'bg-gray-900/80 border-gray-800',
    text: 'text-gray-100',
    accent: 'text-indigo-300 hover:text-indigo-200',
    border: 'border-gray-800'
  }
}

export function PageHeader({ theme = 'default', title, subtitle }: { theme?: Theme; title: string; subtitle?: string }) {
  const t = themes[theme] || themes.default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={`sticky top-0 z-40 backdrop-blur-md ${t.bg} border-b ${t.border}`} role="banner">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main header */}
        <div className="flex items-center justify-between mb-3">
          <Link 
            href="/" 
            className={`text-lg font-bold tracking-wide ${t.accent}`}
          >
            {theme === 'taco' && '🌮 Querrepario'}
            {theme === 'sushi' && '🍣 Sakura'}
            {theme === 'italian' && '🍝 Bella Cucina'}
            {theme === 'game' && '🎮 Snack Arcade'}
            {theme === 'morelia' && '🌮 Morelia'}
            {theme === 'default' && 'Fusion Space'}
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${t.accent}`}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Primary">
            {theme === 'morelia' ? (
              <a 
                href="https://maps.app.goo.gl/DYoBScKNPvyT3SKg7" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${t.accent} transition-colors flex items-center gap-1`}
              >
                📍 View on Google Maps
              </a>
            ) : (
              <>
                <Link href="/taco" className={`${t.accent} transition-colors`}>Tacos</Link>
                <Link href="/sushi" className={`${t.accent} transition-colors`}>Sushi</Link>
                <Link href="/italian" className={`${t.accent} transition-colors`}>Italian</Link>
                <Link href="/game" className={`${t.accent} transition-colors`}>Arcade</Link>
                <Link href="/portal" className={`${t.accent} transition-colors`}>Portal</Link>
              </>
            )}
          </nav>
        </div>

        {/* Title section */}
        <div className="text-center">
          <h1 className={`text-2xl md:text-3xl font-bold ${t.text}`}>{title}</h1>
          {subtitle && <p className={`text-sm mt-1 opacity-90`}>{subtitle}</p>}
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-2 mt-4 pt-4 border-t" aria-label="Mobile menu">
            {theme === 'morelia' ? (
              <a 
                href="https://maps.app.goo.gl/DYoBScKNPvyT3SKg7" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${t.accent} py-2 transition-colors`}
              >
                📍 View on Google Maps
              </a>
            ) : (
              <>
                <Link href="/taco" className={`${t.accent} py-2 transition-colors`}>🌮 Tacos</Link>
                <Link href="/sushi" className={`${t.accent} py-2 transition-colors`}>🍣 Sushi</Link>
                <Link href="/italian" className={`${t.accent} py-2 transition-colors`}>🍝 Italian</Link>
                <Link href="/game" className={`${t.accent} py-2 transition-colors`}>🎮 Arcade</Link>
                <Link href="/portal" className={`${t.accent} py-2 transition-colors`}>Portal</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}

export function PageFooter({ theme = 'default' }: { theme?: Theme }) {
  const t = themes[theme] || themes.default

  return (
    <footer className={`${t.bg} border-t ${t.border} mt-16 py-8`} role="contentinfo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className={`font-bold mb-3 ${t.accent}`}>
              {theme === 'taco' && '🌮 Querrepario Tacos'}
              {theme === 'sushi' && '🍣 Sakura Sushi'}
              {theme === 'italian' && '🍝 Bella Cucina'}
              {theme === 'game' && '🎮 Snack Arcade'}
              {theme === 'morelia' && '🌮 Taqueria Morelia #2'}
              {theme === 'default' && 'Fusion Space'}
            </h3>
            <p className={`text-sm ${t.text} opacity-75`}>
              {theme === 'taco' && 'Authentic street-style tacos made fresh daily.'}
              {theme === 'sushi' && 'Premium Japanese sushi with the finest ingredients.'}
              {theme === 'italian' && 'Traditional Italian cuisine made with love.'}
              {theme === 'game' && 'Classic arcade games to enjoy while you wait.'}
              {theme === 'morelia' && 'Authentic Mexican birria and tacos made with family recipes.'}
              {theme === 'default' && 'Modern web solutions for your business.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className={`font-bold mb-3 ${t.accent}`}>Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm" aria-label="Footer links">
              <Link href="/taco" className={`${t.text} hover:${t.accent} transition-colors`}>Order Tacos</Link>
              <Link href="/track-order" className={`${t.text} hover:${t.accent} transition-colors`}>Track Order</Link>
              <Link href="/game" className={`${t.text} hover:${t.accent} transition-colors`}>Play Games</Link>
              <Link href="/portal" className={`${t.text} hover:${t.accent} transition-colors`}>Portal</Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className={`font-bold mb-3 ${t.accent}`}>Contact</h4>
            <p className={`text-sm ${t.text} opacity-75 mb-2`}>
              {theme === 'taco' && 'Phone: (555) 123-TACO'}
              {theme === 'sushi' && 'Phone: (555) 123-SUSHI'}
              {theme === 'italian' && 'Phone: (555) 123-PIZZA'}
              {theme === 'game' && 'Hours: 10am - 10pm Daily'}
              {theme === 'morelia' && 'Phone: (872) 281-7114'}
              {theme === 'default' && 'Email: hello@fusionspace.com'}
            </p>
            <p className={`text-sm ${t.text} opacity-75`}>
              {theme === 'taco' && 'Open: 11am - 10pm Daily'}
              {theme === 'sushi' && 'Open: 5pm - 11pm Daily'}
              {theme === 'italian' && 'Open: 5pm - 11pm Daily'}
              {theme === 'game' && 'Free wifi • Cash & Card'}
              {theme === 'morelia' && 'Open: 9am - 9pm Daily'}
              {theme === 'default' && 'https://fusionspace.com'}
            </p>
          </div>
        </div>

        <div className={`border-t ${t.border} pt-4 flex justify-between items-center text-xs ${t.text} opacity-50`}>
          <p>&copy; 2026 {theme === 'default' ? 'Fusion Space Inc' : (theme === 'taco' ? 'Querrepario' : theme === 'sushi' ? 'Sakura' : theme === 'italian' ? 'Bella Cucina' : theme === 'game' ? 'Fusion Space Inc' : theme === 'morelia' ? 'Taqueria Morelia #2' : 'Fusion Space Inc')}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
            <Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
