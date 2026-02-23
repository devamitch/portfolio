"use client";

import { MapPin, Wifi, GraduationCap, User2, BarChart3 } from "lucide-react";
import { COLORS, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Card3D, IconBox, StatCard } from "./shared";

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 0", background: COLORS.bg2 }}>
      <style>{`
        @media (max-width: 900px) {
          .bento-outer { grid-template-columns: 1fr !important; }
          .bento-cell  { grid-column: unset !important; grid-row: unset !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="00">About</SLabel>
        <SH l1="Architect first." l2="Engineer always." />

        <div
          className="bento-outer"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gridTemplateRows: "auto auto",
            gap: 12,
          }}
        >
          {/* Big bio — 8 cols */}
          <div
            className="bento-cell"
            style={{ gridColumn: "1/9", gridRow: "1" }}
          >
            <Card3D
              variant="gold"
              topBar
              tiltDeg={7}
              padding="36px 40px"
              style={{ height: "100%", position: "relative", overflow: "hidden" }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                <IconBox icon={<User2 size={14} color={COLORS.gold} />} variant="gold" size={30} />
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.gold,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                  }}
                >
                  Who I Am
                </div>
              </div>
              <p
                style={{
                  fontSize: "clamp(15px,2vw,18px)",
                  color: COLORS.dim,
                  lineHeight: 1.8,
                  fontWeight: 300,
                  maxWidth: 640,
                }}
              >
                8+ years engineering 0-to-1 systems across{" "}
                <span style={{ color: COLORS.gold }}>
                  React Native, AI/ML, and Web3
                </span>
                . Every architecture I build reaches production. Every team I lead
                ships. I don't just write code — I own outcomes.
              </p>
              {/* Watermark */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: 24,
                  fontSize: 140,
                  fontWeight: 900,
                  color: "rgba(201,168,76,.04)",
                  lineHeight: 1,
                  fontFamily: HN,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                8+
              </div>
            </Card3D>
          </div>

          {/* Stats 2-pack — 4 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "9/13",
              gridRow: "1",
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              { n: "18+", l: "Production Apps", sub: "iOS, Android, Web" },
              { n: "50K+", l: "Active Users", sub: "Peak daily usage" },
            ].map((s) => (
              <StatCard
                key={s.n}
                value={s.n}
                label={s.l}
                sub={s.sub}
                color={COLORS.gold}
                style={{ padding: "24px 28px" }}
              />
            ))}
          </div>

          {/* Approach — 5 cols */}
          <div
            className="bento-cell"
            style={{ gridColumn: "1/6", gridRow: "2" }}
          >
            <Card3D variant="default" tiltDeg={8} padding="28px 32px" style={{ height: "100%" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <IconBox icon={<BarChart3 size={13} color={COLORS.gold} />} variant="gold" size={26} />
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.gold,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                  }}
                >
                  Approach
                </div>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: COLORS.dim,
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                I build systems that outlast the hype. Before AI could write a
                line of code, I was shipping production apps. My decisions are
                driven by outcomes, not trend cycles.
              </p>
            </Card3D>
          </div>

          {/* Location — 3 cols */}
          <div
            className="bento-cell"
            style={{ gridColumn: "6/9", gridRow: "2" }}
          >
            <Card3D variant="default" tiltDeg={10} padding="28px 28px" style={{ height: "100%" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
                <IconBox icon={<MapPin size={13} color={COLORS.gold} />} variant="gold" size={26} />
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.gold,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                  }}
                >
                  Location
                </div>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: COLORS.text,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                  fontFamily: HN,
                }}
              >
                Kolkata, India
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Wifi size={12} color={COLORS.green} />
                <span
                  style={{
                    fontSize: 11,
                    color: COLORS.green,
                    fontFamily: MONO,
                    letterSpacing: "0.12em",
                  }}
                >
                  Remote Worldwide
                </span>
              </div>
            </Card3D>
          </div>

          {/* Education — 4 cols */}
          <div
            className="bento-cell"
            style={{ gridColumn: "9/13", gridRow: "2" }}
          >
            <Card3D variant="default" tiltDeg={9} padding="28px 28px" style={{ height: "100%" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
                <IconBox icon={<GraduationCap size={13} color={COLORS.gold} />} variant="gold" size={26} />
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.gold,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                  }}
                >
                  Education
                </div>
              </div>
              {PROFILE_DATA.education.map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: i === 0 ? 12 : 0,
                    paddingBottom: i === 0 ? 12 : 0,
                    borderBottom: i === 0 ? `1px solid ${COLORS.border}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: COLORS.text,
                      letterSpacing: "-0.01em",
                      fontFamily: HN,
                    }}
                  >
                    {e.degree}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.dim, marginTop: 2 }}>
                    {e.school}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: COLORS.vfaint,
                      fontFamily: MONO,
                      marginTop: 3,
                    }}
                  >
                    {e.period}{e.gpa ? ` · ${e.gpa}` : ""}
                  </div>
                </div>
              ))}
            </Card3D>
          </div>
        </div>
      </div>
    </section>
  );
}
