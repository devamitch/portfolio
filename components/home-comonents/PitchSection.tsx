"use client";

import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { COLORS, HN, MONO } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SLabel } from "../ui/SectionsComponents";
import { Btn, Card3D, GoldAccent } from "./shared";

// ── Shared input style ──────────────────────────────────────────────────────
const inpStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,.02)",
  border: `1px solid ${COLORS.border}`,
  color: COLORS.text,
  fontSize: 14,
  padding: "12px 16px",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color .2s, box-shadow .2s",
  boxSizing: "border-box",
};

function PitchForm() {
  const emptyForm = { name: "", email: "", idea: "", budget: "", timeline: "", category: "", stage: "" };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const set = <K extends keyof typeof emptyForm>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const categories = ["Mobile App", "Web Platform", "AI / ML", "Web3 / Blockchain", "HealthTech", "FinTech", "Other"];
  const budgets = ["< $10K", "$10K – $25K", "$25K – $50K", "$50K – $100K", "$100K+", "Let's discuss"];
  const timelines = ["ASAP (< 1 month)", "1 – 3 months", "3 – 6 months", "6+ months", "Flexible"];
  const stages = ["Just an idea", "Validated concept", "MVP built", "In market", "Scaling"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/pitch-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("sent");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = COLORS.gold;
    e.currentTarget.style.boxShadow = `0 0 0 2px ${COLORS.goldF}`;
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = COLORS.border;
    e.currentTarget.style.boxShadow = "none";
  };

  if (status === "sent") {
    return (
      <Card3D variant="gold" topBar tiltDeg={5} padding="48px 40px" style={{ textAlign: "center" }}>
        <CheckCircle2 size={48} color={COLORS.gold} style={{ marginBottom: 20 }} />
        <h3 style={{ fontFamily: HN, fontSize: 24, fontWeight: 800, color: COLORS.gold, marginBottom: 12 }}>
          Pitch received.
        </h3>
        <p style={{ color: COLORS.faint, fontSize: 15, lineHeight: 1.65 }}>
          I review every pitch personally. You'll hear back within 48 hours.
        </p>
      </Card3D>
    );
  }

  return (
    <form onSubmit={submit}>
      {/* Two-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="pitch-grid">
        <div>
          <label style={{ fontFamily: MONO, fontSize: 9, color: COLORS.gold, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Name *</label>
          <input required style={inpStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name" onFocus={focusBorder} onBlur={blurBorder} />
        </div>
        <div>
          <label style={{ fontFamily: MONO, fontSize: 9, color: COLORS.gold, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email *</label>
          <input required type="email" style={inpStyle} value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" onFocus={focusBorder} onBlur={blurBorder} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ fontFamily: MONO, fontSize: 9, color: COLORS.gold, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>The Idea *</label>
        <textarea
          required
          style={{ ...inpStyle, minHeight: 120, resize: "vertical" }}
          value={form.idea}
          onChange={e => set("idea", e.target.value)}
          placeholder="What are you building?"
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="pitch-grid">
        {[
          { key: "category", label: "Category", opts: categories },
          { key: "budget", label: "Budget", opts: budgets },
          { key: "timeline", label: "Timeline", opts: timelines },
          { key: "stage", label: "Stage", opts: stages },
        ].map(({ key, label, opts }) => (
          <div key={key}>
            <label style={{ fontFamily: MONO, fontSize: 9, color: COLORS.gold, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
            <select
              style={{ ...inpStyle, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23C9A84C' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
              value={form[key as keyof typeof form]}
              onChange={e => set(key as keyof typeof form, e.target.value)}
              onFocus={focusBorder}
              onBlur={blurBorder}
            >
              <option value="">Select...</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <Btn
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        disabled={status === "sending"}
        icon={<Send size={14} />}
        iconRight={<ArrowRight size={14} />}
      >
        {status === "sending" ? "Sending..." : "Submit Pitch"}
      </Btn>
    </form>
  );
}

export default function PitchSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.07);

  return (
    <section
      ref={ref}
      id="pitch"
      style={{ padding: "clamp(80px,10vw,140px) 0", background: COLORS.bg2, position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 100%,${COLORS.goldF} 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <SLabel>Pitch Your Idea</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "start" }} className="pitch-outer">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <h2 style={{ fontFamily: HN, fontSize: "clamp(28px,4vw,54px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.04, marginBottom: 20 }}>
              Have an idea?<br /><GoldAccent>Let's build it.</GoldAccent>
            </h2>
            <p style={{ fontSize: 16, color: COLORS.faint, lineHeight: 1.75, marginBottom: 36, maxWidth: 420 }}>
              I work with founders and teams who have big visions and need someone who can execute. Tell me about your project — I review every pitch personally.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { t: "48h Response", d: "I reply to every pitch within 2 business days." },
                { t: "Free Consultation", d: "First call is always free. No obligation." },
                { t: "NDA Available", d: "Happy to sign one before you share details." },
              ].map((item) => (
                <Card3D key={item.t} variant="ghost" tiltDeg={6} padding="14px 18px" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>{item.t}</div>
                    <div style={{ fontSize: 12, color: COLORS.faint }}>{item.d}</div>
                  </div>
                </Card3D>
              ))}
            </div>
          </motion.div>

          {/* Right — form in Card3D */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}>
            <Card3D variant="default" tiltDeg={3} padding="clamp(28px,4vw,44px)">
              <PitchForm />
            </Card3D>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .pitch-outer { grid-template-columns: 1fr !important; } }
        @media (max-width: 540px) { .pitch-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
