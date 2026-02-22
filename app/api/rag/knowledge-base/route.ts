

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

    const entry: KnowledgeBaseEntry = {
      id: `kb-${Date.now()}`,
      title,
      content,
      category: category || "general",
      tags: tags || [],
    };

    kbEntries.set(entry.id, entry);

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

    const entry = kbEntries.get(id)!;
    const updated: KnowledgeBaseEntry = {
      ...entry,
      title: title || entry.title,
      content: content || entry.content,
      category: category || entry.category,
      tags: tags || entry.tags,
    };

    kbEntries.set(id, updated);

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