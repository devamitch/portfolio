/**
 * /app/api/rag/chat/route.ts
 * AI SDK v6 — Groq + scrollToSection tool + VOICE: summary tag
 */

import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod/v4";
import { AMIT_CONTEXT } from "~/lib/amit-context";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

function log(label: string, data?: unknown) {
  console.log(`[Chat API] ${label}`, data ?? "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Missing messages" }, { status: 400 });
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),

      system: `${AMIT_CONTEXT}

---
## RESPONSE FORMAT — CRITICAL, FOLLOW EVERY TIME

Every response MUST begin with this exact line:
VOICE: [your spoken summary here]

Then a blank line, then your full reply.

Rules for the VOICE line:
- Plain English only. No markdown, no asterisks, no bullet points, no backticks.
- One or two sentences maximum. Under 35 words.
- Written as if you are telling a friend what you just found out — casual, warm, direct.
- Say numbers as words: "one hundred fifty dollars", "twenty one engineers", "eight years".
- Do NOT start with "I" — start with the key fact.
- Examples of GOOD VOICE lines:
  VOICE: Amit has shipped eighteen production apps over eight years — the biggest was a full health tech platform for a Canadian startup.
  VOICE: Consulting starts at one fifty an hour, with fixed project rates available after a free discovery call.
  VOICE: He built DeFi Eleven — a fully on-chain fantasy sports app with smart contract prize pools on Ethereum.
  VOICE: You can reach him at amit98ch at gmail dot com — he typically replies within twenty four hours.
  VOICE: React Native is his core expertise — eight years, bridgeless architecture, fifty thousand users across multiple live apps.
  VOICE: His last role was Principal Architect at Synapsis Medical, where he led a twenty one person team from zero to production.

After the VOICE line, give your full response. You may use markdown in the full response.`,

      messages: modelMessages,

      tools: {
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
        log("finished", {
          reason: event.finishReason,
          tokens: event.usage?.outputTokens,
        });

        // Optional Firebase logging — non-fatal
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
          await getFirestore().collection("chat_logs").add({
            ts: new Date().toISOString(),
            msgs: messages.length,
            reason: event.finishReason,
          });
        } catch {
          // Firebase optional — ignore
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[Chat API] error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
