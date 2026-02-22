"use client";

import React from "react";

const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";

/* ── Card ────────────────────────────────────────────────────── */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "featured";
  glow?: boolean;
}

export function Card({
  variant = "default",
  glow = false,
  style,
  children,
  ...props
}: CardProps) {
  const [hovered, setHovered] = React.useState(false);

  const variantStyles: React.CSSProperties =
    variant === "gold"
      ? {
          background:
            "linear-gradient(135deg,rgba(201,168,76,0.05) 0%,transparent 55%)",
          border: `1px solid rgba(201,168,76,0.22)`,
        }
      : variant === "featured"
      ? {
          background:
            "linear-gradient(135deg,rgba(201,168,76,0.06) 0%,rgba(201,168,76,0.01) 100%)",
          border: `1px solid rgba(201,168,76,0.28)`,
          borderTop: `2px solid #C9A84C`,
        }
      : {
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
        };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s",
        boxShadow:
          glow && hovered
            ? "0 24px 60px rgba(0,0,0,0.3),0 0 0 1px rgba(201,168,76,0.12)"
            : "none",
        ...variantStyles,
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── CardHeader ───────────────────────────────────────────────── */
export function CardHeader({
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        padding: "24px 28px 0",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── CardTitle ───────────────────────────────────────────────── */
export function CardTitle({
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      style={{
        fontFamily: HN,
        fontSize: 20,
        fontWeight: 800,
        color: "#FFFFFF",
        letterSpacing: "-0.025em",
        lineHeight: 1.2,
        margin: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  );
}

/* ── CardDescription ─────────────────────────────────────────── */
export function CardDescription({
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      style={{
        fontFamily: MONO,
        fontSize: 10,
        color: "rgba(255,255,255,0.38)",
        letterSpacing: "0.12em",
        lineHeight: 1.6,
        margin: 0,
        textTransform: "uppercase",
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}

/* ── CardContent ─────────────────────────────────────────────── */
export function CardContent({
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        padding: "20px 28px 28px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── CardFooter ──────────────────────────────────────────────── */
export function CardFooter({
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        padding: "16px 28px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
