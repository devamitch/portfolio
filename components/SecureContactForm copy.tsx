"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReCaptcha } from "next-recaptcha-v3";
import { useCallback, useState } from "react";

interface Props {
  dark: boolean;
}

// Color tokens
const C = {
  bg: "#060606",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.70)",
  faint: "rgba(255,255,255,0.48)",
  vfaint: "rgba(255,255,255,0.30)",
  ghost: "rgba(255,255,255,0.14)",
  border: "rgba(255,255,255,0.09)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.35)",
  goldF: "rgba(201,168,76,0.12)",
  goldGrad: "linear-gradient(135deg, #DAA520 0%, #F5C842 50%, #B8860B 100%)",
};

export default function SecureContactForm({ dark }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Use the next-recaptcha-v3 hook
  const { executeRecaptcha } = useReCaptcha();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (files.length + newFiles.length > 3) {
      setErrorMessage("Maximum 3 files allowed");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    for (const f of newFiles) {
      if (f.size > 5 * 1024 * 1024) {
        setErrorMessage(`"${f.name}" exceeds 5MB limit`);
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }

    setFiles([...files, ...newFiles]);
    setErrorMessage("");
  };

  const removeFile = (idx: number) =>
    setFiles(files.filter((_, i) => i !== idx));

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.readAsDataURL(f);
      r.onload = () => res(r.result as string);
      r.onerror = rej;
    });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!form.name || !form.email || !form.message) {
        setErrorMessage("Please fill in all required fields");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      if (form.message.length < 10) {
        setErrorMessage("Message must be at least 10 characters");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      setStatus("sending");
      setErrorMessage("");
      setSuccessMessage("");

      try {
        // ✅ Execute reCAPTCHA
        const token = await executeRecaptcha("form_submit");

        console.log("✅ reCAPTCHA token received");

        // Convert files to base64
        const filesData = await Promise.all(
          files.map(async (f) => ({
            name: f.name,
            type: f.type,
            size: f.size,
            data: await fileToBase64(f),
          })),
        );

        // Send to API
        console.log("📤 Sending form data...");
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            recaptchaToken: token,
            files: filesData.length > 0 ? filesData : undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Server error: ${res.status}`);
        }

        // Success
        console.log("✅ Message sent successfully");
        setStatus("success");
        setSuccessMessage(
          data.message || "Message sent! I'll respond within 24 hours.",
        );

        // Reset form
        setForm({
          name: "",
          email: "",
          company: "",
          role: "",
          subject: "",
          message: "",
        });
        setFiles([]);

        // Reset status after 5s
        setTimeout(() => {
          setStatus("idle");
          setSuccessMessage("");
        }, 5000);
      } catch (err) {
        console.error("❌ Form submission error:", err);
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );

        // Reset status after 5s
        setTimeout(() => {
          setStatus("idle");
        }, 5000);
      }
    },
    [executeRecaptcha, form, files],
  );

  // Shared input style
  const inp: React.CSSProperties = {
    padding: "14px 18px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${C.border}`,
    color: C.text,
    fontFamily: "inherit",
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    color: C.vfaint,
    marginBottom: 7,
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: "monospace",
  };

  const labelGold: React.CSSProperties = { ...labelStyle, color: C.gold };

  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = "rgba(201,168,76,0.4)";
    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.07)";
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = C.border;
    e.target.style.boxShadow = "none";
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      {/* Name & Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label style={labelGold}>Name *</label>
          <input
            type="text"
            placeholder="Jane Smith"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label style={labelGold}>Email *</label>
          <input
            type="email"
            placeholder="jane@company.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={status === "sending"}
          />
        </div>
      </div>

      {/* Company & Role */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Company</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label style={labelStyle}>Your Role</label>
          <input
            type="text"
            placeholder="CTO / VP Eng / Founder"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={status === "sending"}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          placeholder="VP Engineering Opportunity"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          style={inp}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={status === "sending"}
        />
      </div>

      {/* Message */}
      <div>
        <label style={labelGold}>Message *</label>
        <textarea
          rows={7}
          placeholder="Tell me about the role, project, or opportunity..."
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inp, resize: "vertical", minHeight: 140 }}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={status === "sending"}
        />
        <div
          style={{
            fontSize: 11,
            color: C.ghost,
            marginTop: 5,
            fontFamily: "monospace",
          }}
        >
          {form.message.length} / 5000
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label style={labelStyle}>Attachments — max 3 files · 5MB each</label>
        <div
          style={{
            position: "relative",
            border: `1px dashed ${C.border}`,
            padding: "20px 24px",
            textAlign: "center",
            background: "rgba(255,255,255,0.015)",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: status === "sending" ? 0.5 : 1,
          }}
          onDragOver={(e) => {
            if (status === "sending") return;
            e.preventDefault();
            e.currentTarget.style.borderColor = C.goldD;
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
          }}
          onDrop={(e) => {
            if (status === "sending") return;
            e.preventDefault();
            const dropped = Array.from(e.dataTransfer.files);
            if (files.length + dropped.length <= 3)
              setFiles([...files, ...dropped]);
            e.currentTarget.style.borderColor = C.border;
          }}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            disabled={status === "sending"}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: status === "sending" ? "not-allowed" : "pointer",
            }}
          />
          <div
            style={{ fontSize: 11, color: C.vfaint, fontFamily: "monospace" }}
          >
            Drag & drop or click · PDF, DOC, Images
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {files.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "rgba(201,168,76,0.06)",
                  border: `1px solid rgba(201,168,76,0.18)`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                    {f.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.vfaint,
                      fontFamily: "monospace",
                    }}
                  >
                    {(f.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  disabled={status === "sending"}
                  style={{
                    padding: "4px 10px",
                    background: "transparent",
                    border: `1px solid rgba(255,80,80,0.3)`,
                    color: "rgba(255,80,80,0.7)",
                    fontSize: 10,
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    transition: "all 0.2s",
                    opacity: status === "sending" ? 0.5 : 1,
                  }}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 16px",
              background: "rgba(255,60,60,0.08)",
              border: "1px solid rgba(255,60,60,0.25)",
              color: "rgba(255,100,100,0.9)",
              fontSize: 13,
              fontFamily: "monospace",
              lineHeight: 1.5,
            }}
          >
            ⚠️ {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 16px",
              background: "rgba(76,175,80,0.08)",
              border: "1px solid rgba(76,175,80,0.25)",
              color: "rgba(100,200,110,0.9)",
              fontSize: 13,
              fontFamily: "monospace",
              lineHeight: 1.5,
            }}
          >
            ✅ {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: 18,
          background: C.goldGrad,
          border: "none",
          color: "#000",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          boxShadow:
            status === "sending" ? "none" : "0 6px 20px rgba(201,168,76,0.35)",
          opacity: status === "sending" ? 0.65 : 1,
        }}
      >
        {status === "idle" && "Send Message →"}
        {status === "sending" && "Sending..."}
        {status === "success" && "Message Sent ✓"}
        {status === "error" && "Try Again"}
      </button>

      {/* Security note */}
      <div
        style={{
          textAlign: "center",
          fontSize: 10,
          color: C.ghost,
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "rgba(76,175,80,0.6)", fontSize: 11 }}>●</span>
        <span>reCAPTCHA v3 · Rate limited · Spam filtered · Secure</span>
      </div>
    </form>
  );
}
