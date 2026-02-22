

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

  async initialize() {
    await initializeChroma()
  }

  async addDocuments(documents: Document[]) {
    try {
      await addDocumentsToCollection(this.collectionName, documents)
      console.log(`Added ${documents.length} documents to knowledge base`)
    } catch (error) {
      console.error('Error adding documents:', error)
      throw error
    }
  }

  async query(userQuery: string): Promise<RAGResponse> {
    try {
      const { context, sources } = await buildRAGContext(
        userQuery,
        this.collectionName,
        5
      )

      const response = await generateRAGResponseSync(
        userQuery,
        context,
        sources,
        this.model
      )

      this.chatHistory.push({ role: 'user', content: userQuery })
      this.chatHistory.push({ role: 'assistant', content: response })

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

  async queryStream(userQuery: string) {
    try {
      const { context, sources } = await buildRAGContext(
        userQuery,
        this.collectionName,
        5
      )

      const result = await generateRAGResponse(
        userQuery,
        context,
        sources,
        this.model
      )

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

  async search(query: string, topK: number = 10): Promise<QueryResult[]> {
    return retrieveRelevantDocuments(query, this.collectionName, topK)
  }

  getChatHistory() {
    return [...this.chatHistory]
  }

  clearChatHistory() {
    this.chatHistory = []
  }

  setModel(model: string) {
    this.model = model
  }
}

export function createRAGEngine(
  collectionName?: string,
  model?: string
): RAGEngine {
  return new RAGEngine(collectionName, model)
}