'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import { useState } from 'react'

export default function CategoriesPage() {
  const [categories] = useState([
    { id: 1, name: 'Electronics', products: 245, sellers: 34 },
    { id: 2, name: 'Industrial Equipment', products: 189, sellers: 28 },
    { id: 3, name: 'Software & Services', products: 123, sellers: 45 },
    { id: 4, name: 'Raw Materials', products: 156, sellers: 19 },
    { id: 5, name: 'Machinery & Tools', products: 267, sellers: 52 },
    { id: 6, name: 'Office Supplies', products: 98, sellers: 23 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Categories</h1>
          <p className="text-muted-foreground mt-2">Manage platform categories</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-4">{category.name}</h3>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Products</p>
                <p className="text-2xl font-bold">{category.products}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sellers</p>
                <p className="text-2xl font-bold">{category.sellers}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
