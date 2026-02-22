import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod/v4";
import { AMIT_CONTEXT } from "~/lib/amit-context";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

function log(label: string, data?: unknown) {}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, data, metadata } = body;
    const userName =
      body.userName || data?.userName || metadata?.userName || null;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Missing messages" }, { status: 400 });
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),

      system: `${AMIT_CONTEXT}

---
## CONVERSATIONAL PATTERNS — CRITICAL
You switch between two modes based on whether you know the user's name.

### Pattern A: Concise Onboarding (User Name Unknown)
- **Goal**: Identify the user warmly as AURA.
- **Rules**: MAX 25 WORDS for the first greeting, then MAX 15 words.
- **Action**: Acknowledge the greeting (if any), introduce yourself as AURA (Amit's Universal RAG Assistant), and ask for their name and purpose.
- **Tool**: Call \`identifyUser\` as soon as they respond.

### Pattern B: Proactive Assistance (User Name: ${userName || "Unknown"})
- **Goal**: Assist and suggest next steps.
- **Identity**: You are AURA.
- **Brevity**: Max 30 words.
- **Suggestions**: Every response MUST end with exactly one "Try asking: [Contextual Question]" line.

---
## RESPONSE FORMAT — CRITICAL
1. **VOICE**: ONE warm, succinct sentence. Max 15 words.
2. **Full Reply**: Concise answer + ONE suggestion at the end. Use minimal markdown.
Example:
VOICE: Amit is a Principal Architect with eight years of portfolio experience.

Amit has built fifty+ apps across React and Native. 
Try asking: What projects has he built recently?`,

      messages: modelMessages,

      tools: {
        identifyUser: tool({
          description:
            "Save the user's name and purpose of visit to their profile.",
          inputSchema: z.object({
            name: z.string().describe("User's name (e.g. John Doe)"),
            interest: z
              .string()
              .describe(
                "Context or purpose of visit (e.g. Hiring for React, Exploring portfolio, Just curious)",
              ),
          }),
          execute: async ({ name, interest }) => {
            log("identifyUser", { name, interest });
            return { identified: true, name, interest };
          },
        }),
        scrollToSection: tool({
          description: "Scroll the page to a specific section",
          inputSchema: z.object({
            sectionId: z
              .string()
              .describe(
                'Section ID: "work", "experience", "skills", "services", "contact", "story", "github", "testimonials", "pitch", "faq"',
              ),
          }),
          execute: async ({ sectionId }) => {
            log("scrollToSection", { sectionId });
            return { scrolled: true, sectionId };
          },
        }),
      },

      onFinish: async (event) => {
        const lastUserMsg = messages
          .filter((m: any) => m.role === "user")
          .pop()?.content;

        try {
          const { getFirestore } = await import("firebase-admin/firestore");
          const { initializeApp, getApps, cert } =
            await import("firebase-admin/app");
          if (!getApps().length) {
            const key = Buffer.from(
              process.env.FIREBASE_SERVICE_ACCOUNT_KEY!,
              "base64",
            ).toString("utf-8");
            initializeApp({ credential: cert(JSON.parse(key)) });
          }
          await getFirestore()
            .collection("chat_logs")
            .add({
              ts: new Date().toISOString(),
              msgs: messages.length,
              query: lastUserMsg || "",
              reason: event.finishReason,
            });
        } catch {}
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[Chat API] error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
