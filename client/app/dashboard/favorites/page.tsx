'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Trash2 } from 'lucide-react'

export default function FavoritesPage() {
  const favorites = [
    { id: 1, name: 'Premium Widget Pro', supplier: 'Tech Corporation', price: '$299', rating: 4.8 },
    { id: 2, name: 'Industrial Widget X', supplier: 'Manufacturing Inc', price: '$149', rating: 4.5 },
    { id: 3, name: 'Standard Widget Plus', supplier: 'Widget Solutions', price: '$99', rating: 4.3 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground mt-2">Your favorite products and suppliers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="aspect-video bg-secondary rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{item.supplier}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">{item.price}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Contact Supplier</Button>
              <Button variant="outline" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
