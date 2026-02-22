/**
 * Web Scraping API Endpoint
 * POST /api/rag/scrape
 *
 * Scrapes content from URLs and adds to knowledge base
 */

import { createDocumentsFromScrape } from "~/lib/rag/knowledge-store";
import { createRAGEngine } from "~/lib/rag/rag-engine";

let ragEngine: ReturnType<typeof createRAGEngine> | null = null;

async function getEngine() {
  if (!ragEngine) {
    ragEngine = createRAGEngine("portfolio", "openai/gpt-4-turbo");
    await ragEngine.initialize();
  }
  return ragEngine;
}

/**
 * Extract text content from HTML
 */
function extractTextFromHTML(html: string): string {
  // Simple HTML tag removal
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

/**
 * POST handler for URL scraping
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch content from URL
    let content: string;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 10000, // 10 second timeout
      } as RequestInit & { timeout: number });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      content = extractTextFromHTML(html);

      if (!content || content.length < 100) {
        return new Response(
          JSON.stringify({
            error: "Unable to extract sufficient content from URL",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch URL";
      return new Response(
        JSON.stringify({ error: `Failed to fetch URL: ${errorMsg}` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create documents from scraped content
    const scrapeId = Date.now().toString();
    const documents = createDocumentsFromScrape(url, content, scrapeId);

    // Add to knowledge base
    const engine = await getEngine();
    await engine.addDocuments(documents);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped and indexed content from ${url}`,
        scrapeId,
        documentsCreated: documents.length,
        contentLength: content.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Scrape API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process scrape request",
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
 * GET handler for health check
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Web scraping API is running",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
