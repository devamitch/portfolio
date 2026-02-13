"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ASSETS } from "~/assets";

// ═══════════════════════════════════════════════════════════════
// SEO HEAD — add to layout.tsx or page.tsx metadata export:
// title: "Amit Chakraborty — Principal Architect · VP Engineering · CTO"
// description: "8+ years. 16+ apps. 50K+ users. Amit Chakraborty builds systems that scale — AI, HealthTech, Blockchain, React Native. Available for VP/CTO/Principal Architect roles."
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// COMPLETE DATA
// ═══════════════════════════════════════════════════════════════
const DATA = {
  name: "Amit Chakraborty",
  nameFirst: "Amit",
  nameLast: "Chakraborty",
  title: "Principal Mobile Architect · VP Engineering",
  tagline: "Not your average engineer.",
  manifesto: [
    "8 years before LLMs became a crutch.",
    "16+ apps in production. 50K+ real users.",
    "I don't generate code — I architect empires.",
  ],
  roles: [
    "VP Engineering",
    "Principal Architect",
    "CTO Candidate",
    "Technical Leader",
  ],
  email: "amit98ch@gmail.com",
  phone: "+91-9874173663",
  linkedin: "https://www.linkedin.com/in/devamitch/",
  github: "https://github.com/devamitch",
  githubAlt: "https://github.com/techamit95ch",
  medium: "https://devamitch.medium.com/",
  location: "Kolkata, India · Remote Worldwide",
  started: "2017-05-01",

  projects: [
    {
      id: "thoth",
      name: "Thoth AI",
      cat: "AI · MarTech · Enterprise",
      badge: "AI PLATFORM",
      role: "Principal Architect",
      tagline: "One brain for all your marketing channels.",
      desc: "Enterprise AI orchestration platform unifying Shopify, TikTok, Meta, and 5+ marketing channels into a single intelligent command center. Recommendation engine for real-time cross-platform campaign optimization and automated analytics.",
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
      featured: true,
    },
    {
      id: "spyk",
      name: "Spyk Health",
      cat: "HealthTech · Gamification · AI",
      badge: "FLAGSHIP",
      role: "Principal Architect",
      tagline: "A game engine I built from nothing.",
      desc: "Built a complete custom game engine from absolute scratch — zero dependencies, zero shortcuts. LLM-based dynamic task generation, XP progression system, and AI-powered health engagement pipelines. The hardest system I've ever architected.",
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
      featured: true,
    },
    {
      id: "olo",
      name: "oLo Eye Care",
      cat: "HealthTech · Computer Vision · Medical",
      badge: "MEDTECH",
      role: "Technical Lead",
      tagline: "Your phone becomes a medical device.",
      desc: "Real-time eye health monitoring using MediaPipe directly on-device. Retina coverage analysis, blink rate detection, redness assessment, and luminance tracking — medical-grade computer vision on a consumer smartphone.",
      impact: [
        "Medical-grade CV on consumer hardware",
        "Real-time retina analysis",
        "Blink + redness detection",
      ],
      tech: ["React Native", "MediaPipe", "Computer Vision", "Gumlet API"],
      color: "#2196F3",
      featured: true,
    },
    {
      id: "vboil",
      name: "vBoil (Vanbrant Oil)",
      cat: "GreenTech · Sustainability · B2B",
      badge: "GREENTECH",
      role: "Lead Mobile Architect",
      tagline: "Digitizing the green oil supply chain.",
      desc: "End-to-end recycled oil management platform digitizing the entire supply chain — B2B transaction flows, geolocation tracking, environmental impact analytics, and lifecycle monitoring from collection to distribution.",
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
      featured: true,
    },
    {
      id: "maskwa",
      name: "Maskwa",
      cat: "Social Impact · Indigenous Tech",
      badge: "LEGACY",
      role: "Lead Architect & Strategic Partner",
      tagline: "Technology that honors culture.",
      desc: "A platform for Canadian Indigenous communities — combining cultural preservation, community development, and economic empowerment through technology. My most meaningful project. Building infrastructure that respects heritage while enabling the future.",
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
      featured: true,
    },
    {
      id: "vulcan",
      name: "Vulcan Eleven",
      cat: "Sports · FinTech · Web3",
      badge: "SPORTS",
      role: "Lead Architect",
      tagline: "50,000 users. Zero downtime.",
      desc: "Fantasy sports platform with 50K+ users, Razorpay + Binance Pay dual-payment integration driving 35% transaction growth. Led complete post-merger redesign.",
      impact: [
        "50K+ active users",
        "35% transaction growth",
        "Binance Pay integration",
      ],
      tech: ["React Native", "Razorpay", "Binance Pay", "PostgreSQL"],
      color: "#E91E63",
      featured: false,
      link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    },
    {
      id: "musicx",
      name: "MusicX",
      cat: "Web3 · Entertainment",
      badge: "WEB3",
      role: "Lead Mobile Developer",
      tagline: "Blockchain royalties for artists.",
      desc: "Music competition platform with blockchain-backed royalty tracking. Native Modules in C++. 60fps animations. Twitter + Spotify API integration.",
      impact: [
        "Blockchain royalty system",
        "C++ native modules",
        "60fps animations",
      ],
      tech: ["React Native", "Blockchain", "Native C++ Modules", "TypeScript"],
      color: "#9C27B0",
      featured: false,
      link: "https://apps.apple.com/app/music-x/id6475713772",
    },
    {
      id: "defi11",
      name: "DeFi11",
      cat: "DeFi · Blockchain · Sports",
      badge: "DEFI",
      role: "Founding Engineer",
      tagline: "Fully on-chain. No compromise.",
      desc: "Fully decentralized fantasy sports with smart contract prize pools. On-chain tournament logic. Zero centralized custody.",
      impact: [
        "100% on-chain prize pools",
        "Smart contract architecture",
        "Zero-trust design",
      ],
      tech: ["React Native", "Solidity", "Web3.js", "Ethereum"],
      color: "#607D8B",
      featured: false,
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
      text: "I had the pleasure of working with Amit for three years and witnessed his impressive growth from a Front-End Developer to a Front-End Lead. Amit is someone I can always rely on for high-quality work and timely project delivery. His expertise and dedication make him a valuable asset to any team.",
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
      text: "Amit had been an amicable and diligent developer, he had been one of the most dependable Engineers here when it comes to delivery or urgent closures of client projects. We really appreciate his understandability, capability to rebuild any project from scratch and issues identification.",
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
      text: "I had the chance to work closely with Amit during several fast-paced release cycles. He played a key role in code reviews, ensuring quality and consistency across the codebase while also guiding multiple teams through complex technical tasks and blockers. He is reliable, technically strong, and a great support.",
      li: "https://www.linkedin.com/in/puja-rani-tripathy/",
      date: "February 2026",
    },
    {
      name: "Varun Chodha",
      role: "Senior Full-Stack Developer · MERN",
      company: "NonceBlox",
      seniority: "MENTEE → SENIOR",
      seniorityColor: "#81C784",
      rel: "Reported to Amit · Grew under mentorship",
      text: "Amit played a pivotal role in mentoring me, sharing his profound knowledge of Redux, React Native and various frontend concepts. His guidance was instrumental in helping me build a solid foundation. Amit is not only a talented developer but also a valuable team player. His enthusiasm for coding and pursuit for perfection are truly inspiring.",
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
        "Built custom game engine from zero with LLM-based dynamic task generation",
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
        "Conducted technical interviews — built and scaled high-performing engineering teams",
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
      text: "PHP developer. Government projects. 13 secured, restructured, and shipped. Built GST portals, Android apps, and retailer software from zero. Learned that real engineering means owning security, performance, and delivery — not just code.",
    },
    {
      yr: "2019–21",
      title: "MCA & Upskilling",
      text: "Master's degree in Computer Applications. 8.61 CGPA. Coding Group Secretary. Meanwhile: React, React Native, Web3 foundations, and freelance projects. Parallel evolution.",
    },
    {
      yr: "2021",
      title: "Web3 & Blockchain",
      text: "Joined NonceBlox. Deep-dived into Solidity, DeFi, NFTs. Built DeFi11 — a fully decentralized fantasy sports platform with on-chain prize pools. Shipped 13+ apps over 3 years. Led teams. Mentored devs.",
    },
    {
      yr: "2023",
      title: "The Lead Role",
      text: "Became Lead Mobile Developer. Owned architecture for MusicX, Housezy, Vulcan Eleven. 50,000+ real users. Razorpay + Binance Pay. C++ Native Modules. React Native at its technical ceiling.",
    },
    {
      yr: "2025",
      title: "AI + HealthTech",
      text: "Most complex systems of my career. Custom game engine built from scratch. RAG pipelines for HIPAA-compliant medical data. Blockchain health records. Bridgeless React Native migration. 500+ projects. VP-level operations.",
    },
    {
      yr: "Now",
      title: "Available — Ready to Lead",
      text: "VP Engineering. CTO. Principal Architect. Whatever the title — I architect systems that survive, lead teams that deliver, and turn technical vision into market reality. The next empire is yours to build.",
    },
  ],

  blogs: [
    {
      title: "React Native Bridgeless Architecture: What They Don't Tell You",
      cat: "Mobile",
      teaser:
        "The new architecture changes everything. Here's what actually breaks in production and how to fix it before it costs you a launch.",
    },
    {
      title: "Building RAG Pipelines for Medical Data: HIPAA-Safe Approach",
      cat: "AI + HealthTech",
      teaser:
        "How we built a retrieval pipeline for sensitive medical data without violating compliance — and why most AI startups get this catastrophically wrong.",
    },
    {
      title: "Why 50% of React Native Apps Fail in Production",
      cat: "Architecture",
      teaser:
        "After 8 years and 16 apps, I see the same architecture mistake made over and over. Here's the pattern and how to avoid it.",
    },
  ],
};

// ─── UTILS ────────────────────────────────────────────────────
const getYears = () =>
  new Date().getFullYear() - new Date(DATA.started).getFullYear();

const useTheme = () => {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    try {
      const s = localStorage.getItem("portfolio-theme");
      setDark(
        s
          ? s === "dark"
          : window.matchMedia("(prefers-color-scheme: dark)").matches,
      );
    } catch {
      /* noop */
    }
  }, []);
  const toggle = () =>
    setDark((d) => {
      try {
        localStorage.setItem("portfolio-theme", !d ? "dark" : "light");
      } catch {
        /* noop */
      }
      return !d;
    });
  return { dark, toggle };
};

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

// ─── COUNTER ──────────────────────────────────────────────────
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

// ─── CONTRIBUTION GRAPH ───────────────────────────────────────
const ContribGraph = ({ dark }: { dark: boolean }) => {
  const weeks = 53;
  const data = useMemo(
    () =>
      Array.from({ length: weeks }, (_, w) =>
        Array.from({ length: 7 }, (_, d) => {
          const seed = ((w * 7 + d) * 2654435761) >>> 0;
          const isWeekend = d === 0 || d === 6;
          const prob = isWeekend ? 0.3 : 0.65;
          if ((seed % 100) / 100 > prob) return 0;
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
        border: `1px solid ${dark ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.25)"}`,
        background: dark ? "rgba(201,168,76,0.03)" : "rgba(201,168,76,0.04)",
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
              color: dark ? "#fff" : "#1a1a1a",
              letterSpacing: "-0.03em",
            }}
          >
            2,029 <span style={{ color: "#C9A84C" }}>contributions</span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: dark ? "rgba(255,255,255,0.3)" : "rgba(26,26,26,0.4)",
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
                  color: dark ? "rgba(255,255,255,0.22)" : "rgba(26,26,26,0.4)",
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
                    title={`${level} contributions`}
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

// ─── CURSOR ───────────────────────────────────────────────────
const Cursor = () => {
  const mx = useMotionValue(-200),
    my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness: 500, damping: 40 });
  const sy = useSpring(my, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const mo = (e: MouseEvent) =>
      setBig(!!(e.target as Element).closest("a,button,[data-h]"));
    window.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", mo);
    return () => {
      window.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseover", mo);
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
          width: big ? 44 : 10,
          height: big ? 44 : 10,
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

// ─── SCROLL PROGRESS ──────────────────────────────────────────
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

// ─── NOISE ────────────────────────────────────────────────────
const Noise = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[200] opacity-[0.022] select-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "180px",
    }}
  />
);

// ─── FLOATING ORBS ────────────────────────────────────────────
const Orbs = ({ dark }: { dark: boolean }) => (
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
          background: dark
            ? "radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(180,100,0,0.06) 0%, transparent 68%)",
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

// ─── THEME TOKENS ─────────────────────────────────────────────
const T = {
  bg: (d: boolean) => (d ? "#060606" : "#FAF8F3"),
  bg2: (d: boolean) => (d ? "#0C0C0C" : "#F0EDE6"),
  text: (d: boolean) => (d ? "#FFFFFF" : "#1A1A1A"),
  dim: (d: boolean) => (d ? "rgba(255,255,255,0.48)" : "rgba(26,26,26,0.58)"),
  faint: (d: boolean) => (d ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.32)"),
  vfaint: (d: boolean) => (d ? "rgba(255,255,255,0.1)" : "rgba(26,26,26,0.15)"),
  border: (d: boolean) =>
    d ? "rgba(255,255,255,0.07)" : "rgba(26,26,26,0.12)",
  card: (d: boolean) =>
    d ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.92)",
  gold: "#C9A84C",
  goldD: "rgba(201,168,76,0.35)",
  goldF: "rgba(201,168,76,0.1)",
  goldGrad: "linear-gradient(135deg, #C9A84C 0%, #F0C040 50%, #9B7A2A 100%)",
};

// ─── NAV ──────────────────────────────────────────────────────
const NAV = [
  { l: "Work", id: "work" },
  { l: "Story", id: "story" },
  { l: "Skills", id: "skills" },
  { l: "Open Source", id: "github" },
  { l: "Blog", id: "blog" },
  { l: "Testimonials", id: "testimonials" },
  { l: "Contact", id: "contact" },
];

const Nav = ({ dark, toggle }: { dark: boolean; toggle: () => void }) => {
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
        background: scrolled
          ? dark
            ? "rgba(6,6,6,0.97)"
            : "rgba(250,248,243,0.97)"
          : "transparent",
        borderBottom: scrolled ? `1px solid ${T.border(dark)}` : "none",
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
            color: T.text(dark),
            textDecoration: "none",
          }}
        >
          <span style={{ color: T.gold }}>A</span>C
          <span style={{ color: T.goldF }}>.</span>
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
                color: active === id ? T.gold : T.faint(dark),
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
                    background: T.gold,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          ))}
          <button
            onClick={toggle}
            data-h
            style={{
              padding: "6px 10px",
              border: `1px solid ${T.border(dark)}`,
              background: "transparent",
              color: T.faint(dark),
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {dark ? "◑" : "◐"}
          </button>
          <a
            href="#contact"
            data-h
            style={{
              padding: "8px 18px",
              border: `1px solid ${T.gold}`,
              color: T.gold,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = T.gold;
              (e.target as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.color = T.gold;
            }}
          >
            Hire Me
          </a>
        </div>
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            style={{
              background: "transparent",
              border: "none",
              color: T.faint(dark),
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {dark ? "◑" : "◐"}
          </button>
          <button
            onClick={() => setOpen(!open)}
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
                    background: T.text(dark),
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
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{
              overflow: "hidden",
              background: T.bg(dark),
              borderTop: `1px solid ${T.border(dark)}`,
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
                  color: active === id ? T.gold : T.faint(dark),
                  borderBottom: `1px solid ${T.border(dark)}`,
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

// ─── SECTION LABEL ────────────────────────────────────────────
const SLabel = ({ dark, children }: { dark: boolean; children: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}
  >
    <div style={{ height: 1, width: 40, background: T.gold }} />
    <span
      style={{
        fontSize: 10,
        color: T.gold,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}
    >
      {children}
    </span>
  </motion.div>
);

// ─── HERO ─────────────────────────────────────────────────────
const Hero = ({ dark }: { dark: boolean }) => {
  const [ri, setRi] = useState(0);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 700], [0, 90]);
  const txtY = useTransform(scrollY, [0, 700], [0, -50]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const t = setInterval(
      () => setRi((i) => (i + 1) % DATA.roles.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  const grid = dark ? "rgba(201,168,76,0.025)" : "rgba(120,70,0,0.045)";

  return (
    <section
      style={{
        minHeight: "100vh",
        background: T.bg(dark),
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Grid */}
      <div
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
              background: dark
                ? "radial-gradient(circle, rgba(201,168,76,0.065) 0%, transparent 60%)"
                : "radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 60%)",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${T.goldD}`,
            background: T.goldF,
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
              background: T.gold,
              animation: "ac-pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: T.gold,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              fontWeight: 600,
            }}
          >
            Available · VP · CTO · Principal Architect · Lead Engineering
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 xl:gap-20 items-center">
          {/* LEFT — Text */}
          <motion.div style={{ y: txtY }}>
            {/* BIG NAME — Amit Chakraborty */}
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
                  color: T.text(dark),
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
                  WebkitTextStroke: `2px ${dark ? "rgba(201,168,76,0.55)" : "rgba(100,65,0,0.45)"}`,
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
                  fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
                  fontWeight: 300,
                  color: T.gold,
                  letterSpacing: "0.02em",
                  fontStyle: "italic",
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
                  background: T.gold,
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
                      color: T.gold,
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
                    color: i === 2 ? T.gold : T.dim(dark),
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
                  background: T.goldGrad,
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
                  border: `2px solid ${T.goldD}`,
                  color: T.gold,
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
                Hire Me
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
                  border: `1px solid ${T.border(dark)}`,
                  color: T.faint(dark),
                  padding: "14px 22px",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
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
              {["-inset-8", "-inset-16"].map((cls, i) => (
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
                    "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 65%)",
                  filter: "blur(40px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                }}
              />
              {/* Photo */}
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
                    background: dark
                      ? "linear-gradient(to top, rgba(6,6,6,0.4) 0%, transparent 60%)"
                      : "linear-gradient(to top, rgba(250,248,243,0.3) 0%, transparent 60%)",
                  }}
                />
              </div>
              {/* Name under photo */}
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
                    color: T.vfaint(dark),
                  }}
                >
                  {DATA.name}
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
                    background: dark
                      ? "rgba(6,6,6,0.97)"
                      : "rgba(250,248,243,0.98)",
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
                      color: T.gold,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      color: T.vfaint(dark),
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
          className="grid grid-cols-2 md:grid-cols-4"
          style={{
            marginTop: 80,
            paddingTop: 40,
            borderTop: `1px solid ${T.border(dark)}`,
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
                  color: T.gold,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: 6,
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <Counter to={s.n} />
                {s.s}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: T.vfaint(dark),
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
            color: T.vfaint(dark),
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
            background: `linear-gradient(to bottom, ${T.gold}, transparent)`,
          }}
        />
      </motion.div>
    </section>
  );
};

// ─── WORK ─────────────────────────────────────────────────────
const ProjectCard = ({
  p,
  i,
  dark,
}: {
  p: (typeof DATA.projects)[0];
  i: number;
  dark: boolean;
}) => {
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
          border: `1px solid ${hov ? "rgba(201,168,76,0.45)" : p.featured ? "rgba(201,168,76,0.2)" : T.border(dark)}`,
          background: p.featured
            ? dark
              ? "linear-gradient(135deg, rgba(201,168,76,0.042) 0%, transparent 60%)"
              : "linear-gradient(135deg, rgba(201,168,76,0.065) 0%, rgba(250,248,243,0.92) 60%)"
            : T.card(dark),
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
                color: p.color || T.gold,
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
                color: hov ? T.gold : T.text(dark),
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
                color: T.gold,
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
            color: T.vfaint(dark),
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
            color: T.gold,
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
            color: T.dim(dark),
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
            borderLeft: `2px solid ${T.goldD}`,
            background: dark
              ? "rgba(201,168,76,0.035)"
              : "rgba(201,168,76,0.055)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: T.gold,
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
                color: T.dim(dark),
                marginBottom: 3,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: T.gold, flexShrink: 0 }}>→</span>
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
                border: `1px solid ${hov ? "rgba(201,168,76,0.3)" : T.border(dark)}`,
                color: hov ? "rgba(201,168,76,0.75)" : T.vfaint(dark),
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

const Work = ({ dark }: { dark: boolean }) => {
  const featured = DATA.projects.filter((p) => p.featured);
  const rest = DATA.projects.filter((p) => !p.featured);
  return (
    <section id="work" style={{ padding: "120px 0", background: T.bg(dark) }}>
      <div className="max-w-7xl mx-auto px-6">
        <SLabel dark={dark}>Executive Portfolio</SLabel>
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
              color: T.text(dark),
              lineHeight: 0.92,
              marginBottom: 20,
              fontFamily: "'Helvetica Neue', sans-serif",
            }}
          >
            Building systems
            <br />
            <span style={{ color: T.vfaint(dark) }}>that actually scale.</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: T.dim(dark),
              maxWidth: 540,
              fontWeight: 300,
              lineHeight: 1.65,
            }}
          >
            From AI-powered MarTech to indigenous community platforms. Every
            project architected to VP-level standards — engineered for
            real-world impact, not portfolios.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} dark={dark} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i + featured.length} dark={dark} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── STORY ────────────────────────────────────────────────────
const Story = ({ dark }: { dark: boolean }) => (
  <section id="story" style={{ padding: "120px 0", background: T.bg2(dark) }}>
    <div className="max-w-7xl mx-auto px-6">
      <SLabel dark={dark}>Eight Years. No Shortcuts.</SLabel>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: "clamp(36px,5vw,72px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: T.text(dark),
          lineHeight: 0.92,
          marginBottom: 80,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        From government portals
        <br />
        <span style={{ color: T.vfaint(dark) }}>to AI-powered empires.</span>
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
            background: `linear-gradient(to bottom, transparent, ${T.goldD}, transparent)`,
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
                    color: dark
                      ? "rgba(201,168,76,0.08)"
                      : "rgba(201,168,76,0.12)",
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
                    color: T.text(dark),
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
                    color: T.dim(dark),
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
              {/* Timeline dot */}
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
                  background: T.gold,
                  border: `3px solid ${T.bg2(dark)}`,
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

// ─── SKILLS ───────────────────────────────────────────────────
const Skills = ({ dark }: { dark: boolean }) => {
  const [active, setActive] = useState(0);
  return (
    <section id="skills" style={{ padding: "120px 0", background: T.bg(dark) }}>
      <div className="max-w-7xl mx-auto px-6">
        <SLabel dark={dark}>Technical Leadership</SLabel>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: "clamp(36px,5vw,72px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: T.text(dark),
            lineHeight: 0.92,
            marginBottom: 48,
            fontFamily: "'Helvetica Neue', sans-serif",
          }}
        >
          Deep stack.
          <br />
          <span style={{ color: T.vfaint(dark) }}>Not full stack.</span>
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
                background: active === i ? T.gold : "transparent",
                color: active === i ? "#000" : T.dim(dark),
                border: `1px solid ${active === i ? T.gold : T.border(dark)}`,
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
                  border: `1px solid ${T.border(dark)}`,
                  background: T.card(dark),
                  cursor: "default",
                }}
                whileHover={{ borderColor: "rgba(201,168,76,0.4)" }}
              >
                <span
                  style={{ fontSize: 13, color: T.dim(dark), fontWeight: 400 }}
                >
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

// ─── EXPERIENCE ───────────────────────────────────────────────
const Experience = ({ dark }: { dark: boolean }) => (
  <section style={{ padding: "80px 0", background: T.bg2(dark) }}>
    <div className="max-w-7xl mx-auto px-6">
      <SLabel dark={dark}>Career Timeline</SLabel>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: "clamp(32px,4vw,56px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: T.text(dark),
          lineHeight: 0.92,
          marginBottom: 64,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        5 companies.
        <br />
        <span style={{ color: T.vfaint(dark) }}>8+ years. Zero shortcuts.</span>
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
            borderTop: `1px solid ${T.border(dark)}`,
            cursor: "default",
            transition: "background 0.3s",
          }}
          onMouseEnter={(e2) =>
            ((e2.currentTarget as HTMLDivElement).style.background = dark
              ? "rgba(255,255,255,0.01)"
              : "rgba(26,26,26,0.02)")
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
                color: T.vfaint(dark),
                fontFamily: "monospace",
                marginBottom: 6,
              }}
            >
              {e.period}
            </div>
            <div
              style={{
                fontSize: 9,
                color: T.gold,
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
                color: T.text(dark),
                marginBottom: 4,
                letterSpacing: "-0.02em",
                fontFamily: "'Helvetica Neue', sans-serif",
              }}
            >
              {e.title}
            </h3>
            <div style={{ fontSize: 13, color: T.dim(dark), marginBottom: 16 }}>
              {e.co} · {e.loc}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {e.points.map((pt) => (
                <div
                  key={pt}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                >
                  <span style={{ color: T.goldD, flexShrink: 0, marginTop: 1 }}>
                    →
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: T.dim(dark),
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
                  border: `1px solid ${T.border(dark)}`,
                  color: T.vfaint(dark),
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

// ─── OPEN SOURCE / GITHUB ─────────────────────────────────────
const Github = ({ dark }: { dark: boolean }) => (
  <section id="github" style={{ padding: "80px 0", background: T.bg(dark) }}>
    <div className="max-w-7xl mx-auto px-6">
      <SLabel dark={dark}>Open Source</SLabel>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: "clamp(32px,4vw,56px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: T.text(dark),
          lineHeight: 0.92,
          marginBottom: 40,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        Shipping code.
        <br />
        <span style={{ color: T.vfaint(dark) }}>Every. Single. Day.</span>
      </motion.h2>
      <ContribGraph dark={dark} />
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
              border: `1px solid ${T.border(dark)}`,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                T.goldD)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                T.border(dark))
            }
          >
            <span style={{ fontSize: 20, color: T.gold }}>⬡</span>
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: T.text(dark) }}
              >
                {g.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: T.vfaint(dark),
                }}
              >
                {g.sub}
              </div>
            </div>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: T.vfaint(dark),
              }}
            >
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

// ─── BLOG TEASER ──────────────────────────────────────────────
const Blog = ({ dark }: { dark: boolean }) => (
  <section id="blog" style={{ padding: "80px 0", background: T.bg2(dark) }}>
    <div className="max-w-7xl mx-auto px-6">
      <SLabel dark={dark}>Writing & Thoughts</SLabel>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: "clamp(32px,4vw,56px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: T.text(dark),
          lineHeight: 0.92,
          marginBottom: 16,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        I think in systems.
        <br />
        <span style={{ color: T.vfaint(dark) }}>I write in posts.</span>
      </motion.h2>
      <p
        style={{
          fontSize: 15,
          color: T.dim(dark),
          marginBottom: 48,
          fontWeight: 300,
          maxWidth: 480,
          lineHeight: 1.65,
        }}
      >
        Deep dives into React Native architecture, AI pipelines, blockchain, and
        what it actually takes to ship production-grade apps. Coming to Medium
        soon.
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
              border: `1px solid ${T.border(dark)}`,
              background: T.card(dark),
              cursor: "default",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor = T.goldD)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                T.border(dark))
            }
          >
            <div
              style={{
                fontSize: 9,
                color: T.gold,
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
                color: T.text(dark),
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
                color: T.dim(dark),
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

// ─── TESTIMONIALS ─────────────────────────────────────────────
const Testimonials = ({ dark }: { dark: boolean }) => (
  <section
    id="testimonials"
    style={{ padding: "120px 0", background: T.bg(dark) }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <SLabel dark={dark}>What Leaders Say</SLabel>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          fontSize: "clamp(36px,5vw,72px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: T.text(dark),
          lineHeight: 0.92,
          marginBottom: 16,
          fontFamily: "'Helvetica Neue', sans-serif",
        }}
      >
        Leaders endorse me.
        <br />
        <span style={{ color: T.vfaint(dark) }}>Teams grow under me.</span>
      </motion.h2>
      <p
        style={{
          fontSize: 14,
          color: T.dim(dark),
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
              border: `1px solid ${T.border(dark)}`,
              background: T.card(dark),
              position: "relative",
              transition: "border-color 0.3s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(201,168,76,0.35)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                T.border(dark))
            }
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
                color: dark ? "rgba(255,255,255,0.04)" : "rgba(26,26,26,0.06)",
                position: "absolute",
                top: 18,
                right: 24,
                lineHeight: 1,
                fontFamily: "'Georgia', serif",
                userSelect: "none",
              }}
            >
              "
            </div>
            <p
              style={{
                fontSize: 14,
                color: T.dim(dark),
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
                    color: T.text(dark),
                    textDecoration: "none",
                  }}
                >
                  {t.name}
                </a>
                <div style={{ fontSize: 11, color: T.dim(dark), marginTop: 2 }}>
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

// ─── CONTACT ──────────────────────────────────────────────────
const Contact = ({ dark }: { dark: boolean }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    co: "",
    role: "",
    msg: "",
  });
  const [st, setSt] = useState<"idle" | "sending" | "sent" | "err">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSt("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `${form.role} @ ${form.co}`,
          message: form.msg,
        }),
      });
      setSt(r.ok ? "sent" : "err");
      if (r.ok) setForm({ name: "", email: "", co: "", role: "", msg: "" });
    } catch {
      setSt("err");
    }
  };

  const inp = {
    padding: "16px 20px",
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
    background: dark ? "rgba(255,255,255,0.025)" : "rgba(250,248,243,0.6)",
    border: `1px solid ${T.border(dark)}`,
    color: T.text(dark),
    fontFamily: "inherit",
  };

  return (
    <section
      id="contact"
      style={{ padding: "120px 0", background: T.bg2(dark) }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_1.3fr] gap-16 md:gap-20">
          <div>
            <SLabel dark={dark}>Let's Connect</SLabel>
            <h2
              style={{
                fontSize: "clamp(32px,4.5vw,60px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: T.text(dark),
                lineHeight: 0.9,
                marginBottom: 24,
                fontFamily: "'Helvetica Neue', sans-serif",
              }}
            >
              Ready to lead
              <br />
              <span
                style={{
                  WebkitTextStroke: `2px ${T.goldD}`,
                  color: "transparent",
                }}
              >
                your next empire.
              </span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: T.dim(dark),
                lineHeight: 1.7,
                marginBottom: 40,
                fontWeight: 300,
              }}
            >
              VP Engineering. CTO. Principal Architect. Whatever the title — I
              build systems that survive, lead teams that deliver, and turn
              technical vision into market reality.
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
                data-h
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 14,
                  marginBottom: 14,
                  borderBottom: `1px solid ${T.border(dark)}`,
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderBottomColor = T.goldD)
                }
                onMouseLeave={(e) =>
                  ((
                    e.currentTarget as HTMLAnchorElement
                  ).style.borderBottomColor = T.border(dark))
                }
              >
                <span
                  style={{
                    fontSize: 10,
                    color: T.vfaint(dark),
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
                    color: T.dim(dark),
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = T.gold)
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = T.dim(dark))
                  }
                >
                  {link.v} ↗
                </span>
              </a>
            ))}
          </div>
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Your name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inp}
              />
              <input
                type="email"
                placeholder="Your email *"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inp}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Company"
                value={form.co}
                onChange={(e) => setForm({ ...form, co: e.target.value })}
                style={inp}
              />
              <input
                placeholder="Your role (VP / CTO / Founder)"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={inp}
              />
            </div>
            <textarea
              rows={7}
              placeholder="Tell me about the opportunity... *"
              required
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              style={{ ...inp, resize: "none" }}
            />
            <button
              type="submit"
              disabled={st === "sending"}
              data-h
              style={{
                width: "100%",
                padding: 18,
                background: T.goldGrad,
                border: "none",
                color: "#000",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: "monospace",
                cursor: "pointer",
                transition: "all 0.2s",
                opacity: st === "sending" ? 0.6 : 1,
              }}
            >
              {st === "idle"
                ? "Send Message →"
                : st === "sending"
                  ? "Sending..."
                  : st === "sent"
                    ? "Message Sent ✓"
                    : "Error — Try Again"}
            </button>
            {st === "sent" && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: T.gold,
                  fontFamily: "monospace",
                  opacity: 0.7,
                }}
              >
                Received! I'll respond within 24 hours.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────
const Footer = ({ dark }: { dark: boolean }) => (
  <footer
    style={{
      padding: "48px 0",
      borderTop: `1px solid ${T.border(dark)}`,
      background: T.bg(dark),
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
            color: T.text(dark),
            fontFamily: "'Helvetica Neue', sans-serif",
          }}
        >
          <span style={{ color: T.gold }}>A</span>C
          <span style={{ color: T.goldF }}>.</span>
        </span>
        <p
          style={{
            fontSize: 10,
            color: T.vfaint(dark),
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
          color: T.vfaint(dark),
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} {DATA.name} · Architected with precision.
        Not AI noise.
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
              color: T.vfaint(dark),
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLAnchorElement).style.color = T.gold)
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLAnchorElement).style.color = T.vfaint(dark))
            }
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
export default function Portfolio() {
  const { dark, toggle } = useTheme();
  return (
    <div
      style={{
        background: T.bg(dark),
        color: T.text(dark),
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        cursor: "none",
        overflowX: "hidden",
      }}
    >
      {/* SEO: Add to page metadata: title="Amit Chakraborty — Principal Mobile Architect · VP Engineering · CTO" */}
      <Progress />
      <Noise />
      <Orbs dark={dark} />
      <Cursor />
      <Nav dark={dark} toggle={toggle} />
      <Hero dark={dark} />
      <Work dark={dark} />
      <Story dark={dark} />
      <Skills dark={dark} />
      <Experience dark={dark} />
      <Github dark={dark} />
      <Blog dark={dark} />
      <Testimonials dark={dark} />
      <Contact dark={dark} />
      <Footer dark={dark} />

      <style>{`
        @keyframes ac-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overscroll-behavior: none; }
        ::placeholder { color: ${dark ? "rgba(255,255,255,0.2)" : "rgba(26,26,26,0.32)"}; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${T.bg(dark)}; }
        ::-webkit-scrollbar-thumb { background: ${T.goldD}; }
        a { text-decoration: none; }
        input, textarea, button { font-family: inherit; }
        .lg\\:grid-cols-\\[1\\.1fr_0\\.9fr\\] { grid-template-columns: 1.1fr 0.9fr; }
        @media (max-width: 1023px) { .grid.lg\\:grid-cols-\\[1\\.1fr_0\\.9fr\\] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
