"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Search, FileText, Users, Clock, Filter, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateDocumentDialog } from "./create-document-dialog"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"
import { DocumentStorage, type Document } from "@/lib/document-storage"
import { useRouter } from "next/navigation"

export function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (session?.user?.id) {
      loadDocuments()
    }
  }, [session?.user?.id])

  const loadDocuments = () => {
    if (!session?.user?.id) return

    const userDocs = DocumentStorage.getDocuments(session.user.id)
    setDocuments(userDocs)
  }

  const handleDocumentCreated = (newDoc: Document) => {
    DocumentStorage.saveDocument(newDoc)
    loadDocuments()
  }

  const handleDocumentClick = (documentId: string) => {
    router.push(`/document/${documentId}`)
  }

  const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const recentDocuments = documents
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">AI Collaboration</h1>
              </div>

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button onClick={() => setIsCreateDialogOpen(true)} className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
              </h2>
              <p className="text-muted-foreground">
                {documents.length === 0
                  ? "Create your first document to get started with AI-powered collaboration."
                  : `You have ${documents.length} document${documents.length === 1 ? "" : "s"} in your workspace.`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {documents.length === 0 ? "Create your first document" : "Across all projects"}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(documents.flatMap((doc) => doc.collaborators.map((c) => c.id))).size}
                </div>
                <p className="text-xs text-muted-foreground">Unique team members</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    documents.filter((doc) => new Date(doc.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Updated today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Documents */}
          {recentDocuments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentDocuments.map((document) => (
                  <Card
                    key={document.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => handleDocumentClick(document.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base truncate">{document.title}</CardTitle>
                        <Badge variant={document.role === "owner" ? "default" : "secondary"} className="text-xs">
                          {document.role}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm">
                        {document.content.substring(0, 80)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {document.collaborators.slice(0, 3).map((collaborator) => (
                            <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={collaborator.image || "/placeholder.svg?height=24&width=24"} />
                              <AvatarFallback className="text-xs">{collaborator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {document.collaborators.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                              +{document.collaborators.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(document.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Documents */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {searchQuery ? `Search Results (${filteredDocuments.length})` : "All Documents"}
              </h3>
              {documents.length > 0 && (
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}
            </div>

            {filteredDocuments.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}
              >
                {filteredDocuments.map((document) => (
                  <Card
                    key={document.id}
                    className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
                      viewMode === "grid" ? "hover:scale-[1.02]" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleDocumentClick(document.id)}
                  >
                    <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
                      <div className="flex items-start justify-between">
                        <CardTitle className={`truncate ${viewMode === "list" ? "text-base" : "text-lg"}`}>
                          {document.title}
                        </CardTitle>
                        <Badge variant={document.role === "owner" ? "default" : "secondary"}>{document.role}</Badge>
                      </div>
                      {viewMode === "grid" && (
                        <CardDescription className="line-clamp-2">
                          {document.content.substring(0, 100)}...
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className={viewMode === "list" ? "pt-0" : ""}>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {document.collaborators.slice(0, 3).map((collaborator) => (
                            <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={collaborator.image || "/placeholder.svg?height=24&width=24"} />
                              <AvatarFallback className="text-xs">{collaborator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {document.collaborators.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                              +{document.collaborators.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(document.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">{searchQuery ? "No documents found" : "No documents yet"}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchQuery
                    ? "Try adjusting your search terms or create a new document."
                    : "Create your first document to start collaborating with AI assistance."}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Document
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateDocumentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onDocumentCreated={handleDocumentCreated}
      />
    </div>
  )
}
