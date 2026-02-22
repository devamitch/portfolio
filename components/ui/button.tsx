"use client";

import React from "react";
import { cn } from "~/lib/utils";

/* ── Design tokens (mirrors PrimaryHome palette) ───────────── */
const MONO = "'JetBrains Mono','Space Mono',monospace";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

const BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontFamily: MONO,
  fontWeight: 700,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  cursor: "pointer",
  border: "none",
  outline: "none",
  transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
  userSelect: "none",
  whiteSpace: "nowrap",
};

const VARIANTS: Record<string, React.CSSProperties> = {
  gold: {
    background: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
    color: "#000",
    boxShadow: "0 4px 16px rgba(201,168,76,0.28)",
  },
  outline: {
    background: "transparent",
    color: "#C9A84C",
    border: "1px solid rgba(201,168,76,0.45)",
  },
  ghost: {
    background: "transparent",
    color: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  destructive: {
    background: "rgba(255,60,60,0.08)",
    color: "rgba(255,100,100,0.9)",
    border: "1px solid rgba(255,60,60,0.25)",
  },
};

const SIZES: Record<string, React.CSSProperties> = {
  sm: { padding: "8px 16px", fontSize: 9 },
  md: { padding: "12px 22px", fontSize: 10 },
  lg: { padding: "17px 32px", fontSize: 11 },
  icon: {
    padding: 0,
    width: 36,
    height: 36,
    fontSize: 14,
    letterSpacing: 0,
    flexShrink: 0,
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "gold",
      size = "md",
      className,
      style,
      disabled,
      onMouseEnter,
      onMouseLeave,
      children,
      ...props
    },
    ref,
  ) => {
    const [hovered, setHovered] = React.useState(false);

    const hoverStyles: React.CSSProperties =
      !disabled && hovered
        ? variant === "gold"
          ? { boxShadow: "0 8px 28px rgba(201,168,76,0.42)", transform: "translateY(-1px)" }
          : variant === "outline"
          ? { background: "rgba(201,168,76,0.07)", boxShadow: "0 0 20px rgba(201,168,76,0.12)" }
          : variant === "ghost"
          ? { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.8)" }
          : { background: "rgba(255,60,60,0.14)" }
        : {};

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{
          ...BASE,
          ...VARIANTS[variant],
          ...SIZES[size],
          ...hoverStyles,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          ...style,
        }}
        onMouseEnter={(e) => {
          setHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
