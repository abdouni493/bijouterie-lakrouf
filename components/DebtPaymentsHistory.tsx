import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Printer, Edit2, Trash2, Check, Receipt, Search, Wallet, CalendarDays } from 'lucide-react';
import { printDebtHistory, printDebtReceipt } from '../utils/printDebtHistory';

export interface DebtHistoryRow {
  id: string;
  date: string;
  amount: number;
  methodLabel: string;
  methodKey?: 'cash' | 'silver' | 'gold' | 'other';
  details?: string;
  note?: string;
  /** Extra key/value chips rendered under the row. */
  meta?: { label: string; value: string }[];
}

export interface DebtHistorySummary {
  label: string;
  value: number;
  accent: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  partyLabel: string;
  partyName: string;
  partyPhone?: string;
  partyAddress?: string;
  summary: DebtHistorySummary[];
  rows: DebtHistoryRow[];
  onSave: (id: string, patch: { amount: number; date: string; note: string }) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  language: 'fr' | 'ar';
  settings: any;
  /** Shown when the party has no recorded payment yet. */
  emptyLabel?: string;
}

const METHOD_ACCENT: Record<string, string> = {
  cash: 'var(--teal)',
  silver: 'var(--silver-200)',
  gold: 'var(--gold)',
  other: 'var(--silver-300)',
};

const DebtPaymentsHistory: React.FC<Props> = ({
  open, onClose, title, partyLabel, partyName, partyPhone, partyAddress,
  summary, rows, onSave, onDelete, language, settings, emptyLabel,
}) => {
  const shouldReduce = useReducedMotion();
  const isAr = language === 'ar';

  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter(r => {
        if (q && !`${r.methodLabel} ${r.details || ''} ${r.note || ''} ${r.amount}`.toLowerCase().includes(q)) return false;
        const t = new Date(r.date).getTime();
        if (fromDate && t < new Date(fromDate).getTime()) return false;
        if (toDate && t > new Date(toDate).getTime() + 86400000 - 1) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rows, search, fromDate, toDate]);

  const filteredTotal = filtered.reduce((a, b) => a + (Number(b.amount) || 0), 0);

  const openEdit = (r: DebtHistoryRow) => {
    setEditingId(r.id);
    setEditAmount(String(r.amount));
    setEditDate(new Date(r.date).toISOString().split('T')[0]);
    setEditNote(r.note || '');
  };

  const cancelEdit = () => { setEditingId(null); setEditAmount(''); setEditDate(''); setEditNote(''); };

  const commitEdit = async (id: string) => {
    const amount = Number(editAmount);
    if (!amount || amount <= 0) { alert(isAr ? 'المبلغ غير صالح' : 'Montant invalide'); return; }
    await onSave(id, { amount, date: new Date(editDate).toISOString(), note: editNote.trim() });
    cancelEdit();
  };

  const toPrintable = (r: DebtHistoryRow) => ({
    id: r.id, date: r.date, amount: r.amount,
    methodLabel: r.methodLabel, details: r.details, note: r.note,
  });

  const handlePrintAll = () => {
    printDebtHistory(settings, {
      title,
      partyLabel,
      partyName,
      partyPhone,
      partyAddress,
      summary: summary.map(sr => ({ label: sr.label, value: sr.value })),
      payments: filtered.map(toPrintable),
      language,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal-box"
            style={{ maxWidth: 940, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
            initial={shouldReduce ? false : { scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={shouldReduce ? {} : { scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Receipt size={20} style={{ color: 'var(--gold)' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="silver-line" style={{ marginBottom: 4 }} />
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {isAr ? 'سجل تسديد الديون' : 'Historique des Paiements de Dettes'}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2px 0 0' }}>
                    {partyName}{partyPhone ? ` — ${partyPhone}` : ''}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={handlePrintAll} className="btn-icon" title={isAr ? 'طباعة' : 'Imprimer'}>
                  <Printer size={17} />
                </button>
                <button onClick={onClose} className="btn-icon"><X size={18} /></button>
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: '0 24px 14px', display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, gap: 12 }}>
              {summary.map(sr => (
                <div key={sr.label} style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: sr.accent, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0, opacity: 0.85 }}>{sr.label}</p>
                  <p style={{ fontSize: 17, fontWeight: 900, color: sr.accent, margin: '5px 0 0' }}>
                    {sr.value.toLocaleString()} <span style={{ fontSize: 9, opacity: 0.6 }}>DZD</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ padding: '0 24px 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="lux-search" style={{ flex: '1 1 220px', minWidth: 180 }}>
                <Search size={15} style={{ color: 'var(--silver-400)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={isAr ? 'بحث في المدفوعات' : 'Rechercher un paiement'}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarDays size={15} style={{ color: 'var(--silver-400)' }} />
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="lux-input" style={{ padding: '8px 10px', fontSize: 12, width: 148 }} />
                <span style={{ color: 'var(--silver-400)', fontWeight: 700 }}>→</span>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="lux-input" style={{ padding: '8px 10px', fontSize: 12, width: 148 }} />
              </div>
              {(search || fromDate || toDate) && (
                <button
                  onClick={() => { setSearch(''); setFromDate(''); setToDate(''); }}
                  className="btn-outline"
                  style={{ padding: '8px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  {isAr ? 'إعادة تعيين' : 'Réinitialiser'}
                </button>
              )}
            </div>

            {/* Rows */}
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 0 }}>
              {filtered.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '52px 0' }}>
                  <Wallet size={44} style={{ color: 'var(--silver-400)', opacity: 0.35 }} />
                  <p style={{ fontWeight: 800, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, margin: 0 }}>
                    {emptyLabel || (isAr ? 'لا يوجد تسديد مسجل' : 'Aucun paiement de dette enregistré')}
                  </p>
                </div>
              ) : filtered.map(r => {
                const accent = METHOD_ACCENT[r.methodKey || 'other'] || 'var(--silver-300)';
                const isEditing = editingId === r.id;
                return (
                  <div key={r.id} className="lux-card" style={{ padding: 16, borderLeft: `3px solid ${accent}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span className="badge badge-platinum">{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                          <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, color: accent, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                            {r.methodLabel}
                          </span>
                        </div>
                        {r.details && (
                          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--silver-200)', margin: '8px 0 0' }}>{r.details}</p>
                        )}
                        {r.meta && r.meta.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {r.meta.map(m => (
                              <span key={m.label} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', fontSize: 11, fontWeight: 700, color: 'var(--silver-300)' }}>
                                {m.label}: <span style={{ color: 'var(--silver-100)' }}>{m.value}</span>
                              </span>
                            ))}
                          </div>
                        )}
                        {r.note && (
                          <p style={{ fontSize: 11.5, color: 'var(--silver-400)', margin: '8px 0 0', fontStyle: 'italic' }}>“{r.note}”</p>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <p style={{ fontSize: 18, fontWeight: 900, color: accent, margin: 0, whiteSpace: 'nowrap' }}>
                          {r.amount.toLocaleString()} <span style={{ fontSize: 10, opacity: 0.6 }}>DZD</span>
                        </p>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => printDebtReceipt(settings, { partyLabel, partyName, partyPhone, payment: toPrintable(r) })}
                            className="btn-icon"
                            title={isAr ? 'طباعة الوصل' : 'Imprimer le reçu'}
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            onClick={() => (isEditing ? cancelEdit() : openEdit(r))}
                            className="btn-icon"
                            title={isAr ? 'تعديل' : 'Modifier'}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(isAr ? 'حذف هذا التسديد؟ سيتم تحديث رصيد الدين.' : 'Supprimer ce paiement ? Le solde de la dette sera recalculé.')) onDelete(r.id);
                            }}
                            className="btn-icon danger"
                            title={isAr ? 'حذف' : 'Supprimer'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={shouldReduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={shouldReduce ? {} : { height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, alignItems: 'end' }}>
                            <div>
                              <label className="lux-label">{isAr ? 'المبلغ (DZD)' : 'Montant (DZD)'}</label>
                              <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)} className="lux-input" />
                            </div>
                            <div>
                              <label className="lux-label">{isAr ? 'التاريخ' : 'Date'}</label>
                              <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="lux-input" />
                            </div>
                            <div>
                              <label className="lux-label">{isAr ? 'ملاحظة' : 'Note'}</label>
                              <input type="text" value={editNote} onChange={e => setEditNote(e.target.value)} className="lux-input" placeholder={isAr ? 'اختياري' : 'Optionnel'} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={cancelEdit} className="btn-outline" style={{ flex: 1, padding: '10px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                {isAr ? 'إلغاء' : 'Annuler'}
                              </button>
                              <button onClick={() => commitEdit(r.id)} className="btn-gold" style={{ flex: 1, padding: '10px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Check size={14} /> {isAr ? 'حفظ' : 'Enregistrer'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {filtered.length} {isAr ? 'تسديد' : 'paiement(s)'} —
                </span>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--gold)' }}>{filteredTotal.toLocaleString()} DZD</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handlePrintAll} className="btn-gold" style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Printer size={15} /> {isAr ? 'طباعة السجل' : "Imprimer l'historique"}
                </button>
                <button onClick={onClose} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {isAr ? 'إغلاق' : 'Fermer'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DebtPaymentsHistory;
