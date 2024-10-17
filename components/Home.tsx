"use client";

import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import {
  AwardIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  FolderIcon,
  GithubIcon,
  GraduationCapIcon,
  LinkedinIcon,
  MailIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ASSETS } from "~/assets";
import { slideInFromLeft, slideInFromRight } from "~/utils/motion";
import Footer from "./Footer";
import Projects from "./ProjectCarousel";


const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, "") || "";

// Portfolio Data
const portfolioData = {
  personalInfo: {
    name: "Amit Chakraborty",
    title:
      "Lead React Native Developer | Full Stack Engineer | Blockchain Innovator",
    location: "Kolkata, WB, India",
    phone: "+91 9874173663",
    email: "amit98ch@gmail.com",
    linkedin: "https://www.linkedin.com/in/techamit95ch/",
    github: "https://github.com/techamit95ch",
    summary:
      "With over 4 years of experience, I specialize in building high-performance, scalable applications. Proven track record of boosting user engagement by 300%, reducing operational costs, and optimizing productivity in cross-functional teams. Adept in blockchain integration, driving 20%+ user retention and delivering faster, leaner systems for global clients.",
    image: "/placeholder.svg?height=300&width=300",
    status: "Open to work",
    workMode: "Work from home",
    dob: "19th sept 1995",
    websiteLink: "https://amitchakraborty.netlify.app",
    otherProfiles: [
      "https://www.hackerearth.com/@amit98ch",
      "https://www.techgig.com/amitchakraborty32",
      "https://www.codechef.com/users/cheifchefamit",
      "https://www.hackerrank.com/amit98ch",
      "https://leetcode.com/techamit95ch/",
    ],
    socialLinks: [
      "https://twitter.com/AmitCha92849022",
      "https://www.quora.com/profile/AMIT-CHAKRABORTY-247",
    ],
  },
  professionalExperience: [
    {
      title: "Full Stack Developer",
      company: "NONCEBLOX Pvt. Ltd.",
      period: "Oct 2021 - Present",
      location: "Remote",
      responsibilities: [
        "Led the end-to-end development of 13 mobile applications, driving a 300% increase in user engagement through performance optimizations and data-driven features.",
        "Reduced app load times by 75% and decreased app size by 70%, resulting in better app store rankings and a 40% churn reduction.",
        "Spearheaded blockchain integration, improving transaction throughput by 15% and enhancing user retention by 20% through innovative smart contract architectures and tokenization strategies.",
        "Improved project delivery times by 20%, refining team workflows and aligning cross-functional teams for faster iterations and more efficient deployment processes.",
        "Led the modernization of code architecture, resulting in a 50% increase in developer productivity and 25% reduction in time-to-market for key features.",
      ],
      projects: [
        {
          name: "Housezy",
          tech: "React Native, Firebase",
          duration: "3 months",
          description:
            "Built a property management platform, reducing onboarding time by 30% with automated payment workflows.",
          image:
            "https://housezy.in/wp-content/uploads/2024/01/sdsfd-1024x823.png",
          link: "https://apps.apple.com/app/housezy/id6471949955",
        },
        {
          name: "Vulcan Eleven",
          tech: "React Native, Node.js",
          duration: "4 months",
          description:
            "Revamped a fantasy sports platform, integrating Razorpay and Binance Pay, driving a 35% increase in transaction volume and 40% faster checkout times.",
          image:
            "https://pbs.twimg.com/media/GKyr2QgWoAAQ_Qd?format=jpg&name=large",
          link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
        },
        {
          name: "MusicX",
          tech: "React Native, Node.js",
          duration: "3 months",
          description:
            "Designed and built a music competition app, resulting in a 15% increase in user engagement.",
          image:
            "https://pbs.twimg.com/media/GDvYSRdWcAAL6uV?format=jpg&name=large",
          link: "https://apps.apple.com/app/music-x/id6475713772",
        },
        {
          name: "DeFi11",
          tech: "React Native, Blockchain",
          duration: "6 months",
          description:
            "Decentralized fantasy sports platform with blockchain integration.",
          image: "https://www.defieleven.com/defi_11_cover.png",
          link: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
        },

        {
          name: "NAMAHA AI",
          tech: "React, TensorFlow.js",
          duration: "5 months",
          description: "AI-powered DAP explorer",
          image:
            "https://media.licdn.com/dms/image/v2/D5622AQF-2pq0PRGYZw/feedshare-shrink_800/feedshare-shrink_800/0/1695477706477?e=2147483647&v=beta&t=vfSLuT3yyEPtA1jVS9pIWBIOTC0LzKIUwBzM4m5mFss",
        },
        {
          name: "Om Protocol",
          tech: "Solidity, Web3.js",
          duration: "4 months",
          description:
            "Decentralized finance protocol for yield farming and liquidity provision.",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGno_I3d4vqBMoFDuXl2fr4lapQmwjXVmApA&s",
        },
        {
          name: "Crypto Coffee Tales",
          link: "https://play.google.com/store/apps/details?id=com.nonceblox.cryptocoffetales&hl=en_IE",
          image:
            "https://pbs.twimg.com/profile_images/1736887073611583488/g43hIm40_400x400.jpg",
          description:
            "Delivered a blockchain-based news and polling app, increasing user engagement by 25% with new revenue channels via secure in-app purchases.",
        },
        {
          name: "Jcare",
          link: "https://play.google.com/store/apps/details?id=com.nonceblox.jitendrafoundationapp&hl=en_IE",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmspb_SMjXMJltae4wtWS0GGFRI9JUju1Blw&s",
          description:
            "Re-engineered a donation platform, reducing transaction times by 40% and increasing donations by 20%",
        },
      ],
    },
    {
      title: "PHP Developer",
      company: "TECHPROMIND",
      period: "Jan 2018 - Sept 2018",
      location: "Kolkata",
      responsibilities: [
        "Directed the development of 13 government digital solutions, increasing operational efficiency by 60% through automation.",
        "Developed a GST application automating tax workflows, reducing manual errors by 25%, saving 500 man-hours annually.",
      ],
      projects: [
        {
          name: "GST App",
          description:
            "Created GST APP (Android), GST merchant portal (PHP), and GST retailer Software (VB.net) from scratch.",
        },
        {
          name: "Government Projects",
          description:
            "Successfully secured and restructured 13 government projects.",
        },
      ],
    },
  ],
  education: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "Techno Main Salt Lake, Kolkata",
      duration: "Aug 2018 - Aug 2021",
      score: "DGPA: 8.61",
      projects: [
        {
          type: "Major",
          description:
            "Led the development of MERN stack applications with CI/CD integration, reducing deployment times by 40%.",
        },
      ],
    },
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "The Heritage Academy, Kolkata",
      duration: "Aug 2014 - Aug 2017",
      score: "DGPA: 7.3",
      projects: [
        {
          type: "Major",
          description:
            "Conducted data clustering analysis for traffic signal optimization, improving urban traffic flow by 15%.",
        },
      ],
    },
  ],
  skills: [
    {
      category: "Languages",
      items: [
        "JavaScript",
        "TypeScript",
        "PHP",
        "SQL",
        "C",
        "C++",
        "Java",
        "Kotlin",
        "Swift",
        "Python",
        "Go",
        "Rust",
      ],
    },
    {
      category: "Frameworks",
      items: [
        "React",
        "React Native",
        "Next.js",
        "Node.js",
        "Nest.js",
        "Remix",
        "Vite",
        "Expo",
        "Gatsby",
      ],
    },
    {
      category: "UI/UX Libraries",
      items: [
        "Reanimated",
        "Framer Motion",
        "Tailwind CSS",
        "Chakra UI",
        "Material UI",
      ],
    },
    {
      category: "State Management",
      items: ["Zustand", "Redux", "React Query", "Expo Secure Store", "MobX"],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Nest JS",
        "PHP",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "GraphQL",
        "REST APIs",
      ],
    },
    {
      category: "Blockchain",
      items: ["Solidity", "Web3.js", "Ether.js", "Polygon"],
    },
  ],
  interests: [
    "Mobile Technology",
    "Blockchain Technology",
    "Decentralized Finance (DeFi)",
    "Creative Arts & Design",
    "Continuous Learning",
    "Problem-Solving Strategies",
  ],
  achievements: [
    "Published 7 iOS and 6 Android apps and contributed to 2 personal projects.",
    "Delivered 13 secure government projects with a focus on functionality and security.",
    "Integrated blockchain technology into sports and finance apps, driving innovation.",
    "Guided teams and mentored junior developers, fostering a collaborative environment.",
    "Achieved district-level distinction in painting",
  ],
  certifications: [
    {
      name: "HackerRank Certifications",
      provider: "HackerRank",
      status: "Completed",
      date: "Various",
      details: [
        "Problem Solving (Basic)",
        "Java (Basic)",
        "Python (Basic)",
        "React (Basic)",
        "JavaScript (Basic)",
      ],
    },
    {
      name: "Big Data Hadoop Training",
      provider: "Ardent",
      status: "Completed",
      date: "Aug 2016 - Oct 2016",
    },
    {
      name: "Solidity & Ethereum With React And Next",
      provider: "Udemy",
      status: "In Progress",
    },
    {
      name: "Rust Programming",
      provider: "Udemy",
      status: "In Progress",
    },
  ],
  testimonials: [
    {
      name: "Amit Sharma",
      project: "Be4You Dating App",
      image:
        "https://img.freepik.com/free-psd/3d-illustration-bald-person-with-glasses_23-2149436184.jpg",
      content:
        "Amit's work on our dating app, Be4You, was exceptional. His expertise in React Native and custom animations significantly enhanced our user experience. The implementation of features like social login, Apple login, and Zoom-like video calls was seamless.",
    },
    {
      name: "Sundarban Development Authority",
      project: "Sundarban Development Website",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiqA8iK0iMKaX7N68ig6U5oHbgMhDshRdSOw&s",
      content:
        "We collaborated with Amit through Techpromind for our website project. His attention to detail and ability to create a user-friendly interface greatly improved our online presence. The website perfectly showcases the beauty and importance of the Sundarban region.",
    },
    {
      name: "Mobile Shop Owner",
      project: "E-commerce Website",
      image:
        "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436190.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1727136000&semt=ais_hybrid",
      content:
        "Amit developed a super responsive e-commerce website for our mobile shop. The UI is sleek, and the selling process is smooth. Our online sales have significantly increased thanks to his work. We're extremely satisfied with the results.",
    },
  ],
};

const navItems = [
  { name: "about", icon: UserIcon, href: "#about" },
  { name: "experience", icon: BriefcaseIcon, href: "#experience" },
  { name: "projects", icon: FolderIcon, href: "#projects" },
  { name: "skills", icon: ChevronDownIcon, href: "#skills" },
  { name: "education", icon: GraduationCapIcon, href: "#education" },
  { name: "achievements", icon: AwardIcon, href: "#achievements" },
  { name: "contact", icon: MailIcon, href: "#contact" },
];

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className="flex flex-col relative rounded-xl shadow-lg overflow-hidden">
    <div
      className={`backdrop-blur-md bg-gradient-to-r bg-opacity-10 rounded-xl p-6 shadow-lg ${className} flex relative flex-col`}
    >
      <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-yellow-950 via-[#0f0a1c8b] to-black opacity-60 blur-3xl overflow-hidden"></div>
      {children}
    </div>
  </div>
);

const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <span
    className={`bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

const Header: React.FC<{
  activeSection: string;
  setActiveSection: (section: string) => void;
}> = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed w-full z-50 bg-black bg-opacity-50 backdrop-blur-lg "
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GradientText className="text-5xl font-black inknut-antiqua-black">
                AC.
              </GradientText>
              <span className="ml-2 text-xs font-light text-gray-300 satisfy-regular">
                Amit Chakraborty {repo}
              </span>
            </motion.div>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-full text-sm capitalize transition-all font-semibold duration-300 ${
                      activeSection === item.name
                        ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-black"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => setActiveSection(item.name)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-black bg-opacity-95 md:hidden"
          >
            <nav className="container mx-auto px-6 py-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-full capitalize transition-all duration-300 ${
                        activeSection === item.name
                          ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-black"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                      onClick={() => {
                        setActiveSection(item.name);
                        setIsMenuOpen(false);
                      }}
                    >
                      <p>
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

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
            <motion.div className="mb-10 flex flex-col items-center text-center lg:mb-0 lg:items-start lg:text-left mt-36 lg:mt-0">
              {/* <motion.div
                variants={slideInFromTop}
                className="mb-6 flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <span className="rounded-full border border-golden-light bg-black bg-opacity-50 px-4 py-2 text-sm backdrop-blur-md">
                  <SparklesIcon className="mr-2 inline-block h-5 w-5 text-golden-light" />
                  React Native Developer
                </span>
                <span className="rounded-full border border-golden bg-black bg-opacity-50 px-4 py-2 text-sm backdrop-blur-md">
                  <SparklesIcon className="mr-2 inline-block h-5 w-5 text-golden" />
                  Full Stack Developer
                </span>
                <span className="rounded-full border border-golden-dark bg-black bg-opacity-50 px-4 py-2 text-sm backdrop-blur-md">
                  <SparklesIcon className="mr-2 inline-block h-5 w-5 text-golden-dark" />
                  Blockchain Enthusiast
                </span>
              </motion.div> */}
              <motion.h1
                variants={slideInFromLeft(0.5)}
                className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
              >
                <span className="font-bold leading-tight text-white drop-shadow-lg">
                  Hi!{" "}
                </span>
                I'm{" "}
                {/* <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">
                  Amit Chakraborty
                </span> */}
                <GradientText>{portfolioData.personalInfo.name}</GradientText>
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
                  {portfolioData.personalInfo.title}
                </motion.p>
                <motion.div
                  className="flex lg:justify-start justify-center  space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    href={portfolioData.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <LinkedinIcon size={24} />
                  </Link>
                  <Link
                    href={portfolioData.personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <GithubIcon size={24} />
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
              className="relative mt-36 lg:mt-0   flex items-end justify-end  lg:w-1/2"
            >
              <div className="absolute inset-0 animate-pulse rounded-full lg:bg-gradient-to-r bg-gradient-to-bl from-[#0b0714f6] lg:from-[#0f0a1c8b]  to-black opacity-100 blur-3xl"></div>
              <div className="  relative shadow-2xl from-black lg:from-purple-950 ">
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

const About: React.FC = () => (
  <section id="about" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>About Me</GradientText>
      </h2>
      <GlassCard className="from-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            variants={slideInFromRight(0.8)}
            className="relative  mb-8 md:mb-0 "
          >
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-950 via-[#0f0a1c8b] to-black opacity-50 blur-3xl"></div>
            <div className="relative ">
              <div className="gradient-border relative rounded-full p-1 shadow-lg">
                <Image
                  src={
                    "https://png.pngtree.com/png-vector/20240805/ourmid/pngtree-freelancer-software-developer-programmer-coder-illustrator-png-image_13076689.png"
                  }
                  // src={ASSETS.img2}
                  alt="Amit Chakraborty - Profile Picture"
                  width={300}
                  height={300}
                  className="relative rounded-full"
                />
              </div>
            </div>
          </motion.div>
          {/* <div className="md:w-1/3 mb-8 md:mb-0">
            <Image
              src={ASSETS.img2}
              alt={portfolioData.personalInfo.name}
              width={300}
              height={300}
              className="rounded-full"
            />
          </div> */}
          <div className="md:w-2/3 md:pl-8">
            <p className="text-gray-300 mb-4">
              {portfolioData.personalInfo.summary}
            </p>
            <ul className="text-gray-300">
              <li>
                <strong>Location:</strong> {portfolioData.personalInfo.location}
              </li>
              <li>
                <strong>Email:</strong> {portfolioData.personalInfo.email}
              </li>
              <li>
                <strong>Phone:</strong> {portfolioData.personalInfo.phone}
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  </section>
);

const Experience: React.FC = () => (
  <section id="experience" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>Professional Experience</GradientText>
      </h2>
      {portfolioData.professionalExperience.map((exp, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-2xl font-bold mb-2">
            <GradientText>{exp.title}</GradientText> at {exp.company}
          </h3>
          <p className="text-gray-400 mb-4">
            {exp.period} | {exp.location}
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            {exp.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
          <h4 className="text-xl font-semibold mb-2">
            <GradientText>Projects</GradientText>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exp.projects.map((project, idx) => (
              <GlassCard key={idx} className="from-slate-900 rounded-lg p-4">
                <h5 className="text-lg font-semibold mb-2">{project.name}</h5>
                <p className="text-gray-400 mb-2">{project?.tech}</p>
                <p className="text-gray-300 mb-2">{project.description}</p>
                {project?.link && (
                  <Link
                    href={project?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:underline"
                  >
                    View Project <ExternalLinkIcon className="inline w-4 h-4" />
                  </Link>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Projects2: React.FC = () => (
  <section id="projects" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>Featured Projects</GradientText>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioData.professionalExperience[0].projects.map(
          (project, index) => (
            <GlassCard key={index}>
              <h3 className="text-xl font-semibold mb-2">
                <GradientText>{project.name}</GradientText>
              </h3>
              <p className="text-gray-400 mb-2">{project?.tech}</p>
              <p className="text-gray-300 mb-4">{project.description}</p>
              {project?.image && (
                <Image
                  src={project?.image}
                  alt={project.name}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                />
              )}
              {project?.link && (
                <Link
                  href={project?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  View Project <ExternalLinkIcon className="inline w-4 h-4" />
                </Link>
              )}
            </GlassCard>
          )
        )}
      </div>
    </div>
  </section>
);

const Skills: React.FC = () => (
  <section id="skills" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>Skills & Expertise</GradientText>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioData.skills.map((skillCategory, index) => (
          <GlassCard
            key={index}
            className="border-golden-dark to-gray-950 flex flex-grow from-slate-900"
          >
            <h3 className="text-xl font-semibold mb-4">
              <GradientText>{skillCategory.category}</GradientText>
            </h3>
            <ul className="list-disc list-inside text-gray-300">
              {skillCategory.items.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

const Education: React.FC = () => (
  <section id="education" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>Education</GradientText>
      </h2>
      {portfolioData.education.map((edu, index) => (
        <GlassCard key={index} className="mb-8 from-slate-900 to-slate-950">
          <h3 className="text-2xl font-bold mb-2">
            <GradientText>{edu.degree}</GradientText>
          </h3>
          <p className="text-gray-400 mb-2">{edu.institution}</p>
          <p className="text-gray-300 mb-2">{edu.duration}</p>
          <p className="text-gray-300 mb-4">Score: {edu.score}</p>
          <h4 className="text-xl font-semibold mb-2">
            <GradientText>Projects</GradientText>
          </h4>
          <ul className="list-disc list-inside text-gray-300">
            {edu.projects.map((project, idx) => (
              <li key={idx}>
                <strong>{project.type}:</strong> {project.description}
              </li>
            ))}
          </ul>
        </GlassCard>
      ))}
    </div>
  </section>
);

const Achievements: React.FC = () => (
  <section id="achievements" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>Achievements & Certifications</GradientText>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="from-slate-900 to-slate-950 flex-grow">
          <h3 className="text-2xl font-bold mb-4">
            <GradientText>Achievements</GradientText>
          </h3>
          <ul className="list-disc list-inside text-gray-300">
            {portfolioData.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard className="from-slate-900 to-slate-950 flex-grow">
          <h3 className="text-2xl font-bold mb-4">
            <GradientText>Certifications</GradientText>
          </h3>
          {portfolioData.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-lg font-semibold">{cert.name}</h4>
              <p className="text-gray-400">{cert.provider}</p>
              <p className="text-gray-300">{cert.status}</p>
              {cert.date && <p className="text-gray-300">{cert.date}</p>}
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  </section>
);

const Contact: React.FC = () => (
  <section id="contact" className="py-20 bg-black">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold mb-8 text-center">
        <GradientText>Get In Touch</GradientText>
      </h2>
      <GlassCard className="from-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">
              <GradientText>Contact Information</GradientText>
            </h3>
            <ul className="text-gray-300">
              <li className="mb-2">
                <MailIcon className="inline w-5 h-5 mr-2" />
                {portfolioData.personalInfo.email}
              </li>
              <li className="mb-2">
                <BriefcaseIcon className="inline w-5 h-5 mr-2" />
                {portfolioData.personalInfo.phone}
              </li>
              <li className="mb-2">
                <UserIcon className="inline w-5 h-5 mr-2" />
                {portfolioData.personalInfo.location}
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">
              <GradientText>Send a Message</GradientText>
            </h3>
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-black rounded hover:from-yellow-500 hover:to-amber-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </GlassCard>
    </div>
  </section>
);

const Testimonials = () => {
  const sectionRef = useRef(null);
  const q = gsap.utils.selector(sectionRef);

  useEffect(() => {
    gsap.fromTo(
      q(".testimonials-title"),
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: q(".testimonials-title"),
          start: "top bottom-=100",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section id="testimonials" className="py-20 flex flex-col ">
      <div className="container items-center justify-center flex flex-col mx-auto  px-6">
        <h3 className="text-4xl font-bold mb-4">
          <GradientText>Client Testimonials</GradientText>
        </h3>

        <Swiper
          effect={"coverflow"}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          loop
          modules={[EffectCoverflow, Autoplay]}
          className="mySwiper"
        >
          {portfolioData?.testimonials?.map((testimonial, index) => (
            <SwiperSlide key={index} className="w-[300px] sm:w-[350px]">
              <GlassCard className="flex h-full flex-col justify-between rounded-lg bg-black bg-opacity-80 p-6 shadow-xl backdrop-blur-lg backdrop-filter">
                <div>
                  <div className="mb-4 flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full border-2 border-purple-500"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-400">{testimonial.project}</p>
                    </div>
                  </div>
                  <p className="mb-4 italic text-gray-300">
                    "{testimonial.content}"
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl text-gray-500">"</span>
                </div>
              </GlassCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default function SinglePagePortfolio() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentActiveSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
          currentActiveSection = section.id;
        }
      });

      setActiveSection(currentActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Achievements />
      <Testimonials />
      <Contact />

      <Footer />
    </div>
  );
}
