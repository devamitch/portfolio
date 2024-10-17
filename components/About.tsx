"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlobeIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFlip, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

gsap.registerPlugin(ScrollTrigger);

const interests = [
  "Mobile Technology",
  "Blockchain Technology",
  "Decentralized Finance (DeFi)",
  "Creative Arts & Design",
  "Continuous Learning",
  "Problem-Solving Strategies",
];

const skills = [
  {
    category: "Expertise",
    items: [
      "React",
      "React Native",
      "Node.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "MongoDB",
    ],
  },
  {
    category: "UI",
    items: ["MUI", "ChakraUI", "Tailwind CSS"],
  },
  {
    category: "Tools",
    items: ["GitHub", "Jira", "Slack"],
  },
  {
    category: "Foundational",
    items: ["Nest.js", "Ether.js", "WEB3.1", "MetaMask"],
  },
  {
    category: "Prior",
    items: ["PHP/MySQL", "Codeigniter", "Django"],
  },
  {
    category: "Learning",
    items: ["Rust", "NEAR", "Ethereum Solidity", "Solana"],
  },
  {
    category: "Exploratory",
    items: ["NEXTUI", "RAINBOW UI", "Qwik JS", "Vite", "Gatsby", "GraphQL"],
  },
];

const About = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".about-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".about-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="about-title mb-12 text-center text-4xl font-bold text-white">
          <GlobeIcon className="mr-4 inline-block h-10 w-10 text-purple-500" />
          About Me
        </motion.h2>
        <div className="flex flex-col items-center lg:flex-row">
          <motion.div className="about-content mb-8 lg:mb-0 lg:w-1/2 lg:pr-8">
            <p className="mb-4 text-lg text-gray-300">
              A dedicated React Native Developer with 4+ years of experience in
              building apps, mastering backend development with Node.js and PHP,
              and excelling in UI/UX design and mentorship. Based in Kolkata,
              India, with a passion for blockchain and decentralized
              technologies.
            </p>
            <p className="mb-4 text-lg text-gray-300">
              Postgraduate in 2021, with a strong background in design,
              development, and integration of advanced technical solutions.
              Proficient across many programming languages and frameworks,
              always eager to adopt the latest technologies.
            </p>
          </motion.div>

          <motion.div className="about-interests lg:w-1/2">
            <Swiper
              effect={"flip"}
              grabCursor={true}
              pagination={false}
              modules={[EffectFlip, Pagination, Navigation, Autoplay]}
              className="mySwiper"
              autoplay
              loop={true}
              navigation={false}
            >
              <SwiperSlide>
                <div className="relative rounded-lg p-1">
                  <div className="gradient-border absolute inset-0 z-[-1] rounded-lg"></div>
                  <div className="relative rounded-lg p-6 backdrop-blur-3xl">
                    <h3 className="mb-4 text-2xl font-semibold text-white">
                      Interests
                    </h3>
                    <ul className="list-inside list-disc space-y-2 text-gray-300">
                      {interests.map((interest, index) => (
                        <li key={index}>{interest}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative rounded-lg p-1">
                  <div className="gradient-border absolute inset-0 z-[-1] rounded-lg"></div>
                  <div className="relative rounded-lg p-6 backdrop-blur-3xl">
                    <div className="grid grid-cols-7 gap-6">
                      {skills.map((skillCategory, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="text-sm font-semibold text-purple-500">
                            {skillCategory.category}
                          </h4>
                          <ul className="list-inside list-disc space-y-2 text-xs text-gray-300">
                            {skillCategory.items.map((skill, i) => (
                              <li key={i} className="list-none">
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
