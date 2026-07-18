import axios from "axios";
import type { RFQListResponse, RFQRecord, QuotationRecord } from "@/types/rfq";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getMyRFQs = async (): Promise<RFQListResponse> => {
  const response = await axios.get<RFQListResponse>(`${API_URL}/api/rfq`, {
    withCredentials: true,
  });
  return response.data;
};

export const getRFQById = async (id: string): Promise<RFQRecord> => {
  const response = await axios.get<{ success: boolean; data: RFQRecord }>(
    `${API_URL}/api/rfq/${id}`,
    { withCredentials: true },
  );
  return response.data.data;
};

export const submitQuotation = async (
  rfqId: string,
  payload: { price: number; leadTime: string; message: string },
): Promise<QuotationRecord> => {
  const response = await axios.post<{
    success: boolean;
    data: QuotationRecord;
  }>(`${API_URL}/api/rfq/${rfqId}/quotations`, payload, {
    withCredentials: true,
  });
  return response.data.data;
};

interface RFQMessage {
  id: string;
  text: string;
  createdAt: string;
  sender: { id: string; name: string; email: string };
  receiver: { id: string; name: string; email: string };
}

export const getRFQMessages = async (rfqId: string): Promise<RFQMessage[]> => {
  const response = await axios.get<{ success: boolean; data: RFQMessage[] }>(
    `${API_URL}/api/rfq/${rfqId}/messages`,
    { withCredentials: true },
  );
  return response.data.data;
};

export const sendRFQMessage = async (
  rfqId: string,
  payload: { receiverId: string; text: string },
): Promise<RFQMessage> => {
  const response = await axios.post<{ success: boolean; data: RFQMessage }>(
    `${API_URL}/api/rfq/${rfqId}/messages`,
    payload,
    { withCredentials: true },
  );
  return response.data.data;
};
