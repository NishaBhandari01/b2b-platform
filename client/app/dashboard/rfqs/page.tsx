'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageSquare, Check, X } from 'lucide-react'

const rfqs = [
  {
    id: '1',
    company: 'ABC Manufacturing',
    product: 'Industrial Motors',
    quantity: 500,
    deadline: '2026-07-15',
    status: 'new',
  },
  {
    id: '2',
    company: 'Tech Solutions Inc',
    product: 'LED Panels',
    quantity: 1000,
    deadline: '2026-07-10',
    status: 'quoted',
  },
  {
    id: '3',
    company: 'Global Enterprises',
    product: 'Control Systems',
    quantity: 250,
    deadline: '2026-07-05',
    status: 'negotiating',
  },
]

export default function RFQsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">RFQs</h1>
        <p className="text-muted-foreground">Request for Quotations from buyers</p>
      </div>

      <div className="space-y-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">{rfq.product}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>From: <span className="font-medium text-foreground">{rfq.company}</span></p>
                  <p>Quantity: <span className="font-medium text-foreground">{rfq.quantity} units</span></p>
                  <p>Deadline: <span className="font-medium text-foreground">{rfq.deadline}</span></p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  rfq.status === 'new' ? 'bg-blue-500/20 text-blue-700' :
                  rfq.status === 'quoted' ? 'bg-purple-500/20 text-purple-700' :
                  'bg-orange-500/20 text-orange-700'
                }`}>
                  {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                </span>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Check className="w-4 h-4" />
                    Quote
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
