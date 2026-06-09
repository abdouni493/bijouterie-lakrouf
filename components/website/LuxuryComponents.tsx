import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence, MotionProps, useReducedMotion } from 'framer-motion';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_SHADOWS,
  MESSIKA_GRADIENTS,
  MESSIKA_RADIUS,
  MESSIKA_SPACING,
  getThemeColors,
} from '../../utils/luxuryDesignSystem';

// ============================================================
// GLOBAL STYLES (shimmer keyframe)
// ============================================================

const GlobalStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes pulseGold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
    }
    *:focus-visible {
      outline: 2px solid #C9A84C;
      outline-offset: 3px;
    }
  `}</style>
);

export { GlobalStyles };

// ============================================================
// SHIMMER SKELETON
// ============================================================

export const ShimmerSkeleton: React.FC<{ height?: string; width?: string; radius?: string }> = ({
  height = '340px',
  width = '100%',
  radius = '0px',
}) => (
  <div
    style={{
      height,
      width,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #1A1A24 25%, #252530 50%, #1A1A24 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.8s linear infinite',
    }}
  />
);

// ============================================================
// COLOR SWATCH — matière / métal selector
// ============================================================

interface ColorSwatchProps {
  colors: string[];
  selected: number;
  onSelect: (i: number) => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ colors, selected, onSelect }) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    {colors.map((color, i) => (
      <motion.button
        key={i}
        onClick={() => onSelect(i)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: color,
          border: selected === i ? '2px solid #C9A84C' : '2px solid transparent',
          outline: selected === i ? '1px solid rgba(201,168,76,0.5)' : 'none',
          outlineOffset: '2px',
          cursor: 'pointer',
          transition: 'border 0.2s ease',
        }}
      />
    ))}
  </div>
);

// ============================================================
// PRODUCT CARD — core Messika component
// ============================================================

interface ProductCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  badge?: string;
  isNew?: boolean;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  isAdded?: boolean;
  delay?: number;
  lang?: 'fr' | 'ar';
  theme?: 'light' | 'dark';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  subtitle,
  price,
  badge,
  isNew,
  onAddToCart,
  onViewDetails,
  isAdded,
  delay = 0,
  lang = 'fr',
  theme = 'dark',
}) => {
  const [hovered, setHovered] = useState(false);
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);
  const revealActive = hovered && !shouldReduce;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onViewDetails}
      style={{
        position: 'relative',
        background: tc.cardBg,
        border: `1px solid ${hovered ? tc.cardHover : tc.cardBorder}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? (isDark ? MESSIKA_SHADOWS.cardHover : '0 8px 40px rgba(0,0,0,0.12)') : (isDark ? MESSIKA_SHADOWS.card : '0 2px 12px rgba(0,0,0,0.06)'),
      }}
    >
      {/* Badge */}
      <AnimatePresence>
        {(badge || isNew) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0.85 }}
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 10,
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.35)',
              padding: '4px 12px',
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: MESSIKA_FONTS.body,
              color: MESSIKA_PALETTE.goldWarm,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
            }}
          >
            {badge || (lang === 'fr' ? 'Nouveau' : 'جديد')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image container */}
      <div style={{ height: '340px', overflow: 'hidden', background: tc.imageBg, position: 'relative' }}>
        {image ? (
          <motion.img
            src={image}
            alt={title}
            animate={{ scale: revealActive ? 1.08 : 1.0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(145deg, #1A1A24, #111118)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.75, 0.55] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '64px' }}
            >
              💎
            </motion.div>
          </div>
        )}

        {/* Hover overlay — slides up from bottom */}
        <motion.div
          animate={{ height: revealActive ? '55%' : '0%' }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.7) 70%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ opacity: revealActive ? 1 : 0, y: revealActive ? 0 : 16 }}
            transition={{ duration: 0.3, delay: revealActive ? 0.1 : 0 }}
            style={{ display: 'flex', gap: '8px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: MESSIKA_FONTS.body,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              {lang === 'fr' ? 'Voir détails' : 'التفاصيل'}
            </motion.button>
            <motion.button
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: isAdded
                  ? MESSIKA_PALETTE.success
                  : MESSIKA_GRADIENTS.goldBtn,
                border: 'none',
                color: '#0A0A0A',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: MESSIKA_FONTS.body,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'background 0.3s ease',
              }}
            >
              {isAdded ? '✓ Ajouté' : (lang === 'fr' ? '+ Panier' : '+ السلة')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Info block */}
      <motion.div
        animate={{ y: revealActive ? -4 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ padding: '16px 20px 20px' }}
      >
        {subtitle && (
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              fontFamily: MESSIKA_FONTS.body,
              color: MESSIKA_PALETTE.goldWarm,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '6px',
            }}
          >
            {subtitle}
          </div>
        )}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 400,
            fontFamily: MESSIKA_FONTS.display,
            color: tc.textPrimary,
            marginBottom: price ? '10px' : 0,
            lineHeight: 1.25,
          }}
        >
          {title}
        </h3>
        {price && (
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: MESSIKA_FONTS.display,
              background: MESSIKA_GRADIENTS.goldText,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            {price}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// GLASSMORPHIC CONTAINER (kept for backward compat)
// ============================================================

interface GlassmorphicContainerProps extends MotionProps {
  children: ReactNode;
  isDark?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  onClick?: () => void;
}

export const GlassmorphicContainer: React.FC<GlassmorphicContainerProps> = ({
  children,
  isDark = true,
  intensity = 'medium',
  className = '',
  ...motionProps
}) => {
  const blurMap = { light: '8px', medium: '24px', heavy: '32px' };

  return (
    <motion.div
      {...motionProps}
      style={{
        background: 'rgba(26,26,36,0.8)',
        backdropFilter: `blur(${blurMap[intensity]})`,
        WebkitBackdropFilter: `blur(${blurMap[intensity]})`,
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: MESSIKA_RADIUS.lg,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ============================================================
// PREMIUM BUTTON — updated with Messika palette
// ============================================================

interface PremiumButtonProps {
  label: string;
  onClick?: () => void;
  isDark?: boolean;
  theme?: 'light' | 'dark';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isDark: isDarkProp,
  theme,
  icon,
  rightIcon,
  loading = false,
  className = '',
}) => {
  const isDark = isDarkProp ?? (theme !== 'light');
  const sizeMap = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 32px', fontSize: '14px' },
    lg: { padding: '16px 48px', fontSize: '15px' },
  };

  const variantStyles = {
    primary: {
      background: MESSIKA_GRADIENTS.goldBtn,
      color: '#0A0A0A',
      border: 'none',
    },
    secondary: {
      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      color: isDark ? '#fff' : '#0D0B08',
      border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.14)',
    },
    outline: {
      background: 'transparent',
      color: isDark ? MESSIKA_PALETTE.goldWarm : '#9A7B35',
      border: `1px solid ${isDark ? MESSIKA_PALETTE.goldWarm : '#9A7B35'}`,
    },
  };

  const s = variantStyles[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{
        ...sizeMap[size],
        background: s.background,
        color: s.color,
        border: s.border,
        borderRadius: MESSIKA_RADIUS.none,
        fontWeight: 600,
        fontFamily: MESSIKA_FONTS.body,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
      }}
      className={className}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
        />
      ) : icon}
      {label}
      {!loading && rightIcon}
    </motion.button>
  );
};

// ============================================================
// LUXURY BADGE — updated colors
// ============================================================

interface LuxuryBadgeProps {
  label: string;
  variant?: 'premium' | 'hot' | 'new' | 'exclusive';
  isDark?: boolean;
}

export const LuxuryBadge: React.FC<LuxuryBadgeProps> = ({ label, variant = 'premium' }) => {
  const variantStyles = {
    premium: { bg: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: MESSIKA_PALETTE.goldWarm },
    hot: { bg: 'rgba(232,93,93,0.12)', border: '1px solid rgba(232,93,93,0.35)', color: '#E85D5D' },
    new: { bg: 'rgba(76,175,132,0.12)', border: '1px solid rgba(76,175,132,0.35)', color: MESSIKA_PALETTE.success },
    exclusive: { bg: 'rgba(192,200,212,0.08)', border: '1px solid rgba(192,200,212,0.25)', color: MESSIKA_PALETTE.silverWarm },
  };

  const s = variantStyles[variant];

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'inline-block',
        padding: '5px 14px',
        background: s.bg,
        border: s.border,
        fontSize: '10px',
        fontWeight: 700,
        fontFamily: MESSIKA_FONTS.body,
        color: s.color,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
      }}
    >
      {label}
    </motion.span>
  );
};

// ============================================================
// FLOATING PARTICLES — updated for dark theme
// ============================================================

interface FloatingParticlesProps {
  count?: number;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ count = 8, size = 'md' }) => {
  const sizeMap = { sm: 30, md: 50, lg: 80 };
  const actualSize = sizeMap[size];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 0.4, 0], y: -120, x: [0, 15, -15, 0] }}
          transition={{
            duration: 10 + Math.random() * 5,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: actualSize,
            height: actualSize,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0) 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// PREMIUM HEADING — Cormorant Garamond, gold gradient
// ============================================================

interface PremiumHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  isDark?: boolean;
  align?: 'left' | 'center' | 'right';
  gradient?: boolean;
}

export const PremiumHeading: React.FC<PremiumHeadingProps> = ({
  children,
  level = 1,
  align = 'center',
  gradient = false,
}) => {
  const sizeMap: Record<number, string> = { 1: '64px', 2: '48px', 3: '32px', 4: '24px' };

  const sharedStyle: React.CSSProperties = {
    fontSize: sizeMap[level],
    fontWeight: gradient ? 400 : 600,
    fontFamily: MESSIKA_FONTS.display,
    textAlign: align,
    lineHeight: 1.15,
    letterSpacing: gradient ? '-0.01em' : '-0.02em',
    color: gradient ? undefined : MESSIKA_PALETTE.textPrimary,
    background: gradient ? MESSIKA_GRADIENTS.goldText : 'transparent',
    backgroundClip: gradient ? 'text' : 'unset',
    WebkitBackgroundClip: gradient ? 'text' : 'unset',
    WebkitTextFillColor: gradient ? 'transparent' : 'unset',
    backgroundSize: '200% auto',
    animation: gradient ? 'shimmer 4s linear infinite' : 'none',
    marginBottom: MESSIKA_SPACING.xl,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
    >
      {level === 1 && <h1 style={sharedStyle}>{children}</h1>}
      {level === 2 && <h2 style={sharedStyle}>{children}</h2>}
      {level === 3 && <h3 style={sharedStyle}>{children}</h3>}
      {level === 4 && <h4 style={sharedStyle}>{children}</h4>}
    </motion.div>
  );
};

// ============================================================
// PREMIUM SUBHEADING
// ============================================================

interface PremiumSubheadingProps {
  children: ReactNode;
  isDark?: boolean;
  align?: 'left' | 'center' | 'right';
  maxWidth?: string;
}

export const PremiumSubheading: React.FC<PremiumSubheadingProps> = ({
  children,
  align = 'center',
  maxWidth = '600px',
}) => (
  <motion.p
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    viewport={{ once: true }}
    style={{
      fontSize: '16px',
      fontWeight: 400,
      fontFamily: MESSIKA_FONTS.body,
      textAlign: align,
      color: MESSIKA_PALETTE.textSecondary,
      lineHeight: '1.8',
      maxWidth,
      margin: `0 auto ${MESSIKA_SPACING.xl}`,
    }}
  >
    {children}
  </motion.p>
);

// ============================================================
// LUXURY CARD — backward compat shim (delegates to ProductCard)
// ============================================================

interface LuxuryCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  badge?: string;
  isDark?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  delay?: number;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  image, title, subtitle, description, price, badge, onClick, children, delay = 0,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: MESSIKA_PALETTE.charcoal,
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? MESSIKA_SHADOWS.cardHover : MESSIKA_SHADOWS.card,
      }}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 10,
          background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
          padding: '4px 12px', fontSize: '10px', fontWeight: 600,
          color: MESSIKA_PALETTE.goldWarm, textTransform: 'uppercase', letterSpacing: '0.12em',
        }}>
          {badge}
        </div>
      )}
      {image ? (
        <motion.img
          src={image} alt={title}
          animate={{ scale: hovered ? 1.06 : 1.0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '280px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: MESSIKA_PALETTE.midnight,
        }}>
          <div style={{ fontSize: '48px' }}>💎</div>
        </div>
      )}
      <div style={{ padding: '20px' }}>
        {subtitle && (
          <div style={{ fontSize: '10px', fontWeight: 600, color: MESSIKA_PALETTE.goldWarm, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '6px' }}>
            {subtitle}
          </div>
        )}
        <h3 style={{ fontSize: '18px', fontWeight: 400, fontFamily: MESSIKA_FONTS.display, color: '#fff', marginBottom: description ? '8px' : '12px' }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: '13px', color: MESSIKA_PALETTE.textMuted, marginBottom: '12px', lineHeight: '1.6' }}>
            {description}
          </p>
        )}
        {price && (
          <div style={{
            fontSize: '20px', fontWeight: 600, fontFamily: MESSIKA_FONTS.display,
            background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', marginBottom: '12px',
          }}>
            {price}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};

// ============================================================
// SECTION DIVIDER — gold gradient line
// ============================================================

export const SectionDivider: React.FC<{ style?: string }> = (_props) => (
  <div style={{
    height: '1px',
    background: MESSIKA_GRADIENTS.sectionDivider,
    margin: `${MESSIKA_SPACING['3xl']} 0`,
  }} />
);
