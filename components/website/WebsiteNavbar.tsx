import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShoppingCart, Menu, X, Globe, Lock, Sun, Moon } from 'lucide-react';
import { useApp } from '../../AppContext';
import { MESSIKA_PALETTE, MESSIKA_FONTS } from '../../utils/luxuryDesignSystem';

interface WebsiteNavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cartCount: number;
  lang: 'fr' | 'ar';
  setLang: (lang: 'fr' | 'ar') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const WebsiteNavbar: React.FC<WebsiteNavbarProps> = ({
  currentPage, setCurrentPage, cartCount, lang, setLang, theme, setTheme,
}) => {
  const { settings } = useApp();
  const isDark = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [cartPulsing, setCartPulsing] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount) {
      setCartPulsing(true);
      setTimeout(() => setCartPulsing(false), 800);
    }
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount]);

  // Theme-aware colors
  const navBg = scrolled
    ? (isDark ? 'rgba(10,10,10,0.92)' : 'rgba(250,248,245,0.96)')
    : 'rgba(0,0,0,0)';
  const navBorder = scrolled
    ? (isDark ? 'rgba(201,168,76,0.18)' : 'rgba(0,0,0,0.08)')
    : 'rgba(0,0,0,0)';
  const textColor = isDark ? MESSIKA_PALETTE.textSecondary : 'rgba(10,10,10,0.6)';
  const activeColor = MESSIKA_PALETTE.goldWarm;
  const logoColor = isDark ? MESSIKA_PALETTE.textPrimary : '#0A0A0A';
  const circleStyle: React.CSSProperties = {
    width: 52, height: 52, borderRadius: '50%',
    border: `2px solid ${isDark ? 'rgba(201,168,76,0.5)' : 'rgba(154,123,53,0.55)'}`,
    background: isDark ? 'rgba(201,168,76,0.07)' : 'rgba(154,123,53,0.07)',
    boxShadow: isDark
      ? '0 0 0 4px rgba(201,168,76,0.08)'
      : '0 0 0 4px rgba(154,123,53,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', flexShrink: 0,
  };

  const leftLinks = lang === 'fr'
    ? [{ id: 'offers', label: 'Nos Offres' }, { id: 'special', label: 'Promotions' }]
    : [{ id: 'offers', label: 'عروضنا' }, { id: 'special', label: 'التخفيضات' }];
  const rightLinks = lang === 'fr'
    ? [{ id: 'contacts', label: 'Contact' }]
    : [{ id: 'contacts', label: 'اتصل بنا' }];
  const allLinks = lang === 'fr'
    ? [{ id: 'home', label: 'Accueil' }, ...leftLinks, ...rightLinks]
    : [{ id: 'home', label: 'الرئيسية' }, ...leftLinks, ...rightLinks];

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: MESSIKA_FONTS.body, fontSize: '12px', fontWeight: 500,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: active ? activeColor : textColor,
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '6px 0', position: 'relative', transition: 'color 0.25s ease',
  });

  return (
    <>
      <motion.nav
        animate={shouldReduce ? {} : {
          backgroundColor: navBg,
          borderBottomColor: navBorder,
          height: scrolled ? 56 : 72,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          borderBottom: '1px solid transparent',
          backdropFilter: scrolled ? 'blur(40px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(40px)' : 'blur(0px)',
        }}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div style={{
          maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '100%',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '24px',
        }}>
          {/* LEFT */}
          <div className="hidden md:flex" style={{
            display: 'flex', alignItems: 'center', gap: '32px',
            justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start',
          }}>
            {leftLinks.map((link, i) => (
              <motion.button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                initial={shouldReduce ? {} : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.1 }}
                style={navLinkStyle(currentPage === link.id)}
                onMouseEnter={e => { if (currentPage !== link.id) (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#fff' : '#0A0A0A'; }}
                onMouseLeave={e => { if (currentPage !== link.id) (e.currentTarget as HTMLButtonElement).style.color = textColor; }}
              >
                {link.label}
                {currentPage === link.id && (
                  <motion.div layoutId="nav-underline" style={{
                    position: 'absolute', bottom: -2, left: 0, right: 0,
                    height: 2, background: activeColor,
                  }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
              </motion.button>
            ))}
          </div>

          {/* CENTER — logo in circle */}
          <motion.button
            onClick={() => setCurrentPage('home')}
            whileHover={shouldReduce ? {} : { scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            initial={shouldReduce ? {} : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'center', padding: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}
          >
            {/* Circle container */}
            <div style={circleStyle}>
              {settings?.logo ? (
                <img src={settings.logo} alt="logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span style={{
                  fontFamily: MESSIKA_FONTS.display, fontSize: '18px', fontWeight: 600,
                  color: MESSIKA_PALETTE.goldWarm, letterSpacing: '0.05em',
                }}>
                  {(settings?.storeName || 'B').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {!settings?.logo && (
              <span style={{
                fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(10px, 1.5vw, 14px)', fontWeight: 600,
                color: logoColor, letterSpacing: '0.3em', textTransform: 'uppercase', lineHeight: 1,
                whiteSpace: 'nowrap',
              }}>
                {settings?.storeName || 'BIJOUTERIE'}
              </span>
            )}
            {settings?.slogan && (
              <span style={{
                fontFamily: MESSIKA_FONTS.body, fontSize: '8px', fontWeight: 500,
                color: MESSIKA_PALETTE.goldWarm, letterSpacing: '0.22em', textTransform: 'uppercase',
              }}>
                {settings.slogan}
              </span>
            )}
          </motion.button>

          {/* RIGHT */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end',
          }}>
            {/* Contact link */}
            {rightLinks.map((link, i) => (
              <motion.button
                key={link.id}
                className="hidden md:block"
                onClick={() => setCurrentPage(link.id)}
                initial={shouldReduce ? {} : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
                style={navLinkStyle(currentPage === link.id)}
                onMouseEnter={e => { if (currentPage !== link.id) (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#fff' : '#0A0A0A'; }}
                onMouseLeave={e => { if (currentPage !== link.id) (e.currentTarget as HTMLButtonElement).style.color = textColor; }}
              >
                {link.label}
                {currentPage === link.id && (
                  <motion.div layoutId="nav-underline" style={{
                    position: 'absolute', bottom: -2, left: 0, right: 0, height: 2, background: activeColor,
                  }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
              </motion.button>
            ))}

            {/* Theme toggle — Sun/Moon */}
            <motion.button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              whileHover={shouldReduce ? {} : { scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              title={isDark ? 'Mode Clair' : 'Mode Sombre'}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.06)',
                border: isDark ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isDark ? MESSIKA_PALETTE.goldWarm : '#555',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
                    <Sun size={15} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ opacity: 0, rotate: 30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -30 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
                    <Moon size={15} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Language toggle */}
            <motion.button
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              whileHover={shouldReduce ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontWeight: 600, fontFamily: MESSIKA_FONTS.body,
                letterSpacing: '0.1em', color: isDark ? MESSIKA_PALETTE.textMuted : 'rgba(0,0,0,0.45)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'color 0.25s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = isDark ? '#fff' : '#0A0A0A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isDark ? MESSIKA_PALETTE.textMuted : 'rgba(0,0,0,0.45)'; }}
            >
              <Globe size={13} />
              <span className="hidden sm:inline">{lang === 'fr' ? 'عربي' : 'FR'}</span>
            </motion.button>

            {/* Cart */}
            <motion.button
              onClick={() => setCurrentPage('order')}
              whileHover={shouldReduce ? {} : { scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              style={{
                position: 'relative', width: 40, height: 40,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.09)',
                color: isDark ? MESSIKA_PALETTE.textSecondary : 'rgba(0,0,0,0.5)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease', borderRadius: '50%',
                animation: cartPulsing ? 'pulseGold 0.6s ease' : 'none',
              }}
            >
              <ShoppingCart size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={shouldReduce ? {} : { scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={shouldReduce ? {} : { scale: 0 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                    style={{
                      position: 'absolute', top: -6, right: -6,
                      width: 18, height: 18, background: MESSIKA_PALETTE.goldWarm,
                      color: '#0A0A0A', fontSize: '10px', fontWeight: 800,
                      fontFamily: MESSIKA_FONTS.body, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Admin */}
            <motion.button
              onClick={() => (window.location.href = window.location.pathname)}
              className="hidden lg:flex"
              whileHover={{ opacity: 0.6 }}
              style={{
                display: 'flex', alignItems: 'center',
                fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <Lock size={11} />
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              whileTap={{ scale: 0.9 }}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
                border: isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.09)',
                color: isDark ? MESSIKA_PALETTE.textSecondary : 'rgba(0,0,0,0.5)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                {menuOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="drawer-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 48 }}
            />
            <motion.div
              key="drawer"
              initial={shouldReduce ? { opacity: 0 } : { x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={shouldReduce ? { opacity: 0 } : { x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={{
                position: 'fixed', top: 0,
                [lang === 'ar' ? 'left' : 'right']: 0,
                width: 'min(300px, 85vw)', height: '100vh',
                background: isDark ? MESSIKA_PALETTE.obsidian : '#FAF8F5',
                borderLeft: lang === 'ar' ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}`,
                borderRight: lang === 'ar' ? `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}` : 'none',
                zIndex: 49, padding: '80px 32px 40px',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}
            >
              {/* Circle logo in drawer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{
                  ...circleStyle,
                  background: isDark ? 'rgba(201,168,76,0.08)' : 'rgba(154,123,53,0.08)',
                }}>
                  {settings?.logo
                    ? <img src={settings.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : <span style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '18px', fontWeight: 600, color: MESSIKA_PALETTE.goldWarm }}>
                        {(settings?.storeName || 'B').charAt(0).toUpperCase()}
                      </span>
                  }
                </div>
                <div style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '14px', fontWeight: 600, color: isDark ? '#fff' : '#0A0A0A', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {settings?.storeName || 'BIJOUTERIE'}
                </div>
              </div>

              {allLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={shouldReduce ? {} : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                  onClick={() => { setCurrentPage(link.id); setMenuOpen(false); }}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left',
                    padding: '14px 0',
                    fontFamily: MESSIKA_FONTS.body, fontSize: '13px', fontWeight: 500,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: currentPage === link.id ? MESSIKA_PALETTE.goldWarm : (isDark ? MESSIKA_PALETTE.textSecondary : 'rgba(0,0,0,0.6)'),
                    background: 'none', border: 'none',
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
                    cursor: 'pointer', width: '100%', transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '11px', fontWeight: 600, fontFamily: MESSIKA_FONTS.body,
                    color: isDark ? MESSIKA_PALETTE.textMuted : 'rgba(0,0,0,0.4)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  <Globe size={13} />
                  {lang === 'fr' ? 'عربي' : 'FR'}
                </button>
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '11px', fontWeight: 600, fontFamily: MESSIKA_FONTS.body,
                    color: isDark ? MESSIKA_PALETTE.textMuted : 'rgba(0,0,0,0.4)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  {isDark ? <Sun size={13} /> : <Moon size={13} />}
                  {isDark ? (lang === 'fr' ? 'Mode Clair' : 'فاتح') : (lang === 'fr' ? 'Mode Sombre' : 'داكن')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default WebsiteNavbar;
