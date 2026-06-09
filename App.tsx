
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './AppContext';
import { translations } from './translations';
import { pageVariants, pageTransition } from './animations/config';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Suppliers from './components/Suppliers';
import Purchases from './components/Purchases';
import CassiePurchases from './components/CassiePurchases';
import POS from './components/POS';
import SellingInvoices from './components/SellingInvoices';
import Workshops from './components/Workshops';
import Deliveries from './components/Deliveries';
import Commands from './components/Commands';
import Workers from './components/Workers';
import MyPayroll from './components/MyPayroll';
import StoreExpenses from './components/StoreExpenses';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Shapes from './components/Shapes';
import Debts from './components/Debts';
import Replacements from './components/Replacements';
import Clients from './components/Clients';
import StoreCash from './components/StoreCash';
import WebsiteManagement from './components/WebsiteManagement';
import WebsiteOrders from './components/WebsiteOrders';
import WebsitePublic from './components/website/WebsitePublic';

const isPublicSite = (): boolean =>
  window.location.pathname.startsWith('/shop') || window.location.search.includes('view=shop');

const MainLayout: React.FC = () => {
  const { user, language, isLoading } = useApp();

  // ── All hooks before any early return ──────────────────────
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('activeTab');
    return saved || 'dashboard';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('isSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('isSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  // ────────────────────────────────────────────────────────────

  const isRTL = language === 'ar';

  if (isLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--deep-bg)', color: 'var(--gold-primary)',
        gap: '16px', fontFamily: 'inherit',
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(201,168,76,0.2)',
          borderTopColor: '#C9A84C', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '13px', letterSpacing: '0.1em', opacity: 0.7 }}>Chargement…</span>
      </div>
    );
  }

  if (isPublicSite()) return <WebsitePublic />;
  if (!user) return <Login />;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':          return <Clients />;
      case 'dashboard':        return <Dashboard />;
      case 'replacements':     return <Replacements />;
      case 'inventory':        return <Inventory />;
      case 'suppliers':        return <Suppliers />;
      case 'purchases':        return <Purchases />;
      case 'cassiePurchases':  return <CassiePurchases />;
      case 'pos':              return <POS />;
      case 'sellingInvoices':  return <SellingInvoices />;
      case 'workshops':        return <Workshops />;
      case 'deliveries':       return <Deliveries />;
      case 'commands':         return <Commands />;
      case 'workers':          return <Workers />;
      case 'myPayroll':        return <MyPayroll />;
      case 'storeExpenses':    return <StoreExpenses />;
      case 'storeCash':        return <StoreCash />;
      case 'debts':            return <Debts />;
      case 'reports':          return <Reports />;
      case 'settings':         return <Settings />;
      case 'shapes':           return <Shapes />;
      case 'websiteManagement':return <WebsiteManagement />;
      case 'websiteOrders':    return <WebsiteOrders />;
      default:                 return <Dashboard />;
    }
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: isRTL ? 'row-reverse' : 'row',
        overflow: 'hidden',
        background: 'var(--deep-bg)',
      }}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
            }}
            className="md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — pinned in flex flow on desktop, fixed overlay on mobile */}
      <div
        style={{ flexShrink: 0, height: '100%', zIndex: 50, position: 'relative' }}
        className="hidden md:block"
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile sidebar (fixed slide-in) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [isRTL ? 'right' : 'left']: 0,
          zIndex: 50,
          transform: isMobileMenuOpen
            ? 'translateX(0)'
            : isRTL ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="md:hidden"
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isCollapsed={false}
          setIsCollapsed={() => {}}
        />
      </div>

      {/* Main content — independent scroll */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header
          activeTab={activeTab}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--deep-bg)',
            padding: 'clamp(16px, 3vw, 32px)',
          }}
        >
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <MainLayout />
  </AppProvider>
);

export default App;
