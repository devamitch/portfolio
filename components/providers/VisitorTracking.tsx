"use client";

import { useEffect, useRef } from "react";
import { usePortfolioState } from "~/store/portfolio-state";

export function VisitorTracking({ children }: { children: React.ReactNode }) {
  const {
    visitorId,
    setVisitorId,
    setUserName,
    incrementVisitCount,
    isOwner,
    setIsVerified,
    setIsIdentifying,
    setVisitorMetadata,
    setIsProfileComplete,
  } = usePortfolioState();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function initTracking() {
      setIsIdentifying(true);

      const metadata = {
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
        screen: `${window.innerWidth}x${window.innerHeight}`,
        network: (navigator as any).connection?.effectiveType || "unknown",
      };

      setVisitorMetadata(metadata);

      try {
        const res = await fetch("/api/analytics/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: visitorId,
            metadata: metadata,
          }),
        });

        const data = await res.json();

        if (data.identified && data.profile) {
          if (!visitorId) setVisitorId(data.profile.id);
          if (data.profile.name) setUserName(data.profile.name);
          if (data.profile.profileComplete) setIsProfileComplete(true);
        } else if (!visitorId) {
          const newId =
            crypto.randomUUID?.() ||
            Math.random().toString(36).substring(2, 15);
          setVisitorId(newId);
        }

        incrementVisitCount();
        setIsVerified(true);
      } catch (err) {
        console.error("[tracking] Identification failed:", err);
        setIsVerified(true); // Don't block user if API fails
      } finally {
        setIsIdentifying(false);
      }
    }

    initTracking();
  }, []);

  return <>{children}</>;
}
