import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod";
import { selectRelevantChunks } from "~/lib/amit-context";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ─── Provider setup ───────────────────────────────────────────────────────────

function buildGroq() {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    return groq("llama-3.3-70b-versatile");
  } catch {
    return null;
  }
}

function buildGemini() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return null;
  try {
    return google("gemini-2.0-flash-exp");
  } catch {
    return null;
  }
}

function buildOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai("gpt-4o-mini");
  } catch {
    return null;
  }
}

function buildHuggingFace() {
  if (!process.env.HUGGINGFACE_API_KEY) return null;
  try {
    const hf = createOpenAI({
      apiKey: process.env.HUGGINGFACE_API_KEY,
      baseURL: "https://api-inference.huggingface.co/v1",
    });
    return hf("meta-llama/Llama-3.1-8B-Instruct");
  } catch {
    return null;
  }
}

type ProviderName = "Groq" | "Gemini" | "OpenAI" | "HuggingFace";

function getModel(): {
  name: ProviderName;
  model: ReturnType<typeof buildGroq>;
} {
  const providers: {
    name: ProviderName;
    build: () => ReturnType<typeof buildGroq>;
  }[] = [
    { name: "Groq", build: buildGroq },
    { name: "Gemini", build: buildGemini },
    { name: "OpenAI", build: buildOpenAI },
    { name: "HuggingFace", build: buildHuggingFace },
  ];

  for (const { name, build } of providers) {
    const model = build();
    if (model) {
      console.log(`[AURA] Using provider: ${name}`);
      return { name, model };
    }
  }

  throw new Error(
    "No AI provider available. Add at least one of: GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, HUGGINGFACE_API_KEY",
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────

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

    // ─── DYNAMIC CONTEXT SELECTION ─────────────────────────────────────────
    // Get the last user message to determine what context to load
    const lastUserMessage =
      messages.filter((m: any) => m.role === "user").pop()?.content || "";

    // Select only relevant chunks (saves 80%+ tokens!)
    const relevantContext = selectRelevantChunks(lastUserMessage, 4000);

    console.log(
      `[AURA] Loaded ${Math.ceil(relevantContext.length / 4)} tokens of context (vs 28K full)`,
    );

    let providerName: ProviderName;
    let model: ReturnType<typeof buildGroq>;

    try {
      const result = getModel();
      providerName = result.name;
      model = result.model;
    } catch (err) {
      return Response.json(
        {
          error: "No AI provider configured.",
          hint: "Add GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, or HUGGINGFACE_API_KEY to your environment variables.",
        },
        { status: 503 },
      );
    }

    const result = streamText({
      model: model!,
      maxTokens: 400,
      temperature: 0.75,

      // ─── USE DYNAMIC CONTEXT ───────────────────────────────────────────
      system: `${relevantContext}

---
## CURRENT SESSION
${
  userName
    ? `The person you're talking to is ${userName}. Use their name occasionally — not every message, just naturally, like a real person would.`
    : "You don't know the user's name yet. Ask casually within the first exchange — something like 'Hey, who am I talking to?' Not as the very first thing, but early."
}

## IF NAME IS UNKNOWN
- Keep first message warm and short (max 20 words total)
- Ask name in a chill way — no corporate speak
- The moment they give their name: call the identifyUser tool right away
- Never say "As an AI" — you're AURA, Ah-mit's portfolio assistant

## IF NAME IS KNOWN (${userName || "n/a"})
- Reference them by name occasionally — sounds human, not robotic
- Every reply MUST end with exactly: Try asking: [a natural follow-up]
- Keep display text tight — max 4 sentences

## NEVER DO THESE (instant robot vibes)
- "Certainly!" / "Of course!" / "Absolutely!" / "Great question!"
- Starting a sentence with "I" as the very first word
- Writing "Amit" in a VOICE line — it's always "Ah-mit"
- Writing "Chakraborty" in a VOICE line — it's "Chock-ruh-bor-tee"  
- Long bullet-point dumps
- Fake enthusiasm — real always beats performative`,

      messages: modelMessages,

      tools: {
        identifyUser: tool({
          description:
            "Save the user's name and why they're visiting Amit's portfolio.",
          inputSchema: z.object({
            name: z.string().describe("User's name"),
            interest: z
              .string()
              .describe(
                "Why they're here — e.g. 'Hiring for React Native', 'Exploring portfolio', 'Just curious'",
              ),
          }),
          execute: async ({ name, interest }) => {
            return { identified: true, name, interest };
          },
        }),

        scrollToSection: tool({
          description:
            "Scroll the portfolio to a specific section when the user asks about it. Always call this when they ask about projects, experience, skills, etc.",
          inputSchema: z.object({
            sectionId: z
              .string()
              .describe(
                'One of: "work", "experience", "skills", "services", "contact", "story", "github", "testimonials", "pitch", "faq"',
              ),
          }),
          execute: async ({ sectionId }) => {
            return { scrolled: true, sectionId };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[AURA Chat] error:", err);

    return Response.json(
      {
        error: "Something went wrong on my end. Try again in a moment.",
      },
      { status: 500 },
    );
  }
}
