"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import CustomCursor from "~/components/CustomCursor";
import Home from "~/components/Home";
import Navigation from "~/components/Navigation";
import Preloader from "~/components/Preloader";
import SmoothScroll from "~/components/SmoothScroll";

// Scene3D uses vanilla Three.js (no R3F), but still defer to client-only
// so Three.js doesn't run SSR where window/canvas aren't available.
const Scene3D = dynamic(() => import("~/components/Scene3D"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {/* ─── Preloader (fullscreen, exits via slide-up) ─── */}
      <Preloader onComplete={onPreloaderComplete} />

      {/* ─── Custom Cursor (desktop only) ─── */}
      <CustomCursor />

      {loaded && (
        <>
          {/* ─── Section-Aware 3D Scene ────────────────────────────
              Positioned fixed to the RIGHT side of the screen only.
              Does NOT overlap the main text content (which lives on
              the left 55% of the viewport). The scene morphs its
              geometry to visually represent each section as the user
              scrolls, just like lundeveloper's approach.
          ─────────────────────────────────────────────────────── */}
          {/* <Scene3D /> */}

          {/* ─── Smooth Scroll Wrapper ─── */}
          <SmoothScroll>
            {/* Background video — very subtle, only in hero area */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: "45vw", // only behind text, not behind 3D scene
                height: "100vh",
                zIndex: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.08,
                }}
              >
                <source src="/videos/rand.mp4" type="video/mp4" />
              </video>
            </div>

            <Navigation />
            <Home />
          </SmoothScroll>
        </>
      )}

      {/* ─── Cursor CSS ─── */}
      <style>{`
        .cursor-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C9A84C;
          pointer-events: none;
          z-index: 99998;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
        }
        .cursor-ring {
          position: fixed;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.5);
          pointer-events: none;
          z-index: 99997;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        .cursor-dot.hovering  { width: 10px; height: 10px; background: #F5C842; }
        .cursor-ring.hovering { width: 48px; height: 48px; border-color: rgba(201,168,76,0.8); }

        /* On mobile, hide the 3D scene canvas area to reclaim full width */
        @media (max-width: 768px) {
          .scene3d-panel { display: none !important; }
        }
      `}</style>
    </>
  );
}
