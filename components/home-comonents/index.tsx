import dynamic from "next/dynamic";
import { withComponentWrapper } from "../providers/ComponentWrapper";
import { makeLoading } from "../ui/LazyLoadingSkeleton";

/* ─── Static / above-the-fold exports ─────────────── */
export { default as AboutSection } from "./AboutSection";
export { default as HeroSection, ScrollProgressBar } from "./HeroSection";
export { default as MarqueeSection } from "./MarqueeSection";
export { default as ProjectsSection } from "./ProjectsSection";
export { MobileNav } from "./layout/MobileNav";

/* ─── Already-extracted section exports ───────────── */
export { default as BlogSection } from "./BlogSection";
export { default as FAQSection } from "./FAQSection";

/* ─── Loading skeletons ────────────────────────────── */
const makeSection = (label: string, height = 500) =>
  makeLoading({ label, height });

const ethosLoading = makeSection("Loading Ethos", 600);
const expLoading = makeSection("Loading Experience", 500);
const skillsLoading = makeSection("Loading Skills", 500);
const storyLoading = makeSection("Loading Story", 600);
const githubLoading = makeSection("Loading GitHub", 340);
const testimLoading = makeSection("Loading Testimonials", 500);
const servicesLoading = makeSection("Loading Services", 500);
const pitchLoading = makeSection("Loading Pitch Form", 600);
const processLoading = makeSection("Loading Process", 400);
const schedulerLoading = makeSection("Loading Scheduler", 400);
const contactLoading = makeSection("Loading Contact", 400);
const footerLoading = makeSection("Loading Footer", 400);

/* ─── Dynamic imports ──────────────────────────────── */
const __Ethos__ = dynamic(() => import("./EthosSection"), {
  ssr: false,
  loading: ethosLoading,
});
const __Experience__ = dynamic(() => import("./ExperienceSection"), {
  ssr: false,
  loading: expLoading,
});
const __Skills__ = dynamic(() => import("./SkillsSection"), {
  ssr: false,
  loading: skillsLoading,
});
const __Story__ = dynamic(() => import("./StorySection"), {
  ssr: false,
  loading: storyLoading,
});
const __GitHub__ = dynamic(() => import("./GitHubSection"), {
  ssr: false,
  loading: githubLoading,
});
const __Testimonials__ = dynamic(() => import("./TestimonialsSection"), {
  ssr: false,
  loading: testimLoading,
});
const __Services__ = dynamic(() => import("./ServicesSection"), {
  ssr: false,
  loading: servicesLoading,
});
const __Pitch__ = dynamic(() => import("./PitchSection"), {
  ssr: false,
  loading: pitchLoading,
});
const __Process__ = dynamic(() => import("./ProcessSection"), {
  ssr: false,
  loading: processLoading,
});
const __Meeting__ = dynamic(() => import("./MeetingScheduler"), {
  ssr: false,
  loading: schedulerLoading,
});
const __Contact__ = dynamic(() => import("./ContactSection"), {
  ssr: false,
  loading: contactLoading,
});
const __Footer__ = dynamic(() => import("./Footer"), {
  ssr: false,
  loading: footerLoading,
});

/* ─── Wrapped exports (lazy reveal + profiling) ────── */
const wrap = (cmp: React.ComponentType<any>, id: string, height = 500) =>
  withComponentWrapper(cmp, {
    id,
    lazyReveal: true,
    profiling: true,
    placeholderHeight: height,
  });

export const EthosSection = wrap(__Ethos__, "ethos-section", 600);
export const ExperienceSection = wrap(
  __Experience__,
  "experience-section",
  500,
);
export const SkillsSection = wrap(__Skills__, "skills-section", 500);
export const StorySection = wrap(__Story__, "story-section", 600);
export const GitHubSection = wrap(__GitHub__, "github-section", 340);
export const TestimonialsSection = wrap(
  __Testimonials__,
  "testimonials-section",
  500,
);
export const ServicesSection = wrap(__Services__, "services-section", 500);
export const PitchSection = wrap(__Pitch__, "pitch-section", 600);
export const ProcessSection = wrap(__Process__, "process-section", 400);
export const MeetingScheduler = wrap(__Meeting__, "meeting-scheduler-hoc", 400);
export const ContactSection = wrap(__Contact__, "contact-section-hoc", 400);
export const Footer = wrap(__Footer__, "footer-section-hoc", 400);
