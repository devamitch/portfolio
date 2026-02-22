"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(80px,10vw,140px) 0",
        background: COLORS.bg2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 50%,${COLORS.goldF} 0%,transparent 80%)`,
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
        <SLabel num="07">How I Work</SLabel>
        <SH l1="The process." l2="No black boxes." />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {PROFILE_DATA.process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.09, ease: EASE_X }}
            >
              <div
                style={{
                  padding: "clamp(24px,3vw,36px)",
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.card,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 16,
                    fontSize: 80,
                    fontFamily: HN,
                    fontWeight: 900,
                    color: `${step.color}0C`,
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.step}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: step.color,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  Step {step.step} · {step.duration}
                </div>
                <h3
                  style={{
                    fontSize: "clamp(18px,2.2vw,22px)",
                    fontWeight: 800,
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                    fontFamily: HN,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: COLORS.faint, fontSize: 14, lineHeight: 1.7 }}>
                  {step.desc}
                </p>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg,transparent,${step.color}44,transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
