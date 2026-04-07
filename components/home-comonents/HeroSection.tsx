"use client";

import { AnimatePresence, motion } from "framer-motion";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { getYrs } from "~/lib/utils";
import ImageWithFallback from "../ui/ImageWithFallback";

/* ── HeroSection ──────────────────────────────────── */
export default function HeroSection({ roleIdx }: { roleIdx: number }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "110px 32px 80px",
        }}
      >
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${COLORS.goldD}`,
            background: COLORS.goldF,
            padding: "10px 20px",
            marginBottom: 52,
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: COLORS.gold,
              display: "inline-block",
              animation: "ac-pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: COLORS.gold,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: MONO,
              fontWeight: 600,
            }}
          >
            Available · Remote Worldwide · VP · CTO · Principal Architect
          </span>
        </motion.div>

        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr .85fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* LEFT TEXT */}
          <div>
            <div style={{ overflow: "hidden", marginBottom: 2 }}>
              <motion.div
                initial={{ y: 180 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.22, ease: EASE_X }}
                style={{
                  fontSize: "clamp(3.8rem,9.5vw,8.5rem)",
                  fontWeight: 900,
                  lineHeight: 0.86,
                  letterSpacing: "-0.04em",
                  color: COLORS.text,
                  fontFamily: HN,
                }}
              >
                {PROFILE_DATA.nameFirst}
              </motion.div>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 28 }}>
              <motion.div
                initial={{ y: 180 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.36, ease: EASE_X }}
                style={{
                  fontSize: "clamp(3.2rem,8.2vw,7.2rem)",
                  fontWeight: 800,
                  lineHeight: 0.88,
                  letterSpacing: "2px",
                  fontFamily: HN,
                  WebkitTextStroke: "2px rgba(201,168,76,.52)",
                  color: "transparent",
                }}
              >
                {PROFILE_DATA.nameLast}
              </motion.div>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 20 }}>
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.54, ease: EASE_X }}
              >
                <div
                  style={{
                    fontSize: "clamp(1rem,2vw,1.4rem)",
                    fontWeight: 300,
                    color: COLORS.dim,
                    letterSpacing: "0.02em",
                    fontFamily: MONO,
                  }}
                >
                  {PROFILE_DATA.tagline}
                </div>
              </motion.div>
            </div>

            {/* Rotating role */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 32,
                height: 40,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  height: 1,
                  width: 44,
                  background: COLORS.gold,
                  transformOrigin: "left",
                  flexShrink: 0,
                }}
              />
              <div style={{ overflow: "hidden", height: 40 }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roleIdx}
                    initial={{ y: 42, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -42, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_X }}
                    style={{
                      fontSize: 22,
                      color: COLORS.gold,
                      fontWeight: 300,
                      letterSpacing: "0.06em",
                      margin: 0,
                      fontFamily: HN,
                    }}
                  >
                    {PROFILE_DATA.roles[roleIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Manifesto */}
            <div style={{ marginBottom: 40 }}>
              {PROFILE_DATA.manifesto.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.12 }}
                  style={{
                    fontSize: 15,
                    color: i === 2 ? COLORS.gold : COLORS.dim,
                    lineHeight: 1.7,
                    marginBottom: 6,
                    fontWeight: i === 2 ? 500 : 300,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 44,
              }}
            >
              <a
                href="#work"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: COLORS.goldG,
                  color: "#000",
                  padding: "15px 30px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(201,168,76,.25)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                See My Work →
              </a>
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `2px solid ${COLORS.goldD}`,
                  color: COLORS.gold,
                  padding: "15px 30px",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
              >
                Let&apos;s Build →
              </a>
              <a
                href={PROFILE_DATA.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.faint,
                  padding: "15px 22px",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                LinkedIn ↗
              </a>
            </motion.div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 36 }}
            >
              {[
                { l: "Based in", v: PROFILE_DATA.location },
                { l: "Availability", v: "Remote Worldwide" },
                { l: "Focus", v: "Mobile · AI · Web3" },
              ].map((m) => (
                <div key={m.l}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 8,
                      letterSpacing: "0.28em",
                      color: "rgba(255,255,255,.22)",
                      textTransform: "uppercase",
                      marginBottom: 5,
                    }}
                  >
                    {m.l}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.75)",
                      fontWeight: 500,
                    }}
                  >
                    {m.v}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT PHOTO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            className="hero-photo"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 310,
                  height: 310,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(201,168,76,.38)",
                  position: "relative",
                  boxShadow: "0 40px 80px rgba(0,0,0,.55)",
                }}
              >
                <ImageWithFallback
                  src={PROFILE_DATA.profileImage}
                  fallbackSrc={PROFILE_DATA.profileFallback}
                  alt="Amit Chakraborty"
                  fill
                  style={{ objectFit: "cover" }}
                  fallbackColor="rgba(201,168,76,.15)"
                  sizes="310px"
                  priority
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(5,5,5,.38) 0%,transparent 55%)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                    color: "rgba(255,255,255,.1)",
                  }}
                >
                  Amit Chakraborty
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar — STATIC numbers */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{
            marginTop: 80,
            paddingTop: 40,
            borderTop: `1px solid ${COLORS.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
          }}
          className="stats-grid"
        >
          {[
            { v: `${getYrs()}+`, l: "Years Engineering" },
            { v: "18+", l: "Apps Shipped" },
            { v: "50K+", l: "Active Users" },
            { v: "2,029", l: "GitHub Contributions" },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontSize: "clamp(36px,5vw,54px)",
                  fontWeight: 900,
                  color: COLORS.gold,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 6,
                  fontFamily: HN,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: COLORS.vfaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontFamily: MONO,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: COLORS.ghost,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            fontFamily: MONO,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            width: 1,
            height: 44,
            background: `linear-gradient(to bottom,${COLORS.gold},transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}
