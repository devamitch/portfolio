import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PortfolioState {
  // Preloader
  hasSeenPreloader: boolean;
  setHasSeenPreloader: (seen: boolean) => void;

  // AI Widget
  hasGreetedUser: boolean;
  setHasGreetedUser: (greeted: boolean) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;

  // Rate limiting
  messageCount: number;
  incrementMessageCount: () => void;
  resetMessageCount: () => void;
  lastResetDate: string;
  checkAndResetDaily: () => void;
}

export const usePortfolioState = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Preloader defaults
      hasSeenPreloader: false,
      setHasSeenPreloader: (seen) => set({ hasSeenPreloader: seen }),

      // AI Widget defaults
      hasGreetedUser: false,
      setHasGreetedUser: (greeted) => set({ hasGreetedUser: greeted }),
      userName: null,
      setUserName: (name) => set({ userName: name }),

      // Rate limiting defaults
      messageCount: 0,
      incrementMessageCount: () =>
        set((state) => ({
          messageCount: state.messageCount + 1,
        })),
      resetMessageCount: () =>
        set({
          messageCount: 0,
          lastResetDate: new Date().toISOString().split("T")[0],
        }),
      lastResetDate: new Date().toISOString().split("T")[0],

      // Check if we need to reset daily count
      checkAndResetDaily: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();
        if (state.lastResetDate !== today) {
          set({
            messageCount: 0,
            lastResetDate: today,
          });
        }
      },
    }),
    {
      name: "amit-portfolio-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
