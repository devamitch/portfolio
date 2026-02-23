"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { COLORS } from "~/data/portfolio.data";

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

const MONO = "'JetBrains Mono','Space Mono',monospace";

export default function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);

  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevY = useRef(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((n) => n.id === active);
    const btn = btnRefs.current[idx];
    const pill = pillRef.current;
    if (!btn || !pill) return;
    const br = btn.getBoundingClientRect();
    const pr = pill.getBoundingClientRect();
    setIndicator({ left: br.left - pr.left, width: br.width });
  }, [active]);

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
        animate={{ y: hidden && !menuOpen ? -90 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "clamp(14px,4vw,18px) clamp(24px,6vw,70px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          /* Liquid glass bar — depth from blur + single hairline, not shadows */
          background: scrolled ? "rgba(5,5,5,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(48px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(48px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition:
            "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              /* Clean metallic face — no thick bottom edge */
              background:
                "linear-gradient(145deg, #E8B422 0%, #C9A84C 60%, #A07820 100%)",
              /* Single top specular = perceived 3D convexity */
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 14px rgba(201,168,76,0.18)",
              border: "1px solid rgba(160,120,30,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 900,
              color: "#000",
              borderRadius: 6,
              transition:
                "transform 0.3s cubic-bezier(.34,1.4,.64,1), box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "perspective(300px) rotateY(-8deg) rotateX(4deg)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 24px rgba(201,168,76,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 14px rgba(201,168,76,0.18)";
            }}
          >
            A
          </div>
          <div className="nav-brand-text">
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
                color: "rgba(212,168,65,0.65)",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Principal Architect
            </div>
          </div>
        </div>

        {/* Pill nav */}
        <div
          ref={pillRef}
          className="nav-pill"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            /* Liquid glass pill — depth from a single inset specular + soft ambient glow */
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 40,
            padding: "3px 4px",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.35)",
          }}
        >
          {/* Sliding active indicator — clean liquid glass platform */}
          {indicator && (
            <motion.div
              animate={{ left: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              style={{
                position: "absolute",
                top: 3,
                bottom: 3,
                borderRadius: 36,
                /* Gold glass — specular on top, ambient glow underneath */
                background: "linear-gradient(170deg, #F0C040 0%, #C9A030 100%)",
                /* Single top-edge highlight = depth without any edge shadow */
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.4), 0 0 16px rgba(201,168,76,0.25)",
                border: "1px solid rgba(160,120,20,0.3)",
                pointerEvents: "none",
              }}
            />
          )}

          {NAV_ITEMS.map(({ id, label }, i) => {
            const isActive = active === id;
            const isPressed = pressedId === id;
            return (
              <button
                key={id}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                onClick={() => scrollTo(id)}
                onMouseDown={() => setPressedId(id)}
                onMouseUp={() => setPressedId(null)}
                onMouseLeave={() => setPressedId(null)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: isActive ? "#000" : "rgba(255,255,255,0.7)",
                  /* Micro press — just scale, no rotation gimmick */
                  transform: isPressed ? "scale(0.92)" : "scale(1)",
                  transition: isPressed
                    ? "transform 0.07s ease"
                    : "transform 0.3s cubic-bezier(.34,1.4,.64,1), color 0.18s",
                  whiteSpace: "nowrap",
                  borderRadius: 15,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Coffee — liquid glass circle */}
          <button
            onClick={() =>
              window.open("https://buymeacoffee.com/amithellmab", "_blank")
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.18)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                transition: "all 0.22s cubic-bezier(.34,1.4,.64,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(201,168,76,0.14)";
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(201,168,76,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(0.92)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "scale(1.06)";
              }}
            >
              <Coffee size={18} color="#f5c842" strokeWidth={2.2} />
            </span>
          </button>

          {/* CTA — clean gold glass pill */}
          <button
            onClick={() => scrollTo("contact")}
            className="nav-cta"
            style={{
              background: "linear-gradient(170deg, #F0C040 0%, #C9A030 100%)",
              border: "1px solid rgba(160,120,20,0.3)",
              borderRadius: 20,
              padding: "10px 22px",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#000",
              cursor: "pointer",
              /* Single top specular only — clean and premium */
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 16px rgba(201,168,76,0.2)",
              transition: "all 0.2s cubic-bezier(.34,1.4,.64,1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 28px rgba(201,168,76,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 16px rgba(201,168,76,0.2)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.96)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
          >
            Let's Build
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="nav-hamburger"
            style={{
              display: "none",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 8,
              padding: "8px 10px",
              cursor: "pointer",
              flexDirection: "column",
              gap: 4,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 18,
                  height: 1.5,
                  background: "rgba(255,255,255,0.65)",
                  borderRadius: 2,
                  transition: "transform 0.22s, opacity 0.22s",
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

      {/* Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "rgba(4,4,4,0.92)",
              backdropFilter: "blur(40px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "auto",
              padding: "80px 24px 40px",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 10,
                marginBottom: 36,
                width: "100%",
                maxWidth: 300,
              }}
            >
              {NAV_ITEMS.map(({ id, label }, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.035,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  onClick={() => scrollTo(id)}
                  style={{
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor:
                      id === active
                        ? "rgba(201,168,76,0.22)"
                        : "rgba(255,255,255,0.05)",
                    textAlign: "left",
                    width: "100%",
                    background:
                      id === active
                        ? "rgba(201,168,76,0.08)"
                        : "rgba(255,255,255,0.02)",
                    borderRadius: 14,
                    padding: "15px 20px",
                    color:
                      id === active ? COLORS.gold : "rgba(255,255,255,0.65)",
                    fontWeight: id === active ? 700 : 400,
                    fontSize: id === active ? 11 : 22,
                    letterSpacing: id === active ? "0.2em" : "-0.02em",
                    textTransform: id === active ? "uppercase" : "none",
                    fontFamily: id === active ? MONO : "inherit",
                    /* Clean glass card — one specular line */
                    boxShadow:
                      id === active
                        ? "inset 0 1px 0 rgba(255,255,255,0.08)"
                        : "inset 0 1px 0 rgba(255,255,255,0.03)",
                    transition: "all 0.18s ease",
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              onClick={() => scrollTo("contact")}
              style={{
                background: "transparent",
                border: `1px solid rgba(201,168,76,0.35)`,
                borderRadius: 28,
                padding: "15px 40px",
                display: "inline-flex",
                alignItems: "center",
                color: COLORS.gold,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: MONO,
                width: "100%",
                maxWidth: 300,
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              Contact Me
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 960px) { .nav-pill { display: none !important; } .nav-hamburger { display: flex !important; } }
        @media (max-width: 640px) { .nav-cta { display: none !important; } .nav-brand-text { display: none !important; } }
      `}</style>
    </>
  );
}
