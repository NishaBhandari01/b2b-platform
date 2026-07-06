'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Send } from 'lucide-react'
import { useState } from 'react'

const conversations = [
  {
    id: '1',
    name: 'John Smith',
    company: 'ABC Corp',
    lastMessage: 'Can you provide a quote for bulk orders?',
    time: '2 hours ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'TechWorks Ltd',
    lastMessage: 'Thank you for the quick response',
    time: '1 day ago',
    unread: 0,
  },
  {
    id: '3',
    name: 'Michael Chen',
    company: 'Global Suppliers',
    lastMessage: 'When can you deliver?',
    time: '3 days ago',
    unread: 0,
  },
]

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState('1')
  const [message, setMessage] = useState('')

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 border border-border rounded-lg overflow-y-auto">
          <div className="divide-y divide-border">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full p-4 text-left hover:bg-secondary transition-colors ${
                  selectedId === conv.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{conv.name}</p>
                    <p className="text-xs text-muted-foreground">{conv.company}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 ml-2">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{conv.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 border border-border rounded-lg flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-border p-4">
            <h2 className="font-semibold">{conversations.find(c => c.id === selectedId)?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {conversations.find(c => c.id === selectedId)?.company}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-start">
              <div className="bg-secondary p-3 rounded-lg max-w-xs">
                <p className="text-sm">Hi, I'm interested in your products. Can you send me a catalog?</p>
                <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                <p className="text-sm">Of course! I'll send you our latest catalog right away.</p>
                <p className="text-xs opacity-70 mt-1">10:35 AM</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-secondary p-3 rounded-lg max-w-xs">
                <p className="text-sm">Great! Can you also provide pricing for bulk orders?</p>
                <p className="text-xs text-muted-foreground mt-1">10:40 AM</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="gap-2">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
