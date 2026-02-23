"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Badge, Card3D, ExpandIcon } from "./shared";

export default function ExperienceSection() {
  const expRef = useRef<HTMLElement>(null);
  const visible = useInView(expRef as React.RefObject<Element>, 0.08);
  const [expanded, setExpanded] = useState<string | null>("synapsis");
  const [hovExp, setHovExp] = useState<number | null>(null);

  return (
    <section
      ref={expRef}
      id="experience"
      style={{ padding: "120px 0", background: COLORS.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="02">Career Timeline</SLabel>
        <SH l1="3 companies." l2="8+ years. Zero shortcuts." />

        <div style={{ position: "relative" }}>
          {/* Timeline spine */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 8,
              width: 1,
              height: "100%",
              background: `linear-gradient(180deg,${COLORS.gold},${COLORS.border} 70%,transparent)`,
            }}
          />

          {PROFILE_DATA.experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -36 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.14, ease: EASE_X }}
              onMouseEnter={() => setHovExp(i)}
              onMouseLeave={() => setHovExp(null)}
              style={{ paddingLeft: 56, marginBottom: 24, position: "relative" }}
            >
              {/* Timeline dot */}
              <div
                style={{
                  position: "absolute",
                  left: 13,
                  top: 28,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `2px solid ${exp.color}`,
                  background: expanded === exp.id ? exp.color : COLORS.bg,
                  transition: "background .3s",
                  zIndex: 1,
                  boxShadow: expanded === exp.id ? `0 0 12px ${exp.color}66` : "none",
                }}
              />

              <Card3D
                variant="default"
                accentColor={exp.color}
                tilt={false}
                hoverLift={false}
                padding={0}
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                style={{
                  cursor: "pointer",
                  border: `1px solid ${expanded === exp.id ? exp.color + "44" : COLORS.border}`,
                  transition: "border-color .4s, box-shadow .3s",
                  boxShadow: hovExp === i
                    ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${exp.color}20`
                    : "0 2px 12px rgba(0,0,0,0.2)",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "clamp(20px,3vw,28px)",
                    display: "flex",
                    gap: 20,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Badge color={exp.color}>{exp.badge}</Badge>
                      <Badge color={exp.color}>{exp.type}</Badge>
                      {exp.status === "Delivered & Closed" && (
                        <Badge color={COLORS.green}>{exp.status}</Badge>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: "clamp(18px,2.5vw,24px)",
                        fontWeight: 800,
                        marginBottom: 6,
                        letterSpacing: "-0.025em",
                        fontFamily: HN,
                        color: hovExp === i ? COLORS.gold : COLORS.text,
                        transition: "color .25s",
                      }}
                    >
                      {exp.company}
                    </h3>
                    <div style={{ color: COLORS.faint, fontSize: 14, marginBottom: 8 }}>
                      {exp.role}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 10,
                        color: COLORS.vfaint,
                        display: "flex",
                        gap: 14,
                        flexWrap: "wrap",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <span>{exp.period}</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <ExpandIcon open={expanded === exp.id} color={exp.color} />
                </div>

                {/* Expanded content */}
                {expanded === exp.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      style={{
                        padding: `0 clamp(20px,3vw,28px) clamp(20px,3vw,28px)`,
                        borderTop: `1px solid ${COLORS.border}`,
                        paddingTop: 20,
                      }}
                    >
                      {/* Metrics */}
                      {exp.metrics.length > 0 && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))",
                            gap: 10,
                            marginBottom: 20,
                          }}
                        >
                          {exp.metrics.map((m, mi) => (
                            <Card3D
                              key={mi}
                              variant="stat"
                              accentColor={exp.color}
                              tiltDeg={8}
                              padding="12px 16px"
                              style={{
                                background: `${exp.color}10`,
                                border: `1px solid ${exp.color}22`,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 18,
                                  fontWeight: 800,
                                  color: exp.color,
                                  fontFamily: HN,
                                }}
                              >
                                {m.value}{" "}
                                <span style={{ fontSize: 11 }}>{m.unit}</span>
                              </div>
                              <div
                                style={{
                                  fontFamily: MONO,
                                  fontSize: 9,
                                  color: COLORS.vfaint,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  marginTop: 4,
                                }}
                              >
                                {m.label}
                              </div>
                            </Card3D>
                          ))}
                        </div>
                      )}

                      {/* Highlights */}
                      {exp.highlights.map((pt, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                            marginBottom: 14,
                          }}
                        >
                          <ArrowRight
                            size={13}
                            color={exp.color}
                            style={{ flexShrink: 0, marginTop: 3 }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: COLORS.dim,
                              lineHeight: 1.7,
                              fontWeight: 300,
                            }}
                          >
                            {pt}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
