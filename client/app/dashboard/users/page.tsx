'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown, MoreVertical } from 'lucide-react'
import { useState } from 'react'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const users = [
    { id: 1, name: 'John Smith', email: 'john@techcorp.com', role: 'supplier', status: 'active', joined: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@mfg.com', role: 'supplier', status: 'active', joined: '2024-02-20' },
    { id: 3, name: 'Mike Chen', email: 'mike@retail.com', role: 'buyer', status: 'active', joined: '2024-03-10' },
    { id: 4, name: 'Emily Davis', email: 'emily@finance.com', role: 'buyer', status: 'inactive', joined: '2023-12-05' },
    { id: 5, name: 'Robert Wilson', email: 'robert@health.com', role: 'supplier', status: 'active', joined: '2024-04-01' },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage platform users and their accounts</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-secondary rounded-lg border border-input text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="supplier">Supplier</option>
            <option value="buyer">Buyer</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Name</th>
                <th className="text-left py-4 px-6 font-semibold">Email</th>
                <th className="text-center py-4 px-6 font-semibold">Role</th>
                <th className="text-center py-4 px-6 font-semibold">Status</th>
                <th className="text-left py-4 px-6 font-semibold">Joined</th>
                <th className="text-right py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-secondary/50">
                  <td className="py-4 px-6 font-medium">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="text-center py-4 px-6">
                    <Badge className={user.role === 'supplier' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td className="text-center py-4 px-6">
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{user.joined}</td>
                  <td className="text-right py-4 px-6">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
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
