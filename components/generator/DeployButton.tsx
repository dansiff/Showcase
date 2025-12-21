"use client"

import { useState } from 'react'
import { Rocket, Loader2, CheckCircle2, ExternalLink, X } from 'lucide-react'

interface DeployButtonProps {
  formData: any
  disabled?: boolean
}

const platforms = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Optimal for Next.js - Zero config deployment',
    color: 'bg-black hover:bg-gray-900',
    logo: '▲',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Fast global CDN with continuous deployment',
    color: 'bg-teal-600 hover:bg-teal-700',
    logo: '◆',
  },
  {
    id: 'aws',
    name: 'AWS Amplify',
    description: 'Enterprise-grade infrastructure',
    color: 'bg-orange-600 hover:bg-orange-700',
    logo: 'AWS',
  },
]

export default function DeployButton({ formData, disabled }: DeployButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const handleDeploy = async (platformId: string) => {
    if (!formData.businessName) {
      alert('Please enter a business name first')
      return
    }

    setDeploying(true)
    setSelectedPlatform(platformId)
    
    try {
      // Simulate deployment API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In production, this would call your deployment API
      const deployUrl = `https://${formData.businessName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${platformId}.app`
      
      alert(`Deployment initiated!\n\nYour site will be available at:\n${deployUrl}\n\nCheck your email for updates.`)
      setShowModal(false)
    } catch (error) {
      console.error('Deploy failed:', error)
      alert('Deployment failed. Please try again.')
    } finally {
      setDeploying(false)
      setSelectedPlatform(null)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          disabled
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:scale-105'
        }`}
      >
        <Rocket className="w-5 h-5" />
        Deploy Website
      </button>

      {/* Deployment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-blue-400" />
                  Deploy Your Website
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Choose a hosting platform to deploy {formData.businessName}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={deploying}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Platforms */}
            <div className="p-6 space-y-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleDeploy(platform.id)}
                  disabled={deploying}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    deploying && selectedPlatform === platform.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : deploying
                      ? 'border-slate-700 opacity-50 cursor-not-allowed'
                      : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-white font-bold text-sm`}>
                          {platform.logo}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="ml-13 mt-3 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                          Free tier available
                        </span>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                          SSL included
                        </span>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                          Custom domains
                        </span>
                      </div>
                    </div>

                    {deploying && selectedPlatform === platform.id ? (
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin flex-shrink-0 mt-2" />
                    ) : (
                      <ExternalLink className="w-5 h-5 text-slate-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-slate-800/50">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Your website will be built and optimized</li>
                    <li>• You'll receive a live URL within minutes</li>
                    <li>• Automatic SSL certificate will be provisioned</li>
                    <li>• You can connect a custom domain later</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
