import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../../AppContext';
import { Search, X, LayoutGrid, Grid3x3 } from 'lucide-react';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_GRADIENTS,
  MESSIKA_SPACING,
  getThemeColors,
} from '../../utils/luxuryDesignSystem';
import { ProductCard, FloatingParticles } from './LuxuryComponents';
import ProductDetailModal from './ProductDetailModal';

interface OffersPageProps {
  lang: 'fr' | 'ar';
  cart: any[];
  setCart: (cart: any[]) => void;
  setCurrentPage: (page: string) => void;
  theme?: 'light' | 'dark';
}

type SortKey = 'default' | 'price_asc' | 'price_desc';

const OffersPage: React.FC<OffersPageProps> = ({ lang, cart, setCart, theme = 'dark' }) => {
  const { webOffers } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [cols, setCols] = useState<2 | 3>(3);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addedModalId, setAddedModalId] = useState<string | null>(null);

  const t = lang === 'fr' ? {
    breadcrumb: 'Accueil',
    title: 'Collection Argent',
    searchPlaceholder: 'Rechercher une création…',
    sortDefault: 'Nouveau',
    sortAsc: 'Prix ↑',
    sortDesc: 'Prix ↓',
    results: 'Articles',
    emptyTitle: 'Aucune création ne correspond',
    emptyDesc: 'Essayez une commande personnalisée',
    emptyCTA: 'Commande sur mesure',
    subtitle: 'Argent 950 Massif',
  } : {
    breadcrumb: 'الرئيسية',
    title: 'مجموعة الفضة',
    searchPlaceholder: 'ابحث عن إبداع…',
    sortDefault: 'الأحدث',
    sortAsc: 'السعر ↑',
    sortDesc: 'السعر ↓',
    results: 'منتج',
    emptyTitle: 'لم نجد ما يطابق',
    emptyDesc: 'جرب طلباً مخصصاً',
    emptyCTA: 'طلب مخصص',
    subtitle: 'فضة خالصة 950',
  };

  const filtered = useMemo(() => {
    let list = webOffers.filter(o => !o.isHidden && o.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price_asc') list = [...list].sort((a, b) => (a.unitPrice ?? Infinity) - (b.unitPrice ?? Infinity));
    if (sort === 'price_desc') list = [...list].sort((a, b) => (b.unitPrice ?? -Infinity) - (a.unitPrice ?? -Infinity));
    return list;
  }, [webOffers, search, sort]);

  const addToCart = useCallback((offer: any) => {
    const existing = cart.find((ci: any) => ci.offer.id === offer.id);
    if (existing) {
      setCart(cart.map((ci: any) => ci.offer.id === offer.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      setCart([...cart, { offer, quantity: 1 }]);
    }
    setAddedIds(prev => new Set([...prev, offer.id]));
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(offer.id); return n; });
    }, 1800);
  }, [cart, setCart]);

  const addToCartFromModal = useCallback((offer: any) => {
    addToCart(offer);
    setAddedModalId(offer.id);
    setTimeout(() => setAddedModalId(null), 1800);
  }, [addToCart]);

  const openModal = (offer: any) => {
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedOffer(null), 400);
  };

  const gridCols = {
    2: 'repeat(2, 1fr)',
    3: 'repeat(3, 1fr)',
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: tc.pageBg,
        paddingTop: '72px',
      }}
    >
      {isDark && <FloatingParticles count={6} size="sm" />}

      {/* Page header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: `${MESSIKA_SPACING['3xl']} 48px ${MESSIKA_SPACING.xl}`,
        position: 'relative',
        zIndex: 5,
      }}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: MESSIKA_FONTS.body, fontSize: '13px',
            color: tc.textMuted, marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <span>{t.breadcrumb}</span>
          <span style={{ color: tc.cardBorder }}>›</span>
          <span style={{ color: tc.goldAccent }}>{lang === 'fr' ? 'Nos Offres' : 'عروضنا'}</span>
        </motion.div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h1 style={{
              fontFamily: MESSIKA_FONTS.display,
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 400,
              color: tc.textPrimary,
              margin: 0,
              lineHeight: 1.1,
            }}>
              {t.title}
            </h1>
            <AnimatePresence mode="wait">
              <motion.div
                key={filtered.length}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                style={{
                  fontFamily: MESSIKA_FONTS.body, fontSize: '13px',
                  color: tc.goldAccent, marginTop: '8px',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}
              >
                {filtered.length} {t.results}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Sort + Grid toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {(['default', 'price_asc', 'price_desc'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                style={{
                  padding: '6px 14px',
                  fontFamily: MESSIKA_FONTS.body, fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  background: sort === key ? tc.sortActiveBg : 'transparent',
                  border: `1px solid ${sort === key ? tc.sortActiveBorder : tc.sortInactiveBorder}`,
                  color: sort === key ? tc.goldAccent : tc.textMuted,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {key === 'default' ? t.sortDefault : key === 'price_asc' ? t.sortAsc : t.sortDesc}
              </button>
            ))}

            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

            <button
              onClick={() => setCols(2)}
              title="2 colonnes"
              style={{
                padding: '6px 8px', background: cols === 2 ? tc.sortActiveBg : 'transparent',
                border: `1px solid ${cols === 2 ? tc.sortActiveBorder : tc.sortInactiveBorder}`,
                color: cols === 2 ? tc.goldAccent : tc.textMuted,
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setCols(3)}
              title="3 colonnes"
              style={{
                padding: '6px 8px', background: cols === 3 ? tc.sortActiveBg : 'transparent',
                border: `1px solid ${cols === 3 ? tc.sortActiveBorder : tc.sortInactiveBorder}`,
                color: cols === 3 ? tc.goldAccent : tc.textMuted,
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <Grid3x3 size={14} />
            </button>
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: MESSIKA_GRADIENTS.sectionDivider, margin: '24px 0' }} />
      </div>

      {/* Sticky search bar */}
      <div style={{
        position: 'sticky',
        top: '56px',
        zIndex: 40,
        background: tc.stickyBg,
        borderBottom: `1px solid ${tc.rowBorder}`,
        padding: '12px 0',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <Search size={16} style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: MESSIKA_PALETTE.goldWarm, pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 40px 11px 40px',
                fontFamily: MESSIKA_FONTS.body,
                fontSize: '13px',
                background: tc.inputBg,
                border: `1px solid ${tc.inputBorder}`,
                color: tc.inputColor,
                outline: 'none',
                transition: 'border-color 0.25s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = tc.inputFocusBorder; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = tc.inputBorder; }}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: MESSIKA_PALETTE.textMuted, cursor: 'pointer', padding: '2px',
                  }}
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${MESSIKA_SPACING.xl} 48px ${MESSIKA_SPACING['5xl']}`, position: 'relative', zIndex: 5 }}>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: `${MESSIKA_SPACING['5xl']} 0` }}
          >
            <motion.div
              animate={shouldReduce ? {} : { scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: '72px', marginBottom: '24px' }}
            >
              💎
            </motion.div>
            <h3 style={{
              fontFamily: MESSIKA_FONTS.display, fontSize: '28px', fontWeight: 400,
              color: tc.textPrimary, marginBottom: '12px',
            }}>
              {t.emptyTitle}
            </h3>
            <p style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '14px', color: tc.textMuted, marginBottom: '28px' }}>
              {t.emptyDesc}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: gridCols[cols],
              gap: '2px',
            }}
            className="offers-grid"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((offer, idx) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                >
                  <ProductCard
                    image={offer.image}
                    title={offer.name}
                    subtitle={t.subtitle}
                    price={offer.unitPrice ? `${offer.unitPrice.toLocaleString('fr-DZ')} DA` : undefined}
                    onAddToCart={() => addToCart(offer)}
                    onViewDetails={() => openModal(offer)}
                    isAdded={addedIds.has(offer.id)}
                    delay={0}
                    lang={lang}
                    theme={theme}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 1024px) {
          .offers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .offers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Modal */}
      <ProductDetailModal
        offer={selectedOffer}
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

export default OffersPage;
