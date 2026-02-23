"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { COLORS, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Badge, Card3D } from "./shared";

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      style={{ padding: "120px 0", background: COLORS.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel>What Leaders Say</SLabel>
        <SH l1="Leaders endorse me." l2="Teams grow under me." />
        <p
          style={{
            fontSize: 13,
            color: COLORS.dim,
            marginBottom: 56,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          Ordered by seniority — from direct manager to mentored developers.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 18,
          }}
        >
          {PROFILE_DATA.testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ height: "100%" }}
            >
              <Card3D
                variant="testimonial"
                accentColor={t.col}
                tiltDeg={9}
                padding={32}
                style={{ height: "100%", position: "relative", overflow: "hidden" }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <Badge color={t.col}>{t.seniority}</Badge>
                  <span
                    style={{ fontFamily: MONO, fontSize: 9, color: COLORS.vfaint }}
                  >
                    {t.date}
                  </span>
                </div>

                {/* Quote icon */}
                <Quote
                  size={40}
                  color={COLORS.border}
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 22,
                    opacity: 0.3,
                    pointerEvents: "none",
                  }}
                />

                {/* Quote text */}
                <p
                  style={{
                    fontSize: 14,
                    color: COLORS.dim,
                    lineHeight: 1.75,
                    fontStyle: "italic",
                    marginBottom: 22,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  "{t.quote}"
                </p>

                {/* Author */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingTop: 18,
                    borderTop: `1px solid ${COLORS.border}`,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: `${t.col}20`,
                      border: `1.5px solid ${t.col}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontWeight: 800,
                      fontSize: 14,
                      color: t.col,
                      fontFamily: "inherit",
                      boxShadow: `0 0 12px ${t.col}22`,
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: COLORS.text,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: COLORS.vfaint,
                        fontFamily: MONO,
                        marginTop: 2,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {t.title}
                    </div>
                  </div>
                  {t.linkedin && (
                    <a
                      href={t.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        marginLeft: "auto",
                        fontSize: 10,
                        color: COLORS.vfaint,
                        fontFamily: MONO,
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = COLORS.gold)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = COLORS.vfaint)
                      }
                    >
                      LI ↗
                    </a>
                  )}
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
