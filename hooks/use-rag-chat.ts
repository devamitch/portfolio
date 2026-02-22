"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePortfolioState } from "~/store/portfolio-state";

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
  text: string;
  ts: number;
}

export interface ParsedResponse {
  voiceLine: string;
  displayText: string;
}

export const SCROLL_EVENT = "amit:scrollToSection";
const STORAGE_KEY = "amit:chat:v3";
const MAX_STORED = 25;

export function extractRawText(msg: any): string {
  if (!msg) return "";

  const parts: any[] = msg?.parts ?? [];
  const fromParts = parts
    .filter((p: any) => p?.type === "text")
    .map((p: any) => String(p?.text ?? ""))
    .join(" ")
    .trim();
  if (fromParts) return fromParts;

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

export function parseResponse(rawText: string): ParsedResponse {
  if (!rawText?.trim()) return { voiceLine: "", displayText: "" };

  const lines = rawText.split("\n");
  const voiceIdx = lines.findIndex((l) => /^VOICE:/i.test(l.trim()));

  if (voiceIdx === -1) {
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

  const voiceLine = lines[voiceIdx]!.replace(/^VOICE:\s*/i, "").trim();

  const displayLines = lines.filter((_, i) => i !== voiceIdx);
  const displayText = displayLines.join("\n").replace(/^\n+/, "").trim();

  return { voiceLine, displayText };
}

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
  } catch {}
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
  } catch {}
}

export function dispatchScroll(target: ScrollTarget) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { target } }));
}

export function useRAGChat() {
  const [input, setInput] = useState("");
  const processedToolCallIds = useRef(new Set<string>());

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

    onError: (err) => console.error("[RAGChat] error:", err),

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

  useEffect(() => {
    if (messages.length > 0) {
      saveSnapshot(messages);
    }
  }, [messages]);

  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "assistant") continue;
      const parts: any[] = (msg as any).parts ?? [];
      for (const part of parts) {
        if (part.type !== "tool-invocation") continue;

        const id = part.toolCallId as string;
        if (processedToolCallIds.current.has(id)) continue;

        if (part.state === "result") {
          processedToolCallIds.current.add(id);

          if (part.toolName === "scrollToSection") {
            const target = (part.result?.sectionId ?? part.result?.scrollTo) as
              | ScrollTarget
              | undefined;
            if (target) setTimeout(() => dispatchScroll(target), 300);
          }

          if (part.toolName === "identifyUser") {
            const { identified, name, interest } = part.result;
            if (identified && name) {
              const { setUserName, setIsProfileComplete, visitorId } =
                usePortfolioState.getState();
              setUserName(name);
              setIsProfileComplete(true);

              fetch("/api/analytics/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  visitorId,
                  name,
                  interest,
                }),
              }).catch((err) => console.error("[identify] Save failed:", err));
            }
          }
        }
      }
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const error: string | null = rawError
    ? rawError instanceof Error
      ? rawError.message
      : String(rawError)
    : null;

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
        const userName = usePortfolioState.getState().userName;
        await sendMessage({ text }, { body: { userName } });
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
        const userName = usePortfolioState.getState().userName;
        await sendMessage({ text: t }, { body: { userName } });
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
    messages,
    restoredMessages,
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
