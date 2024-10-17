"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const HireMe = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".hire-me-content"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".hire-me-content"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="hire-me" className="py-20">
      <div className="container mx-auto px-4">
        <div className="hire-me-content rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 p-12 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Build Something Amazing?
          </h2>
          <p className="mb-8 text-xl text-white">
            Let's collaborate and bring your ideas to life with cutting-edge
            mobile and web solutions.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="flex-row- flex items-center rounded-full bg-white px-8 py-3 text-lg font-semibold text-purple-600 transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
            >
              Hire Me
            </a>

            <a
              href="Amit Chakraborty React Native Dev.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center rounded-full bg-white px-8 py-3 text-lg font-semibold text-purple-600 transition-all duration-300 hover:bg-gray-100 hover:shadow-lg"
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HireMe;
