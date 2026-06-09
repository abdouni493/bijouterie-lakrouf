
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import WebsiteNavbar from './WebsiteNavbar';
import LandingPage from './LandingPage';
import OffersPage from './OffersPage';
import SpecialOffersPage from './SpecialOffersPage';
import ContactsPage from './ContactsPage';
import OrderPage from './OrderPage';
import PersonalizedOrderPage from './PersonalizedOrderPage';
import ThankYouPage from './ThankYouPage';
import { GlobalStyles } from './LuxuryComponents';
import { MESSIKA_PALETTE, MESSIKA_FONTS, MESSIKA_GRADIENTS } from '../../utils/luxuryDesignSystem';

interface CartItem {
  offer: any;
  quantity: number;
  isSpecial?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };

const WebsitePublic: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('websiteCurrentPage') || 'home' : 'home'
  );
  const [lang, setLang] = useState<'fr' | 'ar'>('fr');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrderId, setLastOrderId] = useState('');
  const [websiteTheme, setWebsiteTheme] = useState<'light' | 'dark'>('dark');
  const [showCartBar, setShowCartBar] = useState(false);
  const isDark = websiteTheme === 'dark';

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('websiteCurrentPage', currentPage);
  }, [currentPage]);

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  // Delay cart bar appearance so it doesn't flash on first render
  useEffect(() => {
    const t = setTimeout(() => setShowCartBar(cartCount > 0 && currentPage !== 'order'), 200);
    return () => clearTimeout(t);
  }, [cartCount, currentPage]);

  const pageBg = isDark ? '#0A0A0A' : '#FAF8F5';

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <LandingPage setCurrentPage={setCurrentPage} lang={lang} theme={websiteTheme} />;
      case 'offers': return <OffersPage lang={lang} cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} theme={websiteTheme} />;
      case 'special': return <SpecialOffersPage lang={lang} cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} theme={websiteTheme} />;
      case 'contacts': return <ContactsPage lang={lang} theme={websiteTheme} />;
      case 'order': return <OrderPage lang={lang} cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} setLastOrderId={setLastOrderId} theme={websiteTheme} />;
      case 'personalized': return <PersonalizedOrderPage lang={lang} setCurrentPage={setCurrentPage} setLastOrderId={setLastOrderId} theme={websiteTheme} />;
      case 'thankyou': return <ThankYouPage lang={lang} setCurrentPage={setCurrentPage} lastOrderId={lastOrderId} theme={websiteTheme} />;
      default: return <LandingPage setCurrentPage={setCurrentPage} lang={lang} theme={websiteTheme} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: MESSIKA_FONTS.body, transition: 'background 0.4s ease' }}>
      <GlobalStyles />
      <WebsiteNavbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={cartCount}
        lang={lang}
        setLang={setLang}
        theme={websiteTheme}
        setTheme={setWebsiteTheme}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Sticky cart button — appears at bottom when cart has items */}
      <AnimatePresence>
        {showCartBar && (
          <motion.div
            key="cart-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 90,
            }}
          >
            <motion.button
              onClick={() => setCurrentPage('order')}
              whileHover={{ scale: 1.04, boxShadow: '0 12px 48px rgba(201,168,76,0.5)' }}
              whileTap={{ scale: 0.97 }}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 28px',
                background: MESSIKA_GRADIENTS.goldBtn,
                border: 'none', borderRadius: '9999px',
                boxShadow: '0 8px 32px rgba(201,168,76,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                cursor: 'pointer', color: '#0A0A0A',
                fontFamily: MESSIKA_FONTS.body, fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <ShoppingCart size={18} />
              <span>
                {lang === 'fr' ? 'Voir mon panier' : 'عرض السلة'}
                {' '}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.2)', fontSize: '11px', fontWeight: 900,
                }}>
                  {cartCount}
                </span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WebsitePublic;
