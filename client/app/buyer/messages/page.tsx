"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/useToast";
import { Send, Clock } from "lucide-react";

export default function BuyerMessages() {
  const { success } = useToast();
  const [conversations, setConversations] = useState([
    {
      id: 1,
      supplier: "Premium Industrial Solutions",
      lastMessage: "Can we reduce the unit price for bulk orders?",
      timestamp: "5 min ago",
      unread: true,
      avatar: "PIS",
      messages: [
        {
          id: 1,
          sender: "supplier",
          text: "Can we reduce the unit price for bulk orders?",
          time: "10:24 AM",
        },
        {
          id: 2,
          sender: "buyer",
          text: "We are evaluating 3 shortlisted vendors.",
          time: "10:26 AM",
        },
      ],
    },
    {
      id: 2,
      supplier: "Global Materials Inc",
      lastMessage: "Your quotation has been approved. Delivery: 2 weeks",
      timestamp: "2 hours ago",
      unread: false,
      avatar: "GMI",
      messages: [
        {
          id: 1,
          sender: "supplier",
          text: "Your quotation has been approved. Delivery: 2 weeks.",
          time: "08:10 AM",
        },
      ],
    },
    {
      id: 3,
      supplier: "Tech Components Ltd",
      lastMessage: "We have stock available for immediate shipment",
      timestamp: "1 day ago",
      unread: false,
      avatar: "TCL",
      messages: [
        {
          id: 1,
          sender: "supplier",
          text: "We have stock available for immediate shipment.",
          time: "Yesterday",
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (!selectedConversation || !messageText.trim()) return;

    const conversationName =
      conversations.find(
        (conversation) => conversation.id === selectedConversation,
      )?.supplier || "supplier";

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation
          ? {
              ...conversation,
              lastMessage: messageText.trim(),
              unread: false,
              timestamp: "Just now",
              messages: [
                ...conversation.messages,
                {
                  id: Date.now(),
                  sender: "buyer",
                  text: messageText.trim(),
                  time: "Just now",
                },
              ],
            }
          : conversation,
      ),
    );
    setMessageText("");
    success("Message sent", `Your note was shared with ${conversationName}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">
          Communicate directly with suppliers
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 h-96">
        {/* Conversations List */}
        <div className="col-span-1">
          <Card className="p-0 h-full overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-slate-900">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-4 border-b hover:bg-slate-50 transition-colors ${
                    selectedConversation === conv.id
                      ? "bg-purple-50 border-l-4 border-l-purple-600"
                      : ""
                  } ${conv.unread ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-slate-900 truncate ${conv.unread ? "font-bold" : ""}`}
                      >
                        {conv.supplier}
                      </p>
                      <p className="text-sm text-slate-600 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="col-span-2">
          {selectedConversation ? (
            <Card className="p-0 h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-slate-900">
                  {
                    conversations.find((c) => c.id === selectedConversation)
                      ?.supplier
                  }
                </h2>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {conversations
                  .find(
                    (conversation) => conversation.id === selectedConversation,
                  )
                  ?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "buyer" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-lg p-3 ${message.sender === "buyer" ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-900"}`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
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
