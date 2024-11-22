"use client";

import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "~/assets";
import { slideInFromLeft, slideInFromRight } from "~/utils/motion";
import GradientText from "./GradientText";

function getYearDifference(lastYear: string) {
  const newDate = new Date(); // current date
  const lastDate = new Date(lastYear); // the provided last year date

  // Calculate the year difference
  const yearDifference = newDate.getFullYear() - lastDate.getFullYear();

  // Check if the current date is before the month and day of the provided last year
  if (
    newDate.getMonth() < lastDate.getMonth() ||
    (newDate.getMonth() === lastDate.getMonth() &&
      newDate.getDate() < lastDate.getDate())
  ) {
    return yearDifference - 1;
  }

  return yearDifference;
}

const lastYear = "2017 May";
export const yearDifference = getYearDifference(lastYear);

// console.log(`The difference in years is: ${yearDifference}`);

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
            <motion.div className="mb-10 flex flex-col items-center text-center lg:mb-0 lg:items-start lg:text-left mt-36 lg:mt-0">
              <motion.h1
                variants={slideInFromLeft(0.5)}
                className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
              >
                <span className="font-bold leading-tight text-white drop-shadow-lg">
                  Hi!{" "}
                </span>
                I'm <GradientText>Amit Chakraborty</GradientText>
              </motion.h1>
              <motion.div
                variants={slideInFromLeft(0.8)}
                className="mb-8 max-w-lg text-base flex flex-col text-gray-300 sm:text-lg "
              >
                <motion.p
                  className="text-xl md:text-2xl text-gray-300 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  React Native Specialist | dApp Solutions Architect |{" "}
                  {yearDifference}+ Years in Mobile & Full Stack | Delivered 13+
                  High-Impact Apps & Projects | Innovating Web3 & Blockchain
                  Ecosystems
                </motion.p>
                <motion.div
                  className="flex lg:justify-start justify-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    href="https://www.linkedin.com/in/techamit95ch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <LinkedinIcon size={24} />
                  </Link>
                  <Link
                    href="https://github.com/techamit95ch"
                    target="_blank"
                    // rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <GithubIcon size={24} />
                  </Link>
                  <Link
                    href="https://devamitch.medium.com/"
                    target="_blank"
                    // rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <TwitterIcon size={24} />
                  </Link>
                  <Link
                    href="https://devamitch.medium.com/"
                    target="_blank"
                    // rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    Medium
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                className="hero-cta flex flex-wrap justify-center gap-4 lg:justify-start"
                variants={slideInFromLeft(1.2)}
              >
                <motion.a
                  href="#projects"
                  className="rounded-full bg-gradient-to-r from-golden-light via-golden to-golden-dark px-6 py-3 text-base font-semibold text-black transition-all hover:scale-105 sm:px-8 sm:text-lg"
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
            </motion.div>
            <motion.div
              variants={slideInFromRight(0.8)}
              className="relative mt-36 lg:mt-0 flex items-end justify-end lg:w-1/2"
            >
              <div className="absolute inset-0 animate-pulse rounded-full lg:bg-gradient-to-r bg-gradient-to-bl from-[#0b0714f6] lg:from-[#0f0a1c8b] to-black opacity-100 blur-3xl"></div>
              <div className="relative shadow-2xl from-black lg:from-purple-950">
                <div className="gradient-border relative rounded-full p-1 shadow-lg">
                  <Image
                    src={ASSETS.myPicture}
                    alt="Amit Chakraborty - Profile Picture"
                    width={400}
                    height={400}
                    className="relative rounded-full bg-gradient-to-t lg:from-[#0b0714] from-[#0f0a1c0e] lg:to-transparent to-black"
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
