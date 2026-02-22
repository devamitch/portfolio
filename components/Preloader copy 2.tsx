"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

const OFFERINGS = [
  {
    query: "who builds React Native apps serving 50,000+ users",
    result: "REACT NATIVE ARCHITECT",
    color: "#C9A84C",
  },
  {
    query: "who designs AI + RAG pipelines for HIPAA medical data",
    result: "AI SYSTEMS ENGINEER",
    color: "#F5C842",
  },
  {
    query: "who ships game engines from zero dependencies",
    result: "GAME ENGINE AUTHOR",
    color: "#DAA520",
  },
  {
    query: "who leads 21-person engineering teams end-to-end",
    result: "VP ENGINEERING",
    color: "#C9A84C",
  },
  {
    query: "who integrates Web3 + DeFi + smart contracts at scale",
    result: "BLOCKCHAIN ARCHITECT",
    color: "#F5C842",
  },
  {
    query: "who turns 0-to-1 ideas into funded production systems",
    result: "FOUNDING ENGINEER",
    color: "#DAA520",
  },
];

const CAPS = [
  { l: "React Native", s: "Expert · 8 yrs" },
  { l: "AI & RAG", s: "Medical · HIPAA" },
  { l: "Web3 / DeFi", s: "Solidity · EVM" },
  { l: "HealthTech", s: "Game Engine · CV" },
  { l: "0-to-1 Builds", s: "Startup Engineering" },
  { l: "VP Engineering", s: "21-person teams" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!";
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono','Courier New',monospace";

const VOICE_LINES = {
  boot: "The digital frontier is unforgiving. Every day, empires of code collapse under pressure. Products die in production. They hired fast, and failed slowly. To build at scale, you do not need another coder. You need an architect. Initiating protocol.",
  searchStart:
    "Deep network scan engaged. Sifting through millions of profiles. We bypass the generalists. We ignore the theorists. We are hunting for a pure builder. Someone forged in the fire of production. Someone who ships, when everything is on the line.",
  midSearch:
    "An anomaly detected. A polymath. Designing A I pipelines for Technical data. Deploying Web Three smart contracts. Rendering game engines from absolute zero. He does not just use technology. He commands it.",
  revealIntro:
    "The search is complete. Out of a billion nodes, only one true match remains.",
  revealName: "His name... is Amit.",
  connectPrompt:
    "He doesn't follow the future. He codes it. If your vision requires relentless execution, you have found your partner. The portal is open. Step into his world.",
};

function scramble(target: string, progress: number): string {
  return target
    .split("")
    .map((ch, i) =>
      i < Math.floor(progress * target.length)
        ? ch
        : ch === " "
          ? " "
          : CHARS[Math.floor(Math.random() * CHARS.length)],
    )
    .join("");
}

// ─── NATIVE BROWSER VOICE ENGINE ───────────────────────────────────────────
const FEMALE_KW =
  /female|woman|zira|hazel|kalpana|heera|priya|neerja|lekha|aditi|fiona|karen|moira|tessa|veena|samantha/i;
const AVOID_KW = /compact|mobile|junior/i;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const indianMaleVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().includes("en-in") &&
      !FEMALE_KW.test(v.name.toLowerCase()) &&
      !AVOID_KW.test(v.name.toLowerCase()),
  );
  if (indianMaleVoice) return indianMaleVoice;

  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    if (FEMALE_KW.test(name) || AVOID_KW.test(name)) return -1;
    let s = 0;
    if (name.includes("natural") || name.includes("premium")) s += 100;
    if (name.includes("uk english male") || name.includes("daniel")) s += 50;
    return s;
  };

  return (
    voices
      .map((v) => ({ v, s: score(v) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)[0]?.v ?? null
  );
}

function speakLine(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    if (onEnd) setTimeout(onEnd, 2000);
    return;
  }
  window.speechSynthesis.cancel();

  const processed = text
    .replace(/\bRAG\b/g, "R. A. G.")
    .replace(/\bAI\b/g, "A. I.")
    .replace(/\bWeb3\b/gi, "Web Three")
    .replace(/\bDeFi\b/gi, "Dee Fy")
    .replace(/\bHIPAA\b/g, "HIPPA")
    .replace(/Amit/gi, "Ah-meet")
    .trim();

  const utter = new SpeechSynthesisUtterance(processed);

  // Cinematic deep/slow voice
  utter.rate = 0.85;
  utter.pitch = 0.8;
  utter.volume = 1;

  const apply = () => {
    const voice = pickVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = "en-IN";
    }
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    apply();
    if (onEnd) utter.onend = onEnd;

    const fallbackTimeout = setTimeout(
      () => {
        if (onEnd) onEnd();
      },
      (processed.length / 10) * 1000,
    );

    utter.onend = () => {
      clearTimeout(fallbackTimeout);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utter);
  } else {
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        apply();
        if (onEnd) utter.onend = onEnd;
        window.speechSynthesis.speak(utter);
      },
      { once: true },
    );
  }
}

interface SubtitleEntry {
  id: number;
  text: string;
  visible: boolean;
}

export default function Preloader({ onComplete }: Props) {
  // START IN THE "START" PHASE TO FORCE A CLICK
  const [phase, setPhase] = useState<
    "start" | "boot" | "search" | "reveal" | "exit"
  >("start");

  const [bootLines, setBootLines] = useState<string[]>([]);
  const [queryIdx, setQueryIdx] = useState(0);
  const [queryText, setQueryText] = useState("");
  const [matched, setMatched] = useState<typeof OFFERINGS>([]);
  const [resolving, setResolving] = useState(false);
  const [showName, setShowName] = useState(false);
  const [nameA, setNameA] = useState(0);
  const [tiles, setTiles] = useState<boolean[]>(Array(6).fill(false));
  const [exitY, setExitY] = useState(0);
  const [subtitle, setSubtitle] = useState<SubtitleEntry | null>(null);
  const [connectPulse, setConnectPulse] = useState(false);
  const [showRealm, setShowRealm] = useState(false);
  const [realmProgress, setRealmProgress] = useState(0);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(2));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const subtitleId = useRef(0);
  const waveRaf = useRef(0);
  const isSpeaking = useRef(false);
  const sequenceStarted = useRef(false);

  // ── THIS IS THE MAGIC BUTTON HANDLER ──
  const handleInitiateSequence = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // 1. WAKE UP THE BROWSER AUDIO ENGINE
      const unlockUtterance = new SpeechSynthesisUtterance("System active.");
      unlockUtterance.volume = 0; // Play it silently so user doesn't hear it
      window.speechSynthesis.speak(unlockUtterance);
    }
    // 2. MOVE TO BOOT PHASE TO START THE REAL SEQUENCE
    setPhase("boot");
  };

  const showSubtitle = (text: string, durationMs = 4500) => {
    const id = ++subtitleId.current;
    setSubtitle({ id, text, visible: true });
    setTimeout(() => {
      setSubtitle((prev) =>
        prev?.id === id ? { ...prev, visible: false } : prev,
      );
      setTimeout(
        () => setSubtitle((prev) => (prev?.id === id ? null : prev)),
        600,
      );
    }, durationMs);
  };

  const startWaveform = () => {
    isSpeaking.current = true;
    const animate = () => {
      if (!isSpeaking.current) {
        setWaveform(Array(20).fill(2));
        return;
      }
      setWaveform(Array.from({ length: 20 }, () => 2 + Math.random() * 22));
      waveRaf.current = requestAnimationFrame(animate) as unknown as number;
    };
    waveRaf.current = requestAnimationFrame(animate) as unknown as number;
  };

  const stopWaveform = () => {
    isSpeaking.current = false;
    cancelAnimationFrame(waveRaf.current);
    setWaveform(Array(20).fill(2));
  };

  // Canvas background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;
    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cx = canvas.width / 2,
        cy = canvas.height / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < 5; r++) {
        const radius = 100 + r * 60;
        const speed = (r % 2 === 0 ? 1 : -1) * (0.004 + r * 0.001);
        const a1 = t * speed,
          a2 = a1 + Math.PI * (1.2 + r * 0.1);
        const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
        grad.addColorStop(0, `rgba(201,168,76,0)`);
        grad.addColorStop(0.5, `rgba(201,168,76,${0.15 - r * 0.02})`);
        grad.addColorStop(1, `rgba(201,168,76,0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, a1, a2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
        const dx = cx + Math.cos(a2) * radius,
          dy = cy + Math.sin(a2) * radius;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5 + r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${0.8 - r * 0.12})`;
        ctx.fill();
      }

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.05);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 + pulse * 10);
      g.addColorStop(0, `rgba(201,168,76,${0.4 + pulse * 0.2})`);
      g.addColorStop(1, "rgba(201,168,76,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 30 + pulse * 10, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      t++;
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // ── Boot phase ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "boot" || sequenceStarted.current) return;
    sequenceStarted.current = true;

    const BOOT = [
      "INITIALIZING PORTFOLIO SYSTEM v2.5...",
      "LOADING CANDIDATE DATABASE · 16,842 ENGINEERS...",
      "APPLYING FILTERS: MOBILE + AI + BLOCKCHAIN + HEALTH...",
      "CROSS-REFERENCING PRODUCTION DEPLOYMENTS...",
      "ISOLATING PRINCIPAL-LEVEL ARCHITECTS...",
    ];

    setTimeout(() => {
      startWaveform();
      showSubtitle(VOICE_LINES.boot, 14000);
      speakLine(VOICE_LINES.boot, () => {
        stopWaveform();
        setPhase("search");
      });
    }, 200);

    let i = 0;
    const add = () => {
      if (i < BOOT.length) {
        setBootLines((p) => [...p, BOOT[i]!]);
        i++;
        setTimeout(add, 250);
      }
    };
    setTimeout(add, 300);
  }, [phase]);

  // ── Search phase ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "search") return;

    setTimeout(() => {
      startWaveform();
      showSubtitle(VOICE_LINES.searchStart, 12000);
      speakLine(VOICE_LINES.searchStart, () => {
        showSubtitle(VOICE_LINES.midSearch, 14000);
        speakLine(VOICE_LINES.midSearch, () => {
          stopWaveform();
        });
      });
    }, 200);

    let qi = 0;
    const doQ = () => {
      if (qi >= OFFERINGS.length) {
        setTimeout(() => setPhase("reveal"), 1500);
        return;
      }
      const off = OFFERINGS[qi]!;
      setQueryIdx(qi);
      setResolving(false);
      setQueryText("");
      let progress = 0;
      const id = setInterval(() => {
        progress += 0.012;
        setQueryText(scramble(off.query, progress));
        if (progress >= 1) {
          clearInterval(id);
          setQueryText(off.query);
          setResolving(true);
          setTimeout(() => {
            setMatched((p) => [...p, off]);
            setResolving(false);
            qi++;
            setTimeout(doQ, 2000);
          }, 600);
        }
      }, 16);
    };
    setTimeout(doQ, 1000);
  }, [phase]);

  // ── Reveal phase ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "reveal") return;

    setTimeout(() => {
      startWaveform();
      showSubtitle(VOICE_LINES.revealIntro, 6000);
      speakLine(VOICE_LINES.revealIntro, () => {
        setShowName(true);
        showSubtitle(VOICE_LINES.revealName, 4000);

        let t = 0;
        const ia = setInterval(() => {
          t += 0.035;
          setNameA(Math.min(t, 1));
          if (t >= 1) clearInterval(ia);
        }, 16);

        speakLine(VOICE_LINES.revealName, () => {
          [0, 1, 2, 3, 4, 5].forEach((i) =>
            setTimeout(
              () =>
                setTiles((p) => {
                  const n = [...p];
                  n[i] = true;
                  return n;
                }),
              i * 150,
            ),
          );

          setTimeout(() => {
            showSubtitle(VOICE_LINES.connectPrompt, 10000);
            setConnectPulse(true);

            speakLine(VOICE_LINES.connectPrompt, () => {
              stopWaveform();
              setShowRealm(true);
              let rp = 0;
              const realmId = setInterval(() => {
                rp += 0.008;
                setRealmProgress(Math.min(rp, 1));
                if (rp >= 1) {
                  clearInterval(realmId);
                  setTimeout(() => setPhase("exit"), 1000);
                }
              }, 16);
            });
          }, 1500);
        });
      });
    }, 500);
  }, [phase]);

  // ── Exit phase ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "exit") return;

    window.speechSynthesis?.cancel();
    stopWaveform();
    let ep = 0;
    const id = setInterval(() => {
      ep += 0.04;
      setExitY(Math.min(ep, 1));
      if (ep >= 1) {
        clearInterval(id);
        onComplete();
      }
    }, 16);
    return () => clearInterval(id);
  }, [phase, onComplete]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      cancelAnimationFrame(waveRaf.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const progress =
    phase === "start"
      ? 0
      : phase === "boot"
        ? (bootLines.length / 5) * 28
        : phase === "search"
          ? 28 + (matched.length / OFFERINGS.length) * 52
          : phase === "reveal"
            ? 80 + nameA * 20
            : 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#050505",
        fontFamily: MONO,
        display: "flex",
        flexDirection: "column",
        transform: `translateY(-${exitY * 105}%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.06) 1px,rgba(0,0,0,0.06) 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {(
        [
          { t: 20, l: 20 },
          { t: 20, r: 20 },
          { b: 20, l: 20 },
          { b: 20, r: 20 },
        ] as any[]
      ).map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.t,
            bottom: p.b,
            left: p.l,
            right: p.r,
            width: 28,
            height: 28,
            zIndex: 2,
            borderTop: i < 2 ? "1px solid rgba(201,168,76,0.35)" : "none",
            borderBottom: i >= 2 ? "1px solid rgba(201,168,76,0.35)" : "none",
            borderLeft:
              i % 2 === 0 ? "1px solid rgba(201,168,76,0.35)" : "none",
            borderRight:
              i % 2 !== 0 ? "1px solid rgba(201,168,76,0.35)" : "none",
          }}
        />
      ))}

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.35,
          zIndex: 0,
        }}
      />

      {/* Progress Bar Top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(201,168,76,0.08)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.5s ease",
            background: "linear-gradient(90deg,#B8860B,#F5C842,#C9A84C)",
            boxShadow: "0 0 10px rgba(201,168,76,0.5)",
          }}
        />
      </div>

      {/* Status Pill */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid rgba(201,168,76,0.18)",
          background: "rgba(201,168,76,0.04)",
          padding: "6px 18px",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: phase === "start" ? "#EF4444" : "#C9A84C",
            display: "inline-block",
            animation: "plPulse 1.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 8,
            color: phase === "start" ? "#EF4444" : "rgba(201,168,76,0.65)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          {phase === "start"
            ? "AWAITING CLEARANCE"
            : phase === "boot"
              ? "SYSTEM BOOT"
              : phase === "search"
                ? "SEARCHING FOR ARCHITECT"
                : phase === "reveal" && showRealm
                  ? "SEE THE WORK"
                  : phase === "reveal"
                    ? "ARCHITECT LOCATED"
                    : "ENTERING PORTFOLIO"}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 72,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 3,
          height: 28,
          opacity: isSpeaking.current ? 1 : 0,
          transition: "opacity 0.4s",
        }}
      >
        {waveform.map((h, i) => (
          <div
            key={i}
            style={{
              width: 2,
              height: `${h}px`,
              background: `rgba(201,168,76,${0.3 + (h / 24) * 0.7})`,
              borderRadius: 1,
              transition: "height 0.08s ease",
            }}
          />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
          padding: "80px 24px",
        }}
      >
        {/* ── PHASE 0: THE FORCED CLICK BUTTON ── */}
        {phase === "start" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              animation: "plFadeIn 0.5s ease",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 14,
                  color: "#C9A84C",
                  letterSpacing: "0.4em",
                  marginBottom: 8,
                }}
              >
                SECURE MAINFRAME DETECTED
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.2em",
                  marginBottom: 24,
                }}
              >
                AUDIO EXPERIENCE REQUIRED. PLEASE CONFIRM ACCESS.
              </div>
            </div>

            {/* EXPLICIT CLICK BUTTON */}
            <button
              onClick={handleInitiateSequence}
              style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.5)",
                color: "#C9A84C",
                padding: "16px 40px",
                fontFamily: MONO,
                fontSize: 14,
                letterSpacing: "0.2em",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
                animation: "plConnectGlow 2s infinite",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(201,168,76,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(201,168,76,0.08)")
              }
            >
              INITIATE SECURE LINK
            </button>
          </div>
        )}

        {/* ── BOOT ── */}
        {phase === "boot" && (
          <div style={{ width: "100%", maxWidth: 560 }}>
            <div
              style={{
                fontSize: 8,
                color: "rgba(201,168,76,0.35)",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              SYSTEM INITIALIZING
            </div>
            {bootLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  color:
                    i === bootLines.length - 1
                      ? "rgba(201,168,76,0.9)"
                      : "rgba(255,255,255,0.25)",
                  letterSpacing: "0.06em",
                  marginBottom: 7,
                  animation: "plFadeIn 0.25s ease",
                }}
              >
                <span
                  style={{ color: "rgba(201,168,76,0.35)", marginRight: 10 }}
                >
                  ›
                </span>
                {line}
                {i === bootLines.length - 1 && (
                  <span style={{ animation: "plBlink 0.7s step-end infinite" }}>
                    {" "}
                    _
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── SEARCH ── */}
        {phase === "search" && (
          <div style={{ width: "100%", maxWidth: 720 }}>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 7,
                  color: "rgba(201,168,76,0.35)",
                  letterSpacing: "0.5em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                QUERY {queryIdx + 1}/{OFFERINGS.length} · PRINCIPAL ARCHITECT
                SEARCH
              </div>
              <div
                style={{
                  border: `1px solid ${resolving ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.18)"}`,
                  background: resolving
                    ? "rgba(201,168,76,0.04)"
                    : "rgba(255,255,255,0.01)",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "border-color 0.3s, background 0.3s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="rgba(201,168,76,0.5)"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="10"
                    y1="10"
                    x2="13"
                    y2="13"
                    stroke="rgba(201,168,76,0.5)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  style={{
                    fontSize: 12,
                    flex: 1,
                    letterSpacing: "0.03em",
                    color: resolving ? "#C9A84C" : "rgba(255,255,255,0.8)",
                    transition: "color 0.3s",
                  }}
                >
                  {queryText}
                  {!resolving && (
                    <span
                      style={{
                        animation: "plBlink 0.55s step-end infinite",
                        color: "#C9A84C",
                      }}
                    >
                      |
                    </span>
                  )}
                </span>
                {resolving && (
                  <span
                    style={{
                      fontSize: 7,
                      color: "#C9A84C",
                      letterSpacing: "0.35em",
                      animation: "plFadeIn 0.2s ease",
                    }}
                  >
                    MATCHING...
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {matched.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.013)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    animation: "plSlideIn 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 7,
                      color: "#34D399",
                      letterSpacing: "0.3em",
                      flexShrink: 0,
                    }}
                  >
                    ✓ MATCH
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.38)",
                      flex: 1,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.query}
                  </span>
                  <span
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      color: m.color,
                      letterSpacing: "0.28em",
                      flexShrink: 0,
                      border: `1px solid ${m.color}44`,
                      padding: "3px 8px",
                      background: `${m.color}0d`,
                    }}
                  >
                    {m.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVEAL ── */}
        {phase === "reveal" && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div
              style={{
                fontSize: 8,
                color: "#34D399",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                marginBottom: 28,
                animation: "plFadeIn 0.4s ease",
              }}
            >
              ██ ARCHITECT LOCATED · PERFECT MATCH ██
            </div>

            {showName && (
              <>
                <div style={{ overflow: "hidden", marginBottom: 32 }}>
                  <div
                    style={{
                      fontSize: "clamp(62px,12vw,140px)",
                      fontFamily: HN,
                      fontWeight: 900,
                      lineHeight: 0.86,
                      letterSpacing: "4px",
                      color: "#FFFFFF",
                      transform: `translateY(${(1 - nameA) * 90}px)`,
                      opacity: nameA,
                      WebkitTextStroke: "1px rgba(201,168,76,0.3)",
                    }}
                  >
                    AMIT
                  </div>
                </div>

                <div
                  style={{
                    width: nameA * 240,
                    height: 1,
                    background:
                      "linear-gradient(90deg,transparent,#C9A84C,transparent)",
                    margin: "0 auto 28px",
                    transition: "width 0.6s ease",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    justifyContent: "center",
                    maxWidth: 580,
                    margin: "0 auto 32px",
                  }}
                >
                  {CAPS.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 16px",
                        border: "1px solid rgba(201,168,76,0.2)",
                        background: "rgba(201,168,76,0.035)",
                        transform: tiles[i]
                          ? "translateY(0) scale(1)"
                          : "translateY(18px) scale(0.94)",
                        opacity: tiles[i] ? 1 : 0,
                        transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#C9A84C",
                          letterSpacing: "0.05em",
                          marginBottom: 3,
                        }}
                      >
                        {c.l}
                      </div>
                      <div
                        style={{
                          fontSize: 8,
                          color: "rgba(255,255,255,0.28)",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {c.s}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    opacity: connectPulse ? 1 : 0,
                    transform: connectPulse
                      ? "translateY(0) scale(1)"
                      : "translateY(16px) scale(0.96)",
                    transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      color: "rgba(201,168,76,0.55)",
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    ONE PERSON. ONE MATCH.
                  </div>

                  <a
                    href="mailto:amitchakraborty@example.com"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 32px",
                      border: "1px solid rgba(201,168,76,0.6)",
                      background: "rgba(201,168,76,0.07)",
                      color: "#C9A84C",
                      textDecoration: "none",
                      fontFamily: MONO,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.38em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      animation: "plConnectGlow 2.4s ease-in-out infinite",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(105deg,transparent 40%,rgba(201,168,76,0.12) 50%,transparent 60%)",
                        animation: "plShimmer 2s ease-in-out infinite",
                      }}
                    />
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M1 12L12 1H4M12 1V9"
                        stroke="#C9A84C"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    CONNECT WITH AMIT
                  </a>

                  <div
                    style={{
                      fontSize: 7,
                      color: "rgba(255,255,255,0.15)",
                      letterSpacing: "0.28em",
                      marginTop: 4,
                    }}
                  >
                    DO NOT MISS THIS
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 40,
                    opacity: showRealm ? 1 : 0,
                    transform: showRealm ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 1.2s ease, transform 1.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 1,
                      height: 28,
                      background:
                        "linear-gradient(180deg,transparent,rgba(201,168,76,0.4),transparent)",
                      animation: showRealm ? "plFadeIn 0.8s ease" : "none",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 7,
                      color: "rgba(201,168,76,0.45)",
                      letterSpacing: "0.55em",
                      textTransform: "uppercase",
                    }}
                  >
                    THE WORK AWAITS
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(18px,3.5vw,32px)",
                      fontFamily: HN,
                      fontWeight: 800,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#C9A84C",
                      textShadow: `0 0 ${20 + realmProgress * 40}px rgba(201,168,76,${0.3 + realmProgress * 0.5}), 0 0 ${60 + realmProgress * 80}px rgba(201,168,76,${0.1 + realmProgress * 0.2})`,
                      animation: "plRealmPulse 2.2s ease-in-out infinite",
                    }}
                  >
                    SEE WHAT HE BUILDS
                  </div>
                  <div
                    style={{
                      width: 240,
                      height: 1,
                      background: "rgba(201,168,76,0.08)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${realmProgress * 100}%`,
                        background: "linear-gradient(90deg,#B8860B,#F5C842)",
                        boxShadow: "0 0 12px rgba(201,168,76,0.6)",
                        transition: "width 0.1s linear",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: -3,
                        left: `${realmProgress * 100}%`,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#F5C842",
                        boxShadow: "0 0 8px 2px rgba(245,200,66,0.7)",
                        transform: "translateX(-50%)",
                        opacity: realmProgress > 0 && realmProgress < 1 ? 1 : 0,
                        transition: "left 0.1s linear, opacity 0.3s",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color:
                        realmProgress >= 1 ? "#34D399" : "rgba(201,168,76,0.5)",
                      letterSpacing: "0.38em",
                      transition: "color 0.4s",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {realmProgress >= 1
                      ? "✓ PORTAL OPEN"
                      : `${Math.round(realmProgress * 100)}% LOADING`}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 68,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          maxWidth: 680,
          width: "90%",
          pointerEvents: "none",
        }}
      >
        {subtitle && (
          <div
            style={{
              padding: "12px 20px",
              background: "rgba(5,5,5,0.88)",
              borderTop: "1px solid rgba(201,168,76,0.22)",
              borderBottom: "1px solid rgba(201,168,76,0.08)",
              textAlign: "center",
              opacity: subtitle.visible ? 1 : 0,
              transform: subtitle.visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <div
              style={{
                fontSize: 6,
                color: "rgba(201,168,76,0.4)",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#C9A84C",
                  display: "inline-block",
                  animation: "plPulse 1.2s ease-in-out infinite",
                }}
              />
              SYSTEM VOICE
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.82)",
                letterSpacing: "0.03em",
                lineHeight: 1.55,
                fontStyle: "italic",
                fontFamily: `Georgia,'Times New Roman',serif`,
              }}
            >
              &ldquo;{subtitle.text}&rdquo;
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <span
          style={{
            fontSize: 7,
            color: "rgba(255,255,255,0.08)",
            letterSpacing: "0.32em",
          }}
        >
          DEVAMIT.CO.IN
        </span>
        <span
          style={{
            fontSize: 7,
            color: "rgba(201,168,76,0.25)",
            letterSpacing: "0.32em",
          }}
        >
          KOLKATA · REMOTE WORLDWIDE
        </span>
      </div>

      <style>{`
        @keyframes plPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(201,168,76,0.5)}50%{opacity:0.5;box-shadow:0 0 0 7px rgba(201,168,76,0)}}
        @keyframes plBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes plFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes plSlideIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
        @keyframes plConnectGlow{ 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0),inset 0 0 0 0 rgba(201,168,76,0)} 50%{box-shadow:0 0 24px 4px rgba(201,168,76,0.18),inset 0 0 12px 0 rgba(201,168,76,0.06)} }
        @keyframes plShimmer{ 0%{transform:translateX(-100%)} 60%,100%{transform:translateX(200%)} }
        @keyframes plRealmPulse{ 0%,100%{opacity:1;text-shadow:0 0 20px rgba(201,168,76,0.4),0 0 60px rgba(201,168,76,0.15)} 50%{opacity:0.82;text-shadow:0 0 40px rgba(201,168,76,0.7),0 0 100px rgba(201,168,76,0.3)} }
        @keyframes plPulseText{ 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
    </div>
  );
}
