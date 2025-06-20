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

    // Get the last user message
    const lastMessage = messages[messages.length - 1]?.content || ""

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
      model: google("gemini-1.5-flash", {
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
      }),
      system: systemPrompt,
      messages: [{ role: "user", content: lastMessage }],
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI API Error:", error)

    // Return a fallback response
    return new Response(
      JSON.stringify({
        error: "AI service temporarily unavailable",
        fallback:
          "I'm here to help with your writing! Try asking me to improve your content, check grammar, or suggest better structure.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
