"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface ContactFormProps {
  dark: boolean;
}

const T = {
  bg: (d: boolean) => (d ? "#060606" : "#FAF8F3"),
  bg2: (d: boolean) => (d ? "#0C0C0C" : "#F0EDE6"),
  text: (d: boolean) => (d ? "#FFFFFF" : "#1A1A1A"),
  dim: (d: boolean) => (d ? "rgba(255,255,255,0.48)" : "rgba(26,26,26,0.58)"),
  faint: (d: boolean) => (d ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.32)"),
  vfaint: (d: boolean) => (d ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.15)"),
  border: (d: boolean) =>
    d ? "rgba(255,255,255,0.07)" : "rgba(26,26,26,0.12)",
  card: (d: boolean) =>
    d ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.92)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.35)",
  goldF: "rgba(201,168,76,0.1)",
  goldGrad: "linear-gradient(135deg, #C9A84C 0%, #F0C040 50%, #9B7A2A 100%)",
};

export default function SecureContactForm({ dark }: ContactFormProps) {
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

  // Load reCAPTCHA
  const loadRecaptcha = () => {
    return new Promise((resolve) => {
      if ((window as any).grecaptcha) {
        resolve((window as any).grecaptcha);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.addEventListener("load", () => {
        resolve((window as any).grecaptcha);
      });
      document.body.appendChild(script);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validate file count
      if (files.length + newFiles.length > 3) {
        setErrorMessage("Maximum 3 files allowed");
        return;
      }

      // Validate file sizes
      for (const file of newFiles) {
        if (file.size > 5 * 1024 * 1024) {
          setErrorMessage(
            `File "${file.name}" is too large. Maximum size is 5MB`,
          );
          return;
        }
      }

      setFiles([...files, ...newFiles]);
      setErrorMessage("");
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Load reCAPTCHA
      await loadRecaptcha();
      const grecaptcha = (window as any).grecaptcha;

      if (!grecaptcha) {
        throw new Error("reCAPTCHA not loaded");
      }

      // Get reCAPTCHA token
      const recaptchaToken = await grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "submit" },
      );

      // Convert files to base64
      const filesData = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          data: await fileToBase64(file),
        })),
      );

      // Submit form
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
          files: filesData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Success
      setStatus("success");
      setSuccessMessage(
        data.message ||
          "Message sent successfully! I'll respond within 24 hours.",
      );
      setForm({
        name: "",
        email: "",
        company: "",
        role: "",
        subject: "",
        message: "",
      });
      setFiles([]);

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
      );

      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const inputStyle = {
    padding: "16px 20px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
    background: dark ? "rgba(255,255,255,0.025)" : "rgba(250,248,243,0.6)",
    border: `1px solid ${T.border(dark)}`,
    color: T.text(dark),
    fontFamily: "inherit",
    borderRadius: "0px",
  };

  const focusStyle = {
    borderColor: "#C9A84C",
    boxShadow: "0 0 0 3px rgba(201,168,76,0.1)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {/* Name & Email */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              color: "#C9A84C",
              marginBottom: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Your Name *
          </label>
          <input
            type="text"
            placeholder="John Doe"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) =>
              (e.target.style.borderColor = dark
                ? "rgba(255,255,255,0.07)"
                : "rgba(26,26,26,0.12)")
            }
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              color: "#C9A84C",
              marginBottom: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Email Address *
          </label>
          <input
            type="email"
            placeholder="john@company.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) =>
              (e.target.style.borderColor = dark
                ? "rgba(255,255,255,0.07)"
                : "rgba(26,26,26,0.12)")
            }
          />
        </div>
      </div>

      {/* Company & Role */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              color: dark ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.5)",
              marginBottom: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Company (Optional)
          </label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) =>
              (e.target.style.borderColor = dark
                ? "rgba(255,255,255,0.07)"
                : "rgba(26,26,26,0.12)")
            }
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              color: dark ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.5)",
              marginBottom: "8px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Your Role (Optional)
          </label>
          <input
            type="text"
            placeholder="CTO / VP Engineering / Founder"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, focusStyle)}
            onBlur={(e) =>
              (e.target.style.borderColor = dark
                ? "rgba(255,255,255,0.07)"
                : "rgba(26,26,26,0.12)")
            }
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "11px",
            color: dark ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.5)",
            marginBottom: "8px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Subject (Optional)
        </label>
        <input
          type="text"
          placeholder="VP Engineering Opportunity"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          style={inputStyle}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) =>
            (e.target.style.borderColor = dark
              ? "rgba(255,255,255,0.07)"
              : "rgba(26,26,26,0.12)")
          }
        />
      </div>

      {/* Message */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "11px",
            color: "#C9A84C",
            marginBottom: "8px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Your Message *
        </label>
        <textarea
          rows={8}
          placeholder="Tell me about the opportunity, project requirements, or collaboration ideas..."
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{
            ...inputStyle,
            resize: "vertical" as const,
            minHeight: "150px",
          }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) =>
            (e.target.style.borderColor = dark
              ? "rgba(255,255,255,0.07)"
              : "rgba(26,26,26,0.12)")
          }
        />
        <div
          style={{
            fontSize: "11px",
            color: dark ? "rgba(255,255,255,0.3)" : "rgba(26,26,26,0.4)",
            marginTop: "6px",
            fontFamily: "monospace",
          }}
        >
          {form.message.length} / 5000 characters
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "11px",
            color: dark ? "rgba(255,255,255,0.4)" : "rgba(26,26,26,0.5)",
            marginBottom: "8px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Attachments (Optional) · Max 3 files, 5MB each
        </label>
        <div
          style={{
            position: "relative",
            border: `2px dashed ${dark ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.15)"}`,
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            background: dark
              ? "rgba(255,255,255,0.02)"
              : "rgba(250,248,243,0.4)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "#C9A84C";
            e.currentTarget.style.background = "rgba(201,168,76,0.05)";
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.borderColor = dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(26,26,26,0.15)";
            e.currentTarget.style.background = dark
              ? "rgba(255,255,255,0.02)"
              : "rgba(250,248,243,0.4)";
          }}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFiles = Array.from(e.dataTransfer.files);
            if (files.length + droppedFiles.length <= 3) {
              setFiles([...files, ...droppedFiles]);
            }
            e.currentTarget.style.borderColor = dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(26,26,26,0.15)";
            e.currentTarget.style.background = dark
              ? "rgba(255,255,255,0.02)"
              : "rgba(250,248,243,0.4)";
          }}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
            }}
          />
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📎</div>
          <div
            style={{
              fontSize: "13px",
              color: dark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.6)",
              marginBottom: "4px",
            }}
          >
            Drag & drop files here or click to browse
          </div>
          <div
            style={{
              fontSize: "11px",
              color: dark ? "rgba(255,255,255,0.3)" : "rgba(26,26,26,0.4)",
              fontFamily: "monospace",
            }}
          >
            PDF, DOC, Images · Max 5MB per file
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  background: dark
                    ? "rgba(201,168,76,0.08)"
                    : "rgba(201,168,76,0.1)",
                  border: `1px solid ${dark ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.3)"}`,
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontSize: "20px" }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      color: dark ? "#fff" : "#1a1a1a",
                      fontWeight: 500,
                    }}
                  >
                    {file.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: dark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(26,26,26,0.5)",
                      fontFamily: "monospace",
                    }}
                  >
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{
                    padding: "6px 12px",
                    background: "rgba(255,0,0,0.1)",
                    border: "1px solid rgba(255,0,0,0.3)",
                    borderRadius: "6px",
                    color: "#ff4444",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: "14px 18px",
              background: "rgba(255,0,0,0.1)",
              border: "1px solid rgba(255,0,0,0.3)",
              borderRadius: "8px",
              color: "#ff4444",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>⚠️</span>
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: "14px 18px",
              background: "rgba(76,175,80,0.1)",
              border: "1px solid rgba(76,175,80,0.3)",
              borderRadius: "8px",
              color: "#4CAF50",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>✓</span>
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: 18,
          background: T.goldGrad,
          border: "none",
          color: "#000",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          cursor: "pointer",
          transition: "all 0.2s",

          boxShadow:
            status === "sending" ? "none" : "0 6px 20px rgba(201,168,76,0.4)",
          opacity: status === "sending" ? 0.7 : 1,
        }}
      >
        {status === "idle" && "Send Secure Message"}
        {status === "sending" && "Sending..."}
        {status === "success" && "Message Sent!"}
        {status === "error" && "Try Again"}
      </button>

      {/* Security Badge */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: dark ? "rgba(255,255,255,0.3)" : "rgba(26,26,26,0.4)",
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <span style={{ color: "#4CAF50" }}>🔒</span>
        Protected by reCAPTCHA v3 · Rate Limited · Spam Filtered
      </div>

      {/* reCAPTCHA Badge */}
      <div
        style={{
          fontSize: "10px",
          color: dark ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.3)",
          textAlign: "center",
        }}
      >
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#C9A84C", textDecoration: "none" }}
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#C9A84C", textDecoration: "none" }}
        >
          Terms of Service
        </a>{" "}
        apply.
      </div>
    </form>
  );
}
