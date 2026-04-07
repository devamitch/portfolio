"use client";

import { SplashContext } from "./SplashContext";

/**
 * AllProvider — minimal pass-through.
 * splashDone is always true — no blocking animation, no orb, no delay.
 */
export default function AllProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SplashContext.Provider value={{ splashDone: true }}>
      {children}
    </SplashContext.Provider>
  );
}
