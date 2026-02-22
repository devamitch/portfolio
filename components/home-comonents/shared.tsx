"use client";

import { useCallback, useRef } from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

/* ── Badge ─────────────────────────────────────────── */
export function Badge({
  children,
  color = COLORS.gold,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}44`,
        borderRadius: 4,
        padding: "3px 8px",
        whiteSpace: "nowrap",
        background: `${color}0D`,
      }}
    >
      {children}
    </span>
  );
}

/* ── GoldAccent ─────────────────────────────────────── */
export function GoldAccent({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: COLORS.goldG,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

/* ── TiltCard ───────────────────────────────────────── */
export function TiltCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * -12;
    const ry = (x - 0.5) * 12;
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    const shine = ref.current.querySelector(".tilt-shine") as HTMLElement | null;
    if (shine) {
      shine.style.setProperty("--mx", `${x * 100}%`);
      shine.style.setProperty("--my", `${y * 100}%`);
      shine.style.opacity = "1";
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    const shine = ref.current.querySelector(".tilt-shine") as HTMLElement | null;
    if (shine) shine.style.opacity = "0";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.18s ease-out", ...style }}
    >
      {children}
      <div
        className="tilt-shine"
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: "opacity 0.2s",
          background:
            "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.12) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
