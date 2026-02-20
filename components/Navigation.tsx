"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import gsap from "gsap";
import { useEffect, useState } from "react";

const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";
const GOLD = "#C9A84C";
const GOLDD = "rgba(201,168,76,0.3)";

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Arsenal", href: "#skills" },
  { label: "Story", href: "#story" },
  { label: "Contribution", href: "#github" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

function Hamburger({ open }: { open: boolean }) {
  return (
    <div style={{ width: 22, height: 12, position: "relative" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{
            top: i === 0 ? 0 : i === 1 ? "50%" : "100%",
            opacity: i === 1 ? (open ? 0 : 1) : 1,
            rotate: i === 0 ? (open ? 45 : 0) : i === 2 ? (open ? -45 : 0) : 0,
            y: i === 0 && open ? 6 : i === 2 && open ? -6 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background: GOLD,
            display: "block",
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (cur) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(cur > 60);
    if (!open) setHidden(cur > 140 && cur > prev);
    else setHidden(false);
  });

  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) setActive("#" + en.target.id);
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    setTimeout(
      () => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      },
      open ? 380 : 0,
    );
  };

  const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { color: GOLD, duration: 0.18 });
    gsap.to(e.currentTarget.querySelector(".nl"), {
      scaleX: 1,
      duration: 0.26,
      ease: "power2.out",
    });
  };
  const hoverOut = (e: React.MouseEvent<HTMLButtonElement>, act: boolean) => {
    if (!act) {
      gsap.to(e.currentTarget, {
        color: "rgba(255,255,255,0.45)",
        duration: 0.18,
      });
      gsap.to(e.currentTarget.querySelector(".nl"), {
        scaleX: 0,
        duration: 0.26,
        ease: "power2.in",
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.44, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9900,
          background: scrolled ? "rgba(5,5,5,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(22px)" : "none",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.05)" : "transparent"}`,
          transition: "background 0.5s, border-color 0.5s",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 clamp(16px,4vw,40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
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
              }}
            >
              A
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: HN,
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Amit
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 7.5,
                  letterSpacing: "0.32em",
                  color: "rgba(255,255,255,0.28)",
                  textTransform: "uppercase",
                }}
              >
                Principal Architect
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div
            className="nav-desk"
            style={{ display: "flex", alignItems: "center", gap: 28 }}
          >
            {NAV_ITEMS.map((item) => {
              const act = active === item.href;
              return (
                <button
                  key={item.label}
                  onMouseEnter={(e) => hoverIn(e as any)}
                  onMouseLeave={(e) => hoverOut(e as any, act)}
                  onClick={() => scrollTo(item.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: act ? 600 : 400,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: act ? GOLD : "rgba(255,255,255,0.45)",
                    position: "relative",
                    padding: "4px 0",
                  }}
                >
                  {item.label}
                  <span
                    className="nl"
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: GOLD,
                      display: "block",
                      transform: act ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                    }}
                  />
                </button>
              );
            })}
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                background: "transparent",
                border: `1px solid ${GOLDD}`,
                padding: "10px 20px",
                fontFamily: MONO,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: GOLD,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                e.currentTarget.style.borderColor = GOLD;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = GOLDD;
              }}
            >
              Let&apos;s Build
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="nav-ham"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "none",
              border: `1px solid rgba(255,255,255,0.1)`,
              width: 46,
              height: 46,
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Hamburger open={open} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 36px) 36px)" }}
            animate={{ clipPath: "circle(200% at calc(100% - 36px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 36px) 36px)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9800,
              background: "rgba(5,5,5,0.98)",
              backdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "clamp(24px,8vw,64px)",
            }}
          >
            <div style={{ marginBottom: 48 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.22)",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Navigation
              </div>
              <div style={{ width: 32, height: 1, background: GOLD }} />
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{
                    delay: i * 0.07 + 0.1,
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => scrollTo(item.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: HN,
                    textAlign: "left",
                    fontSize: "clamp(34px,7vw,54px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                    color: "rgba(255,255,255,0.72)",
                    transition: "color 0.2s",
                    padding: "6px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.72)")
                  }
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: "rgba(255,255,255,0.18)",
                      minWidth: 20,
                      fontWeight: 400,
                    }}
                  >
                    0{i + 1}
                  </span>
                  {item.label}
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
              style={{ marginTop: 56 }}
            >
              <button
                onClick={() => scrollTo("#contact")}
                style={{
                  background: "linear-gradient(135deg,#DAA520,#F5C842,#B8860B)",
                  border: "none",
                  padding: "15px 32px",
                  fontFamily: MONO,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#000",
                  cursor: "pointer",
                }}
              >
                Let&apos;s Build Together
              </button>
            </motion.div>
            <div
              style={{
                position: "absolute",
                bottom: 36,
                right: 36,
                fontFamily: MONO,
                fontSize: 8,
                color: "rgba(255,255,255,0.1)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Amit Chakraborty — 2025
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-desk { display: flex !important; }
        .nav-ham  { display: none !important; }
        @media (max-width: 768px) {
          .nav-desk { display: none !important; }
          .nav-ham  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
