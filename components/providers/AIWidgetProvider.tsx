"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AIAssistantWidget } from "~/components/widgets/AIAssistantWidget";

export const SpeechContext = createContext({ supported: true, ready: false });

export const useSpeechContext = () => useContext(SpeechContext);

interface AIWidgetProviderProps {
  children: React.ReactNode;
  position?: "bottom-right" | "bottom-left";
  defaultOpen?: boolean;
}

export function AIWidgetProvider({
  children,
  position = "bottom-right",
  defaultOpen = false,
}: AIWidgetProviderProps) {
  const [speechState, setSpeechState] = useState({
    supported: true,
    ready: false,
  });

  // Track initialization so we don't spam the reset on every re-render
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.speechSynthesis) {
      console.warn("[Voice Engine] SpeechSynthesis API not supported.");
      setSpeechState({ supported: false, ready: false });
      return;
    }

    // ─── THE AUTOMATED DEFIBRILLATOR ───
    // Forces Chrome's audio engine to wake up and clear invisible jams
    const wakeUpEngine = () => {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();

        // The Secret Sauce: Force a silent, empty utterance through the pipe
        const wakeUpPing = new SpeechSynthesisUtterance("");
        wakeUpPing.volume = 0;
        wakeUpPing.rate = 10;
        window.speechSynthesis.speak(wakeUpPing);

        window.speechSynthesis.cancel();
        console.log(
          "[Voice Engine] ⚡ Engine shocked awake and queue cleared.",
        );
      } catch (e) {
        console.warn("[Voice Engine] Failed to wake up TTS:", e);
      }
    };

    if (!initialized.current) {
      wakeUpEngine();
      initialized.current = true;
    }

    // ─── SAFE VOICE LOADING ───
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log(`[Voice Engine] Ready. Loaded ${voices.length} voices.`);
        setSpeechState({ supported: true, ready: true });
        return true;
      }
      return false;
    };

    // Browsers fetch voices asynchronously. Try immediately, then listen.
    if (!loadVoices()) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };
    }

    // Failsafe timeout so your app never hangs waiting for the browser
    const fallbackTimer = setTimeout(() => {
      if (!speechState.ready) {
        console.warn("[Voice Engine] Timeout reached, forcing ready state.");
        setSpeechState((prev) => ({ ...prev, ready: true }));
      }
    }, 1500);

    // ─── THE CRASH PREVENTER ───
    // This is the most important part for Next.js development.
    // It kills the audio right BEFORE React hot-reloads or the user leaves the page,
    // which prevents Chrome from creating the "zombie" process that breaks TTS.
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechState.ready]);

  return (
    <SpeechContext.Provider value={speechState}>
      {children}
      <AIAssistantWidget position={position} defaultOpen={defaultOpen} />
    </SpeechContext.Provider>
  );
}
