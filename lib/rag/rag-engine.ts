/**
 * RAG Engine
 * Main orchestration layer combining retriever, generator, and knowledge base
 */

import {
  retrieveRelevantDocuments,
  buildRAGContext,
  calculateAverageConfidence,
} from './retriever'
import {
  generateRAGResponse,
  generateRAGResponseSync,
  generateConversationalResponse,
} from './generator'
import { addDocumentsToCollection, initializeChroma } from './chroma-client'
import type { Document, RAGResponse, QueryResult } from './types'

/**
 * Main RAG class for orchestrating retrieval and generation
 */
export class RAGEngine {
  private collectionName: string
  private model: string
  private chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> =
    []

  constructor(
    collectionName: string = 'portfolio',
    model: string = 'openai/gpt-4-turbo'
  ) {
    this.collectionName = collectionName
    this.model = model
  }

  /**
   * Initialize the RAG engine (ensure Chroma is set up)
   */
  async initialize() {
    await initializeChroma()
  }

  /**
   * Add documents to the knowledge base
   */
  async addDocuments(documents: Document[]) {
    try {
      await addDocumentsToCollection(this.collectionName, documents)
      console.log(`Added ${documents.length} documents to knowledge base`)
    } catch (error) {
      console.error('Error adding documents:', error)
      throw error
    }
  }

  /**
   * Process a query and generate RAG response
   */
  async query(userQuery: string): Promise<RAGResponse> {
    try {
      // Build RAG context
      const { context, sources } = await buildRAGContext(
        userQuery,
        this.collectionName,
        5
      )

      // Generate response using streaming
      const response = await generateRAGResponseSync(
        userQuery,
        context,
        sources,
        this.model
      )

      // Update chat history
      this.chatHistory.push({ role: 'user', content: userQuery })
      this.chatHistory.push({ role: 'assistant', content: response })

      // Keep history to reasonable size
      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(-20)
      }

      return {
        answer: response,
        sources: sources,
        confidence: calculateAverageConfidence(sources),
      }
    } catch (error) {
      console.error('Error processing query:', error)
      throw new Error('Failed to process query')
    }
  }

  /**
   * Stream RAG response (for real-time updates)
   */
  async queryStream(userQuery: string) {
    try {
      const { context, sources } = await buildRAGContext(
        userQuery,
        this.collectionName,
        5
      )

      // Generate streaming response
      const result = await generateRAGResponse(
        userQuery,
        context,
        sources,
        this.model
      )

      // Update chat history with user message only
      // (Assistant message will be added after streaming completes)
      this.chatHistory.push({ role: 'user', content: userQuery })

      return {
        stream: result.toAIStream(),
        sources,
      }
    } catch (error) {
      console.error('Error in query stream:', error)
      throw error
    }
  }

  /**
   * Continue conversation with context
   */
  async continueConversation(userMessage: string) {
    try {
      const { context, sources } = await buildRAGContext(
        userMessage,
        this.collectionName,
        5
      )

      const response = await generateConversationalResponse(
        userMessage,
        this.chatHistory,
        context,
        this.model
      )

      // Update history
      this.chatHistory.push({ role: 'user', content: userMessage })

      return {
        stream: response.toAIStream(),
        sources,
      }
    } catch (error) {
      console.error('Error in conversation:', error)
      throw error
    }
  }

  /**
   * Search for relevant documents without generation
   */
  async search(query: string, topK: number = 10): Promise<QueryResult[]> {
    return retrieveRelevantDocuments(query, this.collectionName, topK)
  }

  /**
   * Get current chat history
   */
  getChatHistory() {
    return [...this.chatHistory]
  }

  /**
   * Clear chat history
   */
  clearChatHistory() {
    this.chatHistory = []
  }

  /**
   * Set model for responses
   */
  setModel(model: string) {
    this.model = model
  }
}

/**
 * Create a RAG engine instance
 */
export function createRAGEngine(
  collectionName?: string,
  model?: string
): RAGEngine {
  return new RAGEngine(collectionName, model)
}
