"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Send, Check, CheckCheck } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";
import { io as socketIO, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MessageSender {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string | null;
  senderRole: string | null;
  receiverId: string | null;
  text: string;
  system: boolean;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
  sender?: MessageSender | null;
  receiver?: MessageSender | null;
}

interface RFQChatProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: "buyer" | "supplier";
  rfqId: string;
  supplierId: string;
  /** Display name of the other party */
  otherPartyName?: string;
}

function MessageStatus({
  msg,
  isMine,
}: {
  msg: Message;
  isMine: boolean;
}) {
  if (!isMine) return null;
  if (msg.readAt)
    return (
      <span className="text-blue-300" title="Read">
        <CheckCheck className="inline w-3 h-3" />
      </span>
    );
  if (msg.deliveredAt)
    return (
      <span className="text-white/70" title="Delivered">
        <CheckCheck className="inline w-3 h-3" />
      </span>
    );
  return (
    <span className="text-white/50" title="Sent">
      <Check className="inline w-3 h-3" />
    </span>
  );
}

export default function RFQChat({
  conversationId,
  currentUserId,
  currentUserRole,
  rfqId,
  supplierId,
  otherPartyName = "Supplier",
}: RFQChatProps) {
  const { error } = useToast();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const queryKey = ["messages", conversationId];

  // Fetch messages via React Query (polls every 5s as fallback)
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/messages/${conversationId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load messages");
      return data.data as Message[];
    },
    enabled: !!conversationId,
    refetchInterval: 5000,
  });

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark all messages as read when conversation opens
  const markAllRead = useCallback(async () => {
    if (!conversationId) return;
    await fetch(
      `${API_URL}/api/messages/conversation/${conversationId}/read-all`,
      { method: "PATCH", credentials: "include" },
    );
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({ queryKey: ["unread-count"] });
  }, [conversationId]);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  // Socket.io connection – join the conversation room for real-time updates
  useEffect(() => {
    if (!conversationId) return;

    const socket = socketIO(API_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.emit("joinConversation", conversationId);

    socket.on("message:new", (msg: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev = []) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // If the new message is for us, mark it delivered
      if (msg.receiverId === currentUserId) {
        fetch(`${API_URL}/api/messages/${msg.id}/delivered`, {
          method: "PATCH",
          credentials: "include",
        });
      }
    });

    socket.on("message:delivered", (msg: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev = []) =>
        prev.map((m) => (m.id === msg.id ? { ...m, deliveredAt: msg.deliveredAt } : m)),
      );
    });

    socket.on("message:read", (msg: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev = []) =>
        prev.map((m) => (m.id === msg.id ? { ...m, readAt: msg.readAt } : m)),
      );
    });

    socket.on("messages:all-read", ({ conversationId: cid }: { conversationId: string }) => {
      if (cid === conversationId) {
        queryClient.setQueryData<Message[]>(queryKey, (prev = []) =>
          prev.map((m) =>
            m.senderId === currentUserId ? { ...m, readAt: new Date().toISOString() } : m,
          ),
        );
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, currentUserId]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfqId, supplierId, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send message");
      return data.data as Message;
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey });
      if (!conversationId) {
        queryClient.invalidateQueries({ queryKey: ["rfq"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
    onError: (err) => {
      error("Send failed", (err as Error).message);
    },
  });

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(trimmed);
  };

  if (!supplierId) {
    return (
      <Card className="p-6 flex items-center justify-center h-64 text-slate-500 text-sm">
        Select a supplier to open the conversation.
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[28rem] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-slate-50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          {otherPartyName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{otherPartyName}</p>
          <p className="text-xs text-slate-500">Shared conversation</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400 mt-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            const isSystem = msg.system;
            const time = new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[75%]">
                  {/* Sender label */}
                  {!isMine && (
                    <p className="text-xs text-slate-500 mb-1 ml-1">
                      {msg.sender?.name ?? "Supplier"}
                    </p>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-purple-600 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-900 rounded-bl-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`text-xs ${isMine ? "text-white/60" : "text-slate-400"}`}
                      >
                        {time}
                      </span>
                      <MessageStatus msg={msg} isMine={isMine} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-white flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleSend}
          disabled={!messageText.trim() || sendMessageMutation.isPending}
          className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
