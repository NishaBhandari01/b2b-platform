'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const orders = [
    { id: 'ORD-001', supplier: 'Tech Corp', product: 'Widget A (100 units)', amount: '$5,000', status: 'delivered', date: '2024-06-15' },
    { id: 'ORD-002', supplier: 'Mfg Inc', product: 'Widget B (50 units)', amount: '$2,500', status: 'pending', date: '2024-06-10' },
    { id: 'ORD-003', supplier: 'Widget Solutions', product: 'Widget C (200 units)', amount: '$8,000', status: 'shipped', date: '2024-06-05' },
    { id: 'ORD-004', supplier: 'Tech Corp', product: 'Widget A (75 units)', amount: '$3,750', status: 'delivered', date: '2024-05-28' },
  ]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <p className="text-muted-foreground mt-2">Track your orders and shipments</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-secondary rounded-lg border border-input text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Order ID</th>
                <th className="text-left py-4 px-6 font-semibold">Supplier</th>
                <th className="text-left py-4 px-6 font-semibold">Product</th>
                <th className="text-right py-4 px-6 font-semibold">Amount</th>
                <th className="text-center py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-right py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-secondary/50">
                  <td className="py-4 px-6 font-medium">{order.id}</td>
                  <td className="py-4 px-6">{order.supplier}</td>
                  <td className="py-4 px-6">{order.product}</td>
                  <td className="text-right py-4 px-6 font-medium">{order.amount}</td>
                  <td className="text-center py-4 px-6">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{order.date}</td>
                  <td className="text-right py-4 px-6">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
