'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Search, Filter, ChevronDown, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function LeadsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const leads = [
    {
      id: 1,
      company: 'Tech Corporation',
      contact: 'John Smith',
      email: 'john@techcorp.com',
      phone: '+1-555-0101',
      status: 'new',
      budget: '$50,000 - $100,000',
      industry: 'Technology',
      createdAt: '2 days ago',
      products: 'Widget A, Widget B',
    },
    {
      id: 2,
      company: 'Manufacturing Inc',
      contact: 'Sarah Johnson',
      email: 'sarah@mfg.com',
      phone: '+1-555-0102',
      status: 'qualified',
      budget: '$100,000+',
      industry: 'Manufacturing',
      createdAt: '5 days ago',
      products: 'Widget B, Widget C',
    },
    {
      id: 3,
      company: 'Retail Solutions',
      contact: 'Mike Chen',
      email: 'mike@retail.com',
      phone: '+1-555-0103',
      status: 'negotiating',
      budget: '$25,000 - $50,000',
      industry: 'Retail',
      createdAt: '1 week ago',
      products: 'Widget A',
    },
    {
      id: 4,
      company: 'Finance Corp',
      contact: 'Emily Davis',
      email: 'emily@finance.com',
      phone: '+1-555-0104',
      status: 'closed',
      budget: '$150,000+',
      industry: 'Finance',
      createdAt: '2 weeks ago',
      products: 'Widget A, Widget B, Widget C',
    },
    {
      id: 5,
      company: 'Healthcare Plus',
      contact: 'Robert Wilson',
      email: 'robert@health.com',
      phone: '+1-555-0105',
      status: 'new',
      budget: '$30,000 - $75,000',
      industry: 'Healthcare',
      createdAt: '3 days ago',
      products: 'Widget B',
    },
  ]

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-yellow-100 text-yellow-800'
      case 'negotiating': return 'bg-purple-100 text-purple-800'
      case 'closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Leads</h1>
        <p className="text-muted-foreground mt-2">Manage and track your business leads</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads by company or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-secondary rounded-lg border border-input text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="negotiating">Negotiating</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
          <Button>Export</Button>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No leads found</p>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start mb-4">
                <div className="md:col-span-2">
                  <h3 className="font-bold text-lg">{lead.company}</h3>
                  <p className="text-sm text-muted-foreground">{lead.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Industry</p>
                  <p className="font-medium">{lead.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Budget</p>
                  <p className="font-medium">{lead.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                  <Badge className={`mt-1 ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">{lead.phone}</a>
                </div>
                <div className="text-muted-foreground">
                  Products: {lead.products}
                </div>
                <div className="ml-auto text-muted-foreground">
                  {lead.createdAt}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
