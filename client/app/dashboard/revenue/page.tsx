'use client'

import { Card } from '@/components/ui/card'
import { StatsCard } from '@/components/shared/StatsCard'
import { SimpleBarChart, SimplePieChart } from '@/components/shared/SimpleChart'
import { TrendingUp } from 'lucide-react'

export default function RevenuePage() {
  const chartData = [
    { label: 'Jan', value: 32000 },
    { label: 'Feb', value: 39000 },
    { label: 'Mar', value: 42000 },
    { label: 'Apr', value: 45000 },
    { label: 'May', value: 52000 },
    { label: 'Jun', value: 58000 },
  ]

  const topSuppliers = [
    { name: 'Tech Corporation', revenue: '$125,000', growth: '+25%', transactions: 892 },
    { name: 'Manufacturing Inc', revenue: '$98,500', growth: '+18%', transactions: 654 },
    { name: 'Widget Solutions', revenue: '$76,200', growth: '+12%', transactions: 543 },
    { name: 'Industrial Plus', revenue: '$54,800', growth: '+8%', transactions: 389 },
    { name: 'Software House', revenue: '$42,300', growth: '+5%', transactions: 267 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue Analytics</h1>
        <p className="text-muted-foreground mt-2">Platform revenue and financial metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$1,247,500" 
          change="+24.5%"
          positive={true}
        />
        <StatsCard 
          title="Total Transactions" 
          value="8,234" 
          change="+18.2%"
          positive={true}
        />
        <StatsCard 
          title="Average Order Value" 
          value="$151.50" 
          change="+4.8%"
          positive={true}
        />
        <StatsCard 
          title="Platform Commission" 
          value="$124,750" 
          change="+24.5%"
          positive={true}
        />
      </div>

      {/* Revenue Trend */}
      <SimpleBarChart title="Revenue Trend (Last 6 months)" data={chartData} maxValue={60000} />

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Commission Breakdown</h2>
          <div className="space-y-4">
            {[
              { category: 'Electronics', amount: '$45,200', percentage: 36 },
              { category: 'Industrial', amount: '$32,500', percentage: 26 },
              { category: 'Software', amount: '$28,900', percentage: 23 },
              { category: 'Materials', amount: '$18,150', percentage: 15 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.category}</span>
                  <span className="font-bold">{item.amount}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
          <div className="space-y-4">
            {[
              { method: 'Bank Transfer', amount: '$756,400', percentage: 61 },
              { method: 'Credit Card', amount: '$372,150', percentage: 30 },
              { method: 'E-Wallet', amount: '$118,950', percentage: 9 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.method}</span>
                  <span className="font-bold">{item.amount}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-green-600 rounded-full h-2 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Suppliers */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Top Revenue Suppliers</h2>
        <div className="space-y-4">
          {topSuppliers.map((supplier, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors">
              <div>
                <p className="font-bold">{supplier.name}</p>
                <p className="text-sm text-muted-foreground">{supplier.transactions} transactions</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{supplier.revenue}</p>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {supplier.growth}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
