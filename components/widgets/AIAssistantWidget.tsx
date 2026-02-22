"use client";

/**
 * ~/components/AIAssistantWidget.tsx
 *
 * Voice: speaks the VOICE: line the AI wrote — not markdown, not heuristic parsing.
 * Storage: shows restoredMessages (simple snapshots) until live chat starts.
 */

import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  SCROLL_EVENT,
  extractRawText,
  parseResponse,
  useRAGChat,
  type ScrollTarget,
} from "~/hooks/use-rag-chat";
import { useVoice } from "~/hooks/use-voice";
import { ChatBubble } from "./ChatBubble";
import { MicButton } from "./MicButton";

const C = {
  bg: "#050505",
  bg2: "#0A0A0A",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.025)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldG: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
} as const;

const SUGGESTED = [
  "What projects has Amit built?",
  "Tell me about his React Native expertise",
  "What are Amit's consulting rates?",
];

// Short, natural loading phrases — not sentences, just human sounds
const LOADING_PHRASES = [
  "On it.",
  "One moment.",
  "Let me check.",
  "Looking that up.",
  "Got it, searching now.",
];

const FALLBACK_TRIGGERS = [
  "don't have",
  "not sure",
  "cannot find",
  "no information",
  "don't know",
  "unclear",
  "unfortunately",
  "i'm sorry",
  "i'm not able",
];
const FALLBACK_SPEAK =
  "I don't have the full details on that one. You can email Amit directly at amit98ch at gmail dot com — he replies within twenty four hours.";

function isFallback(text: string) {
  const l = text.toLowerCase();
  return FALLBACK_TRIGGERS.some((t) => l.includes(t));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function scrollToSection(target: ScrollTarget) {
  if (typeof window === "undefined") return;
  const el =
    document.getElementById(target) ??
    document.querySelector(`[data-section="${target}"]`) ??
    document.querySelector(`section[id="${target}"]`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.hash = target;
}

interface Props {
  position?: "bottom-right" | "bottom-left";
  defaultOpen?: boolean;
  autoSpeak?: boolean;
}

export function AIAssistantWidget({
  position = "bottom-right",
  defaultOpen = false,
  autoSpeak = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(autoSpeak);
  const [confirmClear, setConfirmClear] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const prevStatus = useRef<string>("ready");
  const spokenMsgIds = useRef(new Set<string>());
  const loadingSpoken = useRef(false);

  const {
    messages,
    restoredMessages,
    input,
    handleInputChange,
    handleSubmit,
    submitText,
    isLoading,
    status,
    error,
    clearHistory,
  } = useRAGChat();

  const {
    voiceState,
    transcript,
    error: voiceError,
    isSupported,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice({ onTranscript: (t) => submitText(t) });

  // Scroll event listener
  useEffect(() => {
    const handler = (e: Event) => {
      const { target } = (e as CustomEvent<{ target: ScrollTarget }>).detail;
      scrollToSection(target);
    };
    window.addEventListener(SCROLL_EVENT, handler);
    return () => window.removeEventListener(SCROLL_EVENT, handler);
  }, []);

  // ── Voice logic ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoSpeakEnabled || !isSupported) return;

    const prev = prevStatus.current;
    const now = status;

    // On submit → speak loading phrase
    if (
      prev === "ready" &&
      (now === "submitted" || now === "streaming") &&
      !loadingSpoken.current
    ) {
      loadingSpoken.current = true;
      stopSpeaking();
      setTimeout(() => speak(pickRandom(LOADING_PHRASES)), 60);
    }

    // On complete → speak the VOICE: line the AI wrote
    if ((prev === "streaming" || prev === "submitted") && now === "ready") {
      loadingSpoken.current = false;

      const lastAssistant = [...messages]
        .reverse()
        .find((m) => m.role === "assistant");

      if (lastAssistant && !spokenMsgIds.current.has(lastAssistant.id)) {
        spokenMsgIds.current.add(lastAssistant.id);
        const rawText = extractRawText(lastAssistant);

        if (rawText) {
          setTimeout(() => {
            stopSpeaking();
            if (isFallback(rawText)) {
              speak(FALLBACK_SPEAK);
              return;
            }
            // ← THIS IS THE FIX: we speak the VOICE: line the AI specifically wrote
            // It's plain English, pre-formatted for TTS, no markdown stripping needed
            const { voiceLine } = parseResponse(rawText);
            if (voiceLine) {
              speak(voiceLine);
            }
          }, 400);
        }
      }
    }

    prevStatus.current = now;
  }, [status, messages, autoSpeakEnabled, isSupported, speak, stopSpeaking]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Clear confirm reset
  useEffect(() => {
    if (confirmClear) {
      const t = setTimeout(() => setConfirmClear(false), 3000);
      return () => clearTimeout(t);
    }
  }, [confirmClear]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      handleSubmit({ preventDefault: () => {} } as any);
    }
  };

  const posStyle: React.CSSProperties =
    position === "bottom-right"
      ? { bottom: "20px", right: "20px" }
      : { bottom: "20px", left: "20px" };

  const statusLine =
    status === "submitted"
      ? "🔍 Searching..."
      : status === "streaming"
        ? "💬 Responding..."
        : voiceState === "speaking"
          ? "🔊 Speaking..."
          : voiceState === "listening"
            ? "🎤 Listening..."
            : null;

  const hasLive = messages.length > 0;
  const hasHistory = restoredMessages.length > 0;

  // ── Closed FAB ─────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
        style={{
          position: "fixed",
          zIndex: 9000,
          ...posStyle,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 20px",
          borderRadius: "999px",
          background: C.goldG,
          border: "none",
          cursor: "pointer",
          boxShadow: `0 4px 24px ${C.goldD}, 0 0 0 1px rgba(201,168,76,0.15)`,
          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          color: C.bg,
        }}
        onMouseEnter={(e) =>
          Object.assign(e.currentTarget.style, { transform: "scale(1.06)" })
        }
        onMouseLeave={(e) =>
          Object.assign(e.currentTarget.style, { transform: "scale(1)" })
        }
      >
        <MessageCircle size={18} strokeWidth={2.5} />
        <span
          style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.02em" }}
        >
          Ask AI
        </span>
        {hasHistory && (
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#34D399",
              flexShrink: 0,
            }}
          />
        )}
      </button>
    );
  }

  // ── Open panel ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typingBounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes sp { 0%,100%{opacity:.65} 50%{opacity:1} }
        .ai-scroll::-webkit-scrollbar{width:3px}
        .ai-scroll::-webkit-scrollbar-thumb{background:rgba(201,168,76,.2);border-radius:999px}
        .ai-input{background:#050505!important}
        .ai-input::placeholder{color:rgba(255,255,255,.24)}
        .ai-input:focus{outline:none;border-color:rgba(201,168,76,.5)!important;box-shadow:0 0 0 3px rgba(201,168,76,.08)}
        .ai-sug:hover{background:rgba(201,168,76,.08)!important;border-color:rgba(201,168,76,.3)!important;color:#C9A84C!important}
        .ai-ib:hover{background:rgba(255,255,255,.1)!important}
        .ai-send:hover:not(:disabled){filter:brightness(1.12);box-shadow:0 0 20px rgba(201,168,76,.4)}
        .ai-send:disabled{opacity:.35;cursor:not-allowed}
        .ai-clr:hover{background:rgba(255,68,68,.12)!important;border-color:rgba(255,68,68,.35)!important;color:#FF6666!important}
        .ai-restored{font-size:9px;color:rgba(255,255,255,.15);text-align:center;padding:6px 0 2px;letter-spacing:.1em}
      `}</style>

      <div
        role="dialog"
        aria-label="AI Assistant — Amit Chakraborty"
        style={{
          position: "fixed",
          zIndex: 9000,
          ...posStyle,
          width: "370px",
          height: "min(590px, calc(100vh - 32px))",
          display: "flex",
          flexDirection: "column",
          background: C.bg2,
          border: `1px solid ${C.border}`,
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow:
            "0 24px 80px rgba(0,0,0,.85), 0 0 0 1px rgba(201,168,76,.06), inset 0 1px 0 rgba(255,255,255,.04)",
          animation: "fadeUp .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            padding: "14px 16px",
            background:
              "linear-gradient(180deg,rgba(201,168,76,.07) 0%,transparent 100%)",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: C.goldG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 14px ${C.goldD}`,
              }}
            >
              <Bot size={16} color={C.bg} strokeWidth={2.5} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.01em",
                }}
              >
                Amit's AI
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: statusLine ? C.gold : "rgba(201,168,76,.6)",
                  animation: statusLine
                    ? "sp 1.2s ease-in-out infinite"
                    : "none",
                  transition: "color .3s",
                  textTransform: "uppercase",
                }}
              >
                {statusLine ?? "Voice · Portfolio · Live"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 2 }}>
            <button
              type="button"
              className="ai-ib"
              onClick={() => {
                setAutoSpeakEnabled((v) => !v);
                if (voiceState === "speaking") stopSpeaking();
              }}
              title={autoSpeakEnabled ? "Auto-speak ON" : "Enable auto-speak"}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                background: autoSpeakEnabled ? C.goldF : "transparent",
                transition: "background .15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {autoSpeakEnabled ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="ai-ib"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.faint,
                transition: "background .15s",
              }}
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                stopSpeaking();
              }}
              className="ai-ib"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.faint,
                transition: "background .15s",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div
            style={{
              flexShrink: 0,
              padding: "12px 16px",
              background: C.bg3,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                background: C.goldF,
                borderRadius: 8,
                border: `1px solid ${C.goldD}`,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: C.gold,
                  margin: "0 0 4px",
                  fontWeight: 600,
                }}
              >
                🎙 Voice — Chrome recommended for best quality
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: C.faint,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                After each response the AI speaks a one-sentence plain-English
                summary it wrote itself. Your conversation is saved
                automatically across sessions.
              </p>
            </div>
            <button
              className="ai-clr"
              onClick={() => {
                if (confirmClear) {
                  clearHistory();
                  stopSpeaking();
                  setConfirmClear(false);
                } else setConfirmClear(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 10px",
                borderRadius: 8,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${confirmClear ? "rgba(255,68,68,.35)" : C.border}`,
                color: confirmClear ? "#FF6666" : C.faint,
                fontSize: 11,
                cursor: "pointer",
                transition: "all .15s",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <RotateCcw size={12} />
              {confirmClear
                ? "Click again to confirm"
                : "Clear conversation history"}
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          className="ai-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px" }}
        >
          {/* Empty state */}
          {!hasLive && !hasHistory && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 18,
                padding: 20,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: C.goldF,
                  border: `1px solid ${C.goldD}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={24} color={C.gold} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.text,
                    margin: "0 0 6px",
                  }}
                >
                  Ask me anything about Amit
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: C.faint,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {autoSpeakEnabled
                    ? "🔊 I'll speak a short plain-English summary after each answer."
                    : "🔇 Tap 🔊 to hear responses read aloud."}
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    className="ai-sug"
                    onClick={() => submitText(q)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 13px",
                      borderRadius: 10,
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      color: C.dim,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Restored history (shown before live messages exist) ── */}
          {!hasLive && hasHistory && (
            <>
              <div className="ai-restored">— Previous conversation —</div>
              {restoredMessages.map((msg) => {
                // Strip the VOICE: line from stored assistant messages
                const display =
                  msg.role === "assistant"
                    ? parseResponse(msg.text).displayText
                    : msg.text;
                if (!display.trim()) return null;
                return (
                  <ChatBubble
                    key={msg.id}
                    role={msg.role}
                    content={display}
                    timestamp={new Date(msg.ts)}
                  />
                );
              })}
              <div style={{ height: 8 }} />
            </>
          )}

          {/* ── Live messages (active session) ── */}
          {hasLive &&
            messages.map((msg) => {
              const raw = extractRawText(msg);
              if (!raw.trim()) return null;
              // Strip VOICE: line so it never shows in the chat bubble
              const display =
                msg.role === "assistant" ? parseResponse(raw).displayText : raw;
              if (!display.trim()) return null;
              return (
                <ChatBubble
                  key={msg.id}
                  role={msg.role as "user" | "assistant"}
                  content={display}
                  timestamp={new Date()}
                />
              );
            })}

          {/* Typing indicator */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 14,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: C.goldG,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Bot size={13} color="#050505" strokeWidth={2.5} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    background: C.bg3,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  {[0, 160, 320].map((d, i) => (
                    <span
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.gold,
                        display: "inline-block",
                        animation: `typingBounce 1.2s ${d}ms infinite`,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: C.gold,
                    fontStyle: "italic",
                    paddingLeft: 2,
                    animation: "sp 1.5s ease-in-out infinite",
                  }}
                >
                  {status === "submitted"
                    ? "🔍 Searching Amit's portfolio..."
                    : "💬 Writing response..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              flexShrink: 0,
              padding: "7px 16px",
              background: "rgba(255,68,68,.06)",
              borderTop: "1px solid rgba(255,68,68,.15)",
              fontSize: 11,
              color: "#FF6666",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Input */}
        <div
          style={{
            flexShrink: 0,
            padding: "12px 14px 14px",
            borderTop: `1px solid ${C.border}`,
            background: C.bg3,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              className="ai-input"
              placeholder="Ask about Amit's portfolio…"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 999,
                background: C.bg,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: 13,
                fontFamily: "inherit",
                transition: "border-color .2s, box-shadow .2s",
              }}
            />
            <button
              type="button"
              className="ai-send"
              onClick={(e) => handleSubmit(e as any)}
              disabled={isLoading || !input?.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: C.goldG,
                border: "none",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {isLoading ? (
                <Loader2
                  size={15}
                  color="#050505"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Send size={14} color="#050505" strokeWidth={2.5} />
              )}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MicButton
              voiceState={voiceState}
              isSupported={isSupported}
              transcript={transcript}
              error={voiceError}
              onMicClick={voiceState === "listening" ? stopListening : listen}
              onStopSpeaking={stopSpeaking}
            />
            {(() => {
              // ▶ Read button — reads the full response (not just VOICE line)
              const lastMsg = messages
                .filter((m) => m.role === "assistant")
                .at(-1);
              const lastRaw = lastMsg ? extractRawText(lastMsg) : "";
              const lastDisplay = lastRaw
                ? parseResponse(lastRaw).displayText
                : "";
              if (!lastDisplay) return null;
              return (
                <button
                  onClick={() =>
                    voiceState === "speaking"
                      ? stopSpeaking()
                      : speak(lastDisplay)
                  }
                  title={
                    voiceState === "speaking"
                      ? "Stop"
                      : "Read full response aloud"
                  }
                  style={{
                    flexShrink: 0,
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: `1px solid ${voiceState === "speaking" ? "rgba(52,211,153,.4)" : "rgba(201,168,76,.25)"}`,
                    background:
                      voiceState === "speaking"
                        ? "rgba(52,211,153,.08)"
                        : "rgba(201,168,76,.05)",
                    color: voiceState === "speaking" ? "#34D399" : "#C9A84C",
                    fontSize: 11,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all .15s",
                  }}
                >
                  {voiceState === "speaking" ? "■ Stop" : "▶ Read"}
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
