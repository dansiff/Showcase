import JSZip from 'jszip'
import { saveAs } from 'file-saver'

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
  aboutText: string
  targetAudience: string
  seoKeywords: string[]
  metaDescription: string
}

export async function exportToZip(formData: FormData) {
  const zip = new JSZip()

  // Generate package.json
  const packageJson = {
    name: formData.businessName.toLowerCase().replace(/\s+/g, '-') || 'my-website',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      next: '^14.0.0',
    },
    devDependencies: {
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      typescript: '^5',
      tailwindcss: '^3.3.0',
      postcss: '^8',
      autoprefixer: '^10',
    },
  }
  zip.file('package.json', JSON.stringify(packageJson, null, 2))

  // Generate tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }
  zip.file('tsconfig.json', JSON.stringify(tsConfig, null, 2))

  // Generate tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${formData.primaryColor}',
        secondary: '${formData.secondaryColor}',
      },
    },
  },
  plugins: [],
}
`
  zip.file('tailwind.config.js', tailwindConfig)

  // Generate postcss.config.js
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  zip.file('postcss.config.js', postcssConfig)

  // Generate next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`
  zip.file('next.config.js', nextConfig)

  // Generate README.md
  const readme = `# ${formData.businessName || 'My Website'}

${formData.tagline || 'A modern website built with Next.js and Tailwind CSS'}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

${Object.entries(formData.features || {})
  .filter(([_, enabled]) => enabled)
  .map(([feature]) => `- ${feature.charAt(0).toUpperCase() + feature.slice(1)}`)
  .join('\n')}

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Ready for Vercel, Netlify, or any Node.js hosting

## Pages

${formData.pages.map(page => `- ${page}`).join('\n')}

## Customization

Edit the files in the \`app\` directory to customize your website.

## Deploy

Deploy to Vercel with one click:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT
`
  zip.file('README.md', readme)

  // Generate .gitignore
  const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`
  zip.file('.gitignore', gitignore)

  // Create app directory structure
  const appDir = zip.folder('app')!

  // Generate global CSS
  const globalCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: ${formData.primaryColor};
  --secondary-color: ${formData.secondaryColor};
}

body {
  @apply antialiased;
}
`
  appDir.file('globals.css', globalCSS)

  // Generate layout.tsx
  const layout = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${formData.businessName || 'My Website'}',
  description: '${formData.metaDescription || formData.tagline || 'A modern website'}',
  keywords: '${formData.seoKeywords?.join(', ') || ''}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`
  appDir.file('layout.tsx', layout)

  // Generate page.tsx
  const homePage = `export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-4">
        <nav className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold">${formData.businessName || 'Your Brand'}</div>
          <ul className="flex gap-6">
            ${formData.pages.map(page => `<li><a href="#${page.toLowerCase()}" className="hover:underline">${page}</a></li>`).join('\n            ')}
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center ${formData.layoutStyle === 'minimal' ? 'bg-white' : 'bg-gray-50'}">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--primary-color)' }}>
            ${formData.businessName || 'Welcome'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ${formData.tagline || 'Build something amazing with our platform'}
          </p>
          <button 
            className="px-8 py-4 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: 'var(--primary-color)' }}></div>
              <h3 className="text-xl font-semibold mb-2">Feature One</h3>
              <p className="text-gray-600">Amazing functionality that helps your business grow.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: 'var(--primary-color)' }}></div>
              <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
              <p className="text-gray-600">Powerful tools designed for your success.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: 'var(--primary-color)' }}></div>
              <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
              <p className="text-gray-600">Everything you need in one place.</p>
            </div>
          </div>
        </div>
      </section>

      ${formData.aboutText ? `
      {/* About Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            ${formData.aboutText}
          </p>
        </div>
      </section>
      ` : ''}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} ${formData.businessName || 'Your Company'}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
`
  appDir.file('page.tsx', homePage)

  // Create components directory
  const componentsDir = zip.folder('components')!
  
  // Add a sample component
  const buttonComponent = `interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
}

export default function Button({ children, onClick, variant = 'primary', className = '' }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105'
  const variantStyles = variant === 'primary' 
    ? 'bg-[var(--primary-color)] text-white hover:opacity-90'
    : 'bg-[var(--secondary-color)] text-white hover:opacity-90'
  
  return (
    <button 
      onClick={onClick}
      className={\`\${baseStyles} \${variantStyles} \${className}\`}
    >
      {children}
    </button>
  )
}
`
  componentsDir.file('Button.tsx', buttonComponent)

  // Create public directory
  const publicDir = zip.folder('public')!
  publicDir.file('.gitkeep', '')

  // Generate and download the ZIP
  const blob = await zip.generateAsync({ type: 'blob' })
  const filename = `${formData.businessName?.toLowerCase().replace(/\s+/g, '-') || 'my-website'}-${Date.now()}.zip`
  saveAs(blob, filename)

  return filename
}
