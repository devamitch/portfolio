"use client";

import { MicIcon, MicOffIcon } from "lucide-react";
import type { VoiceState } from "~/hooks/use-voice";

const C = {
  gold: "#C9A84C",
  goldL: "#F5C842",
  goldD: "rgba(201,168,76,0.15)",
  red: "#FF4444",
  redD: "rgba(255,68,68,0.15)",
  green: "#34D399",
  greenD: "rgba(52,211,153,0.12)",
  border: "rgba(255,255,255,0.07)",
  bg3: "#0F0F0F",
  dim: "rgba(255,255,255,0.55)",
} as const;

interface MicButtonProps {
  voiceState: VoiceState;
  isSupported: boolean;
  transcript?: string;
  error?: string | null;
  onMicClick: () => void;
  onStopSpeaking?: () => void;
  className?: string;
}

export function MicButton({
  voiceState,
  isSupported,
  transcript,
  error,
  onMicClick,
  onStopSpeaking,
  className = "",
}: MicButtonProps) {
  const isListening = voiceState === "listening";
  const isSpeaking = voiceState === "speaking";

  if (!isSupported) {
    return (
      <div
        title="Voice not supported in this browser"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.3,
          cursor: "not-allowed",
          flexShrink: 0,
        }}
        className={className}
      >
        <MicOffIcon size={16} color={C.dim} />
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8 }}
      className={className}
    >
      {}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {}
        {isListening && (
          <>
            <style>{`
              @keyframes mic-ring {
                0%   { transform: scale(1);   opacity: 0.6; }
                100% { transform: scale(2.2); opacity: 0;   }
              }
            `}</style>
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${C.red}`,
                animation: "mic-ring 1.2s ease-out infinite",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${C.red}`,
                animation: "mic-ring 1.2s ease-out 0.4s infinite",
              }}
            />
          </>
        )}

        {}
        {isSpeaking && (
          <>
            <style>{`
              @keyframes wave-bar {
                0%, 100% { transform: scaleY(0.3); }
                50%       { transform: scaleY(1);   }
              }
            `}</style>
            <span
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                background: C.greenD,
                border: `1px solid rgba(52,211,153,0.25)`,
              }}
            />
          </>
        )}

        <button
          onClick={isSpeaking ? onStopSpeaking : onMicClick}
          title={
            isListening
              ? "Listening... click to cancel"
              : isSpeaking
                ? "Speaking... click to stop"
                : "Click to speak"
          }
          style={{
            position: "relative",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `1.5px solid ${
              isListening ? C.red : isSpeaking ? C.green : C.gold
            }`,
            background: isListening ? C.redD : isSpeaking ? C.greenD : C.goldD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            flexShrink: 0,
            outline: "none",
          }}
        >
          {isSpeaking ? (
            <WaveBars />
          ) : isListening ? (
            <MicIcon size={16} color={C.red} />
          ) : (
            <MicIcon size={16} color={C.gold} />
          )}
        </button>
      </div>

      {}
      <div style={{ minWidth: 0, flex: 1 }}>
        {error && (
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: C.red,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {error}
          </p>
        )}
        {!error && isListening && (
          <p style={{ margin: 0, fontSize: 11, color: C.red, lineHeight: 1.3 }}>
            Listening…
          </p>
        )}
        {!error && isSpeaking && (
          <p
            style={{ margin: 0, fontSize: 11, color: C.green, lineHeight: 1.3 }}
          >
            Speaking…
          </p>
        )}
        {!error && !isListening && !isSpeaking && transcript && (
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: C.gold,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={transcript}
          >
            ✓ {transcript}
          </p>
        )}
      </div>
    </div>
  );
}

function WaveBars() {
  const bars = [
    { delay: "0s", height: 8 },
    { delay: "0.15s", height: 14 },
    { delay: "0.3s", height: 10 },
    { delay: "0.1s", height: 6 },
  ];

  return (
    <>
      <style>{`
        @keyframes wave-b {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1);   }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {bars.map((b, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: 3,
              height: b.height,
              borderRadius: 2,
              background: "#34D399",
              animation: `wave-b 0.7s ease-in-out ${b.delay} infinite`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
    </>
  );
}