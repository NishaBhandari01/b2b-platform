'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'

export default function VerificationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const verifications = [
    { 
      id: 1, 
      company: 'Tech Corporation', 
      registrationNum: 'TC-2024-001',
      status: 'verified',
      verifiedDate: '2024-06-01',
      submittedDate: '2024-05-28',
      documents: 5
    },
    { 
      id: 2, 
      company: 'Manufacturing Inc', 
      registrationNum: 'MI-2024-002',
      status: 'pending',
      verifiedDate: null,
      submittedDate: '2024-06-10',
      documents: 3
    },
    { 
      id: 3, 
      company: 'Retail Solutions', 
      registrationNum: 'RS-2024-003',
      status: 'rejected',
      verifiedDate: null,
      submittedDate: '2024-06-05',
      documents: 2
    },
    { 
      id: 4, 
      company: 'Widget Solutions', 
      registrationNum: 'WS-2024-004',
      status: 'under_review',
      verifiedDate: null,
      submittedDate: '2024-06-08',
      documents: 4
    },
  ]

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || v.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'under_review':
      case 'pending': return <Clock className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supplier Verification</h1>
        <p className="text-muted-foreground mt-2">Manage and review supplier verifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Submissions</p>
          <p className="text-2xl font-bold">4</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Verified</p>
          <p className="text-2xl font-bold text-green-600">1</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600">1</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Rejected</p>
          <p className="text-2xl font-bold text-red-600">1</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by company name..."
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
            <option value="verified">Verified</option>
            <option value="under_review">Under Review</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Verification List */}
      <div className="space-y-4">
        {filteredVerifications.map((v) => (
          <Card key={v.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{v.company}</h3>
                <p className="text-sm text-muted-foreground">Registration: {v.registrationNum}</p>
              </div>
              <Badge className={`flex items-center gap-2 ${getStatusColor(v.status)}`}>
                {getStatusIcon(v.status)}
                {v.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Documents</p>
                <p className="font-bold text-lg">{v.documents}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Submitted</p>
                <p className="font-medium">{v.submittedDate}</p>
              </div>
              {v.verifiedDate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Verified</p>
                  <p className="font-medium">{v.verifiedDate}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">View Documents</Button>
              {v.status === 'under_review' && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </>
              )}
              {v.status === 'pending' && (
                <Button size="sm">Review</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
