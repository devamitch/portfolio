

import { queryCollection } from './chroma-client'
import { generateEmbedding, cosineSimilarity } from './embeddings'
import type { QueryResult } from './types'

export async function retrieveRelevantDocuments(
  query: string,
  collectionName: string = 'portfolio',
  topK: number = 5
): Promise<QueryResult[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)

    const results = await queryCollection(collectionName, query, topK)

    const rankedResults = results.map((result) => ({
      ...result,
      similarity: Math.max(0, Math.min(1, result.similarity)),
    }))

    return rankedResults
  } catch (error) {
    console.error('Error retrieving documents:', error)
    return []
  }
}

export function formatDocumentsForContext(
  documents: QueryResult[]
): string {
  if (documents.length === 0) {
    return 'No relevant documents found.'
  }

  const formatted = documents
    .map(
      (doc, index) =>
        `[Source ${index + 1}] (confidence: ${(doc.similarity * 100).toFixed(0)}%)\n${doc.content}`
    )
    .join('\n\n---\n\n')

  return formatted
}

/**
 * Build RAG context for the LLM prompt
 */
export async function buildRAGContext(
  query: string,
  collectionName: string = 'portfolio',
  topK: number = 5
): Promise<{ context: string; sources: QueryResult[] }> {
  const sources = await retrieveRelevantDocuments(query, collectionName, topK)
  const context = formatDocumentsForContext(sources)

  return {
    context,
    sources,
  }
}

/**
 * Calculate average confidence from retrieved documents
 */
export function calculateAverageConfidence(documents: QueryResult[]): number {
  if (documents.length === 0) {
    return 0
  }

  const sum = documents.reduce((acc, doc) => acc + doc.similarity, 0)
  return sum / documents.length
}

/**
 * Filter documents by confidence threshold
 */
export function filterByConfidence(
  documents: QueryResult[],
  threshold: number = 0.3
): QueryResult[] {
  return documents.filter((doc) => doc.similarity >= threshold)
}

/**
 * Retrieve documents with hybrid search (keyword + semantic)
 */
export async function hybridSearch(
  query: string,
  collectionName: string = 'portfolio',
  topK: number = 5
): Promise<QueryResult[]> {
  try {
    // Semantic search
    const semanticResults = await retrieveRelevantDocuments(
      query,
      collectionName,
      topK
    )

    // For now, return semantic results
    // In production, could combine with BM25 keyword search
    return semanticResults
  } catch (error) {
    console.error('Error in hybrid search:', error)
    return []
  }
}