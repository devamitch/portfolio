import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod";
import { AMIT_CONTEXT } from "~/lib/amit-context";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

function getModel() {
  const providers = [
    { name: "Groq", build: buildGroq },
    { name: "Gemini", build: buildGemini },
    { name: "OpenAI", build: buildOpenAI },
    { name: "HuggingFace", build: buildHuggingFace },
  ];
  for (const { name, build } of providers) {
    const model = build();
    if (model) {
      console.log(`[AURA] Provider: ${name}`);
      return model;
    }
  }
  throw new Error("No AI provider configured.");
}

// Handle all AI SDK v4 message formats (parts[], string, array)
function extractText(msg: any): string {
  if (!msg) return "";
  const parts: any[] = msg?.parts ?? [];
  if (parts.length > 0) {
    const t = parts
      .filter((p: any) => p?.type === "text")
      .map((p: any) => String(p?.text ?? ""))
      .join(" ")
      .trim();
    if (t) return t;
  }
  const c = msg?.content;
  if (typeof c === "string") return c.trim();
  if (Array.isArray(c))
    return c
      .filter((x: any) => x?.type === "text")
      .map((x: any) => String(x?.text ?? ""))
      .join(" ")
      .trim();
  return "";
}

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
    const lastQuery = extractText(
      messages.filter((m: any) => m.role === "user").pop(),
    );
    console.log(`[AURA] Query: "${lastQuery}"`);

    let model: ReturnType<typeof buildGroq>;
    try {
      model = getModel();
    } catch {
      return Response.json(
        {
          error: "No AI provider configured.",
          hint: "Add GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, or HUGGINGFACE_API_KEY.",
        },
        { status: 503 },
      );
    }

    const result = streamText({
      model: model!,
      maxTokens: 400,
      temperature: 0.75,
      system: `${AMIT_CONTEXT}

---
## SESSION
${
  userName
    ? `Talking to: ${userName}. Use their name occasionally, naturally. Every reply ends with "Try asking: [follow-up]". Max 4 sentences.`
    : "Name unknown. First reply: warm + short (max 20 words). Ask name casually early — not the very first thing. Call identifyUser tool the moment they give their name."
}`,

      messages: modelMessages,

      tools: {
        identifyUser: tool({
          description:
            "Save user name and visit reason the moment they share their name.",
          inputSchema: z.object({
            name: z.string(),
            interest: z
              .string()
              .describe("e.g. 'Hiring for React Native', 'Just exploring'"),
          }),
          execute: async ({ name, interest }) => ({
            identified: true,
            name,
            interest,
          }),
        }),

        scrollToSection: tool({
          description:
            "Scroll the portfolio to a section. ALWAYS call when user asks about projects, skills, experience, pricing, contact, story, github, testimonials, pitch, or faq.",
          inputSchema: z.object({
            sectionId: z
              .string()
              .describe(
                '"work"|"experience"|"skills"|"services"|"contact"|"story"|"github"|"testimonials"|"pitch"|"faq"',
              ),
          }),
          execute: async ({ sectionId }) => ({ scrolled: true, sectionId }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[AURA] error:", err);
    return Response.json(
      { error: "Something went wrong. Try again in a moment." },
      { status: 500 },
    );
  }
}
