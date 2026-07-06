'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, TrendingUp, Shield, Users, Zap, ArrowRight } from 'lucide-react'
import { CATEGORIES, SUBSCRIPTION_PLANS } from '@/lib/utils/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Connect with Verified B2B Suppliers & Buyers
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              The trusted global marketplace for businesses to discover products, manage leads, and grow their B2B operations seamlessly.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 mb-12 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products or suppliers..."
                  className="w-full pl-12 pr-4 py-4 bg-card rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button size="lg" className="gap-2">
                Search <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap mb-12">
              <Link href="/auth/register">
                <Button size="lg">Start Selling</Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline">
                  Browse Products
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Active Suppliers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">2M+</p>
                <p className="text-sm text-muted-foreground">Products Listed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">180+</p>
                <p className="text-sm text-muted-foreground">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="p-6 bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium text-sm">{category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose B2B Marketplace?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Verified Suppliers',
                description: 'All suppliers are verified and certified for reliability and authenticity',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Large Supplier Network',
                description: 'Access to 50,000+ verified suppliers across 100+ product categories',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Advanced Tools',
                description: 'Manage leads, RFQs, and analytics with our powerful dashboard tools',
              },
            ].map((feature, index) => (
              <div key={index} className="p-8 bg-background rounded-lg border border-border hover:border-primary transition-colors">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Flexible Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-lg border transition-all ${
                plan.id === 'professional'
                  ? 'border-primary bg-primary/5 shadow-lg scale-105'
                  : 'border-border bg-card hover:border-primary'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-primary mb-6">
                ${plan.price}
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.id === 'professional' ? 'default' : 'outline'}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 border-t border-border">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your B2B Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of suppliers and buyers who trust our platform to grow their business.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/register?role=supplier">
              <Button size="lg">Start Selling Now</Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
