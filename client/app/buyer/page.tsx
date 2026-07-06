'use client'

import { StatsCard } from '@/components/shared/StatsCard'
import { Card } from '@/components/ui/card'
import { ShoppingCart, FileText, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function BuyerDashboard() {
  const stats = [
    { label: 'Active RFQs', value: '8', icon: <FileText className="w-6 h-6 text-white" />, color: 'bg-blue-600' },
    { label: 'Saved Suppliers', value: '45', icon: <Heart className="w-6 h-6 text-white" />, color: 'bg-red-600' },
    { label: 'Orders This Month', value: '$125,450', icon: <ShoppingCart className="w-6 h-6 text-white" />, color: 'bg-green-600' },
    { label: 'Supplier Network', value: '127', icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-purple-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Buyer Dashboard</h1>
          <p className="text-slate-600 mt-2">Find and connect with quality suppliers</p>
        </div>
        <Link href="/buyer/rfqs">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            + Create RFQ
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
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-lg hover:bg-purple-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">Order #ORD-{12000 + i}</p>
                    <p className="text-sm text-slate-500">Plastic Components Ltd</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    i === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {i === 1 ? 'Delivered' : 'In Transit'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">${45000 + (i * 5000)}</span>
                  <span className="text-xs text-slate-500">{5 - i} days ago</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Spending Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-600 mb-1">YTD Spending</p>
              <p className="text-2xl font-bold text-slate-900">$2.45M</p>
              <p className="text-xs text-slate-500 mt-2">↑ 23% vs last year</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-slate-600 mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-900">$35,400</p>
              <p className="text-xs text-slate-500 mt-2">↑ 8% vs last month</p>
            </div>

            <Link href="/buyer/history">
              <button className="w-full px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm text-slate-900">
                View Full History
              </button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Top Suppliers */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Your Top Suppliers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg"></div>
                <div>
                  <p className="font-semibold text-slate-900">Supplier {i}</p>
                  <p className="text-xs text-slate-500">Verified ✓</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rating: 4.8/5</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Best</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
