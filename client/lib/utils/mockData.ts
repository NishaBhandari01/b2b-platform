import type {
  Category,
  Lead,
  Message,
  Product,
  RFQ,
  Subscription,
  User,
  UserSubscription,
} from "@/types";

export const DEMO_ACCOUNTS: Array<User & { password: string }> = [
  {
    id: "buyer-demo",
    email: "buyer@tradehub.com",
    password: "buyer123",
    name: "Maya Chen",
    role: "buyer",
    verified: true,
    createdAt: new Date("2024-01-15T10:00:00.000Z"),
  },
  {
    id: "supplier-demo",
    email: "supplier@tradehub.com",
    password: "supplier123",
    name: "Aiden Patel",
    role: "supplier",
    verified: true,
    createdAt: new Date("2023-11-02T09:30:00.000Z"),
  },
  {
    id: "admin-demo",
    email: "admin@tradehub.com",
    password: "admin123",
    name: "Olivia Brooks",
    role: "admin",
    verified: true,
    createdAt: new Date("2022-09-21T16:45:00.000Z"),
  },
];

export const PRODUCT_CATALOG: Product[] = [
  {
    id: "prod-1",
    name: "Industrial LED Panel Light",
    description: "Energy-efficient 100W LED panel for commercial lighting.",
    categoryId: "electronics",
    supplierId: "supplier-demo",
    price: 250,
    moq: 10,
    rating: 4.8,
    reviewCount: 124,
    images: ["/placeholder.svg"],
    specifications: { wattage: "100W", certification: "CE" },
    verified: true,
    createdAt: new Date("2024-05-01T00:00:00.000Z"),
  },
  {
    id: "prod-2",
    name: "Smart Sensor Kit",
    description: "IoT-ready sensor package for automation workflows.",
    categoryId: "electronics",
    supplierId: "supplier-demo",
    price: 580,
    moq: 5,
    rating: 4.7,
    reviewCount: 92,
    images: ["/placeholder.svg"],
    specifications: { connectivity: "Wi-Fi", range: "50m" },
    verified: true,
    createdAt: new Date("2024-05-10T00:00:00.000Z"),
  },
  {
    id: "prod-3",
    name: "Stainless Fastener Pack",
    description:
      "Corrosion-resistant industrial fasteners for heavy-duty assembly.",
    categoryId: "machinery",
    supplierId: "supplier-demo",
    price: 1200,
    moq: 100,
    rating: 4.9,
    reviewCount: 154,
    images: ["/placeholder.svg"],
    specifications: { material: "Stainless Steel", finish: "Passivated" },
    verified: true,
    createdAt: new Date("2024-04-20T00:00:00.000Z"),
  },
];

export const SUPPLIER_PROFILES = [
  {
    id: "supplier-1",
    name: "Aiden Patel",
    companyName: "Northstar Manufacturing",
    email: "supplier@tradehub.com",
    role: "supplier" as const,
    verified: true,
    description:
      "Specialized in industrial components and automation solutions.",
    rating: 4.8,
    reviewCount: 310,
    totalProducts: 234,
    responseTime: 2,
    productCategories: ["Electronics", "Machinery"],
    certifications: ["ISO 9001", "CE"],
    businessType: "Manufacturer",
    gstin: "27ABCDE1234F1Z5",
  },
  {
    id: "supplier-2",
    name: "Tara Gomez",
    companyName: "Innova Supplies",
    email: "tara@innovasupplies.com",
    role: "supplier" as const,
    verified: true,
    description: "Reliable supplier for packaging and commercial equipment.",
    rating: 4.6,
    reviewCount: 188,
    totalProducts: 98,
    responseTime: 4,
    productCategories: ["Packaging", "Construction"],
    certifications: ["ISO 14001"],
    businessType: "Distributor",
    gstin: "27FGHIJ5678K1L2",
  },
];

export const RFQ_REQUESTS: RFQ[] = [
  {
    id: "rfq-1001",
    buyerId: "buyer-demo",
    productId: "prod-1",
    title: "Bulk Lighting Order",
    description:
      "Need 250 units of LED panels for a commercial expansion project.",
    quantity: 250,
    deadline: new Date("2026-07-20T00:00:00.000Z"),
    preferredSuppliers: ["supplier-demo"],
    status: "published",
    createdAt: new Date("2026-07-01T00:00:00.000Z"),
    updatedAt: new Date("2026-07-02T00:00:00.000Z"),
  },
  {
    id: "rfq-1002",
    buyerId: "buyer-demo",
    title: "Automation Sensors",
    description: "Looking for sensor kits suitable for warehouse automation.",
    quantity: 120,
    deadline: new Date("2026-07-18T00:00:00.000Z"),
    status: "draft",
    createdAt: new Date("2026-06-30T00:00:00.000Z"),
    updatedAt: new Date("2026-06-30T00:00:00.000Z"),
  },
];

export const LEADS: Lead[] = [
  {
    id: "lead-1",
    supplierId: "supplier-demo",
    buyerId: "buyer-demo",
    productId: "prod-1",
    status: "new",
    notes: "Buyer requested a quote for 250 units.",
    createdAt: new Date("2026-07-02T00:00:00.000Z"),
    updatedAt: new Date("2026-07-02T00:00:00.000Z"),
  },
  {
    id: "lead-2",
    supplierId: "supplier-demo",
    buyerId: "buyer-demo",
    productId: "prod-2",
    status: "negotiating",
    notes: "Buyer is comparing two vendors and wants a revised offer.",
    createdAt: new Date("2026-06-30T00:00:00.000Z"),
    updatedAt: new Date("2026-07-01T00:00:00.000Z"),
  },
];

export const MESSAGES: Message[] = [
  {
    id: "msg-1",
    senderId: "buyer-demo",
    receiverId: "supplier-demo",
    content: "We are evaluating your quote for 250 units.",
    read: false,
    createdAt: new Date("2026-07-02T11:30:00.000Z"),
  },
  {
    id: "msg-2",
    senderId: "supplier-demo",
    receiverId: "buyer-demo",
    content: "We can offer a preferred pricing tier for this order volume.",
    read: true,
    createdAt: new Date("2026-07-02T12:00:00.000Z"),
  },
];

export const ORDERS = [
  {
    id: "ord-1001",
    buyerId: "buyer-demo",
    supplierId: "supplier-demo",
    total: 62500,
    status: "Delivered",
    createdAt: new Date("2026-06-15T00:00:00.000Z"),
  },
  {
    id: "ord-1002",
    buyerId: "buyer-demo",
    supplierId: "supplier-demo",
    total: 18250,
    status: "In Transit",
    createdAt: new Date("2026-06-28T00:00:00.000Z"),
  },
];

export const SUBSCRIPTION_OPTIONS: Subscription[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingCycle: "monthly",
    features: ["Basic profile", "Up to 5 products", "Email support"],
    maxProducts: 5,
    supportLevel: "basic",
  },
  {
    id: "premium",
    name: "Premium",
    price: 299,
    billingCycle: "monthly",
    features: ["Unlimited products", "Lead management", "Verified badge"],
    maxProducts: 500,
    maxLeads: 200,
    supportLevel: "priority",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    billingCycle: "yearly",
    features: ["API access", "Dedicated support", "Advert placement"],
    supportLevel: "dedicated",
  },
];

export const USER_SUBSCRIPTIONS: UserSubscription[] = [
  {
    id: "sub-1",
    userId: "supplier-demo",
    subscriptionId: "premium",
    status: "active",
    startDate: new Date("2025-01-01T00:00:00.000Z"),
    endDate: new Date("2025-12-31T00:00:00.000Z"),
    autoRenew: true,
  },
];

export function getMockUserByEmail(
  email: string,
): (User & { password: string }) | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find(
    (account) => account.email.toLowerCase() === normalizedEmail,
  );
}

export function createMockUser(
  email: string,
  name: string,
  role: User["role"],
): User {
  return {
    id: `${role}-${Date.now()}`,
    email,
    name,
    role,
    verified: role === "supplier" ? false : true,
    createdAt: new Date(),
  };
}

export const CATEGORY_SEED: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Smart devices, components, and industrial electronics.",
    productCount: 124,
  },
  {
    id: "machinery",
    name: "Industrial Machinery",
    slug: "machinery",
    description: "Equipment and machinery for manufacturing and operations.",
    productCount: 86,
  },
  {
    id: "agriculture",
    name: "Agriculture",
    slug: "agriculture",
    description: "Farming tools, irrigation, and agri inputs.",
    productCount: 73,
  },
  {
    id: "construction",
    name: "Construction",
    slug: "construction",
    description: "Building materials and safety equipment.",
    productCount: 64,
  },
];
