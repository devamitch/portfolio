"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

const C = {
  bg: "#0A0A0A",
  border: "rgba(255,255,255,0.07)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.3)",
  goldF: "rgba(201,168,76,0.07)",
  goldGrad: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.65)",
  faint: "rgba(255,255,255,0.38)",
  vfaint: "rgba(255,255,255,0.22)",
  ghost: "rgba(255,255,255,0.10)",
};
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";

type Status = "idle" | "sending" | "success" | "error";
type Duration = 15 | 30 | 60;

const INP: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 13,
  background: "rgba(255,255,255,0.025)",
  border: `1px solid rgba(255,255,255,0.07)`,
  color: "#FFFFFF",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
  borderRadius: 0,
};
const LBL: React.CSSProperties = {
  display: "block",
  fontFamily: MONO,
  fontSize: 9,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.22)",
  marginBottom: 6,
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const TIME_SLOTS = [
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
  { label: "14:00", value: "14:00" },
  { label: "14:30", value: "14:30" },
  { label: "15:00", value: "15:00" },
  { label: "15:30", value: "15:30" },
  { label: "16:00", value: "16:00" },
  { label: "20:00", value: "20:00" },
  { label: "20:30", value: "20:30" },
  { label: "21:00", value: "21:00" },
];

const fmt24to12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
};

function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (d: string) => void;
}) {
  const [anchor, setAnchor] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const year = anchor.getFullYear();
  const mo = anchor.getMonth();
  const firstDow = new Date(year, mo, 1).getDay();
  const daysInMo = new Date(year, mo + 1, 0).getDate();

  const isDisabled = (day: number) => {
    const d = new Date(year, mo, day);
    d.setHours(0, 0, 0, 0);
    return d <= today || d > maxDate || d.getDay() === 0 || d.getDay() === 6;
  };
  const isSelected = (day: number) =>
    value === new Date(year, mo, day).toISOString().split("T")[0];

  const shift = (dir: 1 | -1) => {
    const d = new Date(anchor);
    d.setMonth(d.getMonth() + dir);
    setAnchor(d);
  };

  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        background: "rgba(255,255,255,0.015)",
        padding: 16,
      }}
    >
      {}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => shift(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.faint,
            fontSize: 18,
            padding: "2px 8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
        >
          ‹
        </button>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: C.dim,
            letterSpacing: "0.12em",
          }}
        >
          {MONTHS[mo]} {year}
        </span>
        <button
          onClick={() => shift(1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.faint,
            fontSize: 18,
            padding: "2px 8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
        >
          ›
        </button>
      </div>

      {}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
          marginBottom: 4,
        }}
      >
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 8,
              color: C.ghost,
              letterSpacing: "0.1em",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 2,
        }}
      >
        {Array.from({ length: firstDow }, (_, i) => (
          <div key={`pad${i}`} />
        ))}
        {Array.from({ length: daysInMo }, (_, i) => {
          const day = i + 1;
          const dis = isDisabled(day);
          const sel = isSelected(day);
          return (
            <motion.button
              key={day}
              whileHover={!dis ? { scale: 1.12 } : {}}
              whileTap={!dis ? { scale: 0.93 } : {}}
              onClick={() => {
                if (!dis)
                  onChange(new Date(year, mo, day).toISOString().split("T")[0]);
              }}
              style={{
                padding: "7px 0",
                textAlign: "center",
                fontFamily: MONO,
                fontSize: 11,
                cursor: dis ? "not-allowed" : "pointer",
                background: sel ? C.gold : "transparent",
                color: dis ? C.ghost : sel ? "#000" : C.dim,
                border: `1px solid ${sel ? C.gold : "transparent"}`,
                opacity: dis ? 0.28 : 1,
                transition: "all 0.15s",
                borderRadius: 0,
                fontWeight: sel ? 700 : 400,
              }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 2,
            position: "relative",
            background: C.border,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={false}
            animate={{ scaleX: i < step ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: C.gold,
              transformOrigin: "left",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          border: `1px solid ${C.goldD}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontSize: 9,
          color: C.gold,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 9,
          color: C.gold,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function GoogleMeetForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [duration, setDuration] = useState<Duration>(30);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{
    meetLink: string;
    dateLabel: string;
  } | null>(null);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.email) return;
      setStatus("sending");
      try {
        const res = await fetch("/api/schedule-meeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, date, time, duration }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Request failed");
        setStatus("success");
        setResult({ meetLink: data.meetLink, dateLabel: formatDate(date) });
      } catch (err) {
        console.error(err);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    },
    [form, date, time, duration],
  );

  if (result)
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: "32px 0" }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: `1px solid ${C.goldD}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.gold}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: C.text,
            letterSpacing: "-0.02em",
            marginBottom: 8,
            fontFamily: HN,
          }}
        >
          Meeting Confirmed
        </h3>
        <p
          style={{
            fontSize: 13,
            color: C.dim,
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          {result.dateLabel} &mdash; {fmt24to12(time)} IST &mdash; {duration}{" "}
          minutes
        </p>
        <div
          style={{
            padding: "14px 16px",
            border: `1px solid ${C.goldD}`,
            background: C.goldF,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              color: C.gold,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Google Meet Link
          </div>
          <a
            href={result.meetLink}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              color: C.gold,
              textDecoration: "none",
              wordBreak: "break-all",
              fontFamily: MONO,
            }}
          >
            {result.meetLink} ↗
          </a>
        </div>
        <p
          style={{
            fontSize: 10,
            color: C.vfaint,
            fontFamily: MONO,
            letterSpacing: "0.1em",
          }}
        >
          A calendar invite has been sent to {form.email}
        </p>
      </motion.div>
    );

  const durations: { value: Duration; label: string; sub: string }[] = [
    { value: 15, label: "15 min", sub: "Quick sync" },
    { value: 30, label: "30 min", sub: "Discovery call" },
    { value: 60, label: "60 min", sub: "Deep dive" },
  ];

  const SummaryBar = () =>
    date && time ? (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "10px 14px",
          border: `1px solid ${C.goldD}`,
          background: C.goldF,
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 12, color: C.dim }}>{formatDate(date)}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.gold }}>
          {fmt24to12(time)} &nbsp;&middot;&nbsp; {duration}m
        </span>
      </motion.div>
    ) : null;

  return (
    <div>
      <Progress step={step} total={3} />

      <AnimatePresence mode="wait">
        {}
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
          >
            <StepLabel n={1} label="Meeting Length" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {durations.map((d) => (
                <motion.button
                  key={d.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setDuration(d.value);
                    setStep(2);
                  }}
                  style={{
                    padding: "20px 12px",
                    border: `1px solid ${duration === d.value ? C.gold : C.border}`,
                    background: duration === d.value ? C.goldF : "transparent",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      fontFamily: HN,
                      fontSize: 26,
                      fontWeight: 900,
                      color: C.gold,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {d.label.split(" ")[0]}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 8,
                      color: C.vfaint,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    min
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: C.faint,
                      marginTop: 6,
                    }}
                  >
                    {d.sub}
                  </div>
                </motion.button>
              ))}
            </div>
            <p
              style={{
                fontSize: 11,
                color: C.vfaint,
                fontFamily: MONO,
                lineHeight: 1.7,
              }}
            >
              All times in IST (UTC+5:30). A Google Meet link is generated
              automatically. Both parties receive a calendar invite via email.
            </p>
          </motion.div>
        )}

        {}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.vfaint,
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  transition: "color 0.2s",
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.vfaint)}
              >
                ← Back
              </button>
              <StepLabel n={2} label="Date & Time" />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 16,
              }}
              className="sched-grid"
            >
              <DatePicker value={date} onChange={setDate} />

              {}
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: C.vfaint,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Available — IST
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 4,
                    maxHeight: 280,
                    overflowY: "auto",
                  }}
                >
                  {TIME_SLOTS.map((s) => (
                    <motion.button
                      key={s.value}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setTime(s.value)}
                      style={{
                        padding: "9px 6px",
                        fontFamily: MONO,
                        fontSize: 10,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "center",
                        background:
                          time === s.value ? C.gold : "rgba(255,255,255,0.02)",
                        color: time === s.value ? "#000" : C.dim,
                        border: `1px solid ${time === s.value ? C.gold : C.border}`,
                        fontWeight: time === s.value ? 700 : 400,
                        borderRadius: 0,
                      }}
                    >
                      {fmt24to12(s.value)}
                    </motion.button>
                  ))}
                </div>

                {date && time && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: 14,
                      padding: "10px 12px",
                      border: `1px solid rgba(201,168,76,0.2)`,
                      background: C.goldF,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 9,
                        color: C.gold,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Selected
                    </div>
                    <div style={{ fontSize: 12, color: C.dim }}>
                      {formatDate(date)}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 11,
                        color: C.gold,
                        marginTop: 3,
                      }}
                    >
                      {fmt24to12(time)} &nbsp;&middot;&nbsp; {duration} min
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={date && time ? { scale: 1.01 } : {}}
              whileTap={date && time ? { scale: 0.99 } : {}}
              onClick={() => date && time && setStep(3)}
              style={{
                width: "100%",
                padding: 14,
                background: date && time ? C.goldGrad : C.border,
                border: "none",
                color: date && time ? "#000" : C.vfaint,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: MONO,
                cursor: date && time ? "pointer" : "not-allowed",
                transition: "all 0.3s",
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        {}
        {step === 3 && !result && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <button
                onClick={() => setStep(2)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.vfaint,
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  transition: "color 0.2s",
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.vfaint)}
              >
                ← Back
              </button>
              <StepLabel n={3} label="Your Details" />
            </div>
            <SummaryBar />

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
                className="form-half-grid"
              >
                <div>
                  <label style={{ ...LBL, color: C.gold }}>Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={INP}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(201,168,76,0.45)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = C.border)}
                  />
                </div>
                <div>
                  <label style={{ ...LBL, color: C.gold }}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    style={INP}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(201,168,76,0.45)")
                    }
                    onBlur={(e) => (e.target.style.borderColor = C.border)}
                  />
                </div>
              </div>

              <div>
                <label style={LBL}>Company / Role</label>
                <input
                  type="text"
                  placeholder="Acme Corp — CTO"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  style={INP}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.45)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = C.border)}
                />
              </div>

              <div>
                <label style={LBL}>Agenda</label>
                <textarea
                  rows={3}
                  placeholder="What would you like to discuss?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  style={{ ...INP, resize: "vertical", minHeight: 80 }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(201,168,76,0.45)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = C.border)}
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending"}
                whileHover={status !== "sending" ? { scale: 1.01 } : {}}
                whileTap={status !== "sending" ? { scale: 0.99 } : {}}
                style={{
                  width: "100%",
                  padding: 16,
                  background:
                    status !== "error" ? C.goldGrad : "rgba(255,80,80,0.15)",
                  border: `1px solid ${status === "error" ? "rgba(255,80,80,0.4)" : "transparent"}`,
                  color: status !== "error" ? "#000" : "rgba(255,120,120,0.9)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                  opacity: status === "sending" ? 0.6 : 1,
                  boxShadow:
                    status === "idle"
                      ? "0 6px 20px rgba(201,168,76,0.25)"
                      : "none",
                  transition: "all 0.3s",
                }}
              >
                {status === "idle" && "Book Google Meet"}
                {status === "sending" && "Creating invite..."}
                {status === "error" && "Something went wrong — Retry"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width:600px) {
          .sched-grid { grid-template-columns: 1fr !important; }
          .form-half-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function MeetingScheduler() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";
  const [tab, setTab] = useState<"meet" | "calendly">("meet");

  const TabBtn = ({
    id,
    label,
  }: {
    id: "meet" | "calendly";
    label: string;
  }) => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => setTab(id)}
      style={{
        flex: 1,
        padding: "12px 16px",
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        cursor: "pointer",
        background: tab === id ? C.gold : "transparent",
        color: tab === id ? "#000" : C.faint,
        border: `1px solid ${tab === id ? C.gold : C.border}`,
        fontWeight: tab === id ? 700 : 400,
        transition: "all 0.25s",
      }}
    >
      {label}
    </motion.button>
  );

  return (
    <div>
      {}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#34D399",
              animation: "sched-pulse 2.5s infinite",
            }}
          />
          <h3
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#FFFFFF",
              margin: 0,
              letterSpacing: "-0.01em",
              fontFamily: HN,
            }}
          >
            Schedule a Call
          </h3>
        </div>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
            fontFamily: MONO,
            lineHeight: 1.6,
          }}
        >
          Google Meet link generated automatically &mdash; both parties get a
          calendar invite
        </p>
      </div>

      {}
      {calendlyUrl ? (
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          <TabBtn id="meet" label="Google Meet" />
          <TabBtn id="calendly" label="Calendly" />
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {tab === "meet" ? (
          <motion.div
            key="meet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <GoogleMeetForm />
          </motion.div>
        ) : (
          <motion.div
            key="cal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {calendlyUrl && (
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  background: "rgba(255,255,255,0.015)",
                  minHeight: 600,
                  overflow: "hidden",
                }}
              >
                <div
                  className="calendly-inline-widget"
                  data-url={`${calendlyUrl}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=c9a84c`}
                  style={{ minWidth: 320, height: 600 }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes sched-pulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(52,211,153,0.5)} 50%{opacity:0.5;box-shadow:0 0 0 5px rgba(52,211,153,0)} }
      `}</style>
    </div>
  );
}