"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Grid,
  List,
  Filter,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { CATEGORIES } from "@/lib/utils/constants";

// Mock products
const mockProducts = [
  {
    id: "1",
    name: "Industrial LED Panel Light",
    supplier: "TechCorp Industries",
    price: 250,
    category: "Electronics",
    image: "🔦",
    rating: 4.8,
    reviews: 124,
    moq: 10,
  },
  {
    id: "2",
    name: "Stainless Steel Fasteners",
    supplier: "Metal Works Ltd",
    price: 45,
    category: "Industrial Machinery",
    image: "🔩",
    rating: 4.6,
    reviews: 89,
    moq: 100,
  },
  {
    id: "3",
    name: "Organic Fertilizer Blend",
    supplier: "Green Fields Inc",
    price: 35,
    category: "Agriculture",
    image: "🌾",
    rating: 4.9,
    reviews: 203,
    moq: 50,
  },
  {
    id: "4",
    name: "Construction Safety Helmet",
    supplier: "Safety First Corp",
    price: 28,
    category: "Construction",
    image: "⛑️",
    rating: 4.7,
    reviews: 156,
    moq: 25,
  },
  {
    id: "5",
    name: "Chemical Grade Lubricant",
    supplier: "ChemTech Solutions",
    price: 180,
    category: "Chemicals",
    image: "🧴",
    rating: 4.5,
    reviews: 67,
    moq: 5,
  },
  {
    id: "6",
    name: "Medical Face Mask N95",
    supplier: "HealthCare Plus",
    price: 2,
    category: "Medical Equipment",
    image: "😷",
    rating: 4.9,
    reviews: 512,
    moq: 1000,
  },
  {
    id: "7",
    name: "Premium Cotton Fabric Roll",
    supplier: "Textile Exports Ltd",
    price: 8.5,
    category: "Textile",
    image: "🧵",
    rating: 4.6,
    reviews: 94,
    moq: 500,
  },
  {
    id: "8",
    name: "Solid Wood Office Chair",
    supplier: "Furniture Plus",
    price: 150,
    category: "Furniture",
    image: "🪑",
    rating: 4.7,
    reviews: 145,
    moq: 5,
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredProducts = mockProducts.filter(
    (product) =>
      (!selectedCategory || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Browse Products</h1>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
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
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
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
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold mb-4">Price Range</h3>
                <input type="range" min="0" max="5000" className="w-full" />
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold mb-4">Rating</h3>
                <div className="space-y-2 text-sm">
                  {[5, 4, 3].map((stars) => (
                    <label
                      key={stars}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <div className="flex items-center gap-1">
                        {Array(stars)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        <span>{stars} Stars & up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-all hover:border-primary cursor-pointer group"
                  >
                    <div className="aspect-square bg-secondary flex items-center justify-center text-4xl relative overflow-hidden">
                      <span className="group-hover:scale-110 transition-transform">
                        {product.image}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                          {product.name}
                        </h3>
                        <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors flex-shrink-0">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {product.supplier}
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex gap-0.5">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.round(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            ${product.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            MOQ: {product.moq}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 hover:border-primary transition-colors cursor-pointer group flex gap-4"
                  >
                    <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      {product.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.supplier}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.round(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-primary">
                        ${product.price}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        MOQ: {product.moq}
                      </p>
                      <Button variant="outline" className="gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Add
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
