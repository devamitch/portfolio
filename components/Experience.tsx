"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BriefcaseIcon } from "lucide-react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: "React Native Developer & Full Stack Developer",
    company: "NONCEBLOX Pvt. LTD.",
    period: "Oct 2021 - Present",
    location: "Remote",
    responsibilities: [
      "Launched 13 apps (7 iOS, 6 Android), achieving significant user engagement.",
      "Spearheaded blockchain integration for sports and finance applications, enhancing functionality and user experience.",
      "Mentored junior developers, boosting team productivity and code quality.",
    ],
    projects: [
      {
        name: "Vulcan Eleven",
        link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
      },
      {
        name: "CCT",
        link: "https://play.google.com/store/apps/details?id=com.nonceblox.cryptocoffetales&hl=en_IE",
      },
      {
        name: "Jcare",
        link: "https://play.google.com/store/apps/details?id=com.nonceblox.jitendrafoundationapp&hl=en_IE",
      },
      {
        name: "MusicX",
        link: "https://apps.apple.com/app/music-x/id6475713772",
      },
      {
        name: "HOUSEZY",
        link: "https://apps.apple.com/app/housezy/id6471949955",
      },
      { name: "NAMAHA AI" },
      { name: "Om Protocol" },
      {
        name: "DEFI11",
        link: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
      },
      { name: "Bingo" },
    ],
  },
  {
    title: "PHP Developer",
    company: "TECHPROMIND",
    period: "Jan 2018 - Sept 2018",
    location: "Kolkata",
    responsibilities: [
      "Delivered 13 secure government projects, improving functionality and security.",
      "Developed GST App and built REST APIs, increasing efficiency by 40%.",
    ],
    projects: [{ name: "GST App" }, { name: "Government Projects" }],
  },
  {
    title: "PHP Intern",
    company: "WEBSKITTERS",
    period: "May 2017 - Jan 2018",
    location: "Kolkata",
    responsibilities: [
      "Contributed to PHP and JavaScript development for live projects, enhancing project performance and reliability.",
    ],
  },
];

const Experience = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".experience-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".experience-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      q(".experience-item"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: q(".experience-item"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="experience-title mb-12 text-center text-4xl font-bold text-white">
          <BriefcaseIcon className="mr-4 inline-block h-10 w-10 text-purple-500" />
          Professional Experience
        </motion.h2>
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div key={index} className="experience-item rounded-lg">
              <div className="gradient-border rounded-lg px-12 py-6 backdrop-blur-3xl">
                <div className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-purple-950 via-[#0f0a1c8b] to-black opacity-10 blur-lg"></div>
                <h3 className="mb-2 text-2xl font-semibold text-white">
                  {exp.title}
                </h3>
                <p className="mb-4 text-lg text-gray-300">
                  {exp.company} | {exp.period} | {exp.location}
                </p>
                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-300">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
                {exp.projects && (
                  <div className="my-4 mr-2">
                    <span className="mb-4 font-semibold text-purple-400">
                      Key Projects:
                    </span>
                    <div className="mt-3 flex flex-row gap-2 overflow-hidden">
                      {exp.projects.map((project, idx) => (
                        <a
                          key={idx}
                          href={project?.link || "#experience"}
                          target={project?.link ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-block rounded-full border-2 border-gray-600 px-3 py-1 text-xs font-semibold text-white backdrop-blur-3xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          {project.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
