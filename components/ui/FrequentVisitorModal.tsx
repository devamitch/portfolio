"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePortfolioState } from "~/store/portfolio-state";

export function FrequentVisitorModal() {
  const {
    visitCount,
    isProfileComplete,
    isOwner,
    setIsProfileComplete,
    visitorId,
    userName,
    setUserName,
  } = usePortfolioState();

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: userName || "", interest: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    if (visitCount >= 5 && !isProfileComplete && !isOwner) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [visitCount, isProfileComplete, isOwner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.interest) return;
    setStatus("sending");

    try {
      await fetch("/api/analytics/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, visitorId }),
      });
      setIsProfileComplete(true);
      setUserName(form.name);
      setStatus("done");
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      setStatus("idle");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8 relative overflow-hidden"
        >
          {}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-16 -mt-16" />

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 font-serif italic">
              Hello again!
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              I noticed you've been visiting frequently. I'd love to know who
              I'm sharing my work with.
            </p>
          </div>

          {status === "done" ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-[#C9A84C]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C9A84C]/40">
                <Send size={20} className="text-[#C9A84C]" />
              </div>
              <p className="text-[#C9A84C] font-mono text-sm tracking-widest uppercase">
                Thank you, {form.name}!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] mb-2 font-mono">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-[#C9A84C]/50 transition-colors"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] mb-2 font-mono">
                  What interests you most?
                </label>
                <div className="relative">
                  <MessageSquare
                    size={14}
                    className="absolute left-3 top-4 text-white/30"
                  />
                  <textarea
                    required
                    value={form.interest}
                    onChange={(e) =>
                      setForm({ ...form, interest: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-[#C9A84C]/50 transition-colors h-24 resize-none"
                    placeholder="e.g. AI Architecture, Mobile UX, etc."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-[#C9A84C] text-black font-bold py-4 text-sm tracking-widest uppercase hover:bg-[#F5C842] transition-colors disabled:opacity-50"
              >
                {status === "sending" ? "Processing..." : "Complete Profile"}
              </button>

              <p className="text-center text-[9px] text-white/20 uppercase tracking-widest pt-2">
                This info helps me tailor my future content
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}