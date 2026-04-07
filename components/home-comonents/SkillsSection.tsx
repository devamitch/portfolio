"use client";

import { useState } from "react";
import { COLORS, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Card3D, Chip } from "./shared";

export default function SkillsSection() {
  const [skillTab, setSkillTab] = useState(0);
  const cat = PROFILE_DATA.skills[skillTab]!;

  return (
    <section id="skills" style={{ padding: "120px 0", background: COLORS.bg2 }}>
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

        {/* Skill grid - static, no animations */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 10,
          }}
        >
          {cat.items.map((sk) => (
            <div key={sk.name}>
              <Card3D
                variant="skill"
                accentColor={cat.color}
                padding="16px 20px"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
              </Card3D>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
