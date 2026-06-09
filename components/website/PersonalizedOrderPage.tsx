
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApp } from '../../AppContext';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ALGERIA_WILAYAS } from '../../constants/algeriaWilayas';
import {
  LUXURY_PALETTE,
  LUXURY_SPACING,
  LUXURY_BORDER_RADIUS,
  LUXURY_GRADIENTS,
} from '../../utils/luxuryDesignSystem';

interface PersonalizedOrderPageProps {
  lang: 'fr' | 'ar';
  setCurrentPage: (page: string) => void;
  setLastOrderId: (id: string) => void;
  theme?: 'light' | 'dark';
}

const inputStyle = (hasError: boolean, isDark: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px 16px', borderRadius: 14,
  background: isDark
    ? hasError ? 'rgba(239,68,68,0.08)' : 'rgba(201,209,217,0.05)'
    : hasError ? 'rgba(239,68,68,0.06)' : 'rgba(11,18,32,0.03)',
  border: `1px solid ${isDark
    ? hasError ? 'rgba(239,68,68,0.4)' : 'rgba(201,209,217,0.14)'
    : hasError ? 'rgba(239,68,68,0.3)' : 'rgba(11,18,32,0.1)'}`,
  color: isDark ? '#E7ECF2' : '#0B1220', fontSize: 14, fontWeight: 500, outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s, box-shadow 0.2s',
});

const labelStyle = (isDark: boolean): React.CSSProperties => ({
  display: 'block', fontSize: 10, fontWeight: 800, color: isDark ? 'rgba(192,200,212,0.5)' : 'rgba(11,18,32,0.5)',
  textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6,
});

const cardStyle = (isDark: boolean): React.CSSProperties => ({
  background: 'rgba(28,36,46,0.8)', border: '1px solid rgba(192,200,212,0.10)',
  borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
});

const PersonalizedOrderPage: React.FC<PersonalizedOrderPageProps> = ({ lang, setCurrentPage, setLastOrderId, theme = 'light' }) => {
  const { silverTypes, webDeliveryCompanies, addWebOrder } = useApp();
  const shouldReduce = useReducedMotion();
  const isDark = theme === 'dark';
  const [form, setForm] = useState({
    clientFullName: '', clientPhone: '', clientEmail: '',
    wilayaCode: 0, wilayaName: '', commune: '', address: '',
    deliveryCompanyId: '', deliveryType: 'home' as 'home' | 'bureau',
    silverTypeId: '', shape: '', maxWeight: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const t = {
    fr: {
      title: 'Commande Personnalisée', subtitle: 'Décrivez votre bijou idéal, nous le réalisons pour vous',
      personalDetails: 'Détails du bijou', clientInfo: 'Vos coordonnées', deliveryInfo: 'Informations de livraison',
      silverType: "Type d'argent", shape: 'Forme / Modèle', maxWeight: 'Poids maximum souhaité (grammes)',
      notes: 'Description & détails supplémentaires', notesPlaceholder: 'Décrivez votre bijou idéal : type, style, gravure, etc.',
      fullName: 'Nom complet', phone: 'Téléphone', email: 'Email (optionnel)',
      wilaya: 'Wilaya', commune: 'Commune', address: 'Adresse', company: 'Société de livraison',
      type: 'Type de livraison', toHome: 'À domicile', toBureau: 'Au bureau',
      submit: 'Envoyer la commande', required: 'Champ requis',
      selectSilver: "Type d'argent", selectWilaya: 'Sélectionner votre wilaya',
      selectCompany: 'Sélectionner une société', noCompany: 'Aucune société disponible',
      selectShape: 'Forme (optionnel)', delivery: 'Livraison',
    },
    ar: {
      title: 'طلب شخصي', subtitle: 'صف مجوهراتك المثالية، سنقوم بصنعها لك',
      personalDetails: 'تفاصيل المجوهر', clientInfo: 'بياناتك', deliveryInfo: 'معلومات التوصيل',
      silverType: 'نوع الفضة', shape: 'الشكل / النموذج', maxWeight: 'الوزن الأقصى المطلوب (غرام)',
      notes: 'وصف وتفاصيل إضافية', notesPlaceholder: 'صف مجوهراتك: النوع، الأسلوب، النقش، إلخ.',
      fullName: 'الاسم الكامل', phone: 'الهاتف', email: 'البريد الإلكتروني (اختياري)',
      wilaya: 'الولاية', commune: 'البلدية', address: 'العنوان', company: 'شركة التوصيل',
      type: 'نوع التوصيل', toHome: 'إلى المنزل', toBureau: 'إلى المكتب',
      submit: 'إرسال الطلب', required: 'حقل مطلوب',
      selectSilver: 'نوع الفضة', selectWilaya: 'اختر ولايتك',
      selectCompany: 'اختر شركة', noCompany: 'لا توجد شركات متاحة',
      selectShape: 'الشكل (اختياري)', delivery: 'التوصيل',
    },
  }[lang];

  const selectedWilaya = ALGERIA_WILAYAS.find(w => w.code === form.wilayaCode);
  const availableCompanies = webDeliveryCompanies.filter(c => c.wilayas.some(w => w.wilayaCode === form.wilayaCode));
  const selectedCompany = webDeliveryCompanies.find(c => c.id === form.deliveryCompanyId);
  const wilayaPrice = selectedCompany?.wilayas.find(w => w.wilayaCode === form.wilayaCode);
  const deliveryPrice = wilayaPrice ? (form.deliveryType === 'home' ? wilayaPrice.toHome : wilayaPrice.toBureau) : 0;
  const selectedSilverType = silverTypes.find(s => s.id === form.silverTypeId);
  const shapes = selectedSilverType ? Object.keys(selectedSilverType.shapes) : [];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.clientFullName.trim()) e.clientFullName = t.required;
    if (!form.clientPhone.trim()) e.clientPhone = t.required;
    if (!form.wilayaCode || form.wilayaCode === 0) e.wilayaCode = t.required;
    if (!form.commune.trim()) e.commune = t.required;
    if (!form.address.trim()) e.address = t.required;
    if (!form.deliveryCompanyId) e.deliveryCompanyId = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const newId = await addWebOrder({
      clientFullName: form.clientFullName, clientPhone: form.clientPhone, clientEmail: form.clientEmail,
      wilayaCode: form.wilayaCode, wilayaName: form.wilayaName, commune: form.commune,
      address: form.address, deliveryCompanyId: form.deliveryCompanyId, deliveryType: form.deliveryType,
      deliveryPrice, items: [], subtotal: 0, total: deliveryPrice, isPersonalized: true,
      personalizedDetails: {
        silverType: selectedSilverType?.name || '', calibre: '', form: form.shape,
        maxGrams: parseFloat(form.maxWeight) || 0, notes: form.notes,
      },
    });
    setLastOrderId(newId);
    setSubmitting(false);
    setCurrentPage('thankyou');
  };

  const focusOn = (e: React.FocusEvent<any>) => {
    e.currentTarget.style.borderColor = 'rgba(192,200,212,0.35)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(192,200,212,0.06)';
  };
  const focusOff = (e: React.FocusEvent<any>, key: string) => {
    e.currentTarget.style.borderColor = errors[key] ? 'rgba(255,95,114,0.4)' : 'rgba(192,200,212,0.14)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const SelectWrap = ({ fieldKey, label, children }: { fieldKey: string; label?: string; children: React.ReactNode }) => (
    <div>
      {label && <label style={labelStyle(isDark)}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {children}
        <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(192,200,212,0.4)', pointerEvents: 'none' }} />
      </div>
      {errors[fieldKey] && <p style={{ color: '#FF5F72', fontSize: 11, marginTop: 4 }}>{errors[fieldKey]}</p>}
    </div>
  );

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: isDark ? '#0D1117' : '#F8FAFC', paddingTop: 80 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <motion.div
            whileHover={shouldReduce ? {} : { rotate: 20 }}
            style={{ width: 56, height: 56, background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}
          >
            <Sparkles size={24} style={{ color: '#C9A84C' }} />
          </motion.div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F0F4F8', letterSpacing: '-0.03em', marginBottom: 8 }}>{t.title}</h1>
          <p style={{ color: 'rgba(192,200,212,0.45)', fontSize: 14 }}>{t.subtitle}</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Jewelry details */}
          <motion.section
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={cardStyle(isDark)}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(192,200,212,0.35)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{t.personalDetails}</div>

            <SelectWrap fieldKey="silverTypeId">
              <label style={labelStyle(isDark)}>{t.silverType}</label>
              <select
                value={form.silverTypeId}
                onChange={e => setForm(f => ({ ...f, silverTypeId: e.target.value, shape: '' }))}
                style={{ ...inputStyle(false, isDark), paddingRight: 36, appearance: 'none' }}
                onFocus={focusOn} onBlur={e => focusOff(e, 'silverTypeId')}
              >
                <option value="">{t.selectSilver}</option>
                {silverTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </SelectWrap>

            {shapes.length > 0 && (
              <SelectWrap fieldKey="shape">
                <label style={labelStyle(isDark)}>{t.shape}</label>
                <select
                  value={form.shape}
                  onChange={e => setForm(f => ({ ...f, shape: e.target.value }))}
                  style={{ ...inputStyle(false, isDark), paddingRight: 36, appearance: 'none' }}
                  onFocus={focusOn} onBlur={e => focusOff(e, 'shape')}
                >
                  <option value="">{t.selectShape}</option>
                  {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </SelectWrap>
            )}

            <div>
              <label style={labelStyle(isDark)}>{t.maxWeight}</label>
              <input
                type="number" min="0" step="0.1" value={form.maxWeight}
                onChange={e => setForm(f => ({ ...f, maxWeight: e.target.value }))}
                style={inputStyle(false, isDark)}
                onFocus={focusOn} onBlur={e => focusOff(e, 'maxWeight')}
              />
            </div>

            <div>
              <label style={labelStyle(isDark)}>{t.notes}</label>
              <textarea
                rows={4} value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={t.notesPlaceholder}
                style={{ ...inputStyle(false, isDark), resize: 'none', paddingTop: 12 }}
                onFocus={focusOn as any} onBlur={e => focusOff(e as any, 'notes')}
              />
            </div>
          </motion.section>

          {/* Client info */}
          <motion.section
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={cardStyle(isDark)}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(192,200,212,0.35)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{t.clientInfo}</div>
            {[
              { key: 'clientFullName', label: t.fullName, type: 'text' },
              { key: 'clientPhone', label: t.phone, type: 'tel' },
              { key: 'clientEmail', label: t.email, type: 'email' },
            ].map(field => (
              <div key={field.key}>
                <label style={labelStyle(isDark)}>{field.label}</label>
                <input
                  type={field.type} value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={inputStyle(!!errors[field.key], isDark)}
                  onFocus={focusOn} onBlur={e => focusOff(e, field.key)}
                />
                {errors[field.key] && <p style={{ color: '#FF5F72', fontSize: 11, marginTop: 4 }}>{errors[field.key]}</p>}
              </div>
            ))}
          </motion.section>

          {/* Delivery */}
          <motion.section
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={cardStyle(isDark)}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(192,200,212,0.35)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{t.deliveryInfo}</div>

            <SelectWrap fieldKey="wilayaCode">
              <label style={labelStyle(isDark)}>{t.wilaya} *</label>
              <select
                value={form.wilayaCode || ''}
                onChange={e => {
                  const code = parseInt(e.target.value) || 0;
                  const w = ALGERIA_WILAYAS.find(w => w.code === code);
                  setForm(f => ({ ...f, wilayaCode: code, wilayaName: w?.name || '', commune: '', deliveryCompanyId: '' }));
                }}
                style={{ ...inputStyle(!!errors.wilayaCode, isDark), paddingRight: 36, appearance: 'none' }}
                onFocus={focusOn} onBlur={e => focusOff(e, 'wilayaCode')}
              >
                <option value="">{t.selectWilaya}</option>
                {ALGERIA_WILAYAS.map(w => <option key={w.code} value={w.code}>{w.code} - {w.name}</option>)}
              </select>
            </SelectWrap>

            {selectedWilaya && (
              <SelectWrap fieldKey="commune">
                <label style={labelStyle(isDark)}>{t.commune} *</label>
                <select
                  value={form.commune}
                  onChange={e => setForm(f => ({ ...f, commune: e.target.value }))}
                  style={{ ...inputStyle(!!errors.commune, isDark), paddingRight: 36, appearance: 'none' }}
                  onFocus={focusOn} onBlur={e => focusOff(e, 'commune')}
                >
                  <option value="">{t.commune}</option>
                  {selectedWilaya.communes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </SelectWrap>
            )}

            <div>
              <label style={labelStyle(isDark)}>{t.address} *</label>
              <input
                value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                style={inputStyle(!!errors.address, isDark)}
                onFocus={focusOn} onBlur={e => focusOff(e, 'address')}
              />
              {errors.address && <p style={{ color: '#FF5F72', fontSize: 11, marginTop: 4 }}>{errors.address}</p>}
            </div>

            {form.wilayaCode > 0 && (
              availableCompanies.length === 0
                ? <p style={{ color: 'rgba(192,200,212,0.3)', fontSize: 13 }}>{t.noCompany}</p>
                : <SelectWrap fieldKey="deliveryCompanyId">
                    <label style={labelStyle(isDark)}>{t.company} *</label>
                    <select
                      value={form.deliveryCompanyId}
                      onChange={e => setForm(f => ({ ...f, deliveryCompanyId: e.target.value }))}
                      style={{ ...inputStyle(!!errors.deliveryCompanyId, isDark), paddingRight: 36, appearance: 'none' }}
                      onFocus={focusOn} onBlur={e => focusOff(e, 'deliveryCompanyId')}
                    >
                      <option value="">{t.selectCompany}</option>
                      {availableCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </SelectWrap>
            )}

            {form.deliveryCompanyId && wilayaPrice && (
              <div>
                <label style={{ ...labelStyle(isDark), marginBottom: 8 }}>{t.type} *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { value: 'home' as const, label: t.toHome, price: wilayaPrice.toHome },
                    { value: 'bureau' as const, label: t.toBureau, price: wilayaPrice.toBureau },
                  ].map(opt => (
                    <motion.button
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, deliveryType: opt.value }))}
                      whileHover={shouldReduce ? {} : { scale: 1.02 }}
                      whileTap={shouldReduce ? {} : { scale: 0.98 }}
                      style={{
                        padding: '12px', borderRadius: 14, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        border: `2px solid ${form.deliveryType === opt.value ? 'rgba(192,200,212,0.5)' : 'rgba(192,200,212,0.12)'}`,
                        background: form.deliveryType === opt.value ? 'rgba(192,200,212,0.08)' : 'transparent',
                        color: form.deliveryType === opt.value ? '#F0F4F8' : 'rgba(192,200,212,0.4)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div>{opt.label}</div>
                      <div style={{ fontWeight: 900, fontSize: 15, marginTop: 2, color: form.deliveryType === opt.value ? '#C9A84C' : 'rgba(192,200,212,0.3)' }}>{opt.price.toLocaleString()} DA</div>
                    </motion.button>
                  ))}
                </div>
                <div style={{ marginTop: 8, textAlign: 'right', fontSize: 12, color: 'rgba(192,200,212,0.4)' }}>
                  {t.delivery}: <span style={{ fontWeight: 900, color: '#C9A84C' }}>{deliveryPrice.toLocaleString()} DA</span>
                </div>
              </div>
            )}
          </motion.section>

          <motion.button
            onClick={handleSubmit}
            disabled={submitting}
            whileHover={shouldReduce ? {} : { scale: 1.02, boxShadow: '0 20px 60px rgba(201,168,76,0.25)' }}
            whileTap={shouldReduce ? {} : { scale: 0.98 }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: submitting ? 'rgba(192,200,212,0.2)' : 'linear-gradient(135deg, #C9A84C, #E8C76A)',
              color: '#0D1117', fontWeight: 900, padding: '16px', borderRadius: 18, border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, textTransform: 'uppercase',
              letterSpacing: '0.08em', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <Sparkles size={18} />
            {submitting ? '...' : t.submit}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedOrderPage;
