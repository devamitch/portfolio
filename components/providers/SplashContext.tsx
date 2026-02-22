"use client";
// Shared signal: AllProvider → AIAssistantWidget
// When the flying orb lands, splashDone flips true and widget orb fades in.

import { createContext, useContext } from "react";

interface SplashCtx {
  splashDone: boolean;
}

export const SplashContext = createContext<SplashCtx>({ splashDone: false });
export const useSplash = () => useContext(SplashContext);
