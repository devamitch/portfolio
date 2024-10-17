"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import { ASSETS } from "~/assets";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "~/utils/motion";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-r from-[#1108196d] via-[#121212] to-black py-20">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 h-full w-full rotate-180 object-cover opacity-70"
      >
        <source src={"videos/triangle.mp4"} type="video/mp4" />
        {/* <source src="/triangle.mp4" type="video/mp4" /> */}
      </video>
      <motion.div
        initial="hidden"
        animate="visible"
        className="container z-20 mx-auto flex w-full flex-row items-center justify-between px-4"
      >
        <div className="container mx-auto w-full px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-between lg:flex-row"
          >
            <div className="mb-10 flex flex-col items-center text-center lg:mb-0 lg:items-start lg:text-left">
              <motion.div
                variants={slideInFromTop}
                className="mb-6 flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <span className="rounded-full border border-purple-500 bg-black bg-opacity-50 px-4 py-2 text-sm backdrop-blur-md">
                  <SparklesIcon className="mr-2 inline-block h-5 w-5 text-purple-400" />
                  React Native Developer
                </span>
                <span className="rounded-full border border-cyan-500 bg-black bg-opacity-50 px-4 py-2 text-sm backdrop-blur-md">
                  <SparklesIcon className="mr-2 inline-block h-5 w-5 text-cyan-400" />
                  Full Stack Developer
                </span>
                <span className="rounded-full border border-green-500 bg-black bg-opacity-50 px-4 py-2 text-sm backdrop-blur-md">
                  <SparklesIcon className="mr-2 inline-block h-5 w-5 text-green-400" />
                  Blockchain Enthusiast
                </span>
              </motion.div>
              <motion.h1
                variants={slideInFromLeft(0.5)}
                className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
              >
                <span className="font-bold leading-tight text-white drop-shadow-lg">
                  Hi!{" "}
                </span>
                I'm{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
                  Amit Chakraborty
                </span>
              </motion.h1>
              <motion.p
                variants={slideInFromLeft(0.8)}
                className="mb-8 max-w-lg text-base text-gray-300 sm:text-lg"
              >
                A seasoned developer with 4+ years of experience, 13 apps
                launched, and a passion for blockchain technology. Let's explore
                new possibilities!
              </motion.p>
              <motion.div
                className="hero-cta flex flex-wrap justify-center gap-4 lg:justify-start"
                variants={slideInFromLeft(1.2)}
              >
                <motion.a
                  href="#projects"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white transition-all hover:scale-105 sm:px-8 sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Projects
                </motion.a>
                <motion.a
                  href="#contact"
                  className="rounded-full border border-white px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white hover:text-black sm:px-8 sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch
                </motion.a>
              </motion.div>
            </div>
            <motion.div
              variants={slideInFromRight(0.8)}
              className="relative mt-10 flex items-end justify-end lg:mt-0 lg:w-1/2"
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-950 via-[#0f0a1c8b] to-black opacity-50 blur-3xl"></div>
              <div className="relative shadow-2xl">
                <div className="gradient-border relative rounded-full p-1 shadow-lg">
                  <Image
                    src={ASSETS.myPicture}
                    alt="Amit Chakraborty - Profile Picture"
                    width={400}
                    height={400}
                    className="relative rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
