'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Eye, Download, Truck } from 'lucide-react'

export default function BuyerOrders() {
  const orders = [
    {
      id: 'ORD-001',
      supplier: 'Premium Industrial Solutions',
      amount: '$15,500',
      status: 'Delivered',
      date: '2026-06-15',
      items: 50,
    },
    {
      id: 'ORD-002',
      supplier: 'Global Materials Inc',
      amount: '$8,250',
      status: 'In Transit',
      date: '2026-06-20',
      items: 100,
    },
    {
      id: 'ORD-003',
      supplier: 'Tech Components Ltd',
      amount: '$12,000',
      status: 'Processing',
      date: '2026-06-25',
      items: 75,
    },
  ]

  const handleViewDetails = (orderId: string) => {
    alert(`Order Details: ${orderId}\n\nShowing complete order information and invoice.`)
  }

  const handleDownloadInvoice = (orderId: string) => {
    alert(`Downloading invoice for ${orderId}...`)
  }

  const handleTrackOrder = (orderId: string) => {
    alert(`Tracking Order: ${orderId}\n\nShowing real-time tracking information.`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'In Transit':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-600 mt-1">Track and manage your purchases</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Order ID</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Supplier</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Items</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Date</th>
                <th className="text-left py-4 px-4 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-900">{order.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-900">{order.supplier}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-900 font-medium">{order.amount}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-600">{order.items} units</p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={order.status === 'Delivered' ? 'success' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-600">{order.date}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="p-2 hover:bg-slate-200 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="p-2 hover:bg-slate-200 rounded transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="p-2 hover:bg-blue-100 rounded transition-colors"
                          title="Track Order"
                        >
                          <Truck className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
