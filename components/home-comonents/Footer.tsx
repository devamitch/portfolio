import { useState } from "react";
import { COLORS, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { Button, Input } from "../ui";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "pending" | "done">(
    "idle",
  );
  const year = new Date().getFullYear();

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("pending");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus("done");
      setEmail("");
    } catch {
      setSubStatus("done");
    }
  };

  const cols = {
    Navigate: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Skills", href: "#skills" },
      { label: "Story", href: "#story" },
      { label: "Blog", href: "#blog" },
    ],
    Services: [
      { label: "Pitch Your Idea", href: "#pitch" },
      { label: "Consulting", href: "#services" },
      { label: "End-to-End Build", href: "#services" },
      { label: "Book a Meeting", href: "#contact" },
      { label: "FAQ", href: "#faq" },
    ],
    Connect: [
      { label: "LinkedIn", href: PROFILE_DATA.linkedin },
      { label: "X", href: PROFILE_DATA.twitter },
      { label: "GitHub", href: PROFILE_DATA.github },
      { label: "Medium", href: PROFILE_DATA.medium },
      { label: "Email", href: `mailto:${PROFILE_DATA.email}` },
    ],
  };

  const footerStats = [
    { l: "Years", v: "8+" },
    { l: "Apps Shipped", v: "18+" },
    { l: "Active Users", v: "50K+" },
    { l: "Engineers Led", v: "21" },
    { l: "Contributions", v: "2,029" },
    { l: "Location", v: "Kolkata" },
  ];

  return (
    <footer
      style={{
        padding: "clamp(60px,9vw,110px) 0 0",
        borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr repeat(3,1fr)",
            gap: "clamp(28px,4vw,56px)",
            marginBottom: "clamp(48px,7vw,80px)",
            alignItems: "start",
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div>
            <div
              style={{
                fontFamily: HN,
                fontSize: "clamp(20px,2.5vw,28px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                marginBottom: 12,
              }}
            >
              <span style={{ color: COLORS.gold }}>
                {PROFILE_DATA.nameFirst[0]}
              </span>
              C<span style={{ color: "rgba(201,168,76,.4)" }}>.</span>
            </div>
            <p
              style={{
                color: COLORS.faint,
                fontSize: 13,
                lineHeight: 1.7,
                marginBottom: 24,
                maxWidth: 280,
              }}
            >
              Principal Architect. 0-to-1 builder. Eight years. Eighteen apps.
              Zero shortcuts.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
              {[
                { href: PROFILE_DATA.linkedin, label: "Li" },
                { href: PROFILE_DATA.github, label: "GH" },
                { href: PROFILE_DATA.medium, label: "Me" },
                { href: `mailto:${PROFILE_DATA.email}`, label: "@" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 34,
                    height: 34,
                    border: `1px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.faint,
                    fontFamily: MONO,
                    fontSize: 9,
                    textDecoration: "none",
                    transition: "all .22s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = COLORS.goldD;
                    el.style.color = COLORS.gold;
                    el.style.background = COLORS.goldF;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = COLORS.border;
                    el.style.color = COLORS.faint;
                    el.style.background = "transparent";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
            {/* Newsletter */}
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: COLORS.gold,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Newsletter
              </div>
              <p
                style={{
                  color: COLORS.vfaint,
                  fontSize: 12,
                  lineHeight: 1.65,
                  marginBottom: 14,
                  maxWidth: 280,
                }}
              >
                Architecture insights, engineering essays, real-world lessons.
                No spam. Ever.
              </p>
              {subStatus === "done" ? (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: COLORS.green,
                    letterSpacing: "0.1em",
                  }}
                >
                  You're subscribed.
                </div>
              ) : (
                <form onSubmit={handleSub} style={{ display: "flex", gap: 8 }}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                  <Button type="submit" disabled={subStatus === "pending"}>
                    {subStatus === "pending" ? "..." : "Join"}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {(
            Object.entries(cols) as [
              string,
              { label: string; href: string }[],
            ][]
          ).map(([col, links]) => (
            <div key={col}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: COLORS.gold,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {col}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 11 }}
              >
                {links.map((l, i) => (
                  <a
                    key={i}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      color: COLORS.faint,
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "color .2s",
                      fontFamily: HN,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        COLORS.text)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        COLORS.faint)
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            padding: "clamp(28px,4vw,44px) 0",
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))",
            gap: "clamp(16px,3vw,28px)",
            marginBottom: "clamp(24px,4vw,40px)",
            textAlign: "center",
          }}
        >
          {footerStats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: HN,
                  fontSize: "clamp(20px,3vw,32px)",
                  fontWeight: 900,
                  color: COLORS.gold,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  color: COLORS.vfaint,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "clamp(16px,3vw,24px) 0 clamp(32px,5vw,60px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 9,
              color: COLORS.ghost,
              fontFamily: MONO,
              letterSpacing: "0.12em",
            }}
          >
            © {year} Amit Chakraborty · Built by hand. Not by prompt.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["LinkedIn", PROFILE_DATA.linkedin],
              ["GitHub", PROFILE_DATA.github],
              ["Medium", PROFILE_DATA.medium],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 10,
                  fontFamily: MONO,
                  letterSpacing: "0.15em",
                  color: COLORS.vfaint,
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = COLORS.gold)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = COLORS.vfaint)
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
