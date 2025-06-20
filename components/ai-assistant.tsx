"use client"

import type React from "react"

import { useChat } from "ai/react"
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Lightbulb,
  CheckCircle,
  Edit3,
  FileText,
  Target,
  Wand2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIAssistantProps {
  documentId: string
  content: string
}

export function AIAssistant({ documentId, content }: AIAssistantProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/ai/chat",
    body: { documentContent: content },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const suggestions = [
    { text: "Improve the writing style", icon: Edit3 },
    { text: "Check grammar and spelling", icon: CheckCircle },
    { text: "Suggest better structure", icon: FileText },
    { text: "Add more details", icon: Target },
    { text: "Summarize the content", icon: Lightbulb },
    { text: "Make it more engaging", icon: Wand2 },
  ]

  const handleSuggestionClick = (suggestion: string) => {
    // Create a synthetic event
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>

    // Update input and submit
    handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>)

    // Submit after a brief delay to ensure state is updated
    setTimeout(() => {
      handleSubmit(syntheticEvent)
    }, 50)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Writing Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span className="text-xs">Live</span>
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && !error && (
            <div className="space-y-4">
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center text-muted-foreground">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-3 hover:bg-muted/50"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        disabled={isLoading}
                      >
                        <Icon className="h-4 w-4 mr-3 text-muted-foreground" />
                        {suggestion.text}
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>

              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1">AI Writing Assistant Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about your document or use the quick actions above.
                </p>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI service is temporarily unavailable. Please check your API key configuration or try again later.
              </AlertDescription>
            </Alert>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start space-x-2 max-w-[85%]">
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask AI for help..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
