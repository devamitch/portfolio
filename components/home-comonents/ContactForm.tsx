"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/contact-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      setStatus("success");
      setForm({
        name: "",
        email: "",
        company: "",
        role: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inp: React.CSSProperties = {
    padding: "13px 14px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color .2s,box-shadow .2s",
    background: "rgba(255,255,255,.02)",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: 9,
    color: COLORS.vfaint,
    marginBottom: 6,
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: MONO,
  };
  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = "rgba(201,168,76,.38)";
    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,.05)";
  };
  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = COLORS.border;
    e.target.style.boxShadow = "none";
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 13 }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
        className="form2col"
      >
        <div>
          <label style={{ ...lbl, color: COLORS.gold }}>Name *</label>
          <input
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={{ ...lbl, color: COLORS.gold }}>Email *</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
        className="form2col"
      >
        <div>
          <label style={lbl}>Company</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={lbl}>Your Role</label>
          <input
            type="text"
            placeholder="CTO / Founder"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
      <div>
        <label style={lbl}>Subject</label>
        <input
          type="text"
          placeholder="Principal Architect Opportunity"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          style={inp}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      <div>
        <label style={{ ...lbl, color: COLORS.gold }}>Message *</label>
        <textarea
          required
          rows={5}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inp, resize: "vertical", minHeight: 120 }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <div
          style={{
            fontSize: 9,
            color: COLORS.ghost,
            marginTop: 4,
            fontFamily: MONO,
          }}
        >
          {form.message.length}/5000
        </div>
      </div>
      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={status === "idle" ? { scale: 1.01 } : {}}
        whileTap={status === "idle" ? { scale: 0.99 } : {}}
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
          cursor: status === "sending" ? "not-allowed" : "pointer",
          opacity: status === "sending" ? 0.65 : 1,
          boxShadow:
            status !== "sending" ? "0 6px 24px rgba(201,168,76,.28)" : "none",
          transition: "box-shadow .3s,opacity .3s",
        }}
      >
        {status === "idle"
          ? "Send Message →"
          : status === "sending"
            ? "Sending..."
            : status === "success"
              ? "Sent ✓"
              : "Try Again"}
      </motion.button>
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 18px",
              background: "rgba(76,175,80,.07)",
              border: "1px solid rgba(76,175,80,.22)",
              color: "rgba(100,200,110,.9)",
              fontSize: 12,
              fontFamily: MONO,
            }}
          >
            Message sent — I&apos;ll respond within 24 hours.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
