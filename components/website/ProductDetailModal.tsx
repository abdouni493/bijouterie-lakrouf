import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ShoppingCart, Check, MessageSquare } from 'lucide-react';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_GRADIENTS,
  MESSIKA_RADIUS,
  MESSIKA_SHADOWS,
  getThemeColors,
} from '../../utils/luxuryDesignSystem';

interface OfferDetail {
  id: string;
  name: string;
  image?: string;
  unitPrice?: number;
  calibre?: string;
  weight?: number;
  maxWeight?: number;
  description?: string;
  category?: string;
}

interface ProductDetailModalProps {
  offer: OfferDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (offer: OfferDetail) => void;
  lang: 'fr' | 'ar';
  isAdded?: boolean;
  theme?: 'light' | 'dark';
}

const formatPrice = (price?: number, lang: 'fr' | 'ar' = 'fr') => {
  if (!price) return lang === 'fr' ? 'Sur demande' : 'بناءً على الطلب';
  return `${price.toLocaleString('fr-DZ')} DA`;
};

const ConfettiParticle: React.FC<{ index: number }> = ({ index }) => {
  const angle = (index / 6) * 360;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * 60;
  const y = Math.sin(rad) * 60 - 20;
  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x, y, scale: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute', width: 6, height: 6, borderRadius: '50%',
        background: index % 2 === 0 ? MESSIKA_PALETTE.goldBright : MESSIKA_PALETTE.goldWarm,
        top: '50%', left: '50%', pointerEvents: 'none',
      }}
    />
  );
};

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  offer, isOpen, onClose, onAddToCart, lang, isAdded = false, theme = 'dark',
}) => {
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 6,
      y: ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 6,
    });
  }, [shouldReduce]);

  const handleAddToCart = () => {
    if (!offer) return;
    onAddToCart(offer);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 700);
  };

  if (!offer) return null;

  // Theme-derived values
  const modalBg = isDark ? MESSIKA_PALETTE.midnight : '#FFFFFF';
  const modalBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)';
  const closeBtnBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const closeBtnBgHover = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const closeBtnBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const imagePlaceholderBg = isDark
    ? 'linear-gradient(145deg, #1A1A24, #0F0F16)'
    : 'linear-gradient(145deg, #F0EDE8, #E8E4DE)';
  const specBg = isDark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.1)';
  const specBorder = isDark ? 'rgba(201,168,76,0.18)' : 'rgba(154,123,53,0.25)';
  const specHighlightBg = isDark ? 'rgba(76,175,132,0.08)' : 'rgba(16,185,129,0.08)';
  const specHighlightBorder = isDark ? 'rgba(76,175,132,0.25)' : 'rgba(16,185,129,0.3)';
  const secondBtnBorder = isDark ? 'rgba(255,255,255,0.11)' : 'rgba(0,0,0,0.12)';
  const secondBtnBorderHover = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)';
  const dividerBg = isDark ? MESSIKA_GRADIENTS.sectionDivider : 'linear-gradient(90deg, transparent, rgba(154,123,53,0.3), transparent)';

  const specs = [
    { label: lang === 'fr' ? 'Poids' : 'الوزن', value: offer.weight ? `${offer.weight}g` : offer.maxWeight ? `≤${offer.maxWeight}g` : '—' },
    { label: lang === 'fr' ? 'Calibre' : 'المعيار', value: offer.calibre || '950' },
    { label: lang === 'fr' ? 'Certifié' : 'معتمد', value: '✓', highlight: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — always dark for readability */}
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: isDark ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 100,
            }}
          />

          {/* Centering wrapper */}
          <div
            style={{
              position: 'fixed', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '16px',
              zIndex: 101,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              key="modal-content"
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={{
                width: 'min(900px, 100%)',
                maxHeight: '90vh',
                background: modalBg,
                border: `1px solid ${modalBorder}`,
                boxShadow: isDark ? MESSIKA_SHADOWS.goldIntense : '0 24px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(154,123,53,0.12)',
                overflowY: 'auto',
                pointerEvents: 'all',
                position: 'relative',
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: lang === 'ar' ? 'auto' : 16,
                  left: lang === 'ar' ? 16 : 'auto',
                  width: 40, height: 40,
                  background: closeBtnBg,
                  border: `1px solid ${closeBtnBorder}`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: tc.textSecondary,
                  zIndex: 10,
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = closeBtnBgHover; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = closeBtnBg; }}
              >
                <X size={18} />
              </button>

              {/* Two-column body */}
              <div
                className="modal-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}
              >
                {/* Left — image with parallax */}
                <div
                  style={{ position: 'relative', overflow: 'hidden', background: tc.imageBg, minHeight: '420px' }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
                >
                  {offer.image ? (
                    <motion.img
                      src={offer.image}
                      alt={offer.name}
                      animate={shouldReduce ? {} : { x: mousePos.x, y: mousePos.y }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '420px' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', minHeight: '420px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: imagePlaceholderBg,
                    }}>
                      <motion.div
                        animate={{ scale: [1, 1.07, 1], opacity: [0.5, 0.75, 0.5] }}
                        transition={{ duration: 3.5, repeat: Infinity }}
                        style={{ fontSize: '80px' }}
                      >
                        💎
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Right — details */}
                <div style={{ padding: '56px 36px 36px', display: 'flex', flexDirection: 'column', gap: '18px', background: modalBg }}>
                  {offer.category && (
                    <div style={{
                      display: 'inline-block', padding: '4px 14px', alignSelf: 'flex-start',
                      background: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.12)',
                      border: `1px solid ${isDark ? 'rgba(201,168,76,0.25)' : 'rgba(154,123,53,0.3)'}`,
                      fontSize: '10px', fontWeight: 600, fontFamily: MESSIKA_FONTS.body,
                      color: tc.goldAccent, textTransform: 'uppercase', letterSpacing: '0.16em',
                    }}>
                      {offer.category}
                    </div>
                  )}

                  <h2 style={{
                    fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(26px, 3.5vw, 36px)',
                    fontWeight: 400, color: tc.textPrimary, lineHeight: 1.2, margin: 0,
                  }}>
                    {offer.name}
                  </h2>

                  <div style={{ height: 1, background: dividerBg }} />

                  <div style={{
                    fontSize: '11px', fontWeight: 600, fontFamily: MESSIKA_FONTS.body,
                    color: tc.goldAccent, textTransform: 'uppercase', letterSpacing: '0.18em',
                  }}>
                    {lang === 'fr' ? 'Argent Massif 950' : 'فضة خالصة 950'}
                  </div>

                  <div style={{
                    fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 300,
                    background: offer.unitPrice ? MESSIKA_GRADIENTS.goldText : MESSIKA_GRADIENTS.silverText,
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto',
                    animation: offer.unitPrice ? 'shimmer 3s linear infinite' : 'none',
                  }}>
                    {formatPrice(offer.unitPrice, lang)}
                  </div>

                  {/* Specs */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {specs.map((spec, i) => (
                      <div key={i} style={{
                        padding: '10px 16px',
                        background: spec.highlight ? specHighlightBg : specBg,
                        border: `1px solid ${spec.highlight ? specHighlightBorder : specBorder}`,
                        borderRadius: MESSIKA_RADIUS.sm, textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '15px', fontWeight: 600, fontFamily: MESSIKA_FONTS.display,
                          color: spec.highlight ? (isDark ? MESSIKA_PALETTE.success : '#059669') : tc.goldAccent,
                        }}>
                          {spec.value}
                        </div>
                        <div style={{
                          fontSize: '9px', fontFamily: MESSIKA_FONTS.body, color: tc.textMuted,
                          textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '3px',
                        }}>
                          {spec.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {offer.description && (
                    <p style={{
                      fontSize: '14px', fontFamily: MESSIKA_FONTS.body,
                      color: tc.textMuted, lineHeight: '1.8', margin: 0,
                    }}>
                      {offer.description}
                    </p>
                  )}

                  <div style={{ flex: 1 }} />

                  {/* Add to cart */}
                  <div style={{ position: 'relative' }}>
                    <motion.button
                      onClick={handleAddToCart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%', padding: '15px',
                        background: isAdded ? MESSIKA_PALETTE.success : MESSIKA_GRADIENTS.goldBtn,
                        border: 'none', color: '#0A0A0A',
                        fontSize: '12px', fontWeight: 700, fontFamily: MESSIKA_FONTS.body,
                        letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        transition: 'background 0.3s ease',
                      }}
                    >
                      {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                      {isAdded
                        ? (lang === 'fr' ? 'Ajouté au panier' : 'تمت الإضافة')
                        : (lang === 'fr' ? 'Ajouter au panier' : 'أضف إلى السلة')}
                    </motion.button>
                    <AnimatePresence>
                      {showConfetti && !shouldReduce && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
                          {Array.from({ length: 6 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, borderColor: secondBtnBorderHover }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '13px',
                      background: 'transparent', border: `1px solid ${secondBtnBorder}`,
                      color: tc.textSecondary, fontSize: '12px', fontWeight: 600,
                      fontFamily: MESSIKA_FONTS.body, letterSpacing: '0.12em', textTransform: 'uppercase',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <MessageSquare size={14} />
                    {lang === 'fr' ? 'Commander sur mesure' : 'طلب مخصص'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          <style>{`
            @media (max-width: 640px) {
              .modal-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
