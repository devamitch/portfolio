"use client";

import { AnimatePresence, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { COLORS, HN, PROFILE_DATA } from "~/data/portfolio.data";
import useScramble from "~/hooks/useScramble";
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
  MobileNav,
  PitchSection,
  ProcessSection,
  ProjectsSection,
  ScrollProgressBar,
  ServicesSection,
  SkillsSection,
  StorySection,
  TestimonialsSection,
} from "../home-comonents";
import { BuyCoffeeModal } from "../home-comonents/BMC_MODAL";
import OrbsOverlay from "../ui/OrbsOverlay";
import { Div } from "../ui/SectionsComponents";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function PrimaryHome() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const [roleIdx, setRoleIdx] = useState(0);
  const [bmcOpen, setBmcOpen] = useState(false);
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
      <ScrollProgressBar />

      <main
        style={{
          fontFamily: HN,
          background: COLORS.bg,
          color: COLORS.text,
          overflowX: "hidden",
        }}
      >
        <OrbsOverlay />

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
      {/* <BuyCoffeePill onOpen={() => setBmcOpen(true)} /> */}
      <AnimatePresence>
        {bmcOpen && (
          <BuyCoffeeModal open={bmcOpen} onClose={() => setBmcOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
