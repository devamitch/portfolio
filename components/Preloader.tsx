"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const GRID = "rgba(201,168,76,0.025)";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 2200;
    let prevName = false;

    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const cur = t === 1 ? 100 : Math.round(100 * (1 - Math.pow(2, -10 * t)));
      setProgress(cur);
      if (cur >= 55 && !prevName) {
        prevName = true;
        setNameVisible(true);
      }
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 500);
        setTimeout(() => onComplete(), 1300);
      }
    };
    setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 200);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
            }}
          />
          {/* TL corner */}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              width: 40,
              height: 40,
              borderTop: "1px solid rgba(201,168,76,0.35)",
              borderLeft: "1px solid rgba(201,168,76,0.35)",
            }}
          />
          {/* BR corner */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              width: 40,
              height: 40,
              borderBottom: "1px solid rgba(201,168,76,0.35)",
              borderRight: "1px solid rgba(201,168,76,0.35)",
            }}
          />

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(120px, 20vw, 200px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: "#fff",
              position: "relative",
              zIndex: 2,
              userSelect: "none",
            }}
          >
            {String(progress).padStart(2, "0")}
            <span
              style={{
                fontSize: "0.35em",
                color: "rgba(201,168,76,0.55)",
                letterSpacing: "-0.02em",
              }}
            >
              %
            </span>
          </motion.div>

          {/* Name */}
          <div
            style={{
              overflow: "hidden",
              marginTop: 20,
              position: "relative",
              zIndex: 2,
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={nameVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.45em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "#C9A84C" }}>Amit</span>
              <span
                style={{
                  width: 20,
                  height: 1,
                  background: "rgba(201,168,76,0.3)",
                  display: "inline-block",
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.32)" }}>
                Chakraborty
              </span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #DAA520, #F5C842, #B8860B)",
                width: `${progress}%`,
                transition: "width 0.15s linear",
              }}
            />
          </div>

          {/* Bottom labels */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 40,
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.18)",
              textTransform: "uppercase",
            }}
          >
            Principal Mobile Architect
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 40,
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.35em",
              color: "rgba(201,168,76,0.28)",
              textTransform: "uppercase",
            }}
          >
            devamit.co.in
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
