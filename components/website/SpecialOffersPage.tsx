import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../../AppContext';
import { ShoppingCart, Check } from 'lucide-react';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_GRADIENTS,
  MESSIKA_SPACING,
  getThemeColors,
} from '../../utils/luxuryDesignSystem';
import { FloatingParticles, PremiumButton } from './LuxuryComponents';
import ProductDetailModal from './ProductDetailModal';

interface SpecialOffersPageProps {
  lang: 'fr' | 'ar';
  cart: any[];
  setCart: (cart: any[]) => void;
  setCurrentPage: (page: string) => void;
  theme?: 'light' | 'dark';
}

// ============================================================
// COUNTDOWN — segmented display
// ============================================================

interface TimeParts { d: number; h: number; m: number; s: number; expired: boolean }

const useCountdown = (endDate: string): TimeParts => {
  const [parts, setParts] = useState<TimeParts>({ d: 0, h: 0, m: 0, s: 0, expired: false });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setParts({ d: 0, h: 0, m: 0, s: 0, expired: true }); return; }
      setParts({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000), expired: false });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  return parts;
};

const TimeUnit: React.FC<{ value: number; label: string; color: string; bg: string; border: string }> = ({ value, label, color, bg, border }) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const prev = React.useRef(value);
  const changed = prev.current !== value;
  prev.current = value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <motion.div
        key={value}
        initial={changed ? { y: -8, opacity: 0.4 } : {}}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18 }}
        style={{
          width: '48px', height: '52px',
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Half-divider line for flip-clock feel */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: `${border}`, opacity: 0.4 }} />
        <span style={{
          fontFamily: MESSIKA_FONTS.display,
          fontSize: '22px',
          fontWeight: 400,
          color,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}>
          {pad(value)}
        </span>
      </motion.div>
      <div style={{
        fontFamily: MESSIKA_FONTS.body, fontSize: '9px', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: MESSIKA_PALETTE.textMuted,
      }}>
        {label}
      </div>
    </div>
  );
};

const Separator: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignSelf: 'center', marginBottom: '14px' }}>
    {[0, 1].map(i => (
      <motion.div
        key={i}
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
        style={{ width: '4px', height: '4px', borderRadius: '50%', background: MESSIKA_PALETTE.goldWarm }}
      />
    ))}
  </div>
);

const Countdown: React.FC<{ endDate: string; lang: 'fr' | 'ar' }> = ({ endDate, lang }) => {
  const parts = useCountdown(endDate);

  if (parts.expired) return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '6px 12px',
      background: 'rgba(232,93,93,0.1)', border: '1px solid rgba(232,93,93,0.3)',
      borderRadius: '4px',
      fontFamily: MESSIKA_FONTS.body, fontSize: '11px', fontWeight: 700,
      color: MESSIKA_PALETTE.error, letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      {lang === 'fr' ? '✕ Offre expirée' : '✕ انتهى العرض'}
    </div>
  );

  const units = [
    { value: parts.d, label: lang === 'fr' ? 'Jours' : 'أيام', color: MESSIKA_PALETTE.goldBright, bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.28)' },
    { value: parts.h, label: lang === 'fr' ? 'Heures' : 'ساعات', color: MESSIKA_PALETTE.goldWarm, bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.2)' },
    { value: parts.m, label: lang === 'fr' ? 'Min' : 'دقائق', color: '#E8A45C', bg: 'rgba(232,164,92,0.08)', border: 'rgba(232,164,92,0.25)' },
    { value: parts.s, label: lang === 'fr' ? 'Sec' : 'ثواني', color: MESSIKA_PALETTE.error, bg: 'rgba(232,93,93,0.08)', border: 'rgba(232,93,93,0.28)' },
  ];

  return (
    <div>
      <div style={{
        fontFamily: MESSIKA_FONTS.body, fontSize: '9px', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: MESSIKA_PALETTE.error, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: MESSIKA_PALETTE.error }} />
        {lang === 'fr' ? 'Offre limitée' : 'عرض محدود'}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
        {units.map((u, i) => (
          <React.Fragment key={i}>
            <TimeUnit {...u} />
            {i < units.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// PROMO CARD
// ============================================================

const PromoCard: React.FC<{
  offer: any;
  lang: 'fr' | 'ar';
  isAdded: boolean;
  onAddToCart: () => void;
  onViewDetails: () => void;
  delay: number;
  isDark: boolean;
  tc: ReturnType<typeof getThemeColors>;
}> = ({ offer, lang, isAdded, onAddToCart, onViewDetails, delay, isDark, tc }) => {
  const [hovered, setHovered] = useState(false);
  const shouldReduce = useReducedMotion();
  const revealActive = hovered && !shouldReduce;

  const discount = offer.originalPrice && offer.specialPrice
    ? Math.round(((offer.originalPrice - offer.specialPrice) / offer.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onViewDetails}
      style={{
        position: 'relative',
        background: tc.cardBg,
        border: `1px solid ${hovered ? tc.cardHover : tc.cardBorder}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
        boxShadow: hovered ? tc.cardHoverShadow : (isDark ? '0 2px 24px rgba(0,0,0,0.5)' : '0 2px 12px rgba(0,0,0,0.06)'),
      }}
    >
      {/* Diagonal promo ribbon */}
      {discount !== null && (
        <div style={{
          position: 'absolute', top: 20, left: -30, width: '120px',
          background: MESSIKA_PALETTE.error, color: '#fff',
          fontSize: '11px', fontFamily: MESSIKA_FONTS.body, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center',
          padding: '5px 0', transform: 'rotate(-45deg)', zIndex: 10,
        }}>
          -{discount}%
        </div>
      )}

      {/* Gold top accent */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: MESSIKA_GRADIENTS.goldBtn, transformOrigin: 'left', zIndex: 5 }}
      />

      {/* Image */}
      <div style={{ height: '280px', overflow: 'hidden', background: tc.imageBg, position: 'relative' }}>
        {offer.image ? (
          <motion.img
            src={offer.image}
            alt={offer.name}
            animate={{ scale: revealActive ? 1.08 : 1.0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #1A1A24, #111118)' }}>
            <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.75, 0.55] }} transition={{ duration: 3.5, repeat: Infinity }} style={{ fontSize: '56px' }}>💎</motion.div>
          </div>
        )}

        {/* Hover overlay with add-to-cart */}
        <motion.div
          animate={{ height: revealActive ? '55%' : '0%' }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.7) 70%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px', overflow: 'hidden' }}
        >
          <motion.div
            animate={{ opacity: revealActive ? 1 : 0, y: revealActive ? 0 : 14 }}
            transition={{ duration: 0.25, delay: revealActive ? 0.1 : 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', padding: '10px',
                background: isAdded ? MESSIKA_PALETTE.success : MESSIKA_GRADIENTS.goldBtn,
                border: 'none', color: '#0A0A0A',
                fontSize: '11px', fontWeight: 700, fontFamily: MESSIKA_FONTS.body,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {isAdded ? <Check size={14} /> : <ShoppingCart size={14} />}
              {isAdded ? (lang === 'fr' ? 'Ajouté' : 'تمت الإضافة') : (lang === 'fr' ? 'Ajouter au panier' : 'أضف للسلة')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '18px', fontWeight: 400, color: tc.textPrimary, marginBottom: '8px', lineHeight: 1.25 }}>
          {offer.name}
        </h3>

        {(offer.calibre || offer.form) && (
          <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '11px', color: tc.textMuted, marginBottom: '14px', letterSpacing: '0.08em' }}>
            {[offer.calibre, offer.form].filter(Boolean).join(' — ')}
          </div>
        )}

        {/* Pricing row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {offer.originalPrice && (
            <span style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '13px', color: MESSIKA_PALETTE.error, textDecoration: 'line-through', opacity: 0.8 }}>
              {offer.originalPrice.toLocaleString('fr-DZ')} DA
            </span>
          )}
          {offer.specialPrice && (
            <span style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '22px', fontWeight: 300, background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>
              {offer.specialPrice.toLocaleString('fr-DZ')} DA
            </span>
          )}
          {discount !== null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '18px', background: 'rgba(232,93,93,0.15)', border: '1px solid rgba(232,93,93,0.3)', borderRadius: '2px', fontFamily: MESSIKA_FONTS.body, fontSize: '10px', fontWeight: 700, color: MESSIKA_PALETTE.error }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Countdown */}
        {offer.endDate && (
          <div style={{ padding: '14px', background: tc.countdownBox, border: `1px solid ${tc.countdownBoxBorder}`, borderRadius: '4px' }}>
            <Countdown endDate={`${offer.endDate}T${offer.endHour || '23:59'}`} lang={lang} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// MAIN
// ============================================================

const SpecialOffersPage: React.FC<SpecialOffersPageProps> = ({ lang, cart, setCart, setCurrentPage, theme = 'dark' }) => {
  const { webSpecialOffers } = useApp();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedModalId, setAddedModalId] = useState<string | null>(null);

  const activeOffers = useMemo(() => webSpecialOffers.filter(o => !o.isHidden), [webSpecialOffers]);

  const addToCart = useCallback((offer: any) => {
    const existing = cart.find(ci => ci.offer.id === offer.id);
    if (existing) {
      setCart(cart.map(ci => ci.offer.id === offer.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      setCart([...cart, { offer, quantity: 1, isSpecial: true }]);
    }
    setAddedIds(prev => new Set([...prev, offer.id]));
    setTimeout(() => { setAddedIds(prev => { const n = new Set(prev); n.delete(offer.id); return n; }); }, 1800);
  }, [cart, setCart]);

  const addToCartFromModal = useCallback((offer: any) => {
    addToCart(offer);
    setAddedModalId(offer.id);
    setTimeout(() => setAddedModalId(null), 1800);
  }, [addToCart]);

  const openModal = (offer: any) => { setSelectedOffer(offer); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setTimeout(() => setSelectedOffer(null), 400); };

  const t = lang === 'fr' ? {
    title: 'Offres Exclusives',
    limitedBadge: 'LIMITÉ',
    empty: 'Aucune offre spéciale actuellement',
    emptyDesc: 'Découvrez notre collection complète',
    emptyBtn: 'Voir la collection',
  } : {
    title: 'العروض الحصرية',
    limitedBadge: 'محدود',
    empty: 'لا توجد عروض خاصة حالياً',
    emptyDesc: 'اكتشف مجموعتنا الكاملة',
    emptyBtn: 'عرض المجموعة',
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: tc.pageBg, paddingTop: '72px' }}>
      {isDark && <FloatingParticles count={8} size="md" />}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${MESSIKA_SPACING['3xl']} 48px ${MESSIKA_SPACING['5xl']}`, position: 'relative', zIndex: 5 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: MESSIKA_SPACING['4xl'] }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <h1 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 400, background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite', margin: 0 }}>
              {t.title}
            </h1>
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ padding: '4px 10px', background: 'rgba(232,93,93,0.15)', border: '1px solid rgba(232,93,93,0.4)', color: MESSIKA_PALETTE.error, fontFamily: MESSIKA_FONTS.body, fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              {t.limitedBadge}
            </motion.div>
          </div>
          <div style={{ height: 1, background: MESSIKA_GRADIENTS.sectionDivider, maxWidth: '400px', margin: '0 auto' }} />
        </motion.div>

        {activeOffers.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: `${MESSIKA_SPACING['4xl']} 0` }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.4 }}>💎</div>
            <p style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '24px', fontWeight: 400, color: MESSIKA_PALETTE.textPrimary, marginBottom: '10px' }}>{t.empty}</p>
            <p style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '14px', color: MESSIKA_PALETTE.textMuted, marginBottom: '28px' }}>{t.emptyDesc}</p>
            <PremiumButton label={t.emptyBtn} onClick={() => setCurrentPage('offers')} variant="primary" size="lg" />
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }} className="special-grid">
            {activeOffers.map((offer, i) => (
              <PromoCard
                key={offer.id}
                offer={offer}
                lang={lang}
                isAdded={addedIds.has(offer.id)}
                onAddToCart={() => addToCart(offer)}
                onViewDetails={() => openModal(offer)}
                delay={i * 0.08}
                isDark={isDark}
                tc={tc}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .special-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .special-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <ProductDetailModal
        offer={selectedOffer ? { id: selectedOffer.id, name: selectedOffer.name, image: selectedOffer.image, unitPrice: selectedOffer.specialPrice, calibre: selectedOffer.calibre, category: selectedOffer.form } : null}
        isOpen={modalOpen}
        onClose={closeModal}
        onAddToCart={addToCartFromModal}
        lang={lang}
        isAdded={selectedOffer ? addedModalId === selectedOffer.id : false}
        theme={theme}
      />
    </div>
  );
};

export default SpecialOffersPage;
