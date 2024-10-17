"use client";

import { motion } from "framer-motion";
import {
  AwardIcon,
  BriefcaseIcon,
  FolderIcon,
  GraduationCapIcon,
  MailIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  {
    name: "about",
    icon: UserIcon,
    href: "#about",
    subItems: [
      { name: "Who I Am", href: "#whoiam" },
      { name: "Skills", href: "#skills" },
      { name: "Languages", href: "#languages" },
    ],
  },
  {
    name: "experience",
    icon: BriefcaseIcon,
    href: "#experience",
    subItems: [
      { name: "Full-time", href: "#fulltime" },
      { name: "Freelance", href: "#freelance" },
      { name: "Internships", href: "#internships" },
    ],
  },
  {
    name: "projects",
    icon: FolderIcon,
    href: "#projects",
    subItems: [
      { name: "Professional", href: "#professional-projects" },
      { name: "Personal", href: "#personal-projects" },
    ],
  },
  {
    name: "education",
    icon: GraduationCapIcon,
    href: "#education",
  },
  {
    name: "achievements",
    icon: AwardIcon,
    href: "#achievements",
  },
  {
    name: "contact",
    icon: MailIcon,
    href: "#contact",
  },
];

export default function Header({
  setActiveSection,
  activeSection,
}: {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleSectionScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleSectionScroll, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 bg-opacity-90 bg-gradient-to-r from-[#3b206323] via-[#5e37d323] to-[#00492623] backdrop-blur-lg backdrop-filter"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-purple-500 to-cyan-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                AC.
              </span>
              <span className="ml-2 text-xs font-light tracking-wide text-white">
                Amit Chakraborty
              </span>
            </motion.div>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex flex-1 space-x-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  className="group relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-full px-4 py-2 text-sm capitalize transition-all duration-300 ${
                      activeSection === item.name
                        ? "scale-110 bg-gradient-to-r from-purple-800 to-cyan-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => setActiveSection(item.name)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Link>

                  {item.subItems && (
                    <div className="absolute left-0 mt-2 hidden w-40 rounded-md bg-gray-900 opacity-0 shadow-lg group-hover:block group-hover:opacity-100">
                      <ul className="py-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link href={subItem.href}>
                              <span className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                                {subItem.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 bg-opacity-95 md:hidden"
        >
          <nav className="container mx-auto px-6 py-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-full px-4 py-2 capitalize transition-all duration-300 ${
                      activeSection === item.name
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => {
                      setActiveSection(item.name);
                      setIsMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Link>

                  {item.subItems && (
                    <div className="ml-6 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-1 pl-4 text-sm text-white hover:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
