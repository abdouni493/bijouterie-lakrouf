import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, DollarSign, History, TrendingDown, User, Phone } from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, addClientPayment, deleteClientPayment, addClientRecuperation, deleteClientRecuperation, language } = useApp();
  const t = translations[language];
  const shouldReduce = useReducedMotion();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentClientId, setPaymentClientId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [showRecuperationModal, setShowRecuperationModal] = useState(false);
  const [recuperationClientId, setRecuperationClientId] = useState<string | null>(null);
  const [recuperationAmount, setRecuperationAmount] = useState<number>(0);
  const [recuperationDate, setRecuperationDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [historyClientId, setHistoryClientId] = useState<string | null>(null);

  const closeShowModal = () => {
    setShowModal(false);
  };
  const closeShowPaymentModal = () => {
    setShowPaymentModal(false);
  };
  const closeShowRecuperationModal = () => {
    setShowRecuperationModal(false);
  };
  const closeHistoryClientId = () => {
    setHistoryClientId(null);
  };

  const openAdd = () => { setEditingId(null); setName(''); setPhone(''); setNote(''); setShowModal(true); };
  const openEdit = (c: any) => { setEditingId(c.id); setName(c.name); setPhone(c.phone || ''); setNote(c.note || ''); setShowModal(true); };

  const submitClient = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    if (editingId) updateClient(editingId, { name: name.trim(), phone: phone.trim(), note: note.trim() });
    else addClient({ name: name.trim(), phone: phone.trim(), note: note.trim() });
    closeShowModal();
  };

  const openAddPayment = (clientId: string) => {
    setPaymentClientId(clientId); setPaymentAmount(0); setPaymentDate(new Date().toISOString().split('T')[0]); setShowPaymentModal(true);
  };
  const submitPayment = () => {
    if (!paymentClientId || !paymentAmount) return;
    addClientPayment(paymentClientId, { amount: Number(paymentAmount), date: new Date(paymentDate).toISOString() });
    closeShowPaymentModal();
  };

  const openAddRecuperation = (clientId: string) => {
    setRecuperationClientId(clientId); setRecuperationAmount(0); setRecuperationDate(new Date().toISOString().split('T')[0]); setShowRecuperationModal(true);
  };
  const submitRecuperation = () => {
    if (!recuperationClientId || !recuperationAmount) return;
    addClientRecuperation(recuperationClientId, { amount: Number(recuperationAmount), date: new Date(recuperationDate).toISOString() });
    closeShowRecuperationModal();
  };

  const clientTotal = (c: any) => (c.payments || []).reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
  const clientRecuperated = (c: any) => (c.recuperations || []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
  const clientBalance = (c: any) => clientTotal(c) - clientRecuperated(c);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div>
          <div className="silver-line" />
          <h1 className="section-title">{t.clients}</h1>
          <p className="section-subtitle">{language === 'ar' ? 'إدارة العملاء والقروض' : 'Gestion des clients et crédits'}</p>
        </div>
        <motion.button
          onClick={openAdd}
          whileHover={shouldReduce ? {} : { scale: 1.03, y: -1 }}
          whileTap={shouldReduce ? {} : { scale: 0.97 }}
          className="btn-silver flex items-center gap-2 px-5 py-3 rounded-2xl text-sm"
        >
          <Plus size={18} />
          {t.addClient}
        </motion.button>
      </div>

      {clients.length === 0 && (
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(192,200,212,0.3)' }}
        >
          <User size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: 16 }}>{language === 'ar' ? 'لا يوجد عملاء بعد' : 'Aucun client pour le moment'}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((c, idx) => {
          const total = clientTotal(c);
          const recuperated = clientRecuperated(c);
          const balance = clientBalance(c);
          return (
            <motion.div
              key={c.id}
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={shouldReduce ? {} : { y: -3, borderColor: 'rgba(192,200,212,0.25)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(28,36,46,0.95), rgba(22,28,36,0.98))',
                border: '1px solid rgba(192,200,212,0.10)',
                borderRadius: 20,
                padding: 24,
                position: 'relative',
                willChange: 'transform',
                transition: 'border-color 0.25s',
              }}
            >
              {/* Top: name + actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F0F4F8', letterSpacing: '-0.02em', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</h3>
                  {c.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Phone size={11} style={{ color: 'rgba(192,200,212,0.35)' }} />
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(192,200,212,0.4)', letterSpacing: '0.04em' }}>{c.phone}</p>
                    </div>
                  )}
                  {c.note && <p style={{ fontSize: 12, color: 'rgba(192,200,212,0.35)', marginTop: 6, lineHeight: 1.4 }}>{c.note}</p>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                  <motion.button
                    onClick={() => openEdit(c)}
                    whileHover={shouldReduce ? {} : { scale: 1.1, borderColor: 'rgba(192,200,212,0.4)' }}
                    whileTap={shouldReduce ? {} : { scale: 0.9 }}
                    className="btn-icon"
                  >
                    <Edit2 size={15} />
                  </motion.button>
                  <motion.button
                    onClick={() => { if (confirm(t.delete + ' ?')) deleteClient(c.id); }}
                    whileHover={shouldReduce ? {} : { scale: 1.1 }}
                    whileTap={shouldReduce ? {} : { scale: 0.9 }}
                    className="btn-icon danger"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { label: language === 'ar' ? 'إجمالي الديون' : 'Crédit Total', value: total, color: 'rgba(143,163,184,0.15)', accent: '#8FA3B8' },
                  { label: language === 'ar' ? 'مسترد' : 'Récupéré', value: recuperated, color: 'rgba(34,211,165,0.10)', accent: '#22D3A5' },
                  { label: language === 'ar' ? 'الرصيد' : 'Solde', value: balance, color: balance > 0 ? 'rgba(201,168,76,0.10)' : 'rgba(192,200,212,0.06)', accent: balance > 0 ? '#C9A84C' : '#8FA3B8' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: stat.color, borderRadius: 12, padding: '10px 8px', border: `1px solid ${stat.color.replace('0.10', '0.2').replace('0.15', '0.25').replace('0.06', '0.12')}` }}>
                    <p style={{ fontSize: 8, fontWeight: 800, color: stat.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4, opacity: 0.8 }}>{stat.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 900, color: stat.accent }}>{stat.value.toLocaleString()} <span style={{ fontSize: 8, opacity: 0.7 }}>DA</span></p>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <motion.button
                  onClick={() => openAddPayment(c.id)}
                  whileHover={shouldReduce ? {} : { scale: 1.02 }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  style={{ padding: '10px 8px', borderRadius: 12, border: '1px solid rgba(143,163,184,0.2)', background: 'rgba(143,163,184,0.08)', color: '#8FA3B8', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <DollarSign size={13} /> {language === 'ar' ? 'إضافة دين' : 'Ajouter Crédit'}
                </motion.button>
                <motion.button
                  onClick={() => openAddRecuperation(c.id)}
                  whileHover={shouldReduce ? {} : { scale: 1.02 }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  style={{ padding: '10px 8px', borderRadius: 12, border: '1px solid rgba(34,211,165,0.2)', background: 'rgba(34,211,165,0.07)', color: '#22D3A5', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <TrendingDown size={13} /> {language === 'ar' ? 'استرداد' : 'Récupérer'}
                </motion.button>
                <motion.button
                  onClick={() => setHistoryClientId(c.id)}
                  whileHover={shouldReduce ? {} : { scale: 1.02 }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  style={{ gridColumn: '1 / -1', padding: '10px 8px', borderRadius: 12, border: '1px solid rgba(192,200,212,0.12)', background: 'rgba(192,200,212,0.05)', color: 'rgba(192,200,212,0.5)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <History size={13} /> {language === 'ar' ? 'السجل الكامل' : 'Historique Complet'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ADD/EDIT CLIENT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={e => e.target === e.currentTarget && closeShowModal()}
          >
            <motion.div
              initial={shouldReduce ? false : { scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={shouldReduce ? {} : { scale: 0.95, opacity: 0, y: 20 }}
              className="modal-box"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F0F4F8', letterSpacing: '-0.02em', margin: 0 }}>
                    {editingId ? (language === 'ar' ? 'تعديل عميل' : 'Modifier Client') : (language === 'ar' ? 'عميل جديد' : 'Nouveau Client')}
                  </h2>
                  <p style={{ fontSize: 11, color: 'rgba(192,200,212,0.4)', fontWeight: 600, marginTop: 2 }}>
                    {language === 'ar' ? 'أدخل معلومات العميل' : 'Ajouter ou modifier les informations'}
                  </p>
                </div>
                <button onClick={closeShowModal} className="btn-icon">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={submitClient}>
                <div className="modal-body space-y-4">
                  <div>
                    <label className="lux-label">{language === 'ar' ? 'اسم العميل' : 'Nom Client'}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="lux-input" placeholder={language === 'ar' ? 'الاسم الكامل' : 'Nom complet'} />
                  </div>
                  <div>
                    <label className="lux-label">{language === 'ar' ? 'الهاتف (اختياري)' : 'Téléphone (optionnel)'}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="lux-input" placeholder={language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'} />
                  </div>
                  <div>
                    <label className="lux-label">{language === 'ar' ? 'ملاحظة (اختياري)' : 'Note (optionnelle)'}</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} className="lux-input" placeholder={language === 'ar' ? 'ملاحظات إضافية' : 'Notes supplémentaires'} rows={3} style={{ resize: 'none' }} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeShowModal} className="btn-outline px-5 py-2.5 rounded-xl text-sm">
                    {language === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button type="submit" className="btn-silver px-6 py-2.5 rounded-xl text-sm">
                    {language === 'ar' ? 'حفظ' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={e => e.target === e.currentTarget && closeShowPaymentModal()}>
            <motion.div
              initial={shouldReduce ? false : { scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={shouldReduce ? {} : { scale: 0.95, opacity: 0 }}
              className="modal-box" onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(143,163,184,0.12)', border: '1px solid rgba(143,163,184,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={18} style={{ color: '#8FA3B8' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F0F4F8', margin: 0 }}>{language === 'ar' ? 'إضافة دين' : 'Ajouter Crédit'}</h2>
                    <p style={{ fontSize: 11, color: 'rgba(192,200,212,0.4)', margin: 0 }}>{language === 'ar' ? 'تسجيل دين جديد' : 'Enregistrer un crédit client'}</p>
                  </div>
                </div>
                <button onClick={closeShowPaymentModal} className="btn-icon"><X size={16} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); submitPayment(); }}>
                <div className="modal-body space-y-4">
                  <div>
                    <label className="lux-label">{language === 'ar' ? 'المبلغ (DA)' : 'Montant (DA)'}</label>
                    <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} required step="100" className="lux-input" placeholder="0" />
                  </div>
                  <div>
                    <label className="lux-label">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
                    <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required className="lux-input" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeShowPaymentModal} className="btn-outline px-5 py-2.5 rounded-xl text-sm">{language === 'ar' ? 'إلغاء' : 'Annuler'}</button>
                  <button type="submit" className="btn-silver px-6 py-2.5 rounded-xl text-sm">{language === 'ar' ? 'حفظ' : 'Enregistrer'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECUPERATION MODAL */}
      <AnimatePresence>
        {showRecuperationModal && (() => {
          const c = clients.find(x => x.id === recuperationClientId);
          const balance = c ? clientBalance(c) : 0;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={e => e.target === e.currentTarget && closeShowRecuperationModal()}>
              <motion.div
                initial={shouldReduce ? false : { scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={shouldReduce ? {} : { scale: 0.95, opacity: 0 }}
                className="modal-box" onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,211,165,0.10)', border: '1px solid rgba(34,211,165,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingDown size={18} style={{ color: '#22D3A5' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F0F4F8', margin: 0 }}>{language === 'ar' ? 'استرداد مبلغ' : 'Récupérer Argent'}</h2>
                      <p style={{ fontSize: 11, color: 'rgba(192,200,212,0.4)', margin: 0 }}>{language === 'ar' ? 'تسجيل استرداد' : 'Enregistrer une récupération'}</p>
                    </div>
                  </div>
                  <button onClick={closeShowRecuperationModal} className="btn-icon"><X size={16} /></button>
                </div>
                <form onSubmit={e => { e.preventDefault(); submitRecuperation(); }}>
                  <div className="modal-body space-y-4">
                    <div style={{ background: 'rgba(34,211,165,0.08)', border: '1px solid rgba(34,211,165,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                      <p style={{ fontSize: 9, fontWeight: 800, color: 'rgba(34,211,165,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{language === 'ar' ? 'الرصيد المتاح' : 'Solde Disponible'}</p>
                      <p style={{ fontWeight: 900, color: '#22D3A5', fontSize: 18 }}>{balance.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <label className="lux-label">{language === 'ar' ? 'المبلغ المسترد (DA)' : 'Montant à Récupérer (DA)'}</label>
                      <input type="number" value={recuperationAmount} onChange={e => setRecuperationAmount(Number(e.target.value))} required step="100" max={balance} className="lux-input" placeholder="0" />
                    </div>
                    <div>
                      <label className="lux-label">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
                      <input type="date" value={recuperationDate} onChange={e => setRecuperationDate(e.target.value)} required className="lux-input" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" onClick={closeShowRecuperationModal} className="btn-outline px-5 py-2.5 rounded-xl text-sm">{language === 'ar' ? 'إلغاء' : 'Annuler'}</button>
                    <button type="submit" className="btn-silver px-6 py-2.5 rounded-xl text-sm">{language === 'ar' ? 'حفظ' : 'Enregistrer'}</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {historyClientId && (() => {
          const c = clients.find(x => x.id === historyClientId);
          if (!c) return null;
          const total = clientTotal(c);
          const recuperated = clientRecuperated(c);
          const balance = clientBalance(c);
          const allTransactions: any[] = [
            ...(c.payments || []).map(p => ({ ...p, type: 'payment' })),
            ...(c.recuperations || []).map(r => ({ ...r, type: 'recuperation' })),
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={e => e.target === e.currentTarget && closeHistoryClientId()}>
              <motion.div
                initial={shouldReduce ? false : { scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={shouldReduce ? {} : { scale: 0.95, opacity: 0 }}
                className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#F0F4F8', margin: 0 }}>{c.name}</h2>
                    <p style={{ fontSize: 11, color: 'rgba(192,200,212,0.4)', margin: 0 }}>{c.phone || (language === 'ar' ? 'بدون هاتف' : 'Pas de téléphone')}</p>
                  </div>
                  <button onClick={closeHistoryClientId} className="btn-icon"><X size={16} /></button>
                </div>
                <div className="modal-body space-y-5">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {[
                      { label: language === 'ar' ? 'إجمالي الديون' : 'Crédit Total', value: total, accent: '#8FA3B8', bg: 'rgba(143,163,184,0.10)' },
                      { label: language === 'ar' ? 'مسترد' : 'Récupéré', value: recuperated, accent: '#22D3A5', bg: 'rgba(34,211,165,0.08)' },
                      { label: language === 'ar' ? 'الرصيد' : 'Solde', value: balance, accent: balance > 0 ? '#C9A84C' : '#8FA3B8', bg: balance > 0 ? 'rgba(201,168,76,0.08)' : 'rgba(192,200,212,0.06)' },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: stat.bg, borderRadius: 14, padding: '12px 14px', border: `1px solid ${stat.accent}25` }}>
                        <p style={{ fontSize: 8, fontWeight: 800, color: stat.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, opacity: 0.8 }}>{stat.label}</p>
                        <p style={{ fontWeight: 900, color: stat.accent, fontSize: 16 }}>{stat.value.toLocaleString()} <span style={{ fontSize: 9, opacity: 0.6 }}>DA</span></p>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(192,200,212,0.08)', paddingTop: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(192,200,212,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
                      {language === 'ar' ? 'سجل المعاملات' : 'Historique des Transactions'}
                    </p>
                    <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {allTransactions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'rgba(192,200,212,0.3)', padding: '40px 0', fontSize: 14 }}>
                          {language === 'ar' ? 'لا توجد معاملات' : 'Aucune transaction'}
                        </p>
                      ) : allTransactions.map(tx => (
                        <motion.div
                          key={tx.id}
                          whileHover={shouldReduce ? {} : { backgroundColor: 'rgba(192,200,212,0.04)' }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12,
                            background: tx.type === 'payment' ? 'rgba(143,163,184,0.06)' : 'rgba(34,211,165,0.05)',
                            border: `1px solid ${tx.type === 'payment' ? 'rgba(143,163,184,0.12)' : 'rgba(34,211,165,0.12)'}`,
                          }}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: tx.type === 'payment' ? 'rgba(143,163,184,0.12)' : 'rgba(34,211,165,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {tx.type === 'payment' ? <DollarSign size={15} style={{ color: '#8FA3B8' }} /> : <TrendingDown size={15} style={{ color: '#22D3A5' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, color: '#F0F4F8', fontSize: 13, margin: 0 }}>
                              {tx.type === 'payment' ? (language === 'ar' ? 'دين مضاف' : 'Crédit Ajouté') : (language === 'ar' ? 'مبلغ مسترد' : 'Argent Récupéré')}
                            </p>
                            <p style={{ fontSize: 11, color: 'rgba(192,200,212,0.4)', margin: 0 }}>
                              {new Date(tx.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <p style={{ fontWeight: 900, color: tx.type === 'payment' ? '#8FA3B8' : '#22D3A5', fontSize: 15 }}>
                              {tx.amount.toLocaleString()} <span style={{ fontSize: 9, opacity: 0.6 }}>DA</span>
                            </p>
                            <motion.button
                              onClick={() => { if (confirm('Supprimer ?')) { tx.type === 'payment' ? deleteClientPayment(c.id, tx.id) : deleteClientRecuperation(c.id, tx.id); } }}
                              whileHover={shouldReduce ? {} : { color: '#FF5F72' }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(192,200,212,0.25)', padding: 4 }}
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default Clients;
