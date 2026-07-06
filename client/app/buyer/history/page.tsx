'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Clock, Package, MessageSquare, Eye } from 'lucide-react'

export default function BuyerHistory() {
  const activities = [
    {
      id: 1,
      type: 'order',
      title: 'Order Placed',
      description: 'Ordered 50 units from Premium Industrial Solutions',
      amount: '$15,500',
      timestamp: '2026-06-25 10:30 AM',
      status: 'completed',
    },
    {
      id: 2,
      type: 'rfq',
      title: 'RFQ Created',
      description: 'Created RFQ for Industrial Pumps - 50 Units',
      amount: '$25,000 - $35,000',
      timestamp: '2026-06-20 02:15 PM',
      status: 'completed',
    },
    {
      id: 3,
      type: 'message',
      title: 'Message Sent',
      description: 'Negotiated pricing with Global Materials Inc',
      amount: '8 messages',
      timestamp: '2026-06-18 11:45 AM',
      status: 'completed',
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Delivered',
      description: 'Order ORD-001 delivered successfully',
      amount: '$12,000',
      timestamp: '2026-06-15 03:20 PM',
      status: 'completed',
    },
    {
      id: 5,
      type: 'rfq',
      title: 'RFQ Closed',
      description: 'RFQ-003 for Electronic Components closed',
      amount: '15 responses received',
      timestamp: '2026-06-10 09:00 AM',
      status: 'completed',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5" />
      case 'rfq':
        return <Eye className="w-5 h-5" />
      case 'message':
        return <MessageSquare className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600'
      case 'rfq':
        return 'bg-purple-100 text-purple-600'
      case 'message':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Activity History</h1>
        <p className="text-slate-600 mt-1">Complete timeline of your activities and transactions</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{activity.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                  </div>
                  <Badge variant="success">{activity.status === 'completed' ? 'Completed' : 'Pending'}</Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.timestamp}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{activity.amount}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
