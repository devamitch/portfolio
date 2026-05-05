

import { initializeDefaultKnowledgeBase } from "~/lib/rag/knowledge-store";
import { createRAGEngine } from "~/lib/rag/rag-engine";

let ragEngine: ReturnType<typeof createRAGEngine> | null = null;

export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function getEngine() {
  if (!ragEngine) {
    ragEngine = createRAGEngine("portfolio", "openai/gpt-4-turbo");
    await ragEngine.initialize();

    const defaultDocs = initializeDefaultKnowledgeBase();
    await ragEngine.addDocuments(defaultDocs);
  }
  return ragEngine;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, topK = 5 } = body;

    if (!query) {
      return new Response(JSON.stringify({ error: "No query provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const engine = await getEngine();
    const results = await engine.search(query, Math.min(topK, 10));

    return new Response(
      JSON.stringify({
        success: true,
        query,
        results,
        count: results.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Search API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Search API is running",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}