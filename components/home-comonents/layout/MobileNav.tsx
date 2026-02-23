"use client";

import { BriefcaseBusiness, Coffee, Home, Mail, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

const BMC_URL = "https://buymeacoffee.com/amithellmab" as const;

type NavItem = {
  id: string;
  label: string;
  Icon: React.FC<{ size?: number; strokeWidth?: number; color?: string }>;
  href: string | null;
  isBMC?: true;
};

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home", Icon: Home, href: null },
  { id: "work", label: "Work", Icon: BriefcaseBusiness, href: null },
  { id: "coffee", label: "Coffee", Icon: Coffee, href: BMC_URL, isBMC: true },
  { id: "services", label: "Build", Icon: Zap, href: null },
  { id: "contact", label: "Contact", Icon: Mail, href: null },
];

export function MobileNav() {
  const [active, setActive] = useState("hero");
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id, isBMC }) => {
      if (isBMC) return;
      const el =
        document.getElementById(id) ??
        document.querySelector(`[data-section="${id}"]`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e?.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main)
      main.style.paddingBottom =
        "calc(64px + env(safe-area-inset-bottom, 0px))";
    return () => {
      if (main) main.style.paddingBottom = "";
    };
  }, []);

  const handleClick = (id: string, href: string | null) => {
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    const el =
      document.getElementById(id) ??
      document.querySelector(`[data-section="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <>
      <style>{`
        .mnav-root { display: none; }
        @media (max-width: 640px) { .mnav-root { display: flex; } }
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
          /* Liquid glass substrate */
          background: "rgba(8,8,8,0.78)",
          backdropFilter: "blur(48px) saturate(200%) brightness(1.06)",
          WebkitBackdropFilter: "blur(48px) saturate(200%) brightness(1.06)",
          /* Single crisp rule + ambient lift — no stacked edges */
          borderTop: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.03)",
          paddingTop: 8,
          paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
          alignItems: "stretch",
          justifyContent: "space-around",
        }}
      >
        {NAV_ITEMS.map(({ id, label, Icon, href, isBMC }) => {
          const isActive = active === id && !isBMC;
          const isDown = pressed === id;

          return (
            <button
              key={id}
              className="mnav-btn"
              onClick={() => handleClick(id, href)}
              onPointerDown={() => setPressed(id)}
              onPointerUp={() => setPressed(null)}
              onPointerCancel={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              aria-label={isBMC ? "Buy me a coffee" : label}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                flex: 1,
                padding: "6px 4px 4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                /* Liquid press — scale + micro-translate only */
                transform: isDown ? "scale(0.86)" : "scale(1)",
                transition: isDown
                  ? "transform 0.07s cubic-bezier(.2,.8,.4,1)"
                  : "transform 0.4s cubic-bezier(.34,1.5,.64,1)",
              }}
            >
              {/* Glowing liquid thread at top when active */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: isActive ? 26 : 0,
                  height: 2,
                  borderRadius: "0 0 2px 2px",
                  background: `linear-gradient(90deg, transparent 0%, ${COLORS.gold} 50%, transparent 100%)`,
                  filter: isActive ? "blur(0.3px)" : "none",
                  /* Glow purely from filter — zero shadow stacking */
                  opacity: isActive ? 1 : 0,
                  transition:
                    "width 0.38s cubic-bezier(.34,1.6,.64,1), opacity 0.25s ease",
                }}
              />
              {/* Radial bloom below the thread */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 60,
                    height: 24,
                    background: `radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.18) 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Icon container */}
              {isBMC ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    /* Liquid glass disc — light from top, subtle */
                    background: isDown
                      ? "rgba(201,168,76,0.14)"
                      : "rgba(201,168,76,0.08)",
                    border: `1px solid rgba(201,168,76,${isDown ? 0.35 : 0.18})`,
                    /* Single top-light specular = the entire depth illusion */
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Coffee size={15} color={COLORS.gold} strokeWidth={2.2} />
                </span>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 13,
                    background: isActive
                      ? "rgba(201,168,76,0.09)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(201,168,76,0.16)"
                      : "1px solid transparent",
                    /* Specular + a warm glow filter for depth */
                    boxShadow: isActive
                      ? "inset 0 1px 0 rgba(255,255,255,0.12)"
                      : "none",
                    filter: isActive
                      ? `drop-shadow(0 0 8px rgba(201,168,76,0.32))`
                      : isDown
                        ? "brightness(0.65)"
                        : "none",
                    transition: "all 0.28s cubic-bezier(.34,1.2,.64,1)",
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    color={isActive ? COLORS.gold : "rgba(255,255,255,0.36)"}
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
                      ? "rgba(201,168,76,0.48)"
                      : "rgba(255,255,255,0.26)",
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
