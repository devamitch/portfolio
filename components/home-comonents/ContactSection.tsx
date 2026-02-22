import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { COLORS, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { MeetingScheduler } from ".";
import { makeLoading } from "../ui/LazyLoadingSkeleton";
import { SLabel } from "../ui/SectionsComponents";

const contactLoading = makeLoading({
  label: "Loading ContactForm",
  height: 400,
});

export const ContactForm = dynamic(
  () => import("./ContactForm").then((m) => m.ContactForm),
  {
    ssr: false,
    loading: contactLoading,
  },
);

export default function ContactSection() {
  const [ctab, setCtab] = useState<"message" | "meeting">("message");
  return (
    <section id="contact" style={{ padding: "120px 0", background: COLORS.bg }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 72,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left contact info */}
          <div>
            <SLabel num="10">Let's Connect</SLabel>
            <motion.h2
              style={{
                fontSize: "clamp(32px,4.5vw,60px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: COLORS.text,
                lineHeight: 0.9,
                marginBottom: 24,
                fontFamily: HN,
              }}
            >
              Ready to build
              <br />
              <span
                style={{
                  WebkitTextStroke: `2px ${COLORS.goldD}`,
                  color: "transparent",
                }}
              >
                something great.
              </span>
            </motion.h2>
            <p
              style={{
                fontSize: 15,
                color: COLORS.dim,
                lineHeight: 1.75,
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              VP Engineering. CTO. Principal Architect. I build systems that
              scale, lead teams that ship, and turn technical vision into
              business reality.
            </p>
            {[
              {
                l: "Email",
                v: PROFILE_DATA.email,
                h: `mailto:${PROFILE_DATA.email}`,
              },
              {
                l: "Phone",
                v: PROFILE_DATA.phone,
                h: `tel:${PROFILE_DATA.phone}`,
              },
              {
                l: "LinkedIn",
                v: "linkedin.com/in/devamitch",
                h: PROFILE_DATA.linkedin,
              },
              {
                l: "GitHub",
                v: "github.com/devamitch",
                h: PROFILE_DATA.github,
              },
              {
                l: "Medium",
                v: "devamitch.medium.com",
                h: PROFILE_DATA.medium,
              },
            ].map((link) => (
              <a
                key={link.l}
                href={link.h}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBlock: 14,
                  borderBottom: `1px solid ${COLORS.border}`,
                  textDecoration: "none",
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderBottomColor = COLORS.goldD)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderBottomColor = COLORS.border)
                }
              >
                <span
                  style={{
                    fontSize: 9,
                    color: COLORS.vfaint,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                  }}
                >
                  {link.l}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: COLORS.faint,
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = COLORS.gold)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = COLORS.faint)
                  }
                >
                  {link.v} ↗
                </span>
              </a>
            ))}
          </div>

          {/* Right: tab form */}
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[
                { k: "message" as const, label: "Send Message" },
                { k: "meeting" as const, label: "Book Meeting" },
              ].map((tab) => (
                <motion.button
                  key={tab.k}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setCtab(tab.k)}
                  style={{
                    flex: 1,
                    padding: "13px 18px",
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    background:
                      ctab === tab.k ? COLORS.gold : "rgba(255,255,255,.02)",
                    color: ctab === tab.k ? "#000" : COLORS.faint,
                    border: `1px solid ${ctab === tab.k ? COLORS.gold : COLORS.border}`,
                    fontWeight: ctab === tab.k ? 700 : 400,
                    transition: "all .3s",
                  }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {ctab === "message" ? (
                <motion.div
                  key="msg"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactForm />
                </motion.div>
              ) : (
                <motion.div
                  key="meet"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <MeetingScheduler />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
