"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { COLORS, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";

/* ── ContribGraph ─────────────────────────────────── */
function ContribGraph() {
  const data = useMemo(
    () =>
      Array.from({ length: 53 }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => {
          const s = ((w * 7 + d) * 2654435761) >>> 0;
          return (s % 100) / 100 > (d === 0 || d === 6 ? 0.3 : 0.65)
            ? 0
            : Math.floor(s % 5);
        }),
      ),
    [],
  );
  const cols = [
    "rgba(201,168,76,.07)",
    "rgba(201,168,76,.22)",
    "rgba(201,168,76,.42)",
    "rgba(201,168,76,.68)",
    "rgba(201,168,76,.95)",
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 680 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {data.map((wk, wi) => (
            <div
              key={wi}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {wk.map((lv, di) => (
                <motion.div
                  key={di}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (wi * 7 + di) * 0.0003, duration: 0.15 }}
                  whileHover={{ scale: 1.6 }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: cols[lv],
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span
            style={{ fontSize: 9, color: "rgba(201,168,76,.45)", fontFamily: MONO }}
          >
            Less
          </span>
          {cols.map((c, i) => (
            <div
              key={i}
              style={{ width: 10, height: 10, borderRadius: 2, background: c }}
            />
          ))}
          <span
            style={{ fontSize: 9, color: "rgba(201,168,76,.45)", fontFamily: MONO }}
          >
            More
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── GitHubSection ────────────────────────────────── */
export default function GitHubSection() {
  return (
    <section id="github" style={{ padding: "80px 0", background: COLORS.bg2 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel>Open Source</SLabel>
        <SH
          l1="Shipping code."
          l2="Every. Single. Day."
          size="clamp(32px,4vw,56px)"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: 28,
            border: `1px solid rgba(201,168,76,.15)`,
            background: "rgba(201,168,76,.025)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(201,168,76,.7)",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  marginBottom: 4,
                }}
              >
                GitHub Activity
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: COLORS.text,
                  letterSpacing: "-0.03em",
                  fontFamily: HN,
                }}
              >
                2,029 <span style={{ color: COLORS.gold }}>contributions</span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: COLORS.vfaint,
                  marginTop: 3,
                  fontFamily: MONO,
                }}
              >
                Last 12 months · Mostly private repos
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { l: "Primary", u: PROFILE_DATA.github, s: "devamitch" },
                { l: "Archive", u: PROFILE_DATA.githubAlt, s: "techamit95ch" },
              ].map((g) => (
                <a
                  key={g.u}
                  href={g.u}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${COLORS.border}`,
                    textDecoration: "none",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = COLORS.goldD)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = COLORS.border)
                  }
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                    {g.l}
                  </div>
                  <div
                    style={{ fontSize: 9, fontFamily: MONO, color: COLORS.vfaint }}
                  >
                    {g.s} ↗
                  </div>
                </a>
              ))}
            </div>
          </div>
          <ContribGraph />
        </motion.div>
      </div>
    </section>
  );
}
