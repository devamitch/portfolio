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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Amit Chakraborty - React Native Mobile Architect | AI & Web3",
    template: "%s | Amit Chakraborty",
  },
  description:
    "Amit Chakraborty is a Principal Mobile Architect with 8+ years building AI-powered, blockchain-integrated apps. Hire me for your React Native project. Based in Kolkata, India.",
  keywords: [
    "Amit Chakraborty",
    "React Native developer",
    "Mobile architect",
    "React Native expert",
    "React Native developer India",
    "React Native consultant Kolkata",
    "Principal Mobile Architect",
    "Blockchain mobile developer",
    "HealthTech mobile developer",
    "AI mobile app developer",
    "Web3 mobile developer",
    "Solidity developer",
    "React Native freelancer",
    "Hire React Native developer",
    "Senior React Native developer",
    "Mobile development consultant",
    "devamitch",
    "devamit",
    "amit98ch",
    "techamit95ch",
  ],
  authors: [
    { name: "Amit Chakraborty", url: BASE_URL },
    { name: "Amit Chakraborty", url: "https://www.linkedin.com/in/devamitch/" },
  ],
  creator: "Amit Chakraborty",
  publisher: "Amit Chakraborty",
  category: "Technology, Mobile Development, Software Engineering",
  classification: "Professional Portfolio",
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
    alternateLocale: ["en_US", "en_GB"],
    url: BASE_URL,
    siteName: "Amit Chakraborty - Principal Mobile Architect",
    title: "Amit Chakraborty - React Native Mobile Architect | AI & Web3",
    description:
      "Principal Mobile Architect with 8+ years building production apps. 13+ apps, 50K+ users. Specializing in React Native, blockchain, and AI integration.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Amit Chakraborty - Principal Mobile Architect",
        type: "image/png",
      },
      {
        url: "https://github.com/devamitch.png",
        width: 400,
        height: 400,
        alt: "Amit Chakraborty",
      },
    ],
    firstName: "Amit",
    lastName: "Chakraborty",
    username: "devamitch",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AmitCha92849022",
    creator: "@AmitCha92849022",
    title: "Amit Chakraborty - React Native Mobile Architect",
    description:
      "Principal Mobile Architect | 8+ years | React Native · AI · Blockchain | 13+ apps, 50K+ users | Available for senior roles",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "en-US": BASE_URL,
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
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#DAA520" },
    ],
  },
  manifest: "/manifest.json",
};

// Enhanced JSON-LD Structured Data
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Amit Chakraborty",
  url: BASE_URL,
  image: {
    "@type": "ImageObject",
    url: "https://github.com/devamitch.png",
    width: 400,
    height: 400,
  },
  jobTitle: "Principal Mobile Architect",
  description:
    "Principal Mobile Architect with 8+ years building production applications at the intersection of AI, blockchain, and healthcare. Shipped 13+ apps serving 50,000+ users.",
  email: "amit98ch@gmail.com",
  telephone: "+91-9874173663",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700144",
    addressCountry: "IN",
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
    "Mobile Architecture",
    "Blockchain Development",
    "HealthTech",
    "AI/ML Integration",
    "RAG Pipelines",
    "Solidity",
    "Web3",
    "Node.js",
    "TypeScript",
    "HIPAA Compliance",
    "LLM Integration",
    "Computer Vision",
    "DeFi",
    "NFT Development",
  ],
  sameAs: [
    "https://www.linkedin.com/in/devamitch/",
    "https://github.com/devamitch",
    "https://github.com/techamit95ch",
    "https://devamitch.medium.com/",
    "https://twitter.com/AmitCha92849022",
    "https://www.hackerrank.com/amit98ch",
    "https://leetcode.com/techamit95ch/",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Available for Senior Roles",
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Principal Mobile Architect",
    description:
      "Designing and building production-grade mobile applications using React Native, AI, and blockchain technologies",
    occupationLocation: {
      "@type": "Country",
      name: "Remote / Worldwide",
    },
    skills:
      "React Native, TypeScript, Blockchain, AI Integration, Mobile Architecture, HealthTech",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Amit Chakraborty - Principal Mobile Architect",
  description:
    "Portfolio website of Amit Chakraborty, Principal Mobile Architect specializing in React Native, blockchain, and AI development",
  author: { "@id": `${BASE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// BreadcrumbList Schema for better navigation
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
  ],
};

// ProfessionalService Schema
const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#service`,
  name: "Amit Chakraborty - React Native Development Services",
  description:
    "Professional React Native development, mobile architecture consulting, blockchain integration, and AI implementation services",
  provider: { "@id": `${BASE_URL}/#person` },
  areaServed: {
    "@type": "Country",
    name: "Worldwide",
  },
  serviceType: [
    "React Native Development",
    "Mobile Architecture Consulting",
    "Blockchain Integration",
    "AI/ML Implementation",
    "Web3 Development",
    "HealthTech Solutions",
  ],
  priceRange: "Contact for Quote",
  url: BASE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://github.com" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="google" content="notranslate" />
        <meta name="geo.region" content="IN-WB" />
        <meta name="geo.placename" content="Kolkata" />
        <meta name="geo.position" content="22.5726;88.3639" />
        <meta name="ICBM" content="22.5726, 88.3639" />
        <meta property="og:locale" content="en_IN" />
        <meta name="msapplication-TileColor" content="#DAA520" />

        {/* Enhanced Schema Markup */}
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
