import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../../AppContext';
import { Trash2, ChevronDown, Package, MapPin, Truck, Plus, Minus, Home, Building2, Check, ShoppingBag } from 'lucide-react';
import { ALGERIA_WILAYAS } from '../../constants/algeriaWilayas';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_GRADIENTS,
  getThemeColors,
} from '../../utils/luxuryDesignSystem';

interface CartItem {
  offer: any;
  quantity: number;
  isSpecial?: boolean;
}

interface OrderPageProps {
  lang: 'fr' | 'ar';
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  setCurrentPage: (page: string) => void;
  setLastOrderId: (id: string) => void;
  theme?: 'light' | 'dark';
}

const OrderPage: React.FC<OrderPageProps> = ({ lang, cart, setCart, setCurrentPage, setLastOrderId, theme = 'dark' }) => {
  const { webDeliveryCompanies, addWebOrder } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);

  const [form, setForm] = useState({
    clientFullName: '', clientPhone: '', clientEmail: '',
    wilayaCode: 0, wilayaName: '', commune: '', address: '',
    deliveryCompanyId: '', deliveryType: 'home' as 'home' | 'bureau',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const t = {
    fr: {
      title: 'Finaliser la Commande', orderSummary: 'Votre commande', clientInfo: 'Informations client',
      deliveryInfo: 'Livraison', fullName: 'Nom complet', phone: 'Téléphone', email: 'Email (optionnel)',
      wilaya: 'Wilaya', commune: 'Commune', address: 'Adresse', company: 'Société de livraison',
      type: 'Mode de livraison', toHome: 'À domicile', toBureau: 'En bureau',
      subtotal: 'Sous-total', delivery: 'Livraison', total: 'Total',
      submit: 'Confirmer la commande', required: 'Champ requis',
      selectWilaya: 'Sélectionner votre wilaya', selectCompany: 'Sélectionner une société',
      noCompany: 'Aucune société disponible pour cette wilaya', emptyCart: 'Votre panier est vide.',
      homeDesc: 'Livré directement chez vous', bureauDesc: 'Retrait en agence',
    },
    ar: {
      title: 'تأكيد الطلب', orderSummary: 'طلبك', clientInfo: 'معلومات العميل',
      deliveryInfo: 'التوصيل', fullName: 'الاسم الكامل', phone: 'الهاتف', email: 'البريد الإلكتروني (اختياري)',
      wilaya: 'الولاية', commune: 'البلدية', address: 'العنوان', company: 'شركة التوصيل',
      type: 'نوع التوصيل', toHome: 'إلى المنزل', toBureau: 'إلى المكتب',
      subtotal: 'المجموع الجزئي', delivery: 'التوصيل', total: 'الإجمالي',
      submit: 'تأكيد الطلب', required: 'حقل مطلوب',
      selectWilaya: 'اختر ولايتك', selectCompany: 'اختر شركة',
      noCompany: 'لا توجد شركات لهذه الولاية', emptyCart: 'سلتك فارغة.',
      homeDesc: 'توصيل إلى المنزل', bureauDesc: 'الاستلام من الوكالة',
    },
  }[lang];

  const selectedWilaya = ALGERIA_WILAYAS.find(w => w.code === form.wilayaCode);

  const availableCompanies = webDeliveryCompanies.filter(c =>
    c.wilayas.some(w =>
      w.wilayaCode === form.wilayaCode &&
      (w.communes.length === 0 || !form.commune || w.communes.includes(form.commune))
    )
  );

  const selectedCompany = webDeliveryCompanies.find(c => c.id === form.deliveryCompanyId);

  const wilayaPrice = selectedCompany?.wilayas.find(w =>
    w.wilayaCode === form.wilayaCode &&
    (w.communes.length === 0 || !form.commune || w.communes.includes(form.commune))
  ) ?? selectedCompany?.wilayas.find(w => w.wilayaCode === form.wilayaCode);

  const deliveryPrice = wilayaPrice
    ? (form.deliveryType === 'home' ? wilayaPrice.toHome : wilayaPrice.toBureau)
    : 0;

  const getItemPrice = (item: CartItem) => {
    if (item.isSpecial) return (item.offer.specialPrice || 0) * item.quantity;
    if (item.offer.pricingMode === 'alaPiece') return (item.offer.unitPrice || 0) * item.quantity;
    if (item.offer.pricingMode === 'perGram') return (item.offer.pricePerGram || 0) * (item.offer.weight || 0) * item.quantity;
    return (item.offer.totalPrice || 0) * item.quantity;
  };

  const getUnitPrice = (item: CartItem) => {
    if (item.isSpecial) return item.offer.specialPrice || 0;
    if (item.offer.pricingMode === 'alaPiece') return item.offer.unitPrice || 0;
    if (item.offer.pricingMode === 'perGram') return (item.offer.pricePerGram || 0) * (item.offer.weight || 0);
    return item.offer.totalPrice || 0;
  };

  const subtotal = cart.reduce((s, item) => s + getItemPrice(item), 0);
  const total = subtotal + deliveryPrice;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.clientFullName.trim()) e.clientFullName = t.required;
    if (!form.clientPhone.trim()) e.clientPhone = t.required;
    if (!form.wilayaCode) e.wilayaCode = t.required;
    if (!form.commune.trim()) e.commune = t.required;
    if (!form.address.trim()) e.address = t.required;
    if (!form.deliveryCompanyId) e.deliveryCompanyId = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const items = cart.map(item => ({
      offerId: item.isSpecial ? undefined : item.offer.id,
      specialOfferId: item.isSpecial ? item.offer.id : undefined,
      name: item.offer.name, image: item.offer.image,
      quantity: item.quantity, unitPrice: getUnitPrice(item), totalPrice: getItemPrice(item),
      silverTypeId: item.offer.silverTypeId, calibre: item.offer.calibre, form: item.offer.form, weight: item.offer.weight,
    }));
    const newId = await addWebOrder({
      clientFullName: form.clientFullName, clientPhone: form.clientPhone, clientEmail: form.clientEmail,
      wilayaCode: form.wilayaCode, wilayaName: form.wilayaName, commune: form.commune,
      address: form.address, deliveryCompanyId: form.deliveryCompanyId, deliveryType: form.deliveryType,
      deliveryPrice, items, subtotal, total, isPersonalized: false,
    });
    setLastOrderId(newId);
    setCart([]);
    setSubmitting(false);
    setCurrentPage('thankyou');
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = tc.inputFocusBorder;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(201,168,76,0.10)' : 'rgba(154,123,53,0.10)'}`;
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, name: string) => {
    e.currentTarget.style.borderColor = errors[name] ? tc.inputErrBorder : tc.inputBorder;
    e.currentTarget.style.boxShadow = 'none';
  };

  const gold = MESSIKA_PALETTE.goldWarm;
  const cardBg = isDark ? 'rgba(22,22,32,0.95)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardShadow = isDark
    ? '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)'
    : '0 4px 24px rgba(0,0,0,0.07)';

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '15px 18px',
    background: hasError ? tc.inputErrBg : tc.inputBg,
    border: `1.5px solid ${hasError ? tc.inputErrBorder : tc.inputBorder}`,
    color: tc.inputColor,
    fontSize: '15px', fontFamily: MESSIKA_FONTS.body,
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    borderRadius: '10px',
  });

  const selectStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '15px 46px 15px 18px',
    background: hasError ? tc.inputErrBg : tc.inputBg,
    border: `1.5px solid ${hasError ? tc.inputErrBorder : tc.inputBorder}`,
    color: tc.inputColor,
    fontSize: '15px', fontFamily: MESSIKA_FONTS.body,
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    borderRadius: '10px',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    fontFamily: MESSIKA_FONTS.body,
    color: tc.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px',
  };

  const sectionStyle: React.CSSProperties = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    boxShadow: cardShadow,
    borderRadius: '16px',
    padding: '28px 32px',
    marginBottom: '18px',
  };

  const sectionHeadStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px',
    fontFamily: MESSIKA_FONTS.body, fontSize: '11px', fontWeight: 800,
    color: tc.goldAccent,
    textTransform: 'uppercase', letterSpacing: '0.2em',
    marginBottom: '24px',
    paddingBottom: '18px',
    borderBottom: `1px solid rgba(201,168,76,0.15)`,
  };

  if (cart.length === 0) {
    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: tc.pageBg, paddingTop: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 3.5, repeat: Infinity }} style={{ fontSize: '80px' }}>🛍️</motion.div>
        <p style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '28px', fontWeight: 400, color: tc.textPrimary }}>{t.emptyCart}</p>
        <motion.button
          onClick={() => setCurrentPage('offers')}
          whileHover={shouldReduce ? {} : { scale: 1.03, boxShadow: '0 8px 32px rgba(201,168,76,0.35)' }}
          whileTap={shouldReduce ? {} : { scale: 0.97 }}
          style={{ padding: '15px 36px', background: MESSIKA_GRADIENTS.goldBtn, border: 'none', color: '#0A0A0A', fontFamily: MESSIKA_FONTS.body, fontSize: '13px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '8px' }}
        >
          {lang === 'fr' ? 'Explorer la collection' : 'استكشف المجموعة'}
        </motion.button>
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: tc.pageBg, paddingTop: '80px' }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Page header */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{ fontSize: '11px', fontFamily: MESSIKA_FONTS.body, fontWeight: 700, color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={13} />
            {lang === 'fr' ? 'Commande' : 'الطلب'}
          </div>
          <h1 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, color: tc.textPrimary, margin: '0 0 16px' }}>
            {t.title}
          </h1>
          <div style={{ height: '1px', background: MESSIKA_GRADIENTS.sectionDivider, maxWidth: '320px' }} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }} className="order-grid">

          {/* ── LEFT: Order Summary ── */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeadStyle}>
                <Package size={16} style={{ color: gold }} />
                {t.orderSummary}
                <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 700, color: tc.textSecondary, letterSpacing: 0 }}>
                  {cart.length} article{cart.length > 1 ? 's' : ''}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <AnimatePresence>
                  {cart.map((item, i) => (
                    <motion.div
                      key={`${item.offer.id}-${i}`}
                      layout
                      initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduce ? {} : { opacity: 0, height: 0, overflow: 'hidden', marginBottom: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '18px 0',
                        borderBottom: i < cart.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` : 'none',
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        width: 76, height: 76, flexShrink: 0,
                        borderRadius: '10px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.offer.image
                          ? <img src={item.offer.image} alt={item.offer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Package size={24} style={{ color: tc.textMuted }} />}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: MESSIKA_FONTS.display, fontWeight: 500, fontSize: '16px', color: tc.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                          {item.offer.name}
                        </div>
                        <div style={{ fontSize: '13px', fontFamily: MESSIKA_FONTS.body, color: tc.textMuted, marginBottom: '8px' }}>
                          {getUnitPrice(item).toLocaleString()} DA / unité
                        </div>
                        {item.isSpecial && (
                          <span style={{ display: 'inline-block', fontSize: '10px', fontFamily: MESSIKA_FONTS.body, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', padding: '2px 8px', borderRadius: '4px' }}>
                            Promo
                          </span>
                        )}

                        {/* Quantity stepper */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', marginTop: '10px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`, borderRadius: '8px', overflow: 'hidden' }}>
                          <motion.button
                            onClick={() => setCart(cart.map((ci, idx) => idx === i ? { ...ci, quantity: Math.max(1, ci.quantity - 1) } : ci))}
                            whileHover={shouldReduce ? {} : { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                            whileTap={shouldReduce ? {} : { scale: 0.92 }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '7px 12px', display: 'flex', alignItems: 'center', color: tc.textMuted, transition: 'background 0.15s' }}
                          ><Minus size={14} /></motion.button>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary, minWidth: '30px', textAlign: 'center', fontFamily: MESSIKA_FONTS.display, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() => setCart(cart.map((ci, idx) => idx === i ? { ...ci, quantity: ci.quantity + 1 } : ci))}
                            whileHover={shouldReduce ? {} : { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                            whileTap={shouldReduce ? {} : { scale: 0.92 }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '7px 12px', display: 'flex', alignItems: 'center', color: gold, transition: 'background 0.15s' }}
                          ><Plus size={14} /></motion.button>
                        </div>
                      </div>

                      {/* Price + delete */}
                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{
                          fontFamily: MESSIKA_FONTS.display, fontWeight: 400, fontSize: '20px',
                          background: MESSIKA_GRADIENTS.goldText,
                          backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                          backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite',
                        }}>
                          {getItemPrice(item).toLocaleString()} DA
                        </div>
                        <motion.button
                          onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                          whileHover={shouldReduce ? {} : { color: MESSIKA_PALETTE.error, scale: 1.1 }}
                          whileTap={shouldReduce ? {} : { scale: 0.88 }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: tc.textMuted, padding: 0, display: 'flex', alignItems: 'center' }}
                        ><Trash2 size={15} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div style={{ marginTop: '4px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '14px', color: tc.textMuted }}>{t.subtotal}</span>
                  <span style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '17px', fontWeight: 400, color: tc.textSecondary }}>{subtotal.toLocaleString()} DA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '14px', color: tc.textMuted }}>{t.delivery}</span>
                  <span style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '17px', fontWeight: 400, color: tc.textSecondary }}>
                    {deliveryPrice > 0 ? `${deliveryPrice.toLocaleString()} DA` : '—'}
                  </span>
                </div>

                {/* Total row */}
                <div style={{
                  marginTop: '8px', padding: '18px 20px',
                  background: isDark ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.20)',
                  borderRadius: '12px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontFamily: MESSIKA_FONTS.body, fontWeight: 800, fontSize: '13px', color: tc.textPrimary, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{t.total}</span>
                  <span style={{
                    fontFamily: MESSIKA_FONTS.display, fontSize: '34px', fontWeight: 300,
                    background: MESSIKA_GRADIENTS.goldText,
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite',
                    lineHeight: 1,
                  }}>
                    {total.toLocaleString()} <span style={{ fontSize: '20px' }}>DA</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}
            >
              {[
                { icon: '🔒', label: lang === 'fr' ? 'Paiement sécurisé' : 'دفع آمن' },
                { icon: '📦', label: lang === 'fr' ? 'Livraison garantie' : 'توصيل مضمون' },
                { icon: '↩️', label: lang === 'fr' ? 'Retour facile' : 'إرجاع سهل' },
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  padding: '14px 8px',
                  background: cardBg, border: `1px solid ${cardBorder}`,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '22px' }}>{badge.icon}</span>
                  <span style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '11px', fontWeight: 600, color: tc.textMuted, letterSpacing: '0.04em', lineHeight: 1.3 }}>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            {/* Client info */}
            <div style={sectionStyle}>
              <div style={sectionHeadStyle}>
                <MapPin size={16} style={{ color: gold }} />
                {t.clientInfo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  { key: 'clientFullName', label: t.fullName, type: 'text', placeholder: lang === 'fr' ? 'Prénom et nom' : 'الاسم الكامل' },
                  { key: 'clientPhone', label: t.phone, type: 'tel', placeholder: '0XXX XXX XXX' },
                  { key: 'clientEmail', label: t.email, type: 'email', placeholder: 'email@exemple.com' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      name={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      style={inputStyle(!!errors[field.key])}
                      onFocus={focusBorder}
                      onBlur={e => blurBorder(e, field.key)}
                    />
                    {errors[field.key] && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: MESSIKA_PALETTE.error, fontSize: '12px', marginTop: '6px', fontFamily: MESSIKA_FONTS.body }}>
                        {errors[field.key]}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div style={sectionStyle}>
              <div style={sectionHeadStyle}>
                <Truck size={16} style={{ color: gold }} />
                {t.deliveryInfo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Wilaya */}
                <div>
                  <label style={labelStyle}>{t.wilaya} *</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="wilayaCode"
                      value={form.wilayaCode || ''}
                      onChange={e => {
                        const code = parseInt(e.target.value) || 0;
                        const w = ALGERIA_WILAYAS.find(w => w.code === code);
                        setForm(f => ({ ...f, wilayaCode: code, wilayaName: w?.name || '', commune: '', deliveryCompanyId: '' }));
                      }}
                      style={selectStyle(!!errors.wilayaCode)}
                      className="order-select"
                      onFocus={focusBorder}
                      onBlur={e => blurBorder(e, 'wilayaCode')}
                    >
                      <option value="">{t.selectWilaya}</option>
                      {ALGERIA_WILAYAS.map(w => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: tc.textMuted, pointerEvents: 'none' }} />
                  </div>
                  {errors.wilayaCode && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: MESSIKA_PALETTE.error, fontSize: '12px', marginTop: '6px', fontFamily: MESSIKA_FONTS.body }}>
                      {errors.wilayaCode}
                    </motion.p>
                  )}
                </div>

                {/* Commune */}
                <AnimatePresence>
                  {selectedWilaya && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <label style={labelStyle}>{t.commune} *</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          name="commune"
                          value={form.commune}
                          onChange={e => setForm(f => ({ ...f, commune: e.target.value }))}
                          style={selectStyle(!!errors.commune)}
                          className="order-select"
                          onFocus={focusBorder}
                          onBlur={e => blurBorder(e, 'commune')}
                        >
                          <option value="">{t.commune}</option>
                          {selectedWilaya.communes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: tc.textMuted, pointerEvents: 'none' }} />
                      </div>
                      {errors.commune && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: MESSIKA_PALETTE.error, fontSize: '12px', marginTop: '6px', fontFamily: MESSIKA_FONTS.body }}>
                          {errors.commune}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address */}
                <div>
                  <label style={labelStyle}>{t.address} *</label>
                  <input
                    name="address"
                    value={form.address}
                    placeholder={lang === 'fr' ? 'N° rue, quartier, cité…' : 'رقم، حي، مدينة…'}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    style={inputStyle(!!errors.address)}
                    onFocus={focusBorder}
                    onBlur={e => blurBorder(e, 'address')}
                  />
                  {errors.address && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: MESSIKA_PALETTE.error, fontSize: '12px', marginTop: '6px', fontFamily: MESSIKA_FONTS.body }}>
                      {errors.address}
                    </motion.p>
                  )}
                </div>

                {/* Delivery type */}
                <AnimatePresence>
                  {form.wilayaCode > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <label style={{ ...labelStyle, marginBottom: '12px' }}>{t.type} *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                          { value: 'home' as const, label: t.toHome, desc: t.homeDesc, icon: Home, price: wilayaPrice?.toHome },
                          { value: 'bureau' as const, label: t.toBureau, desc: t.bureauDesc, icon: Building2, price: wilayaPrice?.toBureau },
                        ].map(opt => {
                          const isActive = form.deliveryType === opt.value;
                          return (
                            <motion.button
                              key={opt.value}
                              onClick={() => setForm(f => ({ ...f, deliveryType: opt.value }))}
                              whileHover={shouldReduce ? {} : { scale: 1.02 }}
                              whileTap={shouldReduce ? {} : { scale: 0.97 }}
                              style={{
                                padding: '18px 14px',
                                cursor: 'pointer',
                                border: `1.5px solid ${isActive ? 'rgba(201,168,76,0.55)' : isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'}`,
                                background: isActive ? 'rgba(201,168,76,0.09)' : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                                color: MESSIKA_PALETTE.textPrimary,
                                transition: 'all 0.25s ease',
                                boxShadow: isActive ? '0 0 24px rgba(201,168,76,0.12)' : 'none',
                                position: 'relative',
                                textAlign: 'center' as const,
                                display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px',
                                borderRadius: '12px',
                              }}
                            >
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                                  style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', background: gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <Check size={12} color="#0A0A0A" />
                                </motion.div>
                              )}
                              <opt.icon size={24} style={{ color: isActive ? gold : tc.textMuted }} />
                              <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '13px', fontWeight: 700, color: isActive ? tc.textPrimary : tc.textSecondary, letterSpacing: '0.05em' }}>
                                {opt.label}
                              </div>
                              <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '11px', color: tc.textMuted, lineHeight: 1.3 }}>
                                {opt.desc}
                              </div>
                              {opt.price !== undefined ? (
                                <div style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '18px', fontWeight: 300, color: isActive ? (isDark ? MESSIKA_PALETTE.goldBright : '#9A7B35') : tc.textMuted, marginTop: '2px' }}>
                                  {opt.price.toLocaleString()} DA
                                </div>
                              ) : (
                                <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '11px', color: tc.textMuted, fontStyle: 'italic' }}>
                                  {lang === 'fr' ? 'À confirmer' : 'يُحدد لاحقاً'}
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delivery company */}
                <AnimatePresence>
                  {form.wilayaCode > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <label style={labelStyle}>{t.company} *</label>
                      {availableCompanies.length === 0 ? (
                        <div style={{ padding: '16px 18px', background: 'rgba(232,93,93,0.07)', border: '1.5px solid rgba(232,93,93,0.22)', fontFamily: MESSIKA_FONTS.body, fontSize: '14px', color: MESSIKA_PALETTE.error, borderRadius: '10px' }}>
                          {t.noCompany}
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <select
                            name="deliveryCompanyId"
                            value={form.deliveryCompanyId}
                            onChange={e => setForm(f => ({ ...f, deliveryCompanyId: e.target.value }))}
                            style={selectStyle(!!errors.deliveryCompanyId)}
                            className="order-select"
                            onFocus={focusBorder}
                            onBlur={e => blurBorder(e, 'deliveryCompanyId')}
                          >
                            <option value="">{t.selectCompany}</option>
                            {availableCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: tc.textMuted, pointerEvents: 'none' }} />
                        </div>
                      )}
                      {errors.deliveryCompanyId && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: MESSIKA_PALETTE.error, fontSize: '12px', marginTop: '6px', fontFamily: MESSIKA_FONTS.body }}>
                          {errors.deliveryCompanyId}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              whileHover={shouldReduce ? {} : { scale: 1.02, boxShadow: '0 16px 56px rgba(201,168,76,0.45)' }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              style={{
                width: '100%', padding: '20px',
                background: submitting ? 'rgba(201,168,76,0.3)' : MESSIKA_GRADIENTS.goldBtn,
                border: 'none', color: '#0A0A0A',
                fontFamily: MESSIKA_FONTS.body, fontSize: '14px', fontWeight: 800,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 36px rgba(201,168,76,0.28)',
                transition: 'box-shadow 0.3s ease, background 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                borderRadius: '12px',
              }}
            >
              {submitting ? (
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ fontSize: '18px' }}>…</motion.span>
              ) : (
                <>
                  {t.submit}
                  <motion.span
                    animate={shouldReduce ? {} : { x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: '16px' }}
                  >→</motion.span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @media (max-width: 820px) { .order-grid { grid-template-columns: 1fr !important; } }
        .order-select option {
          background: ${isDark ? '#1A1A24' : '#FFFFFF'};
          color: ${isDark ? '#FFFFFF' : '#0D0B08'};
        }
      `}</style>
    </div>
  );
};

export default OrderPage;
