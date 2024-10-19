import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Define your custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title:
    "Amit Chakraborty - Senior React Native Developer | Full Stack Developer | Blockchain Specialist | Team Lead",
  description:
    "Explore the portfolio of Amit Chakraborty, a Senior React Native Developer and Full Stack Developer specializing in web and mobile applications. Available for freelance opportunities and full-time roles.",
  applicationName: "Amit Chakraborty's Portfolio",
  generator: "Next.js",
  authors: {
    name: "Amit Chakraborty",
    url: "https://www.linkedin.com/in/techamit95ch/",
  },
  creator: "Amit Chakraborty",
  keywords: [
    "Amit Chakraborty",
    "Senior React Native Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "App Developer",
    "Frontend Engineer",
    "Backend Engineer",
    "Blockchain Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Web Developer",
    "Software Engineer",
    "Tech Lead",
    "Freelance Developer",
    "Remote Full Stack Developer",
    "Software Development Projects",
    "React Native Portfolio",
    "Web Development Projects",
    "Software Architecture",
    "Agile Development",
    "Team Leadership",
  ],
  themeColor: "#000000",
  icons: {
    icon: "./favicon.ico",
  },
  openGraph: {
    title:
      "Amit Chakraborty - Senior React Native Developer | Full Stack Developer | Blockchain Specialist | Team Lead",
    description:
      "Explore Amit Chakraborty's portfolio showcasing skills in React Native, Full Stack Development, and Blockchain technology. Available for freelance and full-time opportunities.",
    url: "https://www.devamit.co.in",
    siteName: "Amit Chakraborty's Portfolio",
    images: [
      {
        url: "https://www.devamit.co.in/_next/static/media/my_picture.e1b2dc1e.png", // Replace with your portfolio image URL
        width: 800,
        height: 600,
        alt: "Amit Chakraborty's Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AmitCha92849022", // Your Twitter handle
    title:
      "Amit Chakraborty - Senior React Native Developer | Full Stack Developer | Blockchain Specialist | Team Lead",
    description:
      "Explore the portfolio of Amit Chakraborty, showcasing skills in React Native, Full Stack Development, and Blockchain technology.",
    image:
      "https://www.devamit.co.in/_next/static/media/my_picture.e1b2dc1e.png", // Replace with your portfolio image URL
  },
  canonical: "https://www.devamit.co.in",
  language: "en",
  viewport: "width=device-width, initial-scale=1.0",
};

// Structured Data (JSON-LD)
const structuredData = `
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Amit Chakraborty",
  "url": "https://www.devamit.co.in",
  "jobTitle": "Senior React Native Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance Developer"
  },
  "sameAs": [
    "https://www.linkedin.com/in/techamit95ch/",
    "https://x.com/AmitCha92849022"
  ],
  "image": "https://www.devamit.co.in/_next/static/media/my_picture.e1b2dc1e.png", // Add an image URL
  "description": "Amit Chakraborty is a Senior React Native Developer and Full Stack Developer specializing in mobile and web applications.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Your City",
    "addressRegion": "Your Region",
    "postalCode": "Your Postal Code",
    "addressCountry": "Your Country"
  }
}
`;

// Add this structured data in the <head> of your document
const addStructuredData = () => {
  if (typeof document !== "undefined") {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = structuredData;
    document.head.appendChild(script);
  }
};

// Call the function to add structured data
addStructuredData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${robotoMono.variable} font-sans ${inter.variable} overflow-y-auto overflow-x-hidden bg-[black]`}
    >
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="z_JuRWCMNzddlpL1pAxMoqntcmvXBstj_lQW0GZWXnU"
        />
        <meta
          name="google-site-verification"
          content="iHdepblaP_OakJ-74RUhDJ4LqS8eOOxbFZ_ajHJmKwo"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
