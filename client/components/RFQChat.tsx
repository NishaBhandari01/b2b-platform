"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Send,
  Check,
  CheckCheck,
  MoreVertical,
  Heart,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";
import socketIO from "socket.io-client";

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
  isLiked: boolean;
  isEdited: boolean;
  isDeleted: boolean;
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

function MessageStatus({ msg, isMine }: { msg: Message; isMine: boolean }) {
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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const queryKey = ["messages", conversationId];

  // Close message action menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Fetch messages via React Query (polls every 5s as fallback)
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey,
    queryFn: async () => {
      console.log("🔥 GET /messages API called");
      const res = await fetch(`${API_URL}/api/messages/${conversationId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load messages");
      return data.data as Message[];
    },
    enabled: !!conversationId,
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
  }, [conversationId, queryClient, queryKey]);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  // Socket.io connection – join the conversation room for real-time updates
  useEffect(() => {
    if (!conversationId) return;

    const socket = socketIO(API_URL, { withCredentials: true } as any);
    socket.on("connect", () => {
      console.log("🟢 Socket Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
    });
    socketRef.current = socket as any;

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
        prev.map((m) =>
          m.id === msg.id ? { ...m, deliveredAt: msg.deliveredAt } : m,
        ),
      );
    });

    socket.on("message:read", (msg: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev = []) =>
        prev.map((m) => (m.id === msg.id ? { ...m, readAt: msg.readAt } : m)),
      );
    });

    socket.on("message:updated", (msg: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev = []) =>
        prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
      );
    });

    socket.on(
      "messages:all-read",
      ({ conversationId: cid }: { conversationId: string }) => {
        if (cid === conversationId) {
          queryClient.setQueryData<Message[]>(queryKey, (prev = []) =>
            prev.map((m) =>
              m.senderId === currentUserId
                ? { ...m, readAt: new Date().toISOString() }
                : m,
            ),
          );
        }
      },
    );

    return () => {
      // socket.disconnect();
      // socketRef.current = null;
      socket.off("message:new");
      socket.off("message:delivered");
      socket.off("message:read");
      socket.off("message:updated");
      socket.off("messages:all-read");

      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, currentUserId, queryClient, queryKey]);

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
      // queryClient.invalidateQueries({ queryKey });
      if (!conversationId) {
        queryClient.invalidateQueries({ queryKey: ["rfq"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
    onError: (err) => {
      error("Send failed", (err as Error).message);
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/messages/${id}/like`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to like message");
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const res = await fetch(`${API_URL}/api/messages/${id}/edit`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to edit message");
    },
    onSuccess: () => {
      setEditingMessageId(null);
      setMessageText("");
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete message");
    },
  });

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    if (editingMessageId) {
      editMessageMutation.mutate({ id: editingMessageId, text: trimmed });
    } else {
      sendMessageMutation.mutate(trimmed);
    }
  };

  if (!supplierId) {
    return (
      <Card className="p-6 flex items-center justify-center h-64 text-slate-500 text-sm">
        Select a supplier to open the conversation.
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[28rem] overflow-hidden shadow-md border border-slate-200 rounded-xl bg-slate-50">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {otherPartyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">
              {otherPartyName}
            </p>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Real-time Negotiation
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
              💬
            </div>
            <p className="text-sm font-medium">
              No messages yet. Send a message to start the negotiation.
            </p>
          </div>
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
                <div key={msg.id} className="text-center my-2">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full border border-slate-200/40">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex group items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
              >
                {/* Other user avatar (on the left) */}
                {!isMine && (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-semibold flex-shrink-0 shadow-sm">
                    {otherPartyName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex flex-col max-w-[70%] space-y-1 relative">
                  {/* Sender Name (only for received messages) */}
                  {!isMine && (
                    <p className="text-[11px] text-slate-500 font-medium ml-1">
                      {msg.sender?.name ?? "Supplier"}
                    </p>
                  )}

                  {/* Message Bubble Container with Actions on Hover */}
                  <div
                    className={`flex items-center gap-2 ${isMine ? "flex-row-reverse animate-in fade-in slide-in-from-right-2 duration-200" : "flex-row animate-in fade-in slide-in-from-left-2 duration-200"}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm relative group/bubble ${
                        msg.isDeleted
                          ? "bg-slate-200/50 text-slate-400 italic border border-slate-200/80 rounded-bl-sm"
                          : isMine
                            ? "bg-purple-600 text-white rounded-br-sm shadow-sm"
                            : "bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-200/80"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>

                      <div
                        className={`flex items-center gap-1 mt-1 justify-end ${
                          isMine ? "text-white/60" : "text-slate-400"
                        }`}
                      >
                        {msg.isEdited && !msg.isDeleted && (
                          <span className="text-[10px] font-medium italic opacity-85 mr-1">
                            edited
                          </span>
                        )}
                        <span className="text-[10px]">{time}</span>
                        <MessageStatus msg={msg} isMine={isMine} />
                      </div>

                      {/* Message Reaction / Like Heart Badge */}
                      {msg.isLiked && !msg.isDeleted && (
                        <div className="absolute -bottom-2 -right-1 bg-white border border-slate-100 rounded-full p-0.5 shadow-sm flex items-center justify-center animate-in zoom-in-50 duration-200">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        </div>
                      )}
                    </div>

                    {/* Action buttons (only show if message is NOT deleted) */}
                    {!msg.isDeleted && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                        {/* Like/Heart button for received messages */}
                        {!isMine && (
                          <button
                            onClick={() => toggleLikeMutation.mutate(msg.id)}
                            className={`p-1.5 rounded-full hover:bg-slate-200 transition-colors ${
                              msg.isLiked
                                ? "text-rose-500"
                                : "text-slate-400 hover:text-rose-500"
                            }`}
                            title={msg.isLiked ? "Unlike" : "Like"}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${msg.isLiked ? "fill-rose-500" : ""}`}
                            />
                          </button>
                        )}

                        {/* Edit / Delete menu for my own messages */}
                        {isMine && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(
                                  activeMenuId === msg.id ? null : msg.id,
                                );
                              }}
                              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            {activeMenuId === msg.id && (
                              <div className="absolute right-0 bottom-full mb-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingMessageId(msg.id);
                                    setMessageText(msg.text);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMessageMutation.mutate(msg.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-white flex flex-col gap-2">
        {editingMessageId && (
          <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-lg text-xs text-slate-600 border border-slate-200">
            <span className="font-medium">Editing message...</span>
            <button
              onClick={() => {
                setEditingMessageId(null);
                setMessageText("");
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={
              editingMessageId ? "Edit your message..." : "Type a message…"
            }
            className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={
              !messageText.trim() ||
              sendMessageMutation.isPending ||
              editMessageMutation.isPending
            }
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center hover:opacity-95 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
