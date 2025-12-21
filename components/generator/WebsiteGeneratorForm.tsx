"use client"

import { useState, useEffect } from 'react'
import { 
  Palette, 
  Layout, 
  Target, 
  Users, 
  Zap, 
  Globe, 
  ShoppingCart, 
  Mail, 
  Image,
  Code,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Undo2,
  Redo2
} from 'lucide-react'
import ExportButton from '@/components/generator/ExportButton'
import DeployButton from '@/components/generator/DeployButton'
import { useUndoRedo } from '@/hooks/useUndoRedo'

type SiteType = 'business' | 'ecommerce' | 'portfolio' | 'blog' | 'landing' | 'saas' | 'restaurant' | 'nonprofit'
type ColorScheme = 'modern' | 'professional' | 'vibrant' | 'minimal' | 'dark' | 'elegant' | 'playful' | 'custom'
type LayoutStyle = 'classic' | 'modern' | 'magazine' | 'minimal' | 'split' | 'sidebar' | 'fullwidth'

interface FormData {
  // Basic Info
  businessName: string
  tagline: string
  industry: string
  siteType: SiteType[]
  
  // Branding & Design
  colorScheme: ColorScheme
  primaryColor: string
  secondaryColor: string
  layoutStyle: LayoutStyle
  logoUrl?: string
  brandKeywords: string[]
  
  // Content & Goals
  targetAudience: string
  mainGoals: string[]
  keyServices: string[]
  aboutText: string
  
  // Features & Functionality
  features: {
    contact: boolean
    newsletter: boolean
    blog: boolean
    ecommerce: boolean
    booking: boolean
    gallery: boolean
    testimonials: boolean
    team: boolean
    faq: boolean
    chat: boolean
    analytics: boolean
    seo: boolean
  }
  
  // Pages
  pages: string[]
  customPages: string
  
  // SEO & Marketing
  seoKeywords: string[]
  metaDescription: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  
  // Technical
  hostingPreference: 'vercel' | 'netlify' | 'aws' | 'other'
  customDomain?: string
  integrations: string[]
  
  // Analytics & Tracking
  analytics: {
    google?: string
    facebook?: string
    hotjar?: string
  }
}

const siteTypeOptions: { value: SiteType; label: string; icon: any; description: string }[] = [
  { value: 'business', label: 'Business Site', icon: Globe, description: 'Corporate or small business website' },
  { value: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart, description: 'Online store with products' },
  { value: 'portfolio', label: 'Portfolio', icon: Image, description: 'Showcase your work' },
  { value: 'blog', label: 'Blog', icon: Mail, description: 'Content-focused site' },
  { value: 'landing', label: 'Landing Page', icon: Target, description: 'Single-page conversion site' },
  { value: 'saas', label: 'SaaS', icon: Code, description: 'Software as a service platform' },
  { value: 'restaurant', label: 'Restaurant', icon: Users, description: 'Menu and ordering system' },
  { value: 'nonprofit', label: 'Non-Profit', icon: Sparkles, description: 'Charity or organization' },
]

const colorSchemeOptions: { value: ColorScheme; label: string; colors: string[] }[] = [
  { value: 'modern', label: 'Modern Tech', colors: ['#3B82F6', '#8B5CF6', '#EC4899'] },
  { value: 'professional', label: 'Professional', colors: ['#1E40AF', '#059669', '#7C3AED'] },
  { value: 'vibrant', label: 'Vibrant', colors: ['#F59E0B', '#EF4444', '#8B5CF6'] },
  { value: 'minimal', label: 'Minimal', colors: ['#000000', '#6B7280', '#FFFFFF'] },
  { value: 'dark', label: 'Dark Mode', colors: ['#0F172A', '#1E293B', '#7C3AED'] },
  { value: 'elegant', label: 'Elegant', colors: ['#92400E', '#065F46', '#1F2937'] },
  { value: 'playful', label: 'Playful', colors: ['#F472B6', '#FBBF24', '#34D399'] },
  { value: 'custom', label: 'Custom', colors: [] },
]

const layoutStyleOptions: { value: LayoutStyle; label: string }[] = [
  { value: 'classic', label: 'Classic Grid' },
  { value: 'modern', label: 'Modern Asymmetric' },
  { value: 'magazine', label: 'Magazine Style' },
  { value: 'minimal', label: 'Minimal Clean' },
  { value: 'split', label: 'Split Screen' },
  { value: 'sidebar', label: 'Sidebar Layout' },
  { value: 'fullwidth', label: 'Full Width' },
]

const defaultFeatures = [
  { key: 'contact', label: 'Contact Form', description: 'Let visitors reach you' },
  { key: 'newsletter', label: 'Newsletter Signup', description: 'Build your email list' },
  { key: 'blog', label: 'Blog System', description: 'Content management' },
  { key: 'ecommerce', label: 'E-Commerce', description: 'Sell products online' },
  { key: 'booking', label: 'Booking System', description: 'Schedule appointments' },
  { key: 'gallery', label: 'Photo Gallery', description: 'Showcase images' },
  { key: 'testimonials', label: 'Testimonials', description: 'Social proof section' },
  { key: 'team', label: 'Team Section', description: 'Introduce your team' },
  { key: 'faq', label: 'FAQ Section', description: 'Common questions' },
  { key: 'chat', label: 'Live Chat', description: 'Real-time support' },
  { key: 'analytics', label: 'Analytics', description: 'Track visitors' },
  { key: 'seo', label: 'SEO Optimization', description: 'Search engine ready' },
]

const defaultPages = [
  'Home',
  'About',
  'Services',
  'Contact',
  'Blog',
  'Portfolio',
  'Team',
  'Testimonials',
  'Pricing',
  'FAQ',
]

interface WebsiteGeneratorFormProps {
  initialData?: Partial<FormData>
  onChange?: (data: FormData) => void
}

export default function WebsiteGeneratorForm({ initialData, onChange }: WebsiteGeneratorFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))
  
  const initialFormData: FormData = {
    businessName: '',
    tagline: '',
    industry: '',
    siteType: [],
    colorScheme: 'modern',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    layoutStyle: 'modern',
    brandKeywords: [],
    targetAudience: '',
    mainGoals: [],
    keyServices: [],
    aboutText: '',
    features: {
      contact: true,
      newsletter: true,
      blog: false,
      ecommerce: false,
      booking: false,
      gallery: false,
      testimonials: true,
      team: false,
      faq: true,
      chat: false,
      analytics: true,
      seo: true,
    },
    pages: ['Home', 'About', 'Services', 'Contact'],
    customPages: '',
    seoKeywords: [],
    metaDescription: '',
    socialLinks: {},
    hostingPreference: 'vercel',
    integrations: [],
    analytics: {},
    ...initialData,
  }

  const {
    state: formData,
    setState: setFormData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<FormData>(initialFormData)

  const [generating, setGenerating] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [serviceInput, setServiceInput] = useState('')
  const [goalInput, setGoalInput] = useState('')
  const [seoKeywordInput, setSeoKeywordInput] = useState('')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange?.(newData)
  }

  const toggleSiteType = (type: SiteType) => {
    const current = formData.siteType
    if (current.includes(type)) {
      updateField('siteType', current.filter(t => t !== type))
    } else {
      updateField('siteType', [...current, type])
    }
  }

  const toggleFeature = (feature: keyof FormData['features']) => {
    updateField('features', {
      ...formData.features,
      [feature]: !formData.features[feature]
    })
  }

  const togglePage = (page: string) => {
    const current = formData.pages
    if (current.includes(page)) {
      updateField('pages', current.filter(p => p !== page))
    } else {
      updateField('pages', [...current, page])
    }
  }

  const addArrayItem = (field: 'brandKeywords' | 'keyServices' | 'mainGoals' | 'seoKeywords', value: string) => {
    if (value.trim()) {
      updateField(field, [...formData[field], value.trim()])
    }
  }

  const removeArrayItem = (field: 'brandKeywords' | 'keyServices' | 'mainGoals' | 'seoKeywords', index: number) => {
    updateField(field, formData[field].filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    
    try {
      // TODO: Send to API endpoint to generate site
      const response = await fetch('/api/generator/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      console.log('Generated site:', result)
      
      // Redirect to preview or dashboard
      // window.location.href = `/generator/preview/${result.id}`
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const SectionHeader = ({ title, section, icon: Icon }: { title: string; section: string; icon: any }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      </div>
      {expandedSections.has(section) ? (
        <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-violet-400 transition" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-400 transition" />
      )}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 space-y-6">
        
        {/* Undo/Redo Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                canUndo
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                canRedo
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>
          <div className="text-xs text-slate-500 hidden md:block">
            <span className="px-2 py-1 bg-slate-800 rounded">Ctrl+Z</span> to undo · 
            <span className="px-2 py-1 bg-slate-800 rounded ml-1">Ctrl+Y</span> to redo
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="space-y-4">
          <SectionHeader title="Basic Information" section="basic" icon={Globe} />
          {expandedSections.has('basic') && (
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={e => updateField('businessName', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => updateField('tagline', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Building the future, today"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => updateField('industry', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Technology, Healthcare, Finance, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Site Type *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {siteTypeOptions.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => toggleSiteType(type.value)}
                      className={`p-3 rounded-lg border-2 transition ${
                        formData.siteType.includes(type.value)
                          ? 'border-violet-500 bg-violet-500/20'
                          : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mx-auto mb-1 ${
                        formData.siteType.includes(type.value) ? 'text-violet-400' : 'text-slate-400'
                      }`} />
                      <div className="text-xs font-medium text-slate-200">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Branding & Design */}
        <div className="space-y-4">
          <SectionHeader title="Branding & Design" section="branding" icon={Palette} />
          {expandedSections.has('branding') && (
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Color Scheme</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {colorSchemeOptions.map(scheme => (
                    <button
                      key={scheme.value}
                      type="button"
                      onClick={() => updateField('colorScheme', scheme.value)}
                      className={`p-3 rounded-lg border-2 transition ${
                        formData.colorScheme === scheme.value
                          ? 'border-violet-500 bg-violet-500/20'
                          : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex gap-1 mb-2 justify-center">
                        {scheme.colors.length > 0 ? scheme.colors.map((color, i) => (
                          <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                        )) : (
                          <Palette className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-200">{scheme.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.colorScheme === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={e => updateField('primaryColor', e.target.value)}
                      className="w-full h-12 rounded-lg border border-slate-600 bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Secondary Color</label>
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={e => updateField('secondaryColor', e.target.value)}
                      className="w-full h-12 rounded-lg border border-slate-600 bg-slate-900"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Layout Style</label>
                <select
                  value={formData.layoutStyle}
                  onChange={e => updateField('layoutStyle', e.target.value as LayoutStyle)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                >
                  {layoutStyleOptions.map(style => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Brand Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addArrayItem('brandKeywords', keywordInput)
                        setKeywordInput('')
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                    placeholder="innovative, reliable, creative..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('brandKeywords', keywordInput)
                      setKeywordInput('')
                    }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.brandKeywords.map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm flex items-center gap-2">
                      {keyword}
                      <button type="button" onClick={() => removeArrayItem('brandKeywords', i)} className="text-slate-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content & Goals */}
        <div className="space-y-4">
          <SectionHeader title="Content & Goals" section="content" icon={Target} />
          {expandedSections.has('content') && (
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={e => updateField('targetAudience', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                  placeholder="Small business owners, Tech professionals, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Main Goals</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addArrayItem('mainGoals', goalInput)
                        setGoalInput('')
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                    placeholder="Generate leads, showcase work, sell products..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('mainGoals', goalInput)
                      setGoalInput('')
                    }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.mainGoals.map((goal, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm flex items-center gap-2">
                      {goal}
                      <button type="button" onClick={() => removeArrayItem('mainGoals', i)} className="text-slate-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Key Services/Products</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={e => setServiceInput(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addArrayItem('keyServices', serviceInput)
                        setServiceInput('')
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                    placeholder="Web development, Consulting, Products..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('keyServices', serviceInput)
                      setServiceInput('')
                    }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keyServices.map((service, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm flex items-center gap-2">
                      {service}
                      <button type="button" onClick={() => removeArrayItem('keyServices', i)} className="text-slate-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">About Your Business</label>
                <textarea
                  value={formData.aboutText}
                  onChange={e => updateField('aboutText', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                  placeholder="Tell us about your business, mission, and what makes you unique..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Features & Functionality */}
        <div className="space-y-4">
          <SectionHeader title="Features & Functionality" section="features" icon={Zap} />
          {expandedSections.has('features') && (
            <div className="space-y-4 pl-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {defaultFeatures.map(feature => (
                  <button
                    key={feature.key}
                    type="button"
                    onClick={() => toggleFeature(feature.key as keyof FormData['features'])}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      formData.features[feature.key as keyof FormData['features']]
                        ? 'border-violet-500 bg-violet-500/20'
                        : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        formData.features[feature.key as keyof FormData['features']]
                          ? 'text-violet-400'
                          : 'text-slate-600'
                      }`} />
                      <div>
                        <div className="font-medium text-slate-200 text-sm">{feature.label}</div>
                        <div className="text-xs text-slate-400 mt-1">{feature.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pages */}
        <div className="space-y-4">
          <SectionHeader title="Pages & Structure" section="pages" icon={Layout} />
          {expandedSections.has('pages') && (
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Pages</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {defaultPages.map(page => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => togglePage(page)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        formData.pages.includes(page)
                          ? 'border-violet-500 bg-violet-500/20 text-violet-200'
                          : 'border-slate-600 bg-slate-900/30 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Additional Custom Pages</label>
                <textarea
                  value={formData.customPages}
                  onChange={e => updateField('customPages', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter custom page names (one per line)"
                />
              </div>
            </div>
          )}
        </div>

        {/* SEO & Marketing */}
        <div className="space-y-4">
          <SectionHeader title="SEO & Marketing" section="seo" icon={Target} />
          {expandedSections.has('seo') && (
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">SEO Keywords</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={seoKeywordInput}
                    onChange={e => setSeoKeywordInput(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addArrayItem('seoKeywords', seoKeywordInput)
                        setSeoKeywordInput('')
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                    placeholder="web design, app development..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('seoKeywords', seoKeywordInput)
                      setSeoKeywordInput('')
                    }}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seoKeywords.map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm flex items-center gap-2">
                      {keyword}
                      <button type="button" onClick={() => removeArrayItem('seoKeywords', i)} className="text-slate-400 hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={e => updateField('metaDescription', e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                  placeholder="Brief description for search engines (max 160 characters)"
                />
                <div className="text-xs text-slate-400 mt-1">{formData.metaDescription.length}/160 characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Social Media Links</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(platform => (
                    <input
                      key={platform}
                      type="url"
                      value={formData.socialLinks[platform as keyof typeof formData.socialLinks] || ''}
                      onChange={e => updateField('socialLinks', {
                        ...formData.socialLinks,
                        [platform]: e.target.value
                      })}
                      className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Settings */}
        <div className="space-y-4">
          <SectionHeader title="Technical Settings" section="technical" icon={Code} />
          {expandedSections.has('technical') && (
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hosting Preference</label>
                <select
                  value={formData.hostingPreference}
                  onChange={e => updateField('hostingPreference', e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                >
                  <option value="vercel">Vercel (Recommended)</option>
                  <option value="netlify">Netlify</option>
                  <option value="aws">AWS</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Custom Domain (Optional)</label>
                <input
                  type="text"
                  value={formData.customDomain || ''}
                  onChange={e => updateField('customDomain', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                  placeholder="www.yourdomain.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Analytics IDs (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.analytics.google || ''}
                    onChange={e => updateField('analytics', {
                      ...formData.analytics,
                      google: e.target.value
                    })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                    placeholder="Google Analytics ID (G-XXXXXXXXXX)"
                  />
                  <input
                    type="text"
                    value={formData.analytics.facebook || ''}
                    onChange={e => updateField('analytics', {
                      ...formData.analytics,
                      facebook: e.target.value
                    })}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-violet-500"
                    placeholder="Facebook Pixel ID"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-700 space-y-4">
          {/* Primary Generate Button */}
          <button
            type="submit"
            disabled={generating || !formData.businessName || formData.siteType.length === 0}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Your Website...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My Website
              </>
            )}
          </button>
          
          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExportButton formData={formData} disabled={!formData.businessName} />
            <DeployButton formData={formData} disabled={!formData.businessName} />
          </div>
          
          <p className="text-center text-sm text-slate-400 mt-4">
            Your website will be generated and ready for preview in ~30 seconds
          </p>
        </div>
      </div>
    </form>
  )
}
