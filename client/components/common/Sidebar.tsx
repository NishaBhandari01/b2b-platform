'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  Zap,
  FileText,
  DollarSign,
  Shield,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

interface SidebarProps {
  variant?: 'supplier' | 'buyer' | 'admin'
}

export function Sidebar({ variant = 'supplier' }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const supplierItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Products', href: '/dashboard/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Leads', href: '/dashboard/leads', icon: <Zap className="w-5 h-5" /> },
    { label: 'RFQs', href: '/dashboard/rfqs', icon: <FileText className="w-5 h-5" /> },
    { label: 'Messages', href: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Company', href: '/dashboard/company', icon: <Settings className="w-5 h-5" /> },
  ]

  const buyerItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'RFQs', href: '/dashboard/rfqs', icon: <FileText className="w-5 h-5" /> },
    { label: 'Favorites', href: '/dashboard/favorites', icon: <Package className="w-5 h-5" /> },
    { label: 'Messages', href: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Orders', href: '/dashboard/orders', icon: <BarChart3 className="w-5 h-5" /> },
  ]

  const adminItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Users', href: '/dashboard/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Verification', href: '/dashboard/verification', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Moderation', href: '/dashboard/moderation', icon: <AlertCircle className="w-5 h-5" /> },
    { label: 'Categories', href: '/dashboard/categories', icon: <Package className="w-5 h-5" /> },
    { label: 'Revenue', href: '/dashboard/revenue', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Fraud', href: '/dashboard/fraud', icon: <Shield className="w-5 h-5" /> },
  ]

  const items = variant === 'supplier' ? supplierItems : variant === 'buyer' ? buyerItems : adminItems

  return (
    <aside className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!collapsed && <h2 className="font-bold text-sidebar-foreground">Dashboard</h2>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {items.map((item) => {
            const isActive = pathname?.includes(item.href.split('/').pop() || '')
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  {item.icon}
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                      {item.badge && <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded">{item.badge}</span>}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {!collapsed && user && (
            <div className="px-3 py-2 text-xs">
              <p className="font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-sidebar-foreground/70 capitalize">{user.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => logout()}
          >
            {collapsed ? <LogOut className="w-4 h-4" /> : <>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
