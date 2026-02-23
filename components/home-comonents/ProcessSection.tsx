"use client";

import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FlaskConical,
  Handshake,
  Layers,
  MessageSquare,
  Rocket,
  Search,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Card3D, IconBox } from "./shared";

// Map process step index → Lucide icon
const PROCESS_ICONS = [
  Search,
  MessageSquare,
  Target,
  Layers,
  Code2,
  FlaskConical,
  CheckCircle2,
  Rocket,
  Handshake,
];

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
      {/* Ambient glow */}
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
          {PROFILE_DATA.process.map((step, i) => {
            const StepIcon = PROCESS_ICONS[i % PROCESS_ICONS.length]!;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.09, ease: EASE_X }}
              >
                <Card3D
                  variant="process"
                  accentColor={step.color}
                  topBar
                  tiltDeg={10}
                  padding="clamp(24px,3vw,36px)"
                  style={{ height: "100%", position: "relative", overflow: "hidden" }}
                >
                  {/* Watermark number */}
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
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Step number badge */}
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: step.color,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>Step {String(i + 1).padStart(2, "0")}</span>
                  </div>

                  {/* Icon */}
                  <div style={{ marginBottom: 16 }}>
                    <IconBox
                      icon={<StepIcon size={16} color={step.color} strokeWidth={2} />}
                      variant="colored"
                      color={step.color}
                      size={36}
                      shape="square"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "clamp(16px,2vw,20px)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      marginBottom: 10,
                      fontFamily: HN,
                      color: COLORS.text,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 13,
                      color: COLORS.faint,
                      lineHeight: 1.7,
                      marginBottom: 16,
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Deliverables */}
                  {step.deliverables?.map((d, di) => (
                    <div
                      key={di}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        marginBottom: 6,
                      }}
                    >
                      <ArrowRight
                        size={11}
                        color={step.color}
                        style={{ flexShrink: 0, marginTop: 3 }}
                      />
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 10,
                          color: COLORS.vfaint,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {d}
                      </span>
                    </div>
                  ))}
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
