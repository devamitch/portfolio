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
import { useEffect, useMemo, useRef, useState } from "react";
import ImageWithFallback from "./ImageWithFallback";
import MeetingScheduler from "./MeetingScheduler";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ━━ TOKENS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
  goldD: "rgba(201,168,76,0.32)",
  goldF: "rgba(201,168,76,0.08)",
  goldGrad: "linear-gradient(135deg,#DAA520 0%,#F5C842 50%,#B8860B 100%)",
};
const GRID = "rgba(201,168,76,0.022)";
const HN = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','Space Mono',monospace";

/* ━━ DATA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const D = {
  nameFirst: "Amit",
  nameLast: "Chakraborty",
  tagline: "Eight years. Sixteen apps. No shortcuts.",
  manifesto: [
    "Before AI could write a line of code, I was building production systems.",
    "16+ apps shipped. 50K+ real users. Zero outsourced decisions.",
    "I architect systems that outlast the hype.",
  ],
  roles: ["VP Engineering", "Principal Architect", "CTO", "Technical Lead"],
  location: "Kolkata, India",
  email: "amit98ch@gmail.com",
  phone: "+91-9874173663",
  github: "https://github.com/devamitch",
  githubAlt: "https://github.com/techamit95ch",
  linkedin: "https://linkedin.com/in/devamitch",
  medium: "https://devamitch.medium.com/",
  profileImage: "/images/amit-profile.jpg",
  profileFallback: "https://github.com/devamitch.png",
  started: "2017-05-01",
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
        "Built custom game engine from scratch — C++/Swift/Kotlin bridgeless modules",
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
  projects: [
    {
      id: "spyk",
      name: "VitalQuest / Spyk Health",
      role: "Principal Architect",
      badge: "FLAGSHIP · HEALTHTECH",
      featured: true,
      tagline: "A game engine I built from nothing.",
      desc: "Custom game engine built from absolute scratch — zero dependencies, zero shortcuts. LLM-based dynamic health task generation, XP progression system, RAG pipeline for medical context.",
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
    },
    {
      id: "thoth",
      name: "Nexus / Thoth AI",
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
      name: "oLo Eye Care",
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
      items: [
        "React Native (Expert, Bridgeless)",
        "Expo",
        "TypeScript",
        "Native Modules C++/Swift/Kotlin",
        "Reanimated",
        "iOS & Android",
      ],
    },
    {
      cat: "AI & ML",
      items: [
        "RAG Pipelines",
        "Agentic AI",
        "LLM Integration (OpenAI/Claude)",
        "Computer Vision (MediaPipe)",
        "TensorFlow",
        "NLP",
        "Pinecone",
      ],
    },
    {
      cat: "Blockchain",
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
    {
      cat: "Backend",
      items: [
        "NestJS / Node.js / Django",
        "GraphQL / REST",
        "PostgreSQL / MongoDB",
        "AWS Lambda / S3",
        "Docker / Kubernetes",
        "CI/CD Fastlane",
      ],
    },
    {
      cat: "Frontend",
      items: [
        "React.js",
        "Next.js",
        "Redux",
        "Framer Motion",
        "GSAP",
        "Tailwind CSS",
        "MUI",
      ],
    },
    {
      cat: "Cloud",
      items: [
        "AWS (Lambda, S3, Amplify, EC2)",
        "Docker & Kubernetes",
        "GitHub Actions",
        "Fastlane",
        "CircleCI",
        "Firebase",
      ],
    },
    {
      cat: "Databases",
      items: [
        "PostgreSQL",
        "MongoDB",
        "MySQL",
        "Firebase Realtime DB",
        "Redis",
        "Pinecone (Vector)",
      ],
    },
    {
      cat: "Leadership",
      items: [
        "Team Building & Hiring",
        "Technical Mentorship",
        "Stakeholder Management",
        "Agile/Scrum",
        "0-to-1 Architecture",
        "VP-Level Ops",
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
      text: "PHP developer. Government projects. 13 secured, restructured, and shipped. Built GST portals, Android apps, and retailer software from zero.",
      color: "#C9A84C",
    },
    {
      yr: "2019",
      title: "MCA & Upskilling",
      text: "Master's in Computer Applications. 8.61 CGPA. React, React Native, Web3 foundations, and freelance projects running in parallel.",
      color: "#F5C842",
    },
    {
      yr: "2021",
      title: "Web3 & Blockchain",
      text: "Joined NonceBlox. Deep-dived into Solidity, DeFi, NFTs. Built DeFi11 — fully decentralized fantasy sports. Shipped 13+ apps over 3 years.",
      color: "#DAA520",
    },
    {
      yr: "2023",
      title: "The Lead Role",
      text: "Lead Mobile Developer. Owned architecture for MusicX, Housezy, Vulcan Eleven. 50,000+ real users. Razorpay + Binance Pay. C++ Native Modules.",
      color: "#B8860B",
    },
    {
      yr: "2025",
      title: "AI + HealthTech",
      text: "Custom game engine from scratch. RAG pipelines for HIPAA-compliant medical data. Women's health platform at scale. VP-level operations.",
      color: "#C9A84C",
    },
    {
      yr: "Now",
      title: "Open to the Right Role",
      text: "VP Engineering. CTO. Principal Architect. The title matters less than the mission. I build systems that scale and turn technical vision into business outcomes.",
      color: "#F5C842",
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
      name: "Puja Rani Tripathy",
      role: "Software Developer",
      company: "Synapsis Medical",
      seniority: "TEAM MEMBER",
      col: "#4FC3F7",
      rel: "Reported to Amit directly",
      date: "Feb 2026",
      text: "Amit played a key role in code reviews, ensuring quality and consistency across the codebase while guiding multiple teams through complex technical tasks.",
      li: "https://linkedin.com/in/puja-rani-tripathy/",
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

const getYrs = () =>
  Math.floor(
    (Date.now() - new Date(D.started).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  );

/* ━━ SCRAMBLE HOOK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━ COUNTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━ CONTRIBUTION GRAPH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━ SECTION LABEL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━ SECTION HEADING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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

/* ━━ 3D TILT PROJECT CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectCard({ p, i }: { p: (typeof D.projects)[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
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
      transition={{ delay: i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
          border: `1px solid ${hov ? "rgba(201,168,76,.5)" : p.featured ? "rgba(201,168,76,.16)" : C.border}`,
          background: p.featured
            ? `linear-gradient(135deg,rgba(201,168,76,.05) 0%,transparent 55%)`
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
              marginBottom: 16,
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

/* ━━ CONTACT FORM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
          background: C.goldGrad,
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
              ? "Sent"
              : "Try Again"}
      </motion.button>
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: "12px 16px",
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

/* ━━ DIVIDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN HOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 100]);
  const txtY = useTransform(scrollY, [0, 700], [0, -50]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const [roleIdx, setRoleIdx] = useState(0);
  const [skillTab, setSkillTab] = useState(0);
  const [ctab, setCtab] = useState<"message" | "meeting">("message");
  const [hovExp, setHovExp] = useState<number | null>(null);
  const scrambled = useScramble(D.tagline);

  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % D.roles.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

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
      gsap.fromTo(
        ".skill-item",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.04,
          duration: 0.5,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const featured = D.projects.filter((p) => p.featured);
  const rest = D.projects.filter((p) => !p.featured);

  return (
    <main
      style={{
        fontFamily: HN,
        background: C.bg,
        color: C.text,
        overflowX: "hidden",
      }}
    >
      <div className="noise-overlay" />

      {/* Global orbs */}
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
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{
              duration: 9 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: o.d,
            }}
          />
        ))}
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
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
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: 11 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
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
          {/* Badge */}
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
            {/* LEFT */}
            <motion.div style={{ y: txtY }}>
              <div style={{ overflow: "hidden", marginBottom: 2 }}>
                <motion.div
                  initial={{ y: 160 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.1,
                    delay: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  }}
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
                  initial={{ y: 160 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.1,
                    delay: 0.36,
                    ease: [0.16, 1, 0.3, 1],
                  }}
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
                  transition={{
                    duration: 0.9,
                    delay: 0.54,
                    ease: [0.16, 1, 0.3, 1],
                  }}
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
                  gap: 16,
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
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                    background: C.goldGrad,
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
                    transition: "border-color .2s",
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
                    transition: "color .2s,border-color .2s",
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

            {/* RIGHT — photo */}
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
                  { label: "Apps", value: "16+", pos: { top: 54, right: -60 } },
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
              { to: 16, s: "+", l: "Apps Shipped" },
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

      {/* ═══ ABOUT — BENTO GRID ═════════════════════════════════ */}
      <section
        ref={aboutRef}
        id="about"
        style={{ padding: "120px 0", background: C.bg2 }}
      >
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
            {/* Big bio */}
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
                  background: C.goldGrad,
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  color: C.gold,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontFamily: MONO,
                  marginBottom: 16,
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
                . Every architecture I build reaches production. Every team I
                lead ships. I don't just write code — I own outcomes.
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
            {/* Stats 2-pack */}
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
                { n: "16+", l: "Production Apps", sub: "iOS, Android, Web" },
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
            {/* Approach */}
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
            {/* Location */}
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
                  marginBottom: 16,
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
                    background: "#34D399",
                    display: "inline-block",
                    animation: "ac-pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "#34D399",
                    fontFamily: MONO,
                    letterSpacing: "0.12em",
                  }}
                >
                  Remote Worldwide
                </span>
              </div>
            </div>
            {/* Education */}
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
                  marginBottom: 16,
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
                      fontSize: 16,
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

      {/* ═══ PROJECTS ═══════════════════════════════════════════ */}
      <section id="work" style={{ padding: "120px 0", background: C.bg }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <SLabel num="01">Executive Portfolio</SLabel>
          <SH l1="Building systems" l2="that actually scale." />
          <p
            style={{
              fontSize: 16,
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

      <Div />

      {/* ═══ EXPERIENCE ══════════════════════════════════════════ */}
      <section
        ref={expRef}
        id="experience"
        style={{ padding: "120px 0", background: C.bg2 }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <SLabel num="02">Career Timeline</SLabel>
          <SH l1="3 companies." l2="8+ years. Zero shortcuts." />
          {D.experience.map((exp, i) => (
            <div
              key={exp.company}
              className="exp-row"
              onMouseEnter={() => setHovExp(i)}
              onMouseLeave={() => setHovExp(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 40,
                alignItems: "start",
                paddingBlock: 40,
                borderTop: `1px solid ${C.border}`,
                background:
                  hovExp === i ? "rgba(255,255,255,.01)" : "transparent",
                transition: "background .3s",
                position: "relative",
              }}
            >
              <motion.div
                animate={{ scaleY: hovExp === i ? 1 : 0.3 }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: exp.color,
                  transformOrigin: "top",
                  transition: "transform .35s",
                }}
              />
              <div style={{ paddingLeft: 16 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: C.vfaint,
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {exp.period}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: exp.color,
                    fontFamily: MONO,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    opacity: 0.85,
                    marginBottom: 12,
                  }}
                >
                  {exp.type}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: C.ghost,
                    letterSpacing: "0.14em",
                    lineHeight: 1.6,
                  }}
                >
                  {exp.location}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: hovExp === i ? C.gold : C.text,
                    marginBottom: 4,
                    letterSpacing: "-0.025em",
                    fontFamily: HN,
                    transition: "color .25s",
                  }}
                >
                  {exp.company}
                </h3>
                <div
                  style={{
                    fontSize: 13,
                    color: C.dim,
                    marginBottom: 20,
                    fontWeight: 400,
                  }}
                >
                  {exp.role}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {exp.highlights.map((pt, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.05 }}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
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
              </div>
            </div>
          ))}
        </div>
      </section>

      <Div />

      {/* ═══ SKILLS ══════════════════════════════════════════════ */}
      <section
        ref={skillsRef}
        id="skills"
        style={{ padding: "120px 0", background: C.bg }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <SLabel num="03">Technical Arsenal</SLabel>
          <SH l1="Deep stack." l2="Not full stack." />
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
                  padding: "9px 16px",
                  fontSize: 9,
                  fontFamily: MONO,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  background: skillTab === i ? C.gold : "transparent",
                  color: skillTab === i ? "#000" : C.faint,
                  border: `1px solid ${skillTab === i ? C.gold : C.border}`,
                  fontWeight: skillTab === i ? 700 : 400,
                  transition: "all .2s",
                }}
              >
                {s.cat}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={skillTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))",
                gap: 10,
              }}
            >
              {D.skills[skillTab].items.map((sk, i) => (
                <motion.div
                  key={sk}
                  className="skill-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{
                    borderColor: "rgba(201,168,76,.4)",
                    scale: 1.02,
                  }}
                  style={{
                    padding: "14px 18px",
                    border: `1px solid ${C.border}`,
                    background: C.card,
                    cursor: "default",
                    transition: "border-color .2s",
                  }}
                >
                  <span style={{ fontSize: 13, color: C.dim, fontWeight: 400 }}>
                    {sk}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Div />

      {/* ═══ STORY ════════════════════════════════════════════════ */}
      <section
        ref={storyRef}
        id="story"
        style={{ padding: "120px 0", background: C.bg2 }}
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
                <div
                  key={ch.yr}
                  className="story-item"
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
                        fontSize: 64,
                        fontWeight: 900,
                        color: "rgba(201,168,76,.06)",
                        fontFamily: MONO,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {ch.yr}
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
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        delay: 0.1,
                      }}
                      style={{
                        position: "absolute",
                        left: i % 2 === 0 ? -9 : "auto",
                        right: i % 2 !== 0 ? -9 : "auto",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: ch.color,
                        border: `3px solid ${C.bg2}`,
                        zIndex: 10,
                        boxShadow: `0 0 12px ${ch.color}80`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GITHUB ══════════════════════════════════════════════ */}
      <section id="github" style={{ padding: "80px 0", background: C.bg }}>
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
                      padding: "10px 16px",
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
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: C.text }}
                    >
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

      {/* ═══ TESTIMONIALS ════════════════════════════════════════ */}
      <section
        id="testimonials"
        style={{ padding: "120px 0", background: C.bg2 }}
      >
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
              gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))",
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
                whileHover={{ borderColor: "rgba(201,168,76,.38)", y: -4 }}
                style={{
                  padding: 32,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all .3s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: t.col,
                  }}
                />
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 7,
                    padding: "4px 10px",
                    border: `1px solid ${t.col}`,
                    color: t.col,
                    fontFamily: MONO,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                    background: `${t.col}12`,
                  }}
                >
                  {t.seniority}
                </div>
                <div
                  style={{
                    fontSize: 56,
                    color: "rgba(255,255,255,.035)",
                    position: "absolute",
                    top: 16,
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
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                    <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>
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
                      {t.rel} · {t.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG ════════════════════════════════════════════════ */}
      <section id="blog" style={{ padding: "80px 0", background: C.bg }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <SLabel>Writing & Thoughts</SLabel>
          <SH
            l1="I think in systems."
            l2="I write in posts."
            size="clamp(32px,4vw,54px)"
          />
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
                whileHover={{ borderColor: C.goldD, y: -3 }}
                style={{
                  padding: 28,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  transition: "all .25s",
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    color: C.gold,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
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
                    marginBottom: 16,
                  }}
                >
                  {post.teaser}
                </p>
                <a
                  href={D.medium}
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
                  Follow on Medium ↗
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Div />

      {/* ═══ CONTACT ═════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "120px 0", background: C.bg2 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr",
              gap: 72,
              alignItems: "start",
            }}
          >
            <div>
              <SLabel num="05">Let's Connect</SLabel>
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
                {
                  l: "LinkedIn",
                  v: "linkedin.com/in/devamitch",
                  h: D.linkedin,
                },
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
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = C.faint)
                    }
                  >
                    {link.v} ↗
                  </span>
                </a>
              ))}
            </div>
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
                      padding: "13px 16px",
                      fontFamily: MONO,
                      fontSize: 9,
                      letterSpacing: "0.16em",
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

      {/* ═══ FOOTER ═══════════════════════════════════════════════ */}
      <footer
        style={{
          padding: "48px 0",
          borderTop: `1px solid ${C.border}`,
          background: C.bg,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: C.text,
                fontFamily: HN,
              }}
            >
              <span style={{ color: C.gold }}>A</span>C
              <span style={{ color: "rgba(201,168,76,.4)" }}>.</span>
            </span>
            <p
              style={{
                fontSize: 9,
                color: C.ghost,
                fontFamily: MONO,
                marginTop: 4,
                letterSpacing: "0.15em",
              }}
            >
              Principal Mobile Architect · VP Engineering · Kolkata, India
            </p>
          </div>
          <p
            style={{
              fontSize: 9,
              color: C.ghost,
              fontFamily: MONO,
              textAlign: "center",
              letterSpacing: "0.12em",
            }}
          >
            © {new Date().getFullYear()} Amit Chakraborty · Built by hand. Not
            by prompt.
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
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.vfaint)}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{overflow-x:hidden;}

        @keyframes ac-pulse{
          0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(201,168,76,0.5);}
          50%{opacity:0.4;box-shadow:0 0 0 7px rgba(201,168,76,0);}
        }
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        .marquee-track{
          display:flex;animation:marquee 32s linear infinite;
          width:max-content;
        }
        .marquee-track:hover{animation-play-state:paused;}

        .noise-overlay{
          position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0.026;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        /* ── HERO ──────────────────────────────── */
        .hero-inner-grid{grid-template-columns:1.1fr 0.9fr;}
        .hero-photo-col{display:flex;}
        @media(max-width:960px){
          .hero-inner-grid{grid-template-columns:1fr!important;}
          .hero-photo-col{display:none!important;}
        }

        /* ── STATS BAR ─────────────────────────── */
        .stats-bar{grid-template-columns:repeat(4,1fr);}
        @media(max-width:680px){
          .stats-bar{grid-template-columns:repeat(2,1fr)!important;}
        }

        /* ── STORY ─────────────────────────────── */
        .story-center-line{display:block;}
        .story-row{grid-template-columns:1fr 1fr;}
        @media(max-width:900px){
          .story-center-line{display:none!important;}
          .story-row{grid-template-columns:1fr!important;}
          .story-row > div:nth-child(2){display:none!important;}
          .story-row > div:nth-child(1){text-align:left!important;}
          .story-row > div{order:1!important;}
        }

        /* ── EXPERIENCE ────────────────────────── */
        .exp-row{grid-template-columns:200px 1fr 180px;}
        @media(max-width:860px){
          .exp-row{grid-template-columns:1fr!important;}
        }

        /* ── CONTACT ───────────────────────────── */
        .contact-grid{grid-template-columns:1fr 1.3fr;}
        @media(max-width:860px){
          .contact-grid{grid-template-columns:1fr!important;}
        }

        /* ── FORM ──────────────────────────────── */
        .form-half{grid-template-columns:1fr 1fr;}
        @media(max-width:540px){
          .form-half{grid-template-columns:1fr!important;}
        }

        /* ── CUSTOM SCROLLBAR ──────────────────── */
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.35);border-radius:2px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(201,168,76,0.6);}

        /* ── TEXT SELECTION ────────────────────── */
        ::selection{background:rgba(201,168,76,0.22);color:#fff;}

        /* ── SECTION ENTRANCE ANIMATIONS ──────── */
        .sec-reveal{opacity:0;transform:translateY(40px);}

        /* ── HOVER UNDERLINE LINKS ─────────────── */
        .hover-underline{
          position:relative;
          text-decoration:none;
        }
        .hover-underline::after{
          content:'';position:absolute;bottom:-2px;left:0;right:0;
          height:1px;background:#C9A84C;
          transform:scaleX(0);transform-origin:left;
          transition:transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .hover-underline:hover::after{transform:scaleX(1);}

        /* ── EXP ROW HOVER ─────────────────────── */
        .exp-row{transition:background 0.3s;}

        /* ── RESPONSIVE TYPOGRAPHY ─────────────── */
        @media(max-width:480px){
          .hero-cta-group{flex-direction:column!important;}
          .hero-cta-group > a{width:100%!important;justify-content:center!important;}
        }
      `}</style>
    </main>
  );
}
