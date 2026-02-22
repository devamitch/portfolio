"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BuyCoffeeModal, BuyCoffeePill } from "./BMC_MODAL";
import ImageWithFallback from "./ImageWithFallback";

const MeetingScheduler = dynamic(() => import("./MeetingScheduler"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center bg-black/20 animate-pulse border border-white/5">
      Loading Scheduler...
    </div>
  ),
});

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const C = {
  bg: "#050505",
  bg2: "#0A0A0A",
  bg3: "#0F0F0F",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.68)",
  faint: "rgba(255,255,255,0.42)",
  vfaint: "rgba(255,255,255,0.24)",
  ghost: "rgba(255,255,255,0.10)",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.025)",
  gold: "#C9A84C",
  goldL: "#F5C842",
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldG: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
  green: "#34D399",
  blue: "#4FC3F7",
  red: "#FF4444",
  purple: "#C084FC",
} as const;

const GRID = "rgba(201,168,76,0.022)";
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";
const EASE_X = [0.18, 1, 0.3, 1] as const;

const D = {
  nameFirst: "Amit",
  nameLast: "Chakraborty",
  tagline: "Eight years. Eighteen apps. No shortcuts.",
  manifesto: [
    "Before AI could write a line of code, I was building production systems.",
    "18+ apps shipped. 50K+ real users. Zero outsourced decisions.",
    "I architect systems that outlast the hype.",
  ],
  roles: [
    "VP Engineering",
    "Principal Architect",
    "CTO",
    "Technical Lead",
    "0-to-1 Builder",
  ],
  location: "Kolkata, India",
  timezone: "IST (UTC+5:30)",
  email: "amit98ch@gmail.com",
  phone: "+91-9874173663",
  github: "https://github.com/devamitch",
  githubAlt: "https://github.com/techamit95ch",
  linkedin: "https://linkedin.com/in/devamitch",
  twitter: "https://x.com/devamitch",
  medium: "https://devamitch.medium.com/",
  profileImage: "/images/amit-profile.jpg",
  profileFallback: "https://github.com/devamitch.png",
  started: "2017-05-01",

  techStack: [
    "React Native",
    "Next.js",
    "NestJS",
    "TypeScript",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "GSAP",
    "Framer Motion",
    "TensorFlow",
    "MediaPipe",
    "Pinecone",
    "Solidity",
    "Web3.js",
    "Fastlane",
    "React.js",
    "Python",
    "Rust",
    "Go",
    "Firebase",
  ],
  ethos: {
    badge: "FOUNDER MINDSET",
    status: "Always On",
    location: "In the Trenches",
    summary:
      "No single company defines me. My dedication, my principles, and how I tackle the hardest technical blockers do. I operate as a specialized unit—putting my skin in the game for every project.",
    metrics: [
      { label: "Mindset", value: "100", unit: "% Founder" },
      { label: "Ownership", value: "Extreme", unit: "" },
      { label: "Delivery", value: "End-to-End", unit: "" },
      { label: "Next Venture", value: "Unicorn", unit: "Target" },
    ],
    principles: [
      {
        label: "Skin in the Game",
        detail:
          "I treat your product like it's my own company. I fight till the end to ensure the architecture survives reality.",
      },
      {
        label: "Tackling the Critical",
        detail:
          "When things break, I step in. I solve the blockers that make other engineers quit.",
      },
      {
        label: "Building the Team",
        detail:
          "I don't just write code. I mentor, train, and instill strict engineering discipline in the teams I lead.",
      },
      {
        label: "Zero-to-One Focus",
        detail:
          "Taking raw visions and turning them into scalable, robust technical realities from absolute zero.",
      },
    ],
    story:
      "I give everything to the craft. Day and night. I build entire technical universes from nothing—architectures, AI pipelines, game engines, and the teams that run them. A single title or past company doesn't capture who I am. What defines me is my resilience, my behavior under pressure, and my absolute refusal to ship mediocre work. Soon, I will be building my own venture from the ground up. Until then, I bring that exact same relentless, 'fight-till-the-end' energy to the teams I lead and the founders I partner with.",
    highlights: [
      "Architecting complex systems while taking full accountability for their survival in production.",
      "Fostering a culture of excellence, mentoring junior to senior engineers into technical leaders.",
      "Navigating high-pressure pivots and critical infrastructure failures with absolute calm.",
      "Preparing to launch a new venture, bringing years of hardened 0-to-1 experience into my own business.",
    ],
  },
  experience: [
    {
      id: "synapsis",
      company: "Synapsis Medical Technologies",
      role: "Principal Mobile Architect & Technical Lead",
      location: "Edmonton, Canada (Remote)",
      period: "Jan 2025 — Feb 2026",
      type: "Founding Engineer",
      color: "#C9A84C",
      badge: "FLAGSHIP CONTRACT",
      status: "Delivered & Closed",
      summary:
        "Retained to execute the complete 0-to-1 technical build of a HealthTech AI startup. Operated as a specialized unit — building the engineering foundation from absolute zero, delivering a production-ready ecosystem before handing off.",
      metrics: [
        { label: "Engineers Led", value: "21", unit: "people" },
        {
          label: "Apps Shipped",
          value: "5",
          unit: "iOS + Android + Web + AI + Desktop ",
        },
        { label: "Uptime", value: "99.9", unit: "%" },
        { label: "CI/CD Speed", value: "30", unit: "% faster" },
      ],
      deliverables: [
        {
          label: "Technical Ecosystem",
          detail:
            "React Native · Next.js · NestJS · AWS · Docker · Kubernetes · PostgreSQL · MongoDB · Redis · GraphQL · GSAP · Framer Motion · TensorFlow · MediaPipe · Pinecone · Solidity · Web3.js · Fastlane · Electron · Time Scale DB · Supabase · Sequelize ·  — from absolute zero",
        },
        {
          label: "Proprietary Game Engine",
          detail: "C++ · Swift · Kotlin bridgeless — zero external libs",
        },
        {
          label: "RAG AI Pipelines",
          detail: "HIPAA-compliant · 99.9% uptime · automated triage",
        },
        {
          label: "Computer Vision",
          detail:
            "MediaPipe · retina analysis · luminance tracking · on-device",
        },
        {
          label: "21-Person Team",
          detail: "Recruited · trained · onboarded · CI/CD infrastructure",
        },
        {
          label: "Production Apps",
          detail:
            "Multiple live apps · secured initial funding · handed off cleanly",
        },
      ],
      story:
        "I gave this everything. Day and night. Weeks without rest. I built their entire technical universe from nothing — game engines, AI pipelines, vision systems, entire teams. I was not just a developer. I was the architect, the recruiter, the mentor, the foundation. After successful delivery, I was not treated with the value I brought. But the code ships. The systems run. The users are served. That stands.",
      highlights: [
        "Led engineering team of 21+ developers across 5 production iOS + Android + Progressive Web + AI + Desktop apps",
        "Built proprietary game engine from scratch — C++/Swift/Kotlin bridgeless modules, zero external deps",
        "Architected HIPAA-compliant RAG pipelines for medical data retrieval, 99.9% uptime",
        "Computer Vision: MediaPipe for real-time retina analysis on mobile consumer hardware",
        "Introduced proper CI/CD pipelines ; recruited & trained 21-person team from scratch",
      ],
    },
    {
      id: "nonceblox",
      company: "NonceBlox Pvt. Ltd.",
      role: "Lead Mobile Architect & Senior Full-Stack",
      location: "Dubai (Remote)",
      period: "Oct 2021 — Jan 2025",
      type: "Full-time",
      color: "#F5C842",
      badge: "3+ YEARS",
      status: "Completed",
      summary:
        "Led end-to-end mobile architecture for 13+ production applications across FinTech, Web3, and Gaming verticals.",
      metrics: [
        { label: "Apps Shipped", value: "13+", unit: "production" },
        { label: "Active Users", value: "50K+", unit: "peak daily" },
        { label: "Platforms", value: "iOS + Android", unit: "" },
        { label: "Duration", value: "3+", unit: "years" },
      ],
      deliverables: [],
      story: "",
      highlights: [
        "Shipped 13+ production apps across FinTech, Web3, and Gaming. 50,000+ active users.",
        "Web3/DeFi: Memr (Wallet whaling/staking), DeFi11 (Smart contracts/NFTs) — fully on-chain.",
        "Vulcan Eleven (Fantasy Sports) & MusicX (Streaming) — 60fps React Native, C++ native modules.",
        "Primary technical liaison for stakeholders; led hiring & mentorship across 3+ years.",
      ],
    },
    {
      id: "early",
      company: "TechProMind & WebSkitters",
      role: "Senior Full-Stack Engineer",
      location: "Kolkata, India",
      period: "May 2017 — Oct 2021",
      type: "Full-time",
      color: "#DAA520",
      badge: "4+ YEARS",
      status: "Completed",
      summary:
        "Built the technical foundation — government systems, enterprise portals, and the architecture mindset.",
      metrics: [
        { label: "Gov Projects", value: "13+", unit: "secured" },
        { label: "Efficiency", value: "40", unit: "% gained" },
        { label: "Duration", value: "4+", unit: "years" },
        { label: "Stack", value: "PHP → Angular", unit: "" },
      ],
      deliverables: [],
      story: "",
      highlights: [
        "Secured 13+ government projects — hardened against SQL injection/XSS. Enterprise-grade security.",
        "Architected GST Ecosystem (Merchant Portal & Retailer Software) from scratch.",
        "Enhanced system efficiency 40% through architectural overhaul.",
        "Migrated legacy PHP to Angular/REST — improved efficiency & maintainability.",
      ],
    },
  ],

  projects: [
    {
      id: "spyk",
      name: "VitalQuest",
      role: "Principal Architect",
      badge: "FLAGSHIP · HEALTHTECH",
      featured: true,
      tagline: "A game engine I built from nothing.",
      desc: "Proprietary game engine built from absolute scratch — zero dependencies, zero shortcuts. LLM-based dynamic health task generation, XP progression system, RAG pipeline for HIPAA-compliant medical context.",
      impact: [
        "Proprietary game engine — zero external deps",
        "LLM task generation at runtime",
        "RAG pipeline for HIPAA-compliant medical data",
        "Computer vision retina analysis",
        "21-person team recruited & trained",
      ],
      tech: [
        "React Native",
        "C++/Swift/Kotlin",
        "LLMs",
        "RAG Pipelines",
        "MediaPipe",
      ],
      color: "#C9A84C",
    },
    {
      id: "thoth",
      name: "Nexus",
      role: "Enterprise Architect",
      badge: "AI PLATFORM",
      featured: true,
      tagline: "One brain for all your marketing channels.",
      desc: "Enterprise AI orchestration platform unifying Meta, TikTok, Shopify and 5+ marketing channels. Autonomous campaign analysis, real-time cross-platform optimization.",
      impact: [
        "5+ platforms unified into one AI brain",
        "Autonomous campaign recommendations",
        "Real-time cross-channel analytics",
      ],
      tech: [
        "React Native",
        "Next.js",
        "Agentic AI",
        "Multi-channel",
        "Real-time Analytics",
      ],
      color: "#F5C842",
    },
    {
      id: "myteal",
      name: "LunaCare",
      role: "Lead Mobile Architect",
      badge: "WOMEN'S HEALTH",
      featured: true,
      tagline: "Wellness that finally understands women.",
      desc: "Privacy-first women's health ecosystem with local-first storage and AI-driven wellness algorithms. Adaptive meditation engine, cycle tracking, mood journaling.",
      impact: [
        "Personalised cycle + mood + sleep tracking",
        "AI wellness recommendations engine",
        "Privacy-first — zero third-party data sells",
      ],
      tech: [
        "React Native",
        "Node.js",
        "AI/ML",
        "Encrypted Storage",
        "Health APIs",
      ],
      color: "#E8B4B8",
    },
    {
      id: "olo",
      name: "Eye Care",
      role: "Technical Lead",
      badge: "MEDTECH",
      featured: false,
      tagline: "Your phone becomes a medical device.",
      desc: "Real-time eye health monitoring using MediaPipe on-device. Retina coverage analysis, blink rate detection, redness assessment.",
      impact: [
        "Medical-grade CV on consumer hardware",
        "Real-time retina analysis",
        "Blink + redness + luminance detection",
      ],
      tech: ["React Native", "MediaPipe", "Computer Vision", "Gumlet API"],
      color: "#2196F3",
    },
    {
      id: "vulcan",
      name: "Vulcan Eleven",
      role: "Lead Mobile Engineer",
      badge: "SPORTS · FINTECH",
      featured: false,
      tagline: "50,000 users. Zero downtime.",
      desc: "Fantasy sports platform with 60fps performance. 50K+ users, Razorpay + Binance Pay dual-payment, 35% transaction growth.",
      impact: [
        "50K+ active users",
        "35% transaction growth",
        "Binance Pay + Razorpay integration",
      ],
      tech: ["React Native", "Reanimated", "C++", "Razorpay", "Binance Pay"],
      color: "#FF6B35",
      link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    },
    {
      id: "maskwa",
      name: "Maskwa",
      role: "Lead Architect",
      badge: "SOCIAL IMPACT",
      featured: false,
      tagline: "Technology that honors culture.",
      desc: "Platform for Canadian Indigenous communities — cultural preservation, community development, and economic empowerment.",
      impact: [
        "Cultural preservation through technology",
        "Economic empowerment layer",
        "Community-first mobile platform",
      ],
      tech: [
        "React Native",
        "Community Platform",
        "Cultural Tech",
        "Mobile-First",
      ],
      color: "#FF9800",
    },
    {
      id: "defi11",
      name: "DeFi11",
      role: "Web3 Architect",
      badge: "DEFI",
      featured: false,
      tagline: "Fully on-chain. No compromise.",
      desc: "Fully decentralized fantasy sports. Smart contract prize pools, on-chain tournament logic, NFT marketplace on Ethereum.",
      impact: [
        "100% on-chain prize pools",
        "Smart contract architecture",
        "Zero-trust design",
      ],
      tech: ["Solidity", "Web3.js", "NFTs", "Smart Contracts", "Ethereum"],
      color: "#F15BB5",
      link: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
    },
    {
      id: "be4you",
      name: "Be4You",
      role: "Lead Architect",
      badge: "SOCIAL · DATING",
      featured: false,
      tagline: "Full MVP. Built for seed funding.",
      desc: "Full dating app MVP: real-time chat via Socket.io, Zoom-style video calls, live geolocation, social + Apple auth. Delivered in under 90 days.",
      impact: [
        "Full MVP for seed round",
        "Real-time video + chat + location",
        "90-day delivery",
      ],
      tech: ["WebRTC", "Socket.io", "Reanimated", "Video", "Node.js"],
      color: "#00BBF9",
    },
    {
      id: "musicx",
      name: "MusicX",
      role: "Senior Engineer",
      badge: "WEB3 · MUSIC",
      featured: false,
      tagline: "Blockchain royalties for artists.",
      desc: "Music competition platform with blockchain-backed royalties. Native C++ Modules, 60fps animations, Twitter + Spotify API.",
      impact: [
        "Blockchain royalty system",
        "C++ native modules",
        "60fps animations",
      ],
      tech: ["React Native", "Blockchain", "Native C++ Modules", "Audio APIs"],
      color: "#9B5DE5",
      link: "https://apps.apple.com/app/music-x/id6475713772",
    },
    {
      id: "housezy",
      name: "Housezy",
      role: "FinTech Lead",
      badge: "PROPTECH",
      featured: false,
      tagline: "Housing automation, reimagined.",
      desc: "Property management platform with complex payment gateways, subscription billing (PayU + Google Pay), GraphQL APIs, Socket.io real-time notifications.",
      impact: [
        "Subscription billing layer",
        "Real-time notifications",
        "PayU + Google Pay integration",
      ],
      tech: ["React Native", "GraphQL", "Socket.io", "PayU", "Subscription"],
      color: "#00F5D4",
      link: "https://apps.apple.com/app/housezy/id6471949955",
    },
  ],

  skills: [
    {
      cat: "Mobile",
      color: "#C9A84C",
      items: [
        { name: "React Native (Expert, Bridgeless)", level: 98 },
        { name: "Expo", level: 90 },
        { name: "TypeScript", level: 96 },
        { name: "Native Modules C++/Swift/Kotlin", level: 85 },
        { name: "Reanimated", level: 92 },
        { name: "iOS & Android", level: 95 },
      ],
    },
    {
      cat: "AI & ML",
      color: "#F5C842",
      items: [
        { name: "RAG Pipelines", level: 88 },
        { name: "Agentic AI", level: 84 },
        { name: "LLM Integration (OpenAI/Claude)", level: 90 },
        { name: "Computer Vision (MediaPipe)", level: 82 },
        { name: "TensorFlow", level: 75 },
        { name: "NLP", level: 78 },
        { name: "Pinecone", level: 80 },
      ],
    },
    {
      cat: "Blockchain",
      color: "#DAA520",
      items: [
        { name: "Solana (Rust/Anchor)", level: 78 },
        { name: "Ethereum (Solidity)", level: 85 },
        { name: "Web3.js / Ethers.js", level: 88 },
        { name: "WalletConnect", level: 82 },
        { name: "Smart Contracts", level: 86 },
        { name: "IPFS", level: 74 },
        { name: "DeFi & NFT", level: 83 },
      ],
    },
    {
      cat: "Backend",
      color: "#E8B4B8",
      items: [
        { name: "NestJS / Node.js / Django", level: 90 },
        { name: "GraphQL / REST", level: 94 },
        { name: "PostgreSQL / MongoDB", level: 88 },
        { name: "AWS Lambda / S3", level: 85 },
        { name: "Docker / Kubernetes", level: 80 },
        { name: "CI/CD Fastlane", level: 88 },
      ],
    },
    {
      cat: "Frontend",
      color: "#4FC3F7",
      items: [
        { name: "React.js", level: 94 },
        { name: "Next.js", level: 92 },
        { name: "Redux", level: 90 },
        { name: "Framer Motion", level: 88 },
        { name: "GSAP", level: 85 },
        { name: "Tailwind CSS", level: 86 },
        { name: "MUI", level: 82 },
      ],
    },
    {
      cat: "Cloud",
      color: "#C084FC",
      items: [
        { name: "AWS (Lambda, S3, Amplify, EC2)", level: 85 },
        { name: "Docker & Kubernetes", level: 80 },
        { name: "GitHub Actions", level: 88 },
        { name: "Fastlane", level: 88 },
        { name: "CircleCI", level: 78 },
        { name: "Firebase", level: 86 },
      ],
    },
    {
      cat: "Databases",
      color: "#FF9800",
      items: [
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 88 },
        { name: "MySQL", level: 82 },
        { name: "Firebase Realtime DB", level: 84 },
        { name: "Redis", level: 80 },
        { name: "Pinecone (Vector)", level: 78 },
      ],
    },
    {
      cat: "Leadership",
      color: "#34D399",
      items: [
        { name: "Team Building & Hiring", level: 94 },
        { name: "Technical Mentorship", level: 95 },
        { name: "Stakeholder Management", level: 88 },
        { name: "Agile/Scrum", level: 92 },
        { name: "0-to-1 Architecture", level: 98 },
        { name: "VP-Level Ops", level: 86 },
      ],
    },
  ],

  education: [
    {
      degree: "MCA",
      school: "Techno Main Salt Lake, Kolkata",
      period: "2018—2021",
      gpa: "8.61 CGPA",
    },
    {
      degree: "BCA",
      school: "The Heritage Academy, Kolkata",
      period: "2014—2017",
      gpa: "",
    },
  ],

  story: [
    {
      yr: "2017",
      title: "The Origin",
      color: "#C9A84C",
      icon: "◈",
      text: "PHP developer. Government projects. 13 secured, restructured, and shipped. Built GST portals, Android apps, and retailer software from zero.",
    },
    {
      yr: "2019",
      title: "MCA & Upskilling",
      color: "#F5C842",
      icon: "◉",
      text: "Master's in Computer Applications. 8.61 CGPA. React, React Native, Web3 foundations, and freelance projects running in parallel.",
    },
    {
      yr: "2021",
      title: "Web3 & Blockchain",
      color: "#DAA520",
      icon: "◆",
      text: "Joined NonceBlox. Deep-dived into Solidity, DeFi, NFTs. Built DeFi11 — fully decentralized fantasy sports. Shipped 13+ apps over 3 years.",
    },
    {
      yr: "2023",
      title: "The Lead Role",
      color: "#B8860B",
      icon: "●",
      text: "Lead Mobile Developer. Owned architecture for MusicX, Housezy, Vulcan Eleven. 50,000+ real users. Razorpay + Binance Pay. C++ Native Modules.",
    },
    {
      yr: "2025",
      title: "AI + HealthTech",
      color: "#C9A84C",
      icon: "◈",
      text: "Proprietary game engine from scratch. RAG pipelines for HIPAA-compliant medical data. Women's health platform at scale. VP-level operations.",
    },
    {
      yr: "Now",
      title: "Open to the Right Role",
      color: "#F5C842",
      icon: "→",
      text: "VP Engineering. CTO. Principal Architect. The title matters less than the mission. I build systems that scale and turn technical vision into business outcomes.",
    },
  ],

  testimonials: [
    {
      name: "Kartik Kalia",
      role: "Full Stack Developer · AWS",
      company: "NonceBlox",
      seniority: "DIRECT MANAGER",
      col: "#C9A84C",
      rel: "Managed Amit · 3 years",
      date: "Nov 2024",
      text: "I had the pleasure of working with Amit for three years and witnessed his impressive growth from Front-End Developer to Front-End Lead. His expertise and dedication make him a valuable asset to any team.",
      li: "https://linkedin.com/in/kartikkalia/",
    },
    {
      name: "Neha Goel",
      role: "HR Professional · 15+ Years",
      company: "NonceBlox",
      seniority: "SENIOR LEADERSHIP",
      col: "#78909C",
      rel: "Senior colleague",
      date: "Oct 2024",
      text: "Amit had been an amicable and diligent developer, one of the most dependable Engineers when it comes to delivery or urgent closures. His capability to rebuild any project from scratch is remarkable.",
      li: "https://linkedin.com/in/neha-goel/",
    },
    {
      name: "Varun Chodha",
      role: "Senior Full-Stack · MERN",
      company: "NonceBlox",
      seniority: "MENTEE → SENIOR",
      col: "#81C784",
      rel: "Grew under Amit's guidance",
      date: "Oct 2024",
      text: "Amit played a pivotal role in mentoring me, sharing his profound knowledge of Redux, React Native, and frontend concepts. His enthusiasm for coding and pursuit for perfection are truly inspiring.",
      li: "https://linkedin.com/in/varun-chodha/",
    },
  ],

  blogs2: [
    {
      title: "React Native Bridgeless Architecture: What They Don't Tell You",
      cat: "Mobile",
      color: "#C9A84C",
      readTime: "8 min",
      teaser:
        "The new architecture changes everything. Here's what actually breaks in production and how to fix it.",
    },
    {
      title: "Building RAG Pipelines for Medical Data: A HIPAA-Safe Approach",
      cat: "AI + HealthTech",
      color: "#F5C842",
      readTime: "12 min",
      teaser:
        "How we built retrieval pipelines for sensitive medical data without violating compliance.",
    },
    {
      title: "Why 50% of React Native Apps Fail in Production",
      cat: "Architecture",
      color: "#DAA520",
      readTime: "10 min",
      teaser:
        "After 8 years and 18 apps, I see the same architecture mistake made over and over.",
    },
  ],
  blogs: [
    {
      title: "Say Goodbye to Git Woes: Become a Git Wizard Today! 🧙‍♂️",
      cat: "DevOps / Git",
      color: "#C9A84C",
      date: "Jan 17, 2025",
      teaser:
        "Git isn’t just a tool; it’s a superpower. Whether you’re a beginner or an experienced developer, mastering Git practices will transform...",
      link: "https://devamitch.medium.com/say-goodbye-to-git-woes-become-a-git-wizard-today-c6f6e7c10b7a",
    },
    {
      title: "Let’s Build Your First Electron App: The Magical Feed App! 🪄",
      cat: "Desktop / Electron",
      color: "#F5C842",
      date: "Nov 23, 2024",
      teaser:
        "Hey there, future tech wizards! Are you ready to dive into the world of coding and create your very own app? With just some simple...",
      link: "https://devamitch.medium.com/lets-build-your-first-electron-app-the-magical-feed-app-7d8e9f2a1b3c",
    },
    {
      title: "From TypeScript to Rust & Go — Day 3: Mastering Functions",
      cat: "Rust & Go",
      color: "#DAA520",
      date: "Nov 23, 2024",
      teaser:
        "Day 3: Writing Reusable Functions and Handling Errors in Rust and Go. Each post introduces concepts step-by-step in plain English.",
      link: "https://devamitch.medium.com/from-typescript-to-rust-go-day-3-mastering-functions-and-error-handling-c2d1e4f5a6b7",
    },
    {
      title: "Expo vs. Bare React Native: Which Should You Use and When?",
      cat: "Mobile / React Native",
      color: "#4FC3F7",
      date: "Oct 25, 2024",
      teaser:
        "React Native has become a popular choice for mobile app development. Here is how to choose between Expo's managed workflow and Bare React Native.",
      link: "https://devamitch.medium.com/expo-vs-bare-react-native-which-should-you-use-and-when-f2b3c4d5e6f7",
    },
    {
      title: "Understanding Type vs. Interface in TypeScript",
      cat: "TypeScript",
      color: "#34D399",
      date: "Sep 28, 2024",
      teaser:
        "As I mentor my junior developers on the importance of type safety, I’ve observed a persistent gap in their understanding of foundational...",
      link: "https://devamitch.medium.com/understanding-type-vs-interface-in-typescript-a-guide-for-junior-developers-a1b2c3d4e5f6",
    },
  ],

  services: [
    {
      id: "pitch",
      icon: "◈",
      title: "Pitch Your Idea",
      sub: "Turn a concept into a roadmap",
      color: "#C9A84C",
      items: [
        "30-min discovery call",
        "Technical feasibility analysis",
        "MVP scope definition",
        "Tech stack recommendation",
        "Timeline + cost estimate",
        "Architecture blueprint",
      ],
      cta: "Submit Your Idea",
      price: "Free to pitch",
      note: "No commitment. Just clarity.",
      href: "#pitch",
    },
    {
      id: "consult",
      icon: "◉",
      title: "Consulting",
      sub: "Architecture · Strategy · Reviews",
      color: "#F5C842",
      items: [
        "Architecture design & review",
        "Technical due diligence",
        "Codebase audit",
        "Team structure advisory",
        "Ongoing strategic advisory",
        "1:1 mentorship sessions",
      ],
      cta: "Book a Session",
      price: "From $150/hr",
      note: "Or fixed retainer for ongoing work.",
      href: "#contact",
    },
    {
      id: "build",
      icon: "◆",
      title: "End-to-End Build",
      sub: "From zero to production",
      color: "#DAA520",
      items: [
        "Full 0-to-1 product build",
        "React Native + Next.js + NestJS",
        "AI/ML integrations (RAG, LLMs, CV)",
        "Team recruitment & training",
        "CI/CD setup",
        "Post-launch support",
      ],
      cta: "Start a Project",
      price: "Fixed scope",
      note: "Quoted after discovery call.",
      href: "#contact",
    },
  ],

  process: [
    {
      step: "01",
      duration: "30 min",
      title: "Discovery Call",
      color: "#C9A84C",
      desc: "You share the vision. I ask the hard questions. We figure out if this is a fit and what the right scope looks like.",
    },
    {
      step: "02",
      duration: "2–3 days",
      title: "Architecture Blueprint",
      color: "#F5C842",
      desc: "I design the technical system — stack, data models, integrations, cost structure, and timeline. No black boxes.",
    },
    {
      step: "03",
      duration: "Ongoing",
      title: "Aligned Build",
      color: "#DAA520",
      desc: "Regular check-ins. Transparent progress. No disappearing acts. You always know where things stand.",
    },
    {
      step: "04",
      duration: "Final",
      title: "Delivery & Handoff",
      color: "#B8860B",
      desc: "Production-ready code, documented systems, trained team if needed. I don't ghost after delivery.",
    },
  ],

  faqs: [
    {
      cat: "General",
      q: "What type of work do you take on?",
      a: "End-to-end mobile and fullstack architecture — React Native, Next.js, NestJS, AI/ML integrations. I specialize in 0-to-1 builds, team setup, and complex system design. If you have a vision and need a technical co-founder-level partner, that's my zone.",
    },
    {
      cat: "General",
      q: "How quickly can you start on a new project?",
      a: "Typically within 1–2 weeks, depending on scope and current availability. For urgent builds, reach out directly and we'll figure it out.",
    },
    {
      cat: "General",
      q: "Do you work with early-stage startups?",
      a: "Yes — that's where I do my best work. I've built two complete startup ecosystems from scratch. I understand the pressure, the pivots, and the need to ship fast without accumulating technical debt.",
    },
    {
      cat: "Process",
      q: "What's your process for starting an engagement?",
      a: "Discovery call (30 min) → Scope alignment → Architecture review → Roadmap + timeline → Delivery with regular check-ins. I don't disappear after signing.",
    },
    {
      cat: "Team",
      q: "Can you lead and build a team?",
      a: "Yes — I've recruited, hired, and trained 21 engineers for a single project. I can both build systems and build the humans who maintain them.",
    },
    {
      cat: "Technical",
      q: "Do you work on AI and machine learning projects?",
      a: "Absolutely. RAG pipelines, agentic AI, LLM integration, computer vision — this is a core part of my work, not a side experiment. I've deployed these in regulated HealthTech environments.",
    },
    {
      cat: "Services",
      q: "What does 'Pitch Your Idea' mean?",
      a: "You come with a concept — rough or refined. I evaluate technical feasibility, define the MVP, estimate cost and timeline, and give you a clear path to making it real. No gatekeeping, no jargon.",
    },
    {
      cat: "Services",
      q: "What's included in the Consulting service?",
      a: "Architecture reviews, technical due diligence, code audits, team structure recommendations, or ongoing strategic technical advisory. Priced by hour or retainer.",
    },
    {
      cat: "Services",
      q: "Can I buy a pre-built project or template?",
      a: "Yes — I have production-tested boilerplates and project foundations in React Native, Next.js, and NestJS. Reach out to discuss what fits your needs.",
    },
    {
      cat: "General",
      q: "Do you work remotely?",
      a: "Exclusively remote. I've worked with teams across Canada, Dubai, and India without missing a beat. Time zones are manageable with the right communication setup.",
    },
    {
      cat: "Services",
      q: "What's your day rate / project rate?",
      a: "Consulting starts at $150/hr. Project rates are fixed-scope after discovery. Reach out and let's find a structure that works.",
    },
    {
      cat: "Process",
      q: "Are you available for a quick technical review?",
      a: "Yes — I offer focused 1-hour architecture review sessions. Great for validating technical decisions, reviewing an existing codebase, or getting an expert second opinion.",
    },
  ],
} as const;

const getYrs = () =>
  Math.floor(
    (Date.now() - new Date(D.started).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );

function useScramble(target: string, speed = 35) {
  const [text, setText] = useState(target);
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
  useEffect(() => {
    let iter = 0;
    const id = setInterval(() => {
      setText(
        target
          .split("")
          .map((c, i) =>
            i < iter
              ? c
              : c === " "
                ? " "
                : CHARS[Math.floor(Math.random() * CHARS.length)],
          )
          .join(""),
      );
      if (iter >= target.length) clearInterval(id);
      iter += 0.5;
    }, speed);
    return () => clearInterval(id);
  }, [target]);
  return text;
}

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let n = 0;
        const go = () => {
          n += Math.ceil(to / 60);
          setVal(Math.min(n, to));
          if (n < to) requestAnimationFrame(go);
        };
        requestAnimationFrame(go);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: C.goldG,
        transformOrigin: "left",
        scaleX,
        zIndex: 1000,
      }}
    />
  );
}

function Badge({
  children,
  color = C.gold,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}44`,
        borderRadius: 4,
        padding: "3px 8px",
        whiteSpace: "nowrap",
        background: `${color}0D`,
      }}
    >
      {children}
    </span>
  );
}

function TiltCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * -12;
    const ry = (x - 0.5) * 12;
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    const shine = ref.current.querySelector(
      ".tilt-shine",
    ) as HTMLElement | null;
    if (shine) {
      shine.style.setProperty("--mx", `${x * 100}%`);
      shine.style.setProperty("--my", `${y * 100}%`);
      shine.style.opacity = "1";
    }
  }, []);
  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    const shine = ref.current.querySelector(
      ".tilt-shine",
    ) as HTMLElement | null;
    if (shine) shine.style.opacity = "0";
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.18s ease-out", ...style }}
    >
      {children}
      <div
        className="tilt-shine"
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: "opacity 0.2s",
          background:
            "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.12) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

function ContribGraph() {
  const data = useMemo(
    () =>
      Array.from({ length: 53 }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => {
          const s = ((w * 7 + d) * 2654435761) >>> 0;
          return (s % 100) / 100 > (d === 0 || d === 6 ? 0.3 : 0.65)
            ? 0
            : Math.floor(s % 5);
        }),
      ),
    [],
  );
  const cols = [
    "rgba(201,168,76,.07)",
    "rgba(201,168,76,.22)",
    "rgba(201,168,76,.42)",
    "rgba(201,168,76,.68)",
    "rgba(201,168,76,.95)",
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 680 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {data.map((wk, wi) => (
            <div
              key={wi}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {wk.map((lv, di) => (
                <motion.div
                  key={di}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (wi * 7 + di) * 0.0003, duration: 0.15 }}
                  whileHover={{ scale: 1.6 }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: cols[lv],
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "rgba(201,168,76,.45)",
              fontFamily: MONO,
            }}
          >
            Less
          </span>
          {cols.map((c, i) => (
            <div
              key={i}
              style={{ width: 10, height: 10, borderRadius: 2, background: c }}
            />
          ))}
          <span
            style={{
              fontSize: 9,
              color: "rgba(201,168,76,.45)",
              fontFamily: MONO,
            }}
          >
            More
          </span>
        </div>
      </div>
    </div>
  );
}

function SLabel({ num, children }: { num?: string; children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
      }}
    >
      {num && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: "rgba(201,168,76,.4)",
            letterSpacing: "0.3em",
          }}
        >
          {num}
        </span>
      )}
      <div
        style={{ height: 1, width: 40, background: C.gold, flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: C.gold,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

function SH({
  l1,
  l2,
  size = "clamp(36px,5vw,68px)",
}: {
  l1: string;
  l2?: string;
  size?: string;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_X }}
      style={{
        fontSize: size,
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 0.92,
        marginBottom: 48,
        fontFamily: HN,
        color: C.text,
      }}
    >
      {l1}
      {l2 && (
        <>
          <br />
          <span style={{ color: "rgba(255,255,255,.12)" }}>{l2}</span>
        </>
      )}
    </motion.h2>
  );
}

function GoldAccent({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: C.goldG,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

function ProjectCard({ p, i }: { p: (typeof D.projects)[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 300, damping: 25 });
  const sry = useSpring(ry, { stiffness: 300, damping: 25 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * 10);
    ry.set(-((e.clientX - r.left) / r.width - 0.5) * 10);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06, duration: 0.8, ease: EASE_X }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => {
        setHov(false);
        rx.set(0);
        ry.set(0);
      }}
    >
      <div
        style={{
          border: `1px solid ${hov ? "rgba(201,168,76,.5)" : p.featured ? "rgba(201,168,76,.18)" : C.border}`,
          background: p.featured
            ? "linear-gradient(135deg,rgba(201,168,76,.05) 0%,transparent 55%)"
            : C.card,
          padding: p.featured ? 32 : 26,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          transition: "border-color .3s,box-shadow .3s",
          boxShadow: hov
            ? `0 24px 60px rgba(0,0,0,.3),0 0 0 1px ${p.color}20`
            : "none",
        }}
      >
        <motion.div
          animate={{ scaleY: hov ? 1 : 0.3 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 2,
            background: p.color || C.gold,
            transformOrigin: "top",
          }}
        />
        <div style={{ paddingLeft: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: p.color,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  marginBottom: 8,
                  opacity: 0.85,
                }}
              >
                {p.badge}
              </div>
              <h3
                style={{
                  fontSize: p.featured ? 24 : 19,
                  fontWeight: 900,
                  margin: 0,
                  color: hov ? C.gold : C.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  fontFamily: HN,
                  transition: "color .2s",
                }}
              >
                {p.name}
              </h3>
            </div>
            {p.featured && (
              <span
                style={{
                  fontSize: 8,
                  padding: "4px 9px",
                  background: C.goldF,
                  border: `1px solid ${C.goldD}`,
                  color: C.gold,
                  fontFamily: MONO,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                FEATURED
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.vfaint,
              fontFamily: MONO,
              marginBottom: 10,
              letterSpacing: "0.08em",
            }}
          >
            {p.role}
          </div>
          {p.tagline && (
            <div
              style={{
                fontSize: 13,
                color: C.gold,
                fontStyle: "italic",
                marginBottom: 12,
                fontWeight: 300,
              }}
            >
              "{p.tagline}"
            </div>
          )}
          <p
            style={{
              fontSize: 13,
              color: C.dim,
              lineHeight: 1.75,
              marginBottom: 18,
              fontWeight: 300,
            }}
          >
            {p.desc}
          </p>
          <div
            style={{
              padding: "10px 14px",
              borderLeft: `2px solid ${C.goldD}`,
              background: "rgba(201,168,76,.025)",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: C.gold,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 7,
              }}
            >
              Impact
            </div>
            {p.impact.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 12,
                  color: C.dim,
                  marginBottom: 3,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: p.color || C.gold,
                    flexShrink: 0,
                    fontSize: 10,
                  }}
                >
                  →
                </span>
                {item}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 12,
            }}
          >
            {p.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 8,
                  padding: "3px 8px",
                  border: `1px solid ${hov ? "rgba(201,168,76,.22)" : C.border}`,
                  color: hov ? "rgba(201,168,76,.7)" : C.vfaint,
                  fontFamily: MONO,
                  transition: "all .2s",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          {"link" in p && (p as any).link && (
            <a
              href={(p as any).link}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 10,
                color: "rgba(201,168,76,.55)",
                fontFamily: MONO,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(201,168,76,.55)")
              }
            >
              View Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/contact-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      setStatus("success");
      setForm({
        name: "",
        email: "",
        company: "",
        role: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inp: React.CSSProperties = {
    padding: "13px 14px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color .2s,box-shadow .2s",
    background: "rgba(255,255,255,.02)",
    border: `1px solid ${C.border}`,
    color: C.text,
    fontFamily: "inherit",
  };
  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: 9,
    color: C.vfaint,
    marginBottom: 6,
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: MONO,
  };
  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = "rgba(201,168,76,.38)";
    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,.05)";
  };
  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.style.borderColor = C.border;
    e.target.style.boxShadow = "none";
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 13 }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
        className="form2col"
      >
        <div>
          <label style={{ ...lbl, color: C.gold }}>Name *</label>
          <input
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={{ ...lbl, color: C.gold }}>Email *</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
        className="form2col"
      >
        <div>
          <label style={lbl}>Company</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={lbl}>Your Role</label>
          <input
            type="text"
            placeholder="CTO / Founder"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={inp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
      <div>
        <label style={lbl}>Subject</label>
        <input
          type="text"
          placeholder="Principal Architect Opportunity"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          style={inp}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      <div>
        <label style={{ ...lbl, color: C.gold }}>Message *</label>
        <textarea
          required
          rows={5}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inp, resize: "vertical", minHeight: 120 }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <div
          style={{
            fontSize: 9,
            color: C.ghost,
            marginTop: 4,
            fontFamily: MONO,
          }}
        >
          {form.message.length}/5000
        </div>
      </div>
      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={status === "idle" ? { scale: 1.01 } : {}}
        whileTap={status === "idle" ? { scale: 0.99 } : {}}
        style={{
          width: "100%",
          padding: 17,
          background: C.goldG,
          border: "none",
          color: "#000",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: MONO,
          cursor: status === "sending" ? "not-allowed" : "pointer",
          opacity: status === "sending" ? 0.65 : 1,
          boxShadow:
            status !== "sending" ? "0 6px 24px rgba(201,168,76,.28)" : "none",
          transition: "box-shadow .3s,opacity .3s",
        }}
      >
        {status === "idle"
          ? "Send Message →"
          : status === "sending"
            ? "Sending..."
            : status === "success"
              ? "Sent ✓"
              : "Try Again"}
      </motion.button>
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 18px",
              background: "rgba(76,175,80,.07)",
              border: "1px solid rgba(76,175,80,.22)",
              color: "rgba(100,200,110,.9)",
              fontSize: 12,
              fontFamily: MONO,
            }}
          >
            Message sent — I&apos;ll respond within 24 hours.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function PitchForm() {
  const emptyForm = {
    name: "",
    email: "",
    idea: "",
    budget: "",
    timeline: "",
    category: "",
    stage: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const set = <K extends keyof typeof emptyForm>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const categories = [
    "Mobile App",
    "Web Platform",
    "AI / ML",
    "Web3 / Blockchain",
    "HealthTech",
    "FinTech",
    "Other",
  ];
  const budgets = [
    "< $10K",
    "$10K – $25K",
    "$25K – $50K",
    "$50K – $100K",
    "$100K+",
    "Let's discuss",
  ];
  const timelines = [
    "ASAP (< 1 month)",
    "1 – 3 months",
    "3 – 6 months",
    "6+ months",
    "Flexible",
  ];
  const stages = [
    "Just an idea",
    "Validated concept",
    "MVP built",
    "In market",
    "Scaling",
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/pitch-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("sent");
      setForm(emptyForm);
    } catch {
      setStatus("error");
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,.02)",
    border: `1px solid ${C.border}`,
    padding: "13px 14px",
    color: C.text,
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color .2s",
    boxSizing: "border-box",
  };
  const onFocus = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => (e.target.style.borderColor = "rgba(201,168,76,.38)");
  const onBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => (e.target.style.borderColor = C.border);
  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: 9,
    color: C.gold,
    marginBottom: 6,
    fontWeight: 600,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: MONO,
  };

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "44px 0" }}>
        <div style={{ fontSize: 52, color: C.gold, marginBottom: 20 }}>◈</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
          Idea received.
        </h3>
        <p style={{ color: C.faint, fontSize: 14, lineHeight: 1.65 }}>
          I'll review and respond with honest feedback within 48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{
            marginTop: 24,
            padding: "10px 24px",
            border: `1px solid ${C.gold}`,
            background: "transparent",
            color: C.gold,
            cursor: "pointer",
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.14em",
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        className="form2col"
      >
        <div>
          <label style={lbl}>Name *</label>
          <input
            style={inp}
            required
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={lbl}>Email *</label>
          <input
            style={inp}
            type="email"
            required
            placeholder="you@startup.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
      <div>
        <label style={lbl}>Category</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => set("category", cat)}
              style={{
                padding: "6px 14px",
                border: `1px solid ${form.category === cat ? C.gold : C.border}`,
                background: form.category === cat ? C.goldF : "transparent",
                color: form.category === cat ? C.gold : C.faint,
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={lbl}>Current Stage</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {stages.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => set("stage", s)}
              style={{
                padding: "6px 14px",
                border: `1px solid ${form.stage === s ? C.gold : C.border}`,
                background: form.stage === s ? C.goldF : "transparent",
                color: form.stage === s ? C.gold : C.faint,
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={lbl}>Describe Your Idea *</label>
        <textarea
          required
          rows={5}
          placeholder="Tell me what you want to build. The problem it solves. Who it's for."
          value={form.idea}
          onChange={(e) => set("idea", e.target.value)}
          style={{ ...inp, resize: "vertical" }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        className="form2col"
      >
        <div>
          <label style={lbl}>Budget Range</label>
          <select
            style={{ ...inp, appearance: "none", cursor: "pointer" }}
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select...</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>Timeline</label>
          <select
            style={{ ...inp, appearance: "none", cursor: "pointer" }}
            value={form.timeline}
            onChange={(e) => set("timeline", e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="">Select...</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      {status === "error" && (
        <p
          style={{
            color: C.red,
            fontFamily: MONO,
            fontSize: 11,
            textAlign: "center",
          }}
        >
          Something went wrong. Email me directly.
        </p>
      )}
      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{
          width: "100%",
          padding: 17,
          background: C.goldG,
          border: "none",
          color: "#000",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: MONO,
          cursor: "pointer",
          opacity: status === "sending" ? 0.65 : 1,
        }}
      >
        {status === "sending" ? "Sending..." : "Submit Your Idea →"}
      </motion.button>
    </form>
  );
}

/* 
   DIVIDER
 */
function Div() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
      <hr
        style={{
          height: 1,
          border: "none",
          opacity: 0.35,
          background:
            "linear-gradient(90deg,transparent,rgba(201,168,76,.35),transparent)",
        }}
      />
    </div>
  );
}

/* 
   MOBILE BOTTOM NAV  (from Doc2)
 */
function MobileNav() {
  const navItems = [
    { label: "Home", href: "#hero", icon: "⌂" },
    { label: "Work", href: "#work", icon: "◈" },
    { label: "Services", href: "#services", icon: "◉" },
    { label: "FAQ", href: "#faq", icon: "?" },
    { label: "Contact", href: "#contact", icon: "→" },
  ];
  return (
    <nav
      style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(5,5,5,0.94)",
        borderTop: `1px solid ${C.border}`,
        backdropFilter: "blur(20px)",
        padding: "8px 0",
        justifyContent: "space-around",
      }}
      className="mobile-nav"
    >
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            textDecoration: "none",
            padding: "4px 10px",
          }}
        >
          <span style={{ fontSize: 18, color: C.gold }}>{item.icon}</span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 8,
              color: C.vfaint,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}

/* 
   ██  SECTION: HERO  (PrimaryHome — full fidelity)
 */
function HeroSection({
  roleIdx,
  scrambled,
}: {
  roleIdx: number;
  scrambled: string;
}) {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 1400], [0, 100]);
  const txtY = useTransform(scrollY, [0, 1400], [0, -50]);
  const fade = useTransform(scrollY, [0, 700, 1400], [2, 0.5, 0]);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: C.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="gsap-grid"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${GRID} 1px,transparent 1px),linear-gradient(90deg,${GRID} 1px,transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />
      {[
        { x: "-5%", y: "8%", s: 700 },
        { x: "65%", y: "52%", s: 520 },
      ].map((o, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{
            duration: 11 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: o.x,
            top: o.y,
            width: o.s,
            height: o.s,
            background:
              "radial-gradient(circle,rgba(201,168,76,.08) 0%,transparent 58%)",
            filter: "blur(100px)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      ))}

      <motion.div
        style={{
          opacity: fade,
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "110px 32px 80px",
        }}
      >
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${C.goldD}`,
            background: C.goldF,
            padding: "10px 20px",
            marginBottom: 52,
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.gold,
              display: "inline-block",
              animation: "ac-pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: C.gold,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: MONO,
              fontWeight: 600,
            }}
          >
            Available · Remote Worldwide · VP · CTO · Principal Architect
          </span>
        </motion.div>

        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr .85fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* LEFT TEXT */}
          <motion.div style={{ y: txtY }}>
            <div style={{ overflow: "hidden", marginBottom: 2 }}>
              <motion.div
                initial={{ y: 180 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.22, ease: EASE_X }}
                style={{
                  fontSize: "clamp(3.8rem,9.5vw,8.5rem)",
                  fontWeight: 900,
                  lineHeight: 0.86,
                  letterSpacing: "-0.04em",
                  color: C.text,
                  fontFamily: HN,
                }}
              >
                {D.nameFirst}
              </motion.div>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 28 }}>
              <motion.div
                initial={{ y: 180 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.36, ease: EASE_X }}
                style={{
                  fontSize: "clamp(3.2rem,8.2vw,7.2rem)",
                  fontWeight: 800,
                  lineHeight: 0.88,
                  letterSpacing: "2px",
                  fontFamily: HN,
                  WebkitTextStroke: "2px rgba(201,168,76,.52)",
                  color: "transparent",
                }}
              >
                {D.nameLast}
              </motion.div>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 20 }}>
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.54, ease: EASE_X }}
              >
                <div
                  style={{
                    fontSize: "clamp(1rem,2vw,1.4rem)",
                    fontWeight: 300,
                    color: C.dim,
                    letterSpacing: "0.02em",
                    fontFamily: MONO,
                  }}
                >
                  {scrambled}
                </div>
              </motion.div>
            </div>

            {/* Rotating role */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 32,
                height: 40,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  height: 1,
                  width: 44,
                  background: C.gold,
                  transformOrigin: "left",
                  flexShrink: 0,
                }}
              />
              <div style={{ overflow: "hidden", height: 40 }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roleIdx}
                    initial={{ y: 42, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -42, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_X }}
                    style={{
                      fontSize: 22,
                      color: C.gold,
                      fontWeight: 300,
                      letterSpacing: "0.06em",
                      margin: 0,
                      fontFamily: HN,
                    }}
                  >
                    {D.roles[roleIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Manifesto */}
            <div style={{ marginBottom: 40 }}>
              {D.manifesto.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.12 }}
                  style={{
                    fontSize: 15,
                    color: i === 2 ? C.gold : C.dim,
                    lineHeight: 1.7,
                    marginBottom: 6,
                    fontWeight: i === 2 ? 500 : 300,
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 44,
              }}
            >
              <motion.a
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.goldG,
                  color: "#000",
                  padding: "15px 30px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(201,168,76,.25)",
                }}
              >
                See My Work →
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `2px solid ${C.goldD}`,
                  color: C.gold,
                  padding: "15px 30px",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = C.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.goldD)
                }
              >
                Let&apos;s Build →
              </motion.a>
              <motion.a
                href={D.linkedin}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid ${C.border}`,
                  color: C.faint,
                  padding: "15px 22px",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.gold;
                  e.currentTarget.style.borderColor = C.goldD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.faint;
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                LinkedIn ↗
              </motion.a>
              <motion.a
                href={D.twitter}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid ${C.border}`,
                  color: C.faint,
                  padding: "15px 22px",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.text;
                  e.currentTarget.style.borderColor = C.dim;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.faint;
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                X (Twitter) ↗
              </motion.a>
            </motion.div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 36 }}
            >
              {[
                { l: "Based in", v: D.location },
                { l: "Availability", v: "Remote Worldwide" },
                { l: "Focus", v: "Mobile · AI · Web3" },
              ].map((m) => (
                <div key={m.l}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 8,
                      letterSpacing: "0.28em",
                      color: "rgba(255,255,255,.22)",
                      textTransform: "uppercase",
                      marginBottom: 5,
                    }}
                  >
                    {m.l}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,.75)",
                      fontWeight: 500,
                    }}
                  >
                    {m.v}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT PHOTO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            className="hero-photo"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <motion.div style={{ y: imgY, position: "relative" }}>
              {[
                { inset: -36, dur: 32, o: 0.12 },
                { inset: -70, dur: 48, o: 0.05 },
              ].map((r, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: i === 0 ? 360 : -360 }}
                  transition={{
                    duration: r.dur,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    inset: r.inset,
                    border: `1px solid rgba(201,168,76,${r.o})`,
                    borderRadius: "50%",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  inset: -60,
                  background:
                    "radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 62%)",
                  filter: "blur(50px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: 310,
                  height: 310,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(201,168,76,.38)",
                  position: "relative",
                  boxShadow: "0 40px 80px rgba(0,0,0,.55)",
                }}
              >
                <ImageWithFallback
                  src={D.profileImage}
                  fallbackSrc={D.profileFallback}
                  alt="Amit Chakraborty"
                  fill
                  style={{ objectFit: "cover" }}
                  fallbackColor="rgba(201,168,76,.15)"
                  sizes="310px"
                  priority
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top,rgba(5,5,5,.38) 0%,transparent 55%)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                    color: "rgba(255,255,255,.1)",
                  }}
                >
                  Amit Chakraborty
                </span>
              </div>
              {[
                {
                  label: "Years",
                  value: `${getYrs()}+`,
                  pos: { top: 0, left: -56 },
                },
                { label: "Apps", value: "18+", pos: { top: 54, right: -60 } },
                {
                  label: "Users",
                  value: "50K+",
                  pos: { bottom: 80, left: -60 },
                },
                {
                  label: "Uptime",
                  value: "99.9%",
                  pos: { bottom: 14, right: -50 },
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 1.4 + i * 0.12,
                    type: "spring",
                    stiffness: 220,
                  }}
                  whileHover={{ scale: 1.08 }}
                  style={{
                    position: "absolute",
                    ...s.pos,
                    background: "rgba(5,5,5,.96)",
                    border: `1px solid rgba(201,168,76,.28)`,
                    padding: "10px 14px",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                    backdropFilter: "blur(12px)",
                    minWidth: 70,
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: C.gold,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      color: C.ghost,
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      fontFamily: MONO,
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          style={{
            marginTop: 80,
            paddingTop: 40,
            borderTop: `1px solid ${C.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
          }}
          className="stats-grid"
        >
          {[
            { to: getYrs(), s: "+", l: "Years Engineering" },
            { to: 18, s: "+", l: "Apps Shipped" },
            { to: 50, s: "K+", l: "Active Users" },
            { to: 2029, s: "", l: "GitHub Contributions" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.62 + i * 0.08 }}
            >
              <div
                style={{
                  fontSize: "clamp(36px,5vw,54px)",
                  fontWeight: 900,
                  color: C.gold,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 6,
                  fontFamily: HN,
                }}
              >
                <Counter to={s.to} suffix={s.s} />
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: C.vfaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontFamily: MONO,
                }}
              >
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: C.ghost,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            fontFamily: MONO,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            width: 1,
            height: 44,
            background: `linear-gradient(to bottom,${C.gold},transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
}

/* 
   ██  SECTION: MARQUEE TECH STACK  (from Doc2)
 */
function MarqueeSection() {
  const items = [...D.techStack, ...D.techStack];
  return (
    <div
      style={{
        padding: "clamp(20px,3vw,32px) 0",
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        overflow: "hidden",
        position: "relative",
        background: C.bg,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(90deg,${C.bg},transparent)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: `linear-gradient(270deg,${C.bg},transparent)`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        className="marquee-track"
        style={{ display: "flex", gap: 52, alignItems: "center" }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: "0.1em",
                color: C.faint,
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: C.goldD,
                display: "inline-block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* 
   ██  SECTION: ABOUT — BENTO GRID  (PrimaryHome)
 */
function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 0", background: C.bg2 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="00">About</SLabel>
        <SH l1="Architect first." l2="Engineer always." />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gridTemplateRows: "auto auto",
            gap: 12,
          }}
          className="bento-outer"
        >
          {/* Big bio — 8 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "1/9",
              gridRow: "1",
              border: `1px solid ${C.border}`,
              background: C.card,
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: C.goldG,
              }}
            />
            <div
              style={{
                fontSize: 12,
                color: C.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 18,
              }}
            >
              Who I Am
            </div>
            <p
              style={{
                fontSize: "clamp(15px,2vw,18px)",
                color: C.dim,
                lineHeight: 1.8,
                fontWeight: 300,
                maxWidth: 640,
              }}
            >
              8+ years engineering 0-to-1 systems across{" "}
              <span style={{ color: C.gold }}>
                React Native, AI/ML, and Web3
              </span>
              . Every architecture I build reaches production. Every team I lead
              ships. I don't just write code — I own outcomes.
            </p>
            <div
              style={{
                position: "absolute",
                bottom: -20,
                right: 24,
                fontSize: 140,
                fontWeight: 900,
                color: "rgba(201,168,76,.04)",
                lineHeight: 1,
                fontFamily: HN,
                userSelect: "none",
              }}
            >
              8+
            </div>
          </div>

          {/* Stats 2-pack — 4 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "9/13",
              gridRow: "1",
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              { n: "18+", l: "Production Apps", sub: "iOS, Android, Web" },
              { n: "50K+", l: "Active Users", sub: "Peak daily usage" },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(32px,4vw,48px)",
                    fontWeight: 900,
                    color: C.gold,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 4,
                    fontFamily: HN,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: 13, color: C.dim, fontWeight: 600 }}>
                  {s.l}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: C.vfaint,
                    fontFamily: MONO,
                    marginTop: 2,
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Approach — 5 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "1/6",
              gridRow: "2",
              border: `1px solid ${C.border}`,
              background: C.card,
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 12,
              }}
            >
              Approach
            </div>
            <p
              style={{
                fontSize: 14,
                color: C.dim,
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              I build systems that outlast the hype. Before AI could write a
              line of code, I was shipping production apps. My decisions are
              driven by outcomes, not trend cycles.
            </p>
          </div>

          {/* Location — 3 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "6/9",
              gridRow: "2",
              border: `1px solid ${C.border}`,
              background: C.card,
              padding: "28px 28px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 18,
              }}
            >
              Location
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: C.text,
                letterSpacing: "-0.02em",
                marginBottom: 8,
                fontFamily: HN,
              }}
            >
              Kolkata, India
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.green,
                  display: "inline-block",
                  animation: "ac-pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: C.green,
                  fontFamily: MONO,
                  letterSpacing: "0.12em",
                }}
              >
                Remote Worldwide
              </span>
            </div>
          </div>

          {/* Education — 4 cols */}
          <div
            className="bento-cell"
            style={{
              gridColumn: "9/13",
              gridRow: "2",
              border: `1px solid ${C.border}`,
              background: C.card,
              padding: "28px 28px",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: MONO,
                marginBottom: 18,
              }}
            >
              Education
            </div>
            {D.education.map((e, i) => (
              <div
                key={i}
                style={{
                  marginBottom: i === 0 ? 12 : 0,
                  paddingBottom: i === 0 ? 12 : 0,
                  borderBottom: i === 0 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: C.text,
                    letterSpacing: "-0.01em",
                    fontFamily: HN,
                  }}
                >
                  {e.degree}
                </div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>
                  {e.school}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: C.vfaint,
                    fontFamily: MONO,
                    marginTop: 3,
                  }}
                >
                  {e.period}
                  {e.gpa ? ` · ${e.gpa}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: PROJECTS  (PrimaryHome 3D cards)
 */
function ProjectsSection() {
  const featured = D.projects.filter((p) => p.featured);
  const rest = D.projects.filter((p) => !p.featured);
  return (
    <section id="work" style={{ padding: "120px 0", background: C.bg }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="01">Executive Portfolio</SLabel>
        <SH l1="Building systems" l2="that actually scale." />
        <p
          style={{
            fontSize: 18,
            color: C.dim,
            maxWidth: 540,
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: 60,
          }}
        >
          From AI-powered HealthTech to Indigenous community platforms. Every
          project architected to VP-level standards.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
            gap: 18,
            marginBottom: 18,
          }}
        >
          {featured.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
            gap: 14,
          }}
        >
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i + featured.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EthosSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.07);
  const ethos = D.ethos;

  return (
    <section
      id="ethos"
      ref={ref}
      style={{
        padding: "clamp(80px,10vw,140px) 0",
        position: "relative",
        overflow: "hidden",
        background: C.bg2,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-10%",
          top: "10%",
          width: "55%",
          height: "80%",
          background: `radial-gradient(ellipse at 80% 50%,${C.goldF} 0%,transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
        }}
      >
        <SLabel>What Defines Me</SLabel>

        {}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{ marginBottom: 48 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 28,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <h2
                style={{
                  fontFamily: HN,
                  fontSize: "clamp(28px,4.5vw,58px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.02,
                  marginBottom: 16,
                  color: C.text,
                }}
              >
                Skin in the game.
                <br />
                <GoldAccent>Fight till the end.</GoldAccent>
              </h2>
              <p
                style={{
                  color: C.faint,
                  fontSize: "clamp(14px,1.7vw,17px)",
                  lineHeight: 1.65,
                  maxWidth: 520,
                }}
              >
                {ethos.summary}
              </p>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: "22px 28px",
                border: `1px solid ${C.goldD}`,
                background: C.goldF,
              }}
            >
              <Badge color={C.gold}>{ethos.badge}</Badge>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: C.faint,
                  marginTop: 10,
                  letterSpacing: "0.06em",
                }}
              >
                {ethos.location}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 11, marginTop: 6 }}>
                <span style={{ color: C.green }}>● </span>
                <span style={{ color: C.green }}>{ethos.status}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 14,
            marginBottom: 48,
          }}
        >
          {ethos.metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              style={{
                border: `1px solid ${C.border}`,
                background: C.card,
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: HN,
                  fontSize: "clamp(22px,3vw,38px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: C.gold,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: C.vfaint,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </div>
              {m.unit && (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: C.vfaint,
                    letterSpacing: "0.06em",
                  }}
                >
                  {m.unit}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
            gap: 14,
            marginBottom: 56,
          }}
        >
          {ethos.principles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.07 }}
              style={{
                border: `1px solid ${C.border}`,
                background: C.card,
                padding: "22px 26px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  background: C.goldF,
                  border: `1px solid ${C.goldD}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.gold,
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>
                  {p.label}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: C.faint,
                    letterSpacing: "0.05em",
                    lineHeight: 1.5,
                  }}
                >
                  {p.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.5 }}
        >
          <div
            style={{
              padding: "clamp(32px,5vw,56px)",
              background: `linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02))`,
              border: `1px solid ${C.goldD}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -30,
                left: 24,
                fontSize: 180,
                lineHeight: 1,
                color: C.goldD,
                fontFamily: HN,
                fontWeight: 900,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              "
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: C.gold,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                — The Founder Mindset.
              </div>
              <p
                style={{
                  fontSize: "clamp(15px,1.9vw,18px)",
                  lineHeight: 1.82,
                  color: C.dim,
                  fontStyle: "italic",
                  maxWidth: 780,
                }}
              >
                {ethos.story}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Technical highlights */}
        <div style={{ marginTop: 40 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: C.gold,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            How I Operate
          </div>
          {ethos.highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "18px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: C.gold,
                  flexShrink: 0,
                  marginTop: 2,
                  letterSpacing: "0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              <p style={{ color: C.faint, fontSize: 14, lineHeight: 1.65 }}>
                {h}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* 
   ██  SECTION: EXPERIENCE  (PrimaryHome style + Doc2 accordion)
 */
function ExperienceSection() {
  const expRef = useRef<HTMLElement>(null);
  const visible = useInView(expRef as React.RefObject<Element>, 0.08);
  const [expanded, setExpanded] = useState<string | null>("synapsis");
  const [hovExp, setHovExp] = useState<number | null>(null);

  return (
    <section
      ref={expRef}
      id="experience"
      style={{ padding: "120px 0", background: C.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="02">Career Timeline</SLabel>
        <SH l1="3 companies." l2="8+ years. Zero shortcuts." />

        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 8,
              width: 1,
              height: "100%",
              background: `linear-gradient(180deg,${C.gold},${C.border} 70%,transparent)`,
            }}
          />

          {D.experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -36 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.14, ease: EASE_X }}
              onMouseEnter={() => setHovExp(i)}
              onMouseLeave={() => setHovExp(null)}
              style={{
                paddingLeft: 56,
                marginBottom: 24,
                position: "relative",
                transition: "background .3s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 13,
                  top: 28,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `2px solid ${exp.color}`,
                  background: expanded === exp.id ? exp.color : C.bg,
                  transition: "background .3s",
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  border: `1px solid ${expanded === exp.id ? exp.color + "44" : C.border}`,
                  background: C.card,
                  overflow: "hidden",
                  transition: "border-color .4s",
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              >
                {/* Header row */}
                <div
                  style={{
                    padding: "clamp(20px,3vw,28px)",
                    display: "flex",
                    gap: 20,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Badge color={exp.color}>{exp.badge}</Badge>
                      <Badge color={exp.color}>{exp.type}</Badge>
                      {exp.status === "Delivered & Closed" && (
                        <Badge color={C.green}>{exp.status}</Badge>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: "clamp(18px,2.5vw,24px)",
                        fontWeight: 800,
                        marginBottom: 6,
                        letterSpacing: "-0.025em",
                        fontFamily: HN,
                        color: hovExp === i ? C.gold : C.text,
                        transition: "color .25s",
                      }}
                    >
                      {exp.company}
                    </h3>
                    <div
                      style={{ color: C.faint, fontSize: 14, marginBottom: 8 }}
                    >
                      {exp.role}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 10,
                        color: C.vfaint,
                        display: "flex",
                        gap: 14,
                        flexWrap: "wrap",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <span>{exp.period}</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      color: expanded === exp.id ? C.gold : C.faint,
                      transform:
                        expanded === exp.id ? "rotate(45deg)" : "rotate(0)",
                      transition: "transform .3s,color .3s",
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    +
                  </div>
                </div>

                {/* Expanded content */}
                {expanded === exp.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      style={{
                        padding: `0 clamp(20px,3vw,28px) clamp(20px,3vw,28px)`,
                        borderTop: `1px solid ${C.border}`,
                        paddingTop: 20,
                      }}
                    >
                      {/* Metrics */}
                      {exp.metrics.length > 0 && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit,minmax(110px,1fr))",
                            gap: 10,
                            marginBottom: 20,
                          }}
                        >
                          {exp.metrics.map((m, mi) => (
                            <div
                              key={mi}
                              style={{
                                padding: "12px 16px",
                                background: `${exp.color}10`,
                                border: `1px solid ${exp.color}22`,
                                textAlign: "center",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 18,
                                  fontWeight: 800,
                                  color: exp.color,
                                  fontFamily: HN,
                                }}
                              >
                                {m.value}{" "}
                                <span style={{ fontSize: 11 }}>{m.unit}</span>
                              </div>
                              <div
                                style={{
                                  fontFamily: MONO,
                                  fontSize: 9,
                                  color: C.vfaint,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  marginTop: 4,
                                }}
                              >
                                {m.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Highlights */}
                      {exp.highlights.map((pt, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                            marginBottom: 14,
                          }}
                        >
                          <span
                            style={{
                              color: exp.color,
                              flexShrink: 0,
                              fontSize: 10,
                              marginTop: 2,
                            }}
                          >
                            →
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: C.dim,
                              lineHeight: 1.7,
                              fontWeight: 300,
                            }}
                          >
                            {pt}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: SKILLS  (PrimaryHome tabs + Doc2 progress bars)
 */
function SkillsSection() {
  const skillsRef = useRef<HTMLElement>(null);
  const visible = useInView(skillsRef as React.RefObject<Element>, 0.1);
  const [skillTab, setSkillTab] = useState(0);
  const [barsOn, setBarsOn] = useState(false);

  useEffect(() => {
    if (visible) setBarsOn(true);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    gsap.fromTo(
      ".skill-item",
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.04,
        duration: 0.5,
        ease: "back.out(1.4)",
      },
    );
  }, [skillTab, visible]);

  const cat = D.skills[skillTab];

  return (
    <section
      ref={skillsRef}
      id="skills"
      style={{ padding: "120px 0", background: C.bg2 }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="03">Technical Arsenal</SLabel>
        <SH l1="Deep stack." l2="Not full stack." />

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 32,
          }}
        >
          {D.skills.map((s, i) => (
            <motion.button
              key={s.cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSkillTab(i)}
              style={{
                padding: "9px 18px",
                fontSize: 9,
                fontFamily: MONO,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                background: skillTab === i ? cat.color : "transparent",
                color: skillTab === i ? "#000" : C.faint,
                border: `1px solid ${skillTab === i ? cat.color : C.border}`,
                fontWeight: skillTab === i ? 700 : 400,
                transition: "all .2s",
              }}
            >
              {s.cat}
            </motion.button>
          ))}
        </div>

        {/* Skill items with progress bars */}
        <AnimatePresence mode="wait">
          <motion.div
            key={skillTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 10,
            }}
          >
            {cat.items.map((sk, i) => (
              <motion.div
                key={sk.name}
                className="skill-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  padding: "16px 20px",
                  border: `1px solid ${C.border}`,
                  background: C.card,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 13, color: C.dim, fontWeight: 400 }}>
                    {sk.name}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: cat.color,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {sk.level}%
                  </span>
                </div>
                <div
                  style={{ height: 3, background: C.ghost, overflow: "hidden" }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={
                      barsOn ? { scaleX: sk.level / 100 } : { scaleX: 0 }
                    }
                    transition={{
                      duration: 1,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                    style={{
                      height: "100%",
                      background: cat.color,
                      transformOrigin: "left",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: STORY TIMELINE  (PrimaryHome alternating layout)
 */
function StorySection() {
  const storyRef = useRef<HTMLElement>(null);
  const visible = useInView(storyRef as React.RefObject<Element>, 0.1);

  return (
    <section
      ref={storyRef}
      id="story"
      style={{ padding: "120px 0", background: C.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel num="04">Eight Years. No Shortcuts.</SLabel>
        <SH l1="From government portals" l2="to AI-powered systems." />
        <div style={{ position: "relative" }}>
          <div
            className="story-spine"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 1,
              background: `linear-gradient(to bottom,transparent,${C.goldD},transparent)`,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
            {D.story.map((ch, i) => (
              <motion.div
                key={ch.yr}
                className="story-item"
                initial={{ opacity: 0, y: 40 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.72, delay: i * 0.1, ease: EASE_X }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 48,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    textAlign: i % 2 === 0 ? "right" : "left",
                    order: i % 2 === 0 ? 1 : 2,
                    paddingRight: i % 2 === 0 ? 36 : 0,
                    paddingLeft: i % 2 !== 0 ? 36 : 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      color: "rgba(201,168,76,.06)",
                      fontFamily: MONO,
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {ch.yr}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: ch.color,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {ch.icon} — {ch.yr}
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: C.text,
                      marginBottom: 10,
                      letterSpacing: "-0.02em",
                      fontFamily: HN,
                    }}
                  >
                    {ch.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.dim,
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {ch.text}
                  </p>
                </div>
                <div
                  style={{ order: i % 2 === 0 ? 2 : 1, position: "relative" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={visible ? { scale: 1 } : {}}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: i * 0.1 + 0.1,
                    }}
                    style={{
                      position: "absolute",
                      left: i % 2 === 0 ? -9 : "auto",
                      right: i % 2 !== 0 ? -9 : "auto",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: ch.color,
                      border: `3px solid ${C.bg}`,
                      zIndex: 10,
                      boxShadow: `0 0 12px ${ch.color}80`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: GITHUB CONTRIB  (PrimaryHome enhanced)
 */
function GitHubSection() {
  return (
    <section id="github" style={{ padding: "80px 0", background: C.bg2 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel>Open Source</SLabel>
        <SH
          l1="Shipping code."
          l2="Every. Single. Day."
          size="clamp(32px,4vw,56px)"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            padding: 28,
            border: `1px solid rgba(201,168,76,.15)`,
            background: "rgba(201,168,76,.025)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(201,168,76,.7)",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  marginBottom: 4,
                }}
              >
                GitHub Activity
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: C.text,
                  letterSpacing: "-0.03em",
                  fontFamily: HN,
                }}
              >
                2,029 <span style={{ color: C.gold }}>contributions</span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.vfaint,
                  marginTop: 3,
                  fontFamily: MONO,
                }}
              >
                Last 12 months · Mostly private repos
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { l: "Primary", u: D.github, s: "devamitch" },
                { l: "Archive", u: D.githubAlt, s: "techamit95ch" },
              ].map((g) => (
                <a
                  key={g.u}
                  href={g.u}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${C.border}`,
                    textDecoration: "none",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = C.goldD)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = C.border)
                  }
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                    {g.l}
                  </div>
                  <div
                    style={{ fontSize: 9, fontFamily: MONO, color: C.vfaint }}
                  >
                    {g.s} ↗
                  </div>
                </a>
              ))}
            </div>
          </div>
          <ContribGraph />
        </motion.div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: TESTIMONIALS  (all 4, TiltCard + PrimaryHome styling)
 */
function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: "120px 0", background: C.bg }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <SLabel>What Leaders Say</SLabel>
        <SH l1="Leaders endorse me." l2="Teams grow under me." />
        <p
          style={{
            fontSize: 13,
            color: C.dim,
            marginBottom: 56,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          Ordered by seniority — from direct manager to mentored developers.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 18,
          }}
        >
          {D.testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard style={{ height: "100%", position: "relative" }}>
                <div
                  style={{
                    padding: 32,
                    border: `1px solid ${C.border}`,
                    background: C.card,
                    position: "relative",
                    overflow: "hidden",
                    borderTop: `3px solid ${t.col}`,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 20,
                    }}
                  >
                    <Badge color={t.col}>{t.seniority}</Badge>
                    <span
                      style={{ fontFamily: MONO, fontSize: 9, color: C.vfaint }}
                    >
                      {t.date}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 56,
                      color: "rgba(255,255,255,.035)",
                      position: "absolute",
                      top: 18,
                      right: 22,
                      lineHeight: 1,
                      fontFamily: "Georgia",
                      userSelect: "none",
                    }}
                  >
                    "
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: C.dim,
                      lineHeight: 1.85,
                      fontWeight: 300,
                      marginBottom: 24,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: `${t.col}18`,
                        border: `1px solid ${t.col}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{ fontSize: 18, fontWeight: 700, color: t.col }}
                      >
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <a
                        href={t.li}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.text,
                          textDecoration: "none",
                          transition: "color .2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = C.gold)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = C.text)
                        }
                      >
                        {t.name}
                      </a>
                      <div
                        style={{ fontSize: 10, color: C.faint, marginTop: 2 }}
                      >
                        {t.role}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: t.col,
                          fontFamily: MONO,
                          marginTop: 3,
                          opacity: 0.85,
                        }}
                      >
                        {t.rel} · {t.company}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);

  return (
    <section
      id="services"
      ref={ref}
      style={{
        padding: "clamp(80px,10vw,140px) 0",
        position: "relative",
        overflow: "hidden",
        background: C.bg2,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 100%,${C.goldF} 0%,transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
        }}
      >
        <SLabel num="05">Work With Me</SLabel>
        <SH l1="Turn vision" l2="into reality." />
        <p
          style={{
            fontSize: 18,
            color: C.dim,
            maxWidth: 540,
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: 60,
          }}
        >
          Whether you have a raw idea, need an expert review, or want a complete
          build — here's how we work together.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          {D.services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 52 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.72, delay: i * 0.13, ease: EASE_X }}
            >
              <motion.div
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,76,.15)",
                }}
                transition={{ duration: 0.4 }}
                style={{
                  padding: "clamp(28px,4vw,40px)",
                  border: `1px solid ${svc.color}28`,
                  background: C.card,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow .4s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: svc.color,
                  }}
                />
                <div
                  style={{
                    fontSize: 28,
                    color: svc.color,
                    marginBottom: 20,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {svc.icon}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      fontSize: "clamp(20px,2.8vw,27px)",
                      fontWeight: 800,
                      letterSpacing: "-0.025em",
                      marginBottom: 6,
                      fontFamily: HN,
                    }}
                  >
                    {svc.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: svc.color,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {svc.sub}
                  </div>
                </div>
                <div style={{ flex: 1, marginBottom: 28 }}>
                  {svc.items.map((item, ii) => (
                    <div
                      key={ii}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        padding: "10px 0",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <span
                        style={{
                          color: svc.color,
                          flexShrink: 0,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        →
                      </span>
                      <span
                        style={{
                          color: C.faint,
                          fontSize: 14,
                          lineHeight: 1.4,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${svc.color}22`,
                    paddingTop: 22,
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(18px,2.4vw,22px)",
                      fontWeight: 800,
                      color: svc.color,
                      marginBottom: 4,
                    }}
                  >
                    {svc.price}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: C.vfaint,
                      letterSpacing: "0.06em",
                      marginBottom: 16,
                    }}
                  >
                    {svc.note}
                  </div>
                  <a
                    href={svc.href}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "13px",
                      background: `${svc.color}18`,
                      border: `1px solid ${svc.color}44`,
                      color: svc.color,
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                      fontFamily: HN,
                      transition: "background .22s,transform .22s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        `${svc.color}30`;
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        `${svc.color}18`;
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    {svc.cta}
                  </a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: PITCH YOUR IDEA  (from Doc2)
 */
function PitchSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);
  const benefits = [
    {
      icon: "◈",
      title: "Technical Feasibility",
      desc: "I'll tell you if it's buildable — and exactly how.",
    },
    {
      icon: "◉",
      title: "MVP Scope Definition",
      desc: "The minimum version that proves the concept.",
    },
    {
      icon: "◆",
      title: "Clear Cost Estimate",
      desc: "Timeline, stack, and budget — no surprises.",
    },
    {
      icon: "●",
      title: "Honest Assessment",
      desc: "If it won't work, I'll tell you. If it will, I'll show you how.",
    },
  ];
  return (
    <section
      id="pitch"
      ref={ref}
      style={{ padding: "clamp(80px,10vw,140px) 0", background: C.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "clamp(40px,6vw,100px)",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75 }}
          >
            <SLabel num="06">Pitch Your Idea</SLabel>
            <h2
              style={{
                fontFamily: HN,
                fontSize: "clamp(30px,4.5vw,54px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              You have a vision.
              <br />
              <GoldAccent>Let&apos;s make it real.</GoldAccent>
            </h2>
            <p
              style={{
                color: C.faint,
                fontSize: 15,
                lineHeight: 1.72,
                marginBottom: 32,
              }}
            >
              Share your concept — rough or refined. I evaluate technical
              feasibility, define the MVP scope, and give you a clear path
              forward. No jargon. No gatekeeping. Just clarity.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 28,
              }}
            >
              {benefits.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 18px",
                    border: `1px solid ${C.border}`,
                    background: C.card,
                  }}
                >
                  <div
                    style={{
                      color: C.gold,
                      fontSize: 18,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <div
                      style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}
                    >
                      {b.title}
                    </div>
                    <div style={{ color: C.faint, fontSize: 13 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "16px 20px",
                border: `1px solid ${C.goldD}`,
                background: C.goldF,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: C.gold,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Zero risk
              </div>
              <p style={{ color: C.faint, fontSize: 13, lineHeight: 1.65 }}>
                Pitching is always free. I'll review your idea and respond with
                honest feedback within 48 hours. No commitment required.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.12 }}
          >
            <div
              style={{
                padding: "clamp(28px,4vw,44px)",
                border: `1px solid ${C.goldD}`,
                background: C.card,
              }}
            >
              <PitchForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: PROCESS  (from Doc2)
 */
function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);
  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(80px,10vw,140px) 0",
        background: C.bg2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 50%,${C.goldF} 0%,transparent 80%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
        }}
      >
        <SLabel num="07">How I Work</SLabel>
        <SH l1="The process." l2="No black boxes." />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {D.process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.09, ease: EASE_X }}
            >
              <div
                style={{
                  padding: "clamp(24px,3vw,36px)",
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 16,
                    fontSize: 80,
                    fontFamily: HN,
                    fontWeight: 900,
                    color: `${step.color}0C`,
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.step}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: step.color,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  Step {step.step} · {step.duration}
                </div>
                <h3
                  style={{
                    fontSize: "clamp(18px,2.2vw,22px)",
                    fontWeight: 800,
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                    fontFamily: HN,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: C.faint, fontSize: 14, lineHeight: 1.7 }}>
                  {step.desc}
                </p>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg,transparent,${step.color}44,transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: FAQ  (from Doc2, PrimaryHome styling)
 */
function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref as React.RefObject<Element>, 0.1);
  const [open, setOpen] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  const cats = ["All", ...Array.from(new Set(D.faqs.map((f) => f.cat)))];
  const filtered =
    filterCat === "All" ? D.faqs : D.faqs.filter((f) => f.cat === filterCat);

  return (
    <section
      id="faq"
      ref={ref}
      style={{ padding: "clamp(80px,10vw,140px) 0", background: C.bg }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.8fr",
            gap: "clamp(40px,6vw,100px)",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left sticky */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.72 }}
            style={{ position: "sticky", top: 120 }}
          >
            <SLabel num="08">FAQ</SLabel>
            <h2
              style={{
                fontFamily: HN,
                fontSize: "clamp(28px,4vw,50px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Questions
              <br />
              <GoldAccent>answered.</GoldAccent>
            </h2>
            <p
              style={{
                color: C.faint,
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Everything you might want to know before reaching out. If your
              question isn't here, just ask directly.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 28,
              }}
            >
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCat(cat);
                    setOpen(null);
                  }}
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${filterCat === cat ? C.gold : C.border}`,
                    background: filterCat === cat ? C.goldF : "transparent",
                    color: filterCat === cat ? C.gold : C.faint,
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    transition: "all .2s",
                    textTransform: "uppercase",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                border: `1px solid ${C.goldD}`,
                color: C.gold,
                textDecoration: "none",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.14em",
                transition: "background .2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = C.goldF)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "transparent")
              }
            >
              Contact me →
            </a>
          </motion.div>

          {/* Right: accordion */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={filterCat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {filtered.map((faq, i) => (
                  <motion.div
                    key={`${filterCat}-${i}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.04 + i * 0.04 }}
                    style={{ borderBottom: `1px solid ${C.border}` }}
                  >
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "20px 0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        gap: 16,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "clamp(14px,1.7vw,16px)",
                          color: open === i ? C.gold : C.text,
                          fontWeight: open === i ? 600 : 400,
                          transition: "color .2s",
                          lineHeight: 1.45,
                          flex: 1,
                          fontFamily: HN,
                        }}
                      >
                        {faq.q}
                      </span>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: `1px solid ${open === i ? C.gold : C.border}`,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all .3s",
                          transform: open === i ? "rotate(45deg)" : "rotate(0)",
                          color: open === i ? C.gold : C.faint,
                          fontSize: 16,
                          marginTop: 2,
                        }}
                      >
                        +
                      </div>
                    </button>
                    <AnimatePresence>
                      {open === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              paddingBottom: 20,
                            }}
                          >
                            <Badge color={C.gold}>{faq.cat}</Badge>
                            <p
                              style={{
                                color: C.faint,
                                fontSize: 14,
                                lineHeight: 1.72,
                              }}
                            >
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: BLOG
 */
function BlogSection() {
  return (
    <section id="blog" style={{ padding: "80px 0", background: C.bg2 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "clamp(40px,6vw,64px)",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <SLabel num="09">Writing & Thoughts</SLabel>
            <SH
              l1="I think in systems."
              l2="I write in posts."
              size="clamp(32px,4vw,54px)"
            />
          </div>
          <a
            href={D.medium}
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: C.gold,
              textDecoration: "none",
              letterSpacing: "0.14em",
              borderBottom: `1px solid ${C.goldD}`,
              paddingBottom: 2,
              whiteSpace: "nowrap",
            }}
          >
            ALL ARTICLES ↗
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 14,
          }}
        >
          {D.blogs.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Made the entire card a clickable link */}
              <a
                href={post.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: 28,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  height: "100%",
                  cursor: "pointer",
                  borderTop: `2px solid ${post.color}33`,
                  transition: "border-color .25s, transform .25s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.goldD;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <Badge color={post.color}>{post.cat}</Badge>
                  <span
                    style={{ fontFamily: MONO, fontSize: 9, color: C.vfaint }}
                  >
                    {post.date}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.text,
                    lineHeight: 1.35,
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: C.dim,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    marginBottom: 18,
                  }}
                >
                  {post.teaser}
                </p>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(201,168,76,.55)",
                    fontFamily: MONO,
                  }}
                >
                  Read Article →
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 
   ██  SECTION: CONTACT  (PrimaryHome form + meeting tab)
 */
function ContactSection() {
  const [ctab, setCtab] = useState<"message" | "meeting">("message");
  return (
    <section id="contact" style={{ padding: "120px 0", background: C.bg }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 72,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Left contact info */}
          <div>
            <SLabel num="10">Let's Connect</SLabel>
            <h2
              style={{
                fontSize: "clamp(32px,4.5vw,60px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: C.text,
                lineHeight: 0.9,
                marginBottom: 24,
                fontFamily: HN,
              }}
            >
              Ready to build
              <br />
              <span
                style={{
                  WebkitTextStroke: `2px ${C.goldD}`,
                  color: "transparent",
                }}
              >
                something great.
              </span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: C.dim,
                lineHeight: 1.75,
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              VP Engineering. CTO. Principal Architect. I build systems that
              scale, lead teams that ship, and turn technical vision into
              business reality.
            </p>
            {[
              { l: "Email", v: D.email, h: `mailto:${D.email}` },
              { l: "Phone", v: D.phone, h: `tel:${D.phone}` },
              { l: "LinkedIn", v: "linkedin.com/in/devamitch", h: D.linkedin },
              { l: "GitHub", v: "github.com/devamitch", h: D.github },
              { l: "Medium", v: "devamitch.medium.com", h: D.medium },
            ].map((link) => (
              <a
                key={link.l}
                href={link.h}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBlock: 14,
                  borderBottom: `1px solid ${C.border}`,
                  textDecoration: "none",
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderBottomColor = C.goldD)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderBottomColor = C.border)
                }
              >
                <span
                  style={{
                    fontSize: 9,
                    color: C.vfaint,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                  }}
                >
                  {link.l}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: C.faint,
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
                >
                  {link.v} ↗
                </span>
              </a>
            ))}
          </div>

          {/* Right: tab form */}
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[
                { k: "message" as const, label: "Send Message" },
                { k: "meeting" as const, label: "Book Meeting" },
              ].map((tab) => (
                <motion.button
                  key={tab.k}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setCtab(tab.k)}
                  style={{
                    flex: 1,
                    padding: "13px 18px",
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    background:
                      ctab === tab.k ? C.gold : "rgba(255,255,255,.02)",
                    color: ctab === tab.k ? "#000" : C.faint,
                    border: `1px solid ${ctab === tab.k ? C.gold : C.border}`,
                    fontWeight: ctab === tab.k ? 700 : 400,
                    transition: "all .3s",
                  }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {ctab === "message" ? (
                <motion.div
                  key="msg"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContactForm />
                </motion.div>
              ) : (
                <motion.div
                  key="meet"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <MeetingScheduler />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 
   ██  FOOTER  (enhanced from Doc2, PrimaryHome style)
 */
function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "pending" | "done">(
    "idle",
  );
  const year = new Date().getFullYear();

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("pending");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus("done");
      setEmail("");
    } catch {
      setSubStatus("done");
    }
  };

  const cols = {
    Navigate: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Skills", href: "#skills" },
      { label: "Story", href: "#story" },
      { label: "Blog", href: "#blog" },
    ],
    Services: [
      { label: "Pitch Your Idea", href: "#pitch" },
      { label: "Consulting", href: "#services" },
      { label: "End-to-End Build", href: "#services" },
      { label: "Book a Meeting", href: "#contact" },
      { label: "FAQ", href: "#faq" },
    ],
    Connect: [
      { label: "LinkedIn", href: D.linkedin },
      { label: "X", href: D.twitter },
      { label: "GitHub", href: D.github },
      { label: "Medium", href: D.medium },
      { label: "Email", href: `mailto:${D.email}` },
    ],
  };

  const footerStats = [
    { l: "Years", v: "8+" },
    { l: "Apps Shipped", v: "18+" },
    { l: "Active Users", v: "50K+" },
    { l: "Engineers Led", v: "21" },
    { l: "Contributions", v: "2,029" },
    { l: "Location", v: "Kolkata" },
  ];

  return (
    <footer
      style={{
        padding: "clamp(60px,9vw,110px) 0 0",
        borderTop: `1px solid ${C.border}`,
        background: C.bg,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr repeat(3,1fr)",
            gap: "clamp(28px,4vw,56px)",
            marginBottom: "clamp(48px,7vw,80px)",
            alignItems: "start",
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div>
            <div
              style={{
                fontFamily: HN,
                fontSize: "clamp(20px,2.5vw,28px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                marginBottom: 12,
              }}
            >
              <span style={{ color: C.gold }}>{D.nameFirst[0]}</span>C
              <span style={{ color: "rgba(201,168,76,.4)" }}>.</span>
            </div>
            <p
              style={{
                color: C.faint,
                fontSize: 13,
                lineHeight: 1.7,
                marginBottom: 24,
                maxWidth: 280,
              }}
            >
              Principal Architect. 0-to-1 builder. Eight years. Eighteen apps.
              Zero shortcuts.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
              {[
                { href: D.linkedin, label: "Li" },
                { href: D.github, label: "GH" },
                { href: D.medium, label: "Me" },
                { href: `mailto:${D.email}`, label: "@" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 34,
                    height: 34,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.faint,
                    fontFamily: MONO,
                    fontSize: 9,
                    textDecoration: "none",
                    transition: "all .22s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = C.goldD;
                    el.style.color = C.gold;
                    el.style.background = C.goldF;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = C.border;
                    el.style.color = C.faint;
                    el.style.background = "transparent";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
            {/* Newsletter */}
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: C.gold,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Newsletter
              </div>
              <p
                style={{
                  color: C.vfaint,
                  fontSize: 12,
                  lineHeight: 1.65,
                  marginBottom: 14,
                  maxWidth: 280,
                }}
              >
                Architecture insights, engineering essays, real-world lessons.
                No spam. Ever.
              </p>
              {subStatus === "done" ? (
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: C.green,
                    letterSpacing: "0.1em",
                  }}
                >
                  You're subscribed.
                </div>
              ) : (
                <form onSubmit={handleSub} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    style={{
                      flex: 1,
                      background: C.ghost,
                      border: `1px solid ${C.border}`,
                      padding: "9px 12px",
                      color: C.text,
                      fontSize: 13,
                      fontFamily: HN,
                      outline: "none",
                      minWidth: 0,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={subStatus === "pending"}
                    style={{
                      padding: "9px 16px",
                      background: C.goldG,
                      border: "none",
                      color: "#000",
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: HN,
                    }}
                  >
                    {subStatus === "pending" ? "..." : "Join"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {(
            Object.entries(cols) as [
              string,
              { label: string; href: string }[],
            ][]
          ).map(([col, links]) => (
            <div key={col}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  color: C.gold,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {col}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 11 }}
              >
                {links.map((l, i) => (
                  <a
                    key={i}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{
                      color: C.faint,
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "color .2s",
                      fontFamily: HN,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = C.text)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = C.faint)
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            padding: "clamp(28px,4vw,44px) 0",
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))",
            gap: "clamp(16px,3vw,28px)",
            marginBottom: "clamp(24px,4vw,40px)",
            textAlign: "center",
          }}
        >
          {footerStats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: HN,
                  fontSize: "clamp(20px,3vw,32px)",
                  fontWeight: 900,
                  color: C.gold,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  color: C.vfaint,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: "clamp(16px,3vw,24px) 0 clamp(32px,5vw,60px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: 9,
              color: C.ghost,
              fontFamily: MONO,
              letterSpacing: "0.12em",
            }}
          >
            © {year} Amit Chakraborty · Built by hand. Not by prompt.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["LinkedIn", D.linkedin],
              ["GitHub", D.github],
              ["Medium", D.medium],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 10,
                  fontFamily: MONO,
                  letterSpacing: "0.15em",
                  color: C.vfaint,
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = C.gold)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = C.vfaint)
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* 
   ██  ROOT: PRIMARY HOME  (full assembly)
 */
export default function PrimaryHome() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  const [roleIdx, setRoleIdx] = useState(0);
  const scrambled = useScramble(D.tagline);

  const [bmcOpen, setBmcOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % D.roles.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  /* GSAP scroll effects */
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".gsap-grid", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: ".gsap-grid",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.fromTo(
        ".bento-cell",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".exp-row",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: expRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".story-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.18,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: storyRef.current, start: "top 75%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.4 && !autoOpened && !bmcOpen) {
        setAutoOpened(true);
        setBmcOpen(true);
      }
    });
  }, [autoOpened, bmcOpen, scrollYProgress]);

  return (
    <>
      {/* ── Hidden SEO structured data ── */}
      <div aria-hidden style={{ display: "none" }}>
        <span itemScope itemType="https://schema.org/Person">
          <span itemProp="name">Amit Chakraborty</span>
          <span itemProp="jobTitle">Principal Mobile Architect</span>
          <span itemProp="url">https://devamit.co.in</span>
          <span itemProp="email">{D.email}</span>
          <span itemProp="addressLocality">Kolkata</span>
          <span itemProp="addressCountry">India</span>
        </span>
      </div>
      {}
      <ScrollProgressBar />
      <main
        style={{
          fontFamily: HN,
          background: C.bg,
          color: C.text,
          overflowX: "hidden",
        }}
      >
        <div className="noise-overlay" />

        {}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {[
            { x: "5%", y: "10%", s: 500, d: 0 },
            { x: "72%", y: "50%", s: 350, d: 4 },
            { x: "40%", y: "85%", s: 280, d: 8 },
          ].map((o, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.85, 0.4] }}
              transition={{
                duration: 9 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: o.d,
              }}
              style={{
                position: "absolute",
                left: o.x,
                top: o.y,
                width: o.s,
                height: o.s,
                background:
                  "radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)",
                filter: "blur(80px)",
                borderRadius: "50%",
              }}
            />
          ))}
        </div>

        {}
        <div ref={heroRef as React.RefObject<HTMLDivElement>}>
          <HeroSection roleIdx={roleIdx} scrambled={scrambled} />
        </div>

        <MarqueeSection />

        <div ref={aboutRef as React.RefObject<HTMLDivElement>}>
          <AboutSection />
        </div>

        <ProjectsSection />

        <Div />

        <EthosSection />

        <Div />

        <div ref={expRef as React.RefObject<HTMLDivElement>}>
          <ExperienceSection />
        </div>

        <Div />

        <div ref={skillsRef as React.RefObject<HTMLDivElement>}>
          <SkillsSection />
        </div>

        <Div />

        <div ref={storyRef as React.RefObject<HTMLDivElement>}>
          <StorySection />
        </div>

        <GitHubSection />

        <Div />

        <TestimonialsSection />

        <Div />

        <ServicesSection />

        <PitchSection />

        <ProcessSection />

        <FAQSection />

        <BlogSection />

        <Div />

        <ContactSection />

        <Footer />
      </main>
      {}
      <MobileNav />
      <BuyCoffeePill onOpen={() => setBmcOpen(true)} />
      <AnimatePresence>
        {bmcOpen && (
          <BuyCoffeeModal open={bmcOpen} onClose={() => setBmcOpen(false)} />
        )}
      </AnimatePresence>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { overflow-x: hidden; }

        /* ── Pulse animation ── */
        @keyframes ac-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(201,168,76,0.5); }
          50%      { opacity:0.4; box-shadow:0 0 0 7px rgba(201,168,76,0); }
        }

        /* ── Marquee ── */
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── Noise overlay ── */
        .noise-overlay {
          position:fixed; inset:0; z-index:1; pointer-events:none; opacity:0.026;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.35); border-radius:2px; }
        ::-webkit-scrollbar-thumb:hover { background:rgba(201,168,76,0.6); }

        /* ── Selection ── */
        ::selection { background:rgba(201,168,76,0.22); color:#fff; }

        /* ── Hero responsive ── */
        .hero-grid { grid-template-columns:1.15fr .85fr; }
        @media (max-width:960px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-photo { display:none !important; }
        }

        /* ── Stats grid responsive ── */
        .stats-grid { grid-template-columns:repeat(4,1fr); }
        @media (max-width:680px) { .stats-grid { grid-template-columns:repeat(2,1fr) !important; } }

        /* ── Bento grid responsive ── */
        @media (max-width:900px) {
          .bento-outer { grid-template-columns:1fr !important; }
          .bento-outer > * { grid-column:1 / -1 !important; grid-row:auto !important; }
        }

        /* ── Story spine ── */
        @media (max-width:860px) {
          .story-spine { display:none !important; }
          .story-item { grid-template-columns:1fr !important; }
          .story-item > div:nth-child(2) { display:none !important; }
          .story-item > div:nth-child(1) { text-align:left !important; order:1 !important; padding:0 !important; }
        }

        /* ── Contact / FAQ two-col ── */
        .contact-grid { grid-template-columns:1fr 1.3fr; }
        @media (max-width:860px) { .contact-grid { grid-template-columns:1fr !important; } }

        /* ── Footer grid ── */
        .footer-grid { grid-template-columns:1.6fr repeat(3,1fr); }
        @media (max-width:960px) { .footer-grid { grid-template-columns:1fr 1fr !important; } }
        @media (max-width:640px) { .footer-grid { grid-template-columns:1fr !important; } }

        /* ── Form 2-col ── */
        .form2col { grid-template-columns:1fr 1fr; }
        @media (max-width:540px) { .form2col { grid-template-columns:1fr !important; } }

        /* ── Mobile nav ── */
        @media (max-width:640px) { .mobile-nav { display:flex !important; } }

        /* ── Mobile bottom padding ── */
        @media (max-width:640px) { main { padding-bottom:72px; } }
      `}</style>
    </>
  );
}
