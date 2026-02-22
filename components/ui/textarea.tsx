"use client";

import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const borderColor = error
      ? "rgba(255,60,60,0.5)"
      : focused
      ? "rgba(201,168,76,0.45)"
      : "rgba(255,255,255,0.07)";

    return (
      <textarea
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
          resize: "vertical",
          minHeight: 100,
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.07)" : "none",
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

Textarea.displayName = "Textarea";
