import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../../AppContext';
import { ArrowRight, Shield, Truck, MessageSquare, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_GRADIENTS,
  MESSIKA_SPACING,
  getThemeColors,
} from '../../utils/luxuryDesignSystem';
import { PremiumButton, FloatingParticles, LuxuryBadge } from './LuxuryComponents';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
  lang: 'fr' | 'ar';
  theme?: 'light' | 'dark';
}

// ============================================================
// MARQUEE TICKER
// ============================================================

const DEFAULT_MARQUEE = ['💎 Argent 950 Certifié', 'Livraison nationale', 'Créations sur mesure', 'Bijoux artisanaux', 'Qualité garantie'];

const MarqueeTicker: React.FC<{ shouldReduce: boolean | null; tc: ReturnType<typeof getThemeColors>; settings: any }> = ({ shouldReduce, tc, settings }) => {
  let items: string[] = DEFAULT_MARQUEE;
  try {
    const parsed = JSON.parse(settings?.webMarqueeItems || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) items = parsed;
  } catch { /* use defaults */ }
  const tickerText = items.join('  •  ') + '  •  ';
  return (
    <div style={{ background: tc.goldAccentMuted, borderTop: `1px solid ${tc.goldBorderMuted}`, borderBottom: `1px solid ${tc.goldBorderMuted}`, overflow: 'hidden', padding: '12px 0' }}>
      <div style={{ whiteSpace: 'nowrap', animation: shouldReduce ? 'none' : 'marquee 22s linear infinite', display: 'inline-block', fontFamily: MESSIKA_FONTS.body, fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc.goldAccent }}>
        {tickerText + tickerText}
      </div>
    </div>
  );
};

// ============================================================
// CINEMATIC HERO
// ============================================================

const CinematicHero: React.FC<{
  setCurrentPage: (p: string) => void;
  lang: 'fr' | 'ar';
  shouldReduce: boolean | null;
  t: any;
  offers: any[];
  settings: any;
  isDark: boolean;
  tc: ReturnType<typeof getThemeColors>;
}> = ({ setCurrentPage, lang, shouldReduce, t, offers, settings, isDark, tc }) => {
  const { scrollY } = useScroll();
  const yOffset = useTransform(scrollY, [0, 400], [0, 30]);
  const storeName = settings?.storeName || 'Bijouterie';
  const logoUrl = settings?.logo || null;

  return (
    <section style={{ minHeight: '100vh', background: tc.heroBg, position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '72px' }}>
      {isDark && <FloatingParticles count={10} size="lg" />}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${MESSIKA_SPACING['5xl']} 48px`, width: '100%', display: 'grid', gridTemplateColumns: '55% 45%', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 5 }} className="hero-grid">
        <div>
          {/* Circle logo + badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${isDark ? 'rgba(201,168,76,0.5)' : 'rgba(154,123,53,0.55)'}`, background: isDark ? 'rgba(201,168,76,0.07)' : 'rgba(154,123,53,0.07)', boxShadow: isDark ? '0 0 0 4px rgba(201,168,76,0.08)' : '0 0 0 4px rgba(154,123,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {logoUrl
                ? <img src={logoUrl} alt={storeName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '22px', fontWeight: 600, background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto' }}>{storeName.charAt(0).toUpperCase()}</span>}
            </div>
            <LuxuryBadge label={t.badge} variant="premium" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.02em', color: tc.textPrimary, marginTop: 0, marginBottom: 0 }}
          >{t.heroLine1}</motion.h1>

          <motion.h1
            initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.02em', background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite', marginBottom: '24px' }}
          >{t.heroLine2}</motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '16px', lineHeight: '1.85', color: tc.textSecondary, maxWidth: '480px', marginBottom: '40px' }}
          >{t.heroDesc}</motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <PremiumButton label={t.cta1} onClick={() => setCurrentPage('offers')} variant="primary" size="lg" rightIcon={<ArrowRight size={16} />} theme={isDark ? 'dark' : 'light'} />
            <PremiumButton label={t.cta2} onClick={() => setCurrentPage('personalized')} variant="secondary" size="lg" theme={isDark ? 'dark' : 'light'} />
          </motion.div>
        </div>


      </div>

      {isDark && <div style={{ position: 'absolute', right: '-200px', top: '20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />}

      <style>{`
        @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-visual { display: none !important; } }
      `}</style>
    </section>
  );
};

// ============================================================
// FEATURED OFFERS — HORIZONTAL DRAGGABLE CAROUSEL
// ============================================================

const CARD_W = 280;
const CARD_GAP = 3;

const OfferCarouselSection: React.FC<{
  offers: any[];
  shouldReduce: boolean | null;
  t: any;
  setCurrentPage: (p: string) => void;
  isDark: boolean;
  tc: ReturnType<typeof getThemeColors>;
}> = ({ offers, shouldReduce, t, setCurrentPage, isDark, tc }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const visible = offers.slice(0, 12);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    const total = visible.length * (CARD_W + CARD_GAP) - CARD_GAP;
    setMaxDrag(Math.max(0, total - containerRef.current.clientWidth));
  }, [visible.length]);

  const scrollTo = (dir: 'prev' | 'next') => {
    const step = CARD_W + CARD_GAP;
    const next = dir === 'next' ? Math.max(dragX - step * 2, -maxDrag) : Math.min(dragX + step * 2, 0);
    setDragX(next);
    setActiveIdx(Math.min(Math.round(Math.abs(next) / step), visible.length - 1));
  };

  if (visible.length === 0) return null;

  return (
    <section style={{ padding: `${MESSIKA_SPACING['5xl']} 0`, background: tc.sectionBg, overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontSize: '10px', fontFamily: MESSIKA_FONTS.body, fontWeight: 600, color: tc.goldAccent, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '10px' }}>Collection</div>
            <h2 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 400, color: tc.textPrimary, margin: 0 }}>{t.featured}</h2>
          </motion.div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['prev', 'next'] as const).map(dir => (
              <motion.button key={dir} onClick={() => scrollTo(dir)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                style={{ width: 40, height: 40, borderRadius: '50%', background: tc.goldAccentMuted, border: `1px solid ${tc.goldBorderMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: tc.goldAccent }}>
                {dir === 'prev' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Track */}
        <div ref={containerRef} style={{ overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}>
          <motion.div
            ref={trackRef}
            drag={shouldReduce ? false : 'x'}
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.12}
            animate={{ x: dragX }}
            onDragStart={() => setDragging(true)}
            onDragEnd={(_, info) => {
              setDragging(false);
              const newX = Math.max(-maxDrag, Math.min(0, dragX + info.offset.x));
              setDragX(newX);
              setActiveIdx(Math.min(Math.round(Math.abs(newX) / (CARD_W + CARD_GAP)), visible.length - 1));
            }}
            style={{ display: 'flex', gap: `${CARD_GAP}px` }}
          >
            {visible.map((offer, i) => (
              <motion.div key={offer?.id || i}
                initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.06, 0.5), duration: 0.5 }}
                onClick={() => { if (!dragging) setCurrentPage('offers'); }}
                style={{ flexShrink: 0, width: `${CARD_W}px`, background: tc.cardBg, position: 'relative', overflow: 'hidden', cursor: dragging ? 'grabbing' : 'pointer', boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div style={{ height: '340px', overflow: 'hidden', background: tc.imageBg }}>
                  {offer?.image
                    ? <motion.img src={offer.image} alt={offer.name} draggable={false} whileHover={shouldReduce ? {} : { scale: 1.06 }} transition={{ duration: 0.6 }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.35 }}>💎</div>}
                </div>
                <div style={{ padding: '16px 18px', background: tc.cardBg }}>
                  <div style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '16px', fontWeight: 400, color: tc.textPrimary, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{offer?.name}</div>
                  {offer?.unitPrice
                    ? <div style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '14px', fontWeight: 300, background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>{offer.unitPrice.toLocaleString('fr-DZ')} DA</div>
                    : <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '11px', color: tc.textMuted }}>Argent 950</div>}
                </div>
                <motion.div initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.35 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: MESSIKA_GRADIENTS.goldBtn, transformOrigin: 'left' }} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
          {visible.map((_, i) => (
            <motion.div key={i} animate={{ width: i === activeIdx ? '24px' : '6px', background: i === activeIdx ? tc.goldAccent : tc.cardBorder }} transition={{ duration: 0.3 }}
              style={{ height: '4px', borderRadius: '9999px', cursor: 'pointer' }}
              onClick={() => { const nx = Math.max(-maxDrag, -(i * (CARD_W + CARD_GAP))); setDragX(nx); setActiveIdx(i); }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <PremiumButton label={t.viewAllCta} onClick={() => setCurrentPage('offers')} variant="outline" size="md" rightIcon={<ArrowRight size={14} />} theme={isDark ? 'dark' : 'light'} />
        </div>
      </div>
    </section>
  );
};

// ============================================================
// STORY SECTION
// ============================================================

const StorySection: React.FC<{ t: any; isDark: boolean; tc: ReturnType<typeof getThemeColors> }> = ({ t, isDark, tc }) => (
  <section style={{ padding: `${MESSIKA_SPACING['5xl']} 0`, background: tc.pageBg }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="story-grid">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
          <div style={{ fontSize: '10px', fontFamily: MESSIKA_FONTS.body, fontWeight: 600, color: tc.goldAccent, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '16px' }}>{t.storyTag}</div>
          <h2 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, color: tc.textPrimary, marginBottom: '20px', lineHeight: 1.25 }}>{t.story}</h2>
          <p style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '15px', lineHeight: '1.85', color: tc.textSecondary, marginBottom: '36px' }}>{t.storyDesc}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: tc.statGridGap }}>
          {[
            { value: t.stat1Val, label: t.stat1 },
            { value: t.stat2Val, label: t.stat2 },
            { value: t.stat3Val, label: t.stat3 },
            { value: t.stat4Val, label: t.stat4 },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '32px 24px', background: tc.altBg, textAlign: 'center' }}>
              <div style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '48px', fontWeight: 300, background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '11px', color: tc.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
    <style>{`@media (max-width: 768px) { .story-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
  </section>
);

// ============================================================
// BENEFITS ROW
// ============================================================

const BenefitsRow: React.FC<{ t: any; isDark: boolean; tc: ReturnType<typeof getThemeColors> }> = ({ t, isDark, tc }) => {
  const benefits = [
    { icon: Shield, label: t.trust1, desc: t.trust1Desc },
    { icon: Truck, label: t.trust2, desc: t.trust2Desc },
    { icon: Award, label: t.trust3, desc: t.trust3Desc },
    { icon: MessageSquare, label: t.trust4, desc: t.trust4Desc },
  ];
  return (
    <section style={{ padding: `${MESSIKA_SPACING['3xl']} 0`, background: tc.sectionBg }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="benefits-row">
        {benefits.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            style={{ padding: '32px 24px', borderRight: i < 3 ? `1px solid ${tc.sectionGridBorder}` : 'none', textAlign: 'center' }}>
            <b.icon size={28} style={{ color: tc.goldAccent, marginBottom: '14px', display: 'block', margin: '0 auto 14px' }} />
            <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '13px', fontWeight: 600, color: tc.textPrimary, marginBottom: '6px', letterSpacing: '0.04em' }}>{b.label}</div>
            <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '12px', color: tc.textMuted, maxWidth: '180px', margin: '0 auto', lineHeight: 1.7 }}>{b.desc}</div>
          </motion.div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) { .benefits-row { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .benefits-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

// ============================================================
// PERSONALIZED CTA
// ============================================================

const PersonalizedCTA: React.FC<{ t: any; setCurrentPage: (p: string) => void; isDark: boolean; tc: ReturnType<typeof getThemeColors> }> = ({ t, setCurrentPage, isDark, tc }) => (
  <section style={{ padding: `${MESSIKA_SPACING['5xl']} 0`, background: tc.heroBg }}>
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 48px', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 4, repeat: Infinity }} style={{ fontSize: '48px', marginBottom: '24px' }}>✨</motion.div>
        <h2 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, color: tc.textPrimary, marginBottom: '16px' }}>{t.personalized}</h2>
        <p style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '15px', color: tc.textSecondary, lineHeight: '1.8', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>{t.personalizedDesc}</p>
        <PremiumButton label={t.personalizedCTA} onClick={() => setCurrentPage('personalized')} variant="primary" size="lg" theme={isDark ? 'dark' : 'light'} />
      </motion.div>
    </div>
  </section>
);

// ============================================================
// MAIN
// ============================================================

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage, lang, theme = 'dark' }) => {
  const { webOffers, settings } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);
  const offers = useMemo(() => webOffers.filter(o => !o.isHidden), [webOffers]);

  const t = {
    fr: {
      badge: settings.webBadgeFr || 'Nouvelle Collection',
      heroLine1: settings.webHeroLine1Fr || 'Élégance',
      heroLine2: settings.webHeroLine2Fr || 'en Argent Pur',
      heroDesc: settings.webHeroDescFr || 'Découvrez notre collection exclusive de bijoux en argent massif 950, conçus pour les âmes élégantes qui apprécient la qualité et l\'artisanat authentique.',
      cta1: settings.webCta1Fr || 'Explorer la Collection',
      cta2: settings.webCta2Fr || 'Créer sur Mesure',
      featured: settings.webFeaturedTitleFr || 'Nos Pièces Vedettes',
      viewAllCta: settings.webViewAllCtaFr || 'Voir toute la collection',
      storyTag: settings.webStoryTagFr || 'Savoir-Faire',
      story: settings.webStoryTitleFr || 'Notre Artisanat',
      storyDesc: settings.webStoryDescFr || 'Depuis plus d\'une décennie, chaque pièce est façonnée avec passion et expertise, en argent 950 massif certifié, pour sublimer votre élégance naturelle.',
      stat1Val: settings.webStat1Val || '10+',
      stat2Val: settings.webStat2Val || '950',
      stat3Val: settings.webStat3Val || '4.9',
      stat4Val: settings.webStat4Val || '48h',
      stat1: settings.webStat1LabelFr || 'Années d\'expérience',
      stat2: settings.webStat2LabelFr || 'Pureté Argent',
      stat3: settings.webStat3LabelFr || 'Note clients',
      stat4: settings.webStat4LabelFr || 'Délai livraison',
      trust1: settings.webBenefit1TitleFr || 'Argent Certifié',
      trust1Desc: settings.webBenefit1DescFr || 'Pureté 950 garantie avec certificat d\'authenticité',
      trust2: settings.webBenefit2TitleFr || 'Livraison Nationale',
      trust2Desc: settings.webBenefit2DescFr || 'Express dans toutes les wilayas d\'Algérie',
      trust3: settings.webBenefit3TitleFr || 'Qualité Premium',
      trust3Desc: settings.webBenefit3DescFr || 'Chaque pièce inspectée et certifiée avant expédition',
      trust4: settings.webBenefit4TitleFr || 'Support Dédié',
      trust4Desc: settings.webBenefit4DescFr || 'Assistance 7j/7 pour toutes vos questions',
      personalized: settings.webPersonalizedTitleFr || 'Transformez Votre Vision en Réalité',
      personalizedDesc: settings.webPersonalizedDescFr || 'Nos artisans créent des pièces uniques selon vos désirs — une expérience de luxe personnalisée.',
      personalizedCTA: settings.webPersonalizedCtaFr || 'Commencer une Création',
    },
    ar: {
      badge: settings.webBadgeAr || 'مجموعة جديدة',
      heroLine1: settings.webHeroLine1Ar || 'الأناقة',
      heroLine2: settings.webHeroLine2Ar || 'بالفضة الخالصة',
      heroDesc: settings.webHeroDescAr || 'اكتشف مجموعتنا الحصرية من المجوهرات الفضية الخالصة 950، المصممة للأرواح الأنيقة التي تقدر الجودة والحرفية الأصيلة.',
      cta1: settings.webCta1Ar || 'استكشف المجموعة',
      cta2: settings.webCta2Ar || 'تصميم خاص',
      featured: settings.webFeaturedTitleAr || 'منتجاتنا المميزة',
      viewAllCta: settings.webViewAllCtaAr || 'عرض كل المجموعة',
      storyTag: settings.webStoryTagAr || 'الحرفية',
      story: settings.webStoryTitleAr || 'صنعتنا',
      storyDesc: settings.webStoryDescAr || 'منذ أكثر من عقد، نصنع كل قطعة بشغف وخبرة، بالفضة الخالصة 950 المعتمدة، لإبراز أناقتك الطبيعية.',
      stat1Val: settings.webStat1Val || '10+',
      stat2Val: settings.webStat2Val || '950',
      stat3Val: settings.webStat3Val || '4.9',
      stat4Val: settings.webStat4Val || '48h',
      stat1: settings.webStat1LabelAr || 'سنوات خبرة',
      stat2: settings.webStat2LabelAr || 'نقاء الفضة',
      stat3: settings.webStat3LabelAr || 'تقييم العملاء',
      stat4: settings.webStat4LabelAr || 'وقت التسليم',
      trust1: settings.webBenefit1TitleAr || 'فضة معتمدة',
      trust1Desc: settings.webBenefit1DescAr || 'نقاء 950 مضمون مع شهادة أصالة',
      trust2: settings.webBenefit2TitleAr || 'التوصيل الوطني',
      trust2Desc: settings.webBenefit2DescAr || 'سريع إلى جميع ولايات الجزائر',
      trust3: settings.webBenefit3TitleAr || 'جودة ممتازة',
      trust3Desc: settings.webBenefit3DescAr || 'كل قطعة مفحوصة ومعتمدة قبل الشحن',
      trust4: settings.webBenefit4TitleAr || 'دعم مخصص',
      trust4Desc: settings.webBenefit4DescAr || 'مساعدة 7 أيام في الأسبوع لجميع استفساراتك',
      personalized: settings.webPersonalizedTitleAr || 'حول رؤيتك إلى حقيقة',
      personalizedDesc: settings.webPersonalizedDescAr || 'يقوم حرفاؤنا بإنشاء قطع فريدة وفقاً لرغباتك.',
      personalizedCTA: settings.webPersonalizedCtaAr || 'ابدأ الإنشاء',
    },
  }[lang];

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: tc.pageBg }}>
      <CinematicHero setCurrentPage={setCurrentPage} lang={lang} shouldReduce={shouldReduce} t={t} offers={offers} settings={settings} isDark={isDark} tc={tc} />
      <MarqueeTicker shouldReduce={shouldReduce} tc={tc} settings={settings} />
      <OfferCarouselSection offers={offers} shouldReduce={shouldReduce} t={t} setCurrentPage={setCurrentPage} isDark={isDark} tc={tc} />
      <StorySection t={t} isDark={isDark} tc={tc} />
      <BenefitsRow t={t} isDark={isDark} tc={tc} />
      <PersonalizedCTA t={t} setCurrentPage={setCurrentPage} isDark={isDark} tc={tc} />
    </div>
  );
};

export default LandingPage;
