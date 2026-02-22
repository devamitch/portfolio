/**
 * VoiceButton — dark/gold theme
 * STT with live interim transcript + TTS readback toggle
 * Uses Indian male voice via voice-utils
 */
"use client";

import { Mic, Square, Volume2, VolumeX } from "lucide-react";
import { useCallback, useState } from "react";
import { useVoiceChat } from "~/hooks/use-voice-chat";

const C = {
  bg: "#050505",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  vfaint: "rgba(255,255,255,0.24)",
  ghost: "rgba(255,255,255,0.10)",
  border: "rgba(255,255,255,0.07)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldG: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
  red: "#FF4444",
  green: "#34D399",
} as const;

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  /** If provided, speaking toggle appears and this text is read aloud */
  lastAssistantMessage?: string;
  disabled?: boolean;
}

export function VoiceButton({
  onTranscript,
  lastAssistantMessage,
  disabled = false,
}: VoiceButtonProps) {
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const {
    isListening,
    isSpeaking,
    interimTranscript,
    transcript,
    error,
    isSupported,
    isTTSSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    clearError,
  } = useVoiceChat((finalText) => {
    onTranscript(finalText);
  });

  const handleMicClick = useCallback(async () => {
    clearError();
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening, clearError]);

  const handleTTSToggle = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    if (!ttsEnabled) {
      setTtsEnabled(true);
      if (lastAssistantMessage) speakText(lastAssistantMessage);
    } else {
      setTtsEnabled(false);
      stopSpeaking();
    }
  }, [isSpeaking, ttsEnabled, lastAssistantMessage, speakText, stopSpeaking]);

  if (!isSupported) {
    return (
      <p style={{ fontSize: "11px", color: C.vfaint, fontStyle: "italic" }}>
        Voice not supported — try Chrome or Edge
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* ── Mic button ── */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled}
          title={
            isListening
              ? "Stop recording"
              : "Start voice input (Indian English)"
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: disabled ? 0.4 : 1,
            background: isListening ? "rgba(255,68,68,0.12)" : C.goldF,
            border: `1px solid ${isListening ? "rgba(255,68,68,0.4)" : C.goldD}`,
            color: isListening ? C.red : C.gold,
          }}
        >
          {isListening ? (
            <>
              <Square size={11} fill="currentColor" />
              <span>Stop</span>
              {/* pulse dot */}
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: C.red,
                  display: "inline-block",
                  animation: "pulseDot 1s infinite",
                }}
              />
            </>
          ) : (
            <>
              <Mic size={11} />
              <span>Voice</span>
            </>
          )}
        </button>

        {/* ── TTS readback toggle ── */}
        {isTTSSupported && (
          <button
            type="button"
            onClick={handleTTSToggle}
            disabled={disabled}
            title={
              isSpeaking
                ? "Stop speaking"
                : ttsEnabled
                  ? "TTS on — click to disable"
                  : "Read response aloud"
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: disabled ? 0.4 : 1,
              background: isSpeaking
                ? C.goldF
                : ttsEnabled
                  ? "rgba(52,211,153,0.08)"
                  : C.ghost,
              border: `1px solid ${isSpeaking ? C.goldD : ttsEnabled ? "rgba(52,211,153,0.3)" : C.border}`,
              color: isSpeaking ? C.gold : ttsEnabled ? C.green : C.faint,
            }}
          >
            {isSpeaking ? (
              <>
                <Volume2
                  size={11}
                  style={{ animation: "pulseDot 1s infinite" }}
                />
                <span>Speaking…</span>
              </>
            ) : ttsEnabled ? (
              <>
                <Volume2 size={11} />
                <span>TTS On</span>
              </>
            ) : (
              <>
                <VolumeX size={11} />
                <span>TTS Off</span>
              </>
            )}
          </button>
        )}

        {/* ── Listening status ── */}
        {isListening && (
          <span
            style={{
              fontSize: "11px",
              color: C.red,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: C.red,
                display: "inline-block",
                animation: "pulseDot 1s infinite",
              }}
            />
            Listening…
          </span>
        )}
      </div>

      {/* ── Live interim transcript ── */}
      {isListening && interimTranscript && (
        <div
          style={{
            fontSize: "12px",
            color: C.dim,
            fontStyle: "italic",
            padding: "8px 12px",
            background: C.ghost,
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            maxHeight: "64px",
            overflowY: "auto",
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: C.faint,
              fontStyle: "normal",
              display: "block",
              marginBottom: "2px",
            }}
          >
            Hearing…
          </span>
          {interimTranscript}
        </div>
      )}

      {/* ── Last final transcript (confirmation) ── */}
      {!isListening && transcript && (
        <div
          style={{
            fontSize: "11px",
            color: C.faint,
            padding: "5px 10px",
            background: C.goldF,
            border: `1px solid ${C.goldD}`,
            borderRadius: "8px",
          }}
        >
          <span style={{ color: C.gold, fontWeight: 600 }}>Sent: </span>
          {transcript}
        </div>
      )}

      {/* ── Error — always string, never object ── */}
      {error && (
        <div
          style={{
            fontSize: "11px",
            color: "#FF6666",
            padding: "6px 10px",
            background: "rgba(255,68,68,0.08)",
            border: "1px solid rgba(255,68,68,0.2)",
            borderRadius: "8px",
            display: "flex",
            gap: "6px",
            alignItems: "flex-start",
          }}
        >
          <span style={{ flexShrink: 0 }}>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
