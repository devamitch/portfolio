"use client";
import { motion } from "framer-motion";
import { COLORS, EASE_X, HN, MONO } from "~/data/portfolio.data";

export function SLabel({ num, children }: { num?: string; children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
      }}
    >
      {num && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: "rgba(201,168,76,.4)",
            letterSpacing: "0.3em",
          }}
        >
          {num}
        </span>
      )}
      <div
        style={{ height: 1, width: 40, background: COLORS.gold, flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: COLORS.gold,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

export function SH({
  l1,
  l2,
  size = "clamp(36px,5vw,68px)",
}: {
  l1: string;
  l2?: string;
  size?: string;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_X }}
      style={{
        fontSize: size,
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 0.92,
        marginBottom: 48,
        fontFamily: HN,
        color: COLORS.text,
      }}
    >
      {l1}
      {l2 && (
        <>
          <br />
          <span style={{ color: "rgba(255,255,255,.12)" }}>{l2}</span>
        </>
      )}
    </motion.h2>
  );
}

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

export function Div() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
      <hr
        style={{
          height: 1,
          border: "none",
          opacity: 0.35,
          background:
            "linear-gradient(90deg,transparent,rgba(201,168,76,.35),transparent)",
        }}
      />
    </div>
  );
}
