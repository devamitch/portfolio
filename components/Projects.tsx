"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { resumeData } from "~/data/resumeData";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".projects-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".projects-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      },
    );
  }, []);

  const allProjects = [
    ...resumeData.professionalExperience.flatMap((exp) => exp.projects || []),
    ...resumeData.freelanceProjects,
    ...resumeData.additionalProjects,
  ];

  return (
    <section ref={sectionRef} id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 className="projects-title mb-12 text-center text-4xl font-bold text-white">
          All Projects
        </motion.h2>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="mySwiper"
        >
          {allProjects.map((project, index) => (
            <SwiperSlide key={index}>
              <div className="transform overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105">
                <div className="relative h-48">
                  <Image
                    src={
                      project.image ||
                      "https://www.shutterstock.com/image-vector/coming-soon-on-dark-background-600nw-2364512887.jpg"
                    }
                    alt={project.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-400">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    {project.tech && (
                      <span className="text-xs text-purple-400">
                        {project.tech}
                      </span>
                    )}
                    {(project.link || project.github || project.url) && (
                      <a
                        href={project.link || project.github || project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 transition-colors hover:text-cyan-300"
                      >
                        <ExternalLinkIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Projects;
