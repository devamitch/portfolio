import dynamic from "next/dynamic";
import { withComponentWrapper } from "../providers/ComponentWrapper";
import { makeLoading } from "../ui/LazyLoadingSkeleton";

/* ─── Static / above-the-fold exports ─────────────────────── */
export { default as AboutSection }    from "./AboutSection";
export { default as HeroSection }     from "./HeroSection";
export { default as ProjectsSection } from "./ProjectsSection";

/* ─── Loading skeletons ────────────────────────────────────── */
const makeSection = (label: string, height = 500) =>
  makeLoading({ label, height });

const ethosLoading     = makeSection("Loading Ethos", 600);
const expLoading       = makeSection("Loading Experience", 500);
const skillsLoading    = makeSection("Loading Skills", 500);
const contactLoading   = makeSection("Loading Contact", 400);
const footerLoading    = makeSection("Loading Footer", 400);

/* ─── Dynamic imports ──────────────────────────────────────── */
const __Ethos__      = dynamic(() => import("./EthosSection"),      { ssr: false, loading: ethosLoading });
const __Experience__ = dynamic(() => import("./ExperienceSection"),  { ssr: false, loading: expLoading });
const __Skills__     = dynamic(() => import("./SkillsSection"),     { ssr: false, loading: skillsLoading });
const __Contact__    = dynamic(() => import("./ContactSection"),     { ssr: false, loading: contactLoading });
const __Footer__     = dynamic(() => import("./Footer"),             { ssr: false, loading: footerLoading });

/* ─── Wrapped exports (lazy reveal + profiling) ─────────────── */
const wrap = (cmp: React.ComponentType<any>, id: string, height = 500) =>
  withComponentWrapper(cmp, { id, lazyReveal: true, profiling: true, placeholderHeight: height });

export const EthosSection      = wrap(__Ethos__,      "ethos-section",       600);
export const ExperienceSection = wrap(__Experience__,  "experience-section",  500);
export const SkillsSection     = wrap(__Skills__,      "skills-section",      500);
export const ContactSection    = wrap(__Contact__,     "contact-section-hoc", 400);
export const Footer            = wrap(__Footer__,      "footer-section-hoc",  400);
