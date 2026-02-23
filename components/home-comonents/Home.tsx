"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { COLORS, HN, PROFILE_DATA } from "~/data/portfolio.data";
import useScramble from "~/hooks/useScramble";
import { BuyCoffeeModal, BuyCoffeePill } from "./BMC_MODAL";
import { Div } from "./ui/SectionsComponents";
import {
  AboutSection,
  BlogSection,
  ContactSection,
  EthosSection,
  ExperienceSection,
  FAQSection,
  Footer,
  GitHubSection,
  HeroSection,
  MarqueeSection,
  MeetingScheduler,
  MobileNav,
  PitchSection,
  ProcessSection,
  ProjectsSection,
  ScrollProgressBar,
  ServicesSection,
  SkillsSection,
  StorySection,
  TestimonialsSection,
} from "./home-comonents";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function PrimaryHome() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const expRef   = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const [roleIdx, setRoleIdx]     = useState(0);
  const [bmcOpen, setBmcOpen]     = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  const scrambled = useScramble(PROFILE_DATA.tagline);
  const { scrollYProgress } = useScroll();

  /* Rotate roles */
  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % PROFILE_DATA.roles.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  /* GSAP scroll effects */
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".gsap-grid", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: ".gsap-grid",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.fromTo(
        ".bento-cell",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".exp-row",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: expRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".story-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.18,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: storyRef.current, start: "top 75%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  /* Auto-open BMC modal at 40% scroll */
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.4 && !autoOpened && !bmcOpen) {
        setAutoOpened(true);
        setBmcOpen(true);
      }
    });
  }, [autoOpened, bmcOpen, scrollYProgress]);

  return (
    <>
      {/* ── SEO structured data ── */}
      <div aria-hidden style={{ display: "none" }}>
        <span itemScope itemType="https://schema.org/Person">
          <span itemProp="name">Amit Chakraborty</span>
          <span itemProp="jobTitle">Principal Mobile Architect</span>
          <span itemProp="url">https://devamit.co.in</span>
          <span itemProp="email">{PROFILE_DATA.email}</span>
          <span itemProp="addressLocality">Kolkata</span>
          <span itemProp="addressCountry">India</span>
        </span>
      </div>

      <ScrollProgressBar />

      <main
        style={{
          fontFamily: HN,
          background: COLORS.bg,
          color: COLORS.text,
          overflowX: "hidden",
        }}
      >
        <div className="noise-overlay" />

        {/* Ambient orbs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {[
            { x: "5%",  y: "10%", s: 500, d: 0 },
            { x: "72%", y: "50%", s: 350, d: 4 },
            { x: "40%", y: "85%", s: 280, d: 8 },
          ].map((o, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.85, 0.4] }}
              transition={{
                duration: 9 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: o.d,
              }}
              style={{
                position: "absolute",
                left: o.x,
                top: o.y,
                width: o.s,
                height: o.s,
                background:
                  "radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)",
                filter: "blur(80px)",
                borderRadius: "50%",
              }}
            />
          ))}
        </div>

        {/* ── Sections ── */}
        <div ref={heroRef}>
          <HeroSection roleIdx={roleIdx} scrambled={scrambled} />
        </div>

        <MarqueeSection />

        <div ref={aboutRef}>
          <AboutSection />
        </div>

        <ProjectsSection />

        <Div />
        <EthosSection />
        <Div />

        <div ref={expRef}>
          <ExperienceSection />
        </div>

        <Div />
        <SkillsSection />
        <Div />

        <div ref={storyRef}>
          <StorySection />
        </div>

        <GitHubSection />
        <Div />
        <TestimonialsSection />
        <Div />
        <ServicesSection />
        <PitchSection />
        <ProcessSection />
        <FAQSection />
        <BlogSection />
        <Div />
        <ContactSection />
        <Footer />
      </main>

      <MobileNav />
      <BuyCoffeePill onOpen={() => setBmcOpen(true)} />
      <AnimatePresence>
        {bmcOpen && (
          <BuyCoffeeModal open={bmcOpen} onClose={() => setBmcOpen(false)} />
        )}
      </AnimatePresence>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { overflow-x: hidden; }

        @keyframes ac-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(201,168,76,0.5); }
          50%      { opacity:0.4; box-shadow:0 0 0 7px rgba(201,168,76,0); }
        }

        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        .noise-overlay {
          position:fixed; inset:0; z-index:1; pointer-events:none; opacity:0.026;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
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

        @media (max-width:860px) {
          .story-spine { display:none !important; }
          .story-item { grid-template-columns:1fr !important; }
          .story-item > div:nth-child(2) { display:none !important; }
          .story-item > div:nth-child(1) { text-align:left !important; order:1 !important; padding:0 !important; }
        }

        .contact-grid { grid-template-columns:1fr 1.3fr; }
        @media (max-width:860px) { .contact-grid { grid-template-columns:1fr !important; } }

        .footer-grid { grid-template-columns:1.6fr repeat(3,1fr); }
        @media (max-width:960px) { .footer-grid { grid-template-columns:1fr 1fr !important; } }
        @media (max-width:640px) { .footer-grid { grid-template-columns:1fr !important; } }

        .form2col { grid-template-columns:1fr 1fr; }
        @media (max-width:540px) { .form2col { grid-template-columns:1fr !important; } }

        @media (max-width:640px) { .mobile-nav { display:flex !important; } }
        @media (max-width:640px) { main { padding-bottom:72px; } }
      `}</style>
    </>
  );
}
