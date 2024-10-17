"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type ProjectItemProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  author?: string;
  topic?: string;
};

const projects: ProjectItemProps[] = [
  {
    title: "Vulcan Eleven",
    description:
      "A fantasy sports app with blockchain integration for secure transactions.",
    image:
      "https://pbs.twimg.com/profile_images/1641732013123051521/dB6dc_XL_400x400.jpg",
    link: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
  },
  {
    title: "CCT",
    description:
      "A social media platform for coffee enthusiasts with crypto rewards.",
    image:
      "https://pbs.twimg.com/profile_images/1736887073611583488/g43hIm40_400x400.jpg",
    link: "https://play.google.com/store/apps/details?id=com.nonceblox.cryptocoffetales&hl=en_IE",
  },
  {
    title: "Jcare",
    description: "A healthcare app for managing patient care and appointments.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmspb_SMjXMJltae4wtWS0GGFRI9JUju1Blw&s",
    link: "https://play.google.com/store/apps/details?id=com.nonceblox.jitendrafoundationapp&hl=en_IE",
  },
  {
    title: "MusicX",
    description:
      "A music streaming app with blockchain-based royalty distribution.",
    image: "https://pbs.twimg.com/media/GDvYSRdWcAAL6uV?format=jpg&name=large",
    link: "https://apps.apple.com/app/music-x/id6475713772",
  },
  {
    title: "HOUSEZY",
    description:
      "Home service at your need smart home smoth process, home service",
    image: "https://housezy.in/wp-content/uploads/2024/01/sdsfd-1024x823.png",
    link: "https://apps.apple.com/app/housezy/id6471949955",
  },
  {
    title: "DEFI11",
    description:
      "A decentralized finance app for sports betting and predictions.",
    image: "https://goctienao.com/wp-content/uploads/2021/06/defi11.jpg",
    link: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
  },
];

const timeRunning = 5000;

const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <span
    className={`bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);
const CarouselItem: React.FC<ProjectItemProps & { isActive: boolean }> = ({
  image,
  author,
  title,
  topic,
  description,
  link,
  isActive,
}) => {
  return (
    <motion.div
      className={`absolute inset-0 ${
        isActive ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: isActive ? 1 : 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={image}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 to-transparent" />
      <motion.div
        className="absolute bottom-4 left-4 right-4 z-20 max-w-2xl p-4 md:bottom-10 md:left-10 md:p-6 lg:px-20 lg:py-8 bg-[#0f0a1c8b] rounded-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {author && (
          <div className="cursive mb-1 text-sm text-purple-300 md:mb-2 md:text-lg">
            {author}
          </div>
        )}
        <GradientText className="brand-font  mb-2 text-2xl font-bold md:mb-4 md:text-4xl">
          {title}
        </GradientText>
        {topic && (
          <div className="mb-1 text-sm text-blue-300 md:mb-2 md:text-lg">
            {topic}
          </div>
        )}
        <p className="mb-4 text-sm text-gray-200 md:mb-6 md:text-lg">
          {description}
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            <button className="w-full rounded-full bg-gradient-to-r  from-golden-light to-yellow-700 via-gloden px-6 py-2 text-sm font-semibold text-black transition-all hover:scale-105 sm:w-auto md:px-8 md:py-3 md:text-lg">
              See More
            </button>
          </Link>
          <button className="w-full rounded-full border border-white px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black sm:w-auto md:px-8 md:py-3 md:text-lg">
            Subscribe
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ThumbnailItem: React.FC<
  ProjectItemProps & { isActive: boolean; onClick: () => void }
> = ({ image, title, isActive, onClick }) => {
  return (
    <motion.div
      className={`relative cursor-pointer rounded-lg p-1 shadow-lg md:p-2`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`relative h-12 w-12 cursor-pointer rounded-lg p-1 shadow-lg md:h-16 md:w-16 ${
          isActive ? "gradient-border" : ""
        }`}
      >
        <Image src={image} alt={title} layout="fill" objectFit="cover" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <p className="p-1 text-center text-[8px] text-white md:text-xs">
            {title}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ParallaxCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, timeRunning);
  }, []);

  const onNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    resetInterval();
  }, [resetInterval]);

  const onPrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    );
    resetInterval();
  }, [resetInterval]);

  const onThumbnailClick = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      resetInterval();
    },
    [resetInterval]
  );

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {projects.map((item, index) => (
          <CarouselItem
            key={index}
            {...item}
            isActive={index === currentIndex}
          />
        ))}
      </AnimatePresence>
      <div className="absolute right-2 top-1/2 z-30 -translate-y-1/2 transform md:right-4">
        <div className="flex flex-col space-y-2 pr-4 md:space-y-4 md:pr-20">
          {projects.map((item, index) => (
            <ThumbnailItem
              key={index}
              {...item}
              isActive={index === currentIndex}
              onClick={() => onThumbnailClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-30 flex space-x-2 py-4 pr-4 md:space-x-4 md:pr-20">
        <button
          className="button-primary flex h-8 w-8 items-center justify-center rounded-full text-golden md:h-12 md:w-12"
          onClick={onPrev}
          aria-label="Previous project"
        >
          <ArrowLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        <button
          className="button-primary flex h-8 w-8 items-center justify-center rounded-full text-golden-light md:h-12 md:w-12"
          onClick={onNext}
          aria-label="Next project"
        >
          <ArrowRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 z-30 h-1 w-32 -translate-x-1/2 transform overflow-hidden rounded-full bg-gray-600 md:w-48">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-200 to-yellow-700 via-yellow-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: timeRunning / 1000,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="relative">
      <h2 className="brand-font Welcome-text absolute left-1/2 top-4 z-30 -translate-x-1/2 transform text-2xl font-bold md:text-4xl">
        Recent Work
      </h2>
      <ParallaxCarousel />
    </section>
  );
};

export default Projects;
