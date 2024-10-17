"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Testimonials = dynamic(() => import("~/components/Testimonials"));
const SinglePagePortfolio = dynamic(() => import("~/components/Home"));

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
        <SinglePagePortfolio />
      </div>
    </main>
  );
}
