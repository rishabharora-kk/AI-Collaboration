"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Share, MessageSquare, Bot, MoreHorizontal, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { DocumentStorage, type Document } from "@/lib/document-storage"
import { ChatPanel } from "./chat-panel"
import { AIAssistant } from "./ai-assistant"

interface DocumentEditorProps {
  documentId: string
}

interface Collaborator {
  id: string
  name: string
  image?: string
  cursor?: number
  isTyping?: boolean
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [document, setDocument] = useState<Document | null>(null)
  const [content, setContent] = useState("")
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return
    loadDocument()
  }, [documentId, session?.user?.id])

  const loadDocument = () => {
    try {
      let doc = DocumentStorage.getDocument(documentId)

      if (!doc && session?.user) {
        // Create a new document if it doesn't exist
        doc = DocumentStorage.createDocument(
          "New Document",
          "# New Document\n\nStart writing here...",
          session.user.id!,
          session.user.name!,
          session.user.image || undefined,
        )
      }

      if (doc) {
        setDocument(doc)
        setContent(doc.content)
        setLastSaved(new Date(doc.updatedAt))

        // Add current user as collaborator if not already present
        if (session?.user && !doc.collaborators.find((c) => c.id === session.user.id)) {
          setCollaborators([
            {
              id: session.user.id!,
              name: session.user.name!,
              image: session.user.image || undefined,
            },
          ])
        } else {
          setCollaborators(
            doc.collaborators.map((c) => ({
              id: c.id,
              name: c.name,
              image: c.image,
            })),
          )
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load document",
        variant: "destructive",
      })
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)

    // Auto-save after 2 seconds of inactivity
    clearTimeout((window as any).autoSaveTimeout)
    ;(window as any).autoSaveTimeout = setTimeout(saveDocument, 2000)
  }

  const saveDocument = async () => {
    if (isSaving || !document) return

    setIsSaving(true)
    try {
      const updatedDoc: Document = {
        ...document,
        content,
        updatedAt: new Date().toISOString(),
      }

      DocumentStorage.saveDocument(updatedDoc)
      setDocument(updatedDoc)
      setLastSaved(new Date())

      toast({
        title: "Saved",
        description: "Document saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Document content copied to clipboard",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hover:bg-muted">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold">{document?.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Not saved"}</span>
                  {isSaving && (
                    <>
                      <span>•</span>
                      <span className="text-primary">Saving...</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Collaborators */}
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collaborator) => (
                  <Avatar key={collaborator.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={collaborator.image || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="text-xs">{collaborator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {collaborators.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant={isAIOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="relative"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
                <Badge variant="secondary" className="ml-2 text-xs">
                  New
                </Badge>
              </Button>

              <Button variant={isChatOpen ? "default" : "outline"} size="sm" onClick={() => setIsChatOpen(!isChatOpen)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>

              <Button size="sm" onClick={saveDocument} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to clipboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download as Markdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Document settings</DropdownMenuItem>
                  <DropdownMenuItem>Version history</DropdownMenuItem>
                  <DropdownMenuItem>Export options</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Editor */}
        <div className="flex-1 p-6">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing your document..."
            className="min-h-[600px] resize-none border-none focus-visible:ring-0 text-base leading-relaxed bg-transparent"
          />
        </div>
      </div>

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="w-80 border-l bg-muted/30">
          <ChatPanel documentId={documentId} />
        </div>
      )}

      {/* AI Assistant Panel */}
      {isAIOpen && (
        <div className="w-80 border-l">
          <AIAssistant documentId={documentId} content={content} />
        </div>
      )}
    </div>
  )
}
