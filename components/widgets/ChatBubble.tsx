/**
 * ChatBubble — dark/gold theme
 * Assistant bubbles have a speaker button to read them aloud
 */
"use client";

import { Bot, User, Volume2, VolumeX } from "lucide-react";
import { useCallback, useState } from "react";
import { getVoiceManager } from "~/lib/voice-utils";

const C = {
  bg: "#050505",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  vfaint: "rgba(255,255,255,0.24)",
  ghost: "rgba(255,255,255,0.10)",
  border: "rgba(255,255,255,0.07)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldG: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
} as const;

function safeStr(v: unknown): string {
  if (!v && v !== 0) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (v instanceof Error) return v.message;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ id: string; similarity: number }>;
  timestamp?: Date;
}

export function ChatBubble({
  role,
  content,
  sources,
  timestamp,
}: ChatBubbleProps) {
  const isUser = role === "user";
  const text = safeStr(content);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    const vm = getVoiceManager();
    if (!vm.isSynthesisSupported()) return;

    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    vm.speak(
      text,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false),
    );
  }, [isSpeaking, text]);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "14px",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div
          style={{
            flexShrink: 0,
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: C.goldG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2px",
            boxShadow: `0 0 10px ${C.goldD}`,
          }}
        >
          <Bot size={13} color="#050505" strokeWidth={2.5} />
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? C.goldG : C.bg3,
          border: isUser ? "none" : `1px solid ${C.border}`,
          boxShadow: isUser
            ? `0 4px 18px ${C.goldD}`
            : "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        <p
          style={{
            fontSize: "13.5px",
            lineHeight: "1.65",
            color: isUser ? "#050505" : C.text,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
            fontWeight: isUser ? 500 : 400,
          }}
        >
          {text}
        </p>

        {/* Sources */}
        {!isUser && sources && sources.length > 0 && (
          <div
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <p style={{ fontSize: "10px", color: C.faint, margin: "0 0 5px" }}>
              {sources.length} source{sources.length > 1 ? "s" : ""} referenced
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {sources.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    background: C.goldF,
                    border: `1px solid ${C.goldD}`,
                    borderRadius: "999px",
                    color: C.gold,
                    fontWeight: 600,
                  }}
                >
                  {Math.round(s.similarity * 100)}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer row: timestamp + TTS button (assistant only) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          {timestamp && (
            <div
              style={{
                fontSize: "10px",
                color: isUser ? "rgba(5,5,5,0.4)" : C.vfaint,
              }}
            >
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}

          {/* TTS speaker button — assistant messages only */}
          {!isUser && (
            <button
              type="button"
              onClick={handleSpeak}
              title={isSpeaking ? "Stop reading" : "Read aloud (Indian voice)"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer",
                background: isSpeaking ? C.goldF : "transparent",
                border: `1px solid ${isSpeaking ? C.goldD : "transparent"}`,
                color: isSpeaking ? C.gold : C.vfaint,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isSpeaking) {
                  (e.currentTarget as HTMLButtonElement).style.color = C.gold;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    C.goldD;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSpeaking) {
                  (e.currentTarget as HTMLButtonElement).style.color = C.vfaint;
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "transparent";
                }
              }}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={10} /> Stop
                </>
              ) : (
                <>
                  <Volume2 size={10} /> Read
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          style={{
            flexShrink: 0,
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: C.ghost,
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2px",
          }}
        >
          <User size={13} color={C.dim} strokeWidth={2} />
        </div>
      )}
    </div>
  );
}
