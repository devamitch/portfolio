"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Exp." },
  { id: "skills", label: "Skills" },
  { id: "story", label: "Story" },
  { id: "github", label: "GitHub" },
  { id: "testimonials", label: "Praise" },
  { id: "contact", label: "Contact" },
];

const C = {
  bg: "#050505",
  bg2: "#0A0A0A",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  vfaint: "rgba(255,255,255,0.24)",
  ghost: "rgba(255,255,255,0.10)",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.025)",
  gold: "#C9A84C",
  goldL: "#F5C842",
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldG: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
  green: "#34D399",
  blue: "#4FC3F7",
  red: "#FF4444",
  purple: "#C084FC",
} as const;

const GRID = "rgba(201,168,76,0.022)";
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";
const EASE_X = [0.18, 1, 0.3, 1] as const;

export default function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevY = useRef(0);

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── indicator position ── */
  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((n) => n.id === active);
    const btn = btnRefs.current[idx];
    const pill = pillRef.current;
    if (!btn || !pill) return;
    const bRect = btn.getBoundingClientRect();
    const pRect = pill.getBoundingClientRect();
    setIndicator({ left: bRect.left - pRect.left, width: bRect.width });
  }, [active]);

  /* ── scroll hide / show ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (!menuOpen) {
        if (y > 120 && y > prevY.current + 4) setHidden(true);
        else if (y < prevY.current - 4) setHidden(false);
      }
      prevY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        animate={{ y: hidden && !menuOpen ? -90 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 70px",
          display: "flex",
          justifyContent: "space-between",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          background: scrolled ? "rgba(5,5,5,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
          transition:
            "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        {/* ── Logo ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg,#C9A84C,#B8860B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: HN,
              fontSize: 15,
              fontWeight: 900,
              color: "#000",
              flexShrink: 0,
              borderRadius: 4,
            }}
          >
            A
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#e8e8e8",
                lineHeight: 1,
              }}
            >
              Amit Chakraborty
            </div>
            <div
              style={{
                fontSize: 8,
                letterSpacing: "0.18em",
                color: "rgba(212,168,65,0.7)",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Principal Architect
            </div>
          </div>
        </div>

        {/* ── Center Pill Nav ── */}
        <div
          ref={pillRef}
          className="nav-pill"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 40,
            padding: "3px 4px",
          }}
        >
          {/* Sliding indicator */}
          {indicator && (
            <motion.div
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{
                position: "absolute",
                top: 3,
                bottom: 3,
                borderRadius: 36,
                background: "linear-gradient(135deg, #d4a841 0%, #f5c842 100%)",
                // background:
                // "linear-gradient(90deg, rgba(212,168,65,0.22), rgba(212,168,65,0.12))",
                border: "1px solid rgba(212,168,65,0.3)",
                pointerEvents: "none",
              }}
            />
          )}

          {NAV_ITEMS.map(({ id, label }, i) => (
            <button
              key={id}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              onClick={() => scrollTo(id)}
              style={{
                position: "relative",
                zIndex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 11px",
                fontSize: 8.5,
                fontWeight: active === id ? 700 : 400,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                // color: active === id ? "#d4a841" : "rgba(255,255,255,0.55)",
                transition: "color 0.2s",
                whiteSpace: "nowrap",

                // // Layout & Alignment
                display: "block",
                alignItems: id === active ? "center" : "flex-start",
                textAlign: id === active ? "center" : "left",
                gap: id === active ? 10 : 0,

                // Background & Shape

                borderRadius: 15, // Added a subtle 4px border-radius for inactive hover states

                // Shadow / Glow
                boxShadow:
                  id === active ? "0 6px 24px rgba(201,168,76,0.25)" : "none",

                // Typography
                color: id === active ? "#000000" : "rgba(255, 255, 255, 0.75)",
                // fontWeight: 700,
                // fontSize: 8.5 ,
                // letterSpacing: id === active ? "0.22em" : "-0.02em",
                // textTransform: id === active ? "uppercase" : "none",
                // fontFamily: id === active ? MONO : "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Right: CTA + Hamburger ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={() => scrollTo("contact")}
            className="nav-cta"
            style={{
              background: "linear-gradient(135deg, #d4a841, #f5c842)",
              border: "none",
              borderRadius: 20,
              padding: "7px 16px",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              // color: "#0a0a0a",
              cursor: "pointer",
              // background: C.goldG,
              color: "#000",
              // padding: "15px 30px",
              // fontSize: 10,
              // fontWeight: 700,
              // letterSpacing: "0.22em",
              // textTransform: "uppercase",
              // fontFamily: MONO,
              textDecoration: "none",
              boxShadow: "0 6px 24px rgba(201,168,76,.25)",
            }}
          >
            Let's Build
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="nav-hamburger"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 18,
                  height: 1.5,
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: 2,
                  transition: "transform 0.2s, opacity 0.2s",
                  transform: menuOpen
                    ? i === 0
                      ? "rotate(45deg) translate(4px,4px)"
                      : i === 2
                        ? "rotate(-45deg) translate(4px,-4px)"
                        : "scaleX(0)"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(5,5,5,0.97)",
              backdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px 24px",
                marginBottom: 36,
              }}
            >
              {NAV_ITEMS.map(({ id, label }, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => scrollTo(id)}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    textDecoration: "none",

                    // Smooth animation between states
                    transition: "all 0.3s ease-in-out",

                    // Layout & Alignment
                    display: "block",
                    alignItems: id === active ? "center" : "flex-start",
                    textAlign: id === active ? "center" : "left",
                    gap: id === active ? 10 : 0,

                    // Background & Shape
                    background:
                      id === active
                        ? "linear-gradient(135deg, #d4a841 0%, #f5c842 100%)"
                        : "transparent",
                    borderRadius: id === active ? 28 : 4, // Added a subtle 4px border-radius for inactive hover states
                    padding: id === active ? "14px 40px" : "12px 8px",

                    // Shadow / Glow
                    boxShadow:
                      id === active
                        ? "0 6px 24px rgba(201,168,76,0.25)"
                        : "none",

                    // Typography
                    color:
                      id === active ? "#000000" : "rgba(255, 255, 255, 0.75)",
                    fontWeight: 700,
                    fontSize: id === active ? 13 : 22,
                    letterSpacing: id === active ? "0.22em" : "-0.02em",
                    textTransform: id === active ? "uppercase" : "none",
                    fontFamily: id === active ? MONO : "inherit",
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              onClick={() => scrollTo("contact")}
              style={{
                background: "linear-gradient(135deg, #d4a841, #f5c842)",
                border: "none",
                borderRadius: 28,
                padding: "14px 40px",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                color: "#000",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: MONO,
                textDecoration: "none",
                boxShadow: "0 6px 24px rgba(201,168,76,.25)",
              }}
            >
              Let's Build
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .nav-pill { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (max-width: 640px) {
          .nav-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}
