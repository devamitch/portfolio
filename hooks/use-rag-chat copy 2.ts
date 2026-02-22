"use client";

/**
 * useRAGChat — AI SDK v6 compatible + localStorage persistence
 *
 * Messages are saved to localStorage under key "amit:chat:messages"
 * so conversations survive page refreshes and widget open/close.
 */

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";

export type ScrollTarget =
  | "hero"
  | "about"
  | "work"
  | "experience"
  | "skills"
  | "story"
  | "github"
  | "testimonials"
  | "services"
  | "pitch"
  | "contact"
  | "faq";

export const SCROLL_EVENT = "amit:scrollToSection";
const STORAGE_KEY = "amit:chat:messages";
const MAX_STORED = 40; // keep last 40 messages

export function dispatchScroll(target: ScrollTarget) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { target } }));
}

// ─── Persist helpers ──────────────────────────────────────────────────────────
function loadMessages(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: any[]) {
  if (typeof window === "undefined") return;
  try {
    // Only keep last N messages to avoid blowing up storage
    const toSave = messages.slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function clearMessages() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// ─── Topic detection for contextual spoken summary ───────────────────────────
export type ResponseTopic =
  | "projects"
  | "experience"
  | "skills"
  | "rates"
  | "contact"
  | "blockchain"
  | "ai"
  | "mobile"
  | "team"
  | "story"
  | "general";

export function detectTopic(text: string): ResponseTopic {
  const t = text.toLowerCase();
  if (/rate|price|cost|fee|hour|retainer|\$|usd|pay/i.test(t)) return "rates";
  if (/email|contact|reach|connect|amit98|phone|linkedin/i.test(t))
    return "contact";
  if (
    /vulcan|lunacare|vitalquest|defi11|housezy|musicx|maskwa|nexus|project|app|ship/i.test(
      t,
    )
  )
    return "projects";
  if (
    /blockchain|solidity|web3|defi|nft|smart contract|ethereum|solana/i.test(t)
  )
    return "blockchain";
  if (
    /rag|ai|machine learning|llm|gpt|openai|hipaa|medical|computer vision/i.test(
      t,
    )
  )
    return "ai";
  if (/react native|mobile|ios|android|expo/i.test(t)) return "mobile";
  if (/team|lead|manage|hire|recruit|mentor|vp/i.test(t)) return "team";
  if (/synapsis|nonceblox|techpromind|experience|year|work/i.test(t))
    return "experience";
  if (/story|journey|started|2017|background/i.test(t)) return "story";
  if (/typescript|node|next|nest|graphql|postgres|docker|aws|skill/i.test(t))
    return "skills";
  return "general";
}

// Short spoken intros — natural, not robotic, one sentence max
export const TOPIC_INTROS: Record<ResponseTopic, string> = {
  projects: "Found it. Here's what Amit has actually shipped.",
  experience: "Eight years. Here's the breakdown.",
  skills: "Here's what he works with.",
  rates: "Good question. Here's what I found on pricing.",
  contact: "You can reach him directly. Here's how.",
  blockchain: "Yes, he does blockchain. And not just the basics.",
  ai: "This is actually one of his strongest areas. Here's the detail.",
  mobile: "React Native, eight years, fifty thousand users. Here's more.",
  team: "He's built and led a twenty-one person team. Here's what that looked like.",
  story: "Here's how it started.",
  general: "Here's what I found.",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useRAGChat() {
  const [input, setInput] = useState("");
  const processedToolCallIds = useRef(new Set<string>());

  // Load persisted messages once on mount
  const initialMessages = useRef(loadMessages());

  const {
    messages,
    status,
    error: rawError,
    sendMessage,
    stop,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/rag/chat",
    }),

    // Restore saved messages
    initialMessages: initialMessages.current,

    onError: (err) => {
      console.error("[RAGChat] error:", err);
    },

    onFinish: ({ message }) => {
      for (const part of message.parts) {
        if (
          part.type === "tool-scrollToSection" &&
          "state" in part &&
          part.state === "output-available" &&
          "output" in part &&
          part.output &&
          typeof part.output === "object" &&
          "sectionId" in part.output
        ) {
          const target = (part.output as { sectionId: string })
            .sectionId as ScrollTarget;
          setTimeout(() => dispatchScroll(target), 300);
        }
      }
    },
  });

  // ── Persist messages whenever they change ─────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // ── Watch messages for scroll tool invocations ────────────────────────────
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "assistant") continue;
      const parts: any[] = (msg as any).parts ?? [];
      for (const part of parts) {
        if (part.type !== "tool-invocation") continue;
        if (part.toolName !== "scrollToSection") continue;
        if (part.state !== "result") continue;
        const id = part.toolCallId as string;
        if (processedToolCallIds.current.has(id)) continue;
        processedToolCallIds.current.add(id);
        const target = (part.result?.sectionId ?? part.result?.scrollTo) as
          | ScrollTarget
          | undefined;
        if (target) setTimeout(() => dispatchScroll(target), 300);
      }
    }
  }, [messages]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const isLoading = status === "submitted" || status === "streaming";

  const error: string | null = rawError
    ? rawError instanceof Error
      ? rawError.message
      : String(rawError)
    : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      const text = input.trim();
      if (!text || isLoading) return;
      setInput("");
      try {
        await sendMessage({ text });
      } catch (err) {
        console.error("[RAGChat] sendMessage error:", err);
      }
    },
    [input, isLoading, sendMessage],
  );

  const submitText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setInput("");
      try {
        await sendMessage({ text: trimmed });
      } catch (err) {
        console.error("[RAGChat] submitText error:", err);
      }
    },
    [isLoading, sendMessage],
  );

  const clearHistory = useCallback(() => {
    clearMessages();
    setMessages([]);
  }, [setMessages]);

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    submitText,
    isLoading,
    status,
    error,
    stop,
    setMessages,
    clearHistory,
  };
}
