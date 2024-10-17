"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CodeIcon, ExternalLinkIcon, GithubIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { resumeData } from "~/data/resumeData";

gsap.registerPlugin(ScrollTrigger);

const gradients = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-green-500 to-teal-500",
  "from-yellow-500 to-orange-500",
  "from-red-500 to-pink-500",
  "from-indigo-500 to-purple-500",
];

const OpenSourceStarters = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".open-source-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".open-source-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} id="open-source" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="open-source-title mb-8 text-center text-3xl font-bold text-white md:mb-12 md:text-4xl">
          <CodeIcon className="mr-2 inline-block h-8 w-8 text-purple-500 md:mr-4 md:h-10 md:w-10" />
          Open Source Starters
        </motion.h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          modules={[Autoplay]}
          className="mySwiper"
        >
          {resumeData.additionalProjects.map((project, index) => (
            <SwiperSlide key={project.name} className="flex flex-grow">
              <div className="flex flex-col flex-1 overflow-hidden rounded-lg bg-gray-800 shadow-lg flex-grow">
                <div
                  className={`h-24 bg-gradient-to-r md:h-32 ${
                    gradients[index % gradients.length]
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={300}
                      height={128}
                      objectFit="cover"
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <CodeIcon className="h-12 w-12 text-white md:h-16 md:w-16" />
                    </div>
                  )}
                </div>
                <div className="flex-grow p-4">
                  <h3 className="mb-2 truncate text-base font-semibold text-white md:text-lg">
                    {project.name}
                  </h3>
                  <p className="mb-4 text-xs text-gray-400 md:text-sm line-clamp-2	">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-700 p-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 transition-colors hover:text-purple-300"
                      aria-label={`View ${project.name} on GitHub`}
                    >
                      <GithubIcon className="h-5 w-5" />
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 transition-colors hover:text-cyan-300"
                      aria-label={`Visit ${project.name} website`}
                    >
                      <ExternalLinkIcon className="h-5 w-5" />
                    </a>
                  )}
                  {project.date && (
                    <span className="text-xs text-gray-500">
                      {project.date}
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OpenSourceStarters;
