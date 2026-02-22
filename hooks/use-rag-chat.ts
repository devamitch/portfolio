"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  text: string; // plain text only — stripped of markdown for storage
  ts: number;
}

export interface ParsedResponse {
  voiceLine: string; // extracted VOICE: line — what gets spoken
  displayText: string; // everything after VOICE: line — shown in chat
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SCROLL_EVENT = "amit:scrollToSection";
const STORAGE_KEY = "amit:chat:v3"; // bump version to clear any broken old data
const MAX_STORED = 25;

// ─── Text extraction from AI SDK v6 message object ───────────────────────────
// Handles both parts[] format (AI SDK v6) and plain content string
export function extractRawText(msg: any): string {
  if (!msg) return "";

  // Try parts array first (AI SDK v6 format)
  const parts: any[] = msg?.parts ?? [];
  const fromParts = parts
    .filter((p: any) => p?.type === "text")
    .map((p: any) => String(p?.text ?? ""))
    .join(" ")
    .trim();
  if (fromParts) return fromParts;

  // Fallback: plain content field
  const c = msg?.content;
  if (typeof c === "string") return c.trim();
  if (Array.isArray(c)) {
    return c
      .filter((x: any) => x?.type === "text")
      .map((x: any) => String(x?.text ?? ""))
      .join(" ")
      .trim();
  }
  return "";
}

// ─── VOICE: line parser ───────────────────────────────────────────────────────
// The AI prefixes every response with:
//   VOICE: Amit has shipped eighteen production apps over eight years.
//
// We extract that line for speaking, and strip it from the displayed chat text
// so users don't see an ugly "VOICE:" prefix in the message bubble.
export function parseResponse(rawText: string): ParsedResponse {
  if (!rawText?.trim()) return { voiceLine: "", displayText: "" };

  const lines = rawText.split("\n");
  const voiceIdx = lines.findIndex((l) => /^VOICE:/i.test(l.trim()));

  if (voiceIdx === -1) {
    // AI didn't follow the format — extract first clean sentence as fallback
    const clean = rawText
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1")
      .replace(/`[^`]+`/g, "")
      .replace(/\n+/g, " ")
      .trim();
    const firstSentence = clean.split(/(?<=[.!?])\s+/)[0]?.trim() ?? "";
    return {
      voiceLine: firstSentence.slice(0, 150),
      displayText: rawText.trim(),
    };
  }

  // Extract the VOICE line content
  const voiceLine = lines[voiceIdx]!.replace(/^VOICE:\s*/i, "").trim();

  // Remove the VOICE line (and any immediately adjacent blank line) from display
  const displayLines = lines.filter((_, i) => i !== voiceIdx);
  const displayText = displayLines.join("\n").replace(/^\n+/, "").trim();

  return { voiceLine, displayText };
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function saveSnapshot(messages: any[]) {
  if (typeof window === "undefined") return;
  try {
    const snapshot: StoredMessage[] = messages
      .map((m) => ({
        id: String(m.id ?? Math.random()),
        role: (m.role === "user" ? "user" : "assistant") as
          | "user"
          | "assistant",
        text: extractRawText(m),
        ts: Date.now(),
      }))
      .filter((m) => m.text.trim().length > 0)
      .slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

function loadSnapshot(): StoredMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredMessage[]) : [];
  } catch {
    return [];
  }
}

export function clearStoredMessages() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// ─── Scroll dispatch ──────────────────────────────────────────────────────────

export function dispatchScroll(target: ScrollTarget) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { target } }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRAGChat() {
  const [input, setInput] = useState("");
  const processedToolCallIds = useRef(new Set<string>());

  // Load snapshot ONCE on mount — shown while live chat is empty
  const [restoredMessages] = useState<StoredMessage[]>(() => loadSnapshot());

  const {
    messages,
    status,
    error: rawError,
    sendMessage,
    stop,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/rag/chat" }),

    // DO NOT pass initialMessages from storage — AI SDK v6 can't round-trip
    // complex parts[] objects through JSON. We render restoredMessages separately.

    onError: (err) => console.error("[RAGChat] error:", err),

    onFinish: ({ message }) => {
      // Handle scroll tool results from onFinish (tool-scrollToSection parts)
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

  // ── Save snapshot whenever live messages change ────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      saveSnapshot(messages);
    }
  }, [messages]);

  // ── Watch for scroll tool-invocation results (streaming path) ─────────────
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const isLoading = status === "submitted" || status === "streaming";

  const error: string | null = rawError
    ? rawError instanceof Error
      ? rawError.message
      : String(rawError)
    : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInput(e.target.value),
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
        console.error("[RAGChat] send error:", err);
      }
    },
    [input, isLoading, sendMessage],
  );

  const submitText = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || isLoading) return;
      setInput("");
      try {
        await sendMessage({ text: t });
      } catch (err) {
        console.error("[RAGChat] submitText error:", err);
      }
    },
    [isLoading, sendMessage],
  );

  const clearHistory = useCallback(() => {
    clearStoredMessages();
    setMessages([]);
  }, [setMessages]);

  return {
    messages, // live AI SDK v6 messages (active session)
    restoredMessages, // simple {id, role, text, ts} shown on first load
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
