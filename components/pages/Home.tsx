"use client";

import { useEffect, useRef, useState } from "react";
import { COLORS, HN, PROFILE_DATA } from "~/data/portfolio.data";
import {
  AboutSection,
  ContactSection,
  EthosSection,
  ExperienceSection,
  Footer,
  HeroSection,
  ProjectsSection,
  SkillsSection,
} from "../home-comonents";
import { Div } from "../ui/SectionsComponents";

export default function PrimaryHome() {
  const [roleIdx, setRoleIdx] = useState(0);

  /* Rotate roles */
  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % PROFILE_DATA.roles.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* SEO microdata */}
      <div aria-hidden style={{ display: "none" }}>
        <span itemScope itemType="https://schema.org/Person">
          <span itemProp="name">Amit Chakraborty</span>
          <span itemProp="jobTitle">Principal Mobile Architect</span>
          <span itemProp="url">https://old.devamit.co.in/</span>
          <span itemProp="email">{PROFILE_DATA.email}</span>
          <span itemProp="addressLocality">Kolkata</span>
          <span itemProp="addressCountry">India</span>
        </span>
      </div>

      <main
        style={{
          fontFamily: HN,
          background: COLORS.bg,
          color: COLORS.text,
          overflowX: "hidden",
        }}
      >
        <HeroSection roleIdx={roleIdx} />

        <AboutSection />

        <ProjectsSection />

        <Div />
        <EthosSection />
        <Div />

        <ExperienceSection />

        <Div />
        <SkillsSection />
        <Div />

        <ContactSection />
        <Footer />
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { overflow-x: hidden; color-scheme: dark; }

        @keyframes ac-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(201,168,76,0.5); }
          50%      { opacity:0.4; box-shadow:0 0 0 7px rgba(201,168,76,0); }
        }

        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.35); border-radius:2px; }
        ::-webkit-scrollbar-thumb:hover { background:rgba(201,168,76,0.6); }
        ::selection { background:rgba(201,168,76,0.22); color:#fff; }

        .hero-grid { grid-template-columns:1.15fr .85fr; }
        @media (max-width:960px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-photo { display:none !important; }
        }

        .stats-grid { grid-template-columns:repeat(4,1fr); }
        @media (max-width:680px) { .stats-grid { grid-template-columns:repeat(2,1fr) !important; } }

        @media (max-width:900px) {
          .bento-outer { grid-template-columns:1fr !important; }
          .bento-outer > * { grid-column:1 / -1 !important; grid-row:auto !important; }
        }

        .contact-grid { grid-template-columns:1fr 1.3fr; }
        @media (max-width:860px) { .contact-grid { grid-template-columns:1fr !important; } }

        .footer-grid { grid-template-columns:1.6fr repeat(3,1fr); }
        @media (max-width:960px) { .footer-grid { grid-template-columns:1fr 1fr !important; } }
        @media (max-width:640px) { .footer-grid { grid-template-columns:1fr !important; } }

        .form2col { grid-template-columns:1fr 1fr; }
        @media (max-width:540px) { .form2col { grid-template-columns:1fr !important; } }
      `}</style>
    </>
  );
}
