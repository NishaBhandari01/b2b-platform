'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Package, Zap, MessageSquare, BarChart3, Plus, FileText, Heart, Users, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth()

  // Supplier Dashboard
  if (user?.role === 'supplier') {
    const stats = [
      { label: 'Total Products', value: '156', icon: Package, color: 'bg-blue-500' },
      { label: 'Active Leads', value: '42', icon: Zap, color: 'bg-purple-500' },
      { label: 'Pending RFQs', value: '12', icon: MessageSquare, color: 'bg-orange-500' },
      { label: 'Revenue (MTD)', value: '$45.2K', icon: TrendingUp, color: 'bg-green-500' },
    ]

    const recentActivity = [
      { id: 1, type: 'RFQ', message: 'New RFQ from ABC Corp for Industrial Machinery', time: '2 hours ago' },
      { id: 2, type: 'Lead', message: 'Lead follow-up reminder for Electronics products', time: '5 hours ago' },
      { id: 3, type: 'Message', message: 'New message from buyer regarding pricing', time: '1 day ago' },
    ]

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-b-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{activity.type[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/dashboard/products">
                  <Button className="w-full gap-2 justify-start">
                    <Plus className="w-4 h-4" />
                    Add New Product
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2 justify-start">
                  <Zap className="w-4 h-4" />
                  View Leads
                </Button>
                <Button variant="outline" className="w-full gap-2 justify-start">
                  <MessageSquare className="w-4 h-4" />
                  Check RFQs
                </Button>
                <Button variant="outline" className="w-full gap-2 justify-start">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Buyer Dashboard
  if (user?.role === 'buyer') {
    const stats = [
      { label: 'Active RFQs', value: '8', icon: FileText, color: 'bg-blue-500' },
      { label: 'Saved Suppliers', value: '23', icon: Heart, color: 'bg-red-500' },
      { label: 'Unread Messages', value: '5', icon: MessageSquare, color: 'bg-purple-500' },
      { label: 'Saved Products', value: '156', icon: TrendingUp, color: 'bg-green-500' },
    ]

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Manage your purchases and supplier relationships</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button className="w-full gap-2 justify-start">
              <Plus className="w-4 h-4" />
              Create New RFQ
            </Button>
            <Button variant="outline" className="w-full gap-2 justify-start">
              <Heart className="w-4 h-4" />
              View Favorites
            </Button>
            <Button variant="outline" className="w-full gap-2 justify-start">
              <MessageSquare className="w-4 h-4" />
              Messages
            </Button>
            <Link href="/products">
              <Button variant="outline" className="w-full gap-2 justify-start">
                <TrendingUp className="w-4 h-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    const stats = [
      { label: 'Total Users', value: '12,450', icon: Users, color: 'bg-blue-500' },
      { label: 'Total Products', value: '45.2K', icon: Package, color: 'bg-purple-500' },
      { label: 'Revenue (MTD)', value: '$128.5K', icon: DollarSign, color: 'bg-green-500' },
      { label: 'Pending Verifications', value: '38', icon: AlertCircle, color: 'bg-orange-500' },
    ]

    const pendingTasks = [
      { id: 1, type: 'Verification', title: 'TechCorp Industries', status: 'Pending', priority: 'High' },
      { id: 2, type: 'Moderation', title: 'Suspicious Product Listing', status: 'Review', priority: 'High' },
      { id: 3, type: 'Fraud', title: 'Unusual Payment Pattern', status: 'Investigation', priority: 'Medium' },
    ]

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform activity and manage operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Pending Actions</h2>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{task.type[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.type}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Management</h2>
            <div className="space-y-3">
              <Button className="w-full gap-2 justify-start" variant="outline">
                <Users className="w-4 h-4" />
                User Management
              </Button>
              <Button className="w-full gap-2 justify-start" variant="outline">
                <CheckCircle className="w-4 h-4" />
                Verifications
              </Button>
              <Button className="w-full gap-2 justify-start" variant="outline">
                <AlertCircle className="w-4 h-4" />
                Moderation
              </Button>
              <Button className="w-full gap-2 justify-start" variant="outline">
                <TrendingUp className="w-4 h-4" />
                Revenue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Fallback for unauthenticated users
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Please log in</h1>
      <p className="text-muted-foreground mb-6">You need to be authenticated to access the dashboard.</p>
      <Link href="/auth/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  )
}
