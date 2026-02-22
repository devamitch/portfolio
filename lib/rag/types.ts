/**
 * RAG System Type Definitions
 */

export interface Document {
  id: string
  content: string
  metadata: Record<string, any>
  source: 'portfolio' | 'upload' | 'scrape' | 'manual'
  createdAt: Date
}

export interface QueryResult {
  id: string
  content: string
  metadata: Record<string, any>
  similarity: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface RAGResponse {
  answer: string
  sources: QueryResult[]
  confidence: number
}

export interface KnowledgeBaseEntry {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
}

export interface UploadedDocument {
  id: string
  filename: string
  size: number
  uploadedAt: Date
  processed: boolean
  chunks: Document[]
}
