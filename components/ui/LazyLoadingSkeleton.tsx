"use client";

import { DynamicOptionsLoadingProps } from "next/dynamic";
import { useEffect } from "react";
import { COLORS } from "~/data/portfolio.data";

const SHIMMER_CSS = `
@keyframes __shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
@keyframes __pulse_border {
  0%, 100% { border-color: rgba(201,168,76,0.10); }
  50%       { border-color: rgba(201,168,76,0.32); }
}
@keyframes __dot_bounce {
  0%, 80%, 100% { transform: translateY(0);   opacity: 0.3; }
  40%           { transform: translateY(-6px); opacity: 1;   }
}
@keyframes __scan {
  0%   { top: 0%;   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("__lazy-skeleton-styles")) return;
  const s = document.createElement("style");
  s.id = "__lazy-skeleton-styles";
  s.textContent = SHIMMER_CSS;
  document.head.appendChild(s);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function ShimmerBar({
  w = "100%",
  h = 12,
  radius = 4,
  delay = 0,
}: {
  w?: string | number;
  h?: number;
  radius?: number;
  delay?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(
          90deg,
          ${COLORS.bg3} 0%,
          rgba(201,168,76,0.06) 40%,
          rgba(201,168,76,0.12) 50%,
          rgba(201,168,76,0.06) 60%,
          ${COLORS.bg3} 100%
        )`,
        backgroundSize: "200% 100%",
        animation: `__shimmer 2.2s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function GoldDot({ i }: { i: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 5,
        height: 5,
        borderRadius: "50%",
        backgroundColor: COLORS.gold,
        animation: `__dot_bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
      }}
    />
  );
}

// ─── Main Skeleton ────────────────────────────────────────────────────────────
export interface SkeletonLoadingProps extends DynamicOptionsLoadingProps {
  /** Custom label shown below the dots  */
  label?: string;
  /** Override fixed height (px). Defaults to 400. */
  height?: number;
  /** Variant: 'card' (default) | 'full' | 'minimal' */
  variant?: "card" | "full" | "minimal";
}

export function LazyLoadingSkeleton({
  isLoading,
  pastDelay,
  timedOut,
  retry,
  error,
  label = "Loading Component",
  height = 400,
  variant = "card",
}: SkeletonLoadingProps) {
  useEffect(() => {
    injectStyles();
  }, []);

  // ── Error state ──
  if (error) {
    return (
      <div
        style={{
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg2,
          border: `1px solid rgba(255,68,68,0.22)`,
          borderRadius: 8,
          gap: 12,
          padding: 24,
        }}
      >
        <span style={{ fontSize: 28 }}>⚠</span>
        <p
          style={{
            color: "rgba(255,68,68,0.9)",
            fontSize: 13,
            margin: 0,
            fontFamily: "monospace",
          }}
        >
          Failed to load component
        </p>
        {retry && (
          <button
            onClick={retry}
            style={{
              marginTop: 8,
              padding: "6px 18px",
              fontSize: 12,
              fontFamily: "monospace",
              color: COLORS.gold,
              background: COLORS.goldF,
              border: `1px solid ${COLORS.goldD}`,
              borderRadius: 4,
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            RETRY
          </button>
        )}
      </div>
    );
  }

  // ── Timed out state ──
  if (timedOut) {
    return (
      <div
        style={{
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg2,
          border: `1px solid ${COLORS.goldD}`,
          borderRadius: 8,
          gap: 12,
        }}
      >
        <p
          style={{
            color: COLORS.faint,
            fontSize: 13,
            margin: 0,
            fontFamily: "monospace",
          }}
        >
          Taking longer than expected…
        </p>
        {retry && (
          <button
            onClick={retry}
            style={{
              padding: "6px 18px",
              fontSize: 12,
              fontFamily: "monospace",
              color: COLORS.gold,
              background: COLORS.goldF,
              border: `1px solid ${COLORS.goldD}`,
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            RETRY
          </button>
        )}
      </div>
    );
  }

  // ── Minimal variant ──
  if (variant === "minimal") {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => (
          <GoldDot key={i} i={i} />
        ))}
      </div>
    );
  }

  // ── Card / Full variant ──
  return (
    <div
      style={{
        position: "relative",
        height,
        background: COLORS.bg2,
        border: `1px solid ${COLORS.border}`,
        borderRadius: variant === "full" ? 0 : 8,
        overflow: "hidden",
        animation: `__pulse_border 3s ease-in-out infinite`,
        display: "flex",
        flexDirection: "column",
        padding: 28,
        gap: 16,
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
          opacity: 0.18,
          animation: `__scan 3s linear infinite`,
          pointerEvents: "none",
        }}
      />

      {/* Corner marks */}
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (pos) => (
          <CornerMark key={pos} pos={pos} />
        ),
      )}

      {/* Skeleton rows */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Avatar circle */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.bg3}, rgba(201,168,76,0.08))`,
            backgroundSize: "200% 100%",
            animation: `__shimmer 2.2s ease-in-out 0.1s infinite`,
            flexShrink: 0,
          }}
        />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
        >
          <ShimmerBar w="55%" h={10} delay={0.05} />
          <ShimmerBar w="35%" h={8} delay={0.15} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          marginTop: 4,
        }}
      >
        <ShimmerBar w="100%" h={11} delay={0.0} />
        <ShimmerBar w="92%" h={11} delay={0.08} />
        <ShimmerBar w="76%" h={11} delay={0.16} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              height: 64,
              borderRadius: 6,
              background: `linear-gradient(90deg, ${COLORS.bg3} 0%, rgba(201,168,76,0.05) 50%, ${COLORS.bg3} 100%)`,
              backgroundSize: "200% 100%",
              animation: `__shimmer 2.2s ease-in-out ${i * 0.12}s infinite`,
              border: `1px solid ${COLORS.border}`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          marginTop: 4,
        }}
      >
        <ShimmerBar w="88%" h={10} delay={0.05} />
        <ShimmerBar w="65%" h={10} delay={0.13} />
      </div>

      {/* Centered loader label */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <GoldDot key={i} i={i} />
          ))}
        </div>
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: COLORS.vfaint,
            fontFamily: "'JetBrains Mono','Space Mono',monospace",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Corner bracket decoration ────────────────────────────────────────────────
function CornerMark({
  pos,
}: {
  pos: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const isTop = pos.startsWith("top");
  const isLeft = pos.endsWith("left");
  const size = 10;
  const thickness = 1;
  const offset = 8;

  return (
    <div
      style={{
        position: "absolute",
        top: isTop ? offset : "auto",
        bottom: isTop ? "auto" : offset,
        left: isLeft ? offset : "auto",
        right: isLeft ? "auto" : offset,
        width: size,
        height: size,
        borderTop: isTop ? `${thickness}px solid ${COLORS.goldD}` : "none",
        borderBottom: !isTop ? `${thickness}px solid ${COLORS.goldD}` : "none",
        borderLeft: isLeft ? `${thickness}px solid ${COLORS.goldD}` : "none",
        borderRight: !isLeft ? `${thickness}px solid ${COLORS.goldD}` : "none",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Factory: typed loading fn for next/dynamic ───────────────────────────────
export function makeLoading(
  overrides?: Partial<
    Omit<SkeletonLoadingProps, keyof DynamicOptionsLoadingProps>
  >,
) {
  return (props: DynamicOptionsLoadingProps) => (
    <LazyLoadingSkeleton {...props} {...overrides} />
  );
}

// ─── Drop-in replacements ─────────────────────────────────────────────────────
/**
 * @example
 * export const MeetingScheduler = dynamic(() => import("./MeetingScheduler"), {
 *   ssr: false,
 *   loading: schedulerLoading,
 * });
 */
export const schedulerLoading = makeLoading({
  label: "Loading Scheduler",
  height: 400,
  variant: "card",
});

export const contactLoading = makeLoading({
  label: "Loading Contact",
  height: 400,
  variant: "card",
});
