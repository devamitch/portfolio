"use client";

/**
 * useVoice — clean, minimal voice hook
 * STT: Web Speech API, en-IN locale
 * TTS: SpeechSynthesis — prioritizes natural Google/Edge neural voices
 *      (same logic as Preloader.tsx — Google UK Male > Google US > Edge Neural > en-GB)
 * State machine: idle → listening → speaking
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState = "idle" | "listening" | "speaking";

interface UseVoiceOptions {
  onTranscript?: (text: string) => void;
  lang?: string;
}

// ─── Voice selection (matches Preloader logic) ────────────────────────────────
const FEMALE_KW =
  /female|woman|zira|hazel|kalpana|heera|priya|neerja|lekha|aditi|fiona|karen|moira|tessa|veena|samantha/i;
const AVOID_KW = /compact|mobile|junior/i;

function pickBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    if (FEMALE_KW.test(v.name)) return -1;
    if (AVOID_KW.test(v.name)) return -1;

    // Microsoft Edge "Online (Natural)" voices = Azure Neural TTS, most human
    if (name.includes("natural")) return 100;
    // Prabhat = Indian Male Azure Neural
    if (name.includes("prabhat")) return 90;

    // Apple Premium / Enhanced voices (Rishi = Indian Male)
    if (name.includes("premium") || name.includes("enhanced")) return 80;
    if (name.includes("rishi")) return 75;

    // Google voices — widely available in Chrome, very natural
    if (name === "google uk english male") return 70;
    if (name === "google us english") return 60;
    if (name.includes("google") && lang.startsWith("en-")) return 55;

    // macOS system voices
    if (name.includes("daniel")) return 50; // UK male
    if (name.includes("arthur")) return 50; // UK male
    if (name.includes("oliver")) return 45;

    // Microsoft Edge standard voices
    if (
      name.includes("ryan") ||
      name.includes("thomas") ||
      name.includes("guy")
    )
      return 48;

    // Language tiebreakers
    if (lang === "en-gb") return 20;
    if (lang === "en-au") return 15;
    if (lang === "en-us") return 10;
    if (lang === "en-in") return 5; // en-IN last — most robotic on most systems

    return 0;
  };

  return (
    voices
      .map((v) => ({ v, s: score(v) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)[0]?.v ?? null
  );
}

// ─── Speech preprocessing ─────────────────────────────────────────────────────
function preprocessText(text: string): string {
  return text
    .replace(/\bRAG\b/g, "R. A. G.")
    .replace(/\bAI\b/g, "A. I.")
    .replace(/\bAPI\b/g, "A. P. I.")
    .replace(/\bLLM\b/g, "L. L. M.")
    .replace(/\bSQL\b/g, "S. Q. L.")
    .replace(/\bCI\/CD\b/g, "C. I., C. D.")
    .replace(/\bHIPAA\b/g, "HIPPA")
    .replace(/\bDeFi\b/gi, "Dee Fy")
    .replace(/\bNFT\b/g, "N. F. T.")
    .replace(/\bWeb3\b/gi, "Web Three")
    .replace(/\bNext\.js\b/gi, "Next JS")
    .replace(/\bNode\.js\b/gi, "Node JS")
    .replace(/\bNestJS\b/gi, "Nest JS")
    .replace(/—/g, ". ")
    .replace(/\.\.\./g, " ")
    .trim();
}

// ─── Core speak function (exported for use outside hook) ──────────────────────
export function speakText(
  text: string,
  onEnd?: () => void,
  options?: { rate?: number; pitch?: number },
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (!text.trim()) return null;

  window.speechSynthesis.cancel();
  const processed = preprocessText(text);
  const utter = new SpeechSynthesisUtterance(processed);

  // Calm, deliberate executive cadence — not robotic, not rushed
  utter.rate = options?.rate ?? 0.92;
  utter.pitch = options?.pitch ?? 1.0;
  utter.volume = 1;

  const apply = () => {
    const voice = pickBestVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = "en-GB"; // fallback — UK sounds more measured than US
    }
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    apply();
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  } else {
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        apply();
        if (onEnd) utter.onend = onEnd;
        window.speechSynthesis.speak(utter);
      },
      { once: true },
    );
  }

  return utter;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
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

  // ── STT ───────────────────────────────────────────────────────────────────
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
        "not-allowed":
          "Microphone access denied. Allow it in browser settings.",
        network: "Network error — check your connection.",
        "audio-capture": "No microphone found.",
        aborted: "",
      };
      const friendly = msg[e.error] ?? "Voice recognition failed — try again.";
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

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    setVoiceState("speaking");
    setError(null);
    speakText(text, () => setVoiceState("idle"));
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setVoiceState("idle");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Cleanup
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
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
