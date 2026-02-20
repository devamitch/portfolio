"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import ImageWithFallback from "./ImageWithFallback";
import MeetingScheduler from "./MeetingScheduler";

gsap.registerPlugin(ScrollTrigger);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  COMBINED DATA (merged from both portfolios)                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DATA = {
  // ─── Identity ───────────────────────────────────────────────
  name: "Amit Chakraborty",
  nameFirst: "Amit",
  nameLast: "Chakraborty",
  title: "Principal Architect\n& Founding Engineer",
  titleFlat: "Principal Mobile Architect · VP Engineering",
  tagline: "I build systems that ship.",
  manifesto: [
    "Before AI could write a line of code, I was building production systems.",
    "16+ apps shipped. 50K+ real users. Zero outsourced decisions.",
    "I architect systems that outlast the hype.",
  ],
  roles: ["VP Engineering", "Principal Architect", "CTO", "Technical Lead"],
  subtitle:
    "8+ years engineering 0-to-1 systems across React Native, AI/ML, and Web3. Every architecture I build reaches production.",
  location: "Kolkata, India",
  availability: "Remote Worldwide",
  started: "2017-05-01",

  // ─── Contact ─────────────────────────────────────────────────
  email: "amit98ch@gmail.com",
  phone: "+91-9874173663",
  website: "devamit.co.in",
  github: "https://github.com/devamitch",
  githubAlt: "https://github.com/techamit95ch",
  linkedin: "https://linkedin.com/in/devamitch",
  medium: "https://devamitch.medium.com/",

  // ─── Images ──────────────────────────────────────────────────
  profileImage: "/images/amit-profile.jpg",
  profileFallback: "https://github.com/devamitch.png",

  // ─── Stats ───────────────────────────────────────────────────
  stats: [
    { value: "8+", label: "Years", suffix: "Experience" },
    { value: "16+", label: "Apps", suffix: "Shipped" },
    { value: "50K+", label: "Users", suffix: "Served" },
    { value: "99.9%", label: "Uptime", suffix: "Delivered" },
  ],

  // ─── Experience ──────────────────────────────────────────────
  experience: [
    {
      company: "Synapsis Medical Technologies",
      role: "Principal Mobile Architect & Technical Lead",
      location: "Edmonton, Canada (Remote)",
      period: "Jan 2025 — Feb 2026",
      type: "Contract",
      color: "#C9A84C",
      highlights: [
        "Led engineering team of 21+ developers across 5 production iOS + Android apps",
        "Built game engine from scratch — C++/Swift/Kotlin bridgeless modules",
        "Architected HIPAA-compliant RAG pipelines for medical data retrieval, 99.9% uptime",
        "Computer Vision: MediaPipe for real-time retina analysis on mobile",
        "Reduced deployment time 30% via CI/CD; recruited & trained 21-person team",
      ],
    },
    {
      company: "NonceBlox Pvt. Ltd.",
      role: "Lead Mobile Architect & Senior Full-Stack",
      location: "Dubai (Remote)",
      period: "Oct 2021 — Jan 2025",
      type: "Full-time",
      color: "#F5C842",
      highlights: [
        "Shipped 13+ production apps across FinTech, Web3, and Gaming",
        "Architected apps serving 50,000+ active users across iOS and Android",
        "Web3/DeFi: Memr (Wallet whaling/staking), DeFi11 (Smart contracts/NFTs)",
        "Vulcan Eleven (Fantasy Sports) & MusicX (Streaming) — 60fps React Native",
        "Primary technical liaison for stakeholders; led hiring & mentorship",
      ],
    },
    {
      company: "TechProMind & WebSkitters",
      role: "Senior Full-Stack Engineer",
      location: "Kolkata, India",
      period: "May 2017 — Oct 2021",
      type: "Full-time",
      color: "#DAA520",
      highlights: [
        "Secured 13+ government projects — hardened against SQL injection/XSS",
        "Architected GST Ecosystem (Merchant Portal & Retailer Software) from scratch",
        "Enhanced system efficiency 40% through architectural overhaul",
        "Migrated legacy PHP to Angular/REST — improved efficiency & maintainability",
      ],
    },
  ],

  // ─── Projects (all combined, deduplicated) ────────────────────
  projects: [
    {
      id: "spyk",
      name: "VitalQuest / Spyk Health",
      role: "Principal Architect",
      badge: "FLAGSHIP · HEALTHTECH",
      description:
        "Custom game engine built from absolute scratch — zero dependencies, zero shortcuts. LLM-based dynamic health task generation, XP progression system, RAG pipeline for medical context. The hardest system I've ever architected.",
      impact: [
        "Custom game engine — zero external deps",
        "LLM task generation at runtime",
        "RAG pipeline for HIPAA-compliant medical data",
      ],
      tech: [
        "React Native",
        "Custom Game Engine",
        "LLMs",
        "RAG Pipelines",
        "C++",
      ],
      color: "#C9A84C",
      featured: true,
    },
    {
      id: "thoth",
      name: "Nexus / Thoth AI",
      role: "Enterprise Architect",
      badge: "AI PLATFORM",
      description:
        "Enterprise AI orchestration platform unifying Meta, TikTok, Shopify and 5+ marketing channels. Autonomous campaign analysis, real-time cross-platform optimization, agentic AI workflows.",
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
      featured: true,
    },
    {
      id: "myteal",
      name: "LunaCare / myTeal",
      role: "Lead Mobile Architect",
      badge: "WOMEN'S HEALTH",
      description:
        "Privacy-first women's health ecosystem with local-first storage and AI-driven wellness algorithms. Adaptive meditation engine, cycle tracking, mood journaling, personalized insights. Empathy-first design.",
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
      featured: true,
    },
    {
      id: "olo",
      name: "oLo Eye Care",
      role: "Technical Lead",
      badge: "MEDTECH",
      description:
        "Real-time eye health monitoring using MediaPipe on-device. Retina coverage analysis, blink rate detection, redness assessment, and luminance tracking — medical-grade computer vision on consumer smartphones.",
      impact: [
        "Medical-grade CV on consumer hardware",
        "Real-time retina analysis",
        "Blink + redness + luminance detection",
      ],
      tech: ["React Native", "MediaPipe", "Computer Vision", "Gumlet API"],
      color: "#2196F3",
      featured: false,
    },
    {
      id: "maskwa",
      name: "Maskwa",
      role: "Lead Architect & Strategic Partner",
      badge: "LEGACY · SOCIAL IMPACT",
      description:
        "Platform for Canadian Indigenous communities — cultural preservation, community development, and economic empowerment through technology. Infrastructure that respects heritage while enabling the future.",
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
      featured: false,
    },
    {
      id: "vulcan",
      name: "Vulcan Eleven",
      role: "Lead Mobile Engineer",
      badge: "SPORTS · FINTECH",
      description:
        "Fantasy sports platform with 60fps performance. 50K+ users, Razorpay + Binance Pay dual-payment, 35% transaction growth. Post-merger redesign using React Native Reanimated and native C++ modules.",
      impact: [
        "50K+ active users",
        "35% transaction growth",
        "Binance Pay + Razorpay integration",
      ],
      tech: ["React Native", "Reanimated", "C++", "Razorpay", "Binance Pay"],
      color: "#FF6B35",
      featured: false,
      link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    },
    {
      id: "be4you",
      name: "Be4You",
      role: "Lead Architect",
      badge: "SOCIAL · DATING",
      description:
        "Full dating app MVP: real-time chat via Socket.io, Zoom-style video calls, live geolocation, social + Apple auth. Delivered for seed funding round in under 90 days. Zero compromises.",
      impact: [
        "Full MVP for seed round",
        "Real-time video + chat + location",
        "90-day delivery",
      ],
      tech: ["WebRTC", "Socket.io", "Reanimated", "Video", "Node.js"],
      color: "#00BBF9",
      featured: false,
    },
    {
      id: "defi11",
      name: "DeFi11",
      role: "Web3 Architect",
      badge: "DEFI",
      description:
        "Fully decentralized fantasy sports. Smart contract prize pools, on-chain tournament logic, NFT marketplace, and complex staking mechanisms on Ethereum. Zero centralized custody.",
      impact: [
        "100% on-chain prize pools",
        "Smart contract architecture",
        "Zero-trust design",
      ],
      tech: ["Solidity", "Web3.js", "NFTs", "Smart Contracts", "Ethereum"],
      color: "#F15BB5",
      featured: false,
      link: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
    },
    {
      id: "musicx",
      name: "MusicX",
      role: "Senior Engineer",
      badge: "WEB3 · MUSIC",
      description:
        "Music competition platform with blockchain-backed royalties. Native C++ Modules, 60fps animations, Twitter + Spotify API integration. High-performance streaming on React Native.",
      impact: [
        "Blockchain royalty system",
        "C++ native modules",
        "60fps animations",
      ],
      tech: ["React Native", "Blockchain", "Native C++ Modules", "Audio APIs"],
      color: "#9B5DE5",
      featured: false,
      link: "https://apps.apple.com/app/music-x/id6475713772",
    },
    {
      id: "housezy",
      name: "Housezy",
      role: "FinTech Lead",
      badge: "PROPTECH",
      description:
        "Property management platform with complex payment gateways, subscription billing (PayU + Google Pay), GraphQL APIs, Socket.io real-time notifications. Pixel-perfect iOS from Figma.",
      impact: [
        "Subscription billing layer",
        "Real-time notifications",
        "PayU + Google Pay integration",
      ],
      tech: ["React Native", "GraphQL", "Socket.io", "PayU", "Subscription"],
      color: "#00F5D4",
      featured: false,
      link: "https://apps.apple.com/app/housezy/id6471949955",
    },
  ],

  // ─── Skills ───────────────────────────────────────────────────
  skills: {
    "Mobile Architecture": {
      icon: "📱",
      color: "#C9A84C",
      items: [
        "React Native (Expert, Bridgeless)",
        "Expo",
        "TypeScript",
        "Native Modules (C++/Swift/Kotlin)",
        "Reanimated",
        "iOS & Android",
      ],
    },
    "AI & Machine Learning": {
      icon: "🧠",
      color: "#F5C842",
      items: [
        "RAG Pipelines",
        "Agentic AI",
        "LLM Integration (OpenAI/Claude)",
        "Computer Vision (MediaPipe/OpenCV)",
        "TensorFlow",
        "NLP",
        "Pinecone",
      ],
    },
    "Web3 & Blockchain": {
      icon: "⛓",
      color: "#DAA520",
      items: [
        "Solana (Rust/Anchor)",
        "Ethereum (Solidity)",
        "Web3.js / Ethers.js",
        "WalletConnect",
        "Smart Contracts",
        "IPFS",
        "DeFi & NFT",
      ],
    },
    "Backend & Cloud": {
      icon: "☁️",
      color: "#B8860B",
      items: [
        "NestJS / Node.js / Django",
        "GraphQL / REST",
        "PostgreSQL / MongoDB",
        "AWS (Lambda, S3, Amplify)",
        "Docker / Kubernetes",
        "CI/CD (GitHub Actions, Fastlane)",
        "WebSockets / Real-time",
      ],
    },
    Leadership: {
      icon: "🎯",
      color: "#E8B4B8",
      items: [
        "Team Building & Hiring",
        "Technical Mentorship",
        "Stakeholder Management",
        "Agile/Scrum",
        "0-to-1 Architecture",
        "Payment Systems",
      ],
    },
  },

  // ─── Education ───────────────────────────────────────────────
  education: [
    {
      degree: "MCA",
      school: "Techno Main Salt Lake, Kolkata",
      period: "2018—2021",
    },
    {
      degree: "BCA",
      school: "The Heritage Academy, Kolkata",
      period: "2014—2017",
    },
  ],

  // ─── Story Timeline (from previous portfolio) ──────────────────
  story: [
    {
      yr: "2017",
      title: "The Origin",
      text: "PHP developer. Government projects. 13 secured, restructured, and shipped. Built GST portals, Android apps, and retailer software from zero. Real engineering means owning security, performance, and delivery.",
    },
    {
      yr: "2019–21",
      title: "MCA & Upskilling",
      text: "Master's in Computer Applications. 8.61 CGPA. Coding Group Secretary. React, React Native, Web3 foundations, and freelance projects running in parallel.",
    },
    {
      yr: "2021",
      title: "Web3 & Blockchain",
      text: "Joined NonceBlox. Deep-dived into Solidity, DeFi, NFTs. Built DeFi11 — fully decentralized fantasy sports with on-chain prize pools. Shipped 13+ apps over 3 years.",
    },
    {
      yr: "2023",
      title: "The Lead Role",
      text: "Lead Mobile Developer. Owned architecture for MusicX, Housezy, Vulcan Eleven. 50,000+ real users. Razorpay + Binance Pay. C++ Native Modules. React Native at its technical ceiling.",
    },
    {
      yr: "2025",
      title: "AI + HealthTech",
      text: "Custom game engine from scratch. RAG pipelines for HIPAA-compliant medical data. Women's health platform at scale. Blockchain health records. Bridgeless React Native migration. VP-level operations.",
    },
    {
      yr: "Now",
      title: "Open to the Right Role",
      text: "VP Engineering. CTO. Principal Architect. The title matters less than the mission. I build systems that scale, lead teams that deliver, and turn technical vision into business outcomes.",
    },
  ],

  // ─── Testimonials (from previous portfolio) ──────────────────
  testimonials: [
    {
      name: "Kartik Kalia",
      role: "Full Stack Developer · AWS",
      company: "NonceBlox",
      seniority: "DIRECT MANAGER",
      seniorityColor: "#C9A84C",
      rel: "Managed Amit directly · 3 years",
      text: "I had the pleasure of working with Amit for three years and witnessed his impressive growth from Front-End Developer to Front-End Lead. His expertise and dedication make him a valuable asset to any team.",
      li: "https://www.linkedin.com/in/kartikkalia/",
      date: "November 2024",
    },
    {
      name: "Neha Goel",
      role: "HR Professional · 15+ Years",
      company: "NonceBlox",
      seniority: "SENIOR LEADERSHIP",
      seniorityColor: "#78909C",
      rel: "Senior colleague — cross-functional",
      text: "Amit had been an amicable and diligent developer, one of the most dependable Engineers when it comes to delivery or urgent closures. His capability to rebuild any project from scratch is remarkable.",
      li: "https://www.linkedin.com/in/neha-goel/",
      date: "October 2024",
    },
    {
      name: "Puja Rani Tripathy",
      role: "Software Developer",
      company: "Synapsis Medical",
      seniority: "TEAM MEMBER",
      seniorityColor: "#4FC3F7",
      rel: "Reported to Amit directly",
      text: "Amit played a key role in code reviews, ensuring quality and consistency across the codebase while guiding multiple teams through complex technical tasks. Reliable, technically strong, and a great support.",
      li: "https://www.linkedin.com/in/puja-rani-tripathy/",
      date: "February 2026",
    },
    {
      name: "Varun Chodha",
      role: "Senior Full-Stack Developer · MERN",
      company: "NonceBlox",
      seniority: "MENTEE → SENIOR",
      seniorityColor: "#81C784",
      rel: "Grew under Amit's mentorship",
      text: "Amit played a pivotal role in mentoring me, sharing his profound knowledge of Redux, React Native, and frontend concepts. His enthusiasm for coding and pursuit for perfection are truly inspiring.",
      li: "https://www.linkedin.com/in/varun-chodha/",
      date: "October 2024",
    },
  ],

  // ─── Blog ────────────────────────────────────────────────────
  blogs: [
    {
      title: "React Native Bridgeless Architecture: What They Don't Tell You",
      cat: "Mobile",
      teaser:
        "The new architecture changes everything. Here's what actually breaks in production and how to fix it.",
    },
    {
      title: "Building RAG Pipelines for Medical Data: A HIPAA-Safe Approach",
      cat: "AI + HealthTech",
      teaser:
        "How we built retrieval pipelines for sensitive medical data without violating compliance.",
    },
    {
      title: "Why 50% of React Native Apps Fail in Production",
      cat: "Architecture",
      teaser:
        "After 8 years and 16 apps, I see the same architecture mistake made over and over.",
    },
  ],
};

const getYears = () =>
  new Date().getFullYear() - new Date(DATA.started).getFullYear();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  SECTION HEADER                                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <div ref={ref} style={{ marginBottom: 64 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.4em",
          color: "#C9A84C",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {number}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: subtitle ? 16 : 0,
        }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 500,
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  ANIMATED STAT                                               */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AnimatedStat({
  value,
  label,
  suffix,
  delay = 0,
}: {
  value: string;
  label: string;
  suffix: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: "32px 24px",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
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
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 4vw, 52px)",
          fontWeight: 800,
          background:
            "linear-gradient(135deg, #DAA520 0%, #F5C842 50%, #B8860B 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.55)",
          marginTop: 4,
          fontWeight: 300,
        }}
      >
        {suffix}
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  MARQUEE                                                     */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Marquee() {
  const items = [
    "React Native",
    "•",
    "AI/ML",
    "•",
    "Web3",
    "•",
    "Solana",
    "•",
    "RAG Pipelines",
    "•",
    "Game Engine",
    "•",
    "Computer Vision",
    "•",
    "TypeScript",
    "•",
    "NestJS",
    "•",
    "AWS",
    "•",
    "0-to-1 Architect",
    "•",
  ];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 0",
        background: "rgba(201,168,76,0.02)",
      }}
    >
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item === "•" ? "inherit" : "var(--font-display)",
              fontSize: item === "•" ? 12 : "clamp(14px, 2vw, 18px)",
              fontWeight: item === "•" ? 400 : 700,
              color:
                item === "•"
                  ? "rgba(201,168,76,0.3)"
                  : "rgba(255,255,255,0.15)",
              letterSpacing: item === "•" ? 0 : "0.05em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              padding: "0 16px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  EXPERIENCE CARD                                             */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof DATA.experience)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: exp.color,
        }}
      />
      <div style={{ padding: "32px 32px 32px 40px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              {exp.company}
            </h3>
            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
              }}
            >
              {exp.role}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: exp.color,
              }}
            >
              {exp.period}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                marginTop: 4,
              }}
            >
              {exp.location}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {exp.highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3 + i * 0.06 }}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              <span
                style={{
                  color: exp.color,
                  fontSize: 8,
                  marginTop: 6,
                  flexShrink: 0,
                }}
              >
                ◆
              </span>
              <span
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 300,
                }}
              >
                {h}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  PROJECT CARD                                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: (typeof DATA.projects)[0];
  index: number;
  featured?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      style={{
        border: `1px solid ${hovered ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)"}`,
        background: hovered
          ? "rgba(201,168,76,0.03)"
          : "rgba(255,255,255,0.015)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.4s, background 0.4s",
      }}
    >
      <div style={{ padding: featured ? "28px 28px 32px" : "24px" }}>
        {/* Badge + role */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: project.color,
              border: `1px solid ${project.color}40`,
              padding: "4px 10px",
            }}
          >
            {project.role}
          </div>
          {project.badge && (
            <span
              style={{
                fontSize: 8,
                color: project.color,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.2em",
                opacity: 0.7,
              }}
            >
              {project.badge}
            </span>
          )}
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: featured ? "clamp(20px, 2.5vw, 28px)" : 18,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          {project.name}
        </h3>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 300,
            marginBottom: 16,
          }}
        >
          {project.description}
        </p>

        {/* Impact */}
        {featured && project.impact && (
          <div
            style={{
              padding: "12px 16px",
              borderLeft: "2px solid rgba(201,168,76,0.35)",
              background: "rgba(201,168,76,0.035)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#C9A84C",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                marginBottom: 8,
              }}
            >
              Impact
            </div>
            {project.impact.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ color: "#C9A84C", flexShrink: 0 }}>→</span>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: "link" in project && (project as any).link ? 12 : 0,
          }}
        >
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.04)",
                padding: "4px 10px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {"link" in project && (project as any).link && (
          <a
            href={(project as any).link}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color: "rgba(201,168,76,0.6)",
              fontFamily: "var(--font-mono)",
              textDecoration: "none",
            }}
          >
            View Live ↗
          </a>
        )}
      </div>

      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: project.color,
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  SKILL CATEGORY                                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SkillCategory({
  name,
  data,
  index,
}: {
  name: string;
  data: { icon: string; color: string; items: string[] };
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
        padding: "28px",
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
          height: 1,
          background: `linear-gradient(90deg, transparent, ${data.color}40, transparent)`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 20 }}>{data.icon}</span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </h3>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "6px 12px",
              background: `${data.color}08`,
              border: `1px solid ${data.color}18`,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.05em",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  GSAP TEXT REVEAL                                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function GsapRevealText({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const words = el.querySelectorAll(".word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: "110%", opacity: 0, rotateX: -90 },
        {
          y: "0%",
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, overflow: "hidden" }}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: "0.3em",
          }}
        >
          <span
            className="word"
            style={{ display: "inline-block", willChange: "transform" }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  CONTACT FORM                                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
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
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontSize: 13,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#fff",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.3)",
    marginBottom: 8,
    fontWeight: 600,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={{ ...labelStyle, color: "#C9A84C" }}>Name *</label>
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(201,168,76,0.4)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.06)")
            }
          />
        </div>
        <div>
          <label style={{ ...labelStyle, color: "#C9A84C" }}>Email *</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(201,168,76,0.4)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.06)")
            }
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          placeholder="What's this about?"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.4)")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255,255,255,0.06)")
          }
        />
      </div>
      <div>
        <label style={{ ...labelStyle, color: "#C9A84C" }}>Message *</label>
        <textarea
          required
          rows={5}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.4)")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255,255,255,0.06)")
          }
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="magnetic-btn"
        style={{
          width: "100%",
          justifyContent: "center",
          opacity: status === "sending" ? 0.6 : 1,
        }}
      >
        {status === "idle"
          ? "Send Message →"
          : status === "sending"
            ? "Sending..."
            : status === "success"
              ? "Sent ✓"
              : "Try Again"}
      </button>
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 16px",
              background: "rgba(76,175,80,0.06)",
              border: "1px solid rgba(76,175,80,0.2)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(100,200,110,0.9)",
            }}
          >
            ✅ Message sent! I&apos;ll respond within 24 hours.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  MAIN HOME COMPONENT                                         */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [contactTab, setContactTab] = useState<"message" | "meeting">(
    "message",
  );
  const [roleIdx, setRoleIdx] = useState(0);

  // Rotating role
  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % DATA.roles.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  // GSAP hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-char",
        { y: 120, opacity: 0, rotateX: -80 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.03,
          ease: "power3.out",
          delay: 1.4,
        },
      );
      gsap.fromTo(
        ".hero-subtitle",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 2.2, ease: "power2.out" },
      );
      gsap.fromTo(
        ".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 2.5, ease: "power2.out" },
      );
      gsap.fromTo(
        ".hero-meta",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 2.8, ease: "power2.out" },
      );
      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 3, ease: "power2.out" },
      );
      gsap.to(".scroll-indicator-dot", {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const titleLines = DATA.title.split("\n");

  // Floating stat badges for hero photo
  const photoStats = [
    { label: "Years", value: `${getYears()}+`, pos: { top: 10, left: -64 } },
    { label: "Apps", value: "16+", pos: { top: 60, right: -64 } },
    { label: "Users", value: "50K+", pos: { bottom: 80, left: -64 } },
    { label: "Uptime", value: "99.9%", pos: { bottom: 10, right: -54 } },
  ];

  return (
    <main>
      {/* ═══════════════════════════════════════════════════ */}
      {/*  HERO                                              */}
      {/* ═══════════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        id="hero"
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        <div
          className="container"
          style={{ paddingTop: 100, paddingBottom: 60 }}
        >
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(201,168,76,0.35)",
              background: "rgba(201,168,76,0.08)",
              padding: "10px 20px",
              marginBottom: 40,
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#C9A84C",
                display: "inline-block",
                animation: "ac-pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#C9A84C",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            >
              Available · VP · CTO · Principal Architect
            </span>
          </motion.div>

          {/* Two-column hero layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 48,
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left — Text */}
            <div>
              {/* Tagline */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.5em",
                  color: "#C9A84C",
                  textTransform: "uppercase",
                  marginBottom: 24,
                  overflow: "hidden",
                }}
              >
                <span className="hero-char" style={{ display: "inline-block" }}>
                  {DATA.tagline}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 8vw, 100px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  marginBottom: 32,
                  perspective: 500,
                }}
              >
                {titleLines.map((line, lineIdx) => (
                  <div key={lineIdx} style={{ overflow: "hidden" }}>
                    {line.split("").map((char, charIdx) => (
                      <span
                        key={charIdx}
                        className="hero-char"
                        style={{
                          display: "inline-block",
                          color:
                            lineIdx === 0
                              ? "#FFFFFF"
                              : char === "&"
                                ? "#C9A84C"
                                : "rgba(255,255,255,0.5)",
                          willChange: "transform",
                        }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </div>
                ))}
              </h1>

              {/* Rotating role */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                  height: 36,
                }}
              >
                <div
                  style={{
                    height: 1,
                    width: 40,
                    background: "#C9A84C",
                    flexShrink: 0,
                  }}
                />
                <div style={{ overflow: "hidden", height: 36 }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={roleIdx}
                      initial={{ y: 38, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -38, opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontSize: 20,
                        color: "#C9A84C",
                        fontWeight: 300,
                        letterSpacing: "0.06em",
                        margin: 0,
                      }}
                    >
                      {DATA.roles[roleIdx]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Subtitle */}
              <div className="hero-subtitle" style={{ opacity: 0 }}>
                <p
                  style={{
                    fontSize: "clamp(14px, 1.8vw, 18px)",
                    color: "rgba(255,255,255,0.55)",
                    maxWidth: 560,
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {DATA.subtitle}
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className="hero-cta"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  marginTop: 36,
                  opacity: 0,
                }}
              >
                <button
                  className="magnetic-btn"
                  onClick={() =>
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Get In Touch
                </button>
                <button
                  className="magnetic-btn-outline"
                  onClick={() =>
                    document
                      .querySelector("#projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Work
                </button>
              </div>

              {/* Meta */}
              <div
                className="hero-meta"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 32,
                  marginTop: 48,
                  opacity: 0,
                }}
              >
                {[
                  { label: "Based in", value: DATA.location },
                  { label: "Availability", value: DATA.availability },
                  { label: "Focus", value: "Mobile · AI · Web3" },
                ].map((m) => (
                  <div key={m.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.25em",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 500,
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "relative",
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
              className="hero-photo-col"
            >
              {/* Rotating rings */}
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: i === 0 ? 360 : -360 }}
                  transition={{
                    duration: 35 + i * 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    inset: i === 0 ? -32 : -64,
                    border: `1px solid ${i === 0 ? "rgba(201,168,76,0.14)" : "rgba(201,168,76,0.06)"}`,
                    borderRadius: "50%",
                  }}
                />
              ))}

              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  inset: -50,
                  background:
                    "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 65%)",
                  filter: "blur(40px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />

              {/* Photo */}
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(201,168,76,0.38)",
                  position: "relative",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
                }}
              >
                <ImageWithFallback
                  src={DATA.profileImage}
                  fallbackSrc={DATA.profileFallback}
                  alt="Amit Chakraborty — Principal Mobile Architect"
                  fill
                  style={{ objectFit: "cover" }}
                  fallbackColor="rgba(201,168,76,0.15)"
                  sizes="280px"
                  priority
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(6,6,6,0.35) 0%, transparent 60%)",
                  }}
                />
              </div>

              {/* Name label */}
              <div
                style={{
                  position: "absolute",
                  bottom: -32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Amit Chakraborty
                </span>
              </div>

              {/* Floating stat badges */}
              {photoStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 2 + i * 0.12,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{
                    position: "absolute",
                    ...s.pos,
                    background: "rgba(6,6,6,0.97)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    padding: "10px 14px",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                    backdropFilter: "blur(12px)",
                    minWidth: 68,
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#C9A84C",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      fontFamily: "var(--font-mono)",
                      marginTop: 3,
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="scroll-indicator"
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </div>
          <div
            style={{
              width: 1,
              height: 40,
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="scroll-indicator-dot"
              style={{
                width: 3,
                height: 8,
                background: "#C9A84C",
                borderRadius: 2,
                position: "absolute",
                left: -1,
                top: 0,
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  MARQUEE                                           */}
      {/* ═══════════════════════════════════════════════════ */}
      <Marquee />

      {/* ═══════════════════════════════════════════════════ */}
      {/*  ABOUT + STATS                                     */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="about"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="01"
            title="About"
            subtitle="The architect behind 16+ production systems."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 48,
              alignItems: "start",
            }}
            className="md:grid-cols-2"
          >
            <div>
              <GsapRevealText
                text="I specialize in taking startups from pen-and-paper to funded production — acting as a standalone technical unit that bridges complex architectures with consumer-grade experiences."
                style={{
                  fontSize: "clamp(18px, 2.2vw, 24px)",
                  lineHeight: 1.6,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "var(--font-display)",
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                style={{
                  marginTop: 24,
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: 300,
                }}
              >
                From proprietary game engines with C++/Swift/Kotlin to RAG
                pipelines for medical AI, from Solana dApps to real-time social
                platforms — I architect the full spectrum. My core guarantee:
                every system ships to production.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                style={{ marginTop: 32 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    color: "#C9A84C",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Education
                </div>
                {DATA.education.map((ed) => (
                  <div
                    key={ed.degree}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {ed.degree}
                      </span>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 13,
                          marginLeft: 8,
                          fontWeight: 300,
                        }}
                      >
                        {ed.school}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {ed.period}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {DATA.stats.map((stat, i) => (
                <AnimatedStat key={stat.label} {...stat} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  EXPERIENCE                                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="experience"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="02"
            title="Experience"
            subtitle="A decade of shipping production systems."
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {DATA.experience.map((exp, i) => (
              <ExperienceCard key={exp.company} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <hr className="gold-rule" />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  PROJECTS                                          */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="projects"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="03"
            title="Featured Work"
            subtitle="Architectures that made it to production."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 24,
              marginBottom: 24,
            }}
          >
            {DATA.projects
              .filter((p) => p.featured)
              .map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} featured />
              ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {DATA.projects
              .filter((p) => !p.featured)
              .map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i + 3} />
              ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  SKILLS ARSENAL                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="skills"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="04"
            title="Technical Arsenal"
            subtitle="The tools I use to build production systems."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {Object.entries(DATA.skills).map(([name, data], i) => (
              <SkillCategory key={name} name={name} data={data} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <hr className="gold-rule" />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  STORY TIMELINE                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="story"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="05"
            title="The Journey"
            subtitle="Eight years. No shortcuts."
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 1,
                background:
                  "linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 56,
                paddingLeft: 40,
              }}
            >
              {DATA.story.map((ch, i) => (
                <motion.div
                  key={ch.yr}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.06 }}
                  style={{ position: "relative" }}
                >
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                      position: "absolute",
                      left: -48,
                      top: 6,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#C9A84C",
                      border: "3px solid #060606",
                      zIndex: 10,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "rgba(201,168,76,0.7)",
                      letterSpacing: "0.2em",
                      marginBottom: 6,
                    }}
                  >
                    {ch.yr}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      marginBottom: 10,
                    }}
                  >
                    {ch.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.75,
                      fontWeight: 300,
                      maxWidth: 640,
                    }}
                  >
                    {ch.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  TESTIMONIALS                                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="section-padding"
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="container">
          <SectionHeader
            number="06"
            title="What Leaders Say"
            subtitle="Ordered by seniority — from direct manager to mentored developers."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {DATA.testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: 32,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.015)",
                  position: "relative",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 8,
                    padding: "4px 10px",
                    border: `1px solid ${t.seniorityColor}`,
                    color: t.seniorityColor,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                    background: `${t.seniorityColor}15`,
                  }}
                >
                  {t.seniority}
                </div>
                <div
                  style={{
                    fontSize: 52,
                    color: "rgba(255,255,255,0.04)",
                    position: "absolute",
                    top: 18,
                    right: 24,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.8,
                    fontWeight: 300,
                    marginBottom: 24,
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `${t.seniorityColor}20`,
                      border: `1px solid ${t.seniorityColor}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: t.seniorityColor,
                      }}
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
                        color: "#fff",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#C9A84C")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                    >
                      {t.name}
                    </a>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.45)",
                        marginTop: 2,
                      }}
                    >
                      {t.role}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: t.seniorityColor,
                        fontFamily: "var(--font-mono)",
                        marginTop: 3,
                        opacity: 0.85,
                      }}
                    >
                      {t.rel} · {t.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  BLOG                                              */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="blog"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="07"
            title="Writing & Thoughts"
            subtitle="Deep dives into architecture, AI pipelines, and what it takes to ship."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {DATA.blogs.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: 28,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.015)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#C9A84C",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 14,
                    opacity: 0.8,
                  }}
                >
                  {post.cat} · Coming soon
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
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
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.65,
                    fontWeight: 300,
                    marginBottom: 16,
                  }}
                >
                  {post.teaser}
                </p>
                <a
                  href={DATA.medium}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 11,
                    color: "rgba(201,168,76,0.6)",
                    fontFamily: "var(--font-mono)",
                    textDecoration: "none",
                  }}
                >
                  Follow on Medium ↗
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <hr className="gold-rule" />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  CONTACT                                           */}
      {/* ═══════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="section-padding"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="container">
          <SectionHeader
            number="08"
            title="Let's Build Something"
            subtitle="Open for principal/founding engineer roles and high-impact contracts."
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}
            className="lg:grid-cols-2"
          >
            <div>
              <GsapRevealText
                text="Have a system that needs to ship? Let's talk architecture."
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                  marginBottom: 32,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {[
                  {
                    label: "Email",
                    value: DATA.email,
                    href: `mailto:${DATA.email}`,
                  },
                  {
                    label: "Phone",
                    value: DATA.phone,
                    href: `tel:${DATA.phone}`,
                  },
                  {
                    label: "Website",
                    value: DATA.website,
                    href: `https://${DATA.website}`,
                  },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    data-cursor-hover
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.015)",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(201,168,76,0.2)";
                      e.currentTarget.style.background =
                        "rgba(201,168,76,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.015)";
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.25em",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                        minWidth: 60,
                      }}
                    >
                      {c.label}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                      }}
                    >
                      {c.value}
                    </div>
                  </a>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "GitHub", href: DATA.github },
                  { label: "LinkedIn", href: DATA.linkedin },
                  { label: "Medium", href: DATA.medium },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    style={{
                      padding: "12px 20px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#C9A84C";
                      e.currentTarget.style.color = "#C9A84C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    }}
                  >
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {[
                  { key: "message" as const, label: "✉ Send Message" },
                  { key: "meeting" as const, label: "📅 Schedule Meeting" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setContactTab(tab.key)}
                    data-cursor-hover
                    style={{
                      flex: 1,
                      padding: "14px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      background:
                        contactTab === tab.key
                          ? "#C9A84C"
                          : "rgba(255,255,255,0.02)",
                      color:
                        contactTab === tab.key
                          ? "#000"
                          : "rgba(255,255,255,0.4)",
                      border: `1px solid ${contactTab === tab.key ? "#C9A84C" : "rgba(255,255,255,0.06)"}`,
                      fontWeight: contactTab === tab.key ? 700 : 400,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {contactTab === "message" ? (
                  <motion.div
                    key="msg"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ContactForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="meet"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
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

      {/* ═══════════════════════════════════════════════════ */}
      {/*  FOOTER                                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              © {new Date().getFullYear()} AMIT CHAKRABORTY
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.15)",
                marginTop: 4,
              }}
            >
              Principal Mobile Architect · VP Engineering · {DATA.location}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.12)",
            }}
          >
            BUILT BY HAND. NOT BY PROMPT.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              ["LinkedIn", DATA.linkedin],
              ["GitHub", DATA.github],
              ["Medium", DATA.medium],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ac-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .hero-grid { grid-template-columns: 1fr auto; }
        .hero-photo-col { display: flex !important; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-photo-col { display: none !important; }
        }
        @media (max-width: 768px) {
          .lg\\:grid-cols-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
