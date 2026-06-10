import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../../AppContext';
import { Trash2, ChevronDown, Package, MapPin, Truck, Plus, Minus, Home, Building2, Check } from 'lucide-react';
import { ALGERIA_WILAYAS } from '../../constants/algeriaWilayas';
import {
  MESSIKA_PALETTE,
  MESSIKA_FONTS,
  MESSIKA_GRADIENTS,
  MESSIKA_SHADOWS,
  MESSIKA_RADIUS,
  MESSIKA_SPACING,
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

// Style factories — called inside the component so they close over tc
const makeStyles = (tc: ReturnType<typeof getThemeColors>, isDark: boolean) => ({
  input: (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 16px',
    background: hasError ? tc.inputErrBg : tc.inputBg,
    border: `1px solid ${hasError ? tc.inputErrBorder : tc.inputBorder}`,
    color: tc.inputColor,
    fontSize: '14px', fontFamily: MESSIKA_FONTS.body,
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    borderRadius: '2px',
  }),
  select: (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 40px 13px 16px',
    background: hasError ? tc.inputErrBg : tc.inputBg,  // solid for dropdown visibility
    border: `1px solid ${hasError ? tc.inputErrBorder : tc.inputBorder}`,
    color: tc.inputColor,
    fontSize: '14px', fontFamily: MESSIKA_FONTS.body,
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    borderRadius: '2px',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
  }),
  label: (): React.CSSProperties => ({
    display: 'block', fontSize: '10px', fontWeight: 700,
    fontFamily: MESSIKA_FONTS.body,
    color: tc.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px',
  }),
  section: (): React.CSSProperties => ({
    background: isDark ? 'rgba(26,26,36,0.9)' : '#FFFFFF',
    border: `1px solid ${tc.cardBorder}`,
    boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 2px 16px rgba(0,0,0,0.06)',
    padding: '28px',
    marginBottom: '16px',
  }),
  sectionHead: (): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    fontFamily: MESSIKA_FONTS.body, fontSize: '9px', fontWeight: 700,
    color: tc.goldAccent,
    textTransform: 'uppercase', letterSpacing: '0.2em',
    marginBottom: '22px',
    paddingBottom: '14px',
    borderBottom: `1px solid ${tc.goldBorderMuted}`,
  }),
});

const OrderPage: React.FC<OrderPageProps> = ({ lang, cart, setCart, setCurrentPage, setLastOrderId, theme = 'dark' }) => {
  const { webDeliveryCompanies, addWebOrder } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const tc = getThemeColors(isDark);
  const s = makeStyles(tc, isDark);
  const inputStyle = s.input;
  const selectStyle = s.select;
  const labelStyle = s.label();
  const sectionStyle = s.section();
  const sectionHeadStyle = s.sectionHead();

  const [form, setForm] = useState({
    clientFullName: '', clientPhone: '', clientEmail: '',
    wilayaCode: 0, wilayaName: '', commune: '', address: '',
    deliveryCompanyId: '', deliveryType: 'home' as 'home' | 'bureau',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = {
    fr: {
      title: 'Finaliser la Commande', orderSummary: 'Votre commande', clientInfo: 'Informations client',
      deliveryInfo: 'Livraison', fullName: 'Nom complet', phone: 'Téléphone', email: 'Email (optionnel)',
      wilaya: 'Wilaya', commune: 'Commune', address: 'Adresse', company: 'Société de livraison',
      type: 'Mode de livraison', toHome: 'À domicile', toBureau: 'En bureau',
      subtotal: 'Sous-total', delivery: 'Livraison', total: 'Total',
      submit: 'Confirmer la commande', required: 'Champ requis',
      selectWilaya: 'Sélectionner votre wilaya', selectCompany: 'Sélectionner une société',
      noCompany: 'Aucune société disponible pour cette wilaya', emptyCart: 'Votre panier est vide.', qty: 'Qté',
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
      noCompany: 'لا توجد شركات لهذه الولاية', emptyCart: 'سلتك فارغة.', qty: 'الكمية',
      homeDesc: 'توصيل إلى المنزل', bureauDesc: 'الاستلام من الوكالة',
    },
  }[lang];

  const selectedWilaya = ALGERIA_WILAYAS.find(w => w.code === form.wilayaCode);

  // Companies that cover the selected wilaya AND commune (if commune is already chosen)
  const availableCompanies = webDeliveryCompanies.filter(c =>
    c.wilayas.some(w =>
      w.wilayaCode === form.wilayaCode &&
      (w.communes.length === 0 || !form.commune || w.communes.includes(form.commune))
    )
  );

  const selectedCompany = webDeliveryCompanies.find(c => c.id === form.deliveryCompanyId);

  // Find the most specific price entry: match both wilaya AND commune
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
    e.currentTarget.style.boxShadow = `0 0 0 2px ${isDark ? 'rgba(201,168,76,0.08)' : 'rgba(154,123,53,0.08)'}`;
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, name: string) => {
    e.currentTarget.style.borderColor = errors[name] ? tc.inputErrBorder : tc.inputBorder;
    e.currentTarget.style.boxShadow = 'none';
  };

  if (cart.length === 0) {
    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: tc.pageBg, paddingTop: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }} transition={{ duration: 3.5, repeat: Infinity }} style={{ fontSize: '72px' }}>🛍️</motion.div>
        <p style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '24px', fontWeight: 400, color: tc.textPrimary }}>{t.emptyCart}</p>
        <button onClick={() => setCurrentPage('offers')} style={{ padding: '12px 28px', background: MESSIKA_GRADIENTS.goldBtn, border: 'none', color: '#0A0A0A', fontFamily: MESSIKA_FONTS.body, fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
          {lang === 'fr' ? 'Explorer la collection' : 'استكشف المجموعة'}
        </button>
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: tc.pageBg, paddingTop: '80px' }}>
      {/* Decorative gradient */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: `${MESSIKA_SPACING['3xl']} 32px ${MESSIKA_SPACING['5xl']}`, position: 'relative', zIndex: 1 }}>
        {/* Page title */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '36px' }}
        >
          <div style={{ fontSize: '10px', fontFamily: MESSIKA_FONTS.body, fontWeight: 700, color: tc.goldAccent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
            {lang === 'fr' ? 'Commande' : 'الطلب'}
          </div>
          <h1 style={{ fontFamily: MESSIKA_FONTS.display, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400, color: tc.textPrimary, margin: 0 }}>
            {t.title}
          </h1>
          <div style={{ height: '1px', background: MESSIKA_GRADIENTS.sectionDivider, marginTop: '16px', maxWidth: '300px' }} />
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="order-grid">

          {/* ── LEFT: Order summary ── */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeadStyle}>
                <Package size={13} style={{ color: MESSIKA_PALETTE.goldWarm }} />
                {t.orderSummary}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: '16px' }}>
                <AnimatePresence>
                  {cart.map((item, i) => (
                    <motion.div
                      key={`${item.offer.id}-${i}`}
                      exit={shouldReduce ? {} : { opacity: 0, height: 0, overflow: 'hidden' }}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < cart.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    >
                      {/* Thumbnail */}
                      <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.offer.image
                          ? <img src={item.offer.image} alt={item.offer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Package size={18} style={{ color: tc.textMuted }} />}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: MESSIKA_FONTS.display, fontWeight: 400, fontSize: '14px', color: tc.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.offer.name}
                        </div>
                        {item.isSpecial && (
                          <div style={{ fontSize: '9px', fontFamily: MESSIKA_FONTS.body, color: MESSIKA_PALETTE.error, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Promo</div>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 8px', flexShrink: 0 }}>
                        <motion.button
                          onClick={() => setCart(cart.map((ci, idx) => idx === i ? { ...ci, quantity: Math.max(1, ci.quantity - 1) } : ci))}
                          whileHover={shouldReduce ? {} : { scale: 1.15 }}
                          whileTap={shouldReduce ? {} : { scale: 0.9 }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: tc.textMuted }}
                        ><Minus size={12} /></motion.button>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: tc.textPrimary, minWidth: '22px', textAlign: 'center', fontFamily: MESSIKA_FONTS.display }}>
                          {item.quantity}
                        </span>
                        <motion.button
                          onClick={() => setCart(cart.map((ci, idx) => idx === i ? { ...ci, quantity: ci.quantity + 1 } : ci))}
                          whileHover={shouldReduce ? {} : { scale: 1.15 }}
                          whileTap={shouldReduce ? {} : { scale: 0.9 }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: MESSIKA_PALETTE.goldWarm }}
                        ><Plus size={12} /></motion.button>
                      </div>

                      {/* Price + delete */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: MESSIKA_FONTS.display, fontWeight: 300, fontSize: '15px', background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>
                          {getItemPrice(item).toLocaleString()} DA
                        </div>
                        <motion.button
                          onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                          whileHover={shouldReduce ? {} : { color: MESSIKA_PALETTE.error }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: tc.textMuted, marginTop: '4px', padding: 0 }}
                        ><Trash2 size={12} /></motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div style={{ borderTop: `1px solid ${tc.rowBorder}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: MESSIKA_FONTS.body, color: tc.textMuted }}>
                  <span>{t.subtotal}</span>
                  <span style={{ color: tc.textSecondary, fontWeight: 500 }}>{subtotal.toLocaleString()} DA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: MESSIKA_FONTS.body, color: tc.textMuted }}>
                  <span>{t.delivery}</span>
                  <span style={{ color: tc.textSecondary, fontWeight: 500 }}>{deliveryPrice > 0 ? `${deliveryPrice.toLocaleString()} DA` : '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: `1px solid ${tc.goldBorderMuted}` }}>
                  <span style={{ fontFamily: MESSIKA_FONTS.body, fontWeight: 700, fontSize: '14px', color: tc.textPrimary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.total}</span>
                  <span style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '26px', fontWeight: 300, background: MESSIKA_GRADIENTS.goldText, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>
                    {total.toLocaleString()} DA
                  </span>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
              {['🔒 Paiement sécurisé', '📦 Livraison garantie', '↩️ Retour facile'].map((badge, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: tc.goldAccentMuted, border: `1px solid ${tc.cardBorder}`, fontFamily: MESSIKA_FONTS.body, fontSize: '10px', fontWeight: 500, color: tc.textMuted, letterSpacing: '0.06em' }}>
                  {badge}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Client info */}
            <div style={sectionStyle}>
              <div style={sectionHeadStyle}>
                <MapPin size={13} style={{ color: MESSIKA_PALETTE.goldWarm }} />
                {t.clientInfo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { key: 'clientFullName', label: t.fullName, type: 'text' },
                  { key: 'clientPhone', label: t.phone, type: 'tel' },
                  { key: 'clientEmail', label: t.email, type: 'email' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      name={field.key}
                      type={field.type}
                      value={(form as any)[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      style={inputStyle(!!errors[field.key])}
                      onFocus={focusBorder}
                      onBlur={e => blurBorder(e, field.key)}
                    />
                    {errors[field.key] && <p style={{ color: MESSIKA_PALETTE.error, fontSize: '11px', marginTop: '4px', fontFamily: MESSIKA_FONTS.body }}>{errors[field.key]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div style={sectionStyle}>
              <div style={sectionHeadStyle}>
                <Truck size={13} style={{ color: MESSIKA_PALETTE.goldWarm }} />
                {t.deliveryInfo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

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
                    <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: tc.textMuted, pointerEvents: 'none' }} />
                  </div>
                  {errors.wilayaCode && <p style={{ color: MESSIKA_PALETTE.error, fontSize: '11px', marginTop: '4px', fontFamily: MESSIKA_FONTS.body }}>{errors.wilayaCode}</p>}
                </div>

                {/* Commune */}
                <AnimatePresence>
                  {selectedWilaya && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
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
                        <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: tc.textMuted, pointerEvents: 'none' }} />
                      </div>
                      {errors.commune && <p style={{ color: MESSIKA_PALETTE.error, fontSize: '11px', marginTop: '4px', fontFamily: MESSIKA_FONTS.body }}>{errors.commune}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address */}
                <div>
                  <label style={labelStyle}>{t.address} *</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    style={inputStyle(!!errors.address)}
                    onFocus={focusBorder}
                    onBlur={e => blurBorder(e, 'address')}
                  />
                  {errors.address && <p style={{ color: MESSIKA_PALETTE.error, fontSize: '11px', marginTop: '4px', fontFamily: MESSIKA_FONTS.body }}>{errors.address}</p>}
                </div>

                {/* Delivery TYPE — appears as soon as wilaya is selected */}
                <AnimatePresence>
                  {form.wilayaCode > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <label style={{ ...labelStyle, marginBottom: '10px' }}>{t.type} *</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                          {
                            value: 'home' as const,
                            label: t.toHome,
                            desc: t.homeDesc,
                            icon: Home,
                            price: wilayaPrice?.toHome,
                          },
                          {
                            value: 'bureau' as const,
                            label: t.toBureau,
                            desc: t.bureauDesc,
                            icon: Building2,
                            price: wilayaPrice?.toBureau,
                          },
                        ].map(opt => {
                          const isActive = form.deliveryType === opt.value;
                          return (
                            <motion.button
                              key={opt.value}
                              onClick={() => setForm(f => ({ ...f, deliveryType: opt.value }))}
                              whileHover={shouldReduce ? {} : { scale: 1.02 }}
                              whileTap={shouldReduce ? {} : { scale: 0.97 }}
                              style={{
                                padding: '14px 12px',
                                cursor: 'pointer',
                                border: `1px solid ${isActive ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                background: isActive ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                                color: MESSIKA_PALETTE.textPrimary,
                                transition: 'all 0.25s ease',
                                boxShadow: isActive ? '0 0 20px rgba(201,168,76,0.1)' : 'none',
                                position: 'relative',
                                textAlign: 'center' as const,
                                display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px',
                              }}
                            >
                              {isActive && (
                                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', background: MESSIKA_PALETTE.goldWarm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={10} color="#0A0A0A" />
                                </div>
                              )}
                              <opt.icon size={20} style={{ color: isActive ? tc.goldAccent : tc.textMuted }} />
                              <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '12px', fontWeight: 700, color: isActive ? tc.textPrimary : tc.textSecondary, letterSpacing: '0.06em' }}>
                                {opt.label}
                              </div>
                              <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '10px', color: tc.textMuted }}>
                                {opt.desc}
                              </div>
                              {opt.price !== undefined ? (
                                <div style={{ fontFamily: MESSIKA_FONTS.display, fontSize: '14px', fontWeight: 300, color: isActive ? (isDark ? MESSIKA_PALETTE.goldBright : '#9A7B35') : tc.textMuted, marginTop: '2px' }}>
                                  {opt.price.toLocaleString()} DA
                                </div>
                              ) : (
                                <div style={{ fontFamily: MESSIKA_FONTS.body, fontSize: '10px', color: tc.textMuted, fontStyle: 'italic' }}>
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
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <label style={labelStyle}>{t.company} *</label>
                      {availableCompanies.length === 0 ? (
                        <div style={{ padding: '12px 16px', background: 'rgba(232,93,93,0.06)', border: '1px solid rgba(232,93,93,0.2)', fontFamily: MESSIKA_FONTS.body, fontSize: '13px', color: MESSIKA_PALETTE.error }}>
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
                          <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: tc.textMuted, pointerEvents: 'none' }} />
                        </div>
                      )}
                      {errors.deliveryCompanyId && <p style={{ color: MESSIKA_PALETTE.error, fontSize: '11px', marginTop: '4px', fontFamily: MESSIKA_FONTS.body }}>{errors.deliveryCompanyId}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              whileHover={shouldReduce ? {} : { scale: 1.02, boxShadow: '0 12px 48px rgba(201,168,76,0.4)' }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              style={{
                width: '100%', padding: '17px',
                background: submitting ? 'rgba(201,168,76,0.3)' : MESSIKA_GRADIENTS.goldBtn,
                border: 'none', color: '#0A0A0A',
                fontFamily: MESSIKA_FONTS.body, fontSize: '13px', fontWeight: 800,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 32px rgba(201,168,76,0.25)',
                transition: 'box-shadow 0.3s ease, background 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              {submitting ? (
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>…</motion.span>
              ) : (
                <>
                  {t.submit}
                  <motion.span animate={shouldReduce ? {} : { x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .order-grid { grid-template-columns: 1fr !important; } }
        /* Fix select dropdown option colors — inline color is inherited but bg is system-rendered */
        .order-select option {
          background: ${isDark ? '#1A1A24' : '#FFFFFF'};
          color: ${isDark ? '#FFFFFF' : '#0D0B08'};
        }
      `}</style>
    </div>
  );
};

export default OrderPage;
