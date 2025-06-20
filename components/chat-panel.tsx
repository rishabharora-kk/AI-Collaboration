"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Send, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChatPanelProps {
  documentId: string
}

interface Message {
  id: string
  content: string
  userId: string
  userName: string
  userImage?: string
  timestamp: Date
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add some demo messages
    const demoMessages: Message[] = [
      {
        id: "1",
        content: "Welcome to the document chat! This is where you can discuss changes with your team.",
        userId: "system",
        userName: "System",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: "2",
        content: "Real-time chat will be available once WebSocket server is configured.",
        userId: "system",
        userName: "System",
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
      },
    ]
    setMessages(demoMessages)
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      userId: session.user.id!,
      userName: session.user.name!,
      userImage: session.user.image || undefined,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate a response after a delay
    setTimeout(
      () => {
        const responses = [
          "Great point!",
          "I agree with that approach.",
          "Let me review that section.",
          "Thanks for the feedback!",
          "That's a good suggestion.",
        ]

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          userId: "bot",
          userName: "AI Assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      },
      1000 + Math.random() * 2000,
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-semibold">Chat</h3>
          </div>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"}`} />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Chat is running in demo mode. Messages are simulated until WebSocket server is configured.
            </AlertDescription>
          </Alert>

          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.userImage || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="text-xs">{message.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{message.userName}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-sm mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
