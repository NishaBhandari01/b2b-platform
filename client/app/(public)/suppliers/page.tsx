'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, MapPin, Star, BadgeCheck, TrendingUp, Filter } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils/constants'

// Mock suppliers
const mockSuppliers = [
  {
    id: '1',
    name: 'TechCorp Industries',
    category: 'Electronics',
    location: 'Shanghai, China',
    rating: 4.8,
    reviews: 234,
    yearEstablished: 2015,
    employees: '500-1000',
    verified: true,
    certifications: ['ISO 9001', 'CE'],
    responseTime: 2,
    description: 'Leading manufacturer of electronic components and LED solutions',
  },
  {
    id: '2',
    name: 'Global Manufacturing Ltd',
    category: 'Industrial Machinery',
    location: 'Mumbai, India',
    rating: 4.6,
    reviews: 156,
    yearEstablished: 2010,
    employees: '200-500',
    verified: true,
    certifications: ['ISO 14001', 'OSHA'],
    responseTime: 4,
    description: 'Industrial machinery and automation solutions provider',
  },
  {
    id: '3',
    name: 'Green Fields Inc',
    category: 'Agriculture',
    location: 'Sao Paulo, Brazil',
    rating: 4.9,
    reviews: 301,
    yearEstablished: 2008,
    employees: '100-200',
    verified: true,
    certifications: ['Organic Certified', 'USDA'],
    responseTime: 3,
    description: 'Premium organic fertilizers and agricultural products',
  },
  {
    id: '4',
    name: 'Safety First Corp',
    category: 'Construction',
    location: 'Frankfurt, Germany',
    rating: 4.7,
    reviews: 189,
    yearEstablished: 2005,
    employees: '1000+',
    verified: true,
    certifications: ['CE', 'DIN'],
    responseTime: 1,
    description: 'Construction safety equipment and protective gear manufacturer',
  },
  {
    id: '5',
    name: 'ChemTech Solutions',
    category: 'Chemicals',
    location: 'Dubai, UAE',
    rating: 4.5,
    reviews: 98,
    yearEstablished: 2012,
    employees: '50-100',
    verified: true,
    certifications: ['ISO 18001', 'REACH'],
    responseTime: 2,
    description: 'Chemical supplies and industrial lubricants',
  },
  {
    id: '6',
    name: 'HealthCare Plus',
    category: 'Medical Equipment',
    location: 'Singapore',
    rating: 4.9,
    reviews: 412,
    yearEstablished: 2009,
    employees: '500-1000',
    verified: true,
    certifications: ['FDA', 'CE', 'ISO 13485'],
    responseTime: 1,
    description: 'Medical masks, PPE, and healthcare equipment distributor',
  },
  {
    id: '7',
    name: 'Textile Exports Ltd',
    category: 'Textile',
    location: 'Dhaka, Bangladesh',
    rating: 4.6,
    reviews: 167,
    yearEstablished: 2003,
    employees: '200-500',
    verified: true,
    certifications: ['Oeko-Tex', 'GOTS'],
    responseTime: 5,
    description: 'High-quality textile and fabric manufacturer',
  },
  {
    id: '8',
    name: 'Furniture Plus',
    category: 'Furniture',
    location: 'Hanoi, Vietnam',
    rating: 4.7,
    reviews: 198,
    yearEstablished: 2011,
    employees: '300-500',
    verified: false,
    certifications: ['ISO 9001'],
    responseTime: 3,
    description: 'Office and commercial furniture manufacturer',
  },
]

export default function SuppliersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  const filteredSuppliers = mockSuppliers
    .filter(
      (supplier) =>
        (!selectedCategory || supplier.category === selectedCategory) &&
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviews - a.reviews
      if (sortBy === 'response') return a.responseTime - b.responseTime
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Supplier Directory</h1>
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold mb-4">Rating</h3>
                <div className="space-y-2 text-sm">
                  {[5, 4, 3].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <div className="flex items-center gap-1">
                        {Array(stars)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        <span>{stars} Stars & up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold mb-4">Verification</h3>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Verified Only</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filteredSuppliers.length}</span> suppliers
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="response">Fastest Response</option>
              </select>
            </div>

            {/* Suppliers List */}
            <div className="space-y-4">
              {filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className="p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex gap-6">
                    {/* Logo */}
                    <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      🏭
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{supplier.name}</h3>
                          {supplier.verified && (
                            <BadgeCheck className="w-5 h-5 text-primary" title="Verified Supplier" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end mb-1">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(supplier.rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{supplier.reviews} reviews</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{supplier.description}</p>

                      <div className="flex items-center gap-4 mb-3 flex-wrap text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {supplier.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          Est. {supplier.yearEstablished}
                        </div>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {supplier.employees}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {supplier.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-3">
                        <span>Response time: ~{supplier.responseTime}h</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button size="sm">Contact Supplier</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
