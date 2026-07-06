'use client'

import { StatsCard } from '@/components/shared/StatsCard'
import { Card } from '@/components/ui/card'
import { TrendingUp, Users, AlertCircle, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,543', icon: <Users className="w-6 h-6 text-white" />, color: 'bg-blue-600' },
    { label: 'Platform Revenue', value: '$345,890', icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-green-600' },
    { label: 'Pending Verification', value: '47', icon: <AlertCircle className="w-6 h-6 text-white" />, color: 'bg-yellow-600' },
    { label: 'Active Suppliers', value: '2,341', icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-purple-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's your platform overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">New supplier registered</p>
                  <p className="text-sm text-slate-500">2 hours ago</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
              Review Verifications
            </button>
            <button className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
              Check Fraud Reports
            </button>
            <button className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
              Manage Categories
            </button>
            <button className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
              View Revenue
            </button>
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Verification Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Verified</span>
              <span className="font-bold text-slate-900">2,156</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Dispute Resolution</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Resolved</span>
              <span className="font-bold text-slate-900">234/245</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
