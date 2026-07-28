"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Search } from "lucide-react";
import RFQChat from "@/components/RFQChat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ConversationItem {
  id: string;
  unreadCount: number;
  quotation: {
    rfqId: string;
    supplierId: string;
    rfq: { id: string; title: string };
    supplier: {
      id: string;
      name: string;
      email: string;
      isOnline: boolean;
      lastSeen: string | null;
    };
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

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
];

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function BuyerMessages() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCurrentUser(d.data);
      })
      .catch(() => {});
  }, []);

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

  const sortedConversations = [...conversations]
    .sort((a, b) => {
      const aTime = a.messages[0]
        ? new Date(a.messages[0].createdAt).getTime()
        : 0;
      const bTime = b.messages[0]
        ? new Date(b.messages[0].createdAt).getTime()
        : 0;
      return bTime - aTime;
    })
    .filter((c) => {
      if (!search.trim()) return true;
      const name = c.quotation.supplier.name.toLowerCase();
      const title = c.quotation.rfq.title.toLowerCase();
      const q = search.toLowerCase();
      return name.includes(q) || title.includes(q);
    });

  return (
    <div className="h-[calc(100vh-6rem)] min-h-[560px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex">
      {/* ========== LEFT: Conversation list ========== */}
      <div className="w-full max-w-[340px] shrink-0 border-r border-slate-100 flex flex-col bg-white">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full h-10 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <MessageSquare className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">
                No conversations yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                View an RFQ and message a supplier.
              </p>
            </div>
          ) : (
            sortedConversations.map((conv) => {
              const supplier = conv.quotation.supplier;
              const lastMsg = conv.messages[0];
              const isActive = selectedConvId === conv.id;
              const initials = supplier.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-slate-50 last:border-0 ${
                    isActive ? "bg-slate-50" : "hover:bg-slate-50/70"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(
                      supplier.name,
                    )}`}
                  >
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-[13px] truncate ${
                          conv.unreadCount > 0
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-800"
                        }`}
                      >
                        {supplier.name}
                      </p>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {lastMsg ? formatRelativeTime(lastMsg.createdAt) : ""}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className="text-[12px] text-slate-500 truncate">
                        {lastMsg ? lastMsg.text : conv.quotation.rfq.title}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-orange-500 rounded-full shrink-0">
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ========== RIGHT: Chat area ========== */}
      {/* ========== RIGHT: Chat area ========== */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedConv && currentUser ? (
          <div className="flex-1 min-h-0">
            <RFQChat
              conversationId={selectedConv.id}
              currentUserId={currentUser.id}
              currentUserRole="buyer"
              rfqId={selectedConv.quotation.rfqId}
              supplierId={selectedConv.quotation.supplierId}
              otherPartyId={selectedConv.quotation.supplier.id}
              otherPartyName={selectedConv.quotation.supplier.name}
              otherPartyOnline={selectedConv.quotation.supplier.isOnline}
              otherPartyLastSeen={selectedConv.quotation.supplier.lastSeen}
            />
          </div>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              Select a conversation
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Choose a chat from the left to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}




