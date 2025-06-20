import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages, documentContent } = await req.json()

    // Get the user's message
    const userMessage = messages[messages.length - 1]?.content || ""

    const systemPrompt = `You are an AI writing assistant helping with collaborative document editing. 

Current document content:
${documentContent || "No content yet"}

You can help with:
- Writing suggestions and improvements
- Grammar and style corrections
- Content organization and structure
- Research and fact-checking
- Creative writing assistance

Be concise, helpful, and professional in your responses. Focus on actionable advice.`

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI API Error:", error)

    // Return a structured error response that the frontend can handle
    return new Response(
      JSON.stringify({
        type: "error",
        message: "AI service temporarily unavailable. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
