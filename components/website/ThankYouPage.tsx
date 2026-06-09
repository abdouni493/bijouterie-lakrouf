/**
 * Luxury Thank You Page - Order Confirmation & Celebration
 * Celebration animations, floating particles, order showcase
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle, Download, MessageSquare, ShoppingBag, Sparkles } from 'lucide-react';
import {
  LUXURY_PALETTE,
  LUXURY_SPACING,
  LUXURY_BORDER_RADIUS,
  LUXURY_GRADIENTS,
} from '../../utils/luxuryDesignSystem';
import { FloatingParticles, GlassmorphicContainer, PremiumButton, PremiumHeading } from './LuxuryComponents';

interface ThankYouPageProps {
  lastOrderId: string;
  lang: 'fr' | 'ar';
  theme?: 'light' | 'dark';
  setCurrentPage: (page: string) => void;
}

// Confetti animation component
const ConfettiPiece: React.FC<{ delay: number; isDark: boolean }> = ({ delay, isDark }) => {
  const colors = ['#C9A84C', '#E7ECF2', '#DDE6F3', '#10B981', '#3B82F6'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      initial={{ opacity: 1, y: -100, x: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 200,
        rotate: 360,
      }}
      transition={{
        duration: 2 + Math.random() * 1,
        delay,
        ease: 'easeIn',
      }}
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

const ThankYouPage: React.FC<ThankYouPageProps> = ({ lastOrderId, lang, theme = 'light', setCurrentPage }) => {
  const isDark = theme === 'dark';
  const shouldReduce = useReducedMotion();
  const [showConfetti, setShowConfetti] = useState(!shouldReduce);

  useEffect(() => {
    if (!shouldReduce) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldReduce]);

  const t = {
    fr: {
      title: 'Merci pour Votre Commande! 🎉',
      subtitle: 'Votre pièce précieuse est en route',
      orderId: 'Numéro de Commande',
      estimate: 'Estimation d\'arrivée',
      estimateValue: '5-7 jours ouvrables',
      track: 'Suivre Votre Commande',
      next: 'Continuer les Courses',
      contact: 'Nous Contacter',
      message: 'Vous recevrez bientôt un email de confirmation avec les détails complets de votre commande.',
    },
    ar: {
      title: 'شكراً لطلبك! 🎉',
      subtitle: 'قطعتك الثمينة في الطريق إليك',
      orderId: 'رقم الطلب',
      estimate: 'التوصيل المتوقع',
      estimateValue: '5-7 أيام عمل',
      track: 'تتبع طلبك',
      next: 'مواصلة التسوق',
      contact: 'تواصل معنا',
      message: 'ستتلقى قريباً بريداً إلكترونياً بتأكيد مع التفاصيل الكاملة لطلبك.',
    },
  }[lang];

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: isDark ? LUXURY_GRADIENTS.darkBg : LUXURY_GRADIENTS.lightBg,
        paddingTop: '120px',
        paddingBottom: LUXURY_SPACING['5xl'],
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Floating Particles */}
      <FloatingParticles count={12} isDark={isDark} size="lg" />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti &&
          Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece key={i} delay={i * 0.05} isDark={isDark} />
          ))}
      </AnimatePresence>

      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: `0 ${LUXURY_SPACING['3xl']}`,
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          style={{
            marginBottom: LUXURY_SPACING['2xl'],
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle size={48} style={{ color: 'white' }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            background: isDark
              ? `linear-gradient(135deg, ${LUXURY_PALETTE.diamondWhite} 0%, ${LUXURY_PALETTE.reflectiveSilver} 100%)`
              : `linear-gradient(135deg, ${LUXURY_PALETTE.luxuryDark} 0%, ${LUXURY_PALETTE.surface} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: LUXURY_SPACING.lg,
          }}
        >
          {t.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '18px',
            color: isDark ? 'rgba(245, 247, 250, 0.8)' : 'rgba(11, 18, 32, 0.8)',
            marginBottom: LUXURY_SPACING['3xl'],
            lineHeight: '1.7',
          }}
        >
          {t.subtitle}
        </motion.p>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginBottom: LUXURY_SPACING['3xl'],
          }}
        >
          <GlassmorphicContainer isDark={isDark} intensity="heavy">
            <div style={{ padding: LUXURY_SPACING['3xl'] }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: LUXURY_SPACING['2xl'],
                  marginBottom: LUXURY_SPACING['2xl'],
                }}
              >
                {/* Order ID */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#C9A84C',
                      textTransform: 'uppercase',
                      marginBottom: LUXURY_SPACING.md,
                    }}
                  >
                    {t.orderId}
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    {lastOrderId || '#123456'}
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#C9A84C',
                      textTransform: 'uppercase',
                      marginBottom: LUXURY_SPACING.md,
                    }}
                  >
                    {t.estimate}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                    }}
                  >
                    {t.estimateValue}
                  </div>
                </div>
              </div>

              {/* Message */}
              <p
                style={{
                  fontSize: '14px',
                  color: isDark ? 'rgba(245, 247, 250, 0.7)' : 'rgba(11, 18, 32, 0.7)',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {t.message}
              </p>
            </div>
          </GlassmorphicContainer>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: LUXURY_SPACING.lg,
          }}
        >
          <PremiumButton
            label={t.track}
            onClick={() => setCurrentPage('offers')}
            isDark={isDark}
            variant="primary"
            size="lg"
            icon={<ShoppingBag size={18} />}
          />

          <div style={{ display: 'flex', gap: LUXURY_SPACING.md }}>
            <PremiumButton
              label={t.next}
              onClick={() => setCurrentPage('offers')}
              isDark={isDark}
              variant="secondary"
              size="md"
            />
            <PremiumButton
              label={t.contact}
              onClick={() => setCurrentPage('contacts')}
              isDark={isDark}
              variant="outline"
              size="md"
              icon={<MessageSquare size={16} />}
            />
          </div>
        </motion.div>

        {/* Celebration Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: LUXURY_SPACING['3xl'],
            fontSize: '14px',
            color: isDark ? 'rgba(192, 200, 212, 0.5)' : 'rgba(11, 18, 32, 0.5)',
          }}
        >
          ✨ Nous vous remercions de votre confiance ✨
        </motion.p>
      </div>
    </div>
  );
};

export default ThankYouPage;
