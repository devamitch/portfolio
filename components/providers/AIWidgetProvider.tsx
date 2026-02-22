"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AIAssistantWidget } from "~/components/widgets/AIAssistantWidget";
import { LiquidGoldAnimation } from "../ui/LiquidGoldAnimation";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.speechSynthesis) {
      console.warn("[Voice Engine] SpeechSynthesis API not supported.");
      setSpeechState({ supported: false, ready: false });
      return;
    }

    const wakeUpEngine = () => {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();

        const wakeUpPing = new SpeechSynthesisUtterance("");
        wakeUpPing.volume = 0;
        wakeUpPing.rate = 10;
        window.speechSynthesis.speak(wakeUpPing);

        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("[Voice Engine] Failed to wake up TTS:", e);
      }
    };

    if (!initialized.current) {
      wakeUpEngine();
      initialized.current = true;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setSpeechState({ supported: true, ready: true });
        return true;
      }
      return false;
    };

    if (!loadVoices()) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };
    }

    const fallbackTimer = setTimeout(() => {
      if (!speechState.ready) {
        console.warn("[Voice Engine] Timeout reached, forcing ready state.");
        setSpeechState((prev) => ({ ...prev, ready: true }));
      }
    }, 1500);

    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechState.ready]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#030303",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Mono', 'Courier New', monospace",
        }}
      >
        <LiquidGoldAnimation
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
          speed={0.03}
          intensity={6}
          particleCount={60}
        />
      </div>
    );
  }

  return (
    <SpeechContext.Provider value={speechState}>
      {children}
      <AIAssistantWidget position={position} />
    </SpeechContext.Provider>
  );
}
