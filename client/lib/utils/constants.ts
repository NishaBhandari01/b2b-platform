// Categories
export const CATEGORIES = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Industrial Machinery', slug: 'machinery' },
  { id: '3', name: 'Agriculture', slug: 'agriculture' },
  { id: '4', name: 'Construction', slug: 'construction' },
  { id: '5', name: 'Chemicals', slug: 'chemicals' },
  { id: '6', name: 'Medical Equipment', slug: 'medical' },
  { id: '7', name: 'Textile', slug: 'textile' },
  { id: '8', name: 'Furniture', slug: 'furniture' },
  { id: '9', name: 'Food Products', slug: 'food' },
  { id: '10', name: 'Automotive', slug: 'automotive' },
]

// Subscription Plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    billingCycle: 'monthly' as const,
    features: [
      'Up to 50 Products',
      'Basic Analytics',
      'Email Support',
      'Monthly Reports',
    ],
    maxProducts: 50,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    billingCycle: 'monthly' as const,
    features: [
      'Up to 500 Products',
      'Advanced Analytics',
      'Priority Support',
      'Weekly Reports',
      'Lead Management',
    ],
    maxProducts: 500,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    billingCycle: 'monthly' as const,
    features: [
      'Unlimited Products',
      'Advanced Analytics',
      'Dedicated Support',
      'Real-time Reports',
      'API Access',
      'Custom Integrations',
    ],
  },
]

// RFQ Status
export const RFQ_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
}

// Lead Status
export const LEAD_STATUS = {
  NEW: 'new',
  INTERESTED: 'interested',
  NEGOTIATING: 'negotiating',
  CLOSED: 'closed',
}
