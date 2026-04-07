"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { SH, SLabel } from "../ui/SectionsComponents";

/* ── types ──────────────────────────────────────────────── */
type Project = (typeof PROFILE_DATA.projects)[number];

/* ── ProjectCard — clean, no tilt ──────────────────────── */
function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [hov, setHov] = useState(false);

  const year = "year" in p ? (p as any).year : null;
  const platform = "platform" in p ? (p as any).platform : null;
  const category = "category" in p ? (p as any).category : (p as any).badge;
  const types: string[] = "types" in p ? (p as any).types : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06, duration: 0.8, ease: EASE_X }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          border: `1px solid ${hov ? "rgba(201,168,76,.5)" : p.featured ? "rgba(201,168,76,.18)" : COLORS.border}`,
          background: p.featured
            ? "linear-gradient(135deg,rgba(201,168,76,.05) 0%,transparent 55%)"
            : COLORS.card,
          padding: 32,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "border-color .3s, box-shadow .3s",
          boxShadow: hov
            ? `0 24px 60px rgba(0,0,0,.3), 0 0 0 1px ${p.color}20`
            : "none",
        }}
      >
        {/* left accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 2,
            background: p.color || COLORS.gold,
            transformOrigin: "top",
            transform: `scaleY(${hov ? 1 : 0.3})`,
            transition: "transform .3s",
          }}
        />

        <div style={{ paddingLeft: 12 }}>
          {/* Row 1 — platform pill + year */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {"icon" in p && (p as any).icon && (
                <div style={{ borderRadius: 6, overflow: "hidden", display: "flex" }}>
                  <Image src={(p as any).icon} alt={p.name} width={28} height={28} />
                </div>
              )}
              {platform && (
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: MONO,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: p.color,
                    border: `1px solid ${p.color}44`,
                    background: `${p.color}10`,
                    padding: "3px 10px",
                    borderRadius: 100,
                  }}
                >
                  {platform}
                </span>
              )}
            </div>
            {year && (
              <span
                style={{
                  fontSize: 9,
                  fontFamily: MONO,
                  color: COLORS.vfaint,
                  letterSpacing: "0.12em",
                }}
              >
                {year}
              </span>
            )}
          </div>

          {/* Row 2 — category */}
          <div
            style={{
              fontSize: 8,
              color: COLORS.vfaint,
              fontFamily: MONO,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {category}
          </div>

          {/* Row 3 — project name */}
          <h3
            style={{
              fontSize: 22,
              fontWeight: 900,
              margin: "0 0 16px",
              color: hov ? COLORS.gold : COLORS.text,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              fontFamily: HN,
              transition: "color .2s",
            }}
          >
            {p.name}
          </h3>

          {/* Row 4 — description */}
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

          {/* Row 5 — types chips */}
          {types.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 18,
              }}
            >
              {types.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 9,
                    padding: "4px 10px",
                    border: `1px solid ${hov ? p.color + "55" : COLORS.border}`,
                    color: hov ? p.color : COLORS.faint,
                    fontFamily: MONO,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    transition: "all .2s",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Row 6 — live link */}
          {"link" in p && (p as any).link && (
            <a
              href={(p as any).link}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 10,
                color: hov ? COLORS.gold : "rgba(201,168,76,.55)",
                fontFamily: MONO,
                textDecoration: "none",
                letterSpacing: "0.08em",
                transition: "color .2s",
              }}
            >
              View Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── ProjectsSection ────────────────────────────────────── */
export default function ProjectsSection() {
  const [ctaHov, setCtaHov] = useState(false);
  const featured = PROFILE_DATA.projects.filter((p) => p.featured);

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
          From AI-powered movement intelligence to family operating systems.
          Every project architected to VP-level standards.
        </p>

        {/* Featured grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
            gap: 18,
            marginBottom: 52,
          }}
        >
          {featured.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>

        {/* View All Projects CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href="https://projectscopes.devamit.co.in"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 36px",
              background: ctaHov ? COLORS.goldG : "transparent",
              border: `1px solid ${ctaHov ? "transparent" : "rgba(201,168,76,.35)"}`,
              color: ctaHov ? COLORS.bg : COLORS.gold,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all .25s cubic-bezier(.16,1,.3,1)",
              boxShadow: ctaHov
                ? "0 0 40px rgba(201,168,76,.25), 0 0 80px rgba(201,168,76,.1)"
                : "none",
            }}
          >
            View All Projects
            <span style={{ fontSize: 14 }}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
