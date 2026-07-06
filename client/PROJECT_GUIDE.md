# TradeHub: B2B Marketplace Platform

A comprehensive B2B e-commerce marketplace connecting suppliers and buyers with tools for efficient business operations.

## Project Overview

TradeHub is a full-stack Next.js 16 application with role-based dashboards (Supplier, Buyer, Admin), public marketplace pages, and reusable component library. The platform enables:

- **Suppliers**: Manage products, receive RFQs, track leads, communicate with buyers
- **Buyers**: Search products, create RFQs, manage favorites, communicate with suppliers
- **Admins**: Monitor platform activity, verify users, moderate content, manage revenue

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19.2, Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Authentication**: Mock auth system (useAuth hook in `/lib/hooks/useAuth.ts`)
- **State Management**: React hooks + SWR for data fetching
- **Icons**: Lucide React
- **Forms**: Custom form field components

## Project Structure

```
app/
├── (public)/              # Public pages (route group)
│   ├── layout.tsx         # Public layout with navbar
│   ├── page.tsx           # Landing page
│   ├── products/          # Product marketplace
│   ├── directory/         # Supplier directory
│   └── auth/
│       ├── login/         # Login page
│       └── register/      # Registration with role selection
├── dashboard/             # Unified role-based dashboard
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── page.tsx           # Main dashboard (renders by user role)
│   ├── products/          # Supplier products management
│   ├── rfqs/              # RFQ listing
│   └── messages/          # Messaging interface
└── api/                   # API routes (placeholder)

components/
├── common/
│   ├── Navbar.tsx         # Top navigation
│   └── Sidebar.tsx        # Dashboard sidebar (role-specific)
├── shared/
│   ├── StatsCard.tsx      # Reusable stats display
│   ├── DataTable.tsx      # Paginated data table
│   ├── Badge.tsx          # Status/category badges
│   ├── SimpleChart.tsx    # Bar and pie charts
│   └── FormField.tsx      # Form inputs (text, select, textarea)
└── ui/                    # shadcn/ui components

lib/
├── hooks/
│   └── useAuth.ts         # Authentication hook with mock users
└── utils.ts               # Tailwind utilities (cn function)

styles/
└── globals.css            # Tailwind v4 imports with theme tokens
```

## Key Features Implemented

### Phase 1: Project Foundation
- Next.js 16 scaffolding with App Router
- Tailwind CSS v4 with custom theme tokens
- shadcn/ui component setup
- File structure and folder organization

### Phase 2: Public Pages
- **Landing Page**: Hero section with CTA, feature showcase, testimonials
- **Auth Pages**: Login/Register with role selection (supplier/buyer/admin)
- **Marketplace**: Product browsing with filters and search
- **Directory**: Supplier directory with verification badges

### Phase 3: Supplier Dashboard
- Overview with key metrics
- Products management (add, edit, delete)
- RFQ tracker
- Messaging interface
- Quick action buttons

### Phase 4: Buyer Dashboard
- Overview with metrics
- RFQ creation and tracking
- Saved favorites
- Supplier messaging
- Product browsing integration

### Phase 5: Admin Dashboard
- Platform metrics and KPIs
- Pending verifications queue
- Moderation interface
- User management
- Revenue analytics
- Fraud detection alerts

### Phase 6: Reusable Components
- **StatsCard**: Display metrics with icons and trends
- **DataTable**: Paginated table with edit/delete actions
- **Badge**: Status indicators with multiple variants
- **SimpleChart**: Bar and pie charts for data visualization
- **FormField**: Text, select, and textarea inputs with validation

## Authentication Flow

Currently uses mock authentication. To upgrade to real auth:

1. Connect a database (Neon, Supabase)
2. Replace mock auth in `lib/hooks/useAuth.ts` with real auth
3. Add JWT tokens or session management
4. Implement database queries for user verification

Mock users available:
- Supplier: email=`supplier@test.com`, password=`123456`
- Buyer: email=`buyer@test.com`, password=`123456`
- Admin: email=`admin@test.com`, password=`123456`

## Component API Reference

### StatsCard
```tsx
<StatsCard 
  label="Total Sales"
  value="$45.2K"
  icon={<TrendingUp />}
  color="bg-green-500"
  trend={{ value: 12, direction: 'up' }}
/>
```

### DataTable
```tsx
<DataTable
  columns={[
    { header: "Name", key: "name" },
    { header: "Status", key: "status", render: (v) => <Badge>{v}</Badge> }
  ]}
  data={products}
  onEdit={handleEdit}
  onDelete={handleDelete}
  pageSize={10}
/>
```

### FormField
```tsx
<FormField
  label="Product Name"
  placeholder="Enter product name"
  value={name}
  onChange={setName}
  error={nameError}
  required
/>
```

## Design System

### Color Tokens (defined in globals.css)
- `--background`: Page background
- `--foreground`: Text color
- `--primary`: Brand primary
- `--secondary`: Secondary UI
- `--border`: Border color
- `--input`: Input field background

### Typography
- Fonts: System sans-serif (Geist, fallback to system font)
- Tailwind classes: `font-sans`, `font-mono`, `font-serif`

## Development

### Running Locally
```bash
pnpm dev
# Opens at http://localhost:3000
```

### Building
```bash
pnpm build
pnpm start
```

### Adding Components
Use shadcn CLI for UI components:
```bash
npx shadcn-ui@latest add button
```

## Next Steps for Production

1. **Database Integration**: Connect Neon or Supabase
2. **Real Authentication**: Replace mock auth with Better Auth or Supabase Auth
3. **API Development**: Build backend routes for CRUD operations
4. **File Uploads**: Integrate Vercel Blob for product images
5. **Payments**: Add Stripe for transactions
6. **Emails**: Implement transactional emails
7. **Search & Filters**: Add Upstash or Elasticsearch for advanced search
8. **Analytics**: Integrate PostHog or Vercel Analytics
9. **Testing**: Add Vitest and E2E tests
10. **Deployment**: Deploy to Vercel

## File Modifications Made

- Created unified `/dashboard` route (removed separate route groups)
- Built role-based dashboard pages
- Created reusable component library
- Set up proper folder structure and organization
- Configured Tailwind v4 with custom theme tokens

All changes maintain production-ready code quality and follow best practices.
