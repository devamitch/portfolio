

import { createDocumentsFromUpload } from "~/lib/rag/knowledge-store";
import { createRAGEngine } from "~/lib/rag/rag-engine";

let ragEngine: ReturnType<typeof createRAGEngine> | null = null;

export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function getEngine() {
  if (!ragEngine) {
    ragEngine = createRAGEngine("portfolio", "openai/gpt-4-turbo");
    await ragEngine.initialize();
  }
  return ragEngine;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 10MB." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const text = await file.text();

    const uploadId = Date.now().toString();
    const documents = createDocumentsFromUpload(file.name, text, uploadId);

    const engine = await getEngine();
    await engine.addDocuments(documents);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Uploaded and processed ${file.name}`,
        uploadId,
        documentsCreated: documents.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process upload",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}