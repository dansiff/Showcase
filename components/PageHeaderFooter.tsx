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

  const socialLinks: Record<Theme, { instagram?: string; facebook?: string; yelp?: string } | undefined> = {
    morelia: {
      facebook: 'https://www.facebook.com/profile.php?id=100082637193220#',
      yelp: 'https://www.yelp.com/biz/taqueria-y-birreria-morelia-chicago',
      instagram: 'https://www.instagram.com/explore/locations/1026582861/taqueria-y-birreria-morelia/'
    },
    taco: undefined,
    sushi: undefined,
    italian: undefined,
    game: undefined,
    default: undefined
  }

  const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 2a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4.75-.75a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  )

  const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.94.17 1.94.17v2.1h-1.07c-1.05 0-1.37.65-1.37 1.32V12h2.34l-.37 2.9h-1.97v7A10 10 0 0022 12z" />
    </svg>
  )

  const YelpIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c1.1 0 2 .9 2 2 0 .1-.01.21-.03.31l1.7.7c.9.36 1.47 1.23 1.47 2.16 0 .19-.02.38-.07.56l-.5 1.7c.36.85.36 1.8 0 2.65l.5 1.7c.05.18.07.37.07.56 0 .93-.57 1.8-1.47 2.16l-1.7.7c.02.1.03.2.03.31 0 1.1-.9 2-2 2-1.1 0-2-.9-2-2 0-.11.01-.21.03-.31l-1.7-.7C6.98 19.8 6.41 18.93 6.41 18c0-.19.02-.38.07-.56l.5-1.7c-.36-.85-.36-1.8 0-2.65l-.5-1.7c-.05-.18-.07-.37-.07-.56 0-.93.57-1.8 1.47-2.16l1.7-.7C10.01 4.21 10 4.11 10 4c0-1.1.9-2 2-2z" />
    </svg>
  )

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
            {theme === 'morelia' ? (
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/game" className={`${t.text} hover:${t.accent} transition-colors`}>Play Games</Link>

                <div className="flex items-center gap-3">
                  {socialLinks.morelia?.facebook && (
                    <a href={socialLinks.morelia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Morelia on Facebook" className={`${t.text} hover:${t.accent} transition-colors`}>
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                  )}

                  {socialLinks.morelia?.yelp && (
                    <a href={socialLinks.morelia.yelp} target="_blank" rel="noopener noreferrer" aria-label="Morelia on Yelp" className={`${t.text} hover:${t.accent} transition-colors`}>
                      <YelpIcon className="w-5 h-5" />
                    </a>
                  )}

                  {socialLinks.morelia?.instagram && (
                    <a href={socialLinks.morelia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Morelia on Instagram" className={`${t.text} hover:${t.accent} transition-colors`}>
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <nav className="flex flex-col gap-2 text-sm" aria-label="Footer links">
                <Link href="/taco" className={`${t.text} hover:${t.accent} transition-colors`}>Order Tacos</Link>
                <Link href="/track-order" className={`${t.text} hover:${t.accent} transition-colors`}>Track Order</Link>
                <Link href="/game" className={`${t.text} hover:${t.accent} transition-colors`}>Play Games</Link>
                <Link href="/portal" className={`${t.text} hover:${t.accent} transition-colors`}>Portal</Link>
              </nav>
            )}
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
