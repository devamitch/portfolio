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
    query: "who ships custom game engines from zero dependencies",
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

export default function Preloader({ onComplete }: Props) {
  const [phase, setPhase] = useState<"boot" | "search" | "reveal" | "exit">(
    "boot",
  );
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [queryIdx, setQueryIdx] = useState(0);
  const [queryText, setQueryText] = useState("");
  const [matched, setMatched] = useState<typeof OFFERINGS>([]);
  const [resolving, setResolving] = useState(false);
  const [nameA, setNameA] = useState(0);
  const [nameB, setNameB] = useState(0);
  const [tiles, setTiles] = useState<boolean[]>(Array(6).fill(false));
  const [exitY, setExitY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const started = useRef(false);

  // Canvas orbiting rings
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
        // dot
        const dx = cx + Math.cos(a2) * radius,
          dy = cy + Math.sin(a2) * radius;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5 + r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${0.8 - r * 0.12})`;
        ctx.fill();
      }
      // Center glow
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

  // Boot
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const BOOT = [
      "INITIALIZING PORTFOLIO SYSTEM v2.5...",
      "LOADING CANDIDATE DATABASE · 16,842 ENGINEERS...",
      "APPLYING FILTERS: MOBILE + AI + BLOCKCHAIN + HEALTH...",
      "CROSS-REFERENCING PRODUCTION DEPLOYMENTS...",
      "ISOLATING PRINCIPAL-LEVEL ARCHITECTS...",
    ];
    let i = 0;
    const add = () => {
      if (i < BOOT.length) {
        setBootLines((p) => [...p, BOOT[i]!]);
        i++;
        setTimeout(add, 180);
      } else setTimeout(() => setPhase("search"), 250);
    };
    setTimeout(add, 350);
  }, []);

  // Search
  useEffect(() => {
    if (phase !== "search") return;
    let qi = 0;
    const doQ = () => {
      if (qi >= OFFERINGS.length) {
        setTimeout(() => setPhase("reveal"), 500);
        return;
      }
      const off = OFFERINGS[qi]!;
      setQueryIdx(qi);
      setResolving(false);
      setQueryText("");
      let progress = 0;
      const id = setInterval(() => {
        progress += 0.022;
        setQueryText(scramble(off.query, progress));
        if (progress >= 1) {
          clearInterval(id);
          setQueryText(off.query);
          setResolving(true);
          setTimeout(() => {
            setMatched((p) => [...p, off]);
            setResolving(false);
            qi++;
            setTimeout(doQ, 150);
          }, 480);
        }
      }, 16);
    };
    doQ();
  }, [phase]);

  // Reveal
  useEffect(() => {
    if (phase !== "reveal") return;
    let t = 0;
    const ia = setInterval(() => {
      t += 0.028;
      setNameA(Math.min(t, 1));
      if (t >= 1) clearInterval(ia);
    }, 16);
    setTimeout(() => {
      let t2 = 0;
      const ib = setInterval(() => {
        t2 += 0.022;
        setNameB(Math.min(t2, 1));
        if (t2 >= 1) clearInterval(ib);
      }, 16);
    }, 380);
    [0, 1, 2, 3, 4, 5].forEach((i) =>
      setTimeout(
        () =>
          setTiles((p) => {
            const n = [...p];
            n[i] = true;
            return n;
          }),
        650 + i * 90,
      ),
    );
    setTimeout(() => setPhase("exit"), 2600);
  }, [phase]);

  // Exit
  useEffect(() => {
    if (phase !== "exit") return;
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

  const progress =
    phase === "boot"
      ? (bootLines.length / 5) * 28
      : phase === "search"
        ? 28 + (matched.length / OFFERINGS.length) * 52
        : phase === "reveal"
          ? 80 + nameB * 20
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
      {/* Scanlines */}
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

      {/* Corner brackets */}
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

      {/* Canvas */}
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

      {/* Progress */}
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

      {/* Status pill */}
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
            background: "#C9A84C",
            display: "inline-block",
            animation: "plPulse 1.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 8,
            color: "rgba(201,168,76,0.65)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          {phase === "boot"
            ? "SYSTEM BOOT"
            : phase === "search"
              ? "SEARCHING FOR ARCHITECT"
              : phase === "reveal"
                ? "ARCHITECT LOCATED"
                : "ENTERING PORTFOLIO"}
        </span>
      </div>

      {/* Main content */}
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
        {/* BOOT */}
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

        {/* SEARCH */}
        {phase === "search" && (
          <div style={{ width: "100%", maxWidth: 720 }}>
            {/* Search bar */}
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

            {/* Matched */}
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

        {/* REVEAL */}
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

            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <div
                style={{
                  fontSize: "clamp(52px,10vw,112px)",
                  fontFamily: HN,
                  fontWeight: 900,
                  lineHeight: 0.86,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                  transform: `translateY(${(1 - nameA) * 90}px)`,
                  opacity: nameA,
                }}
              >
                AMIT
              </div>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 32 }}>
              <div
                style={{
                  fontSize: "clamp(38px,7.5vw,88px)",
                  fontFamily: HN,
                  fontWeight: 800,
                  lineHeight: 0.88,
                  letterSpacing: "2px",
                  WebkitTextStroke: "2px rgba(201,168,76,0.6)",
                  color: "transparent",
                  transform: `translateY(${(1 - nameB) * 90}px)`,
                  opacity: nameB,
                }}
              >
                CHAKRABORTY
              </div>
            </div>

            <div
              style={{
                width: nameB * 180,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,#C9A84C,transparent)",
                margin: "0 auto 28px",
              }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                maxWidth: 580,
                margin: "0 auto",
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
          </div>
        )}
      </div>

      {/* Footer */}
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
      `}</style>
    </div>
  );
}
