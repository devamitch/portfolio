import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface VisitorMetadata {
  browser?: string;
  os?: string;
  device?: string;
  ip?: string;
  networkType?: string;
  effectiveType?: string;
  screen?: string;
  language?: string;
  timezone?: string;
  lastVisit?: string;
}

interface PortfolioState {
  // Preloader
  hasSeenPreloader: boolean;
  setHasSeenPreloader: (seen: boolean) => void;

  // ─── Visitor Identity ─────────────────────────────────────────────────────
  // visitorId: null = never been identified. Non-null = has a persistent ID.
  // In dev: set on first load, cleared only by resetForDevelopment().
  // In prod: set after Firebase identifies/creates the visitor.
  visitorId: string | null;
  setVisitorId: (id: string) => void;

  // isFirstTimeVisitor: true until they complete onboarding (give name etc.)
  // Persisted — once false, stays false across sessions.
  isFirstTimeVisitor: boolean;
  setIsFirstTimeVisitor: (v: boolean) => void;

  // isNewUser: true if visitorId was null when the app loaded this session.
  // NOT persisted — recomputed each session from visitorId state.
  // Drives auto-open behaviour (open widget for new sessions with no visitorId).
  isNewUser: boolean;
  setIsNewUser: (isNew: boolean) => void;

  // ─── User Profile ─────────────────────────────────────────────────────────
  userName: string | null;
  setUserName: (name: string | null) => void;

  isProfileComplete: boolean;
  setIsProfileComplete: (complete: boolean) => void;

  hasGreetedUser: boolean;
  setHasGreetedUser: (greeted: boolean) => void;

  // ─── Identification Flow ──────────────────────────────────────────────────
  isVerified: boolean; // identification process completed (success or fallback)
  setIsVerified: (v: boolean) => void;
  isIdentifying: boolean; // identification in progress
  setIsIdentifying: (v: boolean) => void;

  // ─── Visitor Metadata ─────────────────────────────────────────────────────
  visitorMetadata: VisitorMetadata | null;
  setVisitorMetadata: (metadata: VisitorMetadata) => void;

  visitCount: number;
  incrementVisitCount: () => void;

  isOwner: boolean;
  setIsOwner: (owner: boolean) => void;

  // ─── Chat History ─────────────────────────────────────────────────────────
  recentQueries: string[];
  addQuery: (q: string) => void;

  // ─── Rate Limiting ────────────────────────────────────────────────────────
  messageCount: number;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  lastResetDate: string;
  checkAndResetDaily: () => void;

  // ─── Dev Reset ───────────────────────────────────────────────────────────
  // Call this to simulate a brand-new visitor in development.
  resetForDevelopment: () => void;
}

export const usePortfolioState = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // ── Preloader ──────────────────────────────────────────────────────────
      hasSeenPreloader: false,
      setHasSeenPreloader: (seen) => set({ hasSeenPreloader: seen }),

      // ── Identity ───────────────────────────────────────────────────────────
      visitorId: null,
      setVisitorId: (id) => set({ visitorId: id }),

      // isFirstTimeVisitor starts true. Set to false after onboarding completes.
      isFirstTimeVisitor: true,
      setIsFirstTimeVisitor: (v) => set({ isFirstTimeVisitor: v }),

      // isNewUser is computed at runtime from visitorId:
      // true  → visitorId was null when identification ran (brand new session)
      // false → visitorId already existed (returning visitor)
      isNewUser: true, // overwritten immediately by useUserIdentification
      setIsNewUser: (isNew) => set({ isNewUser: isNew }),

      // ── Profile ────────────────────────────────────────────────────────────
      userName: null,
      setUserName: (name) => set({ userName: name }),
      isProfileComplete: false,
      setIsProfileComplete: (complete) => set({ isProfileComplete: complete }),
      hasGreetedUser: false,
      setHasGreetedUser: (greeted) => set({ hasGreetedUser: greeted }),

      // ── Identification ─────────────────────────────────────────────────────
      isVerified: false,
      setIsVerified: (v) => set({ isVerified: v }),
      isIdentifying: false,
      setIsIdentifying: (v) => set({ isIdentifying: v }),

      // ── Metadata ───────────────────────────────────────────────────────────
      visitorMetadata: null,
      setVisitorMetadata: (metadata) => set({ visitorMetadata: metadata }),
      visitCount: 0,
      incrementVisitCount: () => set((s) => ({ visitCount: s.visitCount + 1 })),
      isOwner: false,
      setIsOwner: (owner) => set({ isOwner: owner }),

      // ── Queries ────────────────────────────────────────────────────────────
      recentQueries: [],
      addQuery: (q) =>
        set((s) => ({
          recentQueries: [q, ...s.recentQueries.filter((x) => x !== q)].slice(
            0,
            5,
          ),
        })),

      // ── Rate Limiting ──────────────────────────────────────────────────────
      messageCount: 0,
      incrementMessageCount: () =>
        set((s) => ({ messageCount: s.messageCount + 1 })),
      resetMessageCount: () =>
        set({
          messageCount: 0,
          lastResetDate: new Date().toISOString().split("T")[0],
        }),
      lastResetDate: new Date().toISOString().split("T")[0]!,
      checkAndResetDaily: () => {
        const today = new Date().toISOString().split("T")[0];
        if (get().lastResetDate !== today) {
          set({ messageCount: 0, lastResetDate: today });
        }
      },

      // ── Dev Reset ──────────────────────────────────────────────────────────
      resetForDevelopment: () =>
        set({
          visitorId: null,
          isFirstTimeVisitor: true,
          isNewUser: true,
          hasGreetedUser: false,
          userName: null,
          visitCount: 0,
          isProfileComplete: false,
          isVerified: false,
          recentQueries: [],
          messageCount: 0,
        }),
    }),
    {
      name: "amit-portfolio-v3", // bumped to clear stale state from previous versions
      storage: createJSONStorage(() => localStorage),
      // Only persist fields that should survive page refresh
      partialize: (state) => ({
        hasSeenPreloader: state.hasSeenPreloader,
        visitorId: state.visitorId,
        isFirstTimeVisitor: state.isFirstTimeVisitor,
        // isNewUser is NOT persisted — recomputed each session
        hasGreetedUser: state.hasGreetedUser,
        userName: state.userName,
        visitCount: state.visitCount,
        isOwner: state.isOwner,
        isProfileComplete: state.isProfileComplete,
        recentQueries: state.recentQueries,
        messageCount: state.messageCount,
        lastResetDate: state.lastResetDate,
      }),
    },
  ),
);
