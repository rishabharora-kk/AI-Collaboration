import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Return a default document structure - actual content will be loaded client-side
    const document = {
      id,
      title: "Loading...",
      content: "Loading document...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: session.user.id,
    }

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { content } = await request.json()

    // Return success - actual saving happens client-side
    const document = {
      id,
      content,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
