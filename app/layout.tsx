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
    default:
      "Amit Chakraborty — Principal Mobile Architect | React Native · AI · Blockchain · HealthTech",
    template: "%s | Amit Chakraborty",
  },
  description:
    "Amit Chakraborty is a Principal Mobile Architect with 8+ years building production-grade mobile apps at the intersection of AI, blockchain, and HealthTech. Shipped 13+ apps serving 50K+ users. React Native expert, RAG pipelines, HIPAA-compliant blockchain systems. Available for senior architect and engineering leadership roles worldwide.",
  keywords: [
    "Amit Chakraborty",
    "Principal Mobile Architect",
    "React Native Expert",
    "React Native Developer India",
    "Senior Mobile Architect Kolkata",
    "React Native Specialist",
    "Blockchain Developer India",
    "HealthTech Mobile Developer",
    "AI Mobile Development",
    "RAG Pipeline Developer",
    "LLM Mobile Integration",
    "Agentic AI Developer",
    "dApp Developer",
    "Solidity Developer",
    "Web3 Developer India",
    "DeFi Developer",
    "NFT App Developer",
    "Full Stack Developer India",
    "Freelance React Native Developer",
    "Remote Mobile Architect",
    "TypeScript Expert",
    "Node.js Developer",
    "Next.js Developer",
    "Mobile Architecture Expert",
    "HIPAA Compliant App Developer",
    "Medical App Developer",
    "Game Engine Developer Mobile",
    "React Native Bridgeless Architecture",
    "Computer Vision Mobile App",
    "MediaPipe React Native",
    "Hire React Native Developer",
    "Senior React Native Developer",
    "Mobile Team Lead India",
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
  category: "Technology, Software Engineering, Mobile Development",
  classification: "Portfolio",
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
    siteName: "Amit Chakraborty — Principal Mobile Architect",
    title:
      "Amit Chakraborty — Principal Mobile Architect | React Native · AI · Blockchain",
    description:
      "8+ years building production apps at the intersection of AI, blockchain, and HealthTech. 13+ apps, 50K+ users. I don't generate code — I architect systems.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Amit Chakraborty — Principal Mobile Architect",
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
    title: "Amit Chakraborty — Principal Mobile Architect",
    description:
      "8+ years building production apps at the intersection of AI, blockchain, and HealthTech. React Native expert. 13+ apps, 50K+ users.",
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

// JSON-LD Structured Data
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
  name: "Amit Chakraborty — Principal Mobile Architect",
  description:
    "Portfolio website of Amit Chakraborty, Principal Mobile Architect",
  author: { "@id": `${BASE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
