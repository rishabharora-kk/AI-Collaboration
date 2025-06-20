import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return empty array - documents will be loaded client-side from localStorage
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await request.json()

    // Create document structure that will be saved client-side
    const document = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content: description || `# ${title}\n\nStart writing here...`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: session.user.id,
      collaborators: [
        {
          id: session.user.id,
          name: session.user.name || "You",
          image: session.user.image,
        },
      ],
      role: "owner" as const,
    }

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
