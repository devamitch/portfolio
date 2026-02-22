"use client";

/**
 * AllProvider — Splash → Widget Orb Handoff
 *
 * Choreography:
 *  [0ms]    Page hydrates → dark bg + SentientAURAOrb visible, centered
 *  [900ms]  Page fully loaded → bg fades out fast (300ms)
 *  [900ms]  Orb springs toward bottom-right widget position (700ms spring)
 *  [1400ms] Orb ~arrived → splashDone=true → widget PlasmaOrb fades in (350ms)
 *  [1650ms] Flying orb fades out → unmounted → content fades in
 */

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SentientAURAOrb } from "../ui/LiquidGoldAnimation";
import { SplashContext } from "./SplashContext";

// Must exactly match AIAssistantWidget constants
const ORB_CANVAS  = 180;  // SentientAURAOrb canvas size (fixed in that component)
const ORB_WIDGET  = 82;   // PlasmaOrb size in widget
const MARGIN      = 20;   // widget's bottom/right margin

// SSR-safe window size
function useWindowSize() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const sync = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return size;
}

export default function AllProvider({ children }: { children: React.ReactNode }) {
  const [mounted,      setMounted]      = useState(false);
  const [showBg,       setShowBg]       = useState(true);   // dark splash bg
  const [showOrb,      setShowOrb]      = useState(true);   // flying orb
  const [splashDone,   setSplashDone]   = useState(false);  // widget orb reveal
  const [contentReady, setContentReady] = useState(false);  // page content
  const { w, h }  = useWindowSize();
  const didFly    = useRef(false);
  const orbControls = useAnimation();

  // ── Step 1: hydrate ───────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  // ── Step 2: wait for page load, then start flight ─────────────────────────
  useEffect(() => {
    if (!mounted || w === 0) return;

    const fly = async () => {
      if (didFly.current) return;
      didFly.current = true;

      // Orb center starts at (w/2, h/2).
      // Widget orb center is at (w - MARGIN - ORB_WIDGET/2, h - MARGIN - ORB_WIDGET/2).
      // Framer x/y are additive from initial pos.
      const toX    =  (w / 2) - MARGIN - (ORB_WIDGET / 2);
      const toY    =  (h / 2) - MARGIN - (ORB_WIDGET / 2);
      const toScale = ORB_WIDGET / ORB_CANVAS;   // 82/180 ≈ 0.456

      // bg fades out on its own via state below
      setShowBg(false);

      // Spring the orb to corner — organic, slight overshoot
      orbControls.start({
        x:     toX,
        y:     toY,
        scale: toScale,
        transition: {
          x:     { type: "spring", stiffness: 55, damping: 16, mass: 0.9 },
          y:     { type: "spring", stiffness: 55, damping: 16, mass: 0.9 },
          scale: { type: "spring", stiffness: 50, damping: 15, mass: 1.0 },
        },
      });

      // ~halfway through the spring → crossfade: widget orb fades in
      await delay(420);
      setSplashDone(true);

      // Spring fully settled → fade flying orb out
      await delay(380);
      orbControls.start({
        opacity: 0,
        transition: { duration: 0.26, ease: "easeIn" },
      });

      await delay(280);
      setShowOrb(false);
      setContentReady(true);
    };

    if (document.readyState === "complete") {
      delay(700).then(fly);
    } else {
      const onLoad = () => delay(400).then(fly);
      window.addEventListener("load", onLoad, { once: true });
      // Hard cap — never block more than 5s
      const cap = setTimeout(fly, 5000);
      return () => { window.removeEventListener("load", onLoad); clearTimeout(cap); };
    }
  }, [mounted, w, h, orbControls]);

  return (
    <SplashContext.Provider value={{ splashDone }}>

      {/* ── DARK BACKGROUND ─────────────────────────────────────────────────
          Separate from the orb so it can fade on its own timeline.
          Fades out quickly once flight begins, revealing the site underneath.
      ─────────────────────────────────────────────────────────────────────── */}
      {mounted && (
        <motion.div
          animate={{ opacity: showBg ? 1 : 0 }}
          transition={{ duration: 0.32, ease: "easeIn" }}
          onAnimationComplete={() => {
            // fully transparent = safe to remove from paint
          }}
          style={{
            position:   "fixed",
            inset:       0,
            zIndex:      99997,
            background: "#030303",
            pointerEvents: "none",
            // Don't block interaction once invisible
            willChange: "opacity",
          }}
        />
      )}

      {/* ── FLYING ORB ──────────────────────────────────────────────────────
          Absolutely positioned at center via left/top + negative margin.
          Framer animates x/y/scale from there to the corner.
          transformOrigin: center → shrinks inward as it travels.
      ─────────────────────────────────────────────────────────────────────── */}
      {mounted && showOrb && w > 0 && (
        <motion.div
          animate={orbControls}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          style={{
            position:    "fixed",
            left:         w / 2 - ORB_CANVAS / 2,
            top:          h / 2 - ORB_CANVAS / 2,
            width:        ORB_CANVAS,
            height:       ORB_CANVAS,
            zIndex:       99999,
            pointerEvents: "none",
            transformOrigin: "center center",
            willChange:   "transform, opacity",
          }}
        >
          {/* Outer halo — fades with orb naturally */}
          <div style={{
            position:    "absolute",
            inset:        "-30px",
            borderRadius: "50%",
            background:  "radial-gradient(circle, rgba(201,140,30,0.18) 0%, transparent 65%)",
            filter:      "blur(18px)",
            pointerEvents: "none",
          }} />

          {/* The actual animated orb canvas */}
          <SentientAURAOrb />
        </motion.div>
      )}

      {/* ── CONTENT ─────────────────────────────────────────────────────────
          SSR: renders at opacity 0, pointer-events off.
          Fades in after flying orb lands.
      ─────────────────────────────────────────────────────────────────────── */}
      <motion.div
        role="application"
        aria-label="Amit Chakraborty Portfolio — Principal Mobile Architect"
        animate={{ opacity: contentReady ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: contentReady ? "auto" : "none" }}
      >
        {children}
      </motion.div>

    </SplashContext.Provider>
  );
}

// ── tiny util ────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
