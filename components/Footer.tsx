"use client";

import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Link from "next/link";
import { resumeData } from "~/data/resumeData";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between">
          <motion.div
            className="mb-8 w-full text-center md:mb-0 md:w-auto md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/">
              <span className="bg-gradient-to-r from-golden-light to-golden-dark via-golden bg-clip-text text-3xl font-extrabold tracking-tight text-transparent inknut-antiqua-black">
                AC.
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              {resumeData.personalInfo.title}
            </p>
          </motion.div>
          <motion.div
            className="mb-8 flex w-full justify-center space-x-6 md:mb-0 md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a
              href={resumeData.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
            >
              <LinkedinIcon className="h-6 w-6" />
            </a>
            <a
              href={resumeData.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
            >
              <GithubIcon className="h-6 w-6" />
            </a>
            {/* {resumeData.personalInfo.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors duration-300 hover:text-purple-500"
              >
                {index === 0 && <TwitterIcon className="h-6 w-6" />}
                {index === 1 && <FacebookIcon className="h-6 w-6" />}
                {index === 2 && <InstagramIcon className="h-6 w-6" />}
              </a>
            ))} */}
          </motion.div>
        </div>
        <motion.div
          className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>
            &copy; {currentYear} {resumeData.personalInfo.name}. All rights
            reserved.
          </p>
          <p className="mt-2">
            {resumeData.personalInfo.status} |{" "}
            {resumeData.personalInfo.workMode}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
