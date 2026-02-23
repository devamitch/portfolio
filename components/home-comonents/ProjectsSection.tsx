"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";

/* ── ProjectCard ──────────────────────────────────── */
function ProjectCard({
  p,
  i,
}: {
  p: (typeof PROFILE_DATA.projects)[0];
  i: number;
}) {
  const [hov, setHov] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 300, damping: 25 });
  const sry = useSpring(ry, { stiffness: 300, damping: 25 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * 10);
    ry.set(-((e.clientX - r.left) / r.width - 0.5) * 10);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06, duration: 0.8, ease: EASE_X }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        rx.set(0);
        ry.set(0);
      }}
    >
      <div
        style={{
          border: `1px solid ${hov ? "rgba(201,168,76,.5)" : p.featured ? "rgba(201,168,76,.18)" : COLORS.border}`,
          background: p.featured
            ? "linear-gradient(135deg,rgba(201,168,76,.05) 0%,transparent 55%)"
            : COLORS.card,
          padding: p.featured ? 32 : 26,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "border-color .3s,box-shadow .3s",
          boxShadow: hov
            ? `0 24px 60px rgba(0,0,0,.3),0 0 0 1px ${p.color}20`
            : "none",
        }}
      >
        <motion.div
          animate={{ scaleY: hov ? 1 : 0.3 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 2,
            background: p.color || COLORS.gold,
            transformOrigin: "top",
          }}
        />
        <div style={{ paddingLeft: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: p.color,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                {p.badge}
              </div>
              <h3
                style={{
                  fontSize: p.featured ? 24 : 19,
                  fontWeight: 900,
                  margin: 0,
                  color: hov ? COLORS.gold : COLORS.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  fontFamily: HN,
                  transition: "color .2s",
                }}
              >
                {p.name}
              </h3>
            </div>
            {p.featured && (
              <span
                style={{
                  fontSize: 8,
                  padding: "4px 9px",
                  background: COLORS.goldF,
                  border: `1px solid ${COLORS.goldD}`,
                  color: COLORS.gold,
                  fontFamily: MONO,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                FEATURED
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 10,
              color: COLORS.vfaint,
              fontFamily: MONO,
              marginBottom: 10,
              letterSpacing: "0.08em",
            }}
          >
            {p.role}
          </div>
          {p.tagline && (
            <div
              style={{
                fontSize: 13,
                color: COLORS.gold,
                fontStyle: "italic",
                marginBottom: 12,
                fontWeight: 300,
              }}
            >
              &ldquo;{p.tagline}&rdquo;
            </div>
          )}
          <p
            style={{
              fontSize: 13,
              color: COLORS.dim,
              lineHeight: 1.75,
              marginBottom: 18,
              fontWeight: 300,
            }}
          >
            {p.desc}
          </p>
          <div
            style={{
              padding: "10px 14px",
              borderLeft: `2px solid ${COLORS.goldD}`,
              background: "rgba(201,168,76,.025)",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: COLORS.gold,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 7,
              }}
            >
              Impact
            </div>
            {p.impact.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 12,
                  color: COLORS.dim,
                  marginBottom: 3,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: p.color || COLORS.gold,
                    flexShrink: 0,
                    fontSize: 10,
                  }}
                >
                  →
                </span>
                {item}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 12,
            }}
          >
            {p.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 8,
                  padding: "3px 8px",
                  border: `1px solid ${hov ? "rgba(201,168,76,.22)" : COLORS.border}`,
                  color: hov ? "rgba(201,168,76,.7)" : COLORS.vfaint,
                  fontFamily: MONO,
                  transition: "all .2s",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {"link" in p && (p as any).link && (
            <a
              href={(p as any).link}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 10,
                color: "rgba(201,168,76,.55)",
                fontFamily: MONO,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.gold)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(201,168,76,.55)")
              }
            >
              View Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── ProjectsSection ──────────────────────────────── */
export default function ProjectsSection() {
  const featured = PROFILE_DATA.projects.filter((p) => p.featured);
  const rest = PROFILE_DATA.projects.filter((p) => !p.featured);
  return (
    <section id="work" style={{ padding: "120px 0", background: COLORS.bg }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="01">Executive Portfolio</SLabel>
        <SH l1="Building systems" l2="that actually scale." />
        <p
          style={{
            fontSize: 18,
            color: COLORS.dim,
            maxWidth: 540,
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: 60,
          }}
        >
          From AI-powered HealthTech to Indigenous community platforms. Every
          project architected to VP-level standards.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
            gap: 18,
            marginBottom: 18,
          }}
        >
          {featured.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
            gap: 14,
          }}
        >
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i + featured.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
