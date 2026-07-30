"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import {
  Send,
  Check,
  CheckCheck,
  MoreVertical,
  Heart,
  Edit2,
  Trash2,
  X,
  Paperclip,
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

interface MessagesPage {
  messages: Message[];
  nextCursor: string | null;
}

interface RFQChatProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: "buyer" | "supplier";
  rfqId: string;
  supplierId: string;
  otherPartyName?: string;
  otherPartyId?: string;
  // ADD THESE
  otherPartyOnline?: boolean;
  otherPartyLastSeen?: string | null;
}

function MessageStatus({ msg, isMine }: { msg: Message; isMine: boolean }) {
  if (!isMine) return null;

  if (msg.readAt) {
    return (
      <span className="text-sky-300" title="Read">
        <CheckCheck className="inline h-3.5 w-3.5" />
      </span>
    );
  }

  if (msg.deliveredAt) {
    return (
      <span className="text-white/80" title="Delivered">
        <CheckCheck className="inline h-3.5 w-3.5" />
      </span>
    );
  }

  return (
    <span className="text-white/60" title="Sent">
      <Check className="inline h-3.5 w-3.5" />
    </span>
  );
}

function formatMessageDate(date: string) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  return d.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: d.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

function formatPresence(isOnline: boolean, lastSeen: string | null) {
  if (isOnline) {
    return { text: "Online", className: "font-medium text-green-600" };
  }

  if (!lastSeen) {
    return { text: "Offline", className: "text-slate-400" };
  }

  const diffSec = Math.floor(
    (Date.now() - new Date(lastSeen).getTime()) / 1000,
  );

  if (diffSec < 60) {
    return { text: "Last seen just now", className: "text-slate-500" };
  }
  if (diffSec < 3600) {
    const m = Math.floor(diffSec / 60);
    return { text: `Last seen ${m}m ago`, className: "text-slate-500" };
  }
  if (diffSec < 86400) {
    const h = Math.floor(diffSec / 3600);
    return { text: `Last seen ${h}h ago`, className: "text-slate-500" };
  }

  return {
    text: `Last seen ${new Date(lastSeen).toLocaleString()}`,
    className: "text-slate-500",
  };
}

export default function RFQChat({
  conversationId,
  currentUserId,
  currentUserRole,
  rfqId,
  supplierId,
  otherPartyId, // fallback to supplierId for buyer
  otherPartyName = "User",
  otherPartyOnline = false,
  otherPartyLastSeen = null,
}: RFQChatProps) {
  const { error } = useToast();
  const queryClient = useQueryClient();

  const [messageText, setMessageText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const targetUserId = otherPartyId || supplierId;

  const [isOnline, setIsOnline] = useState(otherPartyOnline);
  const [lastSeen, setLastSeen] = useState<string | null>(otherPartyLastSeen);

  const presence = formatPresence(isOnline, lastSeen);

  // Sync when conversation changes

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const prevScrollHeightRef = useRef(0);
  const isLoadingOlderRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  const queryKey = useMemo(
    () => ["messages", conversationId],
    [conversationId],
  );

  // Reset state when conversation changes
  useEffect(() => {
    isFirstLoadRef.current = true;
    isLoadingOlderRef.current = false;
    prevScrollHeightRef.current = 0;
    setMessageText("");
    setEditingMessageId(null);
    setActiveMenuId(null);
  }, [conversationId]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<MessagesPage>({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({ limit: "20" });
        if (pageParam) params.set("cursor", pageParam as string);

        const res = await fetch(
          `${API_URL}/api/messages/${conversationId}?${params.toString()}`,
          { credentials: "include" },
        );
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.message || "Failed to load messages");
        }
        return json.data as MessagesPage;
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: !!conversationId,
    });

  // Sync when conversation changes
  useEffect(() => {
    setIsOnline(otherPartyOnline);
    setLastSeen(otherPartyLastSeen);
  }, [otherPartyOnline, otherPartyLastSeen, conversationId]);

  // Always produce oldest → newest order
  const messages = useMemo(() => {
    if (!data?.pages) return [];

    const all = [...data.pages].reverse().flatMap((page) => page.messages);

    const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());

    return unique.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [data, conversationId]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isLoadingOlderRef.current) {
      isLoadingOlderRef.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: isFirstLoadRef.current ? "auto" : "smooth",
      });
      isFirstLoadRef.current = false;
    }, 50);

    return () => clearTimeout(timeout);
  }, [messages]);

  // Restore scroll position when loading older messages
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !prevScrollHeightRef.current) return;
    const diff = el.scrollHeight - prevScrollHeightRef.current;
    if (diff > 0) el.scrollTop = diff;
    prevScrollHeightRef.current = 0;
  }, [messages]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el || isFetchingNextPage || !hasNextPage) return;

    if (el.scrollTop < 80) {
      prevScrollHeightRef.current = el.scrollHeight;
      isLoadingOlderRef.current = true;
      fetchNextPage();
    }
  };

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

  const updateMessageInCache = useCallback(
    (id: string, updater: (m: Message) => Message) => {
      queryClient.setQueryData<InfiniteData<MessagesPage>>(queryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) => (m.id === id ? updater(m) : m)),
          })),
        };
      });
    },
    [queryClient, queryKey],
  );

  // Socket
  useEffect(() => {
    if (!conversationId) return;

    const socket = socketIO(API_URL, { withCredentials: true } as any);
    socketRef.current = socket as any;

    socket.emit("joinConversation", conversationId);

    socket.on("message:new", (msg: Message) => {
      queryClient.setQueryData<InfiniteData<MessagesPage>>(queryKey, (prev) => {
        if (!prev) {
          return {
            pages: [{ messages: [msg], nextCursor: null }],
            pageParams: [undefined],
          };
        }

        const alreadyExists = prev.pages.some((page) =>
          page.messages.some((m) => m.id === msg.id),
        );
        if (alreadyExists) return prev;

        const pages = [...prev.pages];
        pages[0] = {
          ...pages[0],
          messages: [...(pages[0]?.messages ?? []), msg],
        };

        return { ...prev, pages };
      });

      if (msg.receiverId === currentUserId) {
        fetch(`${API_URL}/api/messages/${msg.id}/delivered`, {
          method: "PATCH",
          credentials: "include",
        });
      }
    });

    socket.on("message:delivered", (msg: Message) => {
      updateMessageInCache(msg.id, (m) => ({
        ...m,
        deliveredAt: msg.deliveredAt,
      }));
    });

    socket.on("message:read", (msg: Message) => {
      updateMessageInCache(msg.id, (m) => ({ ...m, readAt: msg.readAt }));
    });

    socket.on("message:updated", (msg: Message) => {
      updateMessageInCache(msg.id, (m) => ({ ...m, ...msg }));
    });
    // USER ONLINE
    socket.on("user:online", ({ userId }: { userId: string }) => {
      if (userId === targetUserId) {
        setIsOnline(true);
      }
    });

    // USER OFFLINE
    socket.on(
      "user:offline",
      ({ userId, lastSeen: ls }: { userId: string; lastSeen: string }) => {
        if (userId === targetUserId) {
          setIsOnline(false);
          setLastSeen(ls);
        }
      },
    );
    socket.on(
      "messages:all-read",
      ({ conversationId: cid }: { conversationId: string }) => {
        if (cid !== conversationId) return;
        queryClient.setQueryData<InfiniteData<MessagesPage>>(
          queryKey,
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              pages: prev.pages.map((page) => ({
                ...page,
                messages: page.messages.map((m) =>
                  m.senderId === currentUserId
                    ? { ...m, readAt: new Date().toISOString() }
                    : m,
                ),
              })),
            };
          },
        );
      },
    );

    return () => {
      socket.off("message:new");
      socket.off("message:delivered");
      socket.off("message:read");
      socket.off("message:updated");
      socket.off("messages:all-read");
      socket.off("user:online");
      socket.off("user:offline");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    conversationId,
    currentUserId,
    queryClient,
    queryKey,
    updateMessageInCache,
  ]);

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
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Select a supplier to open the conversation.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* HEADER */}

      <div className="border-b border-slate-200 px-5 py-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
            {otherPartyName?.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-slate-900">
              {otherPartyName}
            </h2>

            {/* ✅ USE IT HERE */}
            <div className={`text-xs ${presence.className}`}>
              {presence.text}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="flex min-h-full flex-col justify-end px-5 py-5 space-y-3">
          {isFetchingNextPage && (
            <div className="py-2 text-center text-xs text-slate-400">
              Loading older messages…
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                💬
              </div>
              <p className="text-sm font-medium text-slate-500">
                No messages yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Send a message to start the negotiation
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderRole
                ? msg.senderRole === currentUserRole
                : msg.senderId === currentUserId;
              const isSystem = msg.system;
              const time = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const previousMessage = messages[index - 1];
              const currentDate = new Date(msg.createdAt).toDateString();
              const previousDate = previousMessage
                ? new Date(previousMessage.createdAt).toDateString()
                : null;
              const showDate = currentDate !== previousDate;

              if (isSystem) {
                return (
                  <div key={msg.id} className="my-3 text-center">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <Fragment key={msg.id}>
                  {showDate && (
                    <div className="my-5 flex justify-center">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                        {formatMessageDate(msg.createdAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={`group flex items-end gap-2 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="relative max-w-[75%]">
                      <div
                        className={`px-4 py-2.5 text-[13.5px] leading-relaxed ${
                          msg.isDeleted
                            ? "rounded-2xl border border-slate-200 bg-slate-50 italic text-slate-400"
                            : isMine
                              ? "rounded-2xl rounded-br-md bg-orange-500 text-white shadow-sm"
                              : "rounded-2xl rounded-bl-md border border-slate-100 bg-white text-slate-800 shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>

                        <div
                          className={`mt-1 flex items-center justify-end gap-1 ${
                            isMine ? "text-orange-100" : "text-slate-400"
                          }`}
                        >
                          {msg.isEdited && !msg.isDeleted && (
                            <span className="mr-0.5 text-[10px] italic opacity-80">
                              edited
                            </span>
                          )}
                          <span className="text-[10px]">{time}</span>
                          <MessageStatus msg={msg} isMine={isMine} />
                        </div>

                        {msg.isLiked && !msg.isDeleted && (
                          <div className="absolute -bottom-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                          </div>
                        )}
                      </div>

                      {!msg.isDeleted && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 ${
                            isMine ? "-left-10" : "-right-10"
                          }`}
                        >
                          {!isMine && (
                            <button
                              onClick={() => toggleLikeMutation.mutate(msg.id)}
                              className={`rounded-full p-1.5 hover:bg-slate-100 ${
                                msg.isLiked
                                  ? "text-rose-500"
                                  : "text-slate-400 hover:text-rose-500"
                              }`}
                              title={msg.isLiked ? "Unlike" : "Like"}
                            >
                              <Heart
                                className={`h-3.5 w-3.5 ${
                                  msg.isLiked ? "fill-rose-500" : ""
                                }`}
                              />
                            </button>
                          )}

                          {isMine && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(
                                    activeMenuId === msg.id ? null : msg.id,
                                  );
                                }}
                                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>

                              {activeMenuId === msg.id && (
                                <div className="absolute bottom-full right-0 z-50 mb-1 w-28 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingMessageId(msg.id);
                                      setMessageText(msg.text);
                                      setActiveMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteMessageMutation.mutate(msg.id);
                                      setActiveMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
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
                </Fragment>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white px-4 py-3">
        {editingMessageId && (
          <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <span className="font-medium">Editing message…</span>
            <button
              onClick={() => {
                setEditingMessageId(null);
                setMessageText("");
              }}
              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              editingMessageId ? "Edit your message…" : "Type a message..."
            }
            className="h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          <button
            onClick={handleSend}
            disabled={
              !messageText.trim() ||
              sendMessageMutation.isPending ||
              editMessageMutation.isPending
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-40 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
