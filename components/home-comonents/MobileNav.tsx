"use client";

import {
  BriefcaseBusiness,
  Coffee,
  HelpCircle,
  Home,
  Mail,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

// ── Update to your BMC profile ──────────────────────────────────────────────
const BMC_URL = "https://www.buymeacoffee.com/amitchauhan";

type NavItem = {
  id: string;
  label: string;
  Icon: React.FC<{ size?: number; strokeWidth?: number; color?: string }>;
  href: string | null;
  isBMC?: true;
};

const NAV_ITEMS: NavItem[] = [
  { id: "hero",     label: "Home",    Icon: Home,              href: null },
  { id: "work",     label: "Work",    Icon: BriefcaseBusiness, href: null },
  { id: "coffee",   label: "Coffee",  Icon: Coffee,            href: BMC_URL, isBMC: true },
  { id: "services", label: "Build",   Icon: Zap,               href: null },
  { id: "contact",  label: "Contact", Icon: Mail,              href: null },
];

export function MobileNav() {
  const [active, setActive] = useState("hero");
  const [pressed, setPressed] = useState<string | null>(null);

  /* ── Section tracking ─────────────────────────────────────────────────── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id, isBMC }) => {
      if (isBMC) return;
      const el =
        document.getElementById(id) ??
        document.querySelector(`[data-section="${id}"]`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry?.isIntersecting) setActive(id); },
        { rootMargin: "-35% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Spacer for main content ──────────────────────────────────────────── */
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.style.paddingBottom = "calc(64px + env(safe-area-inset-bottom, 0px))";
    return () => { if (main) main.style.paddingBottom = ""; };
  }, []);

  const handleClick = (id: string, href: string | null) => {
    if (href) { window.open(href, "_blank", "noopener,noreferrer"); return; }
    const el =
      document.getElementById(id) ??
      document.querySelector(`[data-section="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!el) window.location.hash = id;
    setActive(id);
  };

  return (
    <>
      <style>{`
        .mnav-root { display: none; }
        @media (max-width: 640px) {
          .mnav-root { display: flex; }
        }
        .mnav-btn { -webkit-tap-highlight-color: transparent; user-select: none; }
      `}</style>

      <nav
        className="mnav-root"
        aria-label="Mobile navigation"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          background: "rgba(5,5,5,0.97)",
          borderTop: `1px solid ${COLORS.border}`,
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          paddingTop: 8,
          paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
          alignItems: "stretch",
          justifyContent: "space-around",
          /* 3-D bar shadow */
          boxShadow: "0 -1px 0 rgba(255,255,255,0.05), 0 -20px 50px rgba(0,0,0,0.7)",
        }}
      >
        {NAV_ITEMS.map(({ id, label, Icon, href, isBMC }) => {
          const isActive = active === id && !isBMC;
          const isDown   = pressed === id;

          return (
            <button
              key={id}
              className="mnav-btn"
              onClick={() => handleClick(id, href)}
              onPointerDown={() => setPressed(id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              aria-label={isBMC ? "Buy me a coffee" : label}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                flex: 1,
                padding: "4px 4px 2px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                position: "relative",
                /* 3-D press perspective */
                perspective: "400px",
                transform: isDown
                  ? "scale(0.88) translateY(2px) rotateX(8deg)"
                  : "scale(1) translateY(0) rotateX(0deg)",
                transformOrigin: "bottom center",
                transition: "transform 0.1s ease",
              }}
            >
              {/* Active pip */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isActive ? 22 : 0,
                  height: 2,
                  background: COLORS.goldG,
                  borderRadius: "0 0 3px 3px",
                  opacity: isActive ? 1 : 0,
                  transition: "width 0.28s ease, opacity 0.22s ease",
                  boxShadow: isActive ? `0 0 10px ${COLORS.gold}` : "none",
                }}
              />

              {/* BMC Coffee special treatment */}
              {isBMC ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: isDown
                      ? COLORS.goldG
                      : COLORS.goldF,
                    border: `1.5px solid ${COLORS.goldD}`,
                    boxShadow: isDown
                      ? `0 2px 12px ${COLORS.goldD}, inset 0 1px 0 rgba(255,255,255,0.15)`
                      : `0 0 14px ${COLORS.goldD}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                    transition: "all 0.15s ease",
                    /* 3-D coin flip on press */
                    transform: isDown ? "rotateY(15deg) scale(0.92)" : "rotateY(0deg) scale(1)",
                  }}
                >
                  <Coffee
                    size={15}
                    color={isDown ? "#050505" : COLORS.gold}
                    strokeWidth={2.2}
                  />
                </span>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    /* 3-D tilt on press */
                    transform: isDown
                      ? "scale(0.84) translateY(3px) rotateZ(-4deg)"
                      : "scale(1) translateY(0) rotateZ(0deg)",
                    transition: "transform 0.1s ease",
                    filter: isActive
                      ? `drop-shadow(0 0 6px ${COLORS.gold})`
                      : "none",
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    color={isActive ? COLORS.gold : "rgba(255,255,255,0.35)"}
                  />
                </span>
              )}

              {/* Label */}
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 7,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isActive
                    ? COLORS.gold
                    : isBMC
                      ? "rgba(201,168,76,0.55)"
                      : "rgba(255,255,255,0.28)",
                  transition: "color 0.22s",
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default MobileNav;
