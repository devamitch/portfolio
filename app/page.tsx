"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import CustomCursor from "~/components/CustomCursor";
import Home from "~/components/Home";
import Navigation from "~/components/Navigation";
import Preloader from "~/components/Preloader";
import SmoothScroll from "~/components/SmoothScroll";

// ─── CRITICAL FIX ─────────────────────────────────────────────
// DO NOT statically import Scene3D. @react-three/fiber bundles
// its own react-reconciler which accesses React internals
// (ReactCurrentOwner) that changed in React 19. A static import
// causes that module to evaluate at bundle time inside the same
// webpack chunk as the page, before React is ready — crash.
//
// dynamic() with ssr:false defers the entire R3F module graph
// to client-side only, where a single React instance exists.
// ──────────────────────────────────────────────────────────────
const Scene3D = dynamic(() => import("~/components/Scene3D"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {/* Preloader */}
      <Preloader onComplete={onPreloaderComplete} />

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* 3D Background Scene — lazy, client-only */}
      {/* {loaded && <Scene3D />} */}

      {/* Smooth Scroll + Navigation + Content */}
      {loaded && (
        <SmoothScroll>
          <div className="absolute inset-0 top-52 z-0">
            <video
              autoPlay
              loop
              muted
              className="h-full w-full object-cover opacity-20"
            >
              <source src={"videos/rand.mp4"} type="video/mp4" />
            </video>
          </div>
          <Navigation />
          <Home />
        </SmoothScroll>
      )}
    </>
  );
}
