/**
 * Knowledge Base Management API
 * GET /api/rag/knowledge-base - List entries
 * POST /api/rag/knowledge-base - Create entry
 * PUT /api/rag/knowledge-base/:id - Update entry
 * DELETE /api/rag/knowledge-base/:id - Delete entry
 */

import { createDocumentsFromKBEntries } from "~/lib/rag/knowledge-store";
import { createRAGEngine } from "~/lib/rag/rag-engine";
import type { KnowledgeBaseEntry } from "~/lib/rag/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

let ragEngine: ReturnType<typeof createRAGEngine> | null = null;
const kbEntries: Map<string, KnowledgeBaseEntry> = new Map();

async function getEngine() {
  if (!ragEngine) {
    ragEngine = createRAGEngine("portfolio", "openai/gpt-4-turbo");
    await ragEngine.initialize();
  }
  return ragEngine;
}

/**
 * GET - List all knowledge base entries
 */
export async function GET() {
  try {
    const entries = Array.from(kbEntries.values());

    return new Response(
      JSON.stringify({
        success: true,
        entries,
        count: entries.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("KB GET error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve entries" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST - Create new knowledge base entry
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, tags } = body;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create entry
    const entry: KnowledgeBaseEntry = {
      id: `kb-${Date.now()}`,
      title,
      content,
      category: category || "general",
      tags: tags || [],
    };

    // Store entry
    kbEntries.set(entry.id, entry);

    // Add to RAG engine
    const engine = await getEngine();
    const documents = createDocumentsFromKBEntries([entry]);
    await engine.addDocuments(documents);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Knowledge base entry created",
        entry,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("KB POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to create entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * PUT - Update knowledge base entry
 */
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !kbEntries.has(id)) {
      return new Response(JSON.stringify({ error: "Entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { title, content, category, tags } = body;

    // Update entry
    const entry = kbEntries.get(id)!;
    const updated: KnowledgeBaseEntry = {
      ...entry,
      title: title || entry.title,
      content: content || entry.content,
      category: category || entry.category,
      tags: tags || entry.tags,
    };

    kbEntries.set(id, updated);

    // Update in RAG engine
    const engine = await getEngine();
    const documents = createDocumentsFromKBEntries([updated]);
    await engine.addDocuments(documents);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Entry updated",
        entry: updated,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("KB PUT error:", error);
    return new Response(JSON.stringify({ error: "Failed to update entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * DELETE - Remove knowledge base entry
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !kbEntries.has(id)) {
      return new Response(JSON.stringify({ error: "Entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    kbEntries.delete(id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Entry deleted",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("KB DELETE error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
