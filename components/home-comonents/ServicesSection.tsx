"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { COLORS, EASE_X, HN, MONO, PROFILE_DATA } from "~/data/portfolio.data";
import { useInView } from "~/hooks/useInView";
import { SH, SLabel } from "../ui/SectionsComponents";
import { Btn, Card3D, ServiceIcon } from "./shared";

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
      {/* Ambient glow */}
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
              <Card3D
                variant="service"
                accentColor={svc.color}
                topBar
                tiltDeg={9}
                padding="clamp(28px,4vw,40px)"
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
              >
                {/* Icon */}
                <div style={{ marginBottom: 20 }}>
                  <ServiceIcon icon={svc.icon} color={svc.color} size={26} />
                </div>

                {/* Title */}
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      fontSize: "clamp(20px,2.8vw,27px)",
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                      marginBottom: 6,
                      fontFamily: HN,
                      color: COLORS.text,
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

                {/* Items list */}
                <div style={{ flex: 1, marginBottom: 28 }}>
                  {svc.items.map((item, ii) => (
                    <div
                      key={ii}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: "10px 0",
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <ArrowRight
                        size={13}
                        color={svc.color}
                        style={{ flexShrink: 0, marginTop: 3 }}
                      />
                      <span style={{ color: COLORS.faint, fontSize: 14, lineHeight: 1.4 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing + CTA */}
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
                  <Btn
                    href={svc.href}
                    variant="outline"
                    fullWidth
                    style={{
                      borderColor: svc.color + "55",
                      color: svc.color,
                      justifyContent: "center",
                    }}
                    iconRight={<ArrowRight size={13} />}
                  >
                    {svc.cta}
                  </Btn>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
