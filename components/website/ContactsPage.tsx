/**
 * Luxury Contact Page - Premium Concierge Experience
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApp } from '../../AppContext';
import { Mail, Phone as PhoneIcon, MapPin, ExternalLink } from 'lucide-react';
import {
  LUXURY_PALETTE,
  LUXURY_SPACING,
  LUXURY_BORDER_RADIUS,
  LUXURY_SHADOWS,
  LUXURY_GRADIENTS,
} from '../../utils/luxuryDesignSystem';
import { GlassmorphicContainer, FloatingParticles, PremiumHeading, PremiumSubheading, PremiumButton } from './LuxuryComponents';

interface ContactsPageProps {
  lang: 'fr' | 'ar';
  theme?: 'light' | 'dark';
}

const ContactsPage: React.FC<ContactsPageProps> = ({ lang, theme = 'light' }) => {
  const { webContacts } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';

  const t = {
    fr: {
      title: 'Nous Contactez',
      subtitle: 'Notre équipe de concierge premium est disponible pour vous servir',
      directContact: 'Contact Direct',
      followUs: 'Nous Suivre',
      hours: 'Disponible 24h/24, 7j/7',
      email: 'Email',
      phone: 'Téléphone',
      visit: 'Visitez-nous',
    },
    ar: {
      title: 'تواصل معنا',
      subtitle: 'فريق الكونسيرج المتميز لدينا متاح لخدمتك',
      directContact: 'التواصل المباشر',
      followUs: 'تابعنا',
      hours: 'متاح 24/7',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      visit: 'زورنا',
    },
  }[lang];

  const socials = [
    { label: 'Facebook', icon: '📘', url: webContacts?.facebook },
    { label: 'Instagram', icon: '📸', url: webContacts?.instagram },
    { label: 'TikTok', icon: '🎵', url: webContacts?.tiktok },
    { label: 'WhatsApp', icon: '💬', url: webContacts?.whatsapp ? `https://wa.me/${webContacts.whatsapp.replace(/\D/g, '')}` : undefined },
  ].filter(s => s.url);

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        background: isDark ? LUXURY_GRADIENTS.darkBg : LUXURY_GRADIENTS.lightBg,
        paddingTop: '120px',
        paddingBottom: LUXURY_SPACING['5xl'],
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <FloatingParticles count={10} isDark={isDark} size="md" />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${LUXURY_SPACING['3xl']}`,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: LUXURY_SPACING['5xl'],
          }}
        >
          <PremiumHeading level={1} isDark={isDark} gradient>
            {t.title}
          </PremiumHeading>
          <PremiumSubheading isDark={isDark}>{t.subtitle}</PremiumSubheading>
        </motion.div>

        {/* Contact Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: LUXURY_SPACING['3xl'],
            marginBottom: LUXURY_SPACING['5xl'],
          }}
        >
          {/* Direct Contact Card */}
          {(webContacts?.email || webContacts?.phone) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <GlassmorphicContainer isDark={isDark} intensity="heavy">
                <div style={{ padding: LUXURY_SPACING['3xl'] }}>
                  <div
                    style={{
                      fontSize: '40px',
                      marginBottom: LUXURY_SPACING.lg,
                    }}
                  >
                    📞
                  </div>

                  <h3
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      marginBottom: LUXURY_SPACING.lg,
                      color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                    }}
                  >
                    {t.directContact}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: LUXURY_SPACING.lg }}>
                    {webContacts?.phone && (
                      <a
                        href={`tel:${webContacts.phone}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: LUXURY_SPACING.md,
                          textDecoration: 'none',
                          padding: LUXURY_SPACING.lg,
                          borderRadius: LUXURY_BORDER_RADIUS.md,
                          background: isDark
                            ? 'rgba(201, 168, 76, 0.1)'
                            : 'rgba(201, 168, 76, 0.05)',
                          border: '1px solid rgba(201, 168, 76, 0.2)',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isDark
                            ? 'rgba(201, 168, 76, 0.15)'
                            : 'rgba(201, 168, 76, 0.1)';
                          (e.currentTarget as HTMLElement).style.boxShadow = LUXURY_SHADOWS.gold;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isDark
                            ? 'rgba(201, 168, 76, 0.1)'
                            : 'rgba(201, 168, 76, 0.05)';
                        }}
                      >
                        <PhoneIcon size={20} style={{ color: '#C9A84C' }} />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#C9A84C', textTransform: 'uppercase' }}>
                            {t.phone}
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                            }}
                          >
                            {webContacts.phone}
                          </div>
                        </div>
                      </a>
                    )}

                    {webContacts?.email && (
                      <a
                        href={`mailto:${webContacts.email}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: LUXURY_SPACING.md,
                          textDecoration: 'none',
                          padding: LUXURY_SPACING.lg,
                          borderRadius: LUXURY_BORDER_RADIUS.md,
                          background: isDark
                            ? 'rgba(201, 168, 76, 0.1)'
                            : 'rgba(201, 168, 76, 0.05)',
                          border: '1px solid rgba(201, 168, 76, 0.2)',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isDark
                            ? 'rgba(201, 168, 76, 0.15)'
                            : 'rgba(201, 168, 76, 0.1)';
                          (e.currentTarget as HTMLElement).style.boxShadow = LUXURY_SHADOWS.gold;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isDark
                            ? 'rgba(201, 168, 76, 0.1)'
                            : 'rgba(201, 168, 76, 0.05)';
                        }}
                      >
                        <Mail size={20} style={{ color: '#C9A84C' }} />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#C9A84C', textTransform: 'uppercase' }}>
                            {t.email}
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                              wordBreak: 'break-all',
                            }}
                          >
                            {webContacts.email}
                          </div>
                        </div>
                      </a>
                    )}

                    <div
                      style={{
                        padding: LUXURY_SPACING.md,
                        background: '#10B981',
                        borderRadius: LUXURY_BORDER_RADIUS.md,
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      ✓ {t.hours}
                    </div>
                  </div>
                </div>
              </GlassmorphicContainer>
            </motion.div>
          )}

          {/* Social Media */}
          {socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <GlassmorphicContainer isDark={isDark} intensity="heavy">
                <div style={{ padding: LUXURY_SPACING['3xl'] }}>
                  <div
                    style={{
                      fontSize: '40px',
                      marginBottom: LUXURY_SPACING.lg,
                    }}
                  >
                    🌐
                  </div>

                  <h3
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      marginBottom: LUXURY_SPACING['2xl'],
                      color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                    }}
                  >
                    {t.followUs}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: LUXURY_SPACING.md }}>
                    {socials.map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: LUXURY_SPACING.sm,
                          padding: LUXURY_SPACING.lg,
                          borderRadius: LUXURY_BORDER_RADIUS.md,
                          background: isDark
                            ? 'rgba(201, 168, 76, 0.1)'
                            : 'rgba(201, 168, 76, 0.05)',
                          border: '1px solid rgba(201, 168, 76, 0.2)',
                          textDecoration: 'none',
                          color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                          fontWeight: 600,
                          fontSize: '13px',
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isDark
                            ? 'rgba(201, 168, 76, 0.15)'
                            : 'rgba(201, 168, 76, 0.1)';
                          (e.currentTarget as HTMLElement).style.boxShadow = LUXURY_SHADOWS.gold;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isDark
                            ? 'rgba(201, 168, 76, 0.1)'
                            : 'rgba(201, 168, 76, 0.05)';
                        }}
                      >
                        <span>{social.icon}</span>
                        <span>{social.label}</span>
                        <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </GlassmorphicContainer>
            </motion.div>
          )}

          {/* Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassmorphicContainer isDark={isDark} intensity="heavy">
              <div style={{ padding: LUXURY_SPACING['3xl'] }}>
                <div
                  style={{
                    fontSize: '40px',
                    marginBottom: LUXURY_SPACING.lg,
                  }}
                >
                  ✨
                </div>

                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    marginBottom: LUXURY_SPACING.lg,
                    color: isDark ? LUXURY_PALETTE.diamondWhite : LUXURY_PALETTE.luxuryDark,
                  }}
                >
                  Premium Service
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: isDark ? 'rgba(245, 247, 250, 0.8)' : 'rgba(11, 18, 32, 0.8)',
                    lineHeight: '1.7',
                    marginBottom: LUXURY_SPACING.lg,
                  }}
                >
                  Obtenez des conseils d'experts pour trouver la pièce parfaite adaptée à votre style et à votre budget.
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: LUXURY_SPACING.md,
                  }}
                >
                  {['Expert Consultation', 'Custom Design', 'Premium Support'].map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: LUXURY_SPACING.md,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isDark ? 'rgba(245, 247, 250, 0.8)' : 'rgba(11, 18, 32, 0.8)',
                      }}
                    >
                      <span style={{ color: '#C9A84C', fontSize: '16px' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassmorphicContainer>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactsPage;
