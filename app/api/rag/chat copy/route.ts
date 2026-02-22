import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod";
import { AMIT_CONTEXT } from "~/lib/amit-context";
import { COLLECTIONS, adminDb, withMeta } from "~/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SYSTEM_PROMPT = `
${AMIT_CONTEXT}

CRITICAL INSTRUCTIONS:
1. Answer using ONLY the provided context. If asked something outside this scope, politely direct them to the contact form.
2. Keep responses brief and conversational for text-to-speech.
`;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.7,
      maxTokens: 500,
      maxSteps: 2, // Allows the AI to call a tool and then speak its response
      tools: {
        scrollToSection: tool({
          description:
            "Scroll the user's screen to a specific section of the portfolio.",
          parameters: z.object({
            target: z.enum([
              "hero",
              "about",
              "work",
              "experience",
              "skills",
              "story",
              "github",
              "testimonials",
              "services",
              "pitch",
              "contact",
            ]),
          }),
          execute: async ({ target }) => {
            return { success: true, target }; // Yields to frontend to trigger scroll
          },
        }),
      },
      onFinish: async ({ text, toolCalls }) => {
        // Asynchronous Firebase Logging (Fire and Forget)
        try {
          if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) return;
          const chatRef = adminDb
            .collection(COLLECTIONS.aiChats)
            .doc(sessionId || "anonymous_session");

          await chatRef.collection("messages").add(
            withMeta({
              role: "user",
              text: latestMessage,
            }),
          );

          await chatRef.collection("messages").add(
            withMeta({
              role: "assistant",
              text: text,
              toolsTriggered: toolCalls || null,
            }),
          );
        } catch (fbError) {
          console.error("[Firebase Logging Error]:", fbError);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[Chat API Error]:", error);
    return Response.json({ error: "Service unavailable" }, { status: 500 });
  }
}
