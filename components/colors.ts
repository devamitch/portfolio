// ═══════════════════════════════════════════════════════════════
// PREMIUM COLOR SYSTEM — HEAVY & EXECUTIVE
// ═══════════════════════════════════════════════════════════════

export const PREMIUM_COLORS = {
  // ─── GOLDS — Richer, deeper, more luxurious
  gold: {
    // Primary gold - richer, warmer
    primary: "#D4AF37", // Deep gold (was #C9A84C)
    light: "#F4E7B1", // Champagne gold
    dark: "#9B7E2F", // Antique gold
    bronze: "#CD7F32", // Bronze accent

    // Gradients
    gradient: {
      luxury: "linear-gradient(135deg, #D4AF37 0%, #F4E7B1 50%, #9B7E2F 100%)",
      sunset: "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)",
      rich: "linear-gradient(180deg, #F4E7B1 0%, #D4AF37 50%, #9B7E2F 100%)",
      glow: "radial-gradient(circle, #D4AF37 0%, #9B7E2F 70%)",
    },

    // Opacity variants
    alpha: {
      5: "rgba(212,175,55,0.05)",
      10: "rgba(212,175,55,0.10)",
      15: "rgba(212,175,55,0.15)",
      20: "rgba(212,175,55,0.20)",
      30: "rgba(212,175,55,0.30)",
      40: "rgba(212,175,55,0.40)",
      50: "rgba(212,175,55,0.50)",
      60: "rgba(212,175,55,0.60)",
      70: "rgba(212,175,55,0.70)",
      80: "rgba(212,175,55,0.80)",
      90: "rgba(212,175,55,0.90)",
    },
  },

  // ─── BLACKS — Deeper, richer
  dark: {
    // Pure blacks with subtle tints
    pure: "#000000",
    rich: "#0A0A0A", // Rich black (was #060606)
    deep: "#141414", // Deep black (was #0C0C0C)
    charcoal: "#1C1C1C", // Charcoal
    slate: "#262626", // Slate

    // With gold tints
    goldTint: "#0D0B08", // Black with gold undertone
    warmBlack: "#12100E", // Warm black
  },

  // ─── LIGHTS — Cleaner, sharper
  light: {
    pure: "#FFFFFF",
    ivory: "#FFFEF7", // Warm white
    cream: "#FAF8F0", // Cream (was #FAF8F3)
    pearl: "#F5F3EB", // Pearl
    bone: "#E8E6DE", // Bone
  },

  // ─── ACCENT COLORS — Executive palette
  accent: {
    // Complementary colors
    deepRed: "#8B2E2E", // Deep burgundy
    navyBlue: "#1A2332", // Dark navy
    forestGreen: "#2C4A3E", // Forest green
    deepPurple: "#3D2849", // Deep purple

    // Status colors
    success: "#4A7C59", // Muted green
    warning: "#B8860B", // Dark gold
    error: "#8B3A3A", // Muted red
    info: "#4A5F7C", // Muted blue
  },

  // ─── TEXT COLORS
  text: {
    dark: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.85)",
      tertiary: "rgba(255,255,255,0.60)",
      quaternary: "rgba(255,255,255,0.40)",
      disabled: "rgba(255,255,255,0.25)",
      ghost: "rgba(255,255,255,0.12)",
    },
    light: {
      primary: "#0A0A0A",
      secondary: "rgba(10,10,10,0.85)",
      tertiary: "rgba(10,10,10,0.65)",
      quaternary: "rgba(10,10,10,0.45)",
      disabled: "rgba(10,10,10,0.30)",
      ghost: "rgba(10,10,10,0.15)",
    },
  },

  // ─── BORDERS
  border: {
    dark: {
      subtle: "rgba(255,255,255,0.06)",
      normal: "rgba(255,255,255,0.10)",
      strong: "rgba(255,255,255,0.15)",
      gold: "rgba(212,175,55,0.25)",
      goldStrong: "rgba(212,175,55,0.45)",
    },
    light: {
      subtle: "rgba(10,10,10,0.08)",
      normal: "rgba(10,10,10,0.12)",
      strong: "rgba(10,10,10,0.18)",
      gold: "rgba(212,175,55,0.30)",
      goldStrong: "rgba(212,175,55,0.50)",
    },
  },

  // ─── SURFACES
  surface: {
    dark: {
      base: "#0A0A0A",
      elevated1: "#141414",
      elevated2: "#1C1C1C",
      elevated3: "#262626",
      glass: "rgba(255,255,255,0.03)",
      glassStrong: "rgba(255,255,255,0.06)",
    },
    light: {
      base: "#FAF8F0",
      elevated1: "#FFFFFF",
      elevated2: "#F5F3EB",
      elevated3: "#E8E6DE",
      glass: "rgba(255,255,255,0.80)",
      glassStrong: "rgba(255,255,255,0.95)",
    },
  },

  // ─── SHADOWS — Heavier, more dramatic
  shadow: {
    sm: "0 2px 8px rgba(0,0,0,0.35)",
    md: "0 4px 16px rgba(0,0,0,0.40)",
    lg: "0 8px 32px rgba(0,0,0,0.45)",
    xl: "0 16px 48px rgba(0,0,0,0.50)",
    "2xl": "0 24px 64px rgba(0,0,0,0.55)",

    // Gold glows
    goldSm: "0 2px 12px rgba(212,175,55,0.25)",
    goldMd: "0 4px 24px rgba(212,175,55,0.30)",
    goldLg: "0 8px 36px rgba(212,175,55,0.35)",
    goldXl: "0 16px 48px rgba(212,175,55,0.40)",
  },

  // ─── GLOWS — For dramatic effects
  glow: {
    gold: "0 0 40px rgba(212,175,55,0.20), 0 0 80px rgba(212,175,55,0.10)",
    goldStrong:
      "0 0 60px rgba(212,175,55,0.30), 0 0 120px rgba(212,175,55,0.15)",
    white: "0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(255,255,255,0.08)",
  },
};

// ═══════════════════════════════════════════════════════════════
// TAILWIND CONFIG EXTENSION
// ═══════════════════════════════════════════════════════════════

export const tailwindColors = {
  // Golds
  gold: {
    DEFAULT: "#D4AF37",
    50: "#F4E7B1",
    100: "#F0DFA0",
    200: "#E8D07E",
    300: "#E0C05C",
    400: "#D8B03A",
    500: "#D4AF37",
    600: "#B8962F",
    700: "#9B7E2F",
    800: "#7F6527",
    900: "#624D1F",
  },

  // Premium blacks
  "rich-black": {
    DEFAULT: "#0A0A0A",
    50: "#262626",
    100: "#1C1C1C",
    200: "#141414",
    300: "#0F0F0F",
    400: "#0C0C0C",
    500: "#0A0A0A",
    600: "#080808",
    700: "#060606",
    800: "#040404",
    900: "#000000",
  },

  // Warm neutrals
  warm: {
    50: "#FFFEF7",
    100: "#FAF8F0",
    200: "#F5F3EB",
    300: "#E8E6DE",
    400: "#D4D2CA",
    500: "#B8B6AE",
    600: "#9C9A92",
    700: "#7A7870",
    800: "#58564E",
    900: "#36342C",
  },
};

// ═══════════════════════════════════════════════════════════════
// USAGE HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const getColor = (isDark: boolean) => ({
  // Backgrounds
  bg: isDark ? PREMIUM_COLORS.dark.rich : PREMIUM_COLORS.light.cream,
  bg2: isDark ? PREMIUM_COLORS.dark.deep : PREMIUM_COLORS.light.pearl,
  bg3: isDark ? PREMIUM_COLORS.dark.charcoal : PREMIUM_COLORS.light.bone,

  // Text
  text: isDark
    ? PREMIUM_COLORS.text.dark.primary
    : PREMIUM_COLORS.text.light.primary,
  textSec: isDark
    ? PREMIUM_COLORS.text.dark.secondary
    : PREMIUM_COLORS.text.light.secondary,
  textTer: isDark
    ? PREMIUM_COLORS.text.dark.tertiary
    : PREMIUM_COLORS.text.light.tertiary,
  textQuat: isDark
    ? PREMIUM_COLORS.text.dark.quaternary
    : PREMIUM_COLORS.text.light.quaternary,
  textGhost: isDark
    ? PREMIUM_COLORS.text.dark.ghost
    : PREMIUM_COLORS.text.light.ghost,

  // Gold
  gold: PREMIUM_COLORS.gold.primary,
  goldLight: PREMIUM_COLORS.gold.light,
  goldDark: PREMIUM_COLORS.gold.dark,
  goldGrad: PREMIUM_COLORS.gold.gradient.luxury,

  // Borders
  border: isDark
    ? PREMIUM_COLORS.border.dark.normal
    : PREMIUM_COLORS.border.light.normal,
  borderSub: isDark
    ? PREMIUM_COLORS.border.dark.subtle
    : PREMIUM_COLORS.border.light.subtle,
  borderGold: isDark
    ? PREMIUM_COLORS.border.dark.gold
    : PREMIUM_COLORS.border.light.gold,

  // Surfaces
  surface: isDark
    ? PREMIUM_COLORS.surface.dark.elevated1
    : PREMIUM_COLORS.surface.light.elevated1,
  glass: isDark
    ? PREMIUM_COLORS.surface.dark.glass
    : PREMIUM_COLORS.surface.light.glass,

  // Shadows
  shadowMd: PREMIUM_COLORS.shadow.md,
  shadowLg: PREMIUM_COLORS.shadow.lg,
  shadowGold: PREMIUM_COLORS.shadow.goldMd,

  // Glow
  glow: PREMIUM_COLORS.glow.gold,
});

export default PREMIUM_COLORS;
