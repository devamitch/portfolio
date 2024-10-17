"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GraduationCapIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { resumeData } from "~/data/resumeData";

gsap.registerPlugin(ScrollTrigger);

const educationData = resumeData?.education;

const Education = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".education-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".education-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      q(".education-item"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: q(".education-item"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} id="education" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="education-title mb-12 text-center text-4xl font-bold text-white">
          <GraduationCapIcon className="mr-4 inline-block h-10 w-10 text-purple-500" />
          Education
        </motion.h2>
        <div className="space-y-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              className="education-item rounded-lg p-6 backdrop-blur-3xl"
            >
              <div className="gradient-border rounded-lg px-12 py-6 backdrop-blur-3xl">
                <div className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-purple-950 via-[#0f0a1c8b] to-black opacity-10 blur-lg"></div>
                <h3 className="mb-2 text-2xl font-semibold text-white">
                  {edu.degree}
                </h3>
                <p className="mb-2 text-lg text-gray-300">
                  {edu.institution} | {edu?.location}| {edu?.duration} |
                  {edu?.status}
                </p>
                {edu?.projects?.map((item, index) => (
                  <span className="text-gray-400" key={index?.toString()}>
                    <p>{item?.type}</p>
                    <p>{item?.description}</p>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
