/**
 * Chroma Vector Database Client
 * Manages initialization and collections
 */

import type { Document } from './types'

// Chroma client will be initialized lazily
let chromaInstance: any = null

/**
 * Initialize Chroma client for in-memory vector storage
 */
export async function initializeChroma() {
  if (chromaInstance) {
    return chromaInstance
  }

  try {
    // For now, we'll use a simple in-memory store
    // In production, you could use Chroma REST API or other persistence
    chromaInstance = {
      collections: new Map(),
      vectors: new Map(),
      metadata: new Map(),
    }
    return chromaInstance
  } catch (error) {
    console.error('Failed to initialize Chroma:', error)
    throw new Error('Failed to initialize vector database')
  }
}

/**
 * Get or create a collection for storing vectors
 */
export async function getOrCreateCollection(collectionName: string) {
  const chroma = await initializeChroma()

  if (!chroma.collections.has(collectionName)) {
    chroma.collections.set(collectionName, {
      name: collectionName,
      vectors: [],
      metadata: new Map(),
    })
  }

  return chroma.collections.get(collectionName)
}

/**
 * Add documents to collection with semantic search capability
 * (Vector embeddings would be computed via embeddings service)
 */
export async function addDocumentsToCollection(
  collectionName: string,
  documents: Document[]
) {
  const collection = await getOrCreateCollection(collectionName)

  documents.forEach((doc) => {
    const docId = doc.id
    collection.vectors.push({
      id: docId,
      content: doc.content,
      metadata: doc.metadata,
    })
    collection.metadata.set(docId, {
      ...doc,
      addedAt: new Date(),
    })
  })

  return collection
}

/**
 * Query collection for similar documents (simulated semantic search)
 */
export async function queryCollection(
  collectionName: string,
  query: string,
  topK: number = 5
) {
  const collection = await getOrCreateCollection(collectionName)

  if (!collection || collection.vectors.length === 0) {
    return []
  }

  // Simple relevance scoring based on keyword matching
  // In production, use actual embeddings for semantic search
  const results = collection.vectors
    .map((vector: any) => ({
      ...vector,
      relevance: calculateRelevance(query, vector.content),
    }))
    .sort((a: any, b: any) => b.relevance - a.relevance)
    .slice(0, topK)
    .map((result: any) => ({
      id: result.id,
      content: result.content,
      metadata: result.metadata,
      similarity: result.relevance,
    }))

  return results
}

/**
 * Simple relevance scoring (word overlap)
 * Replace with real embedding similarity in production
 */
function calculateRelevance(query: string, content: string): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const contentWords = content.toLowerCase().split(/\s+/)

  let matches = 0
  for (const word of queryWords) {
    if (contentWords.some((w) => w.includes(word) || word.includes(w))) {
      matches++
    }
  }

  return matches > 0 ? matches / queryWords.length : 0
}

/**
 * Delete documents from collection
 */
export async function deleteFromCollection(
  collectionName: string,
  documentIds: string[]
) {
  const collection = await getOrCreateCollection(collectionName)

  documentIds.forEach((id) => {
    const index = collection.vectors.findIndex((v: any) => v.id === id)
    if (index > -1) {
      collection.vectors.splice(index, 1)
    }
    collection.metadata.delete(id)
  })

  return true
}

/**
 * Clear entire collection
 */
export async function clearCollection(collectionName: string) {
  const chroma = await initializeChroma()
  if (chroma.collections.has(collectionName)) {
    chroma.collections.delete(collectionName)
  }
  return true
}

/**
 * Get collection stats
 */
export async function getCollectionStats(collectionName: string) {
  const collection = await getOrCreateCollection(collectionName)

  return {
    name: collectionName,
    documentCount: collection.vectors.length,
    metadata: {
      createdAt: collection.createdAt,
      lastUpdated: collection.lastUpdated,
    },
  }
}
