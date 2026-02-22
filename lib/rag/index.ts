/**
 * RAG System Exports
 * Main entry point for RAG functionality
 */

export * from './types'
export * from './rag-engine'
export { initializeChroma, getOrCreateCollection, queryCollection } from './chroma-client'
export { generateEmbedding, generateEmbeddings, cosineSimilarity } from './embeddings'
export {
  retrieveRelevantDocuments,
  buildRAGContext,
  calculateAverageConfidence,
  filterByConfidence,
  hybridSearch,
} from './retriever'
export {
  generateRAGResponse,
  generateRAGResponseSync,
  buildConversationalPrompt,
  generateConversationalResponse,
  extractKeyInformation,
} from './generator'
export {
  extractPortfolioDocuments,
  createDocumentsFromUpload,
  createDocumentsFromScrape,
  createDocumentsFromKBEntries,
  splitIntoChunks,
  combineDocuments,
  initializeDefaultKnowledgeBase,
  serializeDocuments,
  deserializeDocuments,
} from './knowledge-store'
