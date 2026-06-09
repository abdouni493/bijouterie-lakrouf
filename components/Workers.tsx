
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Plus, Users, Wallet, Calendar, History, Trash2, Edit2,
  MinusCircle, PlusCircle, X, TrendingUp, CreditCard,
  Calculator, User, Phone, DollarSign, Lock
} from 'lucide-react';
import { useApp } from '../AppContext';
import { supabase } from '../supabase';
import { translations } from '../translations';
import { Worker } from '../types';

const Workers: React.FC = () => {
  const {
    workers, workerAdvances, workerAbsences, workerPayments,
    addWorker, updateWorker, deleteWorker,
    addAdvance, addAbsence, addWorkerPayment, language
  } = useApp();

  const t = translations[language];
  const shouldReduce = useReducedMotion();

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [activeWorker, setActiveWorker] = useState<Worker | null>(null);
  const [modalType, setModalType] = useState<'advance' | 'absence' | 'payment' | 'history' | null>(null);

  // Form State for Modals
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const getWorkerStats = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return { advances: 0, absences: 0, payments: 0, remaining: 0 };

    const advances = workerAdvances.filter(a => a.workerId === workerId).reduce((sum, a) => sum + a.amount, 0);
    const absences = workerAbsences.filter(a => a.workerId === workerId).reduce((sum, a) => sum + a.deduction, 0);
    const payments = workerPayments.filter(p => p.workerId === workerId).reduce((sum, p) => sum + p.amount, 0);

    return {
      advances,
      absences,
      payments,
      remaining: worker.salary - advances - absences - payments
    };
  };

  const handleWorkerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: any = {
      fullName: fd.get('fullName') as string,
      phone: fd.get('phone') as string,
      address: fd.get('address') as string,
      paymentType: fd.get('paymentType') as 'monthly' | 'daily',
      salary: parseFloat(fd.get('salary') as string),
      username: fd.get('username') as string,
      password: (fd.get('password') as string) || 'worker123'
    };

    const createdAtStr = fd.get('createdAt') as string;
    if (createdAtStr) {
      data.createdAt = new Date(createdAtStr).toISOString();
    }

    if (editingWorker) {
      updateWorker(editingWorker.id, data);
      // Update Supabase auth password if changed
      if (data.password && data.password !== editingWorker.password) {
        const workerEmail = `${data.username || editingWorker.username}@bijouterie.app`;
        // Re-create with new password via admin workaround: sign up again (upserts if same email)
        supabase.auth.signUp({
          email: workerEmail,
          password: data.password,
          options: { data: { role: 'worker', name: data.fullName || editingWorker.fullName } },
        }).then(() => {});
      }
    } else {
      addWorker(data);
      // Create Supabase auth account for the worker
      if (data.username && data.password) {
        supabase.auth.signUp({
          email: `${data.username}@bijouterie.app`,
          password: data.password,
          options: { data: { role: 'worker', name: data.fullName } },
        }).then(({ error }) => {
          if (error) console.warn('[worker auth signup]', error.message);
        });
      }
    }
    closeMainModals();
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorker || !amount) return;

    const val = parseFloat(amount);
    const recordDate = new Date(date).toISOString();

    if (modalType === 'advance') {
      addAdvance({ workerId: activeWorker.id, amount: val, date: recordDate });
    } else if (modalType === 'absence') {
      addAbsence({ workerId: activeWorker.id, deduction: val, date: recordDate });
    } else if (modalType === 'payment') {
      if (activeWorker.paymentType === 'monthly') {
        const ok = confirm(`Confirmer le paiement mensuel pour ${activeWorker.fullName} ?`);
        if (!ok) return;
      }
      addWorkerPayment({ workerId: activeWorker.id, amount: val, date: recordDate });
    }

    closeActionModal();
  };

  const closeMainModals = () => {
    setShowAddModal(false); setEditingWorker(null);
  };

  const closeActionModal = () => {
    setModalType(null); setActiveWorker(null); setAmount(''); setDate(new Date().toISOString().split('T')[0]);
  };

  const totalSalaries = workers.reduce((sum, w) => sum + w.salary, 0);
  const totalWorkers = workers.length;

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
          <h1 className="section-title">{t.workers}</h1>
          <p className="section-subtitle">Gestion de l'équipe & paie</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          <Plus size={18} /> {t.newWorker}
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="lux-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Employés</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalWorkers}</p>
          </div>
        </div>
        <div className="lux-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={24} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Masse Salariale</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalSalaries.toLocaleString()} <span style={{ fontSize: 12, color: 'var(--gold)' }}>DZD</span></p>
          </div>
        </div>
      </div>

      {/* Worker Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {workers.map(w => {
          const stats = getWorkerStats(w.id);
          return (
            <div key={w.id} className="lux-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: 'linear-gradient(135deg, var(--gold) 0%, #b8922a 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 800, color: 'var(--deep-bg)'
                  }}>
                    {w.fullName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', margin: 0, letterSpacing: '-0.02em' }}>{w.fullName}</p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '3px 0 0' }}>
                      {t[w.paymentType]} &bull; {w.salary.toLocaleString()} DZD
                    </p>
                    {w.createdAt && (
                      <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--silver-400)', margin: '2px 0 0' }}>
                        Depuis le {new Date(w.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditingWorker(w)} className="btn-icon" title="Modifier"><Edit2 size={15} /></button>
                  <button onClick={() => { if (confirm(t.delete + ' ?')) deleteWorker(w.id); }} className="btn-icon danger" title="Supprimer"><Trash2 size={15} /></button>
                </div>
              </div>

              {/* Mini Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>{t.totalAdvances}</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#818cf8', margin: 0 }}>{stats.advances.toLocaleString()} <span style={{ fontSize: 9 }}>DZD</span></p>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>{t.totalAbsences}</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)', margin: 0 }}>{stats.absences.toLocaleString()} <span style={{ fontSize: 9 }}>DZD</span></p>
                </div>
              </div>

              {/* Net Pay Banner */}
              <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>{t.netPay}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>
                    {stats.remaining.toLocaleString()} <span style={{ fontSize: 12, color: 'var(--gold)' }}>DZD</span>
                  </p>
                </div>
                <Wallet size={22} style={{ color: 'var(--gold)' }} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => { setActiveWorker(w); setModalType('advance'); }}
                  style={{ padding: '10px 8px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s' }}
                >
                  <PlusCircle size={13} /> {t.advance}
                </button>
                <button
                  onClick={() => { setActiveWorker(w); setModalType('absence'); }}
                  style={{ padding: '10px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s' }}
                >
                  <MinusCircle size={13} /> {t.absence}
                </button>
                <button
                  onClick={() => { setActiveWorker(w); setModalType('payment'); setAmount(stats.remaining.toString()); }}
                  style={{ padding: '10px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s' }}
                >
                  <CreditCard size={13} /> {t.paid}
                </button>
                <button
                  onClick={() => { setActiveWorker(w); setModalType('history'); }}
                  style={{ padding: '10px 8px', borderRadius: 10, background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.15)', color: 'var(--silver-300)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.18s' }}
                >
                  <History size={13} /> {t.history}
                </button>
              </div>
            </div>
          );
        })}

        {workers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 0', color: 'var(--silver-400)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Aucun employé enregistré
          </div>
        )}
      </div>

      {/* Add / Edit Worker Modal */}
      <AnimatePresence>
        {(showAddModal || editingWorker) && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMainModals}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 520, width: '100%' }}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>
                    {editingWorker ? t.edit : t.newWorker}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                    Informations de l'employé
                  </p>
                </div>
                <button onClick={closeMainModals} className="btn-icon"><X size={18} /></button>
              </div>

              <form onSubmit={handleWorkerSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Full Name */}
                  <div>
                    <label className="lux-label">Nom Complet</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-400)', pointerEvents: 'none' }} />
                      <input
                        name="fullName"
                        required
                        defaultValue={editingWorker?.fullName}
                        placeholder="Ex: Mohamed Ali"
                        className="lux-input"
                        style={{ paddingLeft: 40 }}
                      />
                    </div>
                  </div>

                  {/* Payment Type + Salary */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label className="lux-label">Type Paiement</label>
                      <select name="paymentType" defaultValue={editingWorker?.paymentType} className="lux-select">
                        <option value="monthly">Mensuel</option>
                        <option value="daily">Journalier</option>
                      </select>
                    </div>
                    <div>
                      <label className="lux-label">Salaire (DZD)</label>
                      <div style={{ position: 'relative' }}>
                        <DollarSign size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-400)', pointerEvents: 'none' }} />
                        <input
                          name="salary"
                          type="number"
                          required
                          defaultValue={editingWorker?.salary}
                          placeholder="60000"
                          className="lux-input"
                          style={{ paddingLeft: 40 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Username + Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label className="lux-label">Identifiant</label>
                      <input
                        name="username"
                        required
                        defaultValue={editingWorker?.username}
                        placeholder="nom_utilisateur"
                        className="lux-input"
                      />
                    </div>
                    <div>
                      <label className="lux-label">Mot de passe</label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-400)', pointerEvents: 'none' }} />
                        <input
                          name="password"
                          type="text"
                          required
                          defaultValue={editingWorker?.password}
                          placeholder="••••••••"
                          className="lux-input"
                          style={{ paddingLeft: 40 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="lux-label">Téléphone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-400)', pointerEvents: 'none' }} />
                      <input
                        name="phone"
                        defaultValue={editingWorker?.phone}
                        placeholder="05XX..."
                        className="lux-input"
                        style={{ paddingLeft: 40 }}
                      />
                    </div>
                  </div>

                  {/* Date Creation */}
                  <div>
                    <label className="lux-label">Date Création</label>
                    <input
                      name="createdAt"
                      type="date"
                      defaultValue={editingWorker?.createdAt ? new Date(editingWorker.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      className="lux-input"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={closeMainModals} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal: Advance / Absence / Payment */}
      <AnimatePresence>
        {modalType && modalType !== 'history' && activeWorker && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeActionModal}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 440, width: '100%' }}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {modalType === 'advance' && <PlusCircle size={20} style={{ color: '#818cf8' }} />}
                    {modalType === 'absence' && <MinusCircle size={20} style={{ color: 'var(--danger)' }} />}
                    {modalType === 'payment' && <Calculator size={20} style={{ color: '#34d399' }} />}
                    {t[modalType] || (modalType === 'payment' ? 'Paiement' : modalType)}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                    {activeWorker.fullName}
                  </p>
                </div>
                <button onClick={closeActionModal} className="btn-icon"><X size={18} /></button>
              </div>

              <form onSubmit={handleActionSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Employee Summary */}
                  {modalType === 'payment' && (
                    <div style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.18)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--silver-300)', fontWeight: 600 }}>
                        <span>Salaire de base</span>
                        <span style={{ color: 'var(--silver-100)', fontWeight: 700 }}>{activeWorker.salary.toLocaleString()} DZD</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>
                        <span>Avances & Absences</span>
                        <span>-{(getWorkerStats(activeWorker.id).advances + getWorkerStats(activeWorker.id).absences).toLocaleString()} DZD</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#34d399', fontWeight: 800, paddingTop: 8, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                        <span>Dû restant</span>
                        <span>{getWorkerStats(activeWorker.id).remaining.toLocaleString()} DZD</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="lux-label">Montant (DZD)</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="lux-input"
                    />
                  </div>
                  <div>
                    <label className="lux-label">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="lux-input"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={closeActionModal} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Confirmer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {modalType === 'history' && activeWorker && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeActionModal}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 600, width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <History size={20} style={{ color: 'var(--gold)' }} />
                    Historique Financier
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                    {activeWorker.fullName}
                  </p>
                </div>
                <button onClick={closeActionModal} className="btn-icon"><X size={18} /></button>
              </div>

              <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Advances */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 4, height: 20, borderRadius: 4, background: '#818cf8' }} />
                    <p style={{ fontSize: 10, fontWeight: 800, color: '#818cf8', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Avances</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {workerAdvances.filter(a => a.workerId === activeWorker.id).map(a => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <PlusCircle size={16} style={{ color: '#818cf8' }} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver-100)', margin: 0 }}>{new Date(a.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Versement anticipé</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#818cf8' }}>-{a.amount.toLocaleString()} DZD</span>
                      </div>
                    ))}
                    {workerAdvances.filter(a => a.workerId === activeWorker.id).length === 0 && (
                      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--silver-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 0' }}>Aucune avance enregistrée</p>
                    )}
                  </div>
                </div>

                {/* Absences */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 4, height: 20, borderRadius: 4, background: 'var(--danger)' }} />
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--danger)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Absences</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {workerAbsences.filter(a => a.workerId === activeWorker.id).map(a => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <MinusCircle size={16} style={{ color: 'var(--danger)' }} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver-100)', margin: 0 }}>{new Date(a.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Déduction absence</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)' }}>-{a.deduction.toLocaleString()} DZD</span>
                      </div>
                    ))}
                    {workerAbsences.filter(a => a.workerId === activeWorker.id).length === 0 && (
                      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--silver-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 0' }}>Aucune absence enregistrée</p>
                    )}
                  </div>
                </div>

                {/* Payments */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 4, height: 20, borderRadius: 4, background: '#34d399' }} />
                    <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Paiements Mensuels</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {workerPayments.filter(p => p.workerId === activeWorker.id).map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <TrendingUp size={16} style={{ color: '#34d399' }} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver-100)', margin: 0 }}>{new Date(p.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Règlement salaire</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>+{p.amount.toLocaleString()} DZD</span>
                      </div>
                    ))}
                    {workerPayments.filter(p => p.workerId === activeWorker.id).length === 0 && (
                      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--silver-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 0' }}>Aucun paiement effectué</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer summary */}
              <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Dû Final</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.03em', margin: 0 }}>
                    {getWorkerStats(activeWorker.id).remaining.toLocaleString()} DZD
                  </p>
                </div>
                <button onClick={closeActionModal} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
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

export default Workers;
