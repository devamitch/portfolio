"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {
  type CSSProperties,
  useState,
} from "react";
import { COLORS, MONO } from "~/data/portfolio.data";

// ─── Re-export Lucide helpers used across sections ────────────────────────────
export { ArrowRight, CheckCircle2, ExternalLink };

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

// ─── Card3D (simplified — no tilt) ────────────────────────────────────────────
type CardVariant = "default" | "gold" | "feature" | "stat" | "skill";

interface Card3DProps {
  children: React.ReactNode;
  variant?: CardVariant;
  accentColor?: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  tilt?: boolean;       // ignored — kept for API compat
  tiltDeg?: number;     // ignored
  topBar?: boolean;
  hoverLift?: boolean;
  padding?: string | number;
}

export function Card3D({
  children,
  variant = "default",
  accentColor,
  style,
  className,
  onClick,
  topBar,
  hoverLift = true,
  padding,
}: Card3DProps) {
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
    skill: {
      border: `1px solid ${COLORS.border}`,
      background: COLORS.card,
    },
  };

  const showTopBar =
    topBar ?? (variant === "gold" || variant === "feature");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.25s",
        boxShadow: hovered && hoverLift
          ? `0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px ${accent}15`
          : "0 2px 12px rgba(0,0,0,0.15)",
        padding: padding ?? 28,
        ...variantStyles[variant],
        ...(hovered && hoverLift ? { transform: "translateY(-4px)" } : {}),
        ...style,
      }}
    >
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
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
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
      {(variant === "dot" || pulse) && (
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
      {children}
    </span>
  );
}

// ─── Btn ─────────────────────────────────────────────────────────────────────
type BtnVariant = "gold" | "outline" | "ghost" | "link";

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
  const [hovered, setHovered] = useState(false);

  const sizeMap: Record<string, CSSProperties> = {
    sm: { fontSize: 9, padding: "9px 18px", letterSpacing: "0.18em" },
    md: { fontSize: 10, padding: "13px 28px", letterSpacing: "0.22em" },
    lg: { fontSize: 11, padding: "16px 36px", letterSpacing: "0.24em" },
  };

  const variantStyles: Record<BtnVariant, CSSProperties> = {
    gold: {
      background: COLORS.goldG,
      color: "#000",
      border: "none",
      boxShadow: hovered
        ? "0 8px 32px rgba(201,168,76,0.4)"
        : "0 4px 16px rgba(201,168,76,0.2)",
    },
    outline: {
      background: hovered ? COLORS.goldF : "transparent",
      color: COLORS.gold,
      border: `2px solid ${hovered ? COLORS.gold : COLORS.goldD}`,
      boxShadow: hovered ? `0 4px 16px ${COLORS.goldD}` : "none",
    },
    ghost: {
      background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
      color: hovered ? COLORS.text : COLORS.faint,
      border: `1px solid ${COLORS.border}`,
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
    width: fullWidth ? "100%" : undefined,
    ...sizeMap[size],
    ...variantStyles[variant],
  };

  const events = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
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
type IconBoxVariant = "gold" | "colored" | "ghost" | "filled";

interface IconBoxProps {
  icon: React.ReactNode;
  color?: string;
  variant?: IconBoxVariant;
  size?: number;
  style?: CSSProperties;
  pulse?: boolean;
  shape?: "square" | "circle";
}

export function IconBox({
  icon,
  color = COLORS.gold,
  variant = "gold",
  size = 36,
  style,
  shape = "square",
}: IconBoxProps) {
  const borderRadius = shape === "circle" ? "50%" : 8;

  const variantStyles: Record<IconBoxVariant, CSSProperties> = {
    gold: {
      background: COLORS.goldF,
      border: `1px solid ${COLORS.goldD}`,
    },
    colored: {
      background: `${color}12`,
      border: `1px solid ${color}30`,
    },
    ghost: {
      background: "transparent",
      border: `1px solid ${COLORS.border}`,
    },
    filled: {
      background: color,
      border: "none",
    },
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
    <Card3D variant="stat" style={style}>
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

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        boxShadow: active ? `0 4px 16px ${color}33` : "none",
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

// ─── Icon map helper ──────────────────────────────────────────────────────────
import {
  Bot,
  Blocks,
  Brain,
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
  "🚀": Rocket, "⚡": Zap, "🔬": Microscope, "🧠": Brain,
  "🎨": Paintbrush, "📱": Smartphone, "🌐": Globe, "🔐": Shield,
  "🧩": Blocks, "💡": Lightbulb, "🔧": Wrench, "📊": LayoutDashboard,
  "🤖": Bot, "✨": Sparkles, "🔍": Search, "🎯": Target,
  "🏗": Layers, "⚗": FlaskConical, "✅": ListChecks, "💬": MessageSquare,
  "🧪": TestTube2, "🖥": Code2,
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
  return (
    <span style={{ fontSize: size, lineHeight: 1, display: "block" }}>
      {icon}
    </span>
  );
}

// ─── ExpandIcon ───────────────────────────────────────────────────────────────
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
