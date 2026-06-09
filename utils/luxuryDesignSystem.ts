/**
 * Luxury Silver Jewelry - Premium Design System
 * Colors, typography, spacing, shadows for world-class premium experience
 */

// ============================================================
// COLOR SYSTEM - Luxury Silver Jewelry Brand
// ============================================================

export const LUXURY_PALETTE = {
  // Primary Silver Colors
  primarySilver: '#E7ECF2',
  metallicSilver: '#C9D1D9',
  diamondWhite: '#F5F7FA',
  reflectiveSilver: '#DDE6F3',
  
  // Dark Tones - Luxury Backgrounds
  luxuryDark: '#0B1220',
  surface: '#111827',
  surfaceLight: '#1A1F28',
  surfaceLighter: '#242D3A',
  
  // Accent Colors
  accent: '#9AA8BA',
  accentLight: '#C9D1D9',
  accentDark: '#6B7A8C',
  
  // Functional Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Metallic/Gold Accent (for special elements)
  goldAccent: '#C9A84C',
  goldLight: '#DDB96A',
  goldDim: 'rgba(201, 168, 76, 0.15)',
} as const;

// ============================================================
// TYPOGRAPHY SYSTEM - Luxury Type Scale
// ============================================================

export const LUXURY_TYPOGRAPHY = {
  // Font Families
  headings: 'Plus Jakarta Sans, system-ui, sans-serif',
  body: 'Noto Sans Arabic, system-ui, sans-serif',
  mono: 'Fira Code, monospace',
  
  // Type Scale - Luxury hierarchy
  scale: {
    xs: { size: '12px', weight: 500, lineHeight: '16px' },
    sm: { size: '14px', weight: 500, lineHeight: '20px' },
    base: { size: '16px', weight: 400, lineHeight: '24px' },
    lg: { size: '18px', weight: 500, lineHeight: '28px' },
    xl: { size: '20px', weight: 600, lineHeight: '28px' },
    '2xl': { size: '24px', weight: 600, lineHeight: '32px' },
    '3xl': { size: '32px', weight: 700, lineHeight: '40px' },
    '4xl': { size: '40px', weight: 700, lineHeight: '48px' },
    '5xl': { size: '48px', weight: 800, lineHeight: '56px' },
    '6xl': { size: '60px', weight: 800, lineHeight: '72px' },
    '7xl': { size: '72px', weight: 900, lineHeight: '84px' },
  },
} as const;

// ============================================================
// SPACING SYSTEM - Luxury White Space
// ============================================================

export const LUXURY_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '80px',
  '6xl': '96px',
} as const;

// ============================================================
// BORDER RADIUS - Premium Rounded Corners
// ============================================================

export const LUXURY_BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '28px',
  '3xl': '36px',
  full: '9999px',
} as const;

// ============================================================
// SHADOWS - Premium Depth and Elevation
// ============================================================

export const LUXURY_SHADOWS = {
  // Subtle elevation shadows
  xs: '0 1px 2px rgba(11, 18, 32, 0.05)',
  sm: '0 2px 4px rgba(11, 18, 32, 0.1)',
  md: '0 4px 8px rgba(11, 18, 32, 0.12)',
  lg: '0 8px 16px rgba(11, 18, 32, 0.15)',
  xl: '0 12px 24px rgba(11, 18, 32, 0.18)',
  
  // Premium deep shadows
  premium: '0 20px 40px rgba(11, 18, 32, 0.24)',
  ultra: '0 24px 60px rgba(11, 18, 32, 0.3)',
  
  // Metallic/Silver shadows
  metallic: '0 8px 24px rgba(201, 209, 217, 0.2)',
  silver: '0 12px 32px rgba(201, 209, 217, 0.25)',
  
  // Gold accent shadows
  gold: '0 8px 24px rgba(201, 168, 76, 0.28)',
  
  // Inset shadows for depth
  inset: 'inset 0 1px 2px rgba(255, 255, 255, 0.5)',
  
  // Card hover elevation
  cardHover: '0 16px 32px rgba(11, 18, 32, 0.2)',
  
  // Modal/overlay shadow
  modal: '0 25px 50px rgba(0, 0, 0, 0.4)',
} as const;

// ============================================================
// BORDER TREATMENTS - Premium Borders
// ============================================================

export const LUXURY_BORDERS = {
  light: '1px solid rgba(255, 255, 255, 0.1)',
  lightGlass: '1px solid rgba(201, 209, 217, 0.2)',
  medium: '1px solid rgba(201, 209, 217, 0.3)',
  dark: '1px solid rgba(11, 18, 32, 0.2)',
  darkGlass: '1px solid rgba(11, 18, 32, 0.15)',
  gold: '1px solid rgba(201, 168, 76, 0.3)',
} as const;

// ============================================================
// GRADIENTS - Luxury Metallic Effects
// ============================================================

export const LUXURY_GRADIENTS = {
  // Background gradients
  darkBg: 'linear-gradient(135deg, #0B1220 0%, #111827 50%, #1A1F28 100%)',
  lightBg: 'linear-gradient(135deg, #F5F7FA 0%, #E7ECF2 50%, #DDE6F3 100%)',
  
  // Metallic silver gradient
  metallicSilver: 'linear-gradient(135deg, #E7ECF2 0%, #DDE6F3 50%, #C9D1D9 100%)',
  metallicSilverDark: 'linear-gradient(135deg, #DDE6F3 0%, #C9D1D9 50%, #9AA8BA 100%)',
  
  // Card glass effect gradients
  cardGlassLight: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(245, 247, 250, 0.6) 100%)',
  cardGlassDark: 'linear-gradient(135deg, rgba(20, 27, 38, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)',
  
  // Premium accent gradients
  accentGradient: 'linear-gradient(135deg, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.05) 100%)',
  
  // Overlay gradients
  overlayDark: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
  overlayLight: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
} as const;

// ============================================================
// BACKDROP FILTERS - Glassmorphism Effects
// ============================================================

export const LUXURY_BACKDROP_FILTERS = {
  light: 'backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);',
  medium: 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
  heavy: 'backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);',
  ultra: 'backdrop-filter: blur(32px) saturate(180%); -webkit-backdrop-filter: blur(32px) saturate(180%);',
} as const;

// ============================================================
// ANIMATIONS - Luxury Motion Timing
// ============================================================

export const LUXURY_ANIMATIONS = {
  // Duration timings
  duration: {
    instant: 0.15,
    fast: 0.25,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2,
  },
  
  // Easing functions - Luxury smooth curves
  easing: {
    smooth: [0.4, 0, 0.2, 1],
    smoothEase: [0.25, 0.46, 0.45, 0.94],
    spring: [0.34, 1.56, 0.64, 1],
    easeOut: [0.0, 0.0, 0.2, 1],
    easeInOut: [0.4, 0, 0.6, 1],
  },
} as const;

// ============================================================
// Z-INDEX SCALE - Layering System
// ============================================================

export const LUXURY_ZINDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70,
  fullscreen: 80,
} as const;

// ============================================================
// RESPONSIVE BREAKPOINTS
// ============================================================

export const LUXURY_BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getLuxuryTheme = (isDark: boolean) => ({
  background: isDark ? LUXURY_PALETTE.luxuryDark : LUXURY_PALETTE.diamondWhite,
  foreground: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
  surface: isDark ? LUXURY_PALETTE.surface : LUXURY_PALETTE.primarySilver,
  border: isDark ? 'rgba(201, 209, 217, 0.15)' : 'rgba(11, 18, 32, 0.1)',
  text: isDark ? 'rgba(245, 247, 250, 0.9)' : 'rgba(11, 18, 32, 0.9)',
  textSecondary: isDark ? 'rgba(192, 200, 212, 0.7)' : 'rgba(107, 122, 140, 0.7)',
  muted: isDark ? 'rgba(107, 122, 140, 0.5)' : 'rgba(107, 122, 140, 0.6)',
});

export const createGlassmorphicStyle = (isDark: boolean, opacity = 0.8) => ({
  background: isDark
    ? `rgba(20, 27, 38, ${opacity})`
    : `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: isDark
    ? '1px solid rgba(201, 209, 217, 0.2)'
    : '1px solid rgba(11, 18, 32, 0.1)',
});

export const createMetallicGradient = (isDark: boolean) =>
  isDark ? LUXURY_GRADIENTS.metallicSilverDark : LUXURY_GRADIENTS.metallicSilver;

export const createCardStyle = (isDark: boolean) => ({
  ...createGlassmorphicStyle(isDark, 0.8),
  borderRadius: LUXURY_BORDER_RADIUS['2xl'],
  padding: LUXURY_SPACING['2xl'],
  boxShadow: isDark ? LUXURY_SHADOWS.premium : LUXURY_SHADOWS.lg,
});

export const createButtonStyle = (isDark: boolean, isHovered: boolean) => ({
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  boxShadow: isHovered ? LUXURY_SHADOWS.cardHover : LUXURY_SHADOWS.lg,
  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
});

// ============================================================
// MESSIKA DESIGN SYSTEM — Luxury Jewelry Rebrand
// ============================================================

export const MESSIKA_PALETTE = {
  obsidian: '#0A0A0A',
  midnight: '#111118',
  charcoal: '#1A1A24',
  goldDeep: '#9A7B35',
  goldWarm: '#C9A84C',
  goldBright: '#E8C96A',
  goldShimmer: '#F5E4A4',
  silverDeep: '#8A9BAF',
  silverWarm: '#C0C8D4',
  silverBright: '#E8EDF3',
  pureWhite: '#FFFFFF',
  creamWhite: '#FAF8F5',
  softWhite: '#F0EDE8',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.72)',
  textMuted: 'rgba(255,255,255,0.45)',
  textLight: '#0A0A0A',
  success: '#4CAF84',
  error: '#E85D5D',
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderActive: 'rgba(201,168,76,0.45)',
  overlay: 'rgba(10,10,10,0.85)',
} as const;

export const MESSIKA_FONTS = {
  display: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
  body: '"Inter", "Helvetica Neue", sans-serif',
  mono: '"JetBrains Mono", monospace',
} as const;

export const MESSIKA_SPACING = {
  xs: '4px', sm: '8px', md: '12px', lg: '16px',
  xl: '24px', '2xl': '32px', '3xl': '48px',
  '4xl': '64px', '5xl': '96px', '6xl': '128px',
} as const;

export const MESSIKA_SHADOWS = {
  gold: '0 0 40px rgba(201,168,76,0.35), 0 8px 32px rgba(0,0,0,0.6)',
  goldIntense: '0 0 80px rgba(201,168,76,0.5), 0 16px 48px rgba(0,0,0,0.8)',
  silver: '0 0 32px rgba(192,200,212,0.3), 0 8px 24px rgba(0,0,0,0.5)',
  card: '0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
  cardHover: '0 16px 64px rgba(0,0,0,0.7), 0 0 48px rgba(201,168,76,0.2)',
  inset: 'inset 0 1px 0 rgba(255,255,255,0.08)',
} as const;

export const MESSIKA_GRADIENTS = {
  pageBg: 'linear-gradient(160deg, #0A0A0A 0%, #111118 50%, #0F0F16 100%)',
  goldText: 'linear-gradient(135deg, #9A7B35 0%, #C9A84C 35%, #E8C96A 65%, #F5E4A4 100%)',
  goldBtn: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
  silverText: 'linear-gradient(135deg, #8A9BAF 0%, #C0C8D4 50%, #E8EDF3 100%)',
  cardBg: 'linear-gradient(145deg, rgba(26,26,36,0.95) 0%, rgba(17,17,24,0.8) 100%)',
  heroOverlay: 'linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 60%, transparent 100%)',
  sectionDivider: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.4) 50%, transparent 100%)',
} as const;

export const MESSIKA_RADIUS = {
  none: '0px', xs: '2px', sm: '4px', md: '8px',
  lg: '12px', xl: '16px', '2xl': '24px', full: '9999px',
} as const;

export const MESSIKA_EASING = {
  luxury: [0.25, 0.46, 0.45, 0.94] as const,
  spring: { type: 'spring', stiffness: 200, damping: 20 },
  reveal: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
} as const;

// ============================================================
// THEME-AWARE COLOR TOKENS
// Returns the right color set based on dark/light mode
// ============================================================

export const getThemeColors = (isDark: boolean) => ({
  pageBg:           isDark ? '#0A0A0A'                    : '#FAF8F5',
  sectionBg:        isDark ? '#111118'                    : '#F0EDE8',
  altBg:            isDark ? '#1A1A24'                    : '#FFFFFF',
  cardBg:           isDark ? '#1A1A24'                    : '#FFFFFF',
  cardBorder:       isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.09)',
  cardHover:        isDark ? 'rgba(201,168,76,0.35)'      : 'rgba(154,123,53,0.4)',
  cardHoverShadow:  isDark ? '0 16px 64px rgba(0,0,0,0.7), 0 0 48px rgba(201,168,76,0.18)' : '0 8px 40px rgba(0,0,0,0.14)',
  imageBg:          isDark ? '#111118'                    : '#EDE8E1',
  textPrimary:      isDark ? '#FFFFFF'                    : '#0D0B08',
  textSecondary:    isDark ? 'rgba(255,255,255,0.72)'     : 'rgba(13,11,8,0.72)',
  textMuted:        isDark ? 'rgba(255,255,255,0.45)'     : 'rgba(13,11,8,0.48)',
  // Solid bg for <select> so dropdown options are readable
  inputBg:          isDark ? '#1A1A24'                    : '#FFFFFF',
  inputBorder:      isDark ? 'rgba(255,255,255,0.11)'     : 'rgba(0,0,0,0.16)',
  inputColor:       isDark ? '#FFFFFF'                    : '#0D0B08',
  inputFocusBorder: isDark ? 'rgba(201,168,76,0.5)'       : 'rgba(154,123,53,0.5)',
  inputErrBg:       isDark ? 'rgba(232,93,93,0.06)'       : 'rgba(232,93,93,0.04)',
  inputErrBorder:   isDark ? 'rgba(232,93,93,0.45)'       : 'rgba(232,93,93,0.5)',
  stickyBg:         isDark ? 'rgba(10,10,10,0.96)'        : 'rgba(250,248,245,0.97)',
  statGridGap:      isDark ? 'rgba(255,255,255,0.05)'     : 'rgba(0,0,0,0.08)',
  rowBorder:        isDark ? 'rgba(255,255,255,0.05)'     : 'rgba(0,0,0,0.07)',
  sectionGridBorder: isDark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.09)',
  goldAccent:       isDark ? MESSIKA_PALETTE.goldWarm     : '#9A7B35',
  goldAccentMuted:  isDark ? 'rgba(201,168,76,0.08)'      : 'rgba(154,123,53,0.07)',
  goldBorderMuted:  isDark ? 'rgba(201,168,76,0.18)'      : 'rgba(154,123,53,0.2)',
  heroBg:           isDark ? 'linear-gradient(160deg, #0A0A0A 0%, #111118 50%, #0F0F16 100%)' : 'linear-gradient(160deg, #FAF8F5 0%, #F0EDE8 50%, #F5F0EB 100%)',
  secondaryBtnBg:   isDark ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.05)',
  secondaryBtnColor: isDark ? '#FFFFFF'                   : '#0D0B08',
  secondaryBtnBorder: isDark ? 'rgba(255,255,255,0.14)'  : 'rgba(0,0,0,0.14)',
  badgeLimitedBg:   isDark ? 'rgba(232,93,93,0.15)'       : 'rgba(232,93,93,0.1)',
  imgOverlay:       isDark ? 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)' : 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
  countdownBox:     isDark ? 'rgba(10,10,10,0.6)'         : 'rgba(255,255,255,0.9)',
  countdownBoxBorder: isDark ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.09)',
  sortActiveBg:     isDark ? 'rgba(201,168,76,0.12)'      : 'rgba(154,123,53,0.1)',
  sortActiveBorder: isDark ? 'rgba(201,168,76,0.35)'      : 'rgba(154,123,53,0.35)',
  sortInactiveBorder: isDark ? 'rgba(255,255,255,0.09)'   : 'rgba(0,0,0,0.1)',
});
