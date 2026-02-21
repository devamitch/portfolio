import type { Metadata, Viewport } from "next";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { DM_Sans, Space_Grotesk, Space_Mono } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = "https://devamit.co.in";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C9A84C" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Amit Chakraborty — Principal Mobile Architect | React Native · AI · Blockchain · HealthTech",
    template: "%s | Amit Chakraborty — Principal Mobile Architect",
  },
  description:
    "Amit Chakraborty is a Principal Mobile Architect with 8+ years building AI-powered, blockchain-integrated, HIPAA-compliant production apps. 18+ apps shipped. 50K+ users. VP-level engineering leadership. Expert in React Native (Bridgeless), RAG Pipelines, LLM Integration, Solidity, Web3, HealthTech, and native C++/Swift/Kotlin modules. Based in Kolkata, India — available remote worldwide.",
  keywords: [
    // Identity
    "Amit Chakraborty",
    "devamit",
    "devamitch",
    "amit98ch",
    "techamit95ch",
    "Amit Chakraborty Kolkata",
    "Amit Chakraborty developer",
    // Core role
    "Principal Mobile Architect",
    "VP Engineering",
    "CTO for hire",
    "Technical Lead India",
    "React Native Expert",
    "React Native Architect",
    "React Native Bridgeless Architecture",
    "React Native developer India",
    "React Native consultant",
    "React Native freelancer",
    "Senior React Native developer",
    "Hire React Native developer",
    "React Native developer Kolkata",
    // AI & ML
    "AI mobile app developer",
    "RAG pipeline developer",
    "LLM integration React Native",
    "Agentic AI developer",
    "MediaPipe React Native",
    "Computer Vision mobile",
    "TensorFlow mobile",
    "Pinecone vector database",
    "OpenAI integration developer",
    // Blockchain / Web3
    "Blockchain mobile developer",
    "Web3 mobile developer",
    "Solidity developer",
    "DeFi app developer",
    "NFT marketplace developer",
    "Smart contract developer",
    "Ethereum React Native",
    "Solana developer",
    "WalletConnect integration",
    // HealthTech
    "HealthTech mobile developer",
    "HIPAA compliant mobile app",
    "medical app React Native",
    "healthcare AI developer",
    "women health app developer",
    "eye care app MediaPipe",
    // Projects
    "Spyk Health",
    "oLo Eye Care",
    "myTeal women health",
    "VitalQuest game engine",
    "Vulcan Eleven fantasy sports",
    "DeFi11 blockchain",
    "MusicX blockchain royalties",
    "Housezy property management",
    "Maskwa Indigenous platform",
    "Be4You dating app",
    "Nexus AI marketing",
    "vBoil recycled oil",
    // Specialties
    "custom game engine React Native",
    "C++ native modules React Native",
    "HIPAA RAG pipeline",
    "mobile architecture consulting",
    "0 to 1 app development",
    "full stack mobile developer",
    "gaming engine mobile",
    "fantasy sports app developer",
    "on-chain smart contract sports",
    // Stack
    "Node.js developer",
    "NestJS developer",
    "Next.js developer",
    "GraphQL mobile",
    "Docker Kubernetes mobile CI/CD",
    "AWS Lambda mobile backend",
    "PostgreSQL MongoDB developer",
    "TypeScript React Native",
    "Expo developer",
    // General
    "Mobile development consultant",
    "remote mobile architect",
    "Principal engineer India",
  ],
  authors: [
    { name: "Amit Chakraborty", url: BASE_URL },
    { name: "Amit Chakraborty", url: "https://www.linkedin.com/in/devamitch/" },
    { name: "Amit Chakraborty", url: "https://github.com/devamitch" },
    { name: "Amit Chakraborty", url: "https://x.com/devamitch" },
  ],
  creator: "Amit Chakraborty",
  publisher: "Amit Chakraborty",
  category:
    "Technology, Mobile Development, Software Engineering, AI, Blockchain, HealthTech",
  classification: "Professional Portfolio — Principal Mobile Architect",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_IN",
    alternateLocale: ["en_US", "en_GB", "en_AU", "en_CA"],
    url: BASE_URL,
    siteName: "Amit Chakraborty — Principal Mobile Architect",
    title:
      "Amit Chakraborty — React Native Mobile Architect | AI · Blockchain · HealthTech",
    description:
      "Principal Mobile Architect with 8+ years engineering production systems. 18+ apps shipped. 50K+ users. Expert in React Native (Bridgeless), RAG Pipelines, LLMs, Solidity, DeFi, HIPAA HealthTech, and custom game engines. Led teams of 21+. VP-level engineering. Available remote worldwide.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Amit Chakraborty — Principal Mobile Architect | React Native · AI · Blockchain",
        type: "image/png",
      },
      {
        url: "https://github.com/devamitch.png",
        width: 400,
        height: 400,
        alt: "Amit Chakraborty — Principal Mobile Architect",
        type: "image/png",
      },
    ],
    firstName: "Amit",
    lastName: "Chakraborty",
    username: "devamitch",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    site: "@devamitch",
    creator: "@devamitch",
    title:
      "Amit Chakraborty — React Native Mobile Architect | AI · Blockchain · HealthTech",
    description:
      "Principal Mobile Architect | 8+ yrs | React Native · AI · Blockchain | 18+ apps · 50K+ users | Custom game engines · RAG Pipelines · HIPAA HealthTech | Available for VP / CTO / Architect roles",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Amit Chakraborty — Principal Mobile Architect",
      },
    ],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "en-US": BASE_URL,
      "en-GB": BASE_URL,
    },
  },
  verification: {
    google: "z_JuRWCMNzddlpL1pAxMoqntcmvXBstj_lQW0GZWXnU",
    other: {
      "google-site-verification": "iHdepblaP_OakJ-74RUhDJ4LqS8eOOxbFZ_ajHJmKwo",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Amit Chakraborty",
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#C9A84C" },
    ],
  },
  manifest: "/manifest.json",
};

/* ─────────────────────────────────────────────────────────
   JSON-LD STRUCTURED DATA — COMPREHENSIVE
───────────────────────────────────────────────────────── */

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Amit Chakraborty",
  givenName: "Amit",
  familyName: "Chakraborty",
  url: BASE_URL,
  image: {
    "@type": "ImageObject",
    url: "https://github.com/devamitch.png",
    width: 400,
    height: 400,
    caption: "Amit Chakraborty — Principal Mobile Architect",
  },
  jobTitle: "Principal Mobile Architect",
  description:
    "Principal Mobile Architect with 8+ years engineering 0-to-1 production applications at the intersection of AI, blockchain, and healthcare. Shipped 18+ apps serving 50,000+ users. Expert in React Native (Bridgeless), RAG pipelines, LLM integration, HIPAA-compliant HealthTech, custom game engines, Solidity, DeFi, and native C++/Swift/Kotlin modules. Led engineering teams of 21+. Available for VP Engineering, CTO, and Principal Architect roles — remote worldwide.",
  email: "amit98ch@gmail.com",
  telephone: "+91-9874173663",
  birthDate: "1995-09-19",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700144",
    addressCountry: "IN",
  },
  nationality: {
    "@type": "Country",
    name: "India",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Techno Main Salt Lake",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolkata",
        addressCountry: "IN",
      },
    },
    {
      "@type": "CollegeOrUniversity",
      name: "The Heritage Academy",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolkata",
        addressCountry: "IN",
      },
    },
  ],
  knowsAbout: [
    "React Native",
    "React Native Bridgeless Architecture",
    "Mobile Architecture",
    "Custom Game Engine Development",
    "Blockchain Development",
    "Solidity",
    "Ethereum",
    "Solana",
    "DeFi Protocols",
    "NFT Development",
    "Smart Contracts",
    "Web3",
    "HealthTech",
    "HIPAA Compliance",
    "RAG Pipelines",
    "LLM Integration",
    "Agentic AI",
    "Computer Vision",
    "MediaPipe",
    "TensorFlow",
    "Node.js",
    "NestJS",
    "Next.js",
    "TypeScript",
    "C++ Native Modules",
    "Swift",
    "Kotlin",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Fastlane",
    "iOS Development",
    "Android Development",
    "Expo",
    "Redux",
    "Framer Motion",
    "GSAP",
    "Reanimated",
    "WebRTC",
    "Socket.io",
    "Payment Gateways",
    "Stripe",
    "Razorpay",
    "Binance Pay",
    "Django",
    "PHP",
    "Laravel",
    "VP Engineering",
    "Technical Leadership",
    "Team Building",
    "Stakeholder Management",
    "Agile",
    "Scrum",
    "0-to-1 Product Development",
    "NEAR Blockchain",
    "IPFS",
    "WalletConnect",
    "Pinecone",
    "Firebase",
    "Redis",
    "Women's HealthTech",
    "Eye Care Computer Vision",
    "Fantasy Sports Platforms",
    "PropTech",
    "EdTech",
    "Social Impact Technology",
    "Indigenous Community Technology",
    "GreenTech",
  ],
  sameAs: [
    "https://www.linkedin.com/in/devamitch/",
    "https://github.com/devamitch",
    "https://github.com/techamit95ch",
    "https://devamitch.medium.com/",
    "https://x.com/devamitch",
    "https://twitter.com/devamitch",
    "https://www.hackerrank.com/amit98ch",
    "https://leetcode.com/techamit95ch/",
    "https://www.hackerearth.com/@amit98ch",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Available for VP Engineering · CTO · Principal Architect Roles",
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Principal Mobile Architect",
    description:
      "Designing and engineering 0-to-1 production-grade mobile applications using React Native, AI/ML pipelines, and blockchain technologies. Leading engineering teams of 20+ across HealthTech, DeFi, Sports, and Social platforms.",
    occupationLocation: {
      "@type": "Country",
      name: "Remote / Worldwide",
    },
    skills:
      "React Native, TypeScript, Blockchain, AI Integration, Mobile Architecture, HealthTech, HIPAA Compliance, RAG Pipelines, LLMs, Computer Vision, Solidity, DeFi, NFT, C++ Native Modules, VP Engineering",
    estimatedSalary: {
      "@type": "MonetaryAmountDistribution",
      name: "Senior Engineering",
      currency: "USD",
      duration: "P1Y",
      percentile10: 80000,
      percentile25: 100000,
      median: 130000,
      percentile75: 160000,
      percentile90: 200000,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Amit Chakraborty — Principal Mobile Architect",
  description:
    "Official portfolio of Amit Chakraborty, Principal Mobile Architect specializing in React Native (Bridgeless), AI/ML, Blockchain, and HealthTech. 18+ production apps. 50K+ users. 8+ years engineering experience.",
  inLanguage: "en-IN",
  author: { "@id": `${BASE_URL}/#person` },
  publisher: { "@id": `${BASE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Projects",
      item: `${BASE_URL}/#work`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Experience",
      item: `${BASE_URL}/#experience`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Skills",
      item: `${BASE_URL}/#skills`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Contact",
      item: `${BASE_URL}/#contact`,
    },
  ],
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#service`,
  name: "Amit Chakraborty — Mobile Architecture & Engineering Services",
  description:
    "Professional React Native architecture, AI/ML mobile integration, blockchain development, HIPAA-compliant HealthTech solutions, custom game engine development, and VP-level engineering leadership.",
  provider: { "@id": `${BASE_URL}/#person` },
  areaServed: {
    "@type": "Country",
    name: "Worldwide",
  },
  serviceType: [
    "React Native Development",
    "Mobile Architecture Consulting",
    "Blockchain & Web3 Integration",
    "AI/ML Mobile Implementation",
    "RAG Pipeline Engineering",
    "LLM Integration",
    "HIPAA-Compliant HealthTech",
    "Custom Game Engine Development",
    "Computer Vision Mobile",
    "DeFi & NFT Platforms",
    "VP Engineering Leadership",
    "Technical Team Building",
    "0-to-1 Product Development",
    "Performance Optimization",
    "CI/CD Pipeline Setup",
  ],
  priceRange: "Contact for Quote",
  url: BASE_URL,
  telephone: "+91-9874173663",
  email: "amit98ch@gmail.com",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${BASE_URL}/#contact`,
    serviceType: "Remote — Worldwide",
  },
};

/* ── Work Experience Schema ── */
const workExperienceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Amit Chakraborty — Work Experience",
  description:
    "Professional experience of Principal Mobile Architect Amit Chakraborty",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "OrganizationRole",
        roleName: "Principal Mobile Architect & Technical Lead",
        startDate: "2025-01",
        endDate: "2026-02",
        description:
          "Led engineering team of 21+ across 5 production iOS/Android apps at HealthTech AI startup. Built custom game engine from scratch (C++/Swift/Kotlin bridgeless). Architected HIPAA-compliant RAG pipelines. Implemented Computer Vision with MediaPipe for real-time retina analysis. Managed 500+ projects. VP-level client relationships and technical strategy.",
        worksFor: {
          "@type": "Organization",
          name: "Synapsis Medical Technologies Inc.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Edmonton",
            addressRegion: "Alberta",
            addressCountry: "CA",
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "OrganizationRole",
        roleName: "Lead Mobile Architect & Senior Full-Stack Developer",
        startDate: "2021-10",
        endDate: "2025-01",
        description:
          "Shipped 13+ production apps across FinTech, Web3, and Gaming at blockchain-focused company. Built apps serving 50,000+ active users. Deep expertise in DeFi, NFTs, smart contracts, Razorpay, Binance Pay, C++ Native Modules, and 60fps animations. Primary technical liaison and hiring lead.",
        worksFor: {
          "@type": "Organization",
          name: "NonceBlox Pvt. Ltd.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Dubai",
            addressCountry: "AE",
          },
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "OrganizationRole",
        roleName: "Senior Full-Stack Engineer & PHP Developer",
        startDate: "2017-05",
        endDate: "2021-10",
        description:
          "Secured and delivered 13+ government digital projects. Architected GST Ecosystem (Merchant Portal, Android App, Retailer Software). Enhanced system efficiency by 40%. Migrated legacy PHP to Angular/REST. Developed proprietary PHP framework.",
        worksFor: {
          "@type": "Organization",
          name: "Techpromind & Webskitters",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kolkata",
            addressRegion: "West Bengal",
            addressCountry: "IN",
          },
        },
      },
    },
  ],
};

/* ── Projects / CreativeWorks Schema ── */
const projectsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Amit Chakraborty — Engineering Portfolio",
  description:
    "Production applications designed and engineered by Principal Mobile Architect Amit Chakraborty",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "Spyk Health (VitalQuest)",
        applicationCategory: "HealthApplication",
        operatingSystem: "iOS, Android",
        description:
          "Gamified health engagement platform built with a custom game engine written from absolute scratch — zero external dependencies. Features LLM-based dynamic health task generation at runtime, XP progression system, and RAG pipeline for HIPAA-compliant medical context retrieval.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "custom game engine, LLM, RAG pipeline, HIPAA, React Native, HealthTech, gamification",
        featureList: [
          "Custom game engine — zero external dependencies",
          "LLM-based dynamic task generation at runtime",
          "RAG pipeline for HIPAA-compliant medical data",
          "XP progression system",
          "AI-powered health engagement",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "oLo Eye Care",
        applicationCategory: "MedicalApplication",
        operatingSystem: "iOS, Android",
        description:
          "Real-time eye health monitoring app using MediaPipe on-device. Medical-grade computer vision on consumer smartphones. Features retina coverage analysis, blink rate detection, eye redness assessment, and luminance tracking.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "MediaPipe, Computer Vision, React Native, eye health, medical device, retina analysis",
        featureList: [
          "Medical-grade computer vision on consumer hardware",
          "Real-time retina coverage analysis",
          "Blink rate detection",
          "Eye redness assessment",
          "Luminance tracking",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "myTeal Women's Health",
        applicationCategory: "HealthApplication",
        operatingSystem: "iOS, Android",
        description:
          "Privacy-first women's mental and physical health platform. Features AI-driven wellness recommendations, cycle tracking, mood journaling, adaptive meditation engine, and local-first encrypted data storage — zero third-party data sales.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "women's health, cycle tracking, mood journaling, AI wellness, privacy-first, React Native, HealthTech",
        featureList: [
          "Personalised cycle, mood, and sleep tracking",
          "AI wellness recommendations engine",
          "Adaptive meditation engine",
          "Privacy-first — zero third-party data sales",
          "Local-first encrypted storage",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SoftwareApplication",
        name: "Vulcan Eleven",
        applicationCategory: "GameApplication",
        operatingSystem: "iOS, Android",
        url: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
        description:
          "Fantasy sports platform with 60fps performance serving 50,000+ active users. Features Razorpay + Binance Pay dual-payment driving 35% transaction volume growth, real-time analytics, live score updates, and FCM push notifications.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "fantasy sports, React Native, Razorpay, Binance Pay, 50K users, real-time, C++ modules",
        featureList: [
          "50,000+ active users",
          "35% transaction growth",
          "Binance Pay + Razorpay dual-payment",
          "60fps React Native animations",
          "Real-time live score analytics",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SoftwareApplication",
        name: "DeFi11",
        applicationCategory: "FinanceApplication",
        operatingSystem: "iOS, Android",
        url: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
        description:
          "Fully decentralized fantasy sports platform. 100% on-chain smart contract prize pools, on-chain tournament logic, zero centralized custody, and NFT marketplace on Ethereum.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "DeFi, fantasy sports, smart contracts, Solidity, Ethereum, NFT, on-chain, decentralized",
        featureList: [
          "100% on-chain prize pools",
          "Smart contract architecture",
          "Zero-trust design",
          "NFT marketplace",
          "Cross-chain wallet support",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SoftwareApplication",
        name: "MusicX",
        applicationCategory: "MusicApplication",
        operatingSystem: "iOS",
        url: "https://apps.apple.com/app/music-x/id6475713772",
        description:
          "Music competition platform with blockchain-backed royalty tracking for independent artists. Features native C++ modules, 60fps animations, Twitter and Spotify API integration, and algorithm-driven user engagement.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "music, blockchain royalties, React Native, C++ native modules, 60fps, artists",
        featureList: [
          "Blockchain royalty system for artists",
          "Native C++ modules",
          "60fps animations",
          "Twitter + Spotify API integration",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "SoftwareApplication",
        name: "Housezy",
        applicationCategory: "BusinessApplication",
        operatingSystem: "iOS",
        url: "https://apps.apple.com/app/housezy/id6471949955",
        description:
          "Property management platform with subscription billing, PayU + Google Pay payment gateways, GraphQL APIs, Socket.io real-time notifications, and pixel-perfect iOS UI from Figma to production.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "property management, PropTech, React Native, GraphQL, Socket.io, PayU, subscription billing",
        featureList: [
          "Subscription billing layer",
          "Real-time notifications via Socket.io",
          "PayU + Google Pay integration",
          "GraphQL API architecture",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 8,
      item: {
        "@type": "SoftwareApplication",
        name: "Maskwa",
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "iOS, Android",
        description:
          "Mobile platform for Canadian Indigenous communities enabling cultural preservation, community development, and economic empowerment through technology.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "Indigenous communities, cultural preservation, community platform, React Native, social impact",
      },
    },
    {
      "@type": "ListItem",
      position: 9,
      item: {
        "@type": "SoftwareApplication",
        name: "Be4You Dating App",
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "iOS, Android",
        description:
          "Full dating app MVP delivered in 90 days for seed funding round. Features real-time chat via Socket.io, Zoom-style video calls, live geolocation, social + Apple authentication, and custom animations.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "dating app, React Native, WebRTC, Socket.io, video calls, real-time, MVP",
        featureList: [
          "Full MVP delivered in 90 days",
          "Real-time video + chat + location",
          "Zoom-style video calling",
          "Social and Apple authentication",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 10,
      item: {
        "@type": "SoftwareApplication",
        name: "Nexus AI / Thoth Marketing AI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "iOS, Android, Web",
        description:
          "Enterprise AI orchestration platform unifying Shopify, TikTok, Meta, and 5+ marketing channels. Autonomous campaign analysis, real-time cross-platform optimization, and AI-driven recommendation engine.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "AI marketing, enterprise AI, multi-channel, Shopify, Meta, TikTok, agentic AI, React Native",
        featureList: [
          "5+ platforms unified into one AI brain",
          "Autonomous campaign recommendations",
          "Real-time cross-channel analytics",
        ],
      },
    },
    {
      "@type": "ListItem",
      position: 11,
      item: {
        "@type": "SoftwareApplication",
        name: "vBoil (Vanbrant Oil)",
        applicationCategory: "BusinessApplication",
        operatingSystem: "iOS, Android",
        description:
          "End-to-end recycled oil supply chain management platform. Covers B2B transaction flows, geolocation tracking, environmental impact analytics, and lifecycle monitoring from collection to distribution.",
        creator: { "@id": `${BASE_URL}/#person` },
        keywords:
          "GreenTech, recycled oil, supply chain, B2B, geolocation, environmental analytics, React Native",
      },
    },
  ],
};

/* ── FAQ Schema — surfaces in Google rich results ── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Amit Chakraborty specialize in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amit Chakraborty specializes in React Native mobile architecture, AI/ML integration (RAG pipelines, LLMs, computer vision), blockchain development (Solidity, DeFi, NFTs), and HIPAA-compliant HealthTech systems. He has 8+ years of engineering experience and has shipped 18+ production apps serving 50,000+ users.",
      },
    },
    {
      "@type": "Question",
      name: "Is Amit Chakraborty available for hire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Amit is available for VP Engineering, CTO, and Principal Architect roles. He works remotely worldwide. You can contact him at amit98ch@gmail.com or through the contact form at devamit.co.in.",
      },
    },
    {
      "@type": "Question",
      name: "What apps has Amit Chakraborty built?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amit has built 18+ production apps including: Spyk Health (custom game engine + LLMs), oLo Eye Care (MediaPipe computer vision), myTeal (women's health AI), Vulcan Eleven (fantasy sports, 50K+ users), DeFi11 (fully on-chain fantasy sports), MusicX (blockchain royalties), Housezy (property management), Maskwa (Indigenous communities platform), Be4You (dating app MVP), Nexus AI (enterprise marketing AI), and vBoil (recycled oil supply chain).",
      },
    },
    {
      "@type": "Question",
      name: "What is Amit Chakraborty's experience with React Native?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amit has 8+ years of expert-level React Native experience including advanced topics like Bridgeless Architecture, native C++/Swift/Kotlin modules, 60fps animations with Reanimated, custom game engine development, and production deployment to both iOS App Store and Google Play Store.",
      },
    },
    {
      "@type": "Question",
      name: "Does Amit Chakraborty have experience with AI and machine learning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Amit has built RAG (Retrieval-Augmented Generation) pipelines for HIPAA-compliant medical data, integrated LLMs (OpenAI, Claude) for real-time task generation, implemented computer vision with MediaPipe for medical retina analysis, worked with TensorFlow, Pinecone vector databases, and built agentic AI systems for automated patient triage.",
      },
    },
    {
      "@type": "Question",
      name: "What blockchain and Web3 experience does Amit Chakraborty have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amit has 3+ years of blockchain development experience including Solidity smart contracts on Ethereum, DeFi protocol development, NFT marketplace architecture, WalletConnect integration, Solana (Rust/Anchor), NEAR blockchain, IPFS, and cross-chain wallet applications. He built DeFi11 — a fully decentralized fantasy sports platform with 100% on-chain prize pools.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Amit Chakraborty located and does he work remotely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amit is based in Kolkata, West Bengal, India, and is available for remote work worldwide. He has experience working with teams in Canada, Dubai, and globally distributed engineering organizations.",
      },
    },
  ],
};

/* ── Review / Testimonial Schema ── */
const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Kartik Kalia",
        jobTitle: "Full Stack Developer — AWS",
        worksFor: { "@type": "Organization", name: "NonceBlox Pvt. Ltd." },
      },
      datePublished: "2024-11",
      reviewBody:
        "I had the pleasure of working with Amit for three years and witnessed his impressive growth from Front-End Developer to Front-End Lead. Throughout our time together, we collaborated on various projects, including both web and mobile applications. Amit is someone I can always rely on for high-quality work and timely project delivery. His expertise and dedication make him a valuable asset to any team.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Neha Goel",
        jobTitle: "HR Professional — 15+ Years",
        worksFor: { "@type": "Organization", name: "NonceBlox Pvt. Ltd." },
      },
      datePublished: "2024-10",
      reviewBody:
        "Amit had been an amicable and diligent developer — one of the most dependable Engineers when it comes to delivery or urgent closures. His capability to rebuild any project from scratch is remarkable. We truly appreciate his understandability and issues identification.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Puja Rani Tripathy",
        jobTitle: "Software Developer",
        worksFor: {
          "@type": "Organization",
          name: "Synapsis Medical Technologies",
        },
      },
      datePublished: "2026-02",
      reviewBody:
        "I had the chance to work closely with Amit during several fast-paced release cycles. He played a key role in code reviews, ensuring quality and consistency across the codebase while guiding multiple teams through complex technical tasks and blockers. Reliable, technically strong, and a great support.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Varun Chodha",
        jobTitle: "Senior Full-Stack Developer — MERN",
        worksFor: { "@type": "Organization", name: "NonceBlox Pvt. Ltd." },
      },
      datePublished: "2024-10",
      reviewBody:
        "Amit played a pivotal role in mentoring me, sharing his profound knowledge of Redux, React Native, and frontend concepts. His guidance helped me build a solid foundation. His enthusiasm for coding and pursuit for perfection are truly inspiring.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    },
  ],
};

/* ── Skills / Education Schema ── */
const educationSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Master of Computer Applications (MCA)",
      description:
        "DGPA: 8.61/10 — Coding Group Secretary, IoT Awareness Organizer",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "Techno Main Salt Lake",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressCountry: "IN",
        },
      },
      dateCreated: "2021-08",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Bachelor of Computer Applications (BCA)",
      description: "DGPA: 7.3/10",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "The Heritage Academy",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressCountry: "IN",
        },
      },
      dateCreated: "2017-08",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "Blockchain Development — Solidity, Smart Contracts, DeFi, NFTs",
      recognizedBy: { "@type": "Organization", name: "Udemy" },
      dateCreated: "2022",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "Solana Blockchain Developer Bootcamp with Rust + JavaScript",
      recognizedBy: { "@type": "Organization", name: "Udemy" },
      dateCreated: "2023",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "HackerRank Certified: Problem Solving, React, JavaScript",
      recognizedBy: { "@type": "Organization", name: "HackerRank" },
      dateCreated: "2021",
    },
  ],
};

/* ─────────────────────────────────────────────────────────
   ROOT LAYOUT
───────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* ── Sitemap & Preconnects ── */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://github.com" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />

        {/* ── Robots & Crawl Directives ── */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="bingbot" content="index, follow" />
        <meta name="google" content="notranslate" />

        {/* ── Geo Tags ── */}
        <meta name="geo.region" content="IN-WB" />
        <meta name="geo.placename" content="Kolkata, West Bengal, India" />
        <meta name="geo.position" content="22.5726;88.3639" />
        <meta name="ICBM" content="22.5726, 88.3639" />

        {/* ── Open Graph Extended ── */}
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content="profile" />
        <meta property="profile:first_name" content="Amit" />
        <meta property="profile:last_name" content="Chakraborty" />
        <meta property="profile:username" content="devamitch" />
        <meta property="profile:gender" content="male" />
        <meta
          property="og:see_also"
          content="https://www.linkedin.com/in/devamitch/"
        />
        <meta property="og:see_also" content="https://github.com/devamitch" />
        <meta property="og:see_also" content="https://x.com/devamitch" />
        <meta property="og:see_also" content="https://devamitch.medium.com/" />

        {/* ── Twitter / X Extended ── */}
        <meta name="twitter:site" content="@devamitch" />
        <meta name="twitter:creator" content="@devamitch" />
        <meta name="twitter:domain" content="devamit.co.in" />
        <meta name="twitter:url" content={BASE_URL} />
        <meta name="twitter:label1" content="Experience" />
        <meta name="twitter:data1" content="8+ Years Engineering" />
        <meta name="twitter:label2" content="Apps Shipped" />
        <meta name="twitter:data2" content="18+ Production Apps" />

        {/* ── MS/Apple App Tags ── */}
        <meta name="msapplication-TileColor" content="#C9A84C" />
        <meta
          name="msapplication-TileImage"
          content="/android-chrome-192x192.png"
        />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Amit Chakraborty" />

        {/* ── Authorship & Identity ── */}
        <link rel="me" href="https://www.linkedin.com/in/devamitch/" />
        <link rel="me" href="https://github.com/devamitch" />
        <link rel="me" href="https://x.com/devamitch" />
        <link rel="me" href="https://devamitch.medium.com/" />

        {/* ── Canonical & Alternates ── */}
        <link rel="canonical" href={BASE_URL} />

        {/* ── Structured Data — All Schemas ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(workExperienceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationSchema) }}
        />
      </head>
      <body
        className="bg-black text-white antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <ReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        >
          {children}
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
