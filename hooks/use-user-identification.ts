"use client";

/**
 * ~/hooks/use-user-identification.ts
 *
 * Uses portfolioState (Zustand persist) exclusively — no direct localStorage access.
 * portfolioState already persists visitorId to localStorage via zustand/middleware/persist.
 *
 * DEV mode  (NODE_ENV === "development"):
 *   - If visitorId is null in state  → brand new visitor for this browser
 *   - Generate a dev ID and store via setVisitorId (portfolioState persists it)
 *   - isNewUser = true for that session
 *
 * PROD mode:
 *   - Call /api/analytics/identify with the stored visitorId (or undefined if null)
 *   - Firebase decides if it's new or returning based on ID + IP matching
 *   - Update portfolioState accordingly
 */

import { useEffect, useRef } from "react";
import { usePortfolioState } from "~/store/portfolio-state";

const isDevelopment = process.env.NODE_ENV === "development";

export function useUserIdentification() {
  const {
    visitorId,
    setVisitorId,
    isNewUser,
    setIsNewUser,
    isFirstTimeVisitor,
    setIsFirstTimeVisitor,
    userName,
    isVerified,
    setIsVerified,
    isIdentifying,
    setIsIdentifying,
    setVisitorMetadata,
    incrementVisitCount,
    hasGreetedUser,
  } = usePortfolioState();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function identify() {
      setIsIdentifying(true);

      try {
        if (isDevelopment) {
          // ── DEV MODE ─────────────────────────────────────────────────────
          // portfolioState.visitorId is the source of truth — it's already
          // persisted to localStorage by zustand. No separate localStorage calls needed.

          if (!visitorId) {
            // Brand new visitor — no stored ID in portfolioState
            const newId = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
            console.log("[ID] DEV — NEW visitor, assigning ID:", newId);

            setVisitorId(newId);
            setIsNewUser(true);
            // isFirstTimeVisitor stays true (persisted default)
          } else {
            // Returning visitor — visitorId already in portfolioState
            console.log("[ID] DEV — RETURNING visitor, ID:", visitorId);
            setIsNewUser(false);
          }

          setIsVerified(true);
          incrementVisitCount();
          setIsIdentifying(false);
          return;
        }

        // ── PROD MODE ───────────────────────────────────────────────────────
        const metadata = {
          browser: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          lastVisit: new Date().toISOString(),
        };

        setVisitorMetadata(metadata);

        const response = await fetch("/api/analytics/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Pass existing visitorId so Firebase can try to match it
            visitorId: visitorId ?? undefined,
            metadata,
          }),
        });

        const data = await response.json();

        if (data.identified && data.profile) {
          // Returning visitor identified by Firebase (by ID or IP match)
          console.log("[ID] PROD — RETURNING visitor:", data.profile.id);

          setVisitorId(data.profile.id);
          setIsNewUser(false);

          if (data.profile.name) {
            usePortfolioState.getState().setUserName(data.profile.name);
          }
          if (data.profile.profileComplete) {
            usePortfolioState
              .getState()
              .setIsProfileComplete(data.profile.profileComplete);
          }
          // They've been here before — definitely not first time
          setIsFirstTimeVisitor(false);
        } else {
          // New visitor — Firebase created a new record
          const newId =
            data.visitorId ??
            data.profile?.id ??
            `prod-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

          console.log("[ID] PROD — NEW visitor, assigned ID:", newId);

          setVisitorId(newId);
          setIsNewUser(true);
          // isFirstTimeVisitor stays true until onboarding completes

          // Track the new session
          await fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "session_start",
              visitorId: newId,
              ua: navigator.userAgent,
              tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          }).catch(() => {
            /* non-fatal */
          });
        }

        setIsVerified(true);
        incrementVisitCount();
      } catch (error) {
        console.error("[ID] Identification failed:", error);

        // Fallback — generate a session ID and continue
        const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        if (!visitorId) {
          setVisitorId(fallbackId);
          setIsNewUser(true);
        } else {
          setIsNewUser(false);
        }
        setIsVerified(true);
      } finally {
        setIsIdentifying(false);
      }
    }

    // Small delay to ensure hydration from localStorage is complete
    setTimeout(identify, 150);
  }, []); // runs once on mount

  return {
    isNewUser,
    isFirstTimeVisitor,
    isVerified,
    isIdentifying,
    visitorId,
    userName,
    hasGreetedUser,
  };
}
