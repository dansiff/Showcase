"use client"

import { useState } from 'react'
import { 
  Sparkles, 
  ShoppingCart, 
  Briefcase, 
  Camera, 
  Code, 
  Utensils,
  Heart,
  Newspaper,
  Check,
  Star
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: any
  preview: string
  colors: { primary: string; secondary: string }
  features: string[]
  popular?: boolean
  recommended?: boolean
}

const templates: Template[] = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Clean and professional design perfect for corporate websites',
    category: 'business',
    icon: Briefcase,
    preview: '/images/templates/business.jpg',
    colors: { primary: '#2563EB', secondary: '#7C3AED' },
    features: ['Contact Form', 'Team Section', 'Services Grid', 'Testimonials'],
    popular: true,
    recommended: true,
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'Full-featured online store with cart and checkout',
    category: 'ecommerce',
    icon: ShoppingCart,
    preview: '/images/templates/ecommerce.jpg',
    colors: { primary: '#DC2626', secondary: '#F59E0B' },
    features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Reviews'],
    popular: true,
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase your work with stunning visuals and animations',
    category: 'portfolio',
    icon: Camera,
    preview: '/images/templates/portfolio.jpg',
    colors: { primary: '#8B5CF6', secondary: '#EC4899' },
    features: ['Gallery Grid', 'Project Details', 'About Me', 'Contact'],
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    description: 'Modern SaaS landing page with pricing and features',
    category: 'saas',
    icon: Code,
    preview: '/images/templates/saas.jpg',
    colors: { primary: '#0EA5E9', secondary: '#6366F1' },
    features: ['Hero Section', 'Pricing Table', 'Features', 'CTA Blocks'],
    recommended: true,
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant & Menu',
    description: 'Beautiful food presentation with online ordering',
    category: 'restaurant',
    icon: Utensils,
    preview: '/images/templates/restaurant.jpg',
    colors: { primary: '#F97316', secondary: '#EF4444' },
    features: ['Menu Display', 'Reservations', 'Gallery', 'Location Map'],
  },
  {
    id: 'nonprofit-cause',
    name: 'Non-Profit & Charity',
    description: 'Inspire donations with compelling storytelling',
    category: 'nonprofit',
    icon: Heart,
    preview: '/images/templates/nonprofit.jpg',
    colors: { primary: '#10B981', secondary: '#059669' },
    features: ['Donation Form', 'Impact Stories', 'Events', 'Volunteer'],
  },
  {
    id: 'minimal-blog',
    name: 'Minimal Blog',
    description: 'Clean reading experience focused on content',
    category: 'blog',
    icon: Newspaper,
    preview: '/images/templates/blog.jpg',
    colors: { primary: '#64748B', secondary: '#475569' },
    features: ['Article Layout', 'Categories', 'Author Bio', 'Comments'],
  },
  {
    id: 'agency-landing',
    name: 'Agency Landing',
    description: 'High-converting landing page for services',
    category: 'landing',
    icon: Sparkles,
    preview: '/images/templates/landing.jpg',
    colors: { primary: '#F59E0B', secondary: '#EF4444' },
    features: ['Hero Video', 'Case Studies', 'Lead Form', 'Social Proof'],
    popular: true,
  },
]

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'business', label: 'Business' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'saas', label: 'SaaS' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'blog', label: 'Blog' },
  ]

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Start with a Template
        </h3>
        <p className="text-slate-400">
          Choose a pre-built design and customize it to match your brand
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon
          return (
            <div
              key={template.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                {template.popular && (
                  <span className="px-2 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Popular
                  </span>
                )}
                {template.recommended && (
                  <span className="px-2 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              {/* Preview Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                  }}
                />
                <Icon className="w-16 h-16 text-white/40" />
                
                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors shadow-lg"
                  >
                    Use This Template
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {template.name}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {template.description}
                  </p>
                </div>

                {/* Color Palette */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Colors:</span>
                  <div className="flex gap-1">
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: template.colors.secondary }}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="w-3 h-3 text-green-400" />
                      {feature}
                    </div>
                  ))}
                  {template.features.length > 3 && (
                    <div className="text-xs text-purple-400">
                      +{template.features.length - 3} more features
                    </div>
                  )}
                </div>

                {/* Select Button (Mobile) */}
                <button
                  onClick={() => onSelectTemplate(template)}
                  className="w-full mt-2 px-4 py-2 bg-slate-700/50 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors md:hidden"
                >
                  Select Template
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No templates found in this category</p>
        </div>
      )}
    </div>
  )
}
