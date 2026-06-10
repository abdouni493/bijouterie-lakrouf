
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bell, User as UserIcon, Menu, Zap, CheckCircle, Sun, Moon } from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

interface HeaderProps {
  activeTab: string;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, toggleSidebar, toggleMobileMenu }) => {
  const { user, language, commands, silverTypes, theme, setTheme } = useApp();
  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';

  const lowStock = silverTypes.filter(st => {
    const total = st.isCassie
      ? st.initialQuantity
      : (Object.values(st.shapes) as number[]).reduce((a, b) => a + b, 0);
    return total < st.initialQuantity * 0.25;
  });
  const pendingCmds = commands.filter(c => c.status === 'pending');
  const hasNotifications = lowStock.length > 0 || pendingCmds.length > 0;
  const notifCount = lowStock.length + pendingCmds.length;

  return (
    <header
      style={{
        height: 56,
        background: isDark ? 'rgba(13,17,23,0.96)' : 'rgba(250,247,242,0.97)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: isDark
          ? '1px solid rgba(192,200,212,0.10)'
          : '1px solid rgba(201,168,76,0.22)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '0 clamp(12px, 4vw, 28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        overflow: 'hidden',
      }}
    >
      {/* Animated bottom shimmer */}
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, width: '40%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Left: hamburger (mobile) + animated page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        <motion.button
          onClick={toggleMobileMenu}
          className="md:hidden"
          whileTap={shouldReduce ? {} : { scale: 0.88 }}
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: isDark ? 'rgba(192,200,212,0.07)' : 'rgba(201,168,76,0.09)',
            border: isDark ? '1px solid rgba(192,200,212,0.12)' : '1px solid rgba(201,168,76,0.22)',
            color: isDark ? 'rgba(192,200,212,0.7)' : '#C9A84C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={17} />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduce ? false : { opacity: 0, y: -10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduce ? {} : { opacity: 0, y: 8, filter: 'blur(4px)' }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
          >
            {/* Gold diamond accent */}
            <div
              className="hidden sm:block"
              style={{
                width: 5, height: 5, flexShrink: 0,
                background: isDark
                  ? 'linear-gradient(135deg, #C0C8D4, #8FA3B8)'
                  : 'linear-gradient(135deg, #C9A84C, #E0C060)',
                transform: 'rotate(45deg)',
                borderRadius: 1,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <h2 style={{
                fontSize: 'clamp(14px,3.5vw,17px)', fontWeight: 800, margin: 0, lineHeight: 1.2,
                color: isDark ? '#F0F4F8' : '#5A4A3A', letterSpacing: '-0.025em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {t[activeTab as keyof typeof t] as string || activeTab}
              </h2>
              <p
                className="hidden sm:block"
                style={{
                  fontSize: 9, fontWeight: 600, margin: 0,
                  color: isDark ? 'rgba(192,200,212,0.35)' : 'rgba(201,168,76,0.55)',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}
              >
                Espace de Gestion
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: theme toggle + notification bell + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

        {/* Theme toggle */}
        <motion.button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          whileHover={shouldReduce ? {} : { scale: 1.06 }}
          whileTap={shouldReduce ? {} : { scale: 0.88 }}
          title={isDark ? 'Mode clair' : 'Mode sombre'}
          style={{
            width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
            background: isDark ? 'rgba(201,168,76,0.10)' : 'rgba(201,168,76,0.11)',
            border: isDark ? '1px solid rgba(201,168,76,0.22)' : '1px solid rgba(201,168,76,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isDark ? '#C9A84C' : '#C9A84C',
          }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.span
                key="sun"
                initial={shouldReduce ? {} : { opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={shouldReduce ? {} : { opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex' }}
              >
                <Sun size={15} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={shouldReduce ? {} : { opacity: 0, rotate: 45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={shouldReduce ? {} : { opacity: 0, rotate: -45, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex' }}
              >
                <Moon size={15} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={shouldReduce ? {} : { scale: 1.06 }}
            whileTap={shouldReduce ? {} : { scale: 0.88 }}
            style={{
              width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
              background: isDark ? 'rgba(192,200,212,0.05)' : 'rgba(201,168,76,0.07)',
              border: isDark ? '1px solid rgba(192,200,212,0.10)' : '1px solid rgba(201,168,76,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDark ? 'rgba(192,200,212,0.6)' : '#C9A84C',
              position: 'relative',
            }}
          >
            <Bell size={15} />
            {hasNotifications && (
              <motion.span
                animate={shouldReduce ? {} : { scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{
                  position: 'absolute', top: 7, right: 7,
                  width: 7, height: 7,
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  border: isDark ? '2px solid #0D1117' : '2px solid #FAF7F2',
                }}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={shouldReduce ? {} : { opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduce ? {} : { opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', top: 44, right: 0, width: 300, zIndex: 100,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <div style={{
                    padding: '14px 18px 12px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--silver-300)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Notifications {notifCount > 0 && `(${notifCount})`}
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Fermer
                    </button>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto', padding: '8px 10px' }}>
                    {lowStock.map((st, i) => (
                      <motion.div
                        key={st.id}
                        initial={shouldReduce ? {} : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 8px', borderRadius: 10, background: 'rgba(255,95,114,0.04)', marginBottom: 3 }}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,95,114,0.12)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Zap size={13} />
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-100)', margin: 0 }}>Stock bas: {st.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--silver-300)', margin: 0 }}>Réapprovisionnement requis</p>
                        </div>
                      </motion.div>
                    ))}
                    {pendingCmds.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={shouldReduce ? {} : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (lowStock.length + i) * 0.04 }}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 8px', borderRadius: 10, background: 'rgba(201,168,76,0.05)', marginBottom: 3 }}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckCircle size={13} />
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-100)', margin: 0 }}>Commande en attente</p>
                          <p style={{ fontSize: 11, color: 'var(--silver-300)', margin: 0 }}>{c.clientName}</p>
                        </div>
                      </motion.div>
                    ))}
                    {!hasNotifications && (
                      <div style={{ padding: '22px 0', textAlign: 'center' }}>
                        <CheckCircle size={26} style={{ color: 'var(--silver-400)', margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver-300)', margin: 0 }}>Aucune alerte</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            gap: 8, paddingLeft: 10,
            borderLeft: isDark ? '1px solid rgba(192,200,212,0.10)' : '1px solid rgba(201,168,76,0.20)',
          }}
        >
          <div className="hidden sm:block" style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F0F4F8' : '#5A4A3A', margin: 0, lineHeight: 1.3 }}>
              {user?.username}
            </p>
            <span
              className={user?.role === 'admin' ? 'badge badge-platinum' : 'badge badge-info'}
              style={{ fontSize: 9, padding: '1px 6px', marginTop: 2, display: 'inline-block' }}
            >
              {user?.role}
            </span>
          </div>
          <motion.div
            whileHover={shouldReduce ? {} : { scale: 1.06 }}
            whileTap={shouldReduce ? {} : { scale: 0.92 }}
            style={{
              width: 34, height: 34,
              background: isDark
                ? 'linear-gradient(135deg, rgba(192,200,212,0.12), rgba(90,107,125,0.18))'
                : 'linear-gradient(135deg, rgba(201,168,76,0.13), rgba(201,168,76,0.18))',
              border: isDark ? '1px solid rgba(192,200,212,0.22)' : '1px solid rgba(201,168,76,0.28)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDark ? 'var(--silver-200)' : '#C9A84C',
              cursor: 'default',
              clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
            }}
          >
            <UserIcon size={15} />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
