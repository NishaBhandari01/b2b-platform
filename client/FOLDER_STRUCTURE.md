# TradeHub B2B Marketplace - Folder Structure

## Overview
Professional B2B marketplace platform with role-based separation for Admin, Supplier, and Buyer portals.

## App Routes Structure

```
app/
├── (public)/                    # Public routes - no authentication required
│   ├── auth/
│   │   ├── login/page.tsx      # User login with role-based redirect
│   │   └── register/page.tsx   # User registration with role selection
│   ├── page.tsx                # Landing page
│   ├── products/page.tsx       # Browse all products
│   ├── suppliers/page.tsx      # Supplier directory
│   └── layout.tsx              # Public layout with Navbar
│
├── admin/                       # Admin portal - role-protected
│   ├── page.tsx                # Admin dashboard
│   ├── users/page.tsx          # User management
│   ├── verification/page.tsx   # Supplier verification
│   ├── moderation/page.tsx     # Content moderation
│   ├── categories/page.tsx     # Category management
│   ├── revenue/page.tsx        # Revenue tracking
│   ├── fraud/page.tsx          # Fraud detection
│   ├── settings/page.tsx       # Admin settings
│   └── layout.tsx              # Admin layout with AdminSidebar
│
├── supplier/                    # Supplier portal - role-protected
│   ├── page.tsx                # Supplier dashboard
│   ├── products/page.tsx       # Product management
│   ├── leads/page.tsx          # Sales leads
│   ├── rfqs/page.tsx           # RFQ management
│   ├── messages/page.tsx       # Communications
│   ├── analytics/page.tsx      # Performance metrics
│   ├── company/page.tsx        # Store profile
│   └── layout.tsx              # Supplier layout with SupplierSidebar
│
├── buyer/                       # Buyer portal - role-protected
│   ├── page.tsx                # Buyer dashboard
│   ├── rfqs/page.tsx           # Create/manage RFQs
│   ├── favorites/page.tsx      # Saved suppliers
│   ├── orders/page.tsx         # Purchase orders
│   ├── messages/page.tsx       # Communications
│   ├── history/page.tsx        # Order history
│   ├── addresses/page.tsx      # Delivery addresses
│   └── layout.tsx              # Buyer layout with BuyerSidebar
│
├── layout.tsx                   # Root layout with providers
├── page.tsx.bak               # Backup of old root page
└── api/                        # API routes (future)
```

## Components Structure

```
components/
├── layouts/                     # Layout components
│   ├── AdminSidebar.tsx        # Admin sidebar with menu
│   ├── AdminNavbar.tsx         # Admin top navbar
│   ├── SupplierSidebar.tsx     # Supplier sidebar with menu
│   ├── SupplierNavbar.tsx      # Supplier top navbar
│   ├── BuyerSidebar.tsx        # Buyer sidebar with menu
│   └── BuyerNavbar.tsx         # Buyer top navbar
│
├── common/                      # Shared components
│   ├── Navbar.tsx              # Public navbar
│   ├── Sidebar.tsx             # Sidebar component
│   ├── Footer.tsx              # Footer component
│   └── ...
│
├── shared/                      # Reusable components
│   ├── StatsCard.tsx           # Statistics display card
│   ├── DataTable.tsx           # Data table component
│   ├── Badge.tsx               # Badge/tag component
│   ├── SimpleChart.tsx         # Chart components
│   ├── FormField.tsx           # Form input component
│   └── ...
│
└── ui/                          # shadcn/ui components
    ├── card.tsx
    ├── button.tsx
    └── ...
```

## Key Features

### Admin Portal (`/admin`)
- Dashboard with platform metrics
- User management and roles
- Supplier verification system
- Content moderation
- Category management
- Revenue tracking and analytics
- Fraud detection
- System settings

### Supplier Portal (`/supplier`)
- Dashboard with sales metrics
- Product management & listings
- Sales leads tracking
- RFQ management
- Direct messaging with buyers
- Performance analytics
- Store profile management
- Subscription/premium features

### Buyer Portal (`/buyer`)
- Dashboard with purchase analytics
- Create and manage RFQs
- Supplier search and favorites
- Purchase order tracking
- Direct messaging with suppliers
- Order history
- Address management
- Spending insights

## Professional Features Inspired by IndiaMART

1. **Role-Based Access Control**
   - Separate dashboards for Admin, Supplier, and Buyer
   - Authentication guards on all protected routes
   - Proper redirects based on user role

2. **Professional UI/UX**
   - Clean, modern design with Tailwind CSS
   - Consistent color schemes per role (Blue for Admin, Green for Supplier, Purple for Buyer)
   - Professional sidebars with active state indicators
   - Responsive navbars with search, notifications, and user profile

3. **Enterprise Features**
   - Verification system for suppliers
   - Commission/revenue tracking
   - Fraud detection system
   - Moderation tools
   - Advanced search and filtering
   - Notification system
   - Performance metrics and analytics

4. **User Experience**
   - Intuitive navigation with clear menus
   - Quick actions and shortcuts
   - Performance indicators and progress bars
   - Real-time notifications
   - Mobile-responsive design

## Authentication Flow

1. User visits `/auth/login` or `/auth/register`
2. User selects role (admin requires special signup)
3. Credentials validated against auth system
4. User redirected to appropriate dashboard:
   - Admin → `/admin`
   - Supplier → `/supplier`
   - Buyer → `/buyer`
5. Each dashboard layout enforces role-based access

## Route Access

| Route | Public | Supplier | Buyer | Admin |
|-------|--------|----------|-------|-------|
| `/` | ✓ | ✓ | ✓ | ✓ |
| `/products` | ✓ | ✓ | ✓ | ✓ |
| `/suppliers` | ✓ | ✓ | ✓ | ✓ |
| `/auth/*` | ✓ | ✓ | ✓ | ✓ |
| `/supplier/*` | ✗ | ✓ | ✗ | ✗ |
| `/buyer/*` | ✗ | ✗ | ✓ | ✗ |
| `/admin/*` | ✗ | ✗ | ✗ | ✓ |

## Next Steps

1. **Create individual dashboard pages** for all routes
2. **Implement API endpoints** for data fetching
3. **Connect database integration** (Neon, Supabase, etc.)
4. **Add product management** for suppliers
5. **Build RFQ system** for buyer-supplier interactions
6. **Implement messaging** system
7. **Add payment integration** (Stripe)
8. **Deploy to Vercel**
