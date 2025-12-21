"use client"

import { useState } from 'react'
import { Monitor, Smartphone, Tablet, Eye, Code, RefreshCw } from 'lucide-react'

interface FormData {
  businessName: string
  tagline: string
  colorScheme: string
  primaryColor: string
  secondaryColor: string
  layoutStyle: string
  siteType: any[]
  features: any
  pages: string[]
}

interface LivePreviewProps {
  formData: FormData
}

type ViewMode = 'desktop' | 'tablet' | 'mobile'
type PreviewTab = 'visual' | 'code'

export default function LivePreview({ formData }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [activeTab, setActiveTab] = useState<PreviewTab>('visual')
  const [refreshKey, setRefreshKey] = useState(0)

  const viewModes = [
    { value: 'desktop' as ViewMode, label: 'Desktop', icon: Monitor, width: '100%' },
    { value: 'tablet' as ViewMode, label: 'Tablet', icon: Tablet, width: '768px' },
    { value: 'mobile' as ViewMode, label: 'Mobile', icon: Smartphone, width: '375px' },
  ]

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  // Generate preview HTML
  const generatePreviewHTML = () => {
    const { businessName, tagline, primaryColor, secondaryColor, layoutStyle, pages } = formData
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName || 'Your Website'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s;
    }
    .nav-links a:hover {
      opacity: 0.8;
    }
    .hero {
      ${layoutStyle === 'split' ? 'display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;' : ''}
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      text-align: ${layoutStyle === 'minimal' ? 'center' : 'left'};
    }
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: ${primaryColor};
    }
    .hero p {
      font-size: 1.25rem;
      color: #666;
      margin-bottom: 2rem;
    }
    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: ${primaryColor};
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .features {
      background: #f8f9fa;
      padding: 4rem 2rem;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .feature-card:hover {
      transform: translateY(-5px);
    }
    .feature-icon {
      width: 50px;
      height: 50px;
      background: ${primaryColor};
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    .footer {
      background: #1a1a1a;
      color: white;
      padding: 3rem 2rem;
      text-align: center;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .nav-links { display: none; }
      .hero { text-align: center; grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header class="header">
    <nav class="nav">
      <div class="logo">${businessName || 'Your Brand'}</div>
      <ul class="nav-links">
        ${pages.map(page => `<li><a href="#${page.toLowerCase()}">${page}</a></li>`).join('')}
      </ul>
    </nav>
  </header>

  <section class="hero">
    <div>
      <h1>${businessName || 'Welcome to Your Website'}</h1>
      <p>${tagline || 'Build something amazing with our platform'}</p>
      <a href="#contact" class="cta-button">Get Started</a>
    </div>
    ${layoutStyle === 'split' ? '<div style="background: #e5e7eb; border-radius: 12px; min-height: 300px;"></div>' : ''}
  </section>

  <section class="features">
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon"></div>
        <h3>Feature One</h3>
        <p>Amazing functionality that helps your business grow.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"></div>
        <h3>Feature Two</h3>
        <p>Powerful tools designed for your success.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon"></div>
        <h3>Feature Three</h3>
        <p>Everything you need in one place.</p>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>&copy; 2025 ${businessName || 'Your Company'}. All rights reserved.</p>
  </footer>
</body>
</html>
    `.trim()
  }

  const generateCodePreview = () => {
    return `// Next.js Page Component
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Header 
        logo="${formData.businessName || 'Your Brand'}"
        pages={${JSON.stringify(formData.pages)}}
      />
      <Hero 
        title="${formData.businessName || 'Welcome'}"
        subtitle="${formData.tagline || 'Build something amazing'}"
        ctaText="Get Started"
        ctaLink="/contact"
      />
      <Features 
        items={[
          { title: 'Feature One', description: '...' },
          { title: 'Feature Two', description: '...' },
          { title: 'Feature Three', description: '...' },
        ]}
      />
      <Footer brand="${formData.businessName || 'Your Company'}" />
    </>
  )
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${formData.primaryColor}',
        secondary: '${formData.secondaryColor}',
      }
    }
  }
}`
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header Controls */}
      <div className="bg-slate-800/50 border-b border-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Eye className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-white">Live Preview</span>
            {formData.businessName && (
              <span className="text-xs text-slate-400 px-2 py-1 bg-slate-700/50 rounded">
                {formData.businessName}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Tab Selector */}
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTab === 'visual'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                  activeTab === 'code'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
                Code
              </button>
            </div>

            {/* View Mode Selector */}
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value)}
                  className={`p-2 rounded transition-colors ${
                    viewMode === mode.value
                      ? 'bg-purple-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={mode.label}
                >
                  <mode.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
              title="Refresh Preview"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6 bg-slate-800/30">
        {activeTab === 'visual' ? (
          <div className="flex justify-center">
            <div
              style={{
                width: viewModes.find(m => m.value === viewMode)?.width,
                transition: 'width 0.3s ease',
              }}
              className="bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              <iframe
                key={refreshKey}
                srcDoc={generatePreviewHTML()}
                className="w-full border-0"
                style={{ height: '600px' }}
                title="Website Preview"
              />
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-slate-300 font-mono">
              <code>{generateCodePreview()}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-800/50 border-t border-white/5 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Updates automatically as you type</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </div>
  )
}
