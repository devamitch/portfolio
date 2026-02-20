"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { GithubIcon, LinkedinIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ASSETS } from "~/assets";
import { slideInFromLeft, slideInFromRight } from "~/utils/motion";
import GradientText from "./GradientText";

function getYearDifference(lastYear: string) {
  const newDate = new Date();
  const lastDate = new Date(lastYear);
  const yearDifference = newDate.getFullYear() - lastDate.getFullYear();

  if (
    newDate.getMonth() < lastDate.getMonth() ||
    (newDate.getMonth() === lastDate.getMonth() &&
      newDate.getDate() < lastDate.getDate())
  ) {
    return yearDifference - 1;
  }

  return yearDifference;
}

const lastYear = "2017-05-01";
export const yearDifference = getYearDifference(lastYear);

// Counter component for animated numbers
const Counter = ({
  to,
  duration = 2000,
}: {
  to: number;
  duration?: number;
}) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = to;
    const increment = end / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{val}</span>;
};

const Hero = () => {
  const titles = [
    "VP Engineering",
    "Principal Architect",
    "Technical Leader",
    "System Builder",
  ];
  const [titleIdx, setTitleIdx] = useState(0);
  const { scrollY } = useScroll();
  const videoOpacity = useTransform(scrollY, [0, 400], [0.7, 0.3]);
  const contentY = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-r from-[#0a0a0a] via-[#121212] to-black">
      {/* Video Background */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: videoOpacity }}
        className="absolute left-0 top-0 h-full w-full rotate-180 object-cover"
      >
        <source src="/videos/triangle.mp4" type="video/mp4" />
      </motion.video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(218,165,32,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(218,165,32,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { x: "15%", y: "25%", size: 350, delay: 0 },
          { x: "85%", y: "65%", size: 280, delay: 1.5 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background:
                "radial-gradient(circle, rgba(218,165,32,0.08) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: orb.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y: contentY }}
        className="container relative z-20 mx-auto flex w-full flex-col items-center justify-between px-4 py-20 lg:py-32"
      >
        {/* Executive Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-3 border border-amber-400/30 bg-amber-400/10 backdrop-blur-md px-5 py-2.5 mb-8 rounded-full"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-amber-400 tracking-[0.25em] uppercase font-mono font-semibold">
            Available for Executive Roles — VP · CTO · Lead Engineering
          </span>
        </motion.div>

        <div className="w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-between lg:flex-row gap-12"
          >
            {/* Left Content */}
            <motion.div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left max-w-2xl">
              {/* Main Headline */}
              <motion.h1
                variants={slideInFromLeft(0.5)}
                className="mb-6 text-4xl font-black leading-[1.1] text-white drop-shadow-2xl sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                <span className="block mb-2">Not your average</span>
                <span className="block">
                  <GradientText className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                    engineer.
                  </GradientText>
                </span>
              </motion.h1>

              {/* Rotating Title */}
              <motion.div
                variants={slideInFromLeft(0.7)}
                className="mb-8 h-10 overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={titleIdx}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-3xl font-light text-amber-400 tracking-wide"
                  >
                    {titles[titleIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Description */}
              <motion.div
                variants={slideInFromLeft(0.9)}
                className="mb-8 max-w-xl"
              >
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                  <strong className="text-amber-400 font-semibold">
                    {yearDifference}+ years
                  </strong>{" "}
                  architecting production systems at the intersection of{" "}
                  <strong className="text-white">AI</strong>,{" "}
                  <strong className="text-white">Blockchain</strong>, and{" "}
                  <strong className="text-white">Mobile</strong>.
                </p>
                <p className="text-base md:text-lg text-gray-400 leading-relaxed border-l-2 border-amber-400/30 pl-4">
                  Built <strong className="text-amber-400">16+ apps</strong>{" "}
                  serving <strong className="text-amber-400">50K+ users</strong>
                  . Custom game engines. RAG pipelines. DeFi platforms.
                  HealthTech at scale.
                </p>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={slideInFromLeft(1.1)}
                className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-8"
              >
                <Link
                  href="https://www.linkedin.com/in/devamitch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <LinkedinIcon size={20} />
                  <span className="text-sm">LinkedIn</span>
                </Link>
                <Link
                  href="https://github.com/devamitch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <GithubIcon size={20} />
                  <span className="text-sm">GitHub</span>
                </Link>
                <Link
                  href="https://devamitch.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <Mail size={20} />
                  <span className="text-sm">Medium</span>
                </Link>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={slideInFromLeft(1.3)}
                className="flex flex-wrap justify-center gap-4 lg:justify-start"
              >
                <motion.a
                  href="#work"
                  className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 py-4 text-sm font-bold tracking-wider text-black uppercase transition-all hover:shadow-lg hover:shadow-amber-400/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  See My Work
                  <span className="group-hover:translate-x-1 transition-transform text-lg">
                    →
                  </span>
                </motion.a>
                <motion.a
                  href="#contact"
                  className="rounded-full border-2 border-amber-400/50 px-8 py-4 text-sm font-semibold tracking-wider text-amber-400 uppercase transition-all hover:bg-amber-400 hover:text-black"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let's Work Together →
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right Side - Profile with Floating Stats */}
            <motion.div
              variants={slideInFromRight(0.8)}
              className="relative flex items-center justify-center lg:w-auto"
            >
              <div className="relative">
                {/* Rotating Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-8 border border-amber-400/15 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-16 border border-amber-400/10 rounded-full"
                />

                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(218,165,32,0.2) 0%, transparent 70%)",
                    filter: "blur(40px)",
                  }}
                />

                {/* Profile Image */}
                <div className="gradient-border relative rounded-full p-1 shadow-2xl">
                  <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-amber-400/30">
                    <Image
                      src={ASSETS.myPicture}
                      alt="Amit Chakraborty - VP Engineering & Principal Architect"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Floating Stats Badges */}
                {[
                  {
                    label: "Years",
                    value: `${yearDifference}+`,
                    position: "top-0 -left-8 md:-left-12",
                  },
                  {
                    label: "Apps",
                    value: "16+",
                    position: "top-8 md:top-12 -right-12 md:-right-16",
                  },
                  {
                    label: "Users",
                    value: "50K+",
                    position: "bottom-12 md:bottom-16 -left-12 md:-left-16",
                  },
                  {
                    label: "Projects",
                    value: "500+",
                    position: "bottom-0 -right-8 md:-right-12",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1.2 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className={`absolute ${stat.position} bg-black/95 backdrop-blur-md border border-amber-400/30 px-4 py-3 rounded-lg shadow-2xl`}
                  >
                    <div className="text-2xl md:text-3xl font-black text-amber-400 tabular-nums">
                      <Counter to={parseInt(stat.value)} />
                      {stat.value.replace(/\d+/g, "")}
                    </div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-wider font-mono text-white/50">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Bar at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { value: yearDifference, suffix: "+", label: "Years Leading" },
              { value: 16, suffix: "+", label: "Apps Shipped" },
              { value: 50, suffix: "K+", label: "Active Users" },
              { value: 2029, suffix: "", label: "GitHub '25" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + i * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="text-4xl md:text-5xl font-black text-amber-400 tracking-tighter tabular-nums mb-2">
                  <Counter to={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] font-mono text-white/40">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-white/30">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-amber-400/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
