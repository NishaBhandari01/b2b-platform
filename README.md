B2B Marketplace Platform

A full-stack B2B (Business-to-Business) Marketplace Platform designed to connect buyers and suppliers, allowing businesses to discover products, manage product catalogs, submit Requests for Quotations (RFQs), receive and manage quotations, communicate through real-time messaging, and track business activity through analytics.

The platform is built with a modern full-stack architecture using Next.js, React, Node.js, Express.js, TypeScript, PostgreSQL, Prisma, Socket.IO, Docker, and Cloudflare R2.

📌 Table of Contents
Overview
Key Features
User Roles
Application Workflow
System Architecture
Technology Stack
Project Structure
Core Modules
Authentication & Authorization
Product Management
RFQ & Quotation System
Real-Time Messaging
File & Image Storage
Analytics
API
Database
Validation & Error Handling
Testing
Docker
Environment Variables
Installation & Setup
Running the Application
Database Commands
Testing Commands
Development Workflow
Security
Future Improvements
Author
🌐 Overview

The B2B Marketplace Platform provides a centralized environment where businesses can interact with other businesses for product discovery, purchasing, quotation management, and communication.

Unlike a traditional B2C e-commerce platform, this application focuses on business-to-business transactions, where buyers may require customized quantities, pricing, shipping requirements, certifications, and supplier quotations before completing a purchase.

Main business flow
Business Registration
↓
Company Profile
↓
Supplier → Product Catalog
↓
Buyer → Product Discovery
↓
Buyer → Request for Quotation (RFQ)
↓
Supplier → Review RFQ
↓
Supplier → Create Quotation
↓
Buyer ↔ Supplier Communication
↓
Quotation Management
↓
Business Transaction
✨ Key Features
👤 Authentication & User Management
User registration and login
JWT-based authentication
Access token and refresh token flow
Protected API routes
Role-based access control
Persistent authentication sessions
Secure HTTP-only cookie support
Buyer and supplier authorization
🏢 Company Management

Businesses can create and manage company profiles containing information such as:

Company name
Company description
Business type
Contact information
Address
Company profile information
Business-related metadata
📦 Product Management

Suppliers can create and manage detailed product catalogs.

Product creation workflow

The product management system uses a multi-step process:

Basic Information
Media
Description
Pricing
Specifications
Shipping
Certifications
Documents
SEO
Review
Product capabilities
Create product drafts
Update products
Product slug generation
Product descriptions
Product pricing
Product specifications
Product images
Primary product image
Product certifications
Product documents
Shipping information
SEO information
Product publishing workflow

The product creation process also supports draft autosaving so users can continue their work without losing progress.

👥 User Roles

The platform primarily supports two business roles.

Buyer

Buyers can:

Browse products
View supplier information
Submit RFQs
Specify quantity and requirements
Review quotations
Communicate with suppliers
Manage quotation-related activities
Supplier

Suppliers can:

Create company profiles
Create product catalogs
Manage products
Receive RFQs
Review buyer requirements
Create quotations
Communicate with buyers
Monitor business activity
View analytics
🔄 Application Workflow

1. Registration

A business user creates an account and provides the required information.

2. Company Setup

The user creates or completes their company profile.

3. Supplier Product Listing

Suppliers create products through the multi-step product creation process.

4. Buyer Discovery

Buyers browse available products and suppliers.

5. RFQ Submission

A buyer submits a Request for Quotation containing requirements such as:

Product
Quantity
Target requirements
Delivery/shipping requirements
Additional notes 6. Supplier Response

The supplier receives the RFQ and can prepare a quotation.

7. Quotation

The supplier creates a quotation containing pricing and other commercial information.

8. Communication

Buyer and supplier can communicate through the quotation-specific conversation.

9. Business Decision

The buyer reviews the quotation and communicates with the supplier before proceeding with the business transaction.

🏗 System Architecture

The application follows a separated frontend/backend architecture.

                    ┌──────────────────────┐
                    │      Next.js         │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │    Express.js API    │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌────────────┐
          │ PostgreSQL │ │ Cloudflare │ │ Socket.IO  │
          │  Database  │ │     R2     │ │ Real-time  │
          └────────────┘ └────────────┘ └────────────┘

🛠 Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
React Query
Axios
Socket.IO Client
Lucide React
Backend
Node.js
Express.js
TypeScript
Prisma ORM
PostgreSQL
JWT
Zod
Socket.IO
Storage
Cloudflare R2

Used for storing product-related media and documents.

Testing
Vitest
Supertest
DevOps
Docker
Docker Compose
Environment-based configuration
📁 Project Structure

The project is divided into frontend and backend applications.

b2b-marketplace-platform/
│
├── client/
│ │
│ ├── app/
│ ├── components/
│ ├── hooks/
│ ├── lib/
│ ├── services/
│ ├── types/
│ └── ...
│
├── server/
│ │
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── repositories/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── schemas/
│ │ ├── socket/
│ │ ├── utils/
│ │ └── ...
│ │
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── migrations/
│ │
│ └── tests/
│
├── docker-compose.yml
├── README.md
└── ...

The exact directory names may differ depending on the current branch/version of the project.

🧩 Core Modules

The backend is organized around modular business domains.

Authentication

Responsible for:

Registration
Login
Token generation
Refresh tokens
Authentication middleware
Authorization
Company

Responsible for:

Company profiles
Business information
Company management
Products

Responsible for:

Product creation
Product drafts
Product updates
Product media
Product specifications
Product publishing
RFQ

Responsible for:

Creating RFQs
Managing RFQs
Buyer requirements
Supplier RFQ processing
Quotations

Responsible for:

Creating quotations
Managing quotation status
Connecting quotations with RFQs
Buyer/supplier quotation workflow
Conversations

Responsible for:

Creating quotation conversations
Conversation management
Buyer/supplier communication
Messages

Responsible for:

Sending messages
Receiving messages
Real-time communication
Message history
Analytics

Responsible for:

Business KPIs
Revenue-related statistics
RFQ volume
Time-based analytics
🔐 Authentication & Authorization

The platform uses JWT-based authentication.

The authentication flow uses:

Login
↓
Access Token
↓
Authenticated API Requests
↓
Access Token Expiration
↓
Refresh Token
↓
New Access Token

Access tokens are short-lived while refresh tokens provide session persistence.

Protected endpoints use authentication middleware to verify the user's identity before allowing access.

Authorization is also applied according to the user's role.

For example:

Buyer
├── Create RFQ
├── View Quotations
└── Communicate with Supplier

Supplier
├── Manage Products
├── View RFQs
├── Create Quotations
└── Manage Conversations
📦 Product Management

The product module is one of the core modules of the platform.

Products support multiple information categories:

Product
├── Basic Information
├── Media
├── Description
├── Pricing
├── Specifications
├── Shipping
├── Certifications
├── Documents
├── SEO
└── Review
Draft support

Products can be saved as drafts before being published.

The frontend also supports autosaving draft information to prevent accidental data loss during product creation.

Product media

Product images are stored using Cloudflare R2 rather than directly inside the PostgreSQL database.

The database stores the necessary metadata and references to the uploaded files.

📋 RFQ & Quotation System

The RFQ system is designed around the B2B purchasing process.

Request for Quotation

A buyer can request pricing from a supplier.

Buyer
│
│ Create RFQ
▼
RFQ
│
▼
Supplier

The supplier can then review the request and prepare a quotation.

Quotation
RFQ
│
└── Quotation
│
├── Pricing
├── Quantity
├── Terms
└── Supplier Response

The system maintains the relationship between:

Buyer
↓
RFQ
↓
Supplier
↓
Quotation
↓
Conversation

This ensures that communication and quotation information remain associated with the appropriate business transaction.

💬 Real-Time Messaging

The platform uses Socket.IO for real-time buyer-supplier communication.

A conversation is associated with a quotation.

Quotation
│
▼
Conversation
│
├── Buyer
│
├── Supplier
│
└── Messages
Real-time flow
Buyer sends message
↓
Socket.IO
↓
Conversation Room
↓
Supplier receives message

The frontend also maintains message history using API-based data fetching.

The messaging implementation supports:

Conversation rooms
Real-time messages
Message history
Pagination
React Query integration
Socket.IO events
Fallback data refetching
☁️ File & Image Storage

Product media is stored using Cloudflare R2.

The application separates file storage from the main relational database.

Frontend
│
│ Upload
▼
Backend
│
▼
Cloudflare R2
│
└── Product Images / Documents

The database stores metadata and references instead of storing large binary files directly.

This approach improves scalability and keeps the PostgreSQL database focused on structured business data.

📊 Analytics

The supplier dashboard includes analytics functionality for monitoring business activity.

Supported analytics ranges include:

7 days
30 days
90 days

The analytics system includes concepts such as:

KPIs
Business performance indicators
Revenue-related metrics
RFQ activity
Revenue Series

Revenue can be represented as a time-series dataset for dashboard visualization.

RFQ Volume

RFQ activity can be aggregated over time to help suppliers understand demand.

Example:

Analytics
├── KPI
├── Revenue
└── RFQ Volume
🔌 API

The backend exposes REST APIs organized by business domain.

Example API structure:

/api/auth
/api/company
/api/products
/api/rfq
/api/quotations
/api/conversations
/api/messages
/api/supplier/analytics
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
Products
GET /api/products
POST /api/products
GET /api/products/:id
PATCH /api/products/:id
DELETE /api/products/:id
RFQs
POST /api/rfq
GET /api/rfq
GET /api/rfq/:id
Quotations
POST /api/quotations
GET /api/quotations
GET /api/quotations/:id
Conversations
GET /api/conversations
POST /api/conversations
Messages
GET /api/messages
POST /api/messages

Endpoint names and HTTP methods may vary slightly depending on the current implementation.

🗄 Database

The application uses PostgreSQL as the primary relational database.

Prisma ORM is used for:

Database access
Schema management
Type-safe queries
Relationships
Migrations
Database synchronization

Conceptually, the database contains relationships between entities such as:

User
│
├── Company
│
├── Products
│
├── RFQs
│
├── Quotations
│
└── Conversations
│
└── Messages

Prisma migrations are used to version database schema changes.

✅ Validation & Error Handling

The backend uses Zod for request validation.

Example validation flow:

HTTP Request
↓
Authentication
↓
Validation
↓
Controller
↓
Service
↓
Repository
↓
Database

This separation helps keep business logic out of controllers and provides better maintainability.

Backend architecture
Route
↓
Middleware
↓
Controller
↓
Service
↓
Repository
↓
Prisma
↓
PostgreSQL
Responsibilities

Controller

Handles HTTP requests and responses.

Service

Contains business logic.

Repository

Handles database operations.

Schema

Validates incoming data.

🧪 Testing

The backend uses:

Vitest for test execution
Supertest for HTTP API testing

Tests cover important API behavior including:

Authentication
Authorization
Product creation
Product validation
RFQ functionality
Quotation functionality
API error responses

Example test structure:

tests/
├── auth.api.test.ts
├── product.api.test.ts
├── rfq.api.test.ts
├── quotation.api.test.ts
└── ...

Tests use a dedicated test database to prevent test execution from affecting development data.

🚀 Installation & Setup

1. Clone the repository
   git clone <repository-url>
   cd b2b-marketplace-platform
2. Install frontend dependencies
   cd client
   npm install
3. Install backend dependencies
   cd ../server
   npm install
4. Configure environment variables

Create the required .env files.

Example:

server/
├── .env
└── .env.test

client/
└── .env.local 5. Setup PostgreSQL

Make sure PostgreSQL is running.

Then configure:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5433/b2b-platform" 6. Generate Prisma Client

From the server directory:

npx prisma generate 7. Run migrations
npx prisma migrate dev
▶️ Running the Application
Start Backend
cd server
npm run dev

Backend:

http://localhost:5000
Start Frontend

In another terminal:

cd client
npm run dev

Frontend:

http://localhost:3000
🗃 Database Commands

Generate Prisma Client:

npx prisma generate

Create and apply a migration:

npx prisma migrate dev --name <migration-name>

Check migration status:

npx prisma migrate status

Open Prisma Studio:

npx prisma studio
🧪 Testing Commands

Run all tests:

npm test

Run Vitest directly:

npx vitest --run

Run a specific test:

npx vitest --run path/to/test-file.test.ts

Run tests using the test environment:

dotenv -e .env.test -- vitest --run --pool=forks --maxWorkers=1

The test environment uses a separate database to isolate test data from development data.

🔄 Development Workflow

A typical development workflow is:

1. Create/modify feature
   ↓
2. Update Prisma schema if required
   ↓
3. Create migration
   ↓
4. Generate Prisma Client
   ↓
5. Implement Repository
   ↓
6. Implement Service
   ↓
7. Implement Controller
   ↓
8. Register Route
   ↓
9. Add Validation
   ↓
10. Add Tests
    ↓
11. Connect Frontend
    ↓
12. Test Complete Flow
    ↓
13. Commit Changes
    🔒 Security

The application applies several security practices:

JWT authentication
Refresh token mechanism
Protected routes
Role-based authorization
Request validation using Zod
Environment-based secrets
Database isolation for testing
HTTP-only cookie support where applicable
CORS configuration
No secrets committed to source control
