"use client";

import { COLORS, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { Div, SH, SLabel } from "../ui/SectionsComponents";

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 0", background: COLORS.bg2 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="00">About</SLabel>
        <SH l1="Architect first." l2="Engineer always." />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gridTemplateRows: "auto auto",
            gap: 12,
          }}
          className="bento-outer"
        >
          {/* Big bio — 8 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "1/9",
              gridRow: "1",
              border: `1px solid ${COLORS.border}`,
              background: COLORS.card,
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: COLORS.goldG,
              }}
            />
            <div
              style={{
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 18,
              }}
            >
              Who I Am
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
            <div
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
              }}
            >
              8+
            </div>
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
              <div
                key={s.n}
                style={{
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.card,
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(32px,4vw,48px)",
                    fontWeight: 900,
                    color: COLORS.gold,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 4,
                    fontFamily: HN,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: 13, color: COLORS.dim, fontWeight: 600 }}>
                  {s.l}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: COLORS.vfaint,
                    fontFamily: MONO,
                    marginTop: 2,
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Approach — 5 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "1/6",
              gridRow: "2",
              border: `1px solid ${COLORS.border}`,
              background: COLORS.card,
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 12,
              }}
            >
              Approach
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
          </div>

          {/* Location — 3 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "6/9",
              gridRow: "2",
              border: `1px solid ${COLORS.border}`,
              background: COLORS.card,
              padding: "28px 28px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 18,
              }}
            >
              Location
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
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: COLORS.green,
                  display: "inline-block",
                  animation: "ac-pulse 2s infinite",
                }}
              />
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
          </div>

          {/* Education — 4 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "9/13",
              gridRow: "2",
              border: `1px solid ${COLORS.border}`,
              background: COLORS.card,
              padding: "28px 28px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: COLORS.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 18,
              }}
            >
              Education
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
                  {e.period}
                  {e.gpa ? ` · ${e.gpa}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
