"use client"

import { useState } from 'react'
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { exportToZip } from '@/lib/exportToZip'

interface ExportButtonProps {
  formData: any
  disabled?: boolean
}

export default function ExportButton({ formData, disabled }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleExport = async () => {
    if (!formData.businessName) {
      setStatus('error')
      setMessage('Please enter a business name first')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    setExporting(true)
    setStatus('idle')
    
    try {
      const filename = await exportToZip(formData)
      setStatus('success')
      setMessage(`Downloaded: ${filename}`)
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Export failed:', error)
      setStatus('error')
      setMessage('Export failed. Please try again.')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleExport}
        disabled={disabled || exporting}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          disabled || exporting
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 hover:scale-105'
        }`}
      >
        {exporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Exporting...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Exported!
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="w-5 h-5" />
            Error
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Export as ZIP
          </>
        )}
      </button>
      
      {message && (
        <p className={`text-sm text-center ${
          status === 'success' ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}
