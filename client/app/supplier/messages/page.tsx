"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";
import RFQChat from "@/components/RFQChat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ConversationItem {
  id: string;
  unreadCount: number;
  quotation: {
    rfqId: string;
    supplierId: string;
    rfq: {
      id: string;
      title: string;
      user: { id: string; name: string; email: string };
    };
    supplier: { id: string; name: string; email: string };
  };
  messages: Array<{
    id: string;
    text: string;
    createdAt: string;
    sender?: { name: string } | null;
  }>;
}

interface CurrentUser {
  id: string;
  role: "buyer" | "supplier";
  name: string;
}

export default function SupplierMessages() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Fetch current user info from auth cookie
  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCurrentUser(d.data);
      })
      .catch(() => {});
  }, []);

  // Fetch all conversations for this supplier
  const { data: conversations = [] } = useQuery<ConversationItem[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/conversations`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load");
      return data.data;
    },
    refetchInterval: 5000,
  });

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Messages
          {totalUnread > 0 && (
            <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-red-500 rounded-full">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground mt-2">
          Keep buyer conversations moving with prompt replies.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ height: "540px" }}>
        {/* Conversation list */}
        <Card className="col-span-1 p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="font-semibold text-slate-900">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No conversations yet.
                <br />
                Buyers will message you after reviewing your quotations.
              </div>
            ) : (
              conversations.map((conv) => {
                const buyer = conv.quotation.rfq.user;
                const lastMsg = conv.messages[0];
                const isActive = selectedConvId === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                      isActive
                        ? "bg-emerald-50 border-l-4 border-l-emerald-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {buyer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm truncate ${
                              conv.unreadCount > 0
                                ? "font-bold text-slate-900"
                                : "font-medium text-slate-700"
                            }`}
                          >
                            {buyer.name}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {conv.quotation.rfq.title}
                        </p>
                        {lastMsg && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {lastMsg.sender?.name}: {lastMsg.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Chat area */}
        <div className="col-span-2">
          {selectedConv && currentUser ? (
            <RFQChat
              conversationId={selectedConv.id}
              currentUserId={currentUser.id}
              currentUserRole="supplier"
              rfqId={selectedConv.quotation.rfqId}
              supplierId={selectedConv.quotation.supplierId}
              otherPartyName={selectedConv.quotation.rfq.user.name}
            />
          ) : (
            <Card className="p-8 flex items-center justify-center h-full">
              <div className="text-center">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">
                  Select a conversation to start messaging
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
