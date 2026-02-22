/**
 * Voice Utilities — Indian Male Voice Edition
 * Finds the best available Indian male voice (en-IN / hi-IN)
 * with natural-sounding rate/pitch. Falls back gracefully.
 */

// ─── Type declarations ─────────────────────────────────────────────────────

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onaudioend: ((ev: Event) => any) | null;
    onaudiostart: ((ev: Event) => any) | null;
    onend: ((ev: Event) => any) | null;
    onerror: ((ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((ev: Event) => any) | null;
    onsoundstart: ((ev: Event) => any) | null;
    onspeechend: ((ev: Event) => any) | null;
    onspeechstart: ((ev: Event) => any) | null;
    onstart: ((ev: Event) => any) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}

export interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface VoiceError extends Error {
  code?: string;
  isNetworkError?: boolean;
  isPermissionError?: boolean;
  isNotSupportedError?: boolean;
}

// ─── Voice selection ────────────────────────────────────────────────────────

/**
 * Priority-ordered list of known good Indian male voices.
 * The browser's voice list varies — we score each voice and pick the best.
 */
const INDIAN_MALE_VOICE_KEYWORDS = [
  // Google Indian voices (best quality, available in Chrome)
  "google hindi",
  "google हिन्दी",
  // en-IN male voices
  "rishi", // Apple en-IN male
  "aaron", // Some builds
  "hemant", // Microsoft en-IN male
  "kalpana", // Avoid — female
];

const FEMALE_KEYWORDS = [
  "female",
  "woman",
  "zira",
  "hazel",
  "kalpana",
  "heera",
  "priya",
  "neerja",
  "lekha",
  "aditi",
];

function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const lower = voice.name.toLowerCase();
  return FEMALE_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Score a voice — higher = better Indian male match.
 */
function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();

  if (isFemaleVoice(voice)) return -1;

  let score = 0;

  // Language match
  if (lang === "en-in") score += 40;
  else if (lang === "hi-in") score += 30;
  else if (lang.startsWith("en-")) score += 5;

  // Google voices sound natural
  if (name.includes("google")) score += 20;

  // Known good Indian male voices
  if (name.includes("rishi")) score += 25;
  if (name.includes("hemant")) score += 22;

  return score;
}

/**
 * Pick the best Indian male voice from available voices.
 * Returns null if nothing suitable found (caller should use system default).
 */
function pickIndianMaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Score all voices
  const scored = voices
    .map((v) => ({ v, score: scoreVoice(v) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.v ?? null;
}

// ─── VoiceManager class ─────────────────────────────────────────────────────

export class VoiceManager {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private recognitionTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.initRecognition();
    this.initSynthesis();
  }

  private initRecognition(): void {
    if (typeof window === "undefined") return;
    const Ctor =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;
    if (Ctor) {
      try {
        this.recognition = new Ctor() as SpeechRecognition;
      } catch (e) {
        console.warn("SpeechRecognition init failed:", e);
      }
    }
  }

  private initSynthesis(): void {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      this.synthesis = window.speechSynthesis;
    }
  }

  async startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (error: VoiceError) => void,
    config: VoiceConfig = {},
  ): Promise<boolean> {
    if (!this.recognition) {
      const e = Object.assign(new Error("Speech recognition not supported"), {
        isNotSupportedError: true,
        code: "NOT_SUPPORTED",
      }) as VoiceError;
      onError(e);
      return false;
    }

    if (!navigator.onLine) {
      const e = Object.assign(
        new Error(
          "No internet connection. Speech recognition requires internet.",
        ),
        { isNetworkError: true, code: "NETWORK_OFFLINE" },
      ) as VoiceError;
      onError(e);
      return false;
    }

    try {
      const {
        language = "en-IN",
        continuous = false,
        interimResults = true,
        maxAlternatives = 1,
      } = config;
      const rec = this.recognition as any;

      rec.lang = language;
      rec.continuous = continuous;
      rec.interimResults = interimResults;
      rec.maxAlternatives = maxAlternatives;

      if (this.recognitionTimeout) clearTimeout(this.recognitionTimeout);

      let silentTimer: ReturnType<typeof setTimeout> | null = null;
      let lastInterim = "";

      rec.onstart = () => {
        this.isListening = true;
      };

      rec.onresult = (event: any) => {
        let finalT = "";
        let interimT = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const t = result[0].transcript;
          if (result.isFinal) finalT += t + " ";
          else interimT += t;
        }

        if (silentTimer) clearTimeout(silentTimer);

        if (interimT) {
          onResult(interimT, false);
          lastInterim = interimT;
          silentTimer = setTimeout(() => {
            if (lastInterim && this.isListening) onResult(lastInterim, true);
          }, 1500);
        } else if (finalT) {
          onResult(finalT.trim(), true);
        }
      };

      rec.onerror = (event: any) => {
        if (event.error === "aborted") return;
        const e = Object.assign(new Error(`Speech error: ${event.error}`), {
          code: event.error,
        }) as VoiceError;
        if (event.error === "network") {
          e.isNetworkError = true;
          e.message = "Network error — check your connection.";
        } else if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          e.isPermissionError = true;
          e.message = "Microphone access denied.";
        } else if (event.error === "audio-capture") {
          e.message = "No microphone found.";
        } else if (event.error === "no-speech") {
          e.message = "No speech detected — try again.";
        }
        onError(e);
      };

      rec.onend = () => {
        this.isListening = false;
        if (silentTimer) clearTimeout(silentTimer);
      };

      rec.start();

      if (continuous) {
        this.recognitionTimeout = setTimeout(() => {
          if (this.isListening) this.stopListening();
        }, 60_000);
      }

      return true;
    } catch {
      const e = Object.assign(new Error("Failed to start speech recognition"), {
        code: "START_FAILED",
      }) as VoiceError;
      onError(e);
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        (this.recognition as any).stop();
      } catch {}
    }
    if (this.recognitionTimeout) clearTimeout(this.recognitionTimeout);
  }

  abort(): void {
    if (this.recognition) {
      try {
        (this.recognition as any).abort();
      } catch {}
    }
    this.isListening = false;
    if (this.recognitionTimeout) clearTimeout(this.recognitionTimeout);
  }

  /**
   * Speak text using the best available Indian male voice.
   * Uses SSML-friendly preprocessing to improve name/tech-term pronunciation.
   */
  speak(
    text: string,
    onEnd?: () => void,
    onError?: (e: Error) => void,
  ): boolean {
    if (!this.synthesis) {
      onError?.(new Error("Speech synthesis not supported"));
      return false;
    }

    try {
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(preprocessForSpeech(text));

      // Voice selection — prefer Indian male, set on voices loaded
      const applyVoice = () => {
        const voice = pickIndianMaleVoice();
        if (voice) {
          utterance.voice = voice;
          // Match lang to voice
          utterance.lang = voice.lang || "en-IN";
        } else {
          // No Indian voice found — use en-IN locale which may trigger
          // platform's Indian TTS even without an explicit voice object
          utterance.lang = "en-IN";
        }
      };

      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        applyVoice();
      } else {
        // Voices not loaded yet — wait for them
        window.speechSynthesis.onvoiceschanged = () => {
          applyVoice();
          window.speechSynthesis.onvoiceschanged = null;
        };
      }

      // Natural-sounding Indian male settings:
      // Rate: slightly slower than default so technical terms are clear
      // Pitch: slightly lower than 1.0 for male timbre
      utterance.rate = 0.92;
      utterance.pitch = 0.88;
      utterance.volume = 1;

      if (onEnd) utterance.onend = onEnd;
      utterance.onerror = (ev: SpeechSynthesisErrorEvent) => {
        console.error("TTS error:", ev.error);
        onError?.(new Error(`TTS error: ${ev.error}`));
      };

      this.synthesis.speak(utterance);
      return true;
    } catch (e) {
      onError?.(e instanceof Error ? e : new Error("speak() failed"));
      return false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
  isSupported(): boolean {
    return this.recognition !== null;
  }
  isSynthesisSupported(): boolean {
    return this.synthesis !== null;
  }
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() ?? [];
  }
}

// ─── Speech preprocessing ────────────────────────────────────────────────────

/**
 * Make the TTS read technical terms, names, and abbreviations naturally.
 * Expands common abbreviations and adds pauses at punctuation.
 */
function preprocessForSpeech(text: string): string {
  return (
    text
      // Common tech abbreviations → readable form
      .replace(/\bRAG\b/g, "R-A-G")
      .replace(/\bAPI\b/g, "A-P-I")
      .replace(/\bLLM\b/g, "L-L-M")
      .replace(/\bUI\b/g, "U-I")
      .replace(/\bUX\b/g, "U-X")
      .replace(/\bSQL\b/g, "S-Q-L")
      .replace(/\bHTML\b/g, "H-T-M-L")
      .replace(/\bCSS\b/g, "C-S-S")
      .replace(/\bJSON\b/g, "Jason")
      .replace(/\bAI\b/g, "A-I")
      .replace(/\bML\b/g, "M-L")
      .replace(/\bCI\/CD\b/g, "C-I, C-D")
      .replace(/\bHIPAA\b/g, "hippa")
      .replace(/\bDeFi\b/gi, "dee-fie")
      .replace(/\bNFT\b/g, "N-F-T")
      .replace(/\bWeb3\b/gi, "Web Three")
      // Names — spelled naturally
      .replace(/\bAmit\b/g, "Ameet") // phonetic
      .replace(/\bChakraborty\b/g, "Chokroborti")
      // Framework names
      .replace(/\bNext\.js\b/gi, "Next JS")
      .replace(/\bNode\.js\b/gi, "Node JS")
      .replace(/\bNestJS\b/gi, "Nest JS")
      .replace(/\bReact Native\b/gi, "React Native")
      .replace(/\bTypeScript\b/gi, "Type Script")
      .replace(/\bSolidity\b/gi, "Solidity")
      .replace(/\bSolana\b/gi, "Solana")
      // Natural pauses — replace em-dash and ellipsis
      .replace(/—/g, ", ")
      .replace(/\.\.\./g, ", ")
      // Clean up extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _instance: VoiceManager | null = null;

export function getVoiceManager(): VoiceManager {
  if (!_instance) _instance = new VoiceManager();
  return _instance;
}

// ─── Helper utilities ─────────────────────────────────────────────────────────

export async function speechToText(
  config?: VoiceConfig,
  timeoutMs = 10_000,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!navigator.onLine) {
      reject(new Error("No internet connection."));
      return;
    }

    const manager = getVoiceManager();
    let timeoutId: ReturnType<typeof setTimeout>;

    manager.startListening(
      (text, isFinal) => {
        if (isFinal && text.trim()) {
          manager.stopListening();
          clearTimeout(timeoutId);
          resolve(text.trim());
        }
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(
          new Error(
            err.isNetworkError
              ? "Network error — check your connection."
              : err.isPermissionError
                ? "Microphone access denied."
                : err.message,
          ),
        );
      },
      config,
    );

    timeoutId = setTimeout(() => {
      manager.abort();
      reject(new Error("No speech detected — please try again."));
    }, timeoutMs);
  });
}

export async function textToSpeech(
  text: string,
  onError?: (e: Error) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const manager = getVoiceManager();
    const ok = manager.speak(
      text,
      () => resolve(),
      (e) => {
        onError?.(e);
        resolve();
      },
    );
    if (!ok) resolve();
  });
}

export async function checkVoiceSupport(): Promise<{
  supported: boolean;
  microphoneAccess: boolean;
  online: boolean;
  indianVoiceAvailable: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  const manager = getVoiceManager();
  const supported = manager.isSupported();
  if (!supported) errors.push("Speech recognition not supported");

  let microphoneAccess = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    microphoneAccess = true;
  } catch {
    errors.push("Microphone access denied");
  }

  // Check if Indian voice available
  const voices = manager.getVoices();
  const indianVoice = pickIndianMaleVoice();

  return {
    supported,
    microphoneAccess,
    online: navigator.onLine,
    indianVoiceAvailable: indianVoice !== null,
    errors,
  };
}
