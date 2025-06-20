// Simple localStorage-based document storage for demo purposes
export interface Document {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  ownerId: string
  collaborators: Array<{
    id: string
    name: string
    image?: string
  }>
  role: "owner" | "editor" | "viewer"
}

const STORAGE_KEY = "ai-collab-documents"

export class DocumentStorage {
  static getDocuments(userId: string): Document[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const allDocs: Document[] = stored ? JSON.parse(stored) : []

      // Return documents where user is owner or collaborator
      return allDocs.filter((doc) => doc.ownerId === userId || doc.collaborators.some((c) => c.id === userId))
    } catch (error) {
      console.error("Error loading documents:", error)
      return []
    }
  }

  static getDocument(id: string): Document | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const allDocs: Document[] = stored ? JSON.parse(stored) : []
      return allDocs.find((doc) => doc.id === id) || null
    } catch (error) {
      console.error("Error loading document:", error)
      return null
    }
  }

  static saveDocument(document: Document): void {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const allDocs: Document[] = stored ? JSON.parse(stored) : []

      const existingIndex = allDocs.findIndex((doc) => doc.id === document.id)

      if (existingIndex >= 0) {
        allDocs[existingIndex] = document
      } else {
        allDocs.push(document)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allDocs))
    } catch (error) {
      console.error("Error saving document:", error)
    }
  }

  static createDocument(
    title: string,
    content: string,
    userId: string,
    userName: string,
    userImage?: string,
  ): Document {
    const document: Document = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: userId,
      collaborators: [
        {
          id: userId,
          name: userName,
          image: userImage,
        },
      ],
      role: "owner",
    }

    this.saveDocument(document)
    return document
  }
}
