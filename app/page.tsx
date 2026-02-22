"use client";

import { useCallback } from "react";
import CustomCursor from "~/components/CustomCursor";
import PrimaryHome from "~/components/Home";
import Navigation from "~/components/Navigation";
import Preloader from "~/components/Preloader";
import SmoothScroll from "~/components/SmoothScroll";
import {
  AIWidgetProvider,
  useSpeechContext,
} from "~/components/providers/AIWidgetProvider";
import { usePortfolioState } from "~/store/portfolio-state";

window.speechSynthesis.cancel();

export default function Page() {
  const hasSeenPreloader = usePortfolioState((s) => s.hasSeenPreloader);
  const setHasSeenPreloader = usePortfolioState((s) => s.setHasSeenPreloader);

  const onPreloaderComplete = useCallback(() => {
    setHasSeenPreloader(true);
  }, [setHasSeenPreloader]);

  const { supported, ready } = useSpeechContext();

  return (
    <>
      <CustomCursor />
      {!hasSeenPreloader ? (
        <Preloader onComplete={onPreloaderComplete} />
      ) : (
        <AIWidgetProvider>
          <SmoothScroll>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: "45vw",
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
            <PrimaryHome />
          </SmoothScroll>
        </AIWidgetProvider>
      )}

      <style>{`
        .cursor-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          borderRadius: 50%;
          background: #C9A84C;
          pointerEvents: none;
          zIndex: 99998;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background 0.2s;
        }
        .cursor-ring {
          position: fixed;
          width: 32px;
          height: 32px;
          borderRadius: 50%;
          border: 1px solid rgba(201,168,76,0.5);
          pointerEvents: none;
          zIndex: 99997;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s, border-color 0.3s;
        }
        .cursor-dot.hovering  { width: 10px; height: 10px; background: #F5C842; }
        .cursor-ring.hovering { width: 48px; height: 48px; border-color: rgba(201,168,76,0.8); }

        @media (max-width: 768px) {
          .scene3d-panel { display: none !important; }
        }
      `}</style>
    </>
  );
}
