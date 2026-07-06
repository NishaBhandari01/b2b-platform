'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function ModerationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const reports = [
    {
      id: 1,
      type: 'Product',
      title: 'Fake Premium Widget',
      reporter: 'Buyer Account #123',
      reason: 'Suspicious/Counterfeit',
      status: 'pending',
      reported: '2024-06-12',
      severity: 'high'
    },
    {
      id: 2,
      type: 'Seller',
      title: 'Tech Corporation - Inappropriate Behavior',
      reporter: 'Buyer Account #456',
      reason: 'Harassment',
      status: 'under_review',
      reported: '2024-06-10',
      severity: 'critical'
    },
    {
      id: 3,
      type: 'Product',
      title: 'Damaged Widget Listing',
      reporter: 'Buyer Account #789',
      reason: 'Misleading Description',
      status: 'resolved',
      reported: '2024-06-08',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'Comment',
      title: 'Inappropriate Review Comment',
      reporter: 'System',
      reason: 'Offensive Language',
      status: 'pending',
      reported: '2024-06-11',
      severity: 'medium'
    },
  ]

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || r.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-muted-foreground mt-2">Review and manage reported content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Reports</p>
          <p className="text-2xl font-bold">4</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Pending</p>
          <p className="text-2xl font-bold text-blue-600">2</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600">1</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Resolved</p>
          <p className="text-2xl font-bold text-green-600">1</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
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
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{report.title}</h3>
                  <Badge className={getSeverityColor(report.severity)}>
                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {report.type} • Reported by {report.reporter}
                </p>
              </div>
              <Badge className={getStatusColor(report.status)}>
                {report.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>

            <div className="py-4 border-y border-border mb-4">
              <p className="text-sm">
                <span className="font-semibold">Reason: </span>
                {report.reason}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Reported: {report.reported}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">View Content</Button>
              {report.status !== 'resolved' && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
