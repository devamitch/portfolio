/**
 * Knowledge Store Manager
 * Handles loading and managing different data sources for the RAG system
 */

import type { Document, KnowledgeBaseEntry } from './types'

/**
 * Extract portfolio information into documents
 */
export function extractPortfolioDocuments(): Document[] {
  // This data would typically come from the PrimaryHome component
  // For now, we create sample portfolio data
  const documents: Document[] = [
    {
      id: 'portfolio-skills',
      content: `I am a full-stack developer with expertise in React, Next.js, TypeScript, and Node.js. 
      I specialize in building scalable web applications with modern tooling. 
      My skills include frontend development, backend API design, database optimization, and DevOps.
      I have experience with Tailwind CSS, GraphQL, PostgreSQL, MongoDB, and cloud deployment on Vercel and AWS.`,
      metadata: {
        type: 'skills',
        priority: 'high',
      },
      source: 'portfolio',
      createdAt: new Date(),
    },
    {
      id: 'portfolio-experience',
      content: `I have built numerous projects including e-commerce platforms, social networks, 
      real-time chat applications, and analytics dashboards. 
      I've worked on performance optimization, implementing caching strategies, 
      and designing scalable database schemas.
      My experience spans from startups to established tech companies.`,
      metadata: {
        type: 'experience',
        priority: 'high',
      },
      source: 'portfolio',
      createdAt: new Date(),
    },
    {
      id: 'portfolio-interests',
      content: `I am passionate about AI/ML integration, building developer tools, 
      and creating delightful user experiences.
      I enjoy contributing to open source, writing technical content, 
      and mentoring junior developers.
      My interests include cloud architecture, DevOps practices, and emerging web technologies.`,
      metadata: {
        type: 'interests',
        priority: 'medium',
      },
      source: 'portfolio',
      createdAt: new Date(),
    },
  ]

  return documents
}

/**
 * Extract documents from uploaded files
 * (This would be called after file processing)
 */
export function createDocumentsFromUpload(
  filename: string,
  content: string,
  uploadId: string
): Document[] {
  // Split content into chunks
  const chunks = splitIntoChunks(content, 500)

  return chunks.map((chunk, index) => ({
    id: `upload-${uploadId}-${index}`,
    content: chunk,
    metadata: {
      source_file: filename,
      chunk_index: index,
      upload_id: uploadId,
    },
    source: 'upload',
    createdAt: new Date(),
  }))
}

/**
 * Create documents from scraped web content
 */
export function createDocumentsFromScrape(
  url: string,
  content: string,
  scrapeId: string
): Document[] {
  const chunks = splitIntoChunks(content, 500)

  return chunks.map((chunk, index) => ({
    id: `scrape-${scrapeId}-${index}`,
    content: chunk,
    metadata: {
      source_url: url,
      chunk_index: index,
      scrape_id: scrapeId,
    },
    source: 'scrape',
    createdAt: new Date(),
  }))
}

/**
 * Create documents from manual knowledge base entries
 */
export function createDocumentsFromKBEntries(
  entries: KnowledgeBaseEntry[]
): Document[] {
  return entries.map((entry) => ({
    id: entry.id,
    content: `${entry.title}\n\n${entry.content}`,
    metadata: {
      title: entry.title,
      category: entry.category,
      tags: entry.tags,
    },
    source: 'manual',
    createdAt: new Date(),
  }))
}

/**
 * Split text into chunks for better retrieval
 */
export function splitIntoChunks(
  text: string,
  chunkSize: number = 500,
  overlap: number = 100
): string[] {
  const chunks: string[] = []
  let currentIndex = 0

  while (currentIndex < text.length) {
    const end = Math.min(currentIndex + chunkSize, text.length)
    const chunk = text.substring(currentIndex, end)

    chunks.push(chunk.trim())

    // Move to next chunk with overlap
    currentIndex = end - overlap
    if (currentIndex < 0) {
      break
    }
  }

  return chunks.filter((chunk) => chunk.length > 0)
}

/**
 * Process and combine multiple document sources
 */
export function combineDocuments(...docArrays: Document[][]): Document[] {
  return docArrays.flat().reduce((unique, doc) => {
    // Avoid duplicates by ID
    if (!unique.find((d) => d.id === doc.id)) {
      unique.push(doc)
    }
    return unique
  }, [] as Document[])
}

/**
 * Initialize default knowledge base with portfolio info
 */
export function initializeDefaultKnowledgeBase(): Document[] {
  const portfolioData = extractPortfolioDocuments()
  return portfolioData
}

/**
 * Format documents for storage/transmission
 */
export function serializeDocuments(documents: Document[]): string {
  return JSON.stringify(documents)
}

/**
 * Deserialize documents from storage
 */
export function deserializeDocuments(json: string): Document[] {
  try {
    const parsed = JSON.parse(json)
    return parsed.map((doc: any) => ({
      ...doc,
      createdAt: new Date(doc.createdAt),
    }))
  } catch (error) {
    console.error('Error deserializing documents:', error)
    return []
  }
}
