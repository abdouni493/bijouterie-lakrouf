
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, Bell, User as UserIcon, Menu, Zap, CheckCircle, Sun, Moon } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const shouldReduce = useReducedMotion();

  const lowStock = silverTypes.filter(st => {
    const total = st.isCassie ? st.initialQuantity : (Object.values(st.shapes) as number[]).reduce((a, b) => a + b, 0);
    return total < st.initialQuantity * 0.25;
  });
  const pendingCmds = commands.filter(c => c.status === 'pending');
  const hasNotifications = lowStock.length > 0 || pendingCmds.length > 0;
  const notifCount = lowStock.length + pendingCmds.length;

  return (
    <header
      style={{
        height: 64,
        background: theme === 'dark' ? 'rgba(13,17,23,0.92)' : 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: theme === 'dark' ? '1px solid rgba(192,200,212,0.10)' : '1px solid rgba(201,168,76,0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      {/* Shimmer bottom line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(192,200,212,0.15) 30%, rgba(192,200,212,0.25) 50%, rgba(192,200,212,0.15) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleMobileMenu}
          className="btn-icon md:hidden"
          style={{ width: 40, height: 40 }}
          whileTap={shouldReduce ? {} : { scale: 0.9 }}
        >
          <Menu size={18} />
        </motion.button>

        <motion.div
          key={activeTab}
          initial={shouldReduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3"
        >
          {/* Silver diamond accent */}
          <div
            className="hidden sm:block"
            style={{
              width: 6, height: 6,
              background: 'linear-gradient(135deg, #C0C8D4, #8FA3B8)',
              transform: 'rotate(45deg)',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: theme === 'dark' ? '#F0F4F8' : '#5A4A3A', letterSpacing: '-0.03em', lineHeight: 1.2, margin: 0 }}>
              {t[activeTab as keyof typeof t] as string || activeTab}
            </h2>
            <p style={{ fontSize: 10, fontWeight: 600, color: theme === 'dark' ? 'rgba(192,200,212,0.4)' : 'rgba(201,168,76,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
              Espace de Gestion
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right: search + theme toggle + notif + user */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="hidden lg:flex" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: theme === 'dark' ? 'rgba(28,36,46,0.8)' : 'rgba(250,247,242,0.8)', 
          border: theme === 'dark' ? '1px solid rgba(192,200,212,0.12)' : '1px solid rgba(201,168,76,0.25)', 
          borderRadius: 12,
          padding: '0 16px', height: 38, width: 260, transition: 'all 0.2s',
        }}
          onFocus={() => {}}
        >
          <Search size={15} style={{ color: 'var(--silver-300)', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', width: '100%',
              fontFamily: 'inherit',
            }}
            onFocus={e => { const p = e.currentTarget.parentElement as HTMLElement; p.style.borderColor = 'rgba(192,200,212,0.35)'; p.style.boxShadow = '0 0 0 3px rgba(192,200,212,0.06)'; }}
            onBlur={e => { const p = e.currentTarget.parentElement as HTMLElement; p.style.borderColor = 'rgba(192,200,212,0.12)'; p.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          whileHover={shouldReduce ? {} : { scale: 1.05 }}
          whileTap={shouldReduce ? {} : { scale: 0.9 }}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: theme === 'dark'
              ? 'rgba(201,168,76,0.10)'
              : 'rgba(201,168,76,0.12)',
            border: theme === 'dark'
              ? '1px solid rgba(201,168,76,0.25)'
              : '1px solid rgba(201,168,76,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme === 'dark' ? 'var(--gold)' : '#C9A84C',
            cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.25s',
          }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.span
                key="sun"
                initial={shouldReduce ? {} : { opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={shouldReduce ? {} : { opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <Sun size={17} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={shouldReduce ? {} : { opacity: 0, rotate: 30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={shouldReduce ? {} : { opacity: 0, rotate: -30, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <Moon size={17} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification bell */}
        <div className="relative">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={shouldReduce ? {} : { scale: 1.05 }}
            whileTap={shouldReduce ? {} : { scale: 0.9 }}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: theme === 'dark' ? 'rgba(192,200,212,0.06)' : 'rgba(201,168,76,0.08)', 
              border: theme === 'dark' ? '1px solid rgba(192,200,212,0.10)' : '1px solid rgba(201,168,76,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme === 'dark' ? 'var(--silver-300)' : '#C9A84C', cursor: 'pointer', position: 'relative',
            }}
          >
            <Bell size={17} />
            {hasNotifications && (
              <motion.span
                animate={shouldReduce ? {} : { scale: [1, 1.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 8, height: 8,
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  border: '2px solid #0D1117',
                }}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', top: 48, right: 0, width: 300, zIndex: 100,
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Notifications {notifCount > 0 && `(${notifCount})`}
                    </span>
                    <button onClick={() => setShowNotifications(false)} style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Fermer
                    </button>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto', padding: '8px 12px' }}>
                    {lowStock.map((st, i) => (
                      <motion.div
                        key={st.id}
                        initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 8px', borderRadius: 12, background: 'rgba(192,200,212,0.04)', marginBottom: 4 }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,95,114,0.12)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Zap size={14} />
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
                        initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (lowStock.length + i) * 0.05 }}
                        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 8px', borderRadius: 12, background: 'rgba(201,168,76,0.06)', marginBottom: 4 }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckCircle size={14} />
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-100)', margin: 0 }}>Commande en attente</p>
                          <p style={{ fontSize: 11, color: 'var(--silver-300)', margin: 0 }}>{c.clientName}</p>
                        </div>
                      </motion.div>
                    ))}
                    {!hasNotifications && (
                      <div style={{ padding: '24px 0', textAlign: 'center' }}>
                        <CheckCircle size={28} style={{ color: 'var(--silver-400)', margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver-300)', margin: 0 }}>Aucune alerte</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: theme === 'dark' ? '1px solid var(--border)' : '1px solid rgba(201,168,76,0.25)', cursor: 'default' }}>
          <div className="hidden sm:block" style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: theme === 'dark' ? '#F0F4F8' : '#5A4A3A', margin: 0, lineHeight: 1.3 }}>{user?.username}</p>
            <span className={user?.role === 'admin' ? 'badge badge-platinum' : 'badge badge-info'} style={{ fontSize: 10, padding: '2px 8px', marginTop: 3 }}>
              {user?.role}
            </span>
          </div>
          <motion.div
            whileHover={shouldReduce ? {} : { scale: 1.05 }}
            style={{
              width: 40, height: 40,
              background: theme === 'dark' ? 'linear-gradient(135deg, rgba(192,200,212,0.15), rgba(90,107,125,0.2))' : 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.2))',
              border: theme === 'dark' ? '1px solid rgba(192,200,212,0.25)' : '1px solid rgba(201,168,76,0.30)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme === 'dark' ? 'var(--silver-200)' : '#C9A84C',
              clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
            }}
          >
            <UserIcon size={18} />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
