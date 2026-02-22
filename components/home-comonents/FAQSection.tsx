import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "lucide-react";
import { useRef, useState } from "react";
import { COLORS, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { GoldAccent, SLabel } from "../ui/SectionsComponents";

export default function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);
  const [open, setOpen] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  const cats = [
    "All",
    ...Array.from(new Set(PROFILE_DATA.faqs.map((f) => f.cat))),
  ];
  const filtered =
    filterCat === "All"
      ? PROFILE_DATA.faqs
      : PROFILE_DATA.faqs.filter((f) => f.cat === filterCat);

  return (
    <section
      id="faq"
      ref={ref}
      style={{ padding: "clamp(80px,10vw,140px) 0", background: COLORS.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.8fr",
            gap: "clamp(40px,6vw,100px)",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left sticky */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.72 }}
            style={{ position: "sticky", top: 120 }}
          >
            <SLabel num="08">FAQ</SLabel>
            <h2
              style={{
                fontFamily: HN,
                fontSize: "clamp(28px,4vw,50px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Questions
              <br />
              <GoldAccent>answered.</GoldAccent>
            </h2>
            <p
              style={{
                color: COLORS.faint,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Everything you might want to know before reaching out. If your
              question isn't here, just ask directly.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 28,
              }}
            >
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCat(cat);
                    setOpen(null);
                  }}
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${filterCat === cat ? COLORS.gold : COLORS.border}`,
                    background:
                      filterCat === cat ? COLORS.goldF : "transparent",
                    color: filterCat === cat ? COLORS.gold : COLORS.faint,
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    transition: "all .2s",
                    textTransform: "uppercase",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                border: `1px solid ${COLORS.goldD}`,
                color: COLORS.gold,
                textDecoration: "none",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                transition: "background .2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  COLORS.goldF)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              Contact me →
            </a>
          </motion.div>

          {/* Right: accordion */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={filterCat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {filtered.map((faq, i) => (
                  <motion.div
                    key={`${filterCat}-${i}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.04 + i * 0.04 }}
                    style={{ borderBottom: `1px solid ${COLORS.border}` }}
                  >
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "20px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        gap: 16,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "clamp(14px,1.7vw,16px)",
                          color: open === i ? COLORS.gold : COLORS.text,
                          fontWeight: open === i ? 600 : 400,
                          transition: "color .2s",
                          lineHeight: 1.45,
                          flex: 1,
                          fontFamily: HN,
                        }}
                      >
                        {faq.q}
                      </span>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: `1px solid ${open === i ? COLORS.gold : COLORS.border}`,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all .3s",
                          transform: open === i ? "rotate(45deg)" : "rotate(0)",
                          color: open === i ? COLORS.gold : COLORS.faint,
                          fontSize: 16,
                          marginTop: 2,
                        }}
                      >
                        +
                      </div>
                    </button>
                    <AnimatePresence>
                      {open === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              paddingBottom: 20,
                            }}
                          >
                            <Badge color={COLORS.gold}>{faq.cat}</Badge>
                            <p
                              style={{
                                color: COLORS.faint,
                                fontSize: 14,
                                lineHeight: 1.72,
                              }}
                            >
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
