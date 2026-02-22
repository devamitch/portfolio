"use client";

import { useEffect, useRef, useState } from "react";
import { useSpeechContext } from "~/components/providers/AIWidgetProvider";

interface Props {
  onComplete: () => void;
}

const OFFERINGS = [
  {
    query: "React Native apps for 50,000+ users",
    result: "REACT NATIVE ARCHITECT",
  },
  { query: "AI + RAG pipelines for HIPAA data", result: "AI SYSTEMS ENGINEER" },
  { query: "Custom 0-dependency game engines", result: "GAME ENGINE AUTHOR" },
  { query: "End-to-end engineering leadership", result: "VP ENGINEERING" },
  { query: "Web3 + DeFi smart contracts", result: "BLOCKCHAIN ARCHITECT" },
  { query: "0-to-1 funded production systems", result: "FOUNDING ENGINEER" },
];

const CAPS = [
  { l: "React Native", s: "Expert · 8 yrs" },
  { l: "AI & RAG", s: "Medical · HIPAA" },
  { l: "Web3 / DeFi", s: "Solidity · EVM" },
  { l: "HealthTech", s: "Game Engine · CV" },
  { l: "0-to-1 Builds", s: "Startup Engineering" },
  { l: "VP Engineering", s: "21-person teams" },
];

const GLITCH_CHARS = "ｱΒΓΔΕЖΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789@#$%&*+<>[]{}";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!";
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono','Courier New',monospace";

const TTS_SCRIPT =
  "System online. Scanning database for principal architect. Match verified. Ah-meet. Portal is now open.";

// ── How long to wait before speaking (ms) ────────────────────────────────────
const SPEECH_DELAY_MS = 1800; // adjust freely — 1800ms feels natural

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

function useCypherText(targetText: string, trigger: boolean, speed = 25) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!trigger || !targetText) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            if (char === " ") return " ";
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          })
          .join(""),
      );
      if (iteration >= targetText.length) clearInterval(interval);
      iteration += 1 / 1.5;
    }, speed);
    return () => clearInterval(interval);
  }, [targetText, trigger, speed]);
  return text;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  const indianMale = voices.find(
    (v) => v.lang.includes("en-in") && !/female|woman/i.test(v.name),
  );
  const ukMale = voices.find((v) =>
    v.name.toLowerCase().includes("uk english male"),
  );
  return indianMale || ukMale || voices[0] || null;
}

const LiquidAudioPlayer = ({
  isPlaying,
  togglePlay,
}: {
  isPlaying: boolean;
  togglePlay: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;
    let reqId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.beginPath();
      const rBase = w / 2 - 8;
      for (let i = 0; i < Math.PI * 2; i += 0.1) {
        const r =
          rBase +
          Math.sin(i * 3 + t * 0.05) * 3 +
          Math.cos(i * 2 - t * 0.08) * 3;
        const x = cx + r * Math.cos(i);
        const y = cy + r * Math.sin(i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#FCF6BA");
      grad.addColorStop(0.5, "#D4AF37");
      grad.addColorStop(1, "#8C6218");

      ctx.fillStyle = grad;
      ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
      ctx.shadowBlur = isPlaying ? 15 : 5;
      ctx.fill();

      if (isPlaying) t += 1;
      reqId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(reqId);
  }, [isPlaying]);

  return (
    <button
      onClick={togglePlay}
      style={{
        position: "fixed",
        bottom: 24,
        right: 32,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "rgba(10, 8, 3, 0.4)",
        border: "1px solid rgba(212, 175, 55, 0.3)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100000,
        padding: 0,
        outline: "none",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        transition: "transform 0.2s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
    >
      <canvas
        ref={canvasRef}
        width={48}
        height={48}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="#050505" />
            <rect x="8" y="2" width="3" height="10" fill="#050505" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ marginLeft: 2 }}
          >
            <path d="M12 7L3 12V2L12 7Z" fill="#050505" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default function Preloader({ onComplete }: Props) {
  const { supported } = useSpeechContext();

  const [phase, setPhase] = useState<"boot" | "search" | "reveal" | "exit">(
    "boot",
  );
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [queryText, setQueryText] = useState("");
  const [matched, setMatched] = useState<typeof OFFERINGS>([]);
  const [showName, setShowName] = useState(false);
  const [nameA, setNameA] = useState(0);
  const [tiles, setTiles] = useState<boolean[]>(Array(6).fill(false));
  const [exitY, setExitY] = useState(0);
  const [subtitle, setSubtitle] = useState("");
  const [showRealm, setShowRealm] = useState(false);
  const [realmProgress, setRealmProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sequenceRunning = useRef(false);
  const audioInitialized = useRef(false);

  const displayedSubtitle = useCypherText(subtitle, !!subtitle, 25);

  // Background particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];
    let reqId: number;

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 1.5 + 0.5,
      }));
    };
    initCanvas();
    window.addEventListener("resize", initCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width);
      g.addColorStop(0, "rgba(25, 20, 5, 1)");
      g.addColorStop(1, "rgba(3, 3, 3, 1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]!;
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.25 - dist / 480})`;
            ctx.stroke();
          }
        }
      }
      reqId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  const startAudio = () => {
    if (!supported || typeof window === "undefined" || !window.speechSynthesis)
      return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(TTS_SCRIPT);
      utter.rate = 0.95;
      utter.pitch = 0.85;
      utter.volume = 1;

      const voice = pickVoice();
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang;
      } else {
        utter.lang = "en-IN";
      }

      utter.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn("Audio blocked.");
      setIsPlaying(false);
    }
  };

  const handleInvisibleUnlock = () => {
    if (!isAudioUnlocked) {
      setIsAudioUnlocked(true);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const unlock = new SpeechSynthesisUtterance("");
        unlock.volume = 0;
        window.speechSynthesis.speak(unlock);
        window.speechSynthesis.resume();
      }
    }
  };

  const togglePlay = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (sequenceRunning.current) return;
    sequenceRunning.current = true;

    const runTimeline = async () => {
      setSubtitle(
        supported
          ? TTS_SCRIPT
          : "> SYSTEM ONLINE... INITIATING SECURE DIRECTORY OVERRIDE...",
      );

      // ── Delayed audio start — gives the boot animation a moment to breathe ──
      if (supported && !audioInitialized.current) {
        audioInitialized.current = true;
        setTimeout(startAudio, SPEECH_DELAY_MS);
      }

      setPhase("boot");
      setBootLines(["ESTABLISHING SECURE CONNECTION..."]);
      await new Promise((res) => setTimeout(res, 800));
      setBootLines((p) => [...p, "BYPASSING STANDARD PROTOCOLS..."]);
      await new Promise((res) => setTimeout(res, 800));
      setBootLines((p) => [...p, "ACCESSING PRINCIPAL DIRECTORY..."]);
      await new Promise((res) => setTimeout(res, 800));

      setPhase("search");
      if (!supported)
        setSubtitle("> SCANNING DATABASE... ISOLATING ARCHITECT NODE...");

      for (let i = 0; i < OFFERINGS.length; i++) {
        setQueryText(OFFERINGS[i]!.query);
        await new Promise((res) => setTimeout(res, 500));
        setMatched((prev) => [...prev, OFFERINGS[i]!]);
      }

      await new Promise((res) => setTimeout(res, 400));
      setPhase("reveal");
      if (!supported) setSubtitle("> MATCH VERIFIED. ARCHITECT LOCATED.");

      setShowName(true);
      if (!supported) setShowNotification(true);

      let nameT = 0;
      const nInt = setInterval(() => {
        nameT += 0.03;
        setNameA(Math.min(nameT, 1));
        if (nameT >= 1) clearInterval(nInt);
      }, 16);

      await new Promise((res) => setTimeout(res, 1200));
      CAPS.forEach((_, i) =>
        setTimeout(
          () =>
            setTiles((p) => {
              const n = [...p];
              n[i] = true;
              return n;
            }),
          i * 120,
        ),
      );
      await new Promise((res) => setTimeout(res, 1500));

      if (!supported) setSubtitle("> PORTAL OPEN. ENTERING WORKSPACE...");
      setShowRealm(true);

      let rp = 0;
      const rInt = setInterval(() => {
        rp += 0.02;
        setRealmProgress(Math.min(rp, 1));
        if (rp >= 1) clearInterval(rInt);
      }, 16);

      await new Promise((res) => setTimeout(res, 1500));
      if (!supported) setShowNotification(false);
      setPhase("exit");
    };

    runTimeline();
    return () => window.speechSynthesis?.cancel();
  }, [supported]);

  useEffect(() => {
    if (phase !== "exit") return;
    let ep = 0;
    const id = setInterval(() => {
      ep += 0.05;
      setExitY(Math.min(ep, 1));
      if (ep >= 1) {
        clearInterval(id);
        onComplete();
      }
    }, 16);
    return () => clearInterval(id);
  }, [phase, onComplete]);

  const progress =
    phase === "boot"
      ? 20
      : phase === "search"
        ? 60
        : phase === "reveal"
          ? 90
          : 100;

  return (
    <section
      aria-label="Secure Boot Sequence"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#030303",
        fontFamily: MONO,
        display: "flex",
        flexDirection: "column",
        transform: `translateY(-${exitY * 105}%)`,
        overflow: "hidden",
      }}
    >
      {!isAudioUnlocked && (
        <div
          onClick={handleInvisibleUnlock}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 999998,
            cursor: "default",
            background: "transparent",
          }}
        />
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {subtitle}
      </div>

      <canvas
        aria-hidden="true"
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(212,175,55,0.05)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "linear-gradient(90deg,#8C6218,#D4AF37,#FBF5B7)",
            boxShadow: "0 0 20px rgba(212,175,55,0.8)",
          }}
        />
      </div>

      {showNotification && (
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            zIndex: 100,
            background: "rgba(10, 8, 3, 0.85)",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            padding: "16px 24px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
            animation: "plSlideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#D4AF37",
              borderRadius: "50%",
              animation: "plPulse 1.5s infinite",
            }}
          />
          <div>
            <div
              className="gold-text"
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              SYS_ALERT
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.05em",
              }}
            >
              Architect located. Voice offline.
            </div>
          </div>
        </div>
      )}

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
          padding: "40px 24px",
        }}
      >
        {phase === "boot" && (
          <div aria-live="polite" style={{ width: "100%", maxWidth: 560 }}>
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="gold-text"
                style={{
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  marginBottom: 16,
                  animation: "plFadeIn 0.4s ease",
                  fontWeight: 600,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ color: "rgba(212,175,55,0.5)", marginRight: 12 }}
                >
                  {">"}
                </span>
                {line}
              </div>
            ))}
          </div>
        )}

        {phase === "search" && (
          <div aria-live="polite" style={{ width: "100%", maxWidth: 720 }}>
            <div
              style={{
                borderLeft: `2px solid #D4AF37`,
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0.1), transparent)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                backdropFilter: "blur(4px)",
                animation: "plFadeIn 0.3s ease",
              }}
            >
              <span
                className="gold-text"
                style={{
                  fontSize: 15,
                  flex: 1,
                  letterSpacing: "0.1em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {queryText}{" "}
                <span
                  aria-hidden="true"
                  style={{
                    animation: "plBlink 0.4s step-end infinite",
                    color: "#FBF5B7",
                  }}
                >
                  _
                </span>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 24,
              }}
            >
              {matched.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 16px",
                    background: "rgba(5,5,5,0.6)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    animation:
                      "plSlideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#F3E5AB",
                      letterSpacing: "0.2em",
                      flexShrink: 0,
                    }}
                  >
                    [ MATCH ]
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      flex: 1,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {m.query}
                  </span>
                  <span
                    className="gold-text"
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.2em",
                      border: `1px solid rgba(212,175,55,0.3)`,
                      padding: "4px 8px",
                      background: `rgba(212,175,55,0.05)`,
                    }}
                  >
                    {m.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "reveal" && (
          <div
            aria-live="polite"
            style={{ textAlign: "center", width: "100%" }}
          >
            {showName && (
              <>
                <div style={{ overflow: "hidden", marginBottom: 20 }}>
                  <h2
                    className="gold-text"
                    style={{
                      margin: 0,
                      fontSize: "clamp(70px,15vw,160px)",
                      fontFamily: HN,
                      fontWeight: 900,
                      lineHeight: 0.9,
                      letterSpacing: "4px",
                      transform: `translateY(${(1 - nameA) * 100}px)`,
                      opacity: nameA,
                      textShadow: "0 10px 60px rgba(212,175,55,0.4)",
                    }}
                  >
                    AMIT
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    justifyContent: "center",
                    maxWidth: 700,
                    margin: "0 auto 40px",
                  }}
                >
                  {CAPS.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 24px",
                        border: "1px solid rgba(212,175,55,0.3)",
                        background: "rgba(10,10,10,0.8)",
                        opacity: tiles[i] ? 1 : 0,
                        transform: tiles[i]
                          ? "translateY(0)"
                          : "translateY(15px)",
                        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        className="gold-text"
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          marginBottom: 4,
                        }}
                      >
                        {c.l}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: "rgba(255,255,255,0.5)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {c.s}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 60,
                    opacity: showRealm ? 1 : 0,
                    transition: "opacity 0.6s ease",
                    width: 280,
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 3,
                      background: "rgba(212,175,55,0.15)",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${realmProgress * 100}%`,
                        background:
                          "linear-gradient(90deg, #8C6218, #D4AF37, #FBF5B7)",
                        boxShadow: "0 0 15px rgba(212,175,55,0.8)",
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                  <div
                    className="gold-text"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.4em",
                      marginTop: 16,
                      fontWeight: 700,
                    }}
                  >
                    {realmProgress >= 1
                      ? "PORTAL OPEN"
                      : `DECRYPTING... ${Math.round(realmProgress * 100)}%`}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Subtitle ticker */}
      {subtitle && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            width: "100%",
            maxWidth: 800,
            pointerEvents: "none",
          }}
        >
          <div style={{ padding: "16px 24px", textAlign: "center" }}>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.08em",
                fontFamily: MONO,
                textShadow: "0 4px 20px rgba(0,0,0,1)",
              }}
            >
              <span style={{ color: "#D4AF37" }}>{">"}</span>{" "}
              {displayedSubtitle}
              <span
                style={{
                  animation: "plBlink 0.6s step-end infinite",
                  color: "#D4AF37",
                }}
              >
                _
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Audio toggle button */}
      {supported && phase !== "exit" && (
        <LiquidAudioPlayer isPlaying={isPlaying} togglePlay={togglePlay} />
      )}

      <footer
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          padding: "0 40px",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.4em",
          }}
        >
          DEVAMIT.CO.IN
        </span>
        <span
          style={{
            fontSize: 8,
            color: "rgba(212,175,55,0.4)",
            letterSpacing: "0.4em",
          }}
        >
          KOLKATA · REMOTE WORLDWIDE
        </span>
      </footer>

      <style>{`
        .gold-text { 
          background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%); 
          background-size: 200% auto;
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          animation: goldShine 4s linear infinite;
        }
        @keyframes goldShine { to { background-position: 200% center; } }
        @keyframes plBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes plFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes plSlideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes plSlideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes plPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(212,175,55,0.6)}50%{opacity:0.5;box-shadow:0 0 0 6px rgba(212,175,55,0)}}
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      `}</style>
    </section>
  );
}
