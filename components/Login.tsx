
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../AppContext';
import { supabase } from '../supabase';
import { Lock, Mail, Gem, Globe, Eye, EyeOff, AlertCircle } from 'lucide-react';

type Mode = 'login';

const Login: React.FC = () => {
  const { setUser, language, workers, settings, theme } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme !== 'light';

  const [mode, setMode] = useState<Mode>('login');

  // Login
  const [loginId, setLoginId] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Try Supabase auth (works if loginId is an email)
    const isEmail = loginId.includes('@');
    if (isEmail) {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: loginId, password: loginPwd,
      });
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        const role = (meta.role as 'admin' | 'worker') || 'worker';
        const name = meta.name || meta.full_name || data.user.email || 'Utilisateur';
        setUser({ id: data.user.id, username: name, email: data.user.email!, role, language: 'fr' });
        setLoading(false);
        return;
      }
      if (authErr && !authErr.message.includes('Invalid')) {
        setError(authErr.message);
        setLoading(false);
        return;
      }
    }

    // Fallback: username + password from workers table
    const worker = workers.find(w => w.username === loginId && w.password === loginPwd);
    if (worker) {
      setUser({ id: worker.id, username: worker.fullName, email: '', role: 'worker', language: 'fr' });
      setLoading(false);
      return;
    }

    // Try Supabase with generated worker email pattern
    if (!isEmail) {
      const { data } = await supabase.auth.signInWithPassword({
        email: `${loginId}@bijouterie.app`, password: loginPwd,
      });
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        const role = (meta.role as 'admin' | 'worker') || 'worker';
        const name = meta.name || meta.full_name || loginId;
        setUser({ id: data.user.id, username: name, email: data.user.email!, role, language: 'fr' });
        setLoading(false);
        return;
      }
    }

    setError(language === 'ar' ? 'خطأ في البريد أو كلمة السر' : 'Identifiants invalides. Veuillez réessayer.');
    setLoading(false);
  };

  const storeLogo = settings.logo;
  const storeName = settings.storeName || 'Bijouterie';
  const storeSlogan = settings.slogan || 'Élégance en argent';

  const panelBg = 'linear-gradient(145deg, #0A0F1A 0%, #0F1722 60%, #111827 100%)';
  const formBg = isDark ? 'rgba(20,27,38,0.75)' : '#FFFFFF';
  const formBorder = isDark ? '1px solid rgba(148,163,184,0.12)' : '1px solid rgba(100,116,139,0.14)';
  const fieldBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const fieldBorder = isDark ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(100,116,139,0.18)';
  const textPrimary = isDark ? '#E2E8F0' : '#0F172A';
  const textMuted = isDark ? 'rgba(148,163,184,0.55)' : 'rgba(71,85,105,0.6)';
  const gold = '#C9A84C';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px 11px 40px',
    fontFamily: 'inherit', fontSize: 14,
    background: fieldBg, border: fieldBorder,
    borderRadius: 10, color: textPrimary,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: textMuted,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    display: 'block', marginBottom: 6,
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      style={{ minHeight: '100vh', display: 'flex', background: isDark ? '#080C12' : '#F1F5F9' }}
    >
      {/* ── Left brand panel ── */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col items-center justify-center"
        style={{ width: '44%', background: panelBg, position: 'relative', overflow: 'hidden' }}
      >
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '-8%', left: '-8%', width: 320, height: 320, background: 'rgba(201,168,76,0.05)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-8%', right: '-8%', width: 280, height: 280, background: 'rgba(90,107,125,0.06)', borderRadius: '50%', filter: 'blur(70px)' }} />

        <div className="relative z-10 flex flex-col items-center text-center px-10" style={{ gap: 0 }}>
          {/* Logo circle */}
          <motion.div
            animate={shouldReduce ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', marginBottom: 28 }}
          >
            <div style={{
              position: 'absolute', inset: -3,
              borderRadius: '50%',
              background: `conic-gradient(${gold}, rgba(201,168,76,0.2), ${gold})`,
              opacity: 0.5,
            }} />
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              border: `2px solid ${gold}`,
              background: storeLogo ? 'transparent' : 'rgba(201,168,76,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
              boxShadow: `0 0 0 4px rgba(201,168,76,0.12)`,
            }}>
              {storeLogo ? (
                <img src={storeLogo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <Gem size={38} style={{ color: gold }} />
              )}
            </div>
          </motion.div>

          <motion.h1
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{
              fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {storeName}
          </motion.h1>

          <motion.p
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ fontSize: 10, fontWeight: 700, color: gold, textTransform: 'uppercase', letterSpacing: '0.22em', margin: '10px 0 24px' }}
          >
            {storeSlogan}
          </motion.p>

          <motion.div
            initial={shouldReduce ? false : { width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            style={{ height: 2, background: `linear-gradient(90deg, ${gold}, rgba(201,168,76,0.3))`, borderRadius: 99, marginBottom: 28 }}
          />

          <motion.p
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ fontSize: 13, color: 'rgba(192,200,212,0.45)', fontStyle: 'italic', maxWidth: 220, lineHeight: 1.7, marginBottom: 36 }}
          >
            Gérez votre bijouterie avec élégance et précision
          </motion.p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 220 }}>
            {['Gestion des Stocks', 'Ventes & Facturation', 'Site Web Intégré'].map((f, i) => (
              <motion.div
                key={f}
                initial={shouldReduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.08 }}
                style={{
                  background: 'rgba(201,168,76,0.06)', borderRadius: 99,
                  padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: gold, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(192,200,212,0.65)', fontWeight: 600 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
        background: isDark ? '#080C12' : '#F1F5F9',
        position: 'relative',
      }}>
        {/* Mobile logo */}
        <div className="md:hidden flex flex-col items-center mb-8">
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: `2px solid ${gold}`, overflow: 'hidden',
            background: storeLogo ? 'transparent' : 'rgba(201,168,76,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            {storeLogo
              ? <img src={storeLogo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <Gem size={28} style={{ color: gold }} />}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: textPrimary, margin: 0 }}>{storeName}</h1>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              style={{ width: '100%', maxWidth: 420 }}
            >
              {/* Login card */}
              <div style={{
                background: formBg, border: formBorder, borderRadius: 22,
                padding: 40, backdropFilter: isDark ? 'blur(20px)' : undefined,
                boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)',
              }}>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: gold, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                    ESPACE ADMINISTRATION
                  </p>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: textPrimary, letterSpacing: '-0.03em', margin: 0 }}>Connexion</h2>
                  <div style={{ marginTop: 10, width: 32, height: 3, background: `linear-gradient(90deg, ${gold}, rgba(201,168,76,0.3))`, borderRadius: 99 }} />
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>{language === 'ar' ? 'البريد / اسم المستخدم' : 'Email ou identifiant'}</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }} />
                      <input
                        type="text"
                        value={loginId}
                        onChange={e => setLoginId(e.target.value)}
                        placeholder="admin@exemple.com"
                        style={inputStyle}
                        autoComplete="username"
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = gold; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.18)'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>{language === 'ar' ? 'كلمة السر' : 'Mot de passe'}</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }} />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={loginPwd}
                        onChange={e => setLoginPwd(e.target.value)}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: 44 }}
                        autoComplete="current-password"
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = gold; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.18)'; }}
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: textMuted, cursor: 'pointer', padding: 4, display: 'flex' }}>
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <p style={{ fontSize: 13, color: '#ef4444', margin: 0, fontWeight: 500 }}>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={shouldReduce ? {} : { scale: 1.015 }}
                    whileTap={shouldReduce ? {} : { scale: 0.975 }}
                    style={{
                      height: 48, borderRadius: 11, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                      background: `linear-gradient(135deg, ${gold} 0%, #B8952E 100%)`,
                      color: '#0A0A0A', fontSize: 14, fontWeight: 800,
                      letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s',
                    }}
                  >
                    {loading ? (
                      <><div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#0A0A0A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Connexion...</>
                    ) : (language === 'ar' ? 'دخول' : 'Se connecter')}
                  </motion.button>
                </form>
              </div>

              {/* View website */}
              <button
                type="button"
                onClick={() => window.location.href = '?view=shop'}
                style={{
                  marginTop: 12, width: '100%', height: 44, borderRadius: 11,
                  border: isDark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(100,116,139,0.2)',
                  background: 'transparent', color: isDark ? 'rgba(192,200,212,0.7)' : 'rgba(71,85,105,0.75)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                <Globe size={15} /> Voir le site web
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ marginTop: 28, fontSize: 10, fontWeight: 700, color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
          Système de Gestion Propriétaire © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
