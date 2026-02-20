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

gsap.registerPlugin(ScrollTrigger);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DESIGN TOKENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const C = {
  bg: "#060606",
  bg2: "#0d0d0d",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.70)",
  faint: "rgba(255,255,255,0.48)",
  vfaint: "rgba(255,255,255,0.30)",
  ghost: "rgba(255,255,255,0.14)",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.025)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.35)",
  goldF: "rgba(201,168,76,0.10)",
  goldGrad: "linear-gradient(135deg, #DAA520 0%, #F5C842 50%, #B8860B 100%)",
};
const GRID = "rgba(201,168,76,0.025)";
const HN = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', 'Space Mono', monospace";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DATA = {
  nameFirst: "Amit",
  nameLast: "Chakraborty",
  tagline: "Eight years. Sixteen apps. No shortcuts.",
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
  email: "amit98ch@gmail.com",
  phone: "+91-9874173663",
  website: "devamit.co.in",
  github: "https://github.com/devamitch",
  githubAlt: "https://github.com/techamit95ch",
  linkedin: "https://linkedin.com/in/devamitch",
  medium: "https://devamitch.medium.com/",
  profileImage: "/images/amit-profile.jpg",
  profileFallback: "https://github.com/devamitch.png",

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

  projects: [
    {
      id: "spyk",
      name: "VitalQuest / Spyk Health",
      role: "Principal Architect",
      badge: "FLAGSHIP · HEALTHTECH",
      featured: true,
      tagline: "A game engine I built from nothing.",
      desc: "Custom game engine built from absolute scratch — zero dependencies, zero shortcuts. LLM-based dynamic health task generation, XP progression system, RAG pipeline for medical context. The hardest system I've ever architected.",
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
      desc: "Enterprise AI orchestration platform unifying Meta, TikTok, Shopify and 5+ marketing channels. Autonomous campaign analysis, real-time cross-platform optimization, agentic AI workflows.",
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
      desc: "Privacy-first women's health ecosystem with local-first storage and AI-driven wellness algorithms. Adaptive meditation engine, cycle tracking, mood journaling, personalized insights. Empathy-first design.",
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
      desc: "Real-time eye health monitoring using MediaPipe on-device. Retina coverage analysis, blink rate detection, redness assessment, and luminance tracking — medical-grade computer vision on consumer smartphones.",
      impact: [
        "Medical-grade CV on consumer hardware",
        "Real-time retina analysis",
        "Blink + redness + luminance detection",
      ],
      tech: ["React Native", "MediaPipe", "Computer Vision", "Gumlet API"],
      color: "#2196F3",
    },
    {
      id: "maskwa",
      name: "Maskwa",
      role: "Lead Architect & Strategic Partner",
      badge: "SOCIAL IMPACT",
      featured: false,
      tagline: "Technology that honors culture.",
      desc: "Platform for Canadian Indigenous communities — cultural preservation, community development, and economic empowerment through technology. Infrastructure that respects heritage while enabling the future.",
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
      id: "vulcan",
      name: "Vulcan Eleven",
      role: "Lead Mobile Engineer",
      badge: "SPORTS · FINTECH",
      featured: false,
      tagline: "50,000 users. Zero downtime.",
      desc: "Fantasy sports platform with 60fps performance. 50K+ users, Razorpay + Binance Pay dual-payment, 35% transaction growth. Post-merger redesign using React Native Reanimated and native C++ modules.",
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
      id: "be4you",
      name: "Be4You",
      role: "Lead Architect",
      badge: "SOCIAL · DATING",
      featured: false,
      tagline: "Full MVP. Built for seed funding.",
      desc: "Full dating app MVP: real-time chat via Socket.io, Zoom-style video calls, live geolocation, social + Apple auth. Delivered for seed funding round in under 90 days. Zero compromises.",
      impact: [
        "Full MVP for seed round",
        "Real-time video + chat + location",
        "90-day delivery",
      ],
      tech: ["WebRTC", "Socket.io", "Reanimated", "Video", "Node.js"],
      color: "#00BBF9",
    },
    {
      id: "defi11",
      name: "DeFi11",
      role: "Web3 Architect",
      badge: "DEFI",
      featured: false,
      tagline: "Fully on-chain. No compromise.",
      desc: "Fully decentralized fantasy sports. Smart contract prize pools, on-chain tournament logic, NFT marketplace, and complex staking mechanisms on Ethereum. Zero centralized custody.",
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
      id: "musicx",
      name: "MusicX",
      role: "Senior Engineer",
      badge: "WEB3 · MUSIC",
      featured: false,
      tagline: "Blockchain royalties for artists.",
      desc: "Music competition platform with blockchain-backed royalties. Native C++ Modules, 60fps animations, Twitter + Spotify API integration. High-performance streaming on React Native.",
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
      desc: "Property management platform with complex payment gateways, subscription billing (PayU + Google Pay), GraphQL APIs, Socket.io real-time notifications. Pixel-perfect iOS from Figma.",
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
    },
    {
      degree: "BCA",
      school: "The Heritage Academy, Kolkata",
      period: "2014—2017",
    },
  ],

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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTRIBUTION GRAPH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ContribGraph() {
  const weeks = 53;
  const data = useMemo(
    () =>
      Array.from({ length: weeks }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => {
          const seed = ((w * 7 + d) * 2654435761) >>> 0;
          const isWeekend = d === 0 || d === 6;
          if ((seed % 100) / 100 > (isWeekend ? 0.3 : 0.65)) return 0;
          return Math.floor(seed % 5);
        }),
      ),
    [],
  );
  const colors = [
    "rgba(201,168,76,0.07)",
    "rgba(201,168,76,0.22)",
    "rgba(201,168,76,0.42)",
    "rgba(201,168,76,0.68)",
    "rgba(201,168,76,0.92)",
  ];
  const months = [
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        padding: 24,
        border: `1px solid rgba(201,168,76,0.15)`,
        background: "rgba(201,168,76,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(201,168,76,0.7)",
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
              color: "#fff",
              letterSpacing: "-0.03em",
              fontFamily: HN,
            }}
          >
            2,029 <span style={{ color: C.gold }}>contributions</span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.vfaint,
              marginTop: 3,
              fontFamily: MONO,
            }}
          >
            Last 12 months · Mostly private repos
          </div>
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: "rgba(201,168,76,0.08)",
            lineHeight: 1,
            fontFamily: HN,
          }}
        >
          #1
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 720 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 6 }}>
            {months.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 9,
                  color: C.ghost,
                  fontFamily: MONO,
                  width: 40,
                }}
              >
                {m}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {data.map((week, wi) => (
              <div
                key={wi}
                style={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {week.map((level, di) => (
                  <motion.div
                    key={di}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: (wi * 7 + di) * 0.0004,
                      duration: 0.2,
                    }}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 2,
                      background: colors[level],
                      cursor: "pointer",
                    }}
                    whileHover={{ scale: 1.4 }}
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
                color: "rgba(201,168,76,0.5)",
                fontFamily: MONO,
              }}
            >
              Less
            </span>
            {colors.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 2,
                  background: c,
                }}
              />
            ))}
            <span
              style={{
                fontSize: 9,
                color: "rgba(201,168,76,0.5)",
                fontFamily: MONO,
              }}
            >
              More
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCROLL PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  return (
    <motion.div
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: C.goldGrad,
        transformOrigin: "left",
        zIndex: 999,
      }}
    />
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION LABEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SLabel({ children }: { children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div style={{ height: 1, width: 40, background: C.gold }} />
      <span
        style={{
          fontSize: 10,
          color: C.gold,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontFamily: MONO,
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROJECT CARD — 3D TILT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectCard({ p, i }: { p: (typeof DATA.projects)[0]; i: number }) {
  const [hov, setHov] = useState(false);
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * 8);
    ry.set(-((e.clientX - r.left) / r.width - 0.5) * 8);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        perspective: 900,
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
          border: `1px solid ${hov ? "rgba(201,168,76,0.45)" : p.featured ? "rgba(201,168,76,0.18)" : C.border}`,
          background: p.featured
            ? "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)"
            : C.card,
          padding: p.featured ? 32 : 26,
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: hov ? "0 24px 60px rgba(0,0,0,0.25)" : "none",
          height: "100%",
        }}
      >
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
                fontSize: 9,
                color: p.color || C.gold,
                letterSpacing: "0.3em",
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
                fontSize: p.featured ? 26 : 20,
                fontWeight: 900,
                color: hov ? C.gold : C.text,
                letterSpacing: "-0.025em",
                transition: "color 0.2s",
                fontFamily: HN,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {p.name}
            </h3>
          </div>
          {p.featured && (
            <div
              style={{
                fontSize: 9,
                padding: "5px 10px",
                background: "rgba(201,168,76,0.1)",
                border: `1px solid rgba(201,168,76,0.3)`,
                color: C.gold,
                fontFamily: MONO,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              FEATURED
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 11,
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
              fontSize: 14,
              color: C.gold,
              fontStyle: "italic",
              marginBottom: 12,
              fontWeight: 300,
            }}
          >
            {p.tagline}
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
            padding: "12px 16px",
            borderLeft: `2px solid ${C.goldD}`,
            background: "rgba(201,168,76,0.03)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: C.gold,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: MONO,
              marginBottom: 8,
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
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: C.gold, flexShrink: 0 }}>→</span>
              {item}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {p.tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 9,
                padding: "4px 8px",
                border: `1px solid ${hov ? "rgba(201,168,76,0.25)" : C.border}`,
                color: hov ? "rgba(201,168,76,0.75)" : C.vfaint,
                fontFamily: MONO,
                transition: "all 0.2s",
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
              fontSize: 11,
              color: "rgba(201,168,76,0.6)",
              fontFamily: MONO,
              textDecoration: "none",
            }}
          >
            View Live ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT FORM (inline, no file upload)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
    padding: "14px 16px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${C.border}`,
    color: C.text,
    fontFamily: "inherit",
    borderRadius: 0,
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={{ ...lbl, color: C.gold }}>Name *</label>
          <input
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inp}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(201,168,76,0.4)";
              e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.06)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
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
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(201,168,76,0.4)";
              e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.06)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={lbl}>Company</label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={inp}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
            }}
          />
        </div>
        <div>
          <label style={lbl}>Your Role</label>
          <input
            type="text"
            placeholder="CTO / Founder / VP Eng"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={inp}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = C.border;
            }}
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
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(201,168,76,0.4)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = C.border;
          }}
        />
      </div>
      <div>
        <label style={{ ...lbl, color: C.gold }}>Message *</label>
        <textarea
          required
          rows={6}
          placeholder="Tell me about your project or opportunity..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ ...inp, resize: "vertical", minHeight: 130 }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(201,168,76,0.4)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = C.border;
          }}
        />
        <div
          style={{
            fontSize: 10,
            color: C.ghost,
            marginTop: 4,
            fontFamily: MONO,
          }}
        >
          {form.message.length} / 5000
        </div>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          width: "100%",
          padding: 18,
          background: C.goldGrad,
          border: "none",
          color: "#000",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: MONO,
          cursor: status === "sending" ? "not-allowed" : "pointer",
          opacity: status === "sending" ? 0.65 : 1,
          boxShadow:
            status !== "sending" ? "0 6px 20px rgba(201,168,76,0.3)" : "none",
        }}
      >
        {status === "idle"
          ? "Send Message →"
          : status === "sending"
            ? "Sending..."
            : status === "success"
              ? "Message Sent ✓"
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
              background: "rgba(76,175,80,0.08)",
              border: "1px solid rgba(76,175,80,0.25)",
              color: "rgba(100,200,110,0.9)",
              fontSize: 12,
              fontFamily: MONO,
            }}
          >
            ✅ Message sent! I&apos;ll respond within 24 hours.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN HOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 80]);
  const txtY = useTransform(scrollY, [0, 700], [0, -40]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const [roleIdx, setRoleIdx] = useState(0);
  const [skillTab, setSkillTab] = useState(0);
  const [contactTab, setContactTab] = useState<"message" | "meeting">(
    "message",
  );

  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % DATA.roles.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-stats-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          delay: 1.6,
        },
      );
      gsap.to(".gsap-grid-hero", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: ".gsap-grid-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const featured = DATA.projects.filter((p) => p.featured);
  const rest = DATA.projects.filter((p) => !p.featured);

  return (
    <main
      style={{
        fontFamily: HN,
        background: C.bg,
        color: C.text,
        overflowX: "hidden",
      }}
    >
      <ScrollProgress />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Ambient orbs */}
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
          { x: "8%", y: "15%", s: 400, d: 0 },
          { x: "76%", y: "55%", s: 280, d: 3 },
          { x: "45%", y: "88%", s: 220, d: 6 },
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
                "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 68%)",
              filter: "blur(60px)",
              borderRadius: "50%",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: 9 + i * 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: o.d,
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
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
        {/* Grid background */}
        <div
          className="gsap-grid-hero"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Atmo glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[
            { x: "-5%", y: "5%", s: 700 },
            { x: "68%", y: "55%", s: 500 },
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
                  "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 60%)",
                filter: "blur(100px)",
                borderRadius: "50%",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          style={{
            opacity: fade,
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "100px 24px 60px",
          }}
        >
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${C.goldD}`,
              background: C.goldF,
              padding: "10px 20px",
              marginBottom: 48,
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
                fontSize: 10,
                color: C.gold,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontFamily: MONO,
                fontWeight: 600,
              }}
            >
              Available · VP · CTO · Principal Architect
            </span>
          </motion.div>

          {/* Two-column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 64,
              alignItems: "center",
            }}
            className="hero-inner-grid"
          >
            {/* LEFT */}
            <motion.div style={{ y: txtY }}>
              {/* Big name */}
              <div style={{ overflow: "hidden", marginBottom: 4 }}>
                <motion.div
                  initial={{ y: 140 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.1,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
                    fontWeight: 900,
                    lineHeight: 0.87,
                    letterSpacing: "-0.04em",
                    color: C.text,
                  }}
                >
                  {DATA.nameFirst}
                </motion.div>
              </div>
              <div style={{ overflow: "hidden", marginBottom: 20 }}>
                <motion.div
                  initial={{ y: 140 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.1,
                    delay: 0.34,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontSize: "clamp(3rem, 7.5vw, 6.5rem)",
                    fontWeight: 800,
                    lineHeight: 0.9,
                    letterSpacing: "1px",
                    WebkitTextStroke: "2px rgba(201,168,76,0.55)",
                    color: "transparent",
                  }}
                >
                  {DATA.nameLast}
                </motion.div>
              </div>

              {/* Tagline */}
              <div style={{ overflow: "hidden", marginBottom: 18 }}>
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.52,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.4rem)",
                    fontWeight: 300,
                    color: C.dim,
                    letterSpacing: "0.02em",
                  }}
                >
                  {DATA.tagline}
                </motion.div>
              </div>

              {/* Rotating role */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 28,
                  height: 36,
                }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{
                    height: 1,
                    width: 40,
                    background: C.gold,
                    transformOrigin: "left",
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
                        color: C.gold,
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

              {/* Manifesto */}
              <div style={{ marginBottom: 36 }}>
                {DATA.manifesto.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.12 }}
                    style={{
                      fontSize: 15,
                      color: i === 2 ? C.gold : C.dim,
                      lineHeight: 1.65,
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
              >
                <a
                  href="#work"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.goldGrad,
                    color: "#000",
                    padding: "14px 28px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  See My Work →
                </a>
                <a
                  href="#contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: `2px solid ${C.goldD}`,
                    color: C.gold,
                    padding: "14px 28px",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  Let's Build Together
                </a>
                <a
                  href={DATA.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${C.border}`,
                    color: C.faint,
                    padding: "14px 22px",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: MONO,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
                >
                  LinkedIn ↗
                </a>
              </motion.div>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 32,
                  marginTop: 40,
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
                        fontFamily: MONO,
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
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.1 }}
              style={{ display: "flex", justifyContent: "center" }}
              className="hero-photo-col"
            >
              <motion.div style={{ y: imgY, position: "relative" }}>
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
                <div
                  style={{
                    position: "absolute",
                    inset: -50,
                    background:
                      "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 65%)",
                    filter: "blur(40px)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    width: 300,
                    height: 300,
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
                    sizes="300px"
                    priority
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(6,6,6,0.4) 0%, transparent 60%)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: -28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.35em",
                      textTransform: "uppercase",
                      fontFamily: MONO,
                      color: C.ghost,
                    }}
                  >
                    Amit Chakraborty
                  </span>
                </div>
                {[
                  {
                    label: "Years",
                    value: `${getYears()}+`,
                    pos: { top: 0, left: -52 },
                  },
                  { label: "Apps", value: "16+", pos: { top: 50, right: -56 } },
                  {
                    label: "Users",
                    value: "50K+",
                    pos: { bottom: 70, left: -56 },
                  },
                  {
                    label: "Uptime",
                    value: "99.9%",
                    pos: { bottom: 10, right: -46 },
                  },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 1.4 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    style={{
                      position: "absolute",
                      ...s.pos,
                      background: "rgba(6,6,6,0.97)",
                      border: `1px solid rgba(201,168,76,0.3)`,
                      padding: "10px 14px",
                      borderRadius: 8,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                      backdropFilter: "blur(12px)",
                      minWidth: 68,
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
                        fontSize: 8,
                        color: C.ghost,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="gsap-stats-item"
            style={{
              marginTop: 80,
              paddingTop: 40,
              borderTop: `1px solid ${C.border}`,
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 32,
            }}
          >
            {[
              { n: getYears(), s: "+", l: "Years Engineering" },
              { n: 16, s: "+", l: "Apps Shipped" },
              { n: 50, s: "K+", l: "Active Users" },
              { n: 2029, s: "", l: "GitHub Contributions" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.08 }}
              >
                <div
                  style={{
                    fontSize: "clamp(36px,5vw,52px)",
                    fontWeight: 900,
                    color: C.gold,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 6,
                    fontFamily: HN,
                  }}
                >
                  {s.n}
                  {s.s}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: C.vfaint,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
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
              fontSize: 9,
              color: C.ghost,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              fontFamily: MONO,
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              width: 1,
              height: 40,
              background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* Marquee */}
      <div
        style={{
          overflow: "hidden",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "18px 0",
          background: "rgba(201,168,76,0.015)",
        }}
      >
        <div className="marquee-track">
          {[
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
          ].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: item === "•" ? "inherit" : HN,
                fontSize: item === "•" ? 12 : "clamp(13px,1.8vw,17px)",
                fontWeight: item === "•" ? 400 : 700,
                color:
                  item === "•"
                    ? "rgba(201,168,76,0.25)"
                    : "rgba(255,255,255,0.13)",
                letterSpacing: item === "•" ? 0 : "0.05em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                padding: "0 14px",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          WORK
      ════════════════════════════════════════════════ */}
      <section id="work" style={{ padding: "120px 0", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>Executive Portfolio</SLabel>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 64 }}
          >
            <h2
              style={{
                fontSize: "clamp(36px,5vw,72px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: C.text,
                lineHeight: 0.92,
                marginBottom: 20,
                fontFamily: HN,
              }}
            >
              Building systems
              <br />
              <span style={{ color: C.ghost }}>that actually scale.</span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: C.dim,
                maxWidth: 540,
                fontWeight: 300,
                lineHeight: 1.65,
              }}
            >
              From AI-powered HealthTech to Indigenous community platforms.
              Every project architected to VP-level standards — engineered for
              real-world impact.
            </p>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 20,
              marginBottom: 20,
            }}
          >
            {featured.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} />
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {rest.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i + featured.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          EXPERIENCE
      ════════════════════════════════════════════════ */}
      <section
        id="experience"
        style={{ padding: "100px 0", background: C.bg2 }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>Career Timeline</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(32px,4vw,56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: C.text,
              lineHeight: 0.92,
              marginBottom: 64,
              fontFamily: HN,
            }}
          >
            3 companies.
            <br />
            <span style={{ color: C.ghost }}>8+ years. Zero shortcuts.</span>
          </motion.h2>
          {DATA.experience.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 180px",
                gap: 32,
                alignItems: "start",
                paddingBlock: 40,
                borderTop: `1px solid ${C.border}`,
                transition: "background 0.3s",
              }}
              className="exp-row"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.01)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.vfaint,
                    fontFamily: MONO,
                    marginBottom: 6,
                  }}
                >
                  {exp.period}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: exp.color,
                    fontFamily: MONO,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    opacity: 0.85,
                  }}
                >
                  {exp.type}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: C.text,
                    marginBottom: 4,
                    letterSpacing: "-0.02em",
                    fontFamily: HN,
                  }}
                >
                  {exp.company}
                </h3>
                <div style={{ fontSize: 13, color: C.dim, marginBottom: 16 }}>
                  {exp.role} · {exp.location}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {exp.highlights.map((pt) => (
                    <div
                      key={pt}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: exp.color,
                          flexShrink: 0,
                          marginTop: 1,
                          fontSize: 10,
                        }}
                      >
                        →
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: C.dim,
                          lineHeight: 1.65,
                          fontWeight: 300,
                        }}
                      >
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  paddingTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    padding: "4px 8px",
                    border: `1px solid rgba(201,168,76,0.2)`,
                    color: exp.color,
                    fontFamily: MONO,
                  }}
                >
                  {exp.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <hr
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            border: "none",
            opacity: 0.4,
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════
          SKILLS — TAB-BASED, NO EMOJIS
      ════════════════════════════════════════════════ */}
      <section id="skills" style={{ padding: "120px 0", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>Technical Arsenal</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(36px,5vw,72px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: C.text,
              lineHeight: 0.92,
              marginBottom: 48,
              fontFamily: HN,
            }}
          >
            Deep stack.
            <br />
            <span style={{ color: C.ghost }}>Not full stack.</span>
          </motion.h2>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 32,
            }}
          >
            {DATA.skills.map((s, i) => (
              <button
                key={s.cat}
                onClick={() => setSkillTab(i)}
                style={{
                  padding: "9px 16px",
                  fontSize: 10,
                  fontFamily: MONO,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  background: skillTab === i ? C.gold : "transparent",
                  color: skillTab === i ? "#000" : C.faint,
                  border: `1px solid ${skillTab === i ? C.gold : C.border}`,
                  transition: "all 0.2s",
                  fontWeight: skillTab === i ? 700 : 400,
                }}
              >
                {s.cat}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={skillTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 10,
              }}
            >
              {DATA.skills[skillTab].items.map((sk, i) => (
                <motion.div
                  key={sk}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    padding: "14px 18px",
                    border: `1px solid ${C.border}`,
                    background: C.card,
                    cursor: "default",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(201,168,76,0.35)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = C.border)
                  }
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

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <hr
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            border: "none",
            opacity: 0.4,
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════
          STORY — ALTERNATING LEFT/RIGHT
      ════════════════════════════════════════════════ */}
      <section id="story" style={{ padding: "120px 0", background: C.bg2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>Eight Years. No Shortcuts.</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(36px,5vw,72px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: C.text,
              lineHeight: 0.92,
              marginBottom: 80,
              fontFamily: HN,
            }}
          >
            From government portals
            <br />
            <span style={{ color: C.ghost }}>to AI-powered systems.</span>
          </motion.h2>
          <div style={{ position: "relative" }}>
            {/* Center line */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                background: `linear-gradient(to bottom, transparent, ${C.goldD}, transparent)`,
              }}
              className="story-center-line"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
              {DATA.story.map((ch, i) => (
                <motion.div
                  key={ch.yr}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 48,
                    alignItems: "center",
                  }}
                  className="story-row"
                >
                  {/* Left side content for even, right for odd */}
                  <div
                    style={{
                      textAlign: i % 2 === 0 ? "right" : "left",
                      order: i % 2 === 0 ? 1 : 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 60,
                        fontWeight: 900,
                        color: "rgba(201,168,76,0.08)",
                        fontFamily: MONO,
                        lineHeight: 1,
                        marginBottom: 8,
                      }}
                    >
                      {ch.yr}
                    </div>
                    <h3
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        color: C.text,
                        marginBottom: 12,
                        letterSpacing: "-0.02em",
                        fontFamily: HN,
                      }}
                    >
                      {ch.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        color: C.dim,
                        lineHeight: 1.75,
                        fontWeight: 300,
                      }}
                    >
                      {ch.text}
                    </p>
                  </div>
                  {/* Empty side + dot */}
                  <div
                    style={{ order: i % 2 === 0 ? 2 : 1, position: "relative" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      style={{
                        position: "absolute",
                        left: i % 2 === 0 ? -7 : "auto",
                        right: i % 2 === 0 ? "auto" : -7,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: C.gold,
                        border: `3px solid ${C.bg2}`,
                        zIndex: 10,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          GITHUB / CONTRIBUTIONS
      ════════════════════════════════════════════════ */}
      <section id="github" style={{ padding: "80px 0", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>Open Source</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(32px,4vw,56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: C.text,
              lineHeight: 0.92,
              marginBottom: 40,
              fontFamily: HN,
            }}
          >
            Shipping code.
            <br />
            <span style={{ color: C.ghost }}>Every. Single. Day.</span>
          </motion.h2>
          <ContribGraph />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 20,
            }}
          >
            {[
              { label: "GitHub (Primary)", url: DATA.github, sub: "devamitch" },
              {
                label: "GitHub (Archive)",
                url: DATA.githubAlt,
                sub: "techamit95ch",
              },
            ].map((g) => (
              <a
                key={g.url}
                href={g.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  border: `1px solid ${C.border}`,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = C.goldD)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.border)
                }
              >
                <span style={{ fontSize: 18, color: C.gold }}>⬡</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                    {g.label}
                  </div>
                  <div
                    style={{ fontSize: 10, fontFamily: MONO, color: C.vfaint }}
                  >
                    {g.sub}
                  </div>
                </div>
                <span
                  style={{ marginLeft: "auto", fontSize: 12, color: C.vfaint }}
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        style={{ padding: "120px 0", background: C.bg2 }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>What Leaders Say</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(36px,5vw,72px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: C.text,
              lineHeight: 0.92,
              marginBottom: 16,
              fontFamily: HN,
            }}
          >
            Leaders endorse me.
            <br />
            <span style={{ color: C.ghost }}>Teams grow under me.</span>
          </motion.h2>
          <p
            style={{
              fontSize: 14,
              color: C.dim,
              marginBottom: 64,
              fontStyle: "italic",
              fontWeight: 300,
            }}
          >
            Ordered by seniority — from direct manager to mentored developers.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
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
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  position: "relative",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.border)
                }
              >
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 8,
                    padding: "4px 10px",
                    border: `1px solid ${t.seniorityColor}`,
                    color: t.seniorityColor,
                    fontFamily: MONO,
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
                    fontSize: 54,
                    color: "rgba(255,255,255,0.04)",
                    position: "absolute",
                    top: 16,
                    right: 24,
                    lineHeight: 1,
                    userSelect: "none",
                    fontFamily: "Georgia",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: C.dim,
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
                        color: C.text,
                        textDecoration: "none",
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
                    <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
                      {t.role}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: t.seniorityColor,
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

      {/* ════════════════════════════════════════════════
          BLOG
      ════════════════════════════════════════════════ */}
      <section id="blog" style={{ padding: "80px 0", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <SLabel>Writing & Thoughts</SLabel>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(32px,4vw,56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: C.text,
              lineHeight: 0.92,
              marginBottom: 48,
              fontFamily: HN,
            }}
          >
            I think in systems.
            <br />
            <span style={{ color: C.ghost }}>I write in posts.</span>
          </motion.h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
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
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = C.goldD)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.border)
                }
              >
                <div
                  style={{
                    fontSize: 9,
                    color: C.gold,
                    letterSpacing: "0.28em",
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
                    fontFamily: MONO,
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

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <hr
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            border: "none",
            opacity: 0.4,
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "120px 0", background: C.bg2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr",
              gap: 64,
              alignItems: "start",
            }}
            className="contact-grid"
          >
            {/* Left */}
            <div>
              <SLabel>Let's Connect</SLabel>
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
                  lineHeight: 1.7,
                  marginBottom: 40,
                  fontWeight: 300,
                }}
              >
                VP Engineering. CTO. Principal Architect. I build systems that
                scale, lead teams that ship, and turn technical vision into
                business reality. Let's talk.
              </p>
              {[
                { l: "Email", v: DATA.email, h: `mailto:${DATA.email}` },
                { l: "Phone", v: DATA.phone, h: `tel:${DATA.phone}` },
                {
                  l: "LinkedIn",
                  v: "linkedin.com/in/devamitch",
                  h: DATA.linkedin,
                },
                { l: "GitHub", v: "github.com/devamitch", h: DATA.github },
                { l: "Medium", v: "devamitch.medium.com", h: DATA.medium },
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
                    paddingBottom: 14,
                    marginBottom: 14,
                    borderBottom: `1px solid ${C.border}`,
                    textDecoration: "none",
                    transition: "border-color 0.2s",
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
                      fontSize: 10,
                      color: C.vfaint,
                      letterSpacing: "0.25em",
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
                      transition: "color 0.2s",
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

            {/* Right — contact form + meeting scheduler */}
            <div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {[
                  { key: "message" as const, label: "Send Message" },
                  { key: "meeting" as const, label: "Schedule Meeting" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setContactTab(tab.key)}
                    style={{
                      flex: 1,
                      padding: "13px 16px",
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      background:
                        contactTab === tab.key
                          ? C.gold
                          : "rgba(255,255,255,0.02)",
                      color: contactTab === tab.key ? "#000" : C.faint,
                      border: `1px solid ${contactTab === tab.key ? C.gold : C.border}`,
                      fontWeight: contactTab === tab.key ? 700 : 400,
                      transition: "all 0.3s",
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

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer
        style={{
          padding: "48px 0",
          borderTop: `1px solid ${C.border}`,
          background: C.bg,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
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
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: C.text,
                fontFamily: HN,
              }}
            >
              <span style={{ color: C.gold }}>A</span>C
              <span style={{ color: "rgba(201,168,76,0.5)" }}>.</span>
            </span>
            <p
              style={{
                fontSize: 10,
                color: C.ghost,
                fontFamily: MONO,
                marginTop: 4,
              }}
            >
              Principal Mobile Architect · VP Engineering · {DATA.location}
            </p>
          </div>
          <p
            style={{
              fontSize: 10,
              color: C.ghost,
              fontFamily: MONO,
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Amit Chakraborty · Built by hand. Not
            by prompt.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
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
                style={{
                  fontSize: 11,
                  fontFamily: MONO,
                  letterSpacing: "0.15em",
                  color: C.vfaint,
                  textDecoration: "none",
                  transition: "color 0.2s",
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
        @keyframes ac-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .hero-inner-grid { grid-template-columns: 1.1fr 0.9fr !important; }
        .hero-photo-col { display: flex !important; }
        @media (max-width: 960px) {
          .hero-inner-grid { grid-template-columns: 1fr !important; }
          .hero-photo-col { display: none !important; }
        }
        @media (max-width: 900px) {
          .story-center-line { display: none !important; }
          .story-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .exp-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
