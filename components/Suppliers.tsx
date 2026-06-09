
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Search, MapPin, Phone, Edit, Trash2, History, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';
import { Supplier } from '../types';

const Suppliers: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, purchases, language } = useApp();
  const t = translations[language];
  const shouldReduce = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'purchases' | 'debts'>('all');

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const address = fd.get('address') as string;

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, { name, phone, address });
    } else {
      addSupplier({ name, phone, address });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAddModal(false); setEditingSupplier(null);
  };

  const closeSelectedHistory = () => {
    setSelectedHistory(null); setHistoryFilter('all');
  };

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 14, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as any }}
      style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
    >
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="silver-line" />
          <h1 className="section-title">{t.suppliers}</h1>
          <p className="section-subtitle">Gestion des fournisseurs</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div className="lux-search">
            <Search size={16} style={{ color: 'var(--silver-400)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t.supplierName}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--silver-100)', fontWeight: 600, fontSize: 14, flex: 1, minWidth: 0 }}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            <Plus size={18} />
            <span>{language === 'ar' ? 'إضافة مورد' : 'Nouveau Fournisseur'}</span>
          </button>
        </div>
      </div>

      {/* Suppliers grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
        {filtered.map((s, idx) => (
          <motion.div
            key={s.id}
            className="lux-card"
            style={{ padding: 28 }}
            initial={shouldReduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18, background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--gold)', fontWeight: 900, fontSize: 22
              }}>
                {s.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setEditingSupplier(s)}
                  className="btn-icon"
                  title={t.edit}
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() => { if (confirm(t.delete + ' ?')) deleteSupplier(s.id); }}
                  className="btn-icon danger"
                  title={t.delete}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', marginBottom: 16, letterSpacing: '-0.02em' }}>{s.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={14} style={{ color: 'var(--silver-300)' }} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--silver-200)' }}>{s.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={14} style={{ color: 'var(--silver-300)' }} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--silver-200)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedHistory(s.id)}
              style={{
                width: '100%', marginTop: 20, padding: '12px 0',
                border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)',
                color: 'var(--silver-200)', fontWeight: 800, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--silver-200)'; }}
            >
              <History size={14} />
              {t.history}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add / Edit Supplier Modal */}
      <AnimatePresence>
        {(showAddModal || editingSupplier) && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-box"
              style={{ maxWidth: 480 }}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>
                    {editingSupplier ? t.edit : 'Nouvelle Société'}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                    {editingSupplier ? 'Modifier les informations' : 'Ajouter un fournisseur'}
                  </p>
                </div>
                <button onClick={closeModal} className="btn-icon"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label className="lux-label">{t.supplierName}</label>
                    <input
                      name="name"
                      required
                      placeholder="Nom de l'établissement"
                      defaultValue={editingSupplier?.name || ''}
                      className="lux-input"
                    />
                  </div>
                  <div>
                    <label className="lux-label">{t.phone}</label>
                    <input
                      name="phone"
                      required
                      placeholder="05XX XX XX XX"
                      defaultValue={editingSupplier?.phone || ''}
                      className="lux-input"
                    />
                  </div>
                  <div>
                    <label className="lux-label">{t.address}</label>
                    <textarea
                      name="address"
                      required
                      placeholder="Adresse complète"
                      defaultValue={editingSupplier?.address || ''}
                      className="lux-input"
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeModal} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {t.cancel}
                  </button>
                  <button type="submit" className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {t.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {selectedHistory && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSelectedHistory}
          >
            <motion.div
              className="modal-box"
              style={{ maxWidth: 900, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <History size={20} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <div className="silver-line" style={{ marginBottom: 4 }} />
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>
                      {t.history} — {suppliers.find(s => s.id === selectedHistory)?.name}
                    </h2>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2px 0 0' }}>
                      Historique des achats
                    </p>
                  </div>
                </div>
                <button onClick={closeSelectedHistory} className="btn-icon"><X size={18} /></button>
              </div>

              {/* Filter Buttons */}
              <div style={{ padding: '0 24px 16px', display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setHistoryFilter('all')}
                  style={{
                    padding: '8px 18px', borderRadius: 10, fontWeight: 800, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', border: 'none',
                    background: historyFilter === 'all' ? 'rgba(201,168,76,0.18)' : 'var(--card-bg)',
                    color: historyFilter === 'all' ? 'var(--gold)' : 'var(--silver-300)',
                    transition: 'all 0.2s'
                  }}
                >
                  Tous
                </button>
                <button
                  onClick={() => setHistoryFilter('purchases')}
                  style={{
                    padding: '8px 18px', borderRadius: 10, fontWeight: 800, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', border: 'none',
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: historyFilter === 'purchases' ? 'rgba(20,184,166,0.15)' : 'var(--card-bg)',
                    color: historyFilter === 'purchases' ? 'var(--teal)' : 'var(--silver-300)',
                    transition: 'all 0.2s'
                  }}
                >
                  <ShoppingCart size={13} /> Achats
                </button>
                <button
                  onClick={() => setHistoryFilter('debts')}
                  style={{
                    padding: '8px 18px', borderRadius: 10, fontWeight: 800, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', border: 'none',
                    background: historyFilter === 'debts' ? 'rgba(220,38,38,0.15)' : 'var(--card-bg)',
                    color: historyFilter === 'debts' ? 'var(--danger)' : 'var(--silver-300)',
                    transition: 'all 0.2s'
                  }}
                >
                  Dettes
                </button>
              </div>

              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(() => {
                  const supPurchases = purchases.filter(p => {
                    if (p.supplierId !== selectedHistory) return false;
                    if (historyFilter === 'all') return true;
                    const invoiceTotal = p.items.reduce((a, b) => a + (b.totalPrice || 0), 0);
                    const paid = (p.amountPaid !== undefined && p.amountPaid !== null) ? p.amountPaid : (p.payment?.total || 0);
                    const remaining = Math.max(0, invoiceTotal - paid);
                    if (historyFilter === 'debts') return remaining > 0;
                    if (historyFilter === 'purchases') return remaining === 0;
                    return true;
                  });
                  const totalWeight = supPurchases.reduce((a, p) => a + p.items.reduce((x, it) => x + it.weight, 0), 0);
                  const totalAmount = supPurchases.reduce((a, p) => a + p.items.reduce((x, it) => x + (it.totalPrice || 0), 0), 0);
                  const totalDebts = supPurchases.reduce((a, p) => {
                    const invoiceTotal = p.items.reduce((x, it) => x + (it.totalPrice || 0), 0);
                    const paid = (p.amountPaid !== undefined && p.amountPaid !== null) ? p.amountPaid : (p.payment?.total || 0);
                    const remaining = Math.max(0, invoiceTotal - paid);
                    return a + remaining;
                  }, 0);
                  const invoicesWithDebts = supPurchases.filter(p => {
                    const invoiceTotal = p.items.reduce((x, it) => x + (it.totalPrice || 0), 0);
                    const paid = (p.amountPaid !== undefined && p.amountPaid !== null) ? p.amountPaid : (p.payment?.total || 0);
                    const remaining = Math.max(0, invoiceTotal - paid);
                    return remaining > 0;
                  }).length;

                  return (
                    <>
                      {/* Summary Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                        <div className="lux-card" style={{ padding: 20 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Total Achats</p>
                          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--silver-100)', margin: '4px 0 2px' }}>{supPurchases.length}</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>{totalAmount.toLocaleString()} DZD</p>
                        </div>
                        <div className="lux-card" style={{ padding: 20 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Poids Total</p>
                          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--silver-100)', margin: '4px 0 0' }}>{totalWeight.toFixed(2)}g</p>
                        </div>
                        <div className="lux-card" style={{ padding: 20 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Dettes</p>
                          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)', margin: '4px 0 2px' }}>{totalDebts.toLocaleString()} DZD</p>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-400)', margin: 0 }}>{invoicesWithDebts} facture(s)</p>
                        </div>
                      </div>

                      {supPurchases.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: '40px 0' }}>
                          <ShoppingCart size={48} style={{ color: 'var(--silver-400)', opacity: 0.4 }} />
                          <p style={{ fontWeight: 800, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12 }}>Aucun achat enregistré</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {supPurchases.map(p => {
                            const invoiceTotal = p.items.reduce((a, b) => a + (b.totalPrice || 0), 0);
                            const originalPayment = p.payment?.total || 0;
                            const paid = (p.amountPaid !== undefined && p.amountPaid !== null) ? p.amountPaid : originalPayment;
                            const remaining = Math.max(0, invoiceTotal - paid);
                            const debtPaymentsAmount = Math.max(0, paid - originalPayment);

                            return (
                              <div key={p.id} className="lux-card" style={{ padding: 18 }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                  <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                                      Achat du {new Date(p.date).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                      {p.items.map((item, idx) => (
                                        <span key={idx} style={{
                                          padding: '4px 10px', borderRadius: 8, border: '1px solid var(--border)',
                                          fontSize: 12, fontWeight: 700, color: 'var(--silver-200)',
                                          background: 'rgba(255,255,255,0.03)'
                                        }}>
                                          {item.weight ? `${item.weight}g` : `${(item as any).quantity || 0}x`} {item.shape ? ((t as any)[item.shape + 's'] || item.shape) : 'Cassie'}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', margin: '0 0 6px' }}>
                                      {invoiceTotal.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--silver-400)' }}>DZD</span>
                                    </p>
                                    {remaining > 0 ? (
                                      <span className="badge badge-danger">Dette: {remaining.toLocaleString()} DZD</span>
                                    ) : (
                                      <span className="badge badge-success">Entièrement Payé</span>
                                    )}
                                  </div>
                                </div>

                                {/* Payment Details */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                                    <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)' }}>
                                      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Paiement Initial</p>
                                      <p style={{ fontWeight: 700, color: 'var(--silver-100)', fontSize: 12, margin: '4px 0 0' }}>{originalPayment.toLocaleString()} DZD</p>
                                    </div>
                                    {debtPaymentsAmount > 0 && (
                                      <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
                                        <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Paiement Dette</p>
                                        <p style={{ fontWeight: 700, color: 'var(--silver-100)', fontSize: 12, margin: '4px 0 0' }}>{debtPaymentsAmount.toLocaleString()} DZD</p>
                                      </div>
                                    )}
                                    <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
                                      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Total Payé</p>
                                      <p style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 12, margin: '4px 0 0' }}>{paid.toLocaleString()} DZD</p>
                                    </div>
                                    <div style={{ padding: '10px 12px', borderRadius: 8, background: remaining > 0 ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${remaining > 0 ? 'rgba(220,38,38,0.15)' : 'var(--border)'}` }}>
                                      <p style={{ fontSize: 9, fontWeight: 700, color: remaining > 0 ? 'var(--danger)' : 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Reste</p>
                                      <p style={{ fontWeight: 700, color: remaining > 0 ? 'var(--danger)' : 'var(--silver-300)', fontSize: 12, margin: '4px 0 0' }}>{remaining.toLocaleString()} DZD</p>
                                    </div>
                                  </div>

                                  {/* Payment Method Details */}
                                  {(p.payment?.cash > 0 || p.payment?.cassieSilverGrams > 0 || p.payment?.cassieGoldGrams > 0) && (
                                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                                      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>Méthode de Paiement</p>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {p.payment?.cash > 0 && (
                                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', fontSize: 11, fontWeight: 700, color: 'var(--teal)' }}>
                                            Caisse: {p.payment.cash.toLocaleString()} DZD
                                          </span>
                                        )}
                                        {p.payment?.cassieSilverGrams > 0 && (
                                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 11, fontWeight: 700, color: 'var(--silver-200)' }}>
                                            Cassie Argent: {p.payment.cassieSilverGrams}g @ {p.payment.cassieSilverPricePerGram} DZD/g
                                          </span>
                                        )}
                                        {p.payment?.cassieGoldGrams > 0 && (
                                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>
                                            Cassie Or: {p.payment.cassieGoldGrams}g @ {p.payment.cassieGoldPricePerGram} DZD/g
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="modal-footer">
                <button
                  onClick={closeSelectedHistory}
                  className="btn-outline"
                  style={{ padding: '10px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }}
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Suppliers;
