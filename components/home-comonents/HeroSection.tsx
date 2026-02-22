"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  COLORS,
  EASE_X,
  GRID,
  HN,
  MONO,
  PROFILE_DATA,
} from "~/data/portfolio.data";
import { getYrs } from "~/lib/utils";
import ImageWithFallback from "../ui/ImageWithFallback";

/* ── Counter ──────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let n = 0;
        const go = () => {
          n += Math.ceil(to / 60);
          setVal(Math.min(n, to));
          if (n < to) requestAnimationFrame(go);
        };
        requestAnimationFrame(go);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── ScrollProgressBar ────────────────────────────── */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: COLORS.goldG,
        transformOrigin: "left",
        scaleX,
        zIndex: 1000,
      }}
    />
  );
}

/* ── MobileNav ────────────────────────────────────── */
export function MobileNav() {
  const navItems = [
    { label: "Home", href: "#hero", icon: "⌂" },
    { label: "Work", href: "#work", icon: "◈" },
    { label: "Services", href: "#services", icon: "◉" },
    { label: "FAQ", href: "#faq", icon: "?" },
    { label: "Contact", href: "#contact", icon: "→" },
  ];
  return (
    <nav
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(5,5,5,0.94)",
        borderTop: `1px solid ${COLORS.border}`,
        backdropFilter: "blur(20px)",
        padding: "8px 0",
        justifyContent: "space-around",
      }}
      className="mobile-nav"
    >
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            textDecoration: "none",
            padding: "4px 10px",
          }}
        >
          <span style={{ fontSize: 18, color: COLORS.gold }}>{item.icon}</span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 8,
              color: COLORS.vfaint,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

/* ── HeroSection ──────────────────────────────────── */
export default function HeroSection({
  roleIdx,
  scrambled,
}: {
  roleIdx: number;
  scrambled: string;
}) {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 1400], [0, 100]);
  const txtY = useTransform(scrollY, [0, 1400], [0, -50]);
  const fade = useTransform(scrollY, [0, 700, 1400], [2, 0.5, 0]);

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
      <div
        className="gsap-grid"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${GRID} 1px,transparent 1px),linear-gradient(90deg,${GRID} 1px,transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />
      {[
        { x: "-5%", y: "8%", s: 700 },
        { x: "65%", y: "52%", s: 520 },
      ].map((o, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{
            duration: 11 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y,
            width: o.s,
            height: o.s,
            background:
              "radial-gradient(circle,rgba(201,168,76,.08) 0%,transparent 58%)",
            filter: "blur(100px)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      ))}

      <motion.div
        style={{
          opacity: fade,
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
          <motion.div style={{ y: txtY }}>
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
                  {scrambled}
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
              <motion.a
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                }}
              >
                See My Work →
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = COLORS.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = COLORS.goldD)
                }
              >
                Let&apos;s Build →
              </motion.a>
              <motion.a
                href={PROFILE_DATA.linkedin}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.gold;
                  e.currentTarget.style.borderColor = COLORS.goldD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.faint;
                  e.currentTarget.style.borderColor = COLORS.border;
                }}
              >
                LinkedIn ↗
              </motion.a>
              <motion.a
                href={PROFILE_DATA.twitter}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.text;
                  e.currentTarget.style.borderColor = COLORS.dim;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.faint;
                  e.currentTarget.style.borderColor = COLORS.border;
                }}
              >
                X (Twitter) ↗
              </motion.a>
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
          </motion.div>

          {/* RIGHT PHOTO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            className="hero-photo"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <motion.div style={{ y: imgY, position: "relative" }}>
              {[
                { inset: -36, dur: 32, o: 0.12 },
                { inset: -70, dur: 48, o: 0.05 },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: i === 0 ? 360 : -360 }}
                  transition={{
                    duration: r.dur,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    inset: r.inset,
                    border: `1px solid rgba(201,168,76,${r.o})`,
                    borderRadius: "50%",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  inset: -60,
                  background:
                    "radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 62%)",
                  filter: "blur(50px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />
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
              {[
                {
                  label: "Years",
                  value: `${getYrs()}+`,
                  pos: { top: 0, left: -56 },
                },
                { label: "Apps", value: "18+", pos: { top: 54, right: -60 } },
                {
                  label: "Users",
                  value: "50K+",
                  pos: { bottom: 80, left: -60 },
                },
                {
                  label: "Uptime",
                  value: "99.9%",
                  pos: { bottom: 14, right: -50 },
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 1.4 + i * 0.12,
                    type: "spring",
                    stiffness: 220,
                  }}
                  whileHover={{ scale: 1.08 }}
                  style={{
                    position: "absolute",
                    ...s.pos,
                    background: "rgba(5,5,5,.96)",
                    border: `1px solid rgba(201,168,76,.28)`,
                    padding: "10px 14px",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                    backdropFilter: "blur(12px)",
                    minWidth: 70,
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: COLORS.gold,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      color: COLORS.ghost,
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      fontFamily: MONO,
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
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
            { to: getYrs(), s: "+", l: "Years Engineering" },
            { to: 18, s: "+", l: "Apps Shipped" },
            { to: 50, s: "K+", l: "Active Users" },
            { to: 2029, s: "", l: "GitHub Contributions" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.62 + i * 0.08 }}
            >
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
                <Counter to={s.to} suffix={s.s} />
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
            </motion.div>
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
