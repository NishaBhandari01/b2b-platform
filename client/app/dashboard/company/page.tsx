'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/useAuth'
import { Mail, Phone, MapPin, Globe, Edit2 } from 'lucide-react'
import { useState } from 'react'

export default function CompanyPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your business information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Company Header */}
      <Card className="p-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-3xl font-bold">
            TC
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tech Corporation</h2>
            <p className="text-muted-foreground mt-1">Technology & Software Solutions</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Verified</span>
              <span className="text-muted-foreground">Member since Jan 2024</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Company Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">info@techcorp.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="font-medium">123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="font-medium">www.techcorp.com</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Business Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Company Type</p>
              <p className="font-medium">B2B Supplier</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Industry</p>
              <p className="font-medium">Technology & Software</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Company Size</p>
              <p className="font-medium">50-200 Employees</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Verification Status</p>
              <p className="font-medium text-green-600">Verified on Jun 1, 2024</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Company Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          Tech Corporation is a leading provider of innovative software solutions and technological products. 
          We specialize in enterprise software, cloud services, and digital transformation solutions for businesses 
          of all sizes. With over 15 years of experience, we have served more than 1,000 clients worldwide.
        </p>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-primary">4.8</p>
          <p className="text-sm text-muted-foreground mt-2">Average Rating</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-primary">245</p>
          <p className="text-sm text-muted-foreground mt-2">Active Products</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-primary">1,823</p>
          <p className="text-sm text-muted-foreground mt-2">Total Transactions</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-primary">98%</p>
          <p className="text-sm text-muted-foreground mt-2">Delivery Success</p>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Subscription Plan</h3>
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg mb-4">
          <div>
            <p className="font-bold">Premium Seller Plan</p>
            <p className="text-sm text-muted-foreground">Enhanced visibility and features</p>
          </div>
          <div className="text-right">
            <p className="font-bold">$99/month</p>
            <p className="text-sm text-green-600">Active</p>
          </div>
        </div>
        <Button variant="outline" className="w-full">Manage Subscription</Button>
      </Card>
    </div>
  )
}
