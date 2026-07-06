'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Heart, Star, MessageSquare, Eye } from 'lucide-react'

export default function BuyerFavorites() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      company: 'Premium Industrial Solutions',
      category: 'Industrial Equipment',
      rating: 4.8,
      reviews: 245,
      minOrder: '$5,000',
      image: 'PIS',
    },
    {
      id: 2,
      company: 'Global Materials Inc',
      category: 'Raw Materials',
      rating: 4.6,
      reviews: 189,
      minOrder: '$2,000',
      image: 'GMI',
    },
    {
      id: 3,
      company: 'Tech Components Ltd',
      category: 'Electronics',
      rating: 4.9,
      reviews: 312,
      minOrder: '$1,000',
      image: 'TCL',
    },
  ])

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((f) => f.id !== id))
    alert('Supplier removed from favorites')
  }

  const handleViewProfile = (company: string) => {
    alert(`Viewing profile for: ${company}\n\nShowing detailed supplier information.`)
  }

  const handleSendMessage = (company: string) => {
    alert(`Starting conversation with ${company}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Saved Suppliers</h1>
        <p className="text-slate-600 mt-1">Your favorite and most-used suppliers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((supplier) => (
          <Card key={supplier.id} className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {supplier.image}
              </div>
              <button
                onClick={() => handleRemoveFavorite(supplier.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <h3 className="font-semibold text-slate-900 mb-1">{supplier.company}</h3>
            <p className="text-sm text-slate-600 mb-3">{supplier.category}</p>

            <div className="flex items-center gap-1 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(supplier.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-900">{supplier.rating}</span>
              <span className="text-sm text-slate-600">({supplier.reviews})</span>
            </div>

            <p className="text-sm text-slate-600 mb-4">Min Order: {supplier.minOrder}</p>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleViewProfile(supplier.company)}
                className="flex-1 px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </button>
              <button
                onClick={() => handleSendMessage(supplier.company)}
                className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
