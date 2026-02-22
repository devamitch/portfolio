"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SLabel } from "../ui/SectionsComponents";
import { Badge, GoldAccent } from "./shared";

export default function EthosSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.07);
  const ethos = PROFILE_DATA.ethos;

  return (
    <section
      id="ethos"
      ref={ref}
      style={{
        padding: "clamp(80px,10vw,140px) 0",
        position: "relative",
        overflow: "hidden",
        background: COLORS.bg2,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-10%",
          top: "10%",
          width: "55%",
          height: "80%",
          background: `radial-gradient(ellipse at 80% 50%,${COLORS.goldF} 0%,transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
        }}
      >
        <SLabel>What Defines Me</SLabel>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{ marginBottom: 48 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <h2
                style={{
                  fontFamily: HN,
                  fontSize: "clamp(28px,4.5vw,58px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.02,
                  marginBottom: 16,
                  color: COLORS.text,
                }}
              >
                Skin in the game.
                <br />
                <GoldAccent>Fight till the end.</GoldAccent>
              </h2>
              <p
                style={{
                  color: COLORS.faint,
                  fontSize: "clamp(14px,1.7vw,17px)",
                  lineHeight: 1.65,
                  maxWidth: 520,
                }}
              >
                {ethos.summary}
              </p>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: "22px 28px",
                border: `1px solid ${COLORS.goldD}`,
                background: COLORS.goldF,
              }}
            >
              <Badge color={COLORS.gold}>{ethos.badge}</Badge>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: COLORS.faint,
                  marginTop: 10,
                  letterSpacing: "0.06em",
                }}
              >
                {ethos.location}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, marginTop: 6 }}>
                <span style={{ color: COLORS.green }}>● </span>
                <span style={{ color: COLORS.green }}>{ethos.status}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 14,
            marginBottom: 48,
          }}
        >
          {ethos.metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              style={{
                border: `1px solid ${COLORS.border}`,
                background: COLORS.card,
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: HN,
                  fontSize: "clamp(22px,3vw,38px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: COLORS.gold,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: COLORS.vfaint,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </div>
              {m.unit && (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: COLORS.vfaint,
                    letterSpacing: "0.06em",
                  }}
                >
                  {m.unit}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Principles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
            gap: 14,
            marginBottom: 56,
          }}
        >
          {ethos.principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.07 }}
              style={{
                border: `1px solid ${COLORS.border}`,
                background: COLORS.card,
                padding: "22px 26px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  background: COLORS.goldF,
                  border: `1px solid ${COLORS.goldD}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: COLORS.gold,
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>
                  {p.label}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: COLORS.faint,
                    letterSpacing: "0.05em",
                    lineHeight: 1.5,
                  }}
                >
                  {p.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story quote */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.5 }}
        >
          <div
            style={{
              padding: "clamp(32px,5vw,56px)",
              background: `linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02))`,
              border: `1px solid ${COLORS.goldD}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -30,
                left: 24,
                fontSize: 180,
                lineHeight: 1,
                color: COLORS.goldD,
                fontFamily: HN,
                fontWeight: 900,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              &ldquo;
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: COLORS.gold,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                — The Founder Mindset.
              </div>
              <p
                style={{
                  fontSize: "clamp(15px,1.9vw,18px)",
                  lineHeight: 1.82,
                  color: COLORS.dim,
                  fontStyle: "italic",
                  maxWidth: 780,
                }}
              >
                {ethos.story}
              </p>
            </div>
          </div>
        </motion.div>

        {/* How I Operate */}
        <div style={{ marginTop: 40 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: COLORS.gold,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            How I Operate
          </div>
          {ethos.highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "18px 0",
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: COLORS.gold,
                  flexShrink: 0,
                  marginTop: 2,
                  letterSpacing: "0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              <p style={{ color: COLORS.faint, fontSize: 14, lineHeight: 1.65 }}>
                {h}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
