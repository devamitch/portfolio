

import { embed } from 'ai'

const embeddingCache = new Map<string, number[]>()

export async function generateEmbedding(text: string): Promise<number[]> {
  const cacheKey = `embed:${text.slice(0, 100)}`
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!
  }

  try {
    const result = await embed({
      model: 'openai/text-embedding-3-small',
      value: text,
    })

    const embedding = result.embedding

    embeddingCache.set(cacheKey, embedding)

    return embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    return generateFallbackEmbedding(text)
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map((text) => generateEmbedding(text)))
}

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

export function generateFallbackEmbedding(text: string): number[] {
  const hash = text.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)

  const vector = new Array(384).fill(0)

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    vector[i % 384] = (vector[i % 384] + char / 256) % 1
  }

  for (let i = 0; i < vector.length; i++) {
    vector[i] = Math.sin(hash + i) * 0.5 + 0.5
  }

  return vector
}

export function clearEmbeddingCache() {
  embeddingCache.clear()
}

export function getEmbeddingCacheSize(): number {
  return embeddingCache.size
}