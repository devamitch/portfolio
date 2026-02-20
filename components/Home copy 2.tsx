"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ASSETS } from "~/assets";
import SecureContactForm from "./SecureContactForm";

// ═══════════════════════════════════════════════════════════════
// SEO — add to layout.tsx / page.tsx metadata:
// title: "Amit Chakraborty — Principal Architect · VP Engineering · CTO"
// description: "8+ years. 16+ apps. 50K+ users. AI, HealthTech, Blockchain, React Native."
// ═══════════════════════════════════════════════════════════════

// ─── DESIGN TOKENS — DARK ONLY ───────────────────────────────
const C = {
  bg: "#060606",
  bg2: "#0D0D0D",
  text: "#FFFFFF",
  dim: "rgba(255,255,255,0.70)",
  faint: "rgba(255,255,255,0.48)",
  vfaint: "rgba(255,255,255,0.30)",
  ghost: "rgba(255, 255, 255, 0.31)",
  border: "rgba(255,255,255,0.09)",
  card: "rgba(255,255,255,0.03)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.35)",
  goldF: "rgba(201,168,76,0.12)",
  goldGrad: "linear-gradient(135deg, #DAA520 0%, #F5C842 50%, #B8860B 100%)",
  goldGlow: "0 0 40px rgba(201,168,76,0.18), 0 0 80px rgba(201,168,76,0.08)",
};

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const DATA = {
  nameFirst: "Amit",
  nameLast: "Chakraborty",
  title: "Principal Mobile Architect · VP Engineering",
  tagline: "Eight years. Sixteen apps. No shortcuts.",
  manifesto: [
    "Before AI could write a line of code, I was building production systems.",
    "16+ apps shipped. 50K+ real users. Zero outsourced decisions.",
    "I architect systems that outlast the hype.",
  ],
  roles: ["VP Engineering", "Principal Architect", "CTO", "Technical Lead"],
  email: "amit98ch@gmail.com",
  phone: "+91-9874173663",
  linkedin: "https://www.linkedin.com/in/devamitch/",
  github: "https://github.com/devamitch",
  githubAlt: "https://github.com/techamit95ch",
  medium: "https://devamitch.medium.com/",
  location: "Kolkata, India · Remote Worldwide",
  started: "2017-05-01",

  projects: [
    // FEATURED
    {
      id: "myteal",
      name: "myTeal",
      featured: true,
      badge: "WOMEN'S HEALTH",
      cat: "HealthTech · Mindfulness · Women's Wellness",
      role: "Lead Mobile Architect",
      tagline: "Wellness that finally understands women.",
      desc: "Holistic women's health platform: cycle tracking, mood journaling, AI-guided meditation, and personalized wellness insights. Built with an empathy-first design and privacy-first data architecture. One of the most purpose-driven systems I've built.",
      impact: [
        "Personalised cycle + mood + sleep tracking",
        "AI wellness recommendations engine",
        "Privacy-first health data — zero third-party sells",
      ],
      tech: ["React Native", "Node.js", "AI/ML", "Health APIs", "TypeScript"],
      color: "#20B2AA",
    },
    {
      id: "thoth",
      name: "Thoth AI",
      featured: true,
      badge: "AI PLATFORM",
      cat: "AI · MarTech · Enterprise",
      role: "Principal Architect",
      tagline: "One brain for all your marketing channels.",
      desc: "Enterprise AI orchestration platform unifying Shopify, TikTok, Meta, and 5+ marketing channels into a single intelligent command center. Built recommendation engine for real-time cross-platform campaign optimization.",
      impact: [
        "5+ platforms unified into one AI brain",
        "Autonomous campaign recommendations",
        "Real-time cross-channel analytics",
      ],
      tech: [
        "React Native",
        "Next.js",
        "Agentic AI",
        "Multi-API",
        "Real-time Analytics",
      ],
      color: "#C9A84C",
    },
    {
      id: "spyk",
      name: "Spyk Health",
      featured: true,
      badge: "FLAGSHIP",
      cat: "HealthTech · Gamification · AI",
      role: "Principal Architect",
      tagline: "A game engine I built from nothing.",
      desc: "Custom game engine built from absolute scratch — zero dependencies, zero shortcuts. LLM-based dynamic task generation, XP progression system, and AI-powered health engagement pipelines. The hardest thing I've ever architected.",
      impact: [
        "Custom game engine — zero external deps",
        "LLM task generation at runtime",
        "RAG pipeline for medical context",
      ],
      tech: [
        "React Native",
        "Custom Game Engine",
        "LLMs",
        "RAG Pipelines",
        "Node.js",
      ],
      color: "#4CAF50",
    },
    {
      id: "olo",
      name: "oLo Eye Care",
      featured: true,
      badge: "MEDTECH",
      cat: "HealthTech · Computer Vision · Medical",
      role: "Technical Lead",
      tagline: "Your phone becomes a medical device.",
      desc: "Real-time eye health monitoring using MediaPipe on-device. Retina coverage analysis, blink rate detection, redness assessment, and luminance tracking — medical-grade computer vision on a consumer smartphone.",
      impact: [
        "Medical-grade CV on consumer hardware",
        "Real-time retina analysis",
        "Blink + redness detection",
      ],
      tech: ["React Native", "MediaPipe", "Computer Vision", "Gumlet API"],
      color: "#2196F3",
    },
    {
      id: "vboil",
      name: "vBoil (Vanbrant Oil)",
      featured: true,
      badge: "GREENTECH",
      cat: "GreenTech · Sustainability · B2B",
      role: "Lead Mobile Architect",
      tagline: "Digitizing the green oil supply chain.",
      desc: "End-to-end recycled oil management platform covering the entire supply chain — B2B transaction flows, geolocation tracking, environmental impact analytics, lifecycle monitoring from collection to distribution.",
      impact: [
        "Full recycled-oil supply chain digitized",
        "B2B transaction layer built",
        "Environmental impact dashboard",
      ],
      tech: [
        "React Native",
        "Node.js",
        "PostgreSQL",
        "Geolocation",
        "Analytics",
      ],
      color: "#8BC34A",
    },
    {
      id: "maskwa",
      name: "Maskwa",
      featured: true,
      badge: "LEGACY",
      cat: "Social Impact · Indigenous Tech",
      role: "Lead Architect & Strategic Partner",
      tagline: "Technology that honors culture.",
      desc: "Platform for Canadian Indigenous communities — cultural preservation, community development, and economic empowerment through technology. The project I'm most proud of. Infrastructure that respects heritage while enabling the future.",
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
    // NON-FEATURED
    {
      id: "vulcan",
      name: "Vulcan Eleven",
      featured: false,
      badge: "SPORTS",
      cat: "Sports · FinTech · Web3",
      role: "Lead Architect",
      tagline: "50,000 users. Zero downtime.",
      desc: "Fantasy sports platform. 50K+ users, Razorpay + Binance Pay dual-payment. 35% transaction growth. Post-merger redesign.",
      impact: [
        "50K+ active users",
        "35% transaction growth",
        "Binance Pay integration",
      ],
      tech: ["React Native", "Razorpay", "Binance Pay", "PostgreSQL"],
      color: "#E91E63",
      link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    },
    {
      id: "be4you",
      name: "Be4You",
      featured: false,
      badge: "SOCIAL",
      cat: "Social · Dating · Real-Time",
      role: "Lead Mobile Developer (Freelance)",
      tagline: "Full MVP. Built for seed funding.",
      desc: "Complete dating app MVP: real-time chat via Socket.io, Zoom-style video calls, live location, social + Apple auth,animations. Delivered for client's seed funding round in under 90 days.",
      impact: [
        "Full MVP delivered for seed round",
        "Real-time video + chat + location",
        "90-day delivery, zero compromises",
      ],
      tech: ["React Native", "Socket.io", "WebRTC", "Node.js", "Maps"],
      color: "#E91E63",
    },
    {
      id: "housezy",
      name: "Housezy",
      featured: false,
      badge: "PROPTECH",
      cat: "PropTech · Automation · Subscription",
      role: "Lead Mobile Developer",
      tagline: "Housing automation, reimagined.",
      desc: "Housing automation platform with subscription billing, PayU + Google Pay, GraphQL APIs, Socket.io real-time notifications. Pixel-perfect iOS app from Figma to production.",
      impact: [
        "Subscription billing layer",
        "Real-time notifications via Socket.io",
        "PayU + Google Pay integration",
      ],
      tech: ["React Native", "GraphQL", "Socket.io", "PayU", "Subscription"],
      color: "#9C27B0",
      link: "https://apps.apple.com/app/housezy/id6471949955",
    },
    {
      id: "musicx",
      name: "MusicX",
      featured: false,
      badge: "WEB3",
      cat: "Web3 · Entertainment",
      role: "Lead Mobile Developer",
      tagline: "Blockchain royalties for artists.",
      desc: "Music competition platform with blockchain-backed royalties. Native Modules in C++. 60fps animations. Twitter + Spotify API integration.",
      impact: [
        "Blockchain royalty system",
        "C++ native modules",
        "60fps animations",
      ],
      tech: ["React Native", "Blockchain", "Native C++ Modules", "TypeScript"],
      color: "#9C27B0",
      link: "https://apps.apple.com/app/music-x/id6475713772",
    },
    {
      id: "defi11",
      name: "DeFi11",
      featured: false,
      badge: "DEFI",
      cat: "DeFi · Blockchain · Sports",
      role: "Founding Engineer",
      tagline: "Fully on-chain. No compromise.",
      desc: "Fully decentralized fantasy sports. Smart contract prize pools. On-chain tournament logic. Zero centralized custody.",
      impact: [
        "100% on-chain prize pools",
        "Smart contract architecture",
        "Zero-trust design",
      ],
      tech: ["React Native", "Solidity", "Web3.js", "Ethereum"],
      color: "#607D8B",
      link: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
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
      text: "I had the pleasure of working with Amit for three years and witnessed his impressive growth from Front-End Developer to Front-End Lead. Amit is someone I can always rely on for high-quality work and timely project delivery. His expertise and dedication make him a valuable asset to any team.",
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
      text: "Amit had been an amicable and diligent developer, one of the most dependable Engineers when it comes to delivery or urgent closures. We appreciate his understandability, capability to rebuild any project from scratch and his issues identification.",
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
      text: "I had the chance to work closely with Amit during several fast-paced release cycles. He played a key role in code reviews, ensuring quality and consistency across the codebase while guiding multiple teams through complex technical tasks and blockers. Reliable, technically strong, and a great support.",
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
      text: "Amit played a pivotal role in mentoring me, sharing his profound knowledge of Redux, React Native, and frontend concepts. His guidance helped me build a solid foundation. His enthusiasm for coding and pursuit for perfection are truly inspiring.",
      li: "https://www.linkedin.com/in/varun-chodha/",
      date: "October 2024",
    },
  ],

  experience: [
    {
      title: "Senior Mobile Architect & Technical Lead",
      co: "Synapsis Medical Technologies Inc.",
      loc: "Edmonton, Canada (Remote)",
      period: "Jan 2025 – Feb 2026",
      type: "VP-Level Engineering",
      points: [
        "Led engineering team of 21+ developers across 5 production iOS + Android apps",
        "Managed 500+ projects with VP-level client relationships and technical strategy",
        "Built game engine from zero with LLM-based dynamic task generation",
        "Architected HIPAA-compliant RAG pipelines for medical data retrieval",
        "Migrated full codebase to React Native Bridgeless Architecture",
        "Reduced deployment time 30% via CI/CD — 99.9% uptime across all systems",
      ],
      stack: [
        "React Native",
        "AI/ML",
        "RAG",
        "Solidity",
        "Django",
        "Next.js",
        "AWS",
      ],
    },
    {
      title: "Lead Mobile Developer & Senior Front-End Developer",
      co: "NonceBlox Pvt. Ltd.",
      loc: "Dubai (Remote)",
      period: "Oct 2021 – Jan 2025",
      type: "Technical Leadership",
      points: [
        "Shipped 13+ mobile apps to production — 7 iOS, 6 Android",
        "Built blockchain integrations across DeFi, NFT, staking, and payment platforms",
        "Architected apps serving 50,000+ active users across iOS and Android",
        "Conducted technical interviews — built and scaled high-performing teams",
        "Mentored developers from foundational to senior-level production proficiency",
      ],
      stack: [
        "React Native",
        "Solidity",
        "Web3.js",
        "Node.js",
        "GraphQL",
        "TypeScript",
      ],
    },
    {
      title: "Sr. PHP Developer",
      co: "Techpromind & Webskitters",
      loc: "Kolkata, India",
      period: "May 2017 – Oct 2021",
      type: "Full-Stack Engineering",
      points: [
        "Delivered 13 government digital projects — security, functionality, restructuring",
        "Built GST platform: Android app + PHP portal + VB.net software from zero",
        "Enhanced system efficiency 40% through architectural overhaul",
        "Developed proprietary PHP framework and AngularJS solutions",
      ],
      stack: ["PHP", "Laravel", "AngularJS", "MySQL", "Android", "VB.NET"],
    },
  ],

  skills: [
    {
      cat: "Mobile",
      items: [
        "React Native (Expert)",
        "Expo",
        "TypeScript",
        "Native Modules (C++)",
        "iOS",
        "Android",
        "Bridgeless Arch",
      ],
    },
    {
      cat: "AI & ML",
      items: [
        "RAG Pipelines",
        "Agentic AI",
        "LLM Integration",
        "Computer Vision",
        "MediaPipe",
        "TensorFlow",
        "Pinecone",
      ],
    },
    {
      cat: "Blockchain",
      items: [
        "Solidity",
        "Web3.js",
        "Ethers.js",
        "DeFi Protocols",
        "Smart Contracts",
        "NFT Dev",
        "NEAR",
        "Hedera",
      ],
    },
    {
      cat: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "Django",
        "Next.js",
        "GraphQL",
        "REST APIs",
        "WebSockets",
      ],
    },
    {
      cat: "Frontend",
      items: [
        "React.js",
        "Redux",
        "Tailwind CSS",
        "Framer Motion",
        "Reanimated",
        "MUI",
      ],
    },
    {
      cat: "Cloud",
      items: [
        "AWS Lambda",
        "AWS S3",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "GitHub Actions",
      ],
    },
    {
      cat: "Databases",
      items: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Oracle"],
    },
    {
      cat: "Leadership",
      items: [
        "Team Mgmt",
        "Technical Strategy",
        "Stakeholder Relations",
        "Hiring",
        "Mentorship",
        "Arch Review",
      ],
    },
  ],

  story: [
    {
      yr: "2017",
      title: "The Origin",
      text: "PHP developer. Government projects. 13 secured, restructured, and shipped. Built GST portals, Android apps, and retailer software from zero. Learned that real engineering means owning security, performance, and delivery — not just writing code.",
    },
    {
      yr: "2019–21",
      title: "MCA & Upskilling",
      text: "Master's in Computer Applications. 8.61 CGPA. Coding Group Secretary. Meanwhile: React, React Native, Web3 foundations, and freelance projects running in parallel. Two tracks. Both serious.",
    },
    {
      yr: "2021",
      title: "Web3 & Blockchain",
      text: "Joined NonceBlox. Deep-dived into Solidity, DeFi, NFTs. Built DeFi11 — fully decentralized fantasy sports with on-chain prize pools. Shipped 13+ apps over 3 years. Led teams. Mentored devs.",
    },
    {
      yr: "2023",
      title: "The Lead Role",
      text: "Became Lead Mobile Developer. Owned architecture for MusicX, Housezy, Vulcan Eleven. 50,000+ real users. Razorpay + Binance Pay. C++ Native Modules. React Native at its technical ceiling.",
    },
    {
      yr: "2025",
      title: "AI + HealthTech",
      text: "Most complex systems of my career. Custom game engine from scratch. RAG pipelines for HIPAA-compliant medical data. myTeal — women's health at scale. Blockchain health records. Bridgeless React Native migration. VP-level operations.",
    },
    {
      yr: "Now",
      title: "Open to the Right Role",
      text: "VP Engineering. CTO. Principal Architect. The title matters less than the mission. I build systems that scale, lead teams that deliver, and turn technical vision into business outcomes. If you're building something that matters — let's talk.",
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

// ─── UTILS ─────────────────────────────────────────────────────
const getYears = () =>
  new Date().getFullYear() - new Date(DATA.started).getFullYear();

const useScrollSpy = (ids: string[]) => {
  const [active, setActive] = useState("");
  const stableIds = useMemo(() => ids, []); // eslint-disable-line
  useEffect(() => {
    const fn = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let found = "";
      for (const id of stableIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) found = id;
      }
      setActive(found);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [stableIds]);
  return active;
};

// ─── COUNTER ───────────────────────────────────────────────────
const Counter = ({ to, dur = 1800 }: { to: number; dur?: number }) => {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setGo(true);
      },
      { threshold: 0.4 },
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  useEffect(() => {
    if (!go) return;
    let t0 = 0;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setV(Math.round(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [go, to, dur]);
  return <span ref={ref}>{v}</span>;
};

// ─── CONTRIBUTION GRAPH ────────────────────────────────────────
const ContribGraph = () => {
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
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(201,168,76,0.7)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "monospace",
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
            }}
          >
            2,029 <span style={{ color: C.gold }}>contributions</span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.vfaint,
              marginTop: 3,
              fontFamily: "monospace",
            }}
          >
            Last 12 months · Mostly private repos
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "rgba(201,168,76,0.1)",
            lineHeight: 1,
          }}
        >
          #1
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 720 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 6 }}>
            {months.map((m, i) => (
              <div
                key={i}
                style={{
                  fontSize: 9,
                  color: C.ghost,
                  fontFamily: "monospace",
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
                      delay: (wi * 7 + di) * 0.0005,
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
                    title={`${level} contributions`}
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
                fontFamily: "monospace",
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
                fontFamily: "monospace",
              }}
            >
              More
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── CURSOR ────────────────────────────────────────────────────
const Cursor = () => {
  const mx = useMotionValue(-200),
    my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness: 500, damping: 40 });
  const sy = useSpring(my, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  const [click, setClick] = useState(false);
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const mo = (e: MouseEvent) =>
      setBig(!!(e.target as Element).closest("a,button,[data-h]"));
    const md = () => setClick(true);
    const mu = () => setClick(false);
    window.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", mo);
    document.addEventListener("mousedown", md);
    document.addEventListener("mouseup", mu);
    return () => {
      window.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseover", mo);
      document.removeEventListener("mousedown", md);
      document.removeEventListener("mouseup", mu);
    };
  }, []);
  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-amber-400 hidden md:block"
        style={{
          left: sx,
          top: sy,
          x: "-50%",
          y: "-50%",
          width: click ? 6 : big ? 48 : 10,
          height: click ? 6 : big ? 48 : 10,
          opacity: big ? 0.5 : 0.9,
          transition: "width .15s, height .15s, opacity .15s",
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9998] w-1 h-1 rounded-full bg-amber-400 hidden md:block"
        style={{ left: mx, top: my, x: "-50%", y: "-50%" }}
      />
    </>
  );
};

// ─── SCROLL PROGRESS ───────────────────────────────────────────
const Progress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[999] h-[2px] bg-amber-400 origin-left"
      style={{ scaleX }}
    />
  );
};

// ─── NOISE ─────────────────────────────────────────────────────
const Noise = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[200] opacity-[0.022] select-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "180px",
    }}
  />
);

// ─── ORBS ──────────────────────────────────────────────────────
const Orbs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[
      { x: "8%", y: "18%", s: 360, d: 0 },
      { x: "78%", y: "52%", s: 260, d: 3 },
      { x: "48%", y: "85%", s: 200, d: 6 },
    ].map((o, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: o.x,
          top: o.y,
          width: o.s,
          height: o.s,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 68%)",
          filter: "blur(60px)",
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
);

// ─── NAV ───────────────────────────────────────────────────────
const NAV = [
  { l: "Work", id: "work" },
  { l: "Story", id: "story" },
  { l: "Skills", id: "skills" },
  { l: "Open Source", id: "github" },
  { l: "Blog", id: "blog" },
  { l: "Testimonials", id: "testimonials" },
  { l: "Contact", id: "contact" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(NAV.map((n) => n.id));
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100]"
      style={{
        background: scrolled ? "rgba(6,6,6,0.97)" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        transition: "all 0.4s",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        style={{ height: 64 }}
      >
        <a
          href="#"
          data-h
          style={{
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "-0.04em",
            color: C.text,
            textDecoration: "none",
          }}
        >
          <span style={{ color: C.gold }}>A</span>C
          <span style={{ color: "rgba(201,168,76,0.5)" }}>.</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {NAV.map(({ l, id }) => (
            <a
              key={id}
              href={`#${id}`}
              data-h
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "monospace",
                color: active === id ? C.gold : C.faint,
                transition: "color 0.2s",
                textDecoration: "none",
                position: "relative",
              }}
            >
              {l}
              {active === id && (
                <motion.span
                  layoutId="nav-line"
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: C.gold,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          ))}
          <a
            href="#contact"
            data-h
            style={{
              padding: "8px 20px",
              border: `1px solid ${C.gold}`,
              color: C.gold,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = C.gold;
              (e.target as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.color = C.gold;
            }}
          >
            Let's Build
          </a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
        >
          <div style={{ width: 22 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 1,
                  background: C.text,
                  marginBottom: 5,
                  transition: "all 0.3s",
                  transform: open
                    ? i === 0
                      ? "rotate(45deg) translateY(6px)"
                      : i === 2
                        ? "rotate(-45deg) translateY(-6px)"
                        : "none"
                    : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </div>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{
              overflow: "hidden",
              background: C.bg,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {NAV.map(({ l, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "16px 24px",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  color: active === id ? C.gold : C.faint,
                  borderBottom: `1px solid ${C.border}`,
                  textDecoration: "none",
                }}
              >
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ─── SECTION LABEL ─────────────────────────────────────────────
const SLabel = ({ children }: { children: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}
  >
    <div style={{ height: 1, width: 40, background: C.gold }} />
    <span
      style={{
        fontSize: 10,
        color: C.gold,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}
    >
      {children}
    </span>
  </motion.div>
);

// ─── HERO ──────────────────────────────────────────────────────
const Hero = () => {
  const [ri, setRi] = useState(0);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 90]);
  const txtY = useTransform(scrollY, [0, 700], [0, -50]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setInterval(
      () => setRi((i) => (i + 1) % DATA.roles.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  // GSAP scroll-triggered animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero text stagger on load
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".gsap-stats-item", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        delay: 1.6,
      });
    }, heroRef);

    // Parallax for grid lines
    gsap.to(".gsap-grid", {
      yPercent: -25,
      ease: "none",
      scrollTrigger: {
        trigger: ".gsap-grid",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const grid = "rgba(201,168,76,0.025)";

  return (
    <section
      ref={heroRef}
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
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />
      {/* Atmospheric glow */}
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
                "radial-gradient(circle, rgba(201,168,76,0.065) 0%, transparent 60%)",
              filter: "blur(100px)",
              borderRadius: "50%",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.95, 0.5] }}
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
        <div className="gsap-hero-badge" style={{ opacity: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                animation: "ac-pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: C.gold,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontFamily: "monospace",
                fontWeight: 600,
              }}
            >
              Available · VP · CTO · Principal Architect
            </span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 xl:gap-20 items-center">
          {/* LEFT — Text */}
          <motion.div style={{ y: txtY }}>
            <div style={{ overflow: "hidden", marginBottom: 4 }}>
              <motion.div
                initial={{ y: 130 }}
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
                  fontFamily: "'Helvetica Neue', sans-serif",
                }}
              >
                {DATA.nameFirst}
              </motion.div>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 18 }}>
              <motion.div
                initial={{ y: 130 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.34,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: "2px",
                  fontFamily: "'Helvetica Neue', sans-serif",
                  WebkitTextStroke: `2px rgba(201,168,76,0.55)`,
                  color: "transparent",
                }}
              >
                {DATA.nameLast}
              </motion.div>
            </div>

            {/* Tagline */}
            <div style={{ overflow: "hidden", marginBottom: 20 }}>
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.52,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
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
                    key={ri}
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
                    {DATA.roles[ri]}
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
                data-h
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
                  fontFamily: "monospace",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                See My Work →
              </a>
              <a
                href="#contact"
                data-h
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
                  fontFamily: "monospace",
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
                data-h
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
                  fontFamily: "monospace",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
              >
                LinkedIn ↗
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT — Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.1 }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <motion.div style={{ y: imgY, position: "relative" }}>
              {/* Rings */}
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
                  border: `3px solid rgba(201,168,76,0.38)`,
                  position: "relative",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={ASSETS.myPicture}
                  alt="Amit Chakraborty — Principal Mobile Architect"
                  fill
                  className="object-cover"
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
              {/* Name */}
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
                    fontFamily: "monospace",
                    color: C.ghost,
                  }}
                >
                  Amit Chakraborty
                </span>
              </div>
              {/* Floating stat badges */}
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
                  label: "Projects",
                  value: "500+",
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
                      fontFamily: "monospace",
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
          className="grid grid-cols-2 md:grid-cols-4 gsap-stats-item"
          style={{
            marginTop: 80,
            paddingTop: 40,
            borderTop: `1px solid ${C.border}`,
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
                  fontSize: 52,
                  fontWeight: 900,
                  color: C.gold,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 6,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <Counter to={s.n} />
                {s.s}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.vfaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontFamily: "monospace",
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
            fontFamily: "monospace",
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
  );
};

// ─── GSAP SECTION REVEAL HOOK ───────────────────────────────────
const useGsapReveal = (selector: string, options = {}) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const els = gsap.utils.toArray(selector);
    els.forEach((el) => {
      gsap.from(el as Element, {
        y: 50,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el as Element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        ...options,
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
};

// ─── WORK ──────────────────────────────────────────────────────
const ProjectCard = ({ p, i }: { p: (typeof DATA.projects)[0]; i: number }) => {
  const [hov, setHov] = useState(false);
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * 7);
    ry.set(-((e.clientX - r.left) / r.width - 0.5) * 7);
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
          border: `1px solid ${hov ? "rgba(201,168,76,0.45)" : p.featured ? "rgba(201,168,76,0.2)" : C.border}`,
          background: p.featured
            ? "linear-gradient(135deg, rgba(201,168,76,0.042) 0%, transparent 60%)"
            : C.card,
          padding: p.featured ? 32 : 26,
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: hov ? "0 24px 60px rgba(0,0,0,0.22)" : "none",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                color: p.color || C.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontFamily: "monospace",
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
                letterSpacing: "-0.02em",
                transition: "color 0.2s",
                fontFamily: "'Helvetica Neue', sans-serif",
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
                background: "rgba(201,168,76,0.12)",
                border: `1px solid rgba(201,168,76,0.35)`,
                color: C.gold,
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ★ FEATURED
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 11,
            color: C.vfaint,
            fontFamily: "monospace",
            marginBottom: 10,
            letterSpacing: "0.08em",
          }}
        >
          {p.role} · {p.cat}
        </div>
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
        <p
          style={{
            fontSize: 13,
            color: C.dim,
            lineHeight: 1.7,
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
            background: "rgba(201,168,76,0.035)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: C.gold,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: "monospace",
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
                border: `1px solid ${hov ? "rgba(201,168,76,0.3)" : C.border}`,
                color: hov ? "rgba(201,168,76,0.75)" : C.vfaint,
                fontFamily: "monospace",
                transition: "all 0.2s",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        {"link" in p && p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color: "rgba(201,168,76,0.6)",
              fontFamily: "monospace",
              textDecoration: "none",
            }}
          >
            View Live ↗
          </a>
        )}
      </div>
    </motion.div>
  );
};

const Work = () => {
  const featured = DATA.projects.filter((p) => p.featured);
  const rest = DATA.projects.filter((p) => !p.featured);
  return (
    <section id="work" style={{ padding: "120px 0", background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
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
              fontFamily: "'Helvetica Neue', sans-serif",
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
            From AI-powered MarTech to Indigenous community platforms. Every
            project architected to VP-level standards — engineered for
            real-world impact.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i + featured.length} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── STORY ─────────────────────────────────────────────────────
const Story = () => (
  <section id="story" style={{ padding: "120px 0", background: C.bg2 }}>
    <div className="max-w-7xl mx-auto px-6">
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
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        From government portals
        <br />
        <span style={{ color: C.ghost }}>to AI-powered systems.</span>
      </motion.h2>
      <div style={{ position: "relative" }}>
        <div
          className="hidden md:block"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, transparent, ${C.goldD}, transparent)`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
          {DATA.story.map((ch, i) => (
            <motion.div
              key={ch.yr}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
            >
              <div
                style={{ textAlign: "right" }}
                className={
                  i % 2 === 1
                    ? "md:order-2 text-left md:text-right"
                    : "md:order-1 text-left md:text-right"
                }
              >
                <div
                  style={{
                    fontSize: 60,
                    fontWeight: 900,
                    color: "rgba(201,168,76,0.08)",
                    fontFamily: "monospace",
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
                    fontFamily: "'Helvetica Neue', sans-serif",
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
              <div
                className="hidden md:block"
                style={{ order: i % 2 === 0 ? 2 : 1 }}
              />
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="hidden md:block"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: C.gold,
                  border: `3px solid ${C.bg2}`,
                  zIndex: 10,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── SKILLS ────────────────────────────────────────────────────
const Skills = () => {
  const [active, setActive] = useState(0);
  return (
    <section id="skills" style={{ padding: "120px 0", background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <SLabel>Technical Leadership</SLabel>
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
            fontFamily: "'Helvetica Neue', sans-serif",
          }}
        >
          Deep stack.
          <br />
          <span style={{ color: C.ghost }}>Not full stack.</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5 mb-10">
          {DATA.skills.map((c, i) => (
            <button
              key={c.cat}
              onClick={() => setActive(i)}
              data-h
              style={{
                padding: "10px 14px",
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
                background: active === i ? C.gold : "transparent",
                color: active === i ? "#000" : C.faint,
                border: `1px solid ${active === i ? C.gold : C.border}`,
              }}
            >
              {c.cat}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {DATA.skills[active].items.map((sk, i) => (
              <motion.div
                key={sk}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  padding: "14px 16px",
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  cursor: "default",
                }}
                whileHover={{ borderColor: "rgba(201,168,76,0.4)" }}
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
  );
};

// ─── EXPERIENCE ────────────────────────────────────────────────
const Experience = () => (
  <section style={{ padding: "80px 0", background: C.bg2 }}>
    <div className="max-w-7xl mx-auto px-6">
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
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        3 companies.
        <br />
        <span style={{ color: C.ghost }}>8+ years. Zero shortcuts.</span>
      </motion.h2>
      {DATA.experience.map((e, i) => (
        <motion.div
          key={e.co}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="md:grid md:grid-cols-[200px_1fr_200px] gap-10 items-start"
          style={{
            paddingBlock: 40,
            borderTop: `1px solid ${C.border}`,
            cursor: "default",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e2) =>
            ((e2.currentTarget as HTMLDivElement).style.background =
              "rgba(255,255,255,0.01)")
          }
          onMouseLeave={(e2) =>
            ((e2.currentTarget as HTMLDivElement).style.background =
              "transparent")
          }
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: C.vfaint,
                fontFamily: "monospace",
                marginBottom: 6,
              }}
            >
              {e.period}
            </div>
            <div
              style={{
                fontSize: 9,
                color: C.gold,
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              {e.type}
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
                fontFamily: "'Helvetica Neue', sans-serif",
              }}
            >
              {e.title}
            </h3>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 16 }}>
              {e.co} · {e.loc}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {e.points.map((pt) => (
                <div
                  key={pt}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <span style={{ color: C.goldD, flexShrink: 0, marginTop: 1 }}>
                    →
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: C.dim,
                      lineHeight: 1.6,
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
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}
            className="md:mt-0"
          >
            {e.stack.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 9,
                  padding: "4px 8px",
                  border: `1px solid ${C.border}`,
                  color: C.vfaint,
                  fontFamily: "monospace",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

// ─── OPEN SOURCE / GITHUB ──────────────────────────────────────
const Github = () => (
  <section id="github" style={{ padding: "80px 0", background: C.bg }}>
    <div className="max-w-7xl mx-auto px-6">
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
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        Shipping code.
        <br />
        <span style={{ color: C.ghost }}>Every. Single. Day.</span>
      </motion.h2>
      <ContribGraph />
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}
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
            data-h
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              border: `1px solid ${C.border}`,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldD)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            <span style={{ fontSize: 20, color: C.gold }}>⬡</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                {g.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: C.vfaint,
                }}
              >
                {g.sub}
              </div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 12, color: C.vfaint }}>
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

// ─── BLOG TEASER ───────────────────────────────────────────────
const Blog = () => (
  <section id="blog" style={{ padding: "80px 0", background: C.bg2 }}>
    <div className="max-w-7xl mx-auto px-6">
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
          marginBottom: 16,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        I think in systems.
        <br />
        <span style={{ color: C.ghost }}>I write in posts.</span>
      </motion.h2>
      <p
        style={{
          fontSize: 15,
          color: C.dim,
          marginBottom: 48,
          fontWeight: 300,
          maxWidth: 480,
          lineHeight: 1.65,
        }}
      >
        Deep dives into React Native architecture, AI pipelines, blockchain, and
        what it actually takes to ship production-grade apps.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
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
              cursor: "default",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.goldD)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            <div
              style={{
                fontSize: 9,
                color: C.gold,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontFamily: "monospace",
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
                fontFamily: "monospace",
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
);

// ─── TESTIMONIALS ──────────────────────────────────────────────
const Testimonials = () => (
  <section id="testimonials" style={{ padding: "120px 0", background: C.bg }}>
    <div className="max-w-7xl mx-auto px-6">
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
          fontFamily: "'Helvetica Neue', sans-serif",
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
      <div className="grid md:grid-cols-2 gap-5">
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
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: 8,
                padding: "4px 10px",
                border: `1px solid ${t.seniorityColor}`,
                color: t.seniorityColor,
                fontFamily: "monospace",
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
                fontSize: 60,
                color: "rgba(255,255,255,0.04)",
                position: "absolute",
                top: 18,
                right: 24,
                lineHeight: 1,
                fontFamily: "Georgia",
                userSelect: "none",
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
                position: "relative",
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.text)}
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
                    fontFamily: "monospace",
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
);

// ─── CONTACT ───────────────────────────────────────────────────
const Contact = () => (
  <section id="contact" style={{ padding: "120px 0", background: C.bg2 }}>
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-16 md:gap-20">
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
              fontFamily: "'Helvetica Neue', sans-serif",
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
            scale, lead teams that ship, and turn technical vision into business
            reality. Let's talk.
          </p>
          {[
            { l: "Email", v: DATA.email, h: `mailto:${DATA.email}` },
            { l: "Phone", v: DATA.phone, h: `tel:${DATA.phone}` },
            { l: "LinkedIn", v: "linkedin.com/in/devamitch", h: DATA.linkedin },
            { l: "GitHub", v: "github.com/devamitch", h: DATA.github },
            { l: "Medium", v: "devamitch.medium.com", h: DATA.medium },
          ].map((link) => (
            <a
              key={link.l}
              href={link.h}
              target="_blank"
              rel="noreferrer"
              data-h
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
                  fontFamily: "monospace",
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
                onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
              >
                {link.v} ↗
              </span>
            </a>
          ))}
        </div>
        <SecureContactForm dark={true} />
      </div>
    </div>
  </section>
);

// ─── FOOTER ────────────────────────────────────────────────────
const Footer = () => (
  <footer
    style={{
      padding: "48px 0",
      borderTop: `1px solid ${C.border}`,
      background: C.bg,
    }}
  >
    <div
      className="max-w-7xl mx-auto px-6"
      style={{
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
            fontFamily: "'Helvetica Neue', sans-serif",
          }}
        >
          <span style={{ color: C.gold }}>A</span>C
          <span style={{ color: "rgba(201,168,76,0.5)" }}>.</span>
        </span>
        <p
          style={{
            fontSize: 10,
            color: C.ghost,
            fontFamily: "monospace",
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
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Amit Chakraborty · Built by hand. Not by
        prompt.
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
            data-h
            style={{
              fontSize: 11,
              fontFamily: "monospace",
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
);

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function PreviousPortfolio() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        cursor: "none",
        overflowX: "hidden",
      }}
    >
      <Progress />
      <Noise />
      <Orbs />
      <Cursor />
      <Nav />
      <Hero />
      <Work />
      <Story />
      <Skills />
      <Experience />
      <Github />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />

      <style>{`
        @keyframes ac-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overscroll-behavior: none; }
        ::placeholder { color: rgba(255,255,255,0.22); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.goldD}; }
        a { text-decoration: none; }
        input, textarea, button { font-family: inherit; }
        .lg\\:grid-cols-\\[1\\.1fr_0\\.9fr\\] { grid-template-columns: 1.1fr 0.9fr; }
        @media (max-width: 1023px) { .grid.lg\\:grid-cols-\\[1\\.1fr_0\\.9fr\\] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
