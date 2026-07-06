'use client'

import { StatsCard } from '@/components/shared/StatsCard'
import { Card } from '@/components/ui/card'
import { Package, Zap, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function SupplierDashboard() {
  const stats = [
    { label: 'Active Products', value: '234', icon: <Package className="w-6 h-6 text-white" />, color: 'bg-emerald-600' },
    { label: 'Hot Leads', value: '18', icon: <Zap className="w-6 h-6 text-white" />, color: 'bg-orange-600' },
    { label: 'Monthly Revenue', value: '$45,230', icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-green-600' },
    { label: 'Profile Rating', value: '4.8/5', icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-blue-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Supplier Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your business on TradeHub</p>
        </div>
        <Link href="/supplier/products">
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent RFQs */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent RFQ Requests</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-lg hover:bg-emerald-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-900">Bulk Order - Industrial Components</p>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">New</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">Buyer is looking for 500 units at wholesale price</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Expires in 2 days</span>
                  <Link href="/supplier/rfqs">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                      View Details →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Response Rate</span>
                <span className="font-bold text-slate-900">95%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Conversion Rate</span>
                <span className="font-bold text-slate-900">42%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Completion Rate</span>
                <span className="font-bold text-slate-900">89%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Section */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Upgrade to Premium</h2>
        <p className="text-slate-600 mb-4">Get featured placement, advanced analytics, and priority support</p>
        <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
          Learn More
        </button>
      </Card>
    </div>
  )
}
