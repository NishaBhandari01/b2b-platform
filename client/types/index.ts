// User roles and types
export type UserRole = "buyer" | "supplier" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  createdAt: Date | string;
}

export interface SupplierProfile extends User {
  companyName: string;
  gstin?: string;
  businessType: string;
  certifications: string[];
  description: string;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  responseTime: number; // in hours
  productCategories: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  price: number;
  moq: number; // Minimum Order Quantity
  rating: number;
  reviewCount: number;
  images: string[];
  specifications: Record<string, string>;
  verified: boolean;
  createdAt: Date;
}

export interface RFQ {
  id: string;
  buyerId: string;
  productId?: string;
  title: string;
  description: string;
  quantity: number;
  deadline: Date;
  preferredSuppliers?: string[];
  status: "draft" | "published" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  supplierId: string;
  buyerId: string;
  productId: string;
  status: "new" | "interested" | "negotiating" | "closed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxProducts?: number;
  maxLeads?: number;
  supportLevel: "basic" | "priority" | "dedicated";
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionId: string;
  status: "active" | "canceled" | "paused";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  parentId?: string;
  productCount: number;
}
