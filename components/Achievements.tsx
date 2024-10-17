"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AwardIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { resumeData } from "~/data/resumeData";

gsap.registerPlugin(ScrollTrigger);

const achievements = resumeData?.achievements2;

const Achievements = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".achievements-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".achievements-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      q(".achievement-item"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: q(".achievement-item"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} id="achievements" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="achievements-title mb-12 text-center text-4xl font-bold text-white">
          <AwardIcon className="mr-4 inline-block h-10 w-10 text-purple-500" />
          Achievements
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="achievement-item flex flex-grow rounded-lg p-6 backdrop-blur-3xl"
            >
              <div className="gradient-border rounded-lg px-6 py-4 backdrop-blur-3xl">
                <div className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-purple-950 via-[#0f0a1c8b] to-black opacity-10 blur-lg"></div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {achievement.title}
                </h3>
                <p className="text-gray-300">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
