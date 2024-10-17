"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    name: "React Native",
    level: 100,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "React",
    level: 95,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "Node.js",
    level: 90,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "Next.js",
    level: 85,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "JavaScript",
    level: 95,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "TypeScript",
    level: 90,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "MongoDB",
    level: 85,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
  {
    name: "Blockchain",
    level: 80,
    image: "https://www.filepicker.io/api/file/4C6yPDywSUeWYLyg1h9G",
  },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".skills-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".skills-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      q(".skill-item"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: q(".skill-item"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="skills-title mb-12 text-center text-4xl font-bold text-white">
          Skills & Expertise
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-item rounded-lg p-6 backdrop-blur-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={skill.image}
                    alt={skill.name}
                    className="mr-4 h-8 w-8 rounded-full"
                  />
                  <h3 className="text-lg font-semibold text-white">
                    {skill.name}
                  </h3>
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {skill.level}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
