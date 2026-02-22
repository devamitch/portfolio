"use client";

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

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#050505",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldG: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
} as const;

const LOADING_PHRASES = [
  "Let me pull that up.",
  "Good one, hang on.",
  "On it.",
  "Yeah, one sec.",
  "Checking that for you.",
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
  "Hmm, that one's beyond what I know. But you can email Ah-mit directly — amit98ch at gmail dot com. He usually replies within a day.";

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
  if (h < 12) return "Morning";
  if (h < 17) return "Hey";
  return "Evening";
}

// ─── Plasma Orb Canvas ────────────────────────────────────────────────────────
function PlasmaOrb({
  size,
  dimmed,
  hasHistory,
}: {
  size: number;
  dimmed: boolean;
  hasHistory: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const st = useRef({
    t: 0,
    energy: 0.5,
    pulsePhase: 0,
    blobs: [] as any[],
    tendrils: [] as any[],
    particles: [] as any[],
  });

  useEffect(() => {
    const CX = size / 2,
      CY = size / 2,
      R = size * 0.4;
    const s = st.current;
    s.blobs = Array.from({ length: 5 }, (_, i) => ({
      angle: (i / 5) * Math.PI * 2,
      r: R * (0.18 + Math.random() * 0.22),
      speed: 0.008 + Math.random() * 0.009,
      phase: Math.random() * Math.PI * 2,
      hue: [38, 175, 38, 320, 38][i],
      size: R * (0.28 + Math.random() * 0.32),
    }));
    s.tendrils = Array.from({ length: 7 }, (_, i) => ({
      baseAngle: (i / 7) * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.013 + Math.random() * 0.007,
      length: R * (0.32 + Math.random() * 0.45),
      width: 0.7 + Math.random() * 0.9,
      hue: i % 3 === 0 ? 175 : 38,
    }));
    s.particles = Array.from({ length: 44 }, (_, i) => ({
      angle: (i / 44) * Math.PI * 2,
      orbitR: R * (0.62 + Math.random() * 0.42),
      orbitTilt: (Math.random() - 0.5) * 0.65,
      orbitSpeed: 0.004 + Math.random() * 0.009,
      size: 0.6 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.65,
      hue: 38 + (Math.random() - 0.5) * 26,
      front: Math.random() > 0.42,
    }));
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = size;
    canvas.height = size;
    const CX = size / 2,
      CY = size / 2,
      R = size * 0.4;

    const draw = () => {
      const s = st.current;
      s.t++;
      s.pulsePhase += 0.024;
      const target =
        (dimmed ? 0.28 : 0.5) + Math.sin(s.pulsePhase * 0.65) * 0.12;
      s.energy += (target - s.energy) * 0.05;
      const E = s.energy;

      ctx.clearRect(0, 0, size, size);

      // Ambient
      const amb = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.4);
      amb.addColorStop(0, `rgba(201,140,30,${0.06 * E})`);
      amb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, size, size);

      // Back particles
      s.particles
        .filter((p: any) => !p.front)
        .forEach((p: any) => {
          p.angle += p.orbitSpeed;
          const x = CX + Math.cos(p.angle) * p.orbitR * Math.cos(p.orbitTilt);
          const y = CY + Math.sin(p.angle) * p.orbitR;
          const d = (Math.cos(p.angle) * Math.cos(p.orbitTilt) + 1) / 2;
          if (d < 0.5) {
            ctx.beginPath();
            ctx.arc(x, y, p.size * d * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},80%,65%,${p.opacity * d * 0.3 * E})`;
            ctx.fill();
          }
        });

      // Dark glass sphere
      const glass = ctx.createRadialGradient(
        CX - R * 0.2,
        CY - R * 0.25,
        R * 0.04,
        CX,
        CY,
        R,
      );
      glass.addColorStop(0, "rgba(14,10,5,0.97)");
      glass.addColorStop(0.65, "rgba(6,4,2,0.98)");
      glass.addColorStop(1, "rgba(2,1,0,0.99)");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = glass;
      ctx.fill();

      // Inner plasma (clipped)
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R - 1, 0, Math.PI * 2);
      ctx.clip();
      s.blobs.forEach((b: any, i: number) => {
        b.angle += b.speed + E * 0.005;
        const bx =
          CX +
          Math.cos(b.angle + b.phase) *
            b.r *
            (1 + Math.sin(s.t * 0.02 + i) * 0.26);
        const by =
          CY +
          Math.sin(b.angle * 1.3 + b.phase) *
            b.r *
            (1 + Math.cos(s.t * 0.016 + i) * 0.2);
        const pr = b.size * (0.85 + Math.sin(s.t * 0.032 + i * 1.2) * 0.17) * E;
        const pg = ctx.createRadialGradient(bx, by, 0, bx, by, pr);
        const a = 0.18 + E * 0.2;
        if (b.hue === 38) {
          pg.addColorStop(0, `rgba(255,200,60,${a * 1.3})`);
          pg.addColorStop(0.35, `rgba(201,140,30,${a})`);
          pg.addColorStop(1, "rgba(0,0,0,0)");
        } else if (b.hue === 175) {
          pg.addColorStop(0, `rgba(60,220,200,${a * 0.52})`);
          pg.addColorStop(1, "rgba(0,0,0,0)");
        } else {
          pg.addColorStop(0, `rgba(220,60,80,${a * 0.42})`);
          pg.addColorStop(1, "rgba(0,0,0,0)");
        }
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(bx, by, pr, 0, Math.PI * 2);
        ctx.fill();
      });

      // Core glow
      const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 0.48);
      core.addColorStop(0, `rgba(255,210,80,${0.09 + E * 0.13})`);
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.fillRect(CX - R, CY - R, R * 2, R * 2);

      // AURA text
      const tp = 0.65 + Math.sin(s.pulsePhase * 1.1) * 0.14 + E * 0.2;
      ctx.font = `800 ${Math.round(size * 0.13)}px 'Courier New',monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let g = 3; g >= 0; g--) {
        ctx.shadowColor = `rgba(255,200,60,${0.28 * tp * (1 - g * 0.2)})`;
        ctx.shadowBlur = 3 + g * 5;
        ctx.fillStyle =
          g === 0
            ? `rgba(255,240,190,${0.88 * tp})`
            : `rgba(201,168,76,${0.18 * tp})`;
        ctx.fillText("AURA", CX, CY - 1);
      }
      ctx.shadowBlur = 0;
      ctx.font = `600 ${Math.round(size * 0.062)}px 'Courier New',monospace`;
      ctx.fillStyle = `rgba(201,168,76,${0.28 + E * 0.18})`;
      ctx.shadowColor = `rgba(201,168,76,${0.3 * E})`;
      ctx.shadowBlur = 5;
      ctx.fillText("AI", CX, CY + size * 0.13);
      ctx.shadowBlur = 0;
      ctx.restore();

      // Tendrils
      s.tendrils.forEach((t: any) => {
        t.phase += t.speed;
        const ang = t.baseAngle + Math.sin(t.phase) * 0.36;
        const extR = R + t.length * E * (0.3 + Math.sin(t.phase * 1.2) * 0.25);
        const tx1 = CX + Math.cos(ang) * R * 0.93,
          ty1 = CY + Math.sin(ang) * R * 0.93;
        const tx2 = CX + Math.cos(ang + Math.sin(t.phase) * 0.22) * extR;
        const ty2 = CY + Math.sin(ang + Math.sin(t.phase) * 0.22) * extR;
        const tg = ctx.createLinearGradient(tx1, ty1, tx2, ty2);
        tg.addColorStop(
          0,
          t.hue === 38
            ? `rgba(201,168,76,${0.48 * E})`
            : `rgba(40,200,180,${0.32 * E})`,
        );
        tg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.quadraticCurveTo(
          CX + Math.cos(ang + 0.16) * (R + extR) * 0.42,
          CY + Math.sin(ang + 0.16) * (R + extR) * 0.42,
          tx2,
          ty2,
        );
        ctx.strokeStyle = tg;
        ctx.lineWidth = t.width * E;
        ctx.stroke();
      });

      // Glass rim
      const rim = ctx.createRadialGradient(CX, CY, R * 0.83, CX, CY, R);
      rim.addColorStop(0, "rgba(0,0,0,0)");
      rim.addColorStop(0.68, `rgba(201,168,76,${0.1 + E * 0.06})`);
      rim.addColorStop(0.9, `rgba(201,168,76,${0.22 + E * 0.1})`);
      rim.addColorStop(1, "rgba(180,140,50,0.1)");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();
      ctx.strokeStyle = `rgba(201,168,76,${0.2 + E * 0.16})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CX, CY, R + 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201,140,30,${0.07 + E * 0.1})`;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Front particles
      s.particles
        .filter((p: any) => p.front)
        .forEach((p: any) => {
          const x = CX + Math.cos(p.angle) * p.orbitR * Math.cos(p.orbitTilt);
          const y = CY + Math.sin(p.angle) * p.orbitR;
          const d = (Math.cos(p.angle) * Math.cos(p.orbitTilt) + 1) / 2;
          if (d >= 0.5) {
            const ss = p.size * (0.5 + d * 0.65);
            const pg = ctx.createRadialGradient(x, y, 0, x, y, ss * 2.4);
            pg.addColorStop(0, `hsla(${p.hue},90%,75%,${p.opacity * d * E})`);
            pg.addColorStop(1, "hsla(0,0%,0%,0)");
            ctx.beginPath();
            ctx.arc(x, y, ss * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = pg;
            ctx.fill();
          }
        });

      // Specular highlight
      const hl = ctx.createRadialGradient(
        CX - R * 0.32,
        CY - R * 0.35,
        0,
        CX - R * 0.2,
        CY - R * 0.24,
        R * 0.5,
      );
      hl.addColorStop(0, "rgba(255,245,220,0.18)");
      hl.addColorStop(0.35, "rgba(255,240,200,0.05)");
      hl.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = hl;
      ctx.fill();

      // History badge
      if (hasHistory) {
        ctx.beginPath();
        ctx.arc(CX + R * 0.65, CY - R * 0.65, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#34D399";
        ctx.shadowColor = "#34D399";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, dimmed, hasHistory]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: size, height: size }}
    />
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────
interface Props {
  position?: "bottom-right" | "bottom-left";
  autoSpeak?: boolean;
}

const ORB_SIZE = 82;
const PANEL_W = 370;
const PANEL_H = 590;

// Spring simulation for organic morphing
function useSpringMorph() {
  const morphRef = useRef(0); // current value
  const velRef = useRef(0); // current velocity
  const targetRef = useRef(0); // target value
  const rafRef = useRef(0);
  const [display, setDisplay] = useState(0);
  const onDoneRef = useRef<(() => void) | null>(null);
  const doneCalledRef = useRef(false);

  const springTo = useCallback((target: number, onDone?: () => void) => {
    targetRef.current = target;
    onDoneRef.current = onDone ?? null;
    doneCalledRef.current = false;
    cancelAnimationFrame(rafRef.current);

    const tick = () => {
      // Spring constants: stiffness & damping tuned for organic liquid feel
      const stiffness = 0.045; // lower = slower/bouncier
      const damping = 0.72; // lower = more bounce
      const delta = targetRef.current - morphRef.current;
      velRef.current = velRef.current * damping + delta * stiffness;
      morphRef.current += velRef.current;

      setDisplay(morphRef.current);

      const settled =
        Math.abs(velRef.current) < 0.0004 && Math.abs(delta) < 0.0004;

      if (!settled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        morphRef.current = targetRef.current;
        velRef.current = 0;
        setDisplay(targetRef.current);
        if (!doneCalledRef.current && onDoneRef.current) {
          doneCalledRef.current = true;
          onDoneRef.current();
        }
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { mp: display, springTo };
}

export function AIAssistantWidget({
  position = "bottom-right",
  autoSpeak = true,
}: Props) {
  const {
    isNewUser,
    isFirstTimeVisitor,
    isVerified,
    isIdentifying,
    userName,
    hasGreetedUser,
  } = useUserIdentification();

  // "orb" | "morphing" | "chat" | "closing"
  const [phase, setPhase] = useState<"orb" | "morphing" | "chat" | "closing">(
    "orb",
  );
  const { mp, springTo } = useSpringMorph();

  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(autoSpeak);
  const [confirmClear, setConfirmClear] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevStatus = useRef("ready");
  const spokenMsgIds = useRef(new Set<string>());
  const loadingSpoken = useRef(false);
  const hasAutoOpened = useRef(false);
  const greetingSpoken = useRef(false);

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

  // ── Open / Close with spring morph ───────────────────────────────────────
  const handleOpen = useCallback(() => {
    setPhase("morphing");
    springTo(1, () => {
      setPhase("chat");
      setTimeout(() => inputRef.current?.focus(), 60);
    });
  }, [springTo]);

  const handleClose = useCallback(() => {
    stopSpeaking();
    setPhase("closing");
    springTo(0, () => setPhase("orb"));
  }, [springTo, stopSpeaking]);

  // ── Auto-open for first-time visitors ────────────────────────────────────
  useEffect(() => {
    if (!isVerified || isIdentifying || hasAutoOpened.current) return;
    hasAutoOpened.current = true;
    if (isFirstTimeVisitor && isNewUser) setTimeout(handleOpen, 800);
  }, [isVerified, isIdentifying, isFirstTimeVisitor, isNewUser, handleOpen]);

  // ── Greeting ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (
      phase !== "chat" ||
      !isFirstTimeVisitor ||
      !isNewUser ||
      hasGreetedUser ||
      greetingSpoken.current
    )
      return;
    greetingSpoken.current = true;
    setHasGreetedUser(true);
    const greeting = `${getTimeGreeting()}! I'm AURA — Ah-mit's portfolio assistant. Who am I talking to?`;
    speak(greeting, () => {
      if (isSupported) setTimeout(() => listen(), 400);
    });
    submitText(
      "System: New visitor just arrived. Greet them naturally as AURA and ask their name in a casual way. Keep it under 20 words.",
    );
  }, [
    phase,
    isFirstTimeVisitor,
    isNewUser,
    hasGreetedUser,
    isSupported,
    speak,
    listen,
    submitText,
    setHasGreetedUser,
  ]);

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: Event) =>
      scrollToSection(
        (e as CustomEvent<{ target: ScrollTarget }>).detail.target,
      );
    window.addEventListener(SCROLL_EVENT, h);
    return () => window.removeEventListener(SCROLL_EVENT, h);
  }, []);

  // ── Auto-speak ────────────────────────────────────────────────────────────
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

  // ── Scroll to bottom ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "chat")
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      onHandleSubmit({ preventDefault: () => {} });
    }
  };

  // ── Derived morph geometry ────────────────────────────────────────────────
  const isOrb = phase === "orb";
  const isChat = phase === "chat";
  const p = mp; // spring value, may overshoot slightly

  // Clamp for geometry calculations only
  const pc = Math.max(0, Math.min(1, p));

  const W = isOrb
    ? ORB_SIZE
    : isChat
      ? PANEL_W
      : ORB_SIZE + (PANEL_W - ORB_SIZE) * pc;
  const H = isOrb
    ? ORB_SIZE
    : isChat
      ? PANEL_H
      : ORB_SIZE + (PANEL_H - ORB_SIZE) * pc;
  const BR = isOrb
    ? ORB_SIZE / 2
    : isChat
      ? 22
      : Math.max(22, (ORB_SIZE / 2) * (1 - pc * 1.6));
  const bgA = isOrb ? 0 : isChat ? 1 : pc;
  const panelOp = isChat ? 1 : Math.max(0, (pc - 0.52) / 0.48);
  const orbOp = isOrb ? 1 : isChat ? 0 : Math.max(0, 1 - pc * 3.2);

  const hasLive = messages.length > 0;
  const hasHistory = restoredMessages.length > 0;

  const statusLine =
    status === "submitted"
      ? "🔍 Looking that up..."
      : status === "streaming"
        ? "💬 Typing..."
        : voiceState === "speaking"
          ? "🔊 Speaking..."
          : voiceState === "listening"
            ? "🎤 Listening..."
            : null;

  const posStyle: React.CSSProperties =
    position === "bottom-right"
      ? { bottom: "20px", right: "20px" }
      : { bottom: "20px", left: "20px" };

  return (
    <>
      <style>{`
        @keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes sp{0%,100%{opacity:.65}50%{opacity:1}}
        @keyframes orbfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes haloglow{0%,100%{opacity:.4;transform:scale(1.1)}50%{opacity:.75;transform:scale(1.32)}}
        @keyframes pulsedot{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blobPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
        .ai-scroll::-webkit-scrollbar{width:3px}
        .ai-scroll::-webkit-scrollbar-thumb{background:rgba(201,168,76,.2);border-radius:999px}
        .ai-input{background:#050505!important;color:#fff!important;font-family:inherit!important}
        .ai-input::placeholder{color:rgba(255,255,255,.24)!important}
        .ai-input:focus{outline:none!important;border-color:rgba(201,168,76,.5)!important;box-shadow:0 0 0 3px rgba(201,168,76,.08)!important}
        .ai-ib:hover{background:rgba(255,255,255,.1)!important}
        .ai-send:hover:not(:disabled){filter:brightness(1.12);box-shadow:0 0 20px rgba(201,168,76,.4)}
        .ai-send:disabled{opacity:.35;cursor:not-allowed}
        .ai-clr:hover{background:rgba(255,68,68,.12)!important;border-color:rgba(255,68,68,.35)!important;color:#FF6666!important}
        .ai-restored{font-size:9px;color:rgba(255,255,255,.15);text-align:center;padding:6px 0 2px;letter-spacing:.1em}
        .ai-sug:hover{background:rgba(201,168,76,.08)!important;border-color:rgba(201,168,76,.3)!important}
      `}</style>

      <div style={{ position: "fixed", zIndex: 9000, ...posStyle }}>
        {/* Halo behind orb */}
        {(isOrb || (phase === "morphing" && pc < 0.3)) && (
          <div
            style={{
              position: "absolute",
              width: ORB_SIZE,
              height: ORB_SIZE,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(201,140,30,0.22) 0%,transparent 70%)",
              filter: "blur(14px)",
              transform: "scale(1.55)",
              animation: "haloglow 3.8s ease-in-out infinite",
              pointerEvents: "none",
              opacity: isOrb ? 1 : Math.max(0, 1 - pc * 4),
            }}
          />
        )}

        {/* ── THE ONE MORPHING CONTAINER ───────────────────────────── */}
        <div
          onClick={isOrb ? handleOpen : undefined}
          style={{
            position: "relative",
            width: W,
            height: H,
            borderRadius: BR,
            background: `rgba(8,8,8,${0.88 * bgA})`,
            backdropFilter:
              bgA > 0
                ? `blur(${Math.round(30 * bgA)}px) saturate(${1 + 0.9 * bgA})`
                : "none",
            border:
              bgA > 0.05 ? `1px solid rgba(201,168,76,${0.13 * bgA})` : "none",
            boxShadow:
              bgA > 0.1
                ? `0 32px 100px rgba(0,0,0,${0.9 * bgA}), 0 0 0 1px rgba(201,168,76,${0.06 * bgA}), inset 0 1px 0 rgba(255,255,255,${0.05 * bgA})`
                : "none",
            overflow: "hidden",
            cursor: isOrb ? "pointer" : "default",
            animation: isOrb ? "orbfloat 4.2s ease-in-out infinite" : "none",
            fontFamily: "inherit",
            willChange: "width, height, border-radius",
          }}
        >
          {/* Plasma orb — fades as panel appears */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: ORB_SIZE,
              height: ORB_SIZE,
              opacity: orbOp,
              pointerEvents: "none",
            }}
          >
            <PlasmaOrb
              size={ORB_SIZE}
              dimmed={!isOrb}
              hasHistory={hasHistory || hasLive}
            />
          </div>

          {/* Chat panel — fades in at ~52% morph */}
          {!isOrb && (
            <div
              role="dialog"
              aria-label="AURA — Amit's AI Assistant"
              style={{
                position: "absolute",
                inset: 0,
                opacity: panelOp,
                display: "flex",
                flexDirection: "column",
                pointerEvents: isChat ? "auto" : "none",
              }}
            >
              {/* ── Header ─────────────────────────────────────────── */}
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
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      flexShrink: 0,
                      borderRadius: "40% 60% 55% 45%/45% 55% 45% 55%",
                      background: C.goldG,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 16px ${C.goldD}, inset 0 1px 1px rgba(255,255,255,0.22)`,
                      animation: "blobPulse 3.5s ease-in-out infinite",
                      fontSize: 14,
                    }}
                  >
                    ✦
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
                          ? `Hey, ${userName}`
                          : "Amit's AI · Voice Ready")}
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
                      fontSize: 13,
                      transition: "background .15s",
                    }}
                  >
                    {showSettings ? "▴" : "▾"}
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
                      fontSize: 15,
                      transition: "background .15s",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* ── Settings drawer ─────────────────────────────────── */}
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
                      🎙 Voice works best in Chrome
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: C.faint,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      AURA reads responses aloud. Conversation saves
                      automatically between visits.
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
                    ↺{" "}
                    {confirmClear
                      ? "Tap again to confirm clear"
                      : "Clear conversation history"}
                  </button>
                </div>
              )}

              {/* ── Messages ────────────────────────────────────────── */}
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
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            border: "2px solid " + C.gold,
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        <p
                          style={{
                            fontSize: 13,
                            color: C.gold,
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          One sec...
                        </p>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: "40% 60% 55% 45%/45% 55% 45% 55%",
                            background: C.goldG,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 0 28px ${C.goldD}`,
                            animation: "blobPulse 3.5s ease-in-out infinite",
                            fontSize: 22,
                          }}
                        >
                          ✦
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
                            {userName ? `Hey, ${userName} 👋` : "Hey, I'm AURA"}
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
                              ? "Amit's portfolio AI. Ask me anything — or just say hi."
                              : "Good to see you again. What are we exploring?"}
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
                              "{getTimeGreeting()}! I'm AURA — who am I talking
                              to?"
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
                                : "🎤 Voice active — just speak"}
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
                          {[
                            "What's the most impressive thing you've built?",
                            "Tell me about your React Native expertise",
                            "What are your consulting rates?",
                          ].map((q) => (
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
                        borderRadius: "40% 60% 55% 45%/45% 55% 45% 55%",
                        background: C.goldG,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                      }}
                    >
                      ✦
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
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
                          ? "🔍 Searching..."
                          : "✍️ Writing..."}
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

              {/* ── Input ───────────────────────────────────────────── */}
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
                    ref={inputRef}
                    type="text"
                    className="ai-input"
                    placeholder="Ask anything about Amit…"
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
                      <span
                        style={{
                          animation: "spin 1s linear infinite",
                          display: "block",
                          fontSize: 14,
                        }}
                      >
                        ◌
                      </span>
                    ) : (
                      <span style={{ fontSize: 15 }}>↑</span>
                    )}
                  </button>
                </div>

                {/* Voice controls row */}
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
                          color: voiceState === "speaking" ? "#34D399" : C.gold,
                          fontSize: 11,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "all .15s",
                        }}
                      >
                        {voiceState === "speaking" ? "■ Stop" : "▶ Read aloud"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
