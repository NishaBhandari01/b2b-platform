'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BuyerSidebar } from '@/components/layouts/BuyerSidebar'
import { BuyerNavbar } from '@/components/layouts/BuyerNavbar'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
      } else if (user?.role !== 'buyer') {
        router.push('/')
      }
    }
  }, [isLoading, isAuthenticated, user?.role, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (user?.role !== 'buyer') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-600">Access denied. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <BuyerSidebar />
      <div className="flex-1 flex flex-col">
        <BuyerNavbar userName={user?.name} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
