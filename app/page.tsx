"use client";

import { useCallback, useEffect } from "react";
import CustomCursor from "~/components/home-comonents/layout/CustomCursor";
import Navigation from "~/components/home-comonents/layout/Navigation";
import Preloader from "~/components/home-comonents/layout/Preloader";
import Seo from "~/components/home-comonents/layout/Seo";
import SmoothScroll from "~/components/home-comonents/layout/SmoothScroll";
import PrimaryHome from "~/components/pages/Home";
import { AIWidgetProvider } from "~/components/providers/AIWidgetProvider";
import { usePortfolioState } from "~/store/portfolio-state";

export default function Page() {
  const hasSeenPreloader = usePortfolioState((s) => s.hasSeenPreloader);
  const setHasSeenPreloader = usePortfolioState((s) => s.setHasSeenPreloader);

  const onPreloaderComplete = useCallback(() => {
    setHasSeenPreloader(true);
  }, [setHasSeenPreloader]);

  // Safe: only runs client-side after mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return (
    <>
      <Seo />
      <CustomCursor />
      {!hasSeenPreloader ? (
        <Preloader onComplete={onPreloaderComplete} />
      ) : (
        <AIWidgetProvider>
          <SmoothScroll>
            <Navigation />
            <PrimaryHome />
          </SmoothScroll>
        </AIWidgetProvider>
      )}
    </>
  );
}
