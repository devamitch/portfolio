"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState = "idle" | "listening" | "speaking";

interface UseVoiceOptions {
  onTranscript?: (text: string) => void;
  lang?: string;
}

// Enhanced voice selection with better scoring
const FEMALE_KW =
  /female|woman|zira|hazel|kalpana|heera|priya|neerja|lekha|aditi|fiona|karen|moira|tessa|veena|samantha/i;
const AVOID_KW = /compact|mobile|junior|novelty/i;

function pickBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    if (FEMALE_KW.test(v.name)) return -1;
    if (AVOID_KW.test(v.name)) return -1;

    let s = 0;

    // Premium voices (Azure Neural TTS)
    if (name.includes("natural")) s += 100;
    if (name.includes("prabhat")) s += 90;

    // Apple Premium voices
    if (name.includes("premium") || name.includes("enhanced")) s += 80;
    if (name.includes("rishi")) s += 75;

    // Google voices (Chrome)
    if (name === "google uk english male") s += 70;
    if (name === "google us english") s += 60;
    if (name.includes("google") && lang.startsWith("en-")) s += 55;

    // macOS system voices
    if (name.includes("daniel")) s += 50;
    if (name.includes("arthur")) s += 50;
    if (name.includes("oliver")) s += 45;

    // Microsoft Edge voices
    if (
      name.includes("ryan") ||
      name.includes("thomas") ||
      name.includes("guy")
    )
      s += 48;

    // Language preference
    if (lang === "en-gb") s += 20;
    if (lang === "en-au") s += 15;
    if (lang === "en-us") s += 10;
    if (lang === "en-in") s += 5;

    return s;
  };

  const sortedVoices = voices
    .map((v) => ({ v, s: score(v) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  const bestVoice = sortedVoices[0]?.v ?? null;

  if (bestVoice) {
    console.log(
      "[Voice] Selected:",
      bestVoice.name,
      bestVoice.lang,
      "Score:",
      sortedVoices[0]?.s,
    );
  }

  return bestVoice;
}

function preprocessText(text: string): string {
  return text
    .replace(/\bRAG\b/g, "R. A. G.")
    .replace(/\bAI\b/g, "A. I.")
    .replace(/\bAPI\b/g, "A. P. I.")
    .replace(/\bLLM\b/g, "L. L. M.")
    .replace(/\bSQL\b/g, "S. Q. L.")
    .replace(/\bCI\/CD\b/g, "C. I., C. D.")
    .replace(/\bHIPAA\b/g, "HIP-PAH")
    .replace(/\bDeFi\b/gi, "Dee Fy")
    .replace(/\bNFT\b/g, "N. F. T.")
    .replace(/\bWeb3\b/gi, "Web Three")
    .replace(/\bNext\.js\b/gi, "Next J S")
    .replace(/\bNode\.js\b/gi, "Node J S")
    .replace(/\bNestJS\b/gi, "Nest J S")
    .replace(/Amit Chakraborty/gi, "Ah-meet Chock-ra-bor-tee")
    .replace(/Amit/gi, "Ah-meet")
    .replace(/—/g, ". ")
    .replace(/\.\.\./g, " ")
    .trim();
}

// Enhanced speak function with multiple fallback strategies
export function speakText(
  text: string,
  onEnd?: () => void,
  options?: { rate?: number; pitch?: number; retryCount?: number },
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.error("[Voice] Speech synthesis not supported");
    return null;
  }

  if (!text.trim()) {
    console.warn("[Voice] Empty text provided");
    return null;
  }

  const retryCount = options?.retryCount ?? 0;

  // Cancel any ongoing speech
  try {
    window.speechSynthesis.cancel();
  } catch (e) {
    console.warn("[Voice] Error canceling speech:", e);
  }

  const processed = preprocessText(text);
  const utter = new SpeechSynthesisUtterance(processed);

  // Cinematic settings
  utter.rate = options?.rate ?? 0.88;
  utter.pitch = options?.pitch ?? 0.85;
  utter.volume = 1.0;

  let hasEnded = false;

  const safeEnd = () => {
    if (hasEnded) return;
    hasEnded = true;
    console.log("[Voice] Speech ended");
    if (onEnd) onEnd();
  };

  const applyVoice = () => {
    const voice = pickBestVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = "en-GB";
      console.warn("[Voice] No suitable voice found, using default en-GB");
    }
  };

  // Timeout fallback (in case speech events don't fire)
  const estimatedDuration =
    ((processed.length / 10) * 1000) / (utter.rate || 1);
  const timeoutId = setTimeout(() => {
    console.warn("[Voice] Speech timeout reached");
    safeEnd();
  }, estimatedDuration + 2000);

  utter.onend = () => {
    clearTimeout(timeoutId);
    safeEnd();
  };

  utter.onerror = (event) => {
    clearTimeout(timeoutId);
    console.error("[Voice] Speech error:", event.error);

    // Retry logic for certain errors
    if (
      retryCount < 2 &&
      (event.error === "interrupted" || event.error === "canceled")
    ) {
      console.log("[Voice] Retrying speech...");
      setTimeout(() => {
        speakText(text, onEnd, { ...options, retryCount: retryCount + 1 });
      }, 100);
    } else {
      safeEnd();
    }
  };

  const speak = () => {
    try {
      applyVoice();
      console.log(
        "[Voice] Starting speech:",
        processed.substring(0, 50) + "...",
      );
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error("[Voice] Error speaking:", e);
      clearTimeout(timeoutId);
      safeEnd();
    }
  };

  // Get voices and speak
  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    speak();
  } else {
    console.log("[Voice] Waiting for voices to load...");

    const voicesChangedHandler = () => {
      console.log("[Voice] Voices loaded");
      speak();
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      voicesChangedHandler,
      { once: true },
    );

    // Fallback if voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        voicesChangedHandler,
      );
      if (!hasEnded) {
        console.warn(
          "[Voice] voiceschanged timeout, attempting to speak anyway",
        );
        speak();
      }
    }, 1000);
  }

  return utter;
}

export function useVoice({
  onTranscript,
  lang = "en-IN",
}: UseVoiceOptions = {}) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) &&
    "speechSynthesis" in window;

  // Preload voices on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log("[Voice] Loaded voices:", voices.length);
      };

      loadVoices();
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  const listen = useCallback(() => {
    if (!isSupported) {
      setError("Voice input not supported — use Chrome or Edge.");
      return;
    }

    window.speechSynthesis?.cancel();
    setVoiceState("idle");

    const SR: any =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;

    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState("listening");
      setError(null);
    };

    recognition.onresult = (e: any) => {
      const text: string = e.results[0]?.[0]?.transcript ?? "";
      if (text.trim()) {
        setTranscript(text.trim());
        onTranscriptRef.current?.(text.trim());
      }
      setVoiceState("idle");
    };

    recognition.onerror = (e: any) => {
      const msg: Record<string, string> = {
        "no-speech": "No speech detected — try again.",
        "not-allowed": "Microphone access denied.",
        network: "Network error — check your connection.",
        "audio-capture": "No microphone found.",
        aborted: "",
      };
      const friendly = msg[e.error] ?? "Voice recognition failed.";
      if (friendly) setError(friendly);
      setVoiceState("idle");
    };

    recognition.onend = () => {
      setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError("Could not start voice input.");
      setVoiceState("idle");
    }
  }, [isSupported, lang]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setVoiceState("idle");
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    setVoiceState("speaking");
    setError(null);
    speakText(text, () => setVoiceState("idle"));
  }, []);

  const stopSpeaking = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch (e) {
      console.warn("[Voice] Error stopping speech:", e);
    }
    setVoiceState("idle");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return {
    voiceState,
    isListening: voiceState === "listening",
    isSpeaking: voiceState === "speaking",
    transcript,
    error,
    isSupported,
    listen,
    stopListening,
    speak,
    stopSpeaking,
    clearError,
  };
}
