

"use client";

import { useCallback, useRef, useState } from "react";
import { getVoiceManager } from "~/lib/voice-utils";

export interface UseVoiceChatReturn {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string; 
  error: string | null;
  isSupported: boolean;
  isTTSSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  clearError: () => void;
}

function errToString(e: unknown): string {
  if (!e) return "";
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return String(e);
}

export function useVoiceChat(
  onFinalTranscript?: (text: string) => void,
): UseVoiceChatReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState(""); 
  const [interimTranscript, setInterimTranscript] = useState(""); 
  const [error, setError] = useState<string | null>(null);

  const interimRef = useRef("");

  const vm = getVoiceManager();
  const isSupported = vm.isSupported();
  const isTTSSupported = vm.isSynthesisSupported();

  const clearError = useCallback(() => setError(null), []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError(
        "Speech recognition is not supported in this browser. Try Chrome.",
      );
      return;
    }

    setError(null);
    setInterimTranscript("");
    interimRef.current = "";
    setIsListening(true);

    const started = await vm.startListening(
      (text, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript("");
          interimRef.current = "";
          setIsListening(false);
          onFinalTranscript?.(text);
        } else {
          setInterimTranscript(text);
          interimRef.current = text;
        }
      },
      (err) => {
        setError(errToString(err));
        setIsListening(false);
        setInterimTranscript("");
      },
      {
        language: "en-IN", 
        continuous: false,
        interimResults: true,
      },
    );

    if (!started) {
      setIsListening(false);
    }
  }, [isSupported, vm, onFinalTranscript]);

  const stopListening = useCallback(() => {
    vm.stopListening();
    if (interimRef.current) {
      const captured = interimRef.current;
      setTranscript(captured);
      setInterimTranscript("");
      interimRef.current = "";
      onFinalTranscript?.(captured);
    }
    setIsListening(false);
  }, [vm, onFinalTranscript]);

  const speakText = useCallback(
    (text: string) => {
      if (!isTTSSupported) {
        setError("Text-to-speech is not supported in this browser.");
        return;
      }
      if (!text.trim()) return;

      setIsSpeaking(true);
      setError(null);

      const ok = vm.speak(
        text,
        () => setIsSpeaking(false), 
        (err) => {
          setIsSpeaking(false);
          setError(errToString(err));
        },
      );

      if (!ok) setIsSpeaking(false);
    },
    [vm, isTTSSupported],
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    error,
    isSupported,
    isTTSSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    clearError,
  };
}