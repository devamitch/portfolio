import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
    "Amit Chakraborty -  React Native Developer | Full Stack Developer | Blockchain Developer",
  description:
    "Portfolio of Amit Chakraborty, a Full Stack Developer specializing in React Native and Web Development",
  applicationName: "Amit",
  generator: "Next js",
  authors: {
    name: "Amit Chakraborty",
    url: "https://www.linkedin.com/in/techamit95ch/",
  },
  creator: "Amit Chakraborty",

  keywords: [
    "React Native Developer",
    "Full Stack Developer",
    "Mobile Developer",
    "App Developer",
    "Frontend Engineeer",
    "Backend Engineeer",
    "Blockchain Developer",
    "Javascript Developer",
    "Javascript Developer",
  ],
  themeColor: "#000000",
  icons: {
    icon: "./favicon.ico",
  },
};
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


// https://techamit95ch.github.io/portfolio
