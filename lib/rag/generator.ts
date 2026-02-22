

import { generateText, streamText } from 'ai'
import type { QueryResult } from './types'

const DEFAULT_MODEL = 'openai/gpt-4-turbo'

function buildSystemPrompt(context: string): string {
  return `You are a helpful AI assistant that answers questions based on provided context.

Context information:
${context}

Instructions:
- Answer questions based ONLY on the provided context
- If the answer is not in the context, say so clearly
- Be concise and accurate
- Cite the relevant source numbers when applicable
- If you're uncertain, express that uncertainty`
}

export async function generateRAGResponse(
  query: string,
  context: string,
  sources: QueryResult[],
  model: string = DEFAULT_MODEL
) {
  const systemPrompt = buildSystemPrompt(context)

  const result = streamText({
    model,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
    temperature: 0.7,
    maxTokens: 1024,
  })

  return result
}

export async function generateRAGResponseSync(
  query: string,
  context: string,
  sources: QueryResult[],
  model: string = DEFAULT_MODEL
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context)

  try {
    const result = await generateText({
      model,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
      maxTokens: 1024,
    })

    return result.text
  } catch (error) {
    console.error('Error generating response:', error)
    throw new Error('Failed to generate response from AI model')
  }
}

export function buildConversationalPrompt(
  currentQuery: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: string
): string {
  const messages = chatHistory.map(
    (msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  )

  return `${messages.join('\n')}\n\nContext for answering:\n${context}\n\nUser: ${currentQuery}`
}

export async function generateConversationalResponse(
  currentQuery: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  context: string,
  model: string = DEFAULT_MODEL
) {
  const systemPrompt = buildSystemPrompt(context)

  const messages = [
    ...chatHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: currentQuery,
    },
  ]

  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    temperature: 0.7,
    maxTokens: 1024,
  })

  return result
}

export async function extractKeyInformation(
  text: string,
  model: string = DEFAULT_MODEL
): Promise<string[]> {
  try {
    const result = await generateText({
      model,
      system:
        'Extract the key points and information from the provided text. Return as a numbered list.',
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      maxTokens: 512,
    })

    return result.text
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
  } catch (error) {
    console.error('Error extracting key information:', error)
    return []
  }
}