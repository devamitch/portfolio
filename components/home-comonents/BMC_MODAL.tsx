// ─────────────────────────────────────────────────────────────────────────────
// BMC_MODAL.tsx  —  Drop this into your project and import into PrimaryHome
// Usage: import { BuyCoffeeModal, BuyCoffeePill } from "./BMC_MODAL";
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

const C_GOLD = "#C9A84C";
const C_GOLDG = "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)";
const C_GOLDD = "rgba(201,168,76,0.32)";
const C_GOLDF = "rgba(201,168,76,0.08)";
const C_BORDER = "rgba(255,255,255,0.07)";
const C_FAINT = "rgba(255,255,255,0.42)";
const C_VFAINT = "rgba(255,255,255,0.24)";
const C_TEXT = "#FFFFFF";
const C_GREEN = "#34D399";
const C_GHOST = "rgba(255,255,255,0.10)";
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";
const BMC_LINK = "https://buymeacoffee.com/amithellmab";

// ─────────────────────────────────────────────────────────────────────────────
// 3D DRAGGABLE MODAL
// ─────────────────────────────────────────────────────────────────────────────
export function BuyCoffeeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedTier, setSelectedTier] = useState(1);

  // Drag state
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [grabbed, setGrabbed] = useState(false);

  const tiers = [
    {
      label: "A Coffee",
      price: "$3",
      emoji: "☕",
      desc: "Fuel one deep debugging session.",
      link: `${BMC_LINK}?amount=3`,
    },
    {
      label: "A Big One",
      price: "$5",
      emoji: "🍵",
      desc: "Power a weekend architecture deep-dive.",
      link: `${BMC_LINK}?amount=5`,
    },
    {
      label: "Lunch",
      price: "$10",
      emoji: "🍜",
      desc: "Sponsor a full day of open source writing.",
      link: `${BMC_LINK}?amount=10`,
    },
    {
      label: "Custom",
      price: "Any",
      emoji: "✨",
      desc: "Choose your own amount.",
      link: BMC_LINK,
    },
  ];

  // GSAP spring-in on open
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !open) return;
    setPos({ x: 0, y: 0 });
    setTilt({ rx: 0, ry: 0 });
    gsap.fromTo(
      card,
      { scale: 0.55, opacity: 0, rotateX: -40, rotateY: 18, y: 70 },
      {
        scale: 1,
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.78,
        ease: "back.out(1.7)",
        transformPerspective: 1200,
      },
    );
  }, [open]);

  const handleClose = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      scale: 0.65,
      opacity: 0,
      rotateX: 18,
      rotateY: -12,
      y: 40,
      duration: 0.42,
      ease: "power3.in",
      onComplete: onClose,
    });
  }, [onClose]);

  // Drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current.active = true;
    drag.current.startX = e.clientX - drag.current.posX;
    drag.current.startY = e.clientY - drag.current.posY;
    setGrabbed(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const newX = e.clientX - drag.current.startX;
    const newY = e.clientY - drag.current.startY;
    const velX = newX - drag.current.posX;
    const velY = newY - drag.current.posY;
    drag.current.posX = newX;
    drag.current.posY = newY;
    setPos({ x: newX, y: newY });
    setTilt({ rx: velY * -2.8, ry: velX * 2.8 });
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current.active = false;
    setGrabbed(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  // Hover tilt (idle)
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (grabbed) return;
      const card = cardRef.current;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ rx: y * -14, ry: x * 14 });
    },
    [grabbed],
  );

  const onMouseLeave = useCallback(() => {
    if (!grabbed) setTilt({ rx: 0, ry: 0 });
  }, [grabbed]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(16px)",
        animation: "bmc-overlay-in 0.32s ease both",
      }}
    >
      {/* 3D card wrapper */}
      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: "relative",
          width: "min(520px,94vw)",
          transform: `translate(${pos.x}px,${pos.y}px) perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: grabbed
            ? "transform 0.05s linear"
            : "transform 0.52s cubic-bezier(0.23,1,0.32,1)",
          transformStyle: "preserve-3d",
          cursor: grabbed ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: -32,
            background:
              "radial-gradient(ellipse at 50% 40%,rgba(201,168,76,0.2) 0%,transparent 65%)",
            filter: "blur(30px)",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* Card face */}
        <div
          style={{
            background:
              "linear-gradient(145deg,#0D0B07 0%,#0A0A0A 50%,#050504 100%)",
            border: "1px solid rgba(201,168,76,0.35)",
            overflow: "hidden",
            transformStyle: "preserve-3d",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,168,76,0.07), inset 0 1px 0 rgba(201,168,76,0.10)",
          }}
        >
          {/* Top gold bar */}
          <div style={{ height: 3, background: C_GOLDG }} />

          {/* Drag handle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 12,
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                width: 38,
                height: 4,
                borderRadius: 2,
                background: "rgba(201,168,76,0.22)",
              }}
            />
          </div>

          {/* Header */}
          <div style={{ padding: "20px 32px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    lineHeight: 1,
                    animation: "bmc-bob 2.8s ease-in-out infinite",
                    display: "block",
                    filter: "drop-shadow(0 0 10px rgba(201,168,76,0.55))",
                  }}
                >
                  ☕
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 8,
                      fontFamily: MONO,
                      color: C_GOLD,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    Support My Work
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      fontFamily: HN,
                      letterSpacing: "-0.03em",
                      color: C_TEXT,
                      lineHeight: 1,
                    }}
                  >
                    Buy Me a Coffee
                  </h3>
                </div>
              </div>
              {/* Close btn */}
              <button
                onClick={handleClose}
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  width: 34,
                  height: 34,
                  border: `1px solid ${C_BORDER}`,
                  background: "rgba(255,255,255,0.04)",
                  color: C_FAINT,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  lineHeight: 1,
                  flexShrink: 0,
                  transition: "all .2s",
                  fontWeight: 300,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = C_TEXT;
                  (e.currentTarget as HTMLElement).style.borderColor = C_GOLDD;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = C_FAINT;
                  (e.currentTarget as HTMLElement).style.borderColor = C_BORDER;
                }}
              >
                ×
              </button>
            </div>
            <p
              style={{
                fontSize: 13,
                color: C_FAINT,
                lineHeight: 1.65,
                marginTop: 12,
                marginBottom: 0,
                fontWeight: 300,
              }}
            >
              I write free articles and build open source tools. If my work has
              ever saved you time or inspired you — a coffee helps me keep
              going.
            </p>
          </div>

          {/* Tier grid */}
          <div style={{ padding: "20px 32px" }}>
            <div
              style={{
                fontSize: 8,
                fontFamily: MONO,
                color: "rgba(201,168,76,0.55)",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Choose an amount
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {tiers.map((tier, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTier(i)}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    padding: "14px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    border: `1px solid ${selectedTier === i ? C_GOLD : C_BORDER}`,
                    background:
                      selectedTier === i
                        ? "linear-gradient(135deg,rgba(201,168,76,0.14) 0%,rgba(201,168,76,0.06) 100%)"
                        : "rgba(255,255,255,0.025)",
                    boxShadow:
                      selectedTier === i
                        ? "0 0 22px rgba(201,168,76,0.13), inset 0 0 0 1px rgba(201,168,76,0.07)"
                        : "none",
                    transform:
                      selectedTier === i ? "translateZ(10px)" : "translateZ(0)",
                    transition: "all 0.22s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {selectedTier === i && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: C_GOLDG,
                      }}
                    />
                  )}
                  <div style={{ fontSize: 24, marginBottom: 4, lineHeight: 1 }}>
                    {tier.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: selectedTier === i ? C_GOLD : C_TEXT,
                      fontFamily: HN,
                      marginBottom: 2,
                    }}
                  >
                    {tier.label}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: C_GOLD,
                      fontFamily: HN,
                      letterSpacing: "-0.03em",
                      marginBottom: 5,
                    }}
                  >
                    {tier.price}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C_FAINT,
                      fontWeight: 300,
                      lineHeight: 1.4,
                    }}
                  >
                    {tier.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              padding: "0 32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <a
              href={tiers[selectedTier].link}
              target="_blank"
              rel="noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "16px 24px",
                background: C_GOLDG,
                color: "#000",
                fontFamily: MONO,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow:
                  "0 8px 32px rgba(201,168,76,0.38), 0 2px 8px rgba(201,168,76,0.2)",
                transform: "translateZ(18px)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateZ(22px) scale(1.015)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateZ(18px) scale(1)";
              }}
            >
              <span style={{ fontSize: 16 }}>{tiers[selectedTier].emoji}</span>
              Support with {tiers[selectedTier].price} →
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: C_BORDER }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  color: C_VFAINT,
                  letterSpacing: "0.2em",
                }}
              >
                OR
              </span>
              <div style={{ flex: 1, height: 1, background: C_BORDER }} />
            </div>
            <a
              href={BMC_LINK}
              target="_blank"
              rel="noreferrer"
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 24px",
                border: `1px solid ${C_GOLDD}`,
                color: C_GOLD,
                fontFamily: MONO,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = C_GOLDF;
                (e.currentTarget as HTMLElement).style.borderColor = C_GOLD;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = C_GOLDD;
              }}
            >
              View all support options ↗
            </a>
          </div>

          {/* Footer note */}
          <div
            style={{
              padding: "13px 32px 18px",
              borderTop: `1px solid ${C_BORDER}`,
              background: "rgba(201,168,76,0.025)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: C_GREEN,
                animation: "ac-pulse 2s infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: C_VFAINT,
                fontFamily: MONO,
                letterSpacing: "0.06em",
              }}
            >
              100% goes toward open source & free articles. No subscriptions.
            </span>
          </div>
        </div>

        {/* Drag hint */}
        <div
          style={{
            position: "absolute",
            bottom: -26,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 8,
            fontFamily: MONO,
            color: "rgba(201,168,76,0.28)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          Drag to move · Click outside to close
        </div>
      </div>

      <style>{`
        @keyframes bmc-overlay-in { from { opacity:0; } to { opacity:1; } }
        @keyframes bmc-bob {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50%     { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes ac-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(201,168,76,0.5); }
          50%      { opacity:0.4; box-shadow:0 0 0 7px rgba(201,168,76,0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM-RIGHT PILL
// ─────────────────────────────────────────────────────────────────────────────
export function BuyCoffeePill({ onOpen }: { onOpen: () => void }) {
  const [hov, setHov] = useState(false);
  const [vis, setVis] = useState(false);
  const pillRef = useRef<HTMLButtonElement>(null);

  // Delayed appearance
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Idle bounce
  useEffect(() => {
    if (!pillRef.current || !vis) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 6, delay: 4 });
    tl.to(pillRef.current, { y: -7, duration: 0.3, ease: "power2.out" }).to(
      pillRef.current,
      { y: 0, duration: 0.5, ease: "bounce.out" },
    );
    return () => {
      tl.kill();
    };
  }, [vis]);

  return (
    <button
      ref={pillRef}
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "fixed",
        bottom: 35,
        left: 35,
        zIndex: 8000,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: hov ? "12px 22px" : "10px 18px",
        background: hov
          ? "linear-gradient(135deg,rgba(201,168,76,0.22) 0%,rgba(201,168,76,0.10) 100%)"
          : "rgba(5,5,5,0.96)",
        border: `1px solid ${hov ? C_GOLD : "rgba(201,168,76,0.42)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: hov
          ? "0 16px 48px rgba(201,168,76,0.28), 0 0 0 1px rgba(201,168,76,0.14)"
          : "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.06)",
        cursor: "pointer",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.38s cubic-bezier(0.23,1,0.32,1)",
        overflow: "hidden",
      }}
    >
      {/* Left gold strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "20%",
          bottom: "20%",
          width: 2,
          background: C_GOLDG,
          borderRadius: 1,
        }}
      />

      {/* Icon */}
      <span
        style={{
          fontSize: 18,
          lineHeight: 1,
          display: "block",
          filter: hov ? "drop-shadow(0 0 7px rgba(201,168,76,0.75))" : "none",
          transition: "filter 0.3s",
        }}
      >
        ☕
      </span>

      {/* Label */}
      <div
        style={{
          textAlign: "left",
          gap: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: hov ? C_GOLD : C_TEXT,
            fontFamily: HN,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            transition: "color 0.2s",
          }}
        >
          Support
        </div>
        <div
          style={{
            fontSize: 8,
            fontFamily: MONO,
            color: "rgba(201,168,76,0.62)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1.3,
          }}
        >
          Buy me a coffee
        </div>
      </div>

      {/* Arrow */}
      <span
        style={{
          fontSize: 12,
          color: C_GOLD,
          opacity: hov ? 1 : 0.5,
          transition: "opacity 0.2s, transform 0.2s",
          transform: hov ? "translateX(3px)" : "translateX(0)",
        }}
      >
        →
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USAGE IN PrimaryHome root:
//
// 1) import { BuyCoffeeModal, BuyCoffeePill } from "./BMC_MODAL";
//
// 2) Inside PrimaryHome():
//    const [bmcOpen, setBmcOpen]       = useState(false);
//    const [autoOpened, setAutoOpened] = useState(false);
//    const { scrollYProgress }         = useScroll();
//
//    useEffect(() => {
//      return scrollYProgress.on("change", (v) => {
//        if (v > 0.4 && !autoOpened && !bmcOpen) {
//          setAutoOpened(true);
//          setBmcOpen(true);
//        }
//      });
//    }, [autoOpened, bmcOpen, scrollYProgress]);
//
// 3) In the return, after <MobileNav />:
//    <BuyCoffeePill onOpen={() => setBmcOpen(true)} />
//    <AnimatePresence>
//      {bmcOpen && <BuyCoffeeModal open={bmcOpen} onClose={() => setBmcOpen(false)} />}
//    </AnimatePresence>
// ─────────────────────────────────────────────────────────────────────────────
