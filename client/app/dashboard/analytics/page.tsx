'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { StatsCard } from '@/components/shared/StatsCard'
import { SimpleBarChart, SimplePieChart } from '@/components/shared/SimpleChart'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function AnalyticsPage() {
  const { user } = useAuth()

  const chartData = [
    { label: 'Jan', value: 4000 },
    { label: 'Feb', value: 3000 },
    { label: 'Mar', value: 2000 },
    { label: 'Apr', value: 2780 },
    { label: 'May', value: 1890 },
    { label: 'Jun', value: 2390 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your performance and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$45,231.89" 
          change="+20.1%"
          positive={true}
        />
        <StatsCard 
          title="Total Orders" 
          value="2,847" 
          change="+15.3%"
          positive={true}
        />
        <StatsCard 
          title="Total Customers" 
          value="1,234" 
          change="+4.3%"
          positive={true}
        />
        <StatsCard 
          title="Conversion Rate" 
          value="3.24%" 
          change="-2.1%"
          positive={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart title="Revenue Trend" data={chartData} maxValue={5000} />

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Top Products</h2>
            <p className="text-sm text-muted-foreground">By sales</p>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Premium Widget', sales: 2500, growth: '+12%' },
              { name: 'Standard Widget', sales: 1800, growth: '+8%' },
              { name: 'Basic Widget', sales: 1200, growth: '+5%' },
              { name: 'Pro Widget', sales: 890, growth: '-3%' },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">${product.sales.toLocaleString()}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${product.growth.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {product.growth.includes('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {product.growth}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Month</th>
                <th className="text-right py-3 px-4 font-semibold">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold">Orders</th>
                <th className="text-right py-3 px-4 font-semibold">Avg Order Value</th>
                <th className="text-right py-3 px-4 font-semibold">Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { month: 'January', revenue: '$8,234', orders: 456, aov: '$18.04', growth: '+12%' },
                { month: 'February', revenue: '$7,890', orders: 423, aov: '$18.65', growth: '+8%' },
                { month: 'March', revenue: '$6,543', orders: 389, aov: '$16.83', growth: '+3%' },
                { month: 'April', revenue: '$9,234', orders: 521, aov: '$17.71', growth: '+15%' },
                { month: 'May', revenue: '$8,901', orders: 498, aov: '$17.87', growth: '+12%' },
                { month: 'June', revenue: '$4,529', orders: 456, aov: '$9.93', growth: '+5%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-secondary/50">
                  <td className="py-3 px-4">{row.month}</td>
                  <td className="text-right py-3 px-4 font-medium">{row.revenue}</td>
                  <td className="text-right py-3 px-4">{row.orders}</td>
                  <td className="text-right py-3 px-4">{row.aov}</td>
                  <td className="text-right py-3 px-4 text-green-600 font-medium">{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
