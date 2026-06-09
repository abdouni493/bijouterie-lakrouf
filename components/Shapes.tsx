
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Gem } from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const Shapes: React.FC = () => {
  const { shapes, addShape, updateShape, deleteShape, language } = useApp();
  const t = translations[language];
  const shouldReduce = useReducedMotion();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState('');

  const openAdd = () => { setEditing(null); setValue(''); setShowModal(true); };
  const openEdit = (name: string) => { setEditing(name); setValue(name); setShowModal(true); };

  const closeShowModal = () => {
    setShowModal(false);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    if (editing) updateShape(editing, value.trim()); else addShape(value.trim());
    closeShowModal(); setValue(''); setEditing(null);
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
          <h1 className="section-title">Formes</h1>
          <p className="section-subtitle">Gérer les formes de bijoux disponibles</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-gold"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 16, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
        >
          <Plus size={18} /> Nouvelle Forme
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <div className="lux-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gem size={22} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Total Formes</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{shapes.length}</p>
          </div>
        </div>
      </div>

      {/* Shapes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {shapes.map((s, i) => (
          <motion.div
            key={s}
            initial={shouldReduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="lux-card"
            style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'var(--gold)' }}>
                {s.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--silver-100)' }}>
                {(t as any)[s + 's'] || s}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openEdit(s)} className="btn-icon" title="Modifier"><Edit2 size={14} /></button>
              <button onClick={() => { if (confirm(t.delete + ' ?')) deleteShape(s); }} className="btn-icon danger" title="Supprimer"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}

        {shapes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 0', color: 'var(--silver-400)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Aucune forme enregistrée
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeShowModal}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 420, width: '100%' }}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>
                    {editing ? 'Modifier Forme' : 'Nouvelle Forme'}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                    {editing ? 'Renommer la forme' : 'Ajouter une nouvelle forme de bijou'}
                  </p>
                </div>
                <button onClick={closeShowModal} className="btn-icon"><X size={18} /></button>
              </div>

              <form onSubmit={submit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label className="lux-label">Nom de la Forme</label>
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="lux-input"
                      placeholder="Ex: Rond, Carré, Ovale..."
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={closeShowModal} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {editing ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Shapes;
