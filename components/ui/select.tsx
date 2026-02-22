"use client";

import React from "react";

const MONO = "'JetBrains Mono','Space Mono',monospace";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, style, onFocus, onBlur, children, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);

    const borderColor = error
      ? "rgba(255,60,60,0.5)"
      : focused
      ? "rgba(201,168,76,0.45)"
      : "rgba(255,255,255,0.07)";

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <select
          ref={ref}
          style={{
            width: "100%",
            padding: "12px 36px 12px 14px",
            fontSize: 13,
            fontFamily: "inherit",
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${borderColor}`,
            color: "#FFFFFF",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
            borderRadius: 0,
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
        >
          {children}
        </select>
        {/* chevron */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "rgba(201,168,76,0.6)",
            fontSize: 10,
          }}
        >
          ▾
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
