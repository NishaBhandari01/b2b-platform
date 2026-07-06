'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Heart, ShoppingCart, MessageSquare, History, MapPin, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const menuItems = [
  { label: 'Dashboard', href: '/buyer', icon: LayoutDashboard },
  { label: 'Create RFQ', href: '/buyer/rfqs', icon: FileText },
  { label: 'Saved Suppliers', href: '/buyer/favorites', icon: Heart },
  { label: 'Purchase Orders', href: '/buyer/orders', icon: ShoppingCart },
  { label: 'Messages', href: '/buyer/messages', icon: MessageSquare },
  { label: 'Order History', href: '/buyer/history', icon: History },
  { label: 'Addresses', href: '/buyer/addresses', icon: MapPin },
]

export function BuyerSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <Link href="/buyer" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🛍️</span>
          </div>
          <div>
            <p className="font-bold text-slate-900">TradeHub</p>
            <p className="text-xs text-slate-500">Buyer Portal</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
