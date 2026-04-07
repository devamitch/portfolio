/**
 * src/hooks/useAuraChat.ts
 *
 * VOICE-ONLY Aura business logic.
 * Uses local React state (useState/useRef) — no external store.
 *
 *  1. Language detection per message → sent to Gemini + fallback
 *  2. Token stats exposed for widget UI
 *  3. Daily limit → friendly farewell + offline mode offer
 *  4. Context limit → graceful conclusion + email CTA
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  extractCompany,
  extractIntent,
  extractInterests,
  extractName,
  extractRole,
  toTitleCaseExport,
  type OnboardStep,
} from "~/components/SiriOrb/onboarding";
import { auraD } from "~/lib/diagnostics";
import {
  detectLanguage,
  fallbackOnboardReply,
  getFallbackGreeting,
  resetFallbackContext,
  setFallbackContext,
  setFallbackLanguage,
  type SupportedLang,
} from "~/lib/fallbackAI";
import {
  askAura,
  detectInstantAnswer,
  forceOffline,
  generateSummary,
  getTokenStats,
  isOffline,
  resetOffline,
  resetSessionTokenStats,
  type Message,
  type TokenUsageStats,
  type UserProfile,
} from "~/lib/gemini";
import { selectVoice, type VoiceConfig } from "~/lib/tts";
import type { VoiceState } from "./useVoiceState";
import { usePortfolioState } from "~/store/portfolio-state";

export const ONBOARD_STEPS: OnboardStep[] = [
  "ask_name",
  "ask_company",
  "ask_role",
  "ask_intent",
];

// ─── Token estimation ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT_TOKENS = 900;
const MAX_CONTEXT_TOKENS = 900_000;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

function estimateContextTokens(
  systemExtra: string,
  history: Array<{ text: string }>,
  currentMsg: string,
): number {
  const historyTokens = history.reduce(
    (acc, m) => acc + estimateTokens(m.text),
    0,
  );
  return (
    SYSTEM_PROMPT_TOKENS +
    estimateTokens(systemExtra) +
    historyTokens +
    estimateTokens(currentMsg)
  );
}

// Removed local daily limit helpers — now using Zustand store.

// ─── Types ────────────────────────────────────────────────────────────────────
interface Opts {
  setVoiceState: (s: VoiceState) => void;
  speak: (text: string, vc?: VoiceConfig) => Promise<void>;
  stopTTS: () => void;
  abortListening: () => void;
  getVoiceProfileContext?: () => string;
  onShowEmailCard?: (message: string) => void;
  onTokenUpdate?: (stats: TokenUsageStats) => void;
}

// ─── Multilingual message pools ───────────────────────────────────────────────
const DAILY_LIMIT_MESSAGES: Record<SupportedLang, string[]> = {
  en: [
    "You've used today's conversations — thanks for the chat. Say 'yes' to continue in offline mode, or I'll show Amit's contact.",
    "That's the daily limit. Reply 'yes' to switch to offline mode right now.",
    "We've hit today's limit. Say 'yes' for offline mode, or come back tomorrow.",
  ],
  hi: [
    "Aaj ke conversations khatam ho gaye. 'Haan' bolo toh offline mode mein switch kar deta hun.",
    "Daily limit aa gayi. 'Haan' bolo toh abhi offline mode chalate hain.",
    "Limit ho gayi aaj ke liye. 'Haan' bolo ya kal wapas aao.",
  ],
  ja: [
    "本日の会話制限に達しました。「はい」と言えばオフラインモードに切り替えます。",
    "今日の制限です。「はい」でオフラインモードに切り替えます。",
  ],
  ko: [
    "오늘 대화 한도에 도달했습니다. '네'라고 하시면 오프라인 모드로 전환합니다.",
    "일일 한도입니다. '네'라고 하시면 오프라인 모드로 전환하겠습니다.",
  ],
};

const CONTEXT_LIMIT_MESSAGES: Record<SupportedLang, string[]> = {
  en: [
    "We've covered a lot — hitting the depth limit here. Want to continue over email with Amit directly?",
    "Deep conversation — reaching context limits. Email Amit to continue: amit@devamit.co.in.",
    "Session depth limit reached. Amit reads every email personally — amit@devamit.co.in.",
  ],
  hi: [
    "Bahut kuch cover kar liya — depth limit aa gayi. Amit ko directly email karna chahoge?",
    "Bahut gehri baat cheet hui. Amit ko email karo: amit@devamit.co.in.",
  ],
  ja: [
    "多くをカバーしました。深度制限です。アミットに直接メールしてください: amit@devamit.co.in",
    "セッション制限に達しました。amit@devamit.co.inへどうぞ。",
  ],
  ko: [
    "많은 내용을 다뤘습니다. 깊이 한도에 도달했습니다. 아밋에게 이메일하세요: amit@devamit.co.in",
    "세션 한도에 도달했습니다. amit@devamit.co.in으로 연락하세요.",
  ],
};

const OFFLINE_SWITCH_CONFIRM: Record<SupportedLang, string> = {
  en: "Switching to offline mode — no API needed. Ask me anything about Amit.",
  hi: "Offline mode mein switch kar raha hun — koi API nahi chahiye. Kuch bhi poochho Amit ke baare mein.",
  ja: "オフラインモードに切り替えます。APIは不要です。アミットについて何でも聞いてください。",
  ko: "오프라인 모드로 전환합니다. API가 필요 없습니다. 아밋에 대해 무엇이든 물어보세요.",
};

const OFFLINE_ACCEPT_PATTERN =
  /\b(offline|local|fallback|yes|sure|ok|okay|continue|haan|theek|chalo|はい|ええ|네|예)\b/i;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getLangPool<T>(
  map: Record<SupportedLang, T[]>,
  lang: SupportedLang,
): T[] {
  return map[lang]?.length ? map[lang] : map["en"];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuraChat({
  setVoiceState,
  speak,
  stopTTS,
  abortListening,
  getVoiceProfileContext,
  onShowEmailCard,
  onTokenUpdate,
}: Opts) {
  // ── Local state (replaces zustand store) ───────────────────────────────────
  const messages = usePortfolioState((s) => s.messages);
  const userProfile = usePortfolioState((s) => s.userProfile);
  const addMessage = usePortfolioState((s) => s.addMessage);
  const resetMessages = usePortfolioState((s) => s.resetMessages);
  const setProfileFn = usePortfolioState((s) => s.setProfile);
  const updateProfile = usePortfolioState((s) => s.updateProfile);
  const setInitMessages = usePortfolioState((s) => s.setMessages);
  const getStore = usePortfolioState.getState;

  const canChatToday = usePortfolioState((s) => s.canChat);
  const getRemainingChats = usePortfolioState((s) => s.getRemainingChats);
  const incrementDailyCount = usePortfolioState((s) => s.incrementDaily);

  // ── Other state ───────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [autoSpeak] = useState(true);
  const [onboardStep, setOnboardStep] = useState<OnboardStep>("welcome");
  const [showEndCard, setShowEndCard] = useState(false);
  const [endSummary, setEndSummary] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastAiText, setLastAiText] = useState("");
  const [offlineIndicator, setOfflineIndicator] = useState(false);
  const [currentLang, setCurrentLang] = useState<SupportedLang>("en");
  const [tokenStats, setTokenStats] =
    useState<TokenUsageStats>(getTokenStats());

  const isLoadingRef = useRef(false);
  const stepRef = useRef<OnboardStep>("welcome");
  const micEnabled = useRef(false);
  const sessionCounted = useRef(false);
  const convoId = useRef(`c_${Date.now()}`);
  const sendRef = useRef<(t: string) => void>(() => {});
  const stopCooldown = useRef<ReturnType<typeof setTimeout>>(undefined);
  const limitShown = useRef(false);
  const contextLimitShown = useRef(false);
  const langRef = useRef<SupportedLang>("en");

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);
  useEffect(() => {
    stepRef.current = onboardStep;
  }, [onboardStep]);
  useEffect(() => {
    langRef.current = currentLang;
  }, [currentLang]);

  useEffect(() => {
    const check = () => setOfflineIndicator(isOffline());
    check();
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    return () => {
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  const isOnboard = onboardStep !== "ready";
  const convoLeft = getRemainingChats();
  const onboardIndex = ONBOARD_STEPS.indexOf(
    onboardStep as (typeof ONBOARD_STEPS)[number],
  );

  // ── Language detection ─────────────────────────────────────────────────────
  const detectAndSetLang = useCallback((text: string): SupportedLang => {
    const lang = detectLanguage(text);
    if (lang !== langRef.current) {
      setCurrentLang(lang);
      langRef.current = lang;
      setFallbackLanguage(lang);
      auraD.log("system", "info", `Language: ${lang}`);
    }
    return lang;
  }, []);

  // ── Deliver AI message ─────────────────────────────────────────────────────
  const deliverAiMessage = useCallback(
    (text: string, vc?: VoiceConfig) => {
      addMessage({ role: "ai", text, ts: Date.now() });
      setLastAiText(text);
      speak(text, vc);
    },
    [addMessage, speak],
  );

  // ── Show email CTA ─────────────────────────────────────────────────────────
  const showEmailCTA = useCallback(
    (message: string) => {
      onShowEmailCard?.(message);
    },
    [onShowEmailCard],
  );

  // ── OPEN ───────────────────────────────────────────────────────────────────
  const open = useCallback(() => {
    setIsOpen(true);
    micEnabled.current = true;
    sessionCounted.current = false;
    limitShown.current = false;
    contextLimitShown.current = false;
    convoId.current = `c_${Date.now()}`;
    resetFallbackContext();
    resetOffline();
    resetSessionTokenStats();
    setTokenStats(getTokenStats());

    setTimeout(() => {
      const p = getStore().userProfile;

      if (p?.name) {
        const greeting = getFallbackGreeting(p.name, p.sessionCount || 1);
        setOnboardStep("ready");
        setFallbackContext({
          userName: p.name,
          userRole: p.role,
          userCompany: p.company,
          userIntent: p.intent,
        });
        updateProfile({
          sessionCount: (p.sessionCount || 0) + 1,
          lastSeen: new Date().toISOString(),
        });
        setInitMessages([{ role: "ai", text: greeting, ts: Date.now() }]);
        setLastAiText(greeting);
        speak(greeting, selectVoice({ isGreeting: true }));
      } else {
        const greeting = getFallbackGreeting();
        setOnboardStep("ask_name");
        setInitMessages([{ role: "ai", text: greeting, ts: Date.now() }]);
        setLastAiText(greeting);
        speak(greeting, selectVoice({ isGreeting: true }));
      }
    }, 400);
  }, [speak, updateProfile, setInitMessages]);

  // ── CLOSE ──────────────────────────────────────────────────────────────────
  const close = useCallback(async () => {
    micEnabled.current = false;
    clearTimeout(stopCooldown.current);
    abortListening();
    stopTTS();
    setVoiceState("idle");
    setIsOpen(false);
    setTranscript("");
    setLastAiText("");
    setOnboardStep("welcome");
    setIsLoading(false);
    sessionCounted.current = false;
    limitShown.current = false;
    contextLimitShown.current = false;

    const msgs = [...getStore().messages];
    const profile = getStore().userProfile;
    resetMessages();

    if (msgs.length > 2) {
      try {
        const sum = await generateSummary(profile, msgs);
        setEndSummary(sum);
        if (profile) {
          updateProfile({ interests: extractInterests(msgs) });
        }
        if (sum) setShowEndCard(true);
      } catch (e) {
        auraD.error("system", e, "Summary failed");
      }
    }
  }, [resetMessages, stopTTS, abortListening, setVoiceState, updateProfile]);

  // ── STOP ALL ───────────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    micEnabled.current = false;
    clearTimeout(stopCooldown.current);
    stopTTS();
    abortListening();
    setIsLoading(false);
    stopCooldown.current = setTimeout(() => {
      micEnabled.current = true;
    }, 1200);
  }, [stopTTS, abortListening]);

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (rawText: string) => {
      const msg = rawText.trim();
      if (!msg || isLoadingRef.current) return;
      setTranscript("");

      const lang = detectAndSetLang(msg);

      // ── DAILY LIMIT ───────────────────────────────────────────────────────
      if (!sessionCounted.current) {
        if (!canChatToday()) {
          addMessage({ role: "user", text: msg, ts: Date.now() });
          if (!limitShown.current) {
            limitShown.current = true;
            const limitMsg = pickRandom(
              getLangPool(DAILY_LIMIT_MESSAGES, lang),
            );
            setTimeout(() => {
              deliverAiMessage(limitMsg);
              setTimeout(() => {
                showEmailCTA(
                  "Daily limit reached. Email Amit directly — he replies within hours.",
                );
              }, 3500);
            }, 250);
          } else {
            if (OFFLINE_ACCEPT_PATTERN.test(msg)) {
              forceOffline(true);
              setFallbackLanguage(lang);
              setTimeout(() => {
                deliverAiMessage(
                  OFFLINE_SWITCH_CONFIRM[lang] || OFFLINE_SWITCH_CONFIRM["en"],
                );
              }, 250);
              sessionCounted.current = true;
              incrementDailyCount();
            } else {
              setTimeout(() => {
                showEmailCTA(
                  "Come back tomorrow, or email Amit directly — amit@devamit.co.in.",
                );
              }, 250);
            }
          }
          return;
        }
        incrementDailyCount();
        sessionCounted.current = true;
      }

      const step = stepRef.current;

      // ── ONBOARDING ─────────────────────────────────────────────────────────
      if (step !== "ready") {
        addMessage({ role: "user", text: msg, ts: Date.now() });
        let profile: UserProfile = getStore().userProfile ?? {
          name: "",
          company: "",
          role: "",
          intent: "",
          sessionCount: 1,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          totalMessages: 0,
          interests: [],
        };
        let nextStep: OnboardStep = step;
        let reply = "";

        const retryMessages: Record<string, Record<SupportedLang, string>> = {
          ask_name: {
            en: "Just your first name. What should I call you?",
            hi: "Bas pehla naam batao. Kya bulaun?",
            ja: "お名前だけで構いません。",
            ko: "이름만 알려주세요.",
          },
          ask_company: {
            en: "Which company or organization?",
            hi: "Kaunsi company?",
            ja: "どちらの会社ですか？",
            ko: "어느 회사인가요?",
          },
          ask_role: {
            en: "Recruiter, engineer, founder, or investor?",
            hi: "Recruiter, engineer, founder, ya investor?",
            ja: "採用担当、エンジニア、創業者、投資家？",
            ko: "채용 담당, 엔지니어, 창업자, 투자자?",
          },
        };

        if (step === "ask_name") {
          const name = extractName(msg);
          if (name) {
            profile = { ...profile, name };
            nextStep = "ask_company";
            reply = fallbackOnboardReply("ask_name", msg, name);
            setFallbackContext({ userName: name });
          } else {
            reply = retryMessages.ask_name[lang] || retryMessages.ask_name.en;
          }
        } else if (step === "ask_company") {
          const co =
            extractCompany(msg) ||
            (msg.length > 1 && msg.length < 60
              ? toTitleCaseExport(msg.trim())
              : "");
          if (co) {
            profile = { ...profile, company: co };
            nextStep = "ask_role";
            reply = fallbackOnboardReply("ask_company", msg);
            setFallbackContext({ userCompany: co });
          } else {
            reply =
              retryMessages.ask_company[lang] || retryMessages.ask_company.en;
          }
        } else if (step === "ask_role") {
          const role = extractRole(msg);
          if (role) {
            profile = { ...profile, role };
            nextStep = "ask_intent";
            reply = fallbackOnboardReply("ask_role", msg);
            setFallbackContext({ userRole: role });
          } else {
            reply = retryMessages.ask_role[lang] || retryMessages.ask_role.en;
          }
        } else if (step === "ask_intent") {
          profile = {
            ...profile,
            intent: extractIntent(msg),
            totalMessages: 0,
          };
          nextStep = "ready";
          reply = fallbackOnboardReply("ask_intent", msg, profile.name);
          setFallbackContext({ userIntent: profile.intent });
        }

        setProfileFn(profile);
        setOnboardStep(nextStep);
        setTimeout(() => {
          addMessage({ role: "ai", text: reply, ts: Date.now() });
          setLastAiText(reply);
          speak(reply, selectVoice({ isGreeting: nextStep === "ready" }));
        }, 250);
        return;
      }

      // ── NORMAL CHAT ────────────────────────────────────────────────────────
      const profile = getStore().userProfile;
      if (profile) {
        updateProfile({
          totalMessages: (profile.totalMessages || 0) + 1,
          lastSeen: new Date().toISOString(),
        });
      }

      // Instant answer (zero token cost)
      const instant = detectInstantAnswer(msg);
      if (instant) {
        addMessage({ role: "user", text: msg, ts: Date.now() });
        setTimeout(() => {
          addMessage({ role: "ai", text: instant, ts: Date.now() });
          setLastAiText(instant);
          speak(instant);
        }, 80);
        return;
      }

      // ── TOKEN BUDGET ──────────────────────────────────────────────────────
      const historySnap = [...getStore().messages];
      const voiceCtx = getVoiceProfileContext?.() || "";
      const estTokens = estimateContextTokens(voiceCtx, historySnap, msg);

      if (estTokens > MAX_CONTEXT_TOKENS && !contextLimitShown.current) {
        contextLimitShown.current = true;
        addMessage({ role: "user", text: msg, ts: Date.now() });
        const concludeMsg = pickRandom(
          getLangPool(CONTEXT_LIMIT_MESSAGES, lang),
        );
        setTimeout(() => {
          deliverAiMessage(concludeMsg);
          setTimeout(() => {
            showEmailCTA(
              "Conversation depth limit reached. Continue with Amit directly — amit@devamit.co.in.",
            );
          }, 2500);
        }, 250);
        return;
      }

      // ── GEMINI CALL ───────────────────────────────────────────────────────
      addMessage({ role: "user", text: msg, ts: Date.now() });
      setIsLoading(true);
      setVoiceState("thinking");

      try {
        const reply = await askAura(
          msg,
          profile,
          historySnap,
          setApiError,
          voiceCtx,
          lang,
          (stats) => {
            setTokenStats({ ...stats });
            onTokenUpdate?.(stats);
          },
        );

        setIsLoading(false);
        addMessage({ role: "ai", text: reply, ts: Date.now() });
        setLastAiText(reply);

        const isExcited = /impressive|amazing|incredible|wow/i.test(reply);
        speak(
          reply,
          selectVoice({
            isExcited,
            tone: getStore().userProfile?.role === "Engineer" ? "calm" : undefined,
          }),
        );
      } catch (err) {
        setIsLoading(false);
        auraD.error("gemini", err, "Send failed");
        const fallbackResponses: Record<SupportedLang, string> = {
          en: "Ask about the projects, tech stack, or how to work with Amit.",
          hi: "Projects, tech stack, ya Amit ke saath kaam ke baare mein poochho.",
          ja: "プロジェクト、技術スタック、または協働についてお聞きください。",
          ko: "프로젝트, 기술 스택, 또는 아밋과의 협업에 대해 물어보세요.",
        };
        const fb = fallbackResponses[lang] || fallbackResponses["en"];
        addMessage({ role: "ai", text: fb, ts: Date.now() });
        setLastAiText(fb);
        speak(fb);
      }
    },
    [
      addMessage,
      updateProfile,
      setProfileFn,
      speak,
      setVoiceState,
      getVoiceProfileContext,
      deliverAiMessage,
      showEmailCTA,
      detectAndSetLang,
      onTokenUpdate,
    ],
  );

  useEffect(() => {
    sendRef.current = sendMessage;
  }, [sendMessage]);

  return {
    isOpen,
    isLoading,
    transcript,
    setTranscript,
    autoSpeak,
    onboardStep,
    isOnboard,
    onboardIndex,
    showEndCard,
    setShowEndCard,
    endSummary,
    apiError,
    setApiError,
    lastAiText,
    offlineIndicator,
    messages,
    userProfile,
    convoLeft,
    limitHit: !canChatToday(),
    currentLang,
    tokenStats,
    open,
    close,
    stopAll,
    sendMessage,
    micEnabled,
    sendRef,
  };
}
