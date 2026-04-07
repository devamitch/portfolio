"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

/* ── types ──────────────────────────────────────────────────── */
type Role = "user" | "model";
interface Message { role: Role; text: string }

/* ── constants ──────────────────────────────────────────────── */
const SUGGESTIONS = [
  "What are your 5 featured projects?",
  "What tech do you specialise in?",
  "Are you available to hire?",
  "Tell me about Aura Arena.",
];

const GREETING =
  "Hey — I'm Amit's AI. Ask me anything about his work, projects, or availability.";

/* ── tiny helpers ───────────────────────────────────────────── */
function scrollBottom(el: HTMLDivElement | null) {
  if (el) el.scrollTop = el.scrollHeight;
}

/* ── Bubble ─────────────────────────────────────────────────── */
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: "82%",
          padding: "10px 14px",
          borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
          background: isUser
            ? `linear-gradient(135deg,${COLORS.gold},${COLORS.goldL})`
            : "rgba(255,255,255,.06)",
          border: isUser ? "none" : `1px solid ${COLORS.border}`,
          color: isUser ? "#000" : COLORS.dim,
          fontSize: 13,
          lineHeight: 1.6,
          fontWeight: isUser ? 600 : 300,
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

/* ── Thinking dots ──────────────────────────────────────────── */
function Thinking() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "6px 0 10px 4px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: COLORS.gold,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Widget ─────────────────────────────────────────────── */
export default function AIAssistantWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMsgs]   = useState<Message[]>([{ role: "model", text: GREETING }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [btnHov, setBtnHov]   = useState(false);
  const scrollRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => { scrollBottom(scrollRef.current); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.text !== GREETING)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", text: q }] }),
      });

      const data = await res.json();
      const reply = data.text || "I ran into an issue. Try again or email amit@devamit.co.in.";
      setMsgs((prev) => [...prev, { role: "model", text: reply }]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        { role: "model", text: "Connection error. Email amit@devamit.co.in directly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: 88,
              right: 24,
              width: 340,
              maxHeight: 520,
              background: "rgba(8,8,8,.97)",
              border: `1px solid rgba(201,168,76,.2)`,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              zIndex: 9999,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,76,.08)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS.gold,
                    animation: "ac-pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: COLORS.gold,
                    fontFamily: MONO,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Amit&apos;s AI
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.faint,
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 2,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 14px 8px",
                scrollbarWidth: "none",
              }}
            >
              {messages.map((m, i) => <Bubble key={i} msg={m} />)}
              {loading && <Thinking />}

              {/* Suggestions (show only if only greeting) */}
              {messages.length === 1 && !loading && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        background: "rgba(201,168,76,.06)",
                        border: `1px solid rgba(201,168,76,.18)`,
                        color: COLORS.dim,
                        padding: "8px 12px",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: MONO,
                        borderRadius: 8,
                        transition: "background .2s, color .2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(201,168,76,.14)";
                        e.currentTarget.style.color = COLORS.gold;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(201,168,76,.06)";
                        e.currentTarget.style.color = COLORS.dim;
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px",
                borderTop: `1px solid ${COLORS.border}`,
                display: "flex",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about Amit's work..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,.04)",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: COLORS.text,
                  fontSize: 13,
                  outline: "none",
                  fontFamily: MONO,
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                style={{
                  background: input.trim() ? COLORS.goldG : "rgba(255,255,255,.05)",
                  border: "none",
                  borderRadius: 8,
                  width: 38,
                  height: 38,
                  cursor: input.trim() ? "pointer" : "default",
                  color: input.trim() ? "#000" : COLORS.vfaint,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background .2s",
                  flexShrink: 0,
                }}
                aria-label="Send"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        animate={{ scale: btnHov ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: open ? "rgba(5,5,5,.95)" : COLORS.goldG,
          border: open ? `1px solid ${COLORS.goldD}` : "none",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: btnHov
            ? "0 0 0 8px rgba(201,168,76,.12), 0 8px 32px rgba(0,0,0,.4)"
            : "0 4px 20px rgba(0,0,0,.4)",
          transition: "box-shadow .25s, background .25s",
        }}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
      >
        <span style={{ fontSize: 20, color: open ? COLORS.gold : "#000" }}>
          {open ? "×" : "✦"}
        </span>
      </motion.button>
    </>
  );
}
