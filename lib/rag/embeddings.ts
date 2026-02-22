/**
 * Embeddings Service
 * Handles text embedding generation using Vercel AI SDK
 */

import { embed } from 'ai'

// Cache for embeddings to reduce API calls
const embeddingCache = new Map<string, number[]>()

/**
 * Generate embeddings for text using Vercel AI SDK
 * Uses the AI Gateway with default provider
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Check cache first
  const cacheKey = `embed:${text.slice(0, 100)}`
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!
  }

  try {
    // Use Vercel AI SDK's embed function
    // This uses the Vercel AI Gateway by default
    const result = await embed({
      model: 'openai/text-embedding-3-small',
      value: text,
    })

    const embedding = result.embedding

    // Cache the result
    embeddingCache.set(cacheKey, embedding)

    return embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    // Fallback: return a simple hash-based vector
    return generateFallbackEmbedding(text)
  }
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map((text) => generateEmbedding(text)))
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * Fallback embedding generator using simple text hashing
 * Used when API calls fail
 */
export function generateFallbackEmbedding(text: string): number[] {
  const hash = text.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)

  // Generate a 384-dimensional vector (compatible with text-embedding-3-small)
  const vector = new Array(384).fill(0)

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    vector[i % 384] = (vector[i % 384] + char / 256) % 1
  }

  // Add some pseudo-randomness based on text content
  for (let i = 0; i < vector.length; i++) {
    vector[i] = Math.sin(hash + i) * 0.5 + 0.5
  }

  return vector
}

/**
 * Clear embedding cache (for testing or memory management)
 */
export function clearEmbeddingCache() {
  embeddingCache.clear()
}

/**
 * Get cache size
 */
export function getEmbeddingCacheSize(): number {
  return embeddingCache.size
}
