"use client";

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useRef,
  useState,
} from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

// ─── Re-export Lucide helpers used across sections ────────────────────────────
export { ArrowRight, CheckCircle2, ExternalLink };

// ─── 3D Tilt hook ─────────────────────────────────────────────────────────────
export function useTilt(maxDeg = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (y - 0.5) * -maxDeg;
      const ry = (x - 0.5) * maxDeg;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02) translateZ(8px)`;
      const shine = el.querySelector<HTMLElement>(".tilt-shine");
      if (shine) {
        shine.style.setProperty("--mx", `${x * 100}%`);
        shine.style.setProperty("--my", `${y * 100}%`);
        shine.style.opacity = "1";
      }
    },
    [maxDeg],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)";
    const shine = el.querySelector<HTMLElement>(".tilt-shine");
    if (shine) shine.style.opacity = "0";
  }, []);

  return { ref, onMove, onLeave };
}

// ─── TiltShine overlay ────────────────────────────────────────────────────────
function TiltShine() {
  return (
    <div
      className="tilt-shine"
      style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        opacity: 0,
        transition: "opacity 0.2s",
        background:
          "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.13) 0%, transparent 58%)",
        zIndex: 2,
      }}
    />
  );
}

// ─── GoldAccent ───────────────────────────────────────────────────────────────
export function GoldAccent({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: COLORS.goldG,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

// ─── Card3D ───────────────────────────────────────────────────────────────────
// Variants: default | gold | feature | stat | service | ghost | process | skill | testimonial
type CardVariant =
  | "default"
  | "gold"
  | "feature"
  | "stat"
  | "service"
  | "ghost"
  | "process"
  | "skill"
  | "testimonial";

interface Card3DProps {
  children: React.ReactNode;
  variant?: CardVariant;
  accentColor?: string; // top-border / glow color override
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  tilt?: boolean;
  tiltDeg?: number;
  topBar?: boolean; // gold top bar (default: true for gold/feature/service)
  hoverLift?: boolean; // translateY on hover (default: true)
  padding?: string | number;
}

export function Card3D({
  children,
  variant = "default",
  accentColor,
  style,
  className,
  onClick,
  tilt = true,
  tiltDeg = 10,
  topBar,
  hoverLift = true,
  padding,
}: Card3DProps) {
  const { ref, onMove, onLeave } = useTilt(tiltDeg);
  const [hovered, setHovered] = useState(false);

  const accent = accentColor ?? COLORS.gold;

  const variantStyles: Record<CardVariant, CSSProperties> = {
    default: {
      border: `1px solid ${hovered ? COLORS.goldD : COLORS.border}`,
      background: COLORS.card,
    },
    gold: {
      border: `1px solid ${hovered ? COLORS.gold + "66" : COLORS.goldD}`,
      background: `linear-gradient(135deg,rgba(201,168,76,0.06) 0%,${COLORS.card} 55%)`,
    },
    feature: {
      border: `1px solid ${hovered ? accent + "88" : accent + "33"}`,
      background: `linear-gradient(135deg,${accent}08 0%,${COLORS.card} 55%)`,
    },
    stat: {
      border: `1px solid ${COLORS.border}`,
      background: COLORS.card,
      textAlign: "center",
    },
    service: {
      border: `1px solid ${hovered ? accent + "66" : accent + "28"}`,
      background: COLORS.card,
    },
    ghost: {
      border: `1px solid ${COLORS.border}`,
      background: "transparent",
    },
    process: {
      border: `1px solid ${COLORS.border}`,
      background: COLORS.card,
    },
    skill: {
      border: `1px solid ${COLORS.border}`,
      background: COLORS.card,
    },
    testimonial: {
      border: `1px solid ${COLORS.border}`,
      borderTop: `3px solid ${accent}`,
      background: COLORS.card,
    },
  };

  const showTopBar =
    topBar ??
    (variant === "gold" ||
      variant === "feature" ||
      variant === "service" ||
      variant === "process");

  return (
    <div
      ref={tilt ? ref : undefined}
      onMouseMove={tilt ? onMove : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (tilt) onLeave();
      }}
      onClick={onClick}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.18s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        boxShadow: hovered && hoverLift
          ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20`
          : "0 4px 20px rgba(0,0,0,0.2)",
        padding: padding ?? 28,
        ...variantStyles[variant],
        ...(hovered && hoverLift ? { transform: "translateY(-6px)" } : {}),
        ...(tilt ? {} : {}), // tilt managed by useTilt
        ...style,
      }}
    >
      {/* Top accent bar */}
      {showTopBar && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: accent !== COLORS.gold ? accent : COLORS.goldG,
            zIndex: 1,
          }}
        />
      )}
      {tilt && <TiltShine />}
      {children}
    </div>
  );
}

// Legacy TiltCard alias for backward compat
export function TiltCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <Card3D tilt variant="default" style={style}>
      {children}
    </Card3D>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
// Variants: default | gold | green | ghost | pill | dot
type BadgeVariant = "default" | "gold" | "green" | "ghost" | "pill" | "dot";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: BadgeVariant;
  pulse?: boolean;
}

export function Badge({
  children,
  color = COLORS.gold,
  variant = "default",
  pulse,
}: BadgeProps) {
  const base: CSSProperties = {
    fontFamily: MONO,
    fontSize: 9,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  };

  const variantStyles: Record<BadgeVariant, CSSProperties> = {
    default: {
      color,
      border: `1px solid ${color}44`,
      borderRadius: 4,
      padding: "3px 8px",
      background: `${color}0D`,
    },
    gold: {
      color: COLORS.gold,
      border: `1px solid ${COLORS.goldD}`,
      borderRadius: 4,
      padding: "3px 8px",
      background: COLORS.goldF,
    },
    green: {
      color: COLORS.green,
      border: `1px solid ${COLORS.green}44`,
      borderRadius: 4,
      padding: "3px 8px",
      background: `${COLORS.green}0D`,
    },
    ghost: {
      color: COLORS.faint,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 4,
      padding: "3px 8px",
      background: "transparent",
    },
    pill: {
      color,
      border: `1px solid ${color}44`,
      borderRadius: 999,
      padding: "4px 12px",
      background: `${color}0D`,
    },
    dot: {
      color,
      border: "none",
      background: "transparent",
      padding: 0,
      fontSize: 10,
      letterSpacing: "0.1em",
    },
  };

  return (
    <span style={{ ...base, ...variantStyles[variant] }}>
      {variant === "dot" && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            flexShrink: 0,
            animation: pulse ? "ac-pulse 2s infinite" : "none",
          }}
        />
      )}
      {pulse && variant !== "dot" && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            flexShrink: 0,
            animation: "ac-pulse 2s infinite",
          }}
        />
      )}
      {children}
    </span>
  );
}

// ─── Btn ─────────────────────────────────────────────────────────────────────
// Variants: gold | outline | ghost | link | danger
type BtnVariant = "gold" | "outline" | "ghost" | "link" | "danger";

interface BtnProps {
  children: React.ReactNode;
  variant?: BtnVariant;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: CSSProperties;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  target?: string;
  rel?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Btn({
  children,
  variant = "gold",
  href,
  onClick,
  style,
  disabled,
  icon,
  iconRight,
  target,
  rel,
  size = "md",
  fullWidth,
  type = "button",
}: BtnProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const sizeMap: Record<string, CSSProperties> = {
    sm: { fontSize: 9, padding: "9px 18px", letterSpacing: "0.18em" },
    md: { fontSize: 10, padding: "13px 28px", letterSpacing: "0.22em" },
    lg: { fontSize: 11, padding: "16px 36px", letterSpacing: "0.24em" },
  };

  const variantStyles: Record<BtnVariant, CSSProperties> = {
    gold: {
      background: hovered ? COLORS.goldG : COLORS.goldG,
      color: "#000",
      border: "none",
      boxShadow: hovered
        ? "0 8px 32px rgba(201,168,76,0.45)"
        : "0 4px 16px rgba(201,168,76,0.2)",
    },
    outline: {
      background: hovered ? COLORS.goldF : "transparent",
      color: hovered ? COLORS.gold : COLORS.gold,
      border: `2px solid ${hovered ? COLORS.gold : COLORS.goldD}`,
      boxShadow: hovered ? `0 4px 16px ${COLORS.goldD}` : "none",
    },
    ghost: {
      background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      color: hovered ? COLORS.text : COLORS.faint,
      border: `1px solid ${hovered ? COLORS.border : COLORS.border}`,
      boxShadow: "none",
    },
    link: {
      background: "transparent",
      color: hovered ? COLORS.gold : COLORS.faint,
      border: "none",
      boxShadow: "none",
      padding: "0",
      letterSpacing: "0",
      textDecoration: hovered ? "underline" : "none",
    },
    danger: {
      background: hovered ? "rgba(255,68,68,0.12)" : "transparent",
      color: hovered ? "#FF6666" : COLORS.faint,
      border: `1px solid ${hovered ? "rgba(255,68,68,0.35)" : COLORS.border}`,
      boxShadow: "none",
    },
  };

  const common: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: MONO,
    fontWeight: variant === "gold" ? 700 : 600,
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.2s ease",
    transform: pressed ? "scale(0.97) translateY(1px)" : hovered ? "scale(1.02) translateY(-1px)" : "scale(1)",
    width: fullWidth ? "100%" : undefined,
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    ...sizeMap[size],
    ...variantStyles[variant],
  };

  const events = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => { setHovered(false); setPressed(false); },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} style={{ ...common, ...style }} {...events}>
        {icon && <span style={{ display: "flex" }}>{icon}</span>}
        {children}
        {iconRight && <span style={{ display: "flex" }}>{iconRight}</span>}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...common, ...style }} {...events}>
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: "flex" }}>{iconRight}</span>}
    </button>
  );
}

// ─── IconBox ──────────────────────────────────────────────────────────────────
// variants: gold | colored | ghost | filled
type IconBoxVariant = "gold" | "colored" | "ghost" | "filled";

interface IconBoxProps {
  icon: React.ReactNode;
  color?: string;
  variant?: IconBoxVariant;
  size?: number;
  style?: CSSProperties;
  pulse?: boolean;
  shape?: "square" | "circle" | "blob";
}

export function IconBox({
  icon,
  color = COLORS.gold,
  variant = "gold",
  size = 36,
  style,
  shape = "square",
}: IconBoxProps) {
  const [hovered, setHovered] = useState(false);

  const borderRadius =
    shape === "circle"
      ? "50%"
      : shape === "blob"
        ? "40% 60% 55% 45%/45% 55% 45% 55%"
        : 8;

  const variantStyles: Record<IconBoxVariant, CSSProperties> = {
    gold: {
      background: COLORS.goldF,
      border: `1px solid ${COLORS.goldD}`,
      boxShadow: hovered ? `0 0 16px ${COLORS.goldD}` : "none",
    },
    colored: {
      background: `${color}12`,
      border: `1px solid ${color}30`,
      boxShadow: hovered ? `0 0 16px ${color}30` : "none",
    },
    ghost: {
      background: "transparent",
      border: `1px solid ${COLORS.border}`,
    },
    filled: {
      background: color,
      border: "none",
      boxShadow: hovered ? `0 4px 20px ${color}55` : `0 2px 8px ${color}33`,
    },
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.22s ease",
        transform: hovered ? "scale(1.08) translateZ(4px)" : "scale(1)",
        ...variantStyles[variant],
        ...style,
      }}
    >
      {icon}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
  color?: string;
  style?: CSSProperties;
}

export function StatCard({
  value,
  label,
  sub,
  color = COLORS.gold,
  style,
}: StatCardProps) {
  return (
    <Card3D variant="stat" style={style} tiltDeg={8}>
      <div
        style={{
          fontSize: "clamp(28px,4vw,42px)",
          fontWeight: 900,
          color,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: COLORS.dim, fontWeight: 600 }}>
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: COLORS.vfaint,
            marginTop: 3,
            letterSpacing: "0.06em",
          }}
        >
          {sub}
        </div>
      )}
    </Card3D>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
// For skill tags, tech tags, tab buttons
interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
  onClick?: () => void;
  style?: CSSProperties;
  icon?: React.ReactNode;
}

export function Chip({
  children,
  active,
  color = COLORS.gold,
  onClick,
  style,
  icon,
}: ChipProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "7px 16px",
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        cursor: "pointer",
        background: active ? color : hovered ? `${color}15` : "transparent",
        color: active ? "#000" : hovered ? color : COLORS.faint,
        border: `1px solid ${active ? color : hovered ? `${color}55` : COLORS.border}`,
        fontWeight: active ? 700 : 400,
        transition: "all 0.18s ease",
        transform: pressed
          ? "scale(0.96) translateY(1px)"
          : hovered
            ? "scale(1.02) translateY(-1px)"
            : "scale(1)",
        boxShadow: active ? `0 4px 16px ${color}33` : "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── Pill (status indicator) ──────────────────────────────────────────────────
interface PillProps {
  children: React.ReactNode;
  color?: string;
  pulse?: boolean;
  style?: CSSProperties;
}

export function Pill({ children, color = COLORS.gold, pulse, style }: PillProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: `1px solid ${color}44`,
        background: `${color}08`,
        padding: "8px 18px",
        backdropFilter: "blur(8px)",
        ...style,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          display: "inline-block",
          animation: pulse ? "ac-pulse 2s infinite" : "none",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 9,
          color,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontFamily: MONO,
          fontWeight: 600,
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── SectionLabel (label above headings) ─────────────────────────────────────
interface SectionLabelProps {
  num?: string;
  children: React.ReactNode;
}

export function SLabel({ num, children }: SectionLabelProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
      }}
    >
      {num && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            color: COLORS.vfaint,
            letterSpacing: "0.2em",
          }}
        >
          {num}
        </span>
      )}
      <span
        style={{
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: COLORS.gold,
        }}
      >
        {children}
      </span>
    </div>
  );
}

// ─── Icon map helper – service / process icons ────────────────────────────────
// Renders a known lucide icon OR falls back to the raw string/emoji
import {
  Bot,
  Blocks,
  Brain,
  ChevronDown,
  Code2,
  FlaskConical,
  Globe,
  Layers,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Microscope,
  Paintbrush,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  TestTube2,
  Wrench,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  // Services
  "🚀": Rocket,
  "⚡": Zap,
  "🔬": Microscope,
  "🧠": Brain,
  "🎨": Paintbrush,
  "📱": Smartphone,
  "🌐": Globe,
  "🔐": Shield,
  "🧩": Blocks,
  "💡": Lightbulb,
  "🔧": Wrench,
  "📊": LayoutDashboard,
  "🤖": Bot,
  "✨": Sparkles,
  // Process
  "🔍": Search,
  "🎯": Target,
  "🏗": Layers,
  "⚗": FlaskConical,
  "✅": ListChecks,
  "💬": MessageSquare,
  "🧪": TestTube2,
  "🖥": Code2,
};

export function ServiceIcon({
  icon,
  color = COLORS.gold,
  size = 22,
}: {
  icon: string;
  color?: string;
  size?: number;
}) {
  const Lucide = ICON_MAP[icon];
  if (Lucide) return <Lucide size={size} color={color} strokeWidth={2} />;
  // Fallback: render emoji text but attempt clean display
  return (
    <span style={{ fontSize: size, lineHeight: 1, display: "block" }}>
      {icon}
    </span>
  );
}

// ─── ExpandIcon (replaces + emoji) ───────────────────────────────────────────
export function ExpandIcon({
  open,
  color = COLORS.gold,
}: {
  open: boolean;
  color?: string;
}) {
  return (
    <ChevronDown
      size={18}
      color={open ? color : COLORS.faint}
      style={{
        transition: "transform 0.28s ease, color 0.2s",
        transform: open ? "rotate(-180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    />
  );
}
