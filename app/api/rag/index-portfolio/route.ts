/**
 * Portfolio Indexing API Endpoint
 * POST /api/rag/index-portfolio
 *
 * Initializes the knowledge base with portfolio data
 */

import { initializeDefaultKnowledgeBase } from "~/lib/rag/knowledge-store";
import { createRAGEngine } from "~/lib/rag/rag-engine";

let ragEngine: ReturnType<typeof createRAGEngine> | null = null;
let isInitialized = false;

async function getEngine() {
  if (!ragEngine) {
    ragEngine = createRAGEngine("portfolio", "openai/gpt-4-turbo");
    await ragEngine.initialize();
  }
  return ragEngine;
}

/**
 * POST handler to initialize portfolio knowledge base
 */
export async function POST(request: Request) {
  try {
    if (isInitialized) {
      return new Response(
        JSON.stringify({
          message: "Knowledge base already initialized",
          status: "already_initialized",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const engine = await getEngine();
    const documents = initializeDefaultKnowledgeBase();

    // Add portfolio documents to the knowledge base
    await engine.addDocuments(documents);

    isInitialized = true;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Portfolio knowledge base initialized",
        documentsAdded: documents.length,
        status: "initialized",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Portfolio indexing error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to initialize portfolio knowledge base",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * GET handler for initialization status
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Portfolio indexing API is running",
      isInitialized,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
