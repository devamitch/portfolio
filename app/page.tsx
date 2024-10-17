"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import About from "~/components/About";
import Achievements from "~/components/Achievements";
import Contact from "~/components/Contact";
import Education from "~/components/Education";
import Experience from "~/components/Experience";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Hero from "~/components/Hero";
import PersonalProjects from "~/components/PersonalProjects";
import ProjectCarousel from "~/components/ProjectCarousel";
import Project from "~/components/Projects";
import Skills from "~/components/Skills";

const Testimonials = dynamic(() => import("~/components/Testimonials"));
const HireMe = dynamic(() => import("~/components/HireMe"));

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sectionRefs.current.forEach((ref) => {
        if (
          ref &&
          ref.offsetTop <= scrollPosition &&
          ref.offsetTop + ref.offsetHeight > scrollPosition
        ) {
          setActiveSection(ref.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.utils.toArray(".animate-on-scroll").forEach((element: any) => {
      gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="absolute inset-0 top-52 z-0">
        <video
          autoPlay
          loop
          muted
          className="h-full w-full object-cover opacity-20"
        >
          <source src={"videos/rand.mp4"} type="video/mp4" />
        </video>
      </div>
      <div className="relative z-10">
        {/* @ts-ignore */}
        <Hero ref={(el) => (sectionRefs.current[0] = el)} />
        {/* @ts-ignore */}

        <About ref={(el) => (sectionRefs.current[1] = el)} />
        {/* @ts-ignore */}

        <Experience ref={(el) => (sectionRefs.current[2] = el)} />
        {/* @ts-ignore */}

        <Skills ref={(el) => (sectionRefs.current[3] = el)} />
        {/* @ts-ignore */}

        <ProjectCarousel ref={(el) => (sectionRefs.current[4] = el)} />
        {/* @ts-ignore */}

        <Project ref={(el) => (sectionRefs.current[5] = el)} />
        {/* @ts-ignore */}

        <PersonalProjects ref={(el) => (sectionRefs.current[6] = el)} />
        {/* @ts-ignore */}

        <Education ref={(el) => (sectionRefs.current[7] = el)} />
        {/* @ts-ignore */}

        <Achievements ref={(el) => (sectionRefs.current[8] = el)} />
        {/* @ts-ignore */}

        <Testimonials ref={(el) => (sectionRefs.current[9] = el)} />
        {/* @ts-ignore */}

        <HireMe ref={(el) => (sectionRefs.current[10] = el)} />
        {/* @ts-ignore */}

        <Contact ref={(el) => (sectionRefs.current[11] = el)} />
        <Footer />
      </div>
    </main>
  );
}
