"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "gold";
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "default", error, style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const borderColor = error
      ? "rgba(255,60,60,0.5)"
      : focused
      ? variant === "gold"
        ? "rgba(201,168,76,0.55)"
        : "rgba(201,168,76,0.38)"
      : "rgba(255,255,255,0.07)";

    const boxShadow = focused
      ? error
        ? "0 0 0 3px rgba(255,60,60,0.08)"
        : "0 0 0 3px rgba(201,168,76,0.07)"
      : "none";

    return (
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 13,
          fontFamily: "inherit",
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${borderColor}`,
          color: "#FFFFFF",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
          borderRadius: 0,
          boxShadow,
          ...style,
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
