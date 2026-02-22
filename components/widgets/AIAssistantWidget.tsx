"use client";

import { Bot, ChevronDown, Loader2, RotateCcw, Send, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SCROLL_EVENT,
  extractRawText,
  parseResponse,
  useRAGChat,
  type ScrollTarget,
} from "~/hooks/use-rag-chat";
import { useUserIdentification } from "~/hooks/use-user-identification";
import { useVoice } from "~/hooks/use-voice";
import { usePortfolioState } from "~/store/portfolio-state";
import { ChatBubble } from "./ChatBubble";
import { MicButton } from "./MicButton";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#050505",
  bg2: "#0A0A0A",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  border: "rgba(255,255,255,0.07)",
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

const LOADING_PHRASES = [
  "On it.",
  "One moment.",
  "Let me check.",
  "Looking that up.",
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
  "I don't have those details. You can email Amit directly at amit98ch at gmail dot com — he replies within twenty four hours.";

const isFallback = (t: string) =>
  FALLBACK_TRIGGERS.some((f) => t.toLowerCase().includes(f));
const pickRandom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

function scrollToSection(target: ScrollTarget) {
  if (typeof window === "undefined") return;
  const el =
    document.getElementById(target) ??
    document.querySelector(`[data-section="${target}"]`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!el) window.location.hash = target;
}

function getTimeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

// ─── Liquid Blob Canvas Button ─────────────────────────────────────────────────

function LiquidBlobButton({
  onClick,
  hasHistory,
  visible,
}: {
  onClick: () => void;
  hasHistory: boolean;
  visible: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 140,
      H = 72;
    canvas.width = W;
    canvas.height = H;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = tRef.current;
      const cx = W / 2,
        cy = H / 2;
      const pts = 8;
      const baseR = 28 + Math.sin(t * 0.035) * 3.5;

      const verts: [number, number][] = [];
      for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const n =
          Math.sin(a * 2 + t * 0.028) * 4.5 + Math.cos(a * 3 - t * 0.019) * 3.5;
        verts.push([
          cx + Math.cos(a) * (baseR + n),
          cy + Math.sin(a) * (baseR + n),
        ]);
      }

      ctx.beginPath();
      for (let i = 0; i < pts; i++) {
        const prev = verts[(i - 1 + pts) % pts]!;
        const cur = verts[i]!;
        const next = verts[(i + 1) % pts]!;
        const cpx = cur[0] + (next[0] - prev[0]) * 0.14;
        const cpy = cur[1] + (next[1] - prev[1]) * 0.14;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        i === 0
          ? ctx.moveTo(cur[0], cur[1])
          : ctx.quadraticCurveTo(cpx, cpy, cur[0], cur[1]);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(
        cx - 7,
        cy - 7,
        1,
        cx,
        cy,
        baseR + 12,
      );
      grad.addColorStop(0, "#FDF8CC");
      grad.addColorStop(0.3, "#F5C842");
      grad.addColorStop(0.65, "#C9A84C");
      grad.addColorStop(1, "#8C6218");
      ctx.fillStyle = grad;
      ctx.shadowColor = "rgba(212,175,55,0.75)";
      ctx.shadowBlur = 16 + Math.sin(t * 0.04) * 5;
      ctx.fill();
      ctx.shadowBlur = 0;

      // "AURA" text
      ctx.font = "800 11px 'Helvetica Neue', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(5,5,5,0.85)";
      ctx.fillText("AURA", cx, cy);

      // History indicator
      if (hasHistory) {
        ctx.beginPath();
        ctx.arc(cx + baseR - 2, cy - baseR + 3, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#34D399";
        ctx.shadowColor = "#34D399";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      tRef.current++;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasHistory]);

  return (
    <button
      onClick={onClick}
      aria-label="Open AURA assistant"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "block",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition:
          "opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </button>
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────

interface Props {
  position?: "bottom-right" | "bottom-left";
  autoSpeak?: boolean;
}

export function AIAssistantWidget({
  position = "bottom-right",
  autoSpeak = true,
}: Props) {
  // Identity
  const {
    isNewUser,
    isFirstTimeVisitor,
    isVerified,
    isIdentifying,
    userName,
    hasGreetedUser,
  } = useUserIdentification();

  // Panel state
  const [isOpen, setIsOpen] = useState(false);
  const [panelOpacity, setPanelOpacity] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(autoSpeak);
  const [confirmClear, setConfirmClear] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevStatus = useRef("ready");
  const spokenMsgIds = useRef(new Set<string>());
  const loadingSpoken = useRef(false);
  const hasAutoOpened = useRef(false);
  const greetingSpoken = useRef(false);
  const panelRafRef = useRef(0);

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

  const { addQuery, setHasGreetedUser } = usePortfolioState();

  const {
    voiceState,
    transcript,
    error: voiceError,
    isSupported,
    listen,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice({
    onTranscript: (t) => {
      addQuery(t);
      submitText(t);
    },
  });

  const onHandleSubmit = useCallback(
    (e: { preventDefault?: () => void }) => {
      e.preventDefault?.();
      if (input.trim()) addQuery(input.trim());
      handleSubmit({ preventDefault: () => {} } as any);
    },
    [input, addQuery, handleSubmit],
  );

  const onSubmitText = useCallback(
    (t: string) => {
      addQuery(t);
      submitText(t);
    },
    [addQuery, submitText],
  );

  // ── Panel fade helpers ─────────────────────────────────────────────────────

  const fadePanel = useCallback(
    (toValue: number, onDone?: () => void) => {
      cancelAnimationFrame(panelRafRef.current);
      const start = performance.now();
      const duration = 220;
      const from = panelOpacity; // captured in closure

      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const val = from + (toValue - from) * eased;
        setPanelOpacity(val);
        if (t < 1) {
          panelRafRef.current = requestAnimationFrame(step);
        } else {
          setPanelOpacity(toValue);
          onDone?.();
        }
      };
      panelRafRef.current = requestAnimationFrame(step);
    },
    [panelOpacity],
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    // next tick — let panel mount first, then fade in
    setTimeout(() => fadePanel(1), 16);
  }, [fadePanel]);

  const handleClose = useCallback(() => {
    stopSpeaking();
    fadePanel(0, () => setIsOpen(false));
  }, [fadePanel, stopSpeaking]);

  // ── Auto-open for brand new (first-time) visitors ──────────────────────────
  useEffect(() => {
    if (!isVerified || isIdentifying || hasAutoOpened.current) return;
    hasAutoOpened.current = true;

    if (isFirstTimeVisitor && isNewUser) {
      console.log("[AURA] First-time visitor — auto-opening widget");
      setTimeout(handleOpen, 600);
    }
  }, [isVerified, isIdentifying, isFirstTimeVisitor, isNewUser, handleOpen]);

  // ── Greeting for new users ─────────────────────────────────────────────────
  useEffect(() => {
    if (
      !isOpen ||
      !isFirstTimeVisitor ||
      !isNewUser ||
      hasGreetedUser ||
      greetingSpoken.current
    )
      return;
    greetingSpoken.current = true;
    setHasGreetedUser(true);

    const msg = `${getTimeGreeting()}! I'm AURA, Amit's portfolio assistant. Could you tell me your name and what brings you here?`;
    speak(msg, () => {
      if (isSupported) setTimeout(() => listen(), 500);
    });
    submitText(
      "System: New visitor onboarding. Greet them as AURA and ask their name and purpose.",
    );
  }, [
    isOpen,
    isFirstTimeVisitor,
    isNewUser,
    hasGreetedUser,
    isSupported,
    speak,
    listen,
    submitText,
    setHasGreetedUser,
  ]);

  // ── Scroll listener ────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: Event) =>
      scrollToSection(
        (e as CustomEvent<{ target: ScrollTarget }>).detail.target,
      );
    window.addEventListener(SCROLL_EVENT, h);
    return () => window.removeEventListener(SCROLL_EVENT, h);
  }, []);

  // ── Auto-speak ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoSpeakEnabled || !isSupported) return;
    const prev = prevStatus.current;
    const now = status;

    if (
      prev === "ready" &&
      (now === "submitted" || now === "streaming") &&
      !loadingSpoken.current
    ) {
      loadingSpoken.current = true;
      stopSpeaking();
      setTimeout(() => speak(pickRandom(LOADING_PHRASES)), 60);
    }

    if ((prev === "streaming" || prev === "submitted") && now === "ready") {
      loadingSpoken.current = false;
      const last = [...messages].reverse().find((m) => m.role === "assistant");
      if (last && !spokenMsgIds.current.has(last.id)) {
        spokenMsgIds.current.add(last.id);
        const raw = extractRawText(last);
        if (raw) {
          setTimeout(() => {
            stopSpeaking();
            if (isFallback(raw)) {
              speak(FALLBACK_SPEAK);
              return;
            }
            const { voiceLine } = parseResponse(raw);
            if (voiceLine) speak(voiceLine);
          }, 400);
        }
      }
    }
    prevStatus.current = now;
  }, [status, messages, autoSpeakEnabled, isSupported, speak, stopSpeaking]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  useEffect(() => () => cancelAnimationFrame(panelRafRef.current), []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      onHandleSubmit({ preventDefault: () => {} });
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

  return (
    <>
      <style>{`
        @keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes sp{0%,100%{opacity:.65}50%{opacity:1}}
        @keyframes blobPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
        .ai-scroll::-webkit-scrollbar{width:3px}
        .ai-scroll::-webkit-scrollbar-thumb{background:rgba(201,168,76,.2);border-radius:999px}
        .ai-input{background:#050505!important}
        .ai-input::placeholder{color:rgba(255,255,255,.24)}
        .ai-input:focus{outline:none;border-color:rgba(201,168,76,.5)!important;box-shadow:0 0 0 3px rgba(201,168,76,.08)}
        .ai-ib:hover{background:rgba(255,255,255,.1)!important}
        .ai-send:hover:not(:disabled){filter:brightness(1.12);box-shadow:0 0 20px rgba(201,168,76,.4)}
        .ai-send:disabled{opacity:.35;cursor:not-allowed}
        .ai-clr:hover{background:rgba(255,68,68,.12)!important;border-color:rgba(255,68,68,.35)!important;color:#FF6666!important}
        .ai-restored{font-size:9px;color:rgba(255,255,255,.15);text-align:center;padding:6px 0 2px;letter-spacing:.1em}
        .ai-sug:hover{background:rgba(201,168,76,0.08)!important;border-color:rgba(201,168,76,.3)!important}
      `}</style>

      {/* Fixed anchor */}
      <div style={{ position: "fixed", zIndex: 9000, ...posStyle }}>
        {/* ── Blob button (closed state) ── */}
        {!isOpen && (
          <div style={{ animation: "blobPulse 3.5s ease-in-out infinite" }}>
            <LiquidBlobButton
              onClick={handleOpen}
              hasHistory={hasHistory || hasLive}
              visible={true}
            />
          </div>
        )}

        {/* ── Panel (open state) ── */}
        {isOpen && (
          <div
            role="dialog"
            aria-label="AURA — Amit's AI Assistant"
            style={{
              width: "370px",
              height: "min(590px, calc(100vh - 32px))",
              display: "flex",
              flexDirection: "column",
              background: "rgba(8,8,8,0.84)",
              backdropFilter: "blur(30px) saturate(190%)",
              border: "1px solid rgba(201,168,76,0.13)",
              borderRadius: "22px",
              overflow: "hidden",
              boxShadow:
                "0 32px 100px rgba(0,0,0,.9), 0 0 0 1px rgba(201,168,76,.06), inset 0 1px 0 rgba(255,255,255,.05)",
              opacity: panelOpacity,
              transform: `scale(${0.94 + panelOpacity * 0.06}) translateY(${(1 - panelOpacity) * 12}px)`,
              pointerEvents: panelOpacity > 0.5 ? "auto" : "none",
            }}
          >
            {/* Header */}
            <div
              style={{
                flexShrink: 0,
                padding: "14px 16px",
                background:
                  "linear-gradient(180deg,rgba(201,168,76,.09) 0%,transparent 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Organic logo mark */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "40% 60% 55% 45% / 45% 55% 45% 55%",
                    background: C.goldG,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 16px ${C.goldD}, inset 0 1px 1px rgba(255,255,255,0.22)`,
                    animation: "blobPulse 3.5s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={16} color="#050505" strokeWidth={2.5} />
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
                    AURA
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: statusLine ? C.gold : "rgba(201,168,76,.5)",
                      animation: statusLine
                        ? "sp 1.2s ease-in-out infinite"
                        : "none",
                      transition: "color .3s",
                    }}
                  >
                    {statusLine ??
                      (userName
                        ? `Hi, ${userName}`
                        : "Voice · Portfolio · Live")}
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
                  title={
                    autoSpeakEnabled ? "Auto-speak ON" : "Enable auto-speak"
                  }
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    background: autoSpeakEnabled ? C.goldF : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background .15s",
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
                  <ChevronDown
                    size={14}
                    style={{
                      transform: showSettings ? "rotate(180deg)" : "none",
                      transition: "transform .2s",
                    }}
                  />
                </button>
                <button
                  onClick={handleClose}
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

            {/* Settings drawer */}
            {showSettings && (
              <div
                style={{
                  flexShrink: 0,
                  padding: "12px 16px",
                  background: C.bg3,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
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
                    After each response AURA speaks a plain-English summary.
                    Conversation is saved automatically.
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
                    border: `1px solid ${confirmClear ? "rgba(255,68,68,.35)" : "rgba(255,255,255,0.07)"}`,
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

            {/* Messages area */}
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
                    gap: 16,
                    padding: 20,
                    textAlign: "center",
                  }}
                >
                  {isIdentifying ? (
                    <>
                      <Loader2
                        size={22}
                        color={C.gold}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      <p
                        style={{
                          fontSize: 13,
                          color: C.gold,
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        Identifying you…
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "40% 60% 55% 45% / 45% 55% 45% 55%",
                          background: C.goldG,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 0 28px ${C.goldD}`,
                          animation: "blobPulse 3.5s ease-in-out infinite",
                        }}
                      >
                        <Bot size={24} color="#050505" strokeWidth={2.5} />
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: C.gold,
                            margin: "0 0 6px",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {userName ? `Welcome back, ${userName}` : "I'm AURA"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.faint,
                            margin: 0,
                            lineHeight: 1.6,
                          }}
                        >
                          {isFirstTimeVisitor
                            ? "Amit's portfolio assistant. Let me get you oriented."
                            : "Ask me anything about Amit's work."}
                        </p>
                      </div>

                      {isFirstTimeVisitor && (
                        <div
                          style={{
                            padding: "12px 14px",
                            background: C.goldF,
                            borderRadius: 12,
                            border: `1px solid ${C.goldD}`,
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: 12,
                              color: C.gold,
                              fontStyle: "italic",
                              lineHeight: 1.5,
                            }}
                          >
                            "{getTimeGreeting()}! Could you introduce yourself?
                            What brings you here?"
                          </p>
                          <p
                            style={{
                              margin: "6px 0 0",
                              fontSize: 10,
                              color: C.faint,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {voiceState === "listening"
                              ? "🎤 Listening…"
                              : "🎤 Voice guidance active"}
                          </p>
                        </div>
                      )}

                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 9,
                            color: C.faint,
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                            textAlign: "left",
                            margin: "4px 0 0",
                          }}
                        >
                          Try asking
                        </p>
                        {SUGGESTED.map((q) => (
                          <button
                            key={q}
                            className="ai-sug"
                            onClick={() => onSubmitText(q)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "9px 13px",
                              borderRadius: 10,
                              background: "rgba(201,168,76,0.03)",
                              border: "1px solid rgba(201,168,76,0.12)",
                              color: C.dim,
                              fontSize: 12,
                              cursor: "pointer",
                              transition: "all .15s",
                            }}
                          >
                            <span style={{ color: C.gold, marginRight: 6 }}>
                              ✦
                            </span>
                            {q}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Restored history */}
              {!hasLive && hasHistory && (
                <>
                  <div className="ai-restored">— Previous conversation —</div>
                  {restoredMessages.map((msg) => {
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

              {/* Live messages */}
              {hasLive &&
                messages.map((msg) => {
                  const raw = extractRawText(msg);
                  if (!raw.trim()) return null;
                  const display =
                    msg.role === "assistant"
                      ? parseResponse(raw).displayText
                      : raw;
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
                      flexShrink: 0,
                      marginTop: 2,
                      borderRadius: "40% 60% 55% 45% / 45% 55% 45% 55%",
                      background: C.goldG,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bot size={13} color="#050505" strokeWidth={2.5} />
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: "18px 18px 18px 4px",
                        background: C.bg3,
                        border: "1px solid rgba(255,255,255,0.07)",
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

            {/* Error bar */}
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
                borderTop: "1px solid rgba(255,255,255,0.07)",
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
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: C.text,
                    fontSize: 13,
                    fontFamily: "inherit",
                    transition: "border-color .2s, box-shadow .2s",
                  }}
                />
                <button
                  type="button"
                  className="ai-send"
                  onClick={(e) => onHandleSubmit(e)}
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
                  onMicClick={
                    voiceState === "listening" ? stopListening : listen
                  }
                  onStopSpeaking={stopSpeaking}
                />
                {(() => {
                  const last = messages
                    .filter((m) => m.role === "assistant")
                    .at(-1);
                  const raw = last ? extractRawText(last) : "";
                  const display = raw ? parseResponse(raw).displayText : "";
                  if (!display) return null;
                  return (
                    <button
                      onClick={() =>
                        voiceState === "speaking"
                          ? stopSpeaking()
                          : speak(display)
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
                        color:
                          voiceState === "speaking" ? "#34D399" : "#C9A84C",
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
        )}
      </div>
    </>
  );
}
