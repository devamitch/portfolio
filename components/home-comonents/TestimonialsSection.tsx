"use client";

import { motion } from "framer-motion";
import { COLORS, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Badge, TiltCard } from "./shared";

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
            >
              <TiltCard style={{ height: "100%", position: "relative" }}>
                <div
                  style={{
                    padding: 32,
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.card,
                    position: "relative",
                    overflow: "hidden",
                    borderTop: `3px solid ${t.col}`,
                    height: "100%",
                  }}
                >
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
                  <div
                    style={{
                      fontSize: 56,
                      color: "rgba(255,255,255,.035)",
                      position: "absolute",
                      top: 18,
                      right: 22,
                      lineHeight: 1,
                      fontFamily: "Georgia",
                      userSelect: "none",
                    }}
                  >
                    &ldquo;
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: COLORS.dim,
                      lineHeight: 1.85,
                      fontWeight: 300,
                      marginBottom: 24,
                    }}
                  >
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      borderTop: `1px solid ${COLORS.border}`,
                      paddingTop: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: `${t.col}18`,
                        border: `1px solid ${t.col}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{ fontSize: 18, fontWeight: 700, color: t.col }}
                      >
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <a
                        href={t.li}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: COLORS.text,
                          textDecoration: "none",
                          transition: "color .2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = COLORS.gold)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = COLORS.text)
                        }
                      >
                        {t.name}
                      </a>
                      <div
                        style={{ fontSize: 10, color: COLORS.faint, marginTop: 2 }}
                      >
                        {t.role}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: t.col,
                          fontFamily: MONO,
                          marginTop: 3,
                          opacity: 0.85,
                        }}
                      >
                        {t.rel} · {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
