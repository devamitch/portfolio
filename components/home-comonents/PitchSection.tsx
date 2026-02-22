"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { COLORS, HN, MONO } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SLabel } from "../ui/SectionsComponents";
import { GoldAccent } from "./shared";

/* ── PitchForm ────────────────────────────────────── */
function PitchForm() {
  const emptyForm = {
    name: "",
    email: "",
    idea: "",
    budget: "",
    timeline: "",
    category: "",
    stage: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const set = <K extends keyof typeof emptyForm>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const categories = [
    "Mobile App", "Web Platform", "AI / ML",
    "Web3 / Blockchain", "HealthTech", "FinTech", "Other",
  ];
  const budgets = [
    "< $10K", "$10K – $25K", "$25K – $50K",
    "$50K – $100K", "$100K+", "Let's discuss",
  ];
  const timelines = [
    "ASAP (< 1 month)", "1 – 3 months", "3 – 6 months",
    "6+ months", "Flexible",
  ];
  const stages = [
    "Just an idea", "Validated concept", "MVP built", "In market", "Scaling",
  ];

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

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,.02)",
    border: `1px solid ${COLORS.border}`,
    padding: "13px 14px",
    color: COLORS.text,
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box",
  };
  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => (e.target.style.borderColor = "rgba(201,168,76,.38)");
  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => (e.target.style.borderColor = COLORS.border);
  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: 9,
    color: COLORS.gold,
    marginBottom: 6,
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: MONO,
  };

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "44px 0" }}>
        <div style={{ fontSize: 52, color: COLORS.gold, marginBottom: 20 }}>◈</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
          Idea received.
        </h3>
        <p style={{ color: COLORS.faint, fontSize: 14, lineHeight: 1.65 }}>
          I&apos;ll review and respond with honest feedback within 48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{
            marginTop: 24,
            padding: "10px 24px",
            border: `1px solid ${COLORS.gold}`,
            background: "transparent",
            color: COLORS.gold,
            cursor: "pointer",
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.14em",
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        className="form2col"
      >
        <div>
          <label style={lbl}>Name *</label>
          <input
            style={inp}
            required
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={lbl}>Email *</label>
          <input
            style={inp}
            type="email"
            required
            placeholder="you@startup.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
      <div>
        <label style={lbl}>Category</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => set("category", cat)}
              style={{
                padding: "6px 14px",
                border: `1px solid ${form.category === cat ? COLORS.gold : COLORS.border}`,
                background: form.category === cat ? COLORS.goldF : "transparent",
                color: form.category === cat ? COLORS.gold : COLORS.faint,
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={lbl}>Current Stage</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {stages.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => set("stage", s)}
              style={{
                padding: "6px 14px",
                border: `1px solid ${form.stage === s ? COLORS.gold : COLORS.border}`,
                background: form.stage === s ? COLORS.goldF : "transparent",
                color: form.stage === s ? COLORS.gold : COLORS.faint,
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={lbl}>Describe Your Idea *</label>
        <textarea
          required
          rows={5}
          placeholder="Tell me what you want to build. The problem it solves. Who it's for."
          value={form.idea}
          onChange={(e) => set("idea", e.target.value)}
          style={{ ...inp, resize: "vertical" }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        className="form2col"
      >
        <div>
          <label style={lbl}>Budget Range</label>
          <select
            style={{ ...inp, appearance: "none", cursor: "pointer" }}
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select...</option>
            {budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>Timeline</label>
          <select
            style={{ ...inp, appearance: "none", cursor: "pointer" }}
            value={form.timeline}
            onChange={(e) => set("timeline", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select...</option>
            {timelines.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      {status === "error" && (
        <p
          style={{
            color: COLORS.red,
            fontFamily: MONO,
            fontSize: 11,
            textAlign: "center",
          }}
        >
          Something went wrong. Email me directly.
        </p>
      )}
      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{
          width: "100%",
          padding: 17,
          background: COLORS.goldG,
          border: "none",
          color: "#000",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: MONO,
          cursor: "pointer",
          opacity: status === "sending" ? 0.65 : 1,
        }}
      >
        {status === "sending" ? "Sending..." : "Submit Your Idea →"}
      </motion.button>
    </form>
  );
}

/* ── PitchSection ─────────────────────────────────── */
export default function PitchSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);
  const benefits = [
    {
      icon: "◈",
      title: "Technical Feasibility",
      desc: "I'll tell you if it's buildable — and exactly how.",
    },
    {
      icon: "◉",
      title: "MVP Scope Definition",
      desc: "The minimum version that proves the concept.",
    },
    {
      icon: "◆",
      title: "Clear Cost Estimate",
      desc: "Timeline, stack, and budget — no surprises.",
    },
    {
      icon: "●",
      title: "Honest Assessment",
      desc: "If it won't work, I'll tell you. If it will, I'll show you how.",
    },
  ];

  return (
    <section
      id="pitch"
      ref={ref}
      style={{ padding: "clamp(80px,10vw,140px) 0", background: COLORS.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "clamp(40px,6vw,100px)",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75 }}
          >
            <SLabel num="06">Pitch Your Idea</SLabel>
            <h2
              style={{
                fontFamily: HN,
                fontSize: "clamp(30px,4.5vw,54px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              You have a vision.
              <br />
              <GoldAccent>Let&apos;s make it real.</GoldAccent>
            </h2>
            <p
              style={{
                color: COLORS.faint,
                fontSize: 15,
                lineHeight: 1.72,
                marginBottom: 32,
              }}
            >
              Share your concept — rough or refined. I evaluate technical
              feasibility, define the MVP scope, and give you a clear path
              forward. No jargon. No gatekeeping. Just clarity.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 28,
              }}
            >
              {benefits.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 18px",
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.card,
                  }}
                >
                  <div
                    style={{
                      color: COLORS.gold,
                      fontSize: 18,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                      {b.title}
                    </div>
                    <div style={{ color: COLORS.faint, fontSize: 13 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "16px 20px",
                border: `1px solid ${COLORS.goldD}`,
                background: COLORS.goldF,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: COLORS.gold,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Zero risk
              </div>
              <p style={{ color: COLORS.faint, fontSize: 13, lineHeight: 1.65 }}>
                Pitching is always free. I&apos;ll review your idea and respond with
                honest feedback within 48 hours. No commitment required.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.12 }}
          >
            <div
              style={{
                padding: "clamp(28px,4vw,44px)",
                border: `1px solid ${COLORS.goldD}`,
                background: COLORS.card,
              }}
            >
              <PitchForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
