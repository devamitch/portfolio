/**
 * useRAGChat — AI SDK v6 compatible
 *
 * Key fixes vs original:
 * 1. Uses correct AI SDK v6 useChat API
 * 2. Watches messages for scrollToSection tool results → fires custom DOM event
 * 3. Safe error string (never raw Error object in JSX)
 */

"use client";

import { useChat } from "@ai-sdk/react";
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

// Custom event name the widget (and any page section) can listen to
export const SCROLL_EVENT = "amit:scrollToSection";

/** Dispatch a scroll event — widget + page both listen */
export function dispatchScroll(target: ScrollTarget) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { target } }));
}

export function useRAGChat() {
  const [input, setInput] = useState("");
  const processedToolCallIds = useRef(new Set<string>());

  const {
    messages,
    status,
    error: rawError,
    sendMessage,
    stop,
    setMessages,
  } = useChat({
    api: "/api/rag/chat",
    onError: (err) => {
      console.error("[RAGChat] error:", err);
    },
  });

  // ── Watch for scrollToSection tool results in the message stream ──────────
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "assistant") continue;

      const parts: any[] = (msg as any).parts ?? [];

      for (const part of parts) {
        // AI SDK v6: tool-invocation parts carry the result once executed
        if (part.type !== "tool-invocation") continue;
        if (part.toolName !== "scrollToSection") continue;
        if (part.state !== "result") continue;

        const id = part.toolCallId as string;
        if (processedToolCallIds.current.has(id)) continue;
        processedToolCallIds.current.add(id);

        const target = part.result?.scrollTo as ScrollTarget | undefined;
        if (target) {
          // Small delay so the spoken response starts before scroll happens
          setTimeout(() => dispatchScroll(target), 300);
        }
      }
    }
  }, [messages]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const error: string | null = rawError
    ? rawError instanceof Error
      ? rawError.message
      : String(rawError)
    : null;

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement> | { preventDefault?: () => void },
    ) => {
      if (typeof (e as any).preventDefault === "function") {
        (e as any).preventDefault();
      }
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
  };
}
