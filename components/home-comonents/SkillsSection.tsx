"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { COLORS, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Card3D, Chip } from "./shared";

export default function SkillsSection() {
  const skillsRef = useRef<HTMLElement>(null);
  const visible = useInView(skillsRef as React.RefObject<Element>, 0.1);
  const [skillTab, setSkillTab] = useState(0);
  const [barsOn, setBarsOn] = useState(false);

  useEffect(() => {
    if (visible) setBarsOn(true);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    gsap.fromTo(
      ".skill-item",
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.04, duration: 0.5, ease: "back.out(1.4)" },
    );
  }, [skillTab, visible]);

  const cat = PROFILE_DATA.skills[skillTab]!;

  return (
    <section
      ref={skillsRef}
      id="skills"
      style={{ padding: "120px 0", background: COLORS.bg2 }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="03">Technical Arsenal</SLabel>
        <SH l1="Deep stack." l2="Not full stack." />

        {/* Tab bar using Chip */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
          {PROFILE_DATA.skills.map((s, i) => (
            <Chip
              key={s.cat}
              active={skillTab === i}
              color={s.color ?? COLORS.gold}
              onClick={() => setSkillTab(i)}
            >
              {s.cat}
            </Chip>
          ))}
        </div>

        {/* Skill grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={skillTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 10,
            }}
          >
            {cat.items.map((sk, i) => (
              <motion.div
                key={sk.name}
                className="skill-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card3D
                  variant="skill"
                  accentColor={cat.color}
                  tiltDeg={9}
                  padding="16px 20px"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: COLORS.dim, fontWeight: 400 }}>
                      {sk.name}
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 10,
                        color: cat.color ?? COLORS.gold,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {sk.level}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{ height: 3, background: COLORS.ghost, overflow: "hidden", borderRadius: 2 }}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={barsOn ? { scaleX: sk.level / 100 } : { scaleX: 0 }}
                      transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: cat.color ?? COLORS.goldG,
                        transformOrigin: "left",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
