"use client";

import React, { useEffect, useState } from "react";

const STEPS = [
  "Collecting your information",
  "Loading portfolio data",
  "Warming up AI engine",
  "Preparing voice system",
  "Almost ready",
];

interface Props {
  isActive?: boolean;
}

export const LiquidGoldAnimation: React.FC<Props> = ({ isActive = true }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through steps
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 1400);
    return () => clearInterval(id);
  }, [isActive]);

  // Animate trailing dots
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 380);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "32px 24px",
        fontFamily: "'JetBrains Mono','Space Mono','Courier New',monospace",
      }}
    >
      {/* Spinner ring */}
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          style={{ animation: "lgSpin 1.2s linear infinite" }}
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="rgba(212,175,55,0.15)"
            strokeWidth="3"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="url(#lgGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="30 96"
          />
          <defs>
            <linearGradient id="lgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8C6218" />
              <stop offset="100%" stopColor="#FBF5B7" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D4AF37",
              boxShadow: "0 0 8px rgba(212,175,55,0.8)",
            }}
          />
        </div>
      </div>

      {/* Step label */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "rgba(212,175,55,0.85)",
          textTransform: "uppercase",
          minWidth: 220,
          textAlign: "center",
          transition: "opacity 0.3s ease",
        }}
      >
        {STEPS[stepIndex]}
        {dots}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === stepIndex ? 16 : 4,
              height: 4,
              borderRadius: 2,
              background:
                i === stepIndex
                  ? "linear-gradient(90deg,#8C6218,#D4AF37)"
                  : "rgba(212,175,55,0.2)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              boxShadow:
                i === stepIndex ? "0 0 6px rgba(212,175,55,0.5)" : "none",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes lgSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
