"use client"

import { useState } from 'react'
import { PageHeader, PageFooter } from '@/components/PageHeaderFooter'
import WebsiteGeneratorForm from '@/components/generator/WebsiteGeneratorForm'
import LivePreview from '@/components/generator/LivePreview'
import TemplateGallery from '@/components/generator/TemplateGallery'
import { Sparkles, Zap, Rocket, Layout, X } from 'lucide-react'

type ColorScheme = 'modern' | 'professional' | 'vibrant' | 'minimal' | 'dark' | 'elegant' | 'playful' | 'custom'
type LayoutStyle = 'classic' | 'modern' | 'magazine' | 'minimal' | 'split' | 'sidebar' | 'fullwidth'

export default function GeneratorPage() {
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [formData, setFormData] = useState<{
    businessName: string
    tagline: string
    colorScheme: ColorScheme
    primaryColor: string
    secondaryColor: string
    layoutStyle: LayoutStyle
    siteType: any[]
    features: any
    pages: string[]
  }>({
    businessName: '',
    tagline: '',
    colorScheme: 'modern' as ColorScheme,
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    layoutStyle: 'modern' as LayoutStyle,
    siteType: [],
    features: {},
    pages: ['Home', 'About', 'Services', 'Contact'],
  })

  const handleFormChange = (newData: any) => {
    setFormData(newData)
  }

  const handleSelectTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      colorScheme: template.category,
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      businessName: prev.businessName || template.name,
    }))
    setShowTemplates(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
      
      <div className="relative z-10">
        <PageHeader 
          theme="default" 
          title="🚀 AI Website Generator" 
          subtitle="Professional sites in minutes" 
        />
        <main className="pt-8 pb-12">
          <div className="max-w-[1920px] mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-purple-200">AI-Powered Website Builder</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400 mb-4 leading-tight">
                Build Your Dream Website
              </h2>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Answer a few questions and watch AI generate a fully customized, professional website tailored to your brand and goals.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 transition-colors cursor-pointer"
                >
                  <Layout className="w-4 h-4 text-purple-300" />
                  <span className="text-sm text-purple-200 font-medium">Browse Templates</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-300">Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <Rocket className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Deploy Instantly</span>
                </div>
              </div>
            </div>
            
            {/* Split Layout: Form + Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Form Container */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl blur-xl opacity-20" />
                <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                  <WebsiteGeneratorForm 
                    initialData={formData}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Live Preview Container */}
              {showPreview && (
                <div className="relative xl:sticky xl:top-24 h-fit">
                  <LivePreview formData={formData} />
                </div>
              )}
            </div>
          </div>
        </main>
        <PageFooter theme="default" />
      </div>

      {/* Template Gallery Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-6">
              <TemplateGallery onSelectTemplate={handleSelectTemplate} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
