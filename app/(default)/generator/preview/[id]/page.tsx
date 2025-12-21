"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Download, Eye, Code, Rocket, CheckCircle2, Loader2 } from 'lucide-react'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.id as string
  
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [siteData, setSiteData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'deploy'>('preview')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/generator/create?siteId=${siteId}`)
        const data = await response.json()
        
        if (data.status === 'completed') {
          setStatus('ready')
          setSiteData(data)
        } else if (data.status === 'failed') {
          setStatus('error')
        } else {
          // Still generating, check again in 2 seconds
          setTimeout(checkStatus, 2000)
        }
      } catch (error) {
        console.error('Status check failed:', error)
        setStatus('error')
      }
    }
    
    checkStatus()
  }, [siteId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-violet-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Generating Your Website</h2>
          <p className="text-slate-300">This usually takes 20-30 seconds...</p>
          <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Analyzing requirements</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Generating components</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
              <span>Building pages...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Generation Failed</h2>
          <p className="text-slate-300 mb-6">Something went wrong while generating your website.</p>
          <button
            onClick={() => router.push('/generator')}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Your Website is Ready! 🎉</h1>
              <p className="text-slate-400 text-sm mt-1">Preview, customize, or deploy your new site</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {/* TODO: Trigger download */}}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => {/* TODO: Trigger deploy */}}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
              >
                <Rocket className="w-4 h-4" />
                Deploy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === 'preview'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === 'code'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Code className="w-4 h-4" />
              View Code
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === 'deploy'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Rocket className="w-4 h-4" />
              Deploy
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'preview' && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-slate-400 text-sm">Preview: {siteData?.businessName || 'Your Site'}</span>
              </div>
            </div>
            <div className="bg-white p-8 min-h-[600px]">
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Website Preview Coming Soon
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  The live preview feature is under development. For now, you can download the code or deploy directly.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Generated Code Structure</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300">
                <div className="space-y-1">
                  <div>📁 your-website/</div>
                  <div className="pl-4">📁 app/</div>
                  <div className="pl-8">📄 page.tsx</div>
                  <div className="pl-8">📄 layout.tsx</div>
                  <div className="pl-4">📁 components/</div>
                  <div className="pl-8">📄 Header.tsx</div>
                  <div className="pl-8">📄 Footer.tsx</div>
                  <div className="pl-8">📄 Hero.tsx</div>
                  <div className="pl-4">📁 public/</div>
                  <div className="pl-4">📄 package.json</div>
                  <div className="pl-4">📄 tailwind.config.js</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Full source code is available for download. Built with Next.js 15, TypeScript, and Tailwind CSS.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Deploy Your Website</h3>
              <p className="text-slate-300 mb-6">
                Choose your preferred hosting platform to deploy your website instantly.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-6 bg-slate-900/50 border border-slate-600 rounded-lg hover:border-violet-500 transition text-center group">
                  <div className="text-4xl mb-3">▲</div>
                  <h4 className="font-semibold text-white mb-2 group-hover:text-violet-400">Vercel</h4>
                  <p className="text-sm text-slate-400">Deploy in ~2 minutes</p>
                </button>
                
                <button className="p-6 bg-slate-900/50 border border-slate-600 rounded-lg hover:border-violet-500 transition text-center group">
                  <div className="text-4xl mb-3">◆</div>
                  <h4 className="font-semibold text-white mb-2 group-hover:text-violet-400">Netlify</h4>
                  <p className="text-sm text-slate-400">Fast & easy deployment</p>
                </button>
                
                <button className="p-6 bg-slate-900/50 border border-slate-600 rounded-lg hover:border-violet-500 transition text-center group">
                  <div className="text-4xl mb-3">☁️</div>
                  <h4 className="font-semibold text-white mb-2 group-hover:text-violet-400">AWS</h4>
                  <p className="text-sm text-slate-400">Enterprise hosting</p>
                </button>
              </div>

              <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                <p className="text-violet-300 text-sm">
                  💡 <strong>Pro Tip:</strong> We recommend Vercel for the fastest deployment and best Next.js integration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
