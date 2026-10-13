import { Metadata } from 'next'
import MoreliaAdminDashboard from '@/components/morelia/MoreliaAdminDashboard'

export const metadata: Metadata = {
  title: 'Morelia Orders Admin | Restaurant Dashboard',
  description: 'Manage orders for Taqueria Y Birriera Morelia #2',
}

export default function MoreliaAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Morelia Orders Dashboard</h1>
          <p className="text-gray-600">Manage incoming orders and track status</p>
        </div>
        <MoreliaAdminDashboard />
      </div>
    </div>
  )
}
