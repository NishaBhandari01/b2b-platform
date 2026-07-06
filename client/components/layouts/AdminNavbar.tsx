'use client'

import { Bell, Search, Settings, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface AdminNavbarProps {
  userName?: string
}

export function AdminNavbar({ userName = 'Admin' }: AdminNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users, products, reports..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 ml-8">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              <div className="p-4 border-b border-slate-200">
                <p className="font-semibold text-slate-900">Notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 space-y-3">
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200 text-sm">
                    <p className="font-medium text-yellow-900">5 pending verifications</p>
                    <p className="text-yellow-800 text-xs">Urgent attention required</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                    <p className="font-medium text-blue-900">Report submission</p>
                    <p className="text-blue-800 text-xs">New fraud report submitted</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  )
}
