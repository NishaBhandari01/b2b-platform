// client/types/rfq.ts

export interface RFQFormState {
  title: string;
  category: string;
  quantity: string;
  budget: string;
  deadline: string;
  notes: string;
}

export interface QuotationRecord {
  id: string;
  price: number;
  leadTime: string;
  message: string;
  status: string;
  supplier: {
    id: string;
    name: string;
    email: string;
  };
  conversation?: {
    id: string;
  } | null;
  createdAt: string;
}

export interface RFQRecord {
  id: string;
  title: string;
  category: string;
  quantity: number;
  budget: number;
  deadline: string;
  description: string;
  userId: string;
  createdAt: string;
  status?: string;
  quotations?: QuotationRecord[];
  _count?: {
    quotations: number;
  };
}
