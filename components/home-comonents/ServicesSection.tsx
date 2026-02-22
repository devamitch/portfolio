"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);

  return (
    <section
      id="services"
      ref={ref}
      style={{
        padding: "clamp(80px,10vw,140px) 0",
        position: "relative",
        overflow: "hidden",
        background: COLORS.bg2,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 100%,${COLORS.goldF} 0%,transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
        }}
      >
        <SLabel num="05">Work With Me</SLabel>
        <SH l1="Turn vision" l2="into reality." />
        <p
          style={{
            fontSize: 18,
            color: COLORS.dim,
            maxWidth: 540,
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: 60,
          }}
        >
          Whether you have a raw idea, need an expert review, or want a complete
          build — here's how we work together.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          {PROFILE_DATA.services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 52 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: i * 0.13, ease: EASE_X }}
            >
              <motion.div
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,76,.15)",
                }}
                transition={{ duration: 0.4 }}
                style={{
                  padding: "clamp(28px,4vw,40px)",
                  border: `1px solid ${svc.color}28`,
                  background: COLORS.card,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow .4s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: svc.color,
                  }}
                />
                <div
                  style={{
                    fontSize: 28,
                    color: svc.color,
                    marginBottom: 20,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {svc.icon}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      fontSize: "clamp(20px,2.8vw,27px)",
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                      marginBottom: 6,
                      fontFamily: HN,
                    }}
                  >
                    {svc.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: svc.color,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {svc.sub}
                  </div>
                </div>
                <div style={{ flex: 1, marginBottom: 28 }}>
                  {svc.items.map((item, ii) => (
                    <div
                      key={ii}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        padding: "10px 0",
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <span
                        style={{
                          color: svc.color,
                          flexShrink: 0,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        →
                      </span>
                      <span
                        style={{ color: COLORS.faint, fontSize: 14, lineHeight: 1.4 }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${svc.color}22`,
                    paddingTop: 22,
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(18px,2.4vw,22px)",
                      fontWeight: 800,
                      color: svc.color,
                      marginBottom: 4,
                    }}
                  >
                    {svc.price}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: COLORS.vfaint,
                      letterSpacing: "0.06em",
                      marginBottom: 16,
                    }}
                  >
                    {svc.note}
                  </div>
                  <a
                    href={svc.href}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "13px",
                      background: `${svc.color}18`,
                      border: `1px solid ${svc.color}44`,
                      color: svc.color,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                      fontFamily: HN,
                      transition: "background .22s,transform .22s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        `${svc.color}30`;
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        `${svc.color}18`;
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    {svc.cta}
                  </a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
