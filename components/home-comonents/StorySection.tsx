"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";

export default function StorySection() {
  const storyRef = useRef<HTMLElement>(null);
  const visible = useInView(storyRef as React.RefObject<Element>, 0.1);

  return (
    <section
      ref={storyRef}
      id="story"
      style={{ padding: "120px 0", background: COLORS.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="04">Eight Years. No Shortcuts.</SLabel>
        <SH l1="From government portals" l2="to AI-powered systems." />
        <div style={{ position: "relative" }}>
          <div
            className="story-spine"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              background: `linear-gradient(to bottom,transparent,${COLORS.goldD},transparent)`,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
            {PROFILE_DATA.story.map((ch, i) => (
              <motion.div
                key={ch.yr}
                className="story-item"
                initial={{ opacity: 0, y: 40 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, delay: i * 0.1, ease: EASE_X }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 48,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    textAlign: i % 2 === 0 ? "right" : "left",
                    order: i % 2 === 0 ? 1 : 2,
                    paddingRight: i % 2 === 0 ? 36 : 0,
                    paddingLeft: i % 2 !== 0 ? 36 : 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      color: "rgba(201,168,76,.06)",
                      fontFamily: MONO,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {ch.yr}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: ch.color,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {ch.icon} — {ch.yr}
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: COLORS.text,
                      marginBottom: 10,
                      letterSpacing: "-0.02em",
                      fontFamily: HN,
                    }}
                  >
                    {ch.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: COLORS.dim,
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {ch.text}
                  </p>
                </div>
                <div style={{ order: i % 2 === 0 ? 2 : 1, position: "relative" }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={visible ? { scale: 1 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: i * 0.1 + 0.1,
                    }}
                    style={{
                      position: "absolute",
                      left: i % 2 === 0 ? -9 : "auto",
                      right: i % 2 !== 0 ? -9 : "auto",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: ch.color,
                      border: `3px solid ${COLORS.bg}`,
                      zIndex: 10,
                      boxShadow: `0 0 12px ${ch.color}80`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
