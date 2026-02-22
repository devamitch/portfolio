"use client";

import { COLORS, MONO, PROFILE_DATA } from "~/data/portfolio.data";

export default function MarqueeSection() {
  const items = [...PROFILE_DATA.techStack, ...PROFILE_DATA.techStack];
  return (
    <div
      style={{
        padding: "clamp(20px,3vw,32px) 0",
        borderTop: `1px solid ${COLORS.border}`,
        borderBottom: `1px solid ${COLORS.border}`,
        overflow: "hidden",
        position: "relative",
        background: COLORS.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(90deg,${COLORS.bg},transparent)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(270deg,${COLORS.bg},transparent)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        className="marquee-track"
        style={{ display: "flex", gap: 52, alignItems: "center" }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.1em",
                color: COLORS.faint,
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: COLORS.goldD,
                display: "inline-block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
