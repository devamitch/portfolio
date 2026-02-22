"use client";

import React from "react";

const MONO = "'JetBrains Mono','Space Mono',monospace";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  variant?: "default" | "outline" | "solid";
}

export function Badge({
  color = "#C9A84C",
  variant = "outline",
  style,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: React.CSSProperties =
    variant === "solid"
      ? { background: color, color: "#000", border: "none" }
      : variant === "outline"
      ? {
          background: `${color}0D`,
          border: `1px solid ${color}44`,
          color,
        }
      : {
          background: `${color}0D`,
          border: `1px solid ${color}44`,
          color,
        };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: MONO,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "3px 8px",
        whiteSpace: "nowrap",
        lineHeight: 1.4,
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
