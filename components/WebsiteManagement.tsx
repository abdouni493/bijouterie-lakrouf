import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '../AppContext';
import {
  Globe, Star, Truck, Phone, Settings as SettingsIcon,
  Plus, Eye, EyeOff, Edit2, Trash2, Link, X, Save,
  Image as ImageIcon, Play, Square, Gem,
  Facebook, Instagram, Mail, PhoneCall, MapPin, Send
} from 'lucide-react';
import { WebOffer, WebSpecialOffer, WebDeliveryCompany, WebWilayaPrice } from '../types';
import { ALGERIA_WILAYAS } from '../constants/algeriaWilayas';

type SubTab = 'offers' | 'specialOffers' | 'delivery' | 'contacts' | 'siteSettings';

const SUBTABS: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: 'offers', label: 'Offres', icon: Gem },
  { id: 'specialOffers', label: 'Offres Spéciales', icon: Star },
  { id: 'delivery', label: 'Livraison', icon: Truck },
  { id: 'contacts', label: 'Contacts', icon: Phone },
  { id: 'siteSettings', label: 'Paramètres Site', icon: SettingsIcon },
];

// ---------- Helpers ----------
function toBase64(file: File): Promise<string> {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target?.result as string);
    r.readAsDataURL(file);
  });
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--silver-100)', padding: '12px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--silver-300)', cursor: 'pointer' }}><X size={14} /></button>
    </div>
  );
}

// ==================== OFFERS TAB ====================
const OffersTab: React.FC = () => {
  const { webOffers, addWebOffer, updateWebOffer, deleteWebOffer, silverTypes, shapes } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WebOffer | null>(null);
  const [detail, setDetail] = useState<WebOffer | null>(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const empty = {
    name: '', image: null as string | null, silverTypeId: '', calibre: '', form: '',
    pricingMode: 'perGram' as 'perGram' | 'alaPiece', weight: 0, pricePerGram: 0, totalPrice: 0,
    unitPrice: 0, showQuantity: false, quantity: 0, showWeight: false, isHidden: false,
  };
  const [form, setForm] = useState(empty);

  const closeShowModal = () => { setShowModal(false);
  };
  const closeDetail = () => { setDetail(null);
  };

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (o: WebOffer) => {
    setEditing(o);
    setForm({ name: o.name, image: o.image, silverTypeId: o.silverTypeId, calibre: o.calibre, form: o.form, pricingMode: o.pricingMode, weight: o.weight ?? 0, pricePerGram: o.pricePerGram ?? 0, totalPrice: o.totalPrice, unitPrice: o.unitPrice ?? 0, showQuantity: o.showQuantity, quantity: o.quantity ?? 0, showWeight: o.showWeight ?? false, isHidden: o.isHidden });
    setShowModal(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm(f => ({ ...f, image: '' }));
      toBase64(e.target.files![0]).then(b64 => setForm(f => ({ ...f, image: b64 })));
    }
  };

  const handleSilverChange = (id: string) => {
    const st = silverTypes.find(s => s.id === id);
    setForm(f => ({ ...f, silverTypeId: id, calibre: st?.calibre || '' }));
  };

  const calcTotal = (f: typeof form) => {
    if (f.pricingMode === 'perGram') return (f.weight || 0) * (f.pricePerGram || 0);
    return f.unitPrice || 0;
  };

  const handleSave = () => {
    const total = calcTotal(form);
    const payload = { ...form, totalPrice: total };
    if (editing) updateWebOffer(editing.id, payload);
    else addWebOffer(payload);
    closeShowModal();
  };

  const handleCopyLink = (o: WebOffer) => {
    navigator.clipboard.writeText(window.location.origin + '/shop?offer=' + o.id);
    setToast('Lien copié !');
    setTimeout(() => setToast(''), 2500);
  };

  const silverName = (id: string) => silverTypes.find(s => s.id === id)?.name || id;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>Offres ({webOffers.length})</h2>
        <button onClick={openCreate} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} /> Nouvelle Offre
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {webOffers.map(o => (
          <div key={o.id} className="lux-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 160, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {o.image ? <img src={o.image} alt={o.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={36} color="var(--silver-400)" />}
            </div>
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontWeight: 700, color: 'var(--silver-100)', fontSize: 13, margin: 0 }}>{o.name}</h3>
                <span className={o.isHidden ? 'badge badge-platinum' : 'badge badge-success'}>
                  {o.isHidden ? 'Masqué' : 'Visible'}
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--silver-300)', margin: 0 }}>{silverName(o.silverTypeId)} • {o.calibre} • {o.form}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>
                {o.pricingMode === 'perGram' ? `${o.totalPrice.toLocaleString()} DA` : `${o.unitPrice?.toLocaleString()} DA / pièce`}
              </p>
              {o.showQuantity && <p style={{ fontSize: 11, color: 'var(--silver-400)', margin: 0 }}>Quantité: {o.quantity}</p>}
              <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setDetail(o)} className="btn-icon" title="Voir détails"><Eye size={14} /></button>
                <button onClick={() => openEdit(o)} className="btn-icon" title="Modifier"><Edit2 size={14} /></button>
                <button onClick={() => { if (confirm('Supprimer cette offre ?')) deleteWebOffer(o.id); }} className="btn-icon danger" title="Supprimer"><Trash2 size={14} /></button>
                <button onClick={() => updateWebOffer(o.id, { isHidden: !o.isHidden })} className="btn-icon" title={o.isHidden ? 'Afficher' : 'Masquer'}>
                  {o.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleCopyLink(o)} className="btn-icon" title="Copier le lien"><Link size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {webOffers.length === 0 && (
          <p style={{ color: 'var(--silver-400)', fontSize: 13, gridColumn: '1/-1', textAlign: 'center', padding: '48px 0' }}>
            Aucune offre. Créez votre première offre.
          </p>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeShowModal}>
            <motion.div
              className="modal-box"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
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
                    {editing ? "Modifier l'offre" : 'Nouvelle offre'}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>Gestion des offres produit</p>
                </div>
                <button onClick={closeShowModal} className="btn-icon"><X size={18} /></button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Image */}
                <div>
                  <label className="lux-label">Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {form.image ? <img src={form.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <ImageIcon size={22} color="var(--silver-400)" />}
                    </div>
                    <button onClick={() => fileRef.current?.click()} className="btn-silver" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      Choisir une image
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                  </div>
                </div>
                {/* Name */}
                <div>
                  <label className="lux-label">Nom</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                </div>
                {/* Silver type */}
                <div>
                  <label className="lux-label">Type d'argent</label>
                  <select value={form.silverTypeId} onChange={e => handleSilverChange(e.target.value)} className="lux-select" style={{ marginTop: 6 }}>
                    <option value="">-- Choisir --</option>
                    {silverTypes.filter(s => !s.isCassie).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                {/* Calibre */}
                <div>
                  <label className="lux-label">Calibre</label>
                  <input value={form.calibre} onChange={e => setForm(f => ({ ...f, calibre: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                </div>
                {/* Form/Shape */}
                <div>
                  <label className="lux-label">Forme</label>
                  <select value={form.form} onChange={e => setForm(f => ({ ...f, form: e.target.value }))} className="lux-select" style={{ marginTop: 6 }}>
                    <option value="">-- Choisir --</option>
                    {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* Pricing mode */}
                <div>
                  <label className="lux-label">Mode de tarification</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    {(['perGram', 'alaPiece'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setForm(f => ({ ...f, pricingMode: m }))}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          background: form.pricingMode === m ? 'rgba(212,175,55,0.15)' : 'transparent',
                          border: `1px solid ${form.pricingMode === m ? 'var(--gold)' : 'var(--border)'}`,
                          color: form.pricingMode === m ? 'var(--gold)' : 'var(--silver-300)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {m === 'perGram' ? 'Au Gramme' : 'À la Pièce'}
                      </button>
                    ))}
                  </div>
                </div>
                {form.pricingMode === 'perGram' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="lux-label">Poids (g)</label>
                      <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                    <div>
                      <label className="lux-label">Prix/g (DA)</label>
                      <input type="number" value={form.pricePerGram} onChange={e => setForm(f => ({ ...f, pricePerGram: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label className="lux-label">Total (DA) — auto</label>
                      <input type="number" value={form.totalPrice || calcTotal(form)} onChange={e => setForm(f => ({ ...f, totalPrice: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="lux-label">Prix unitaire (DA)</label>
                    <input type="number" value={form.unitPrice} onChange={e => setForm(f => ({ ...f, unitPrice: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                )}
                {/* Toggles row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <div
                      onClick={() => setForm(f => ({ ...f, showQuantity: !f.showQuantity }))}
                      style={{ width: 40, height: 22, borderRadius: 11, background: form.showQuantity ? 'var(--gold)' : 'var(--border)', transition: 'all 0.2s', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: form.showQuantity ? 20 : 2, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver-200)' }}>Afficher les quantités</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <div
                      onClick={() => setForm(f => ({ ...f, showWeight: !f.showWeight }))}
                      style={{ width: 40, height: 22, borderRadius: 11, background: form.showWeight ? 'var(--gold)' : 'var(--border)', transition: 'all 0.2s', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: form.showWeight ? 20 : 2, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver-200)' }}>Afficher le poids sur la carte</span>
                  </label>
                </div>
                {form.showQuantity && (
                  <div>
                    <label className="lux-label">Quantité disponible</label>
                    <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={closeShowModal} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Annuler</button>
                <button onClick={handleSave} className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Save size={15} /> Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detail && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetail}>
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Détails de l'offre</h2>
                </div>
                <button onClick={closeDetail} className="btn-icon"><X size={18} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {detail.image && <img src={detail.image} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} alt="" />}
                {[
                  { label: 'Nom', value: detail.name },
                  { label: 'Type argent', value: silverName(detail.silverTypeId) },
                  { label: 'Calibre', value: detail.calibre },
                  { label: 'Forme', value: detail.form },
                  { label: 'Mode prix', value: detail.pricingMode === 'perGram' ? 'Au gramme' : 'À la pièce' },
                  { label: 'Prix total', value: `${detail.totalPrice.toLocaleString()} DA`, gold: true },
                  { label: 'Statut', value: detail.isHidden ? 'Masqué' : 'Visible' },
                ].map(({ label, value, gold }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--silver-300)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: gold ? 'var(--gold)' : 'var(--silver-100)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
};

// ==================== SPECIAL OFFERS TAB ====================
const SpecialOffersTab: React.FC = () => {
  const { webSpecialOffers, addWebSpecialOffer, updateWebSpecialOffer, deleteWebSpecialOffer, silverTypes, shapes } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WebSpecialOffer | null>(null);
  const [detail, setDetail] = useState<WebSpecialOffer | null>(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = {
    name: '', image: null as string | null, silverTypeId: '', calibre: '', form: '',
    pricingMode: 'perGram' as 'perGram' | 'alaPiece', weight: 0, pricePerGram: 0, originalPrice: 0,
    specialPrice: 0, unitPrice: 0, showQuantity: false, quantity: 0, showWeight: false,
    isHidden: false, isActive: false, startDate: '', startHour: '', endDate: '', endHour: '',
  };
  const [form, setForm] = useState(emptyForm);

  const closeShowModal = () => { setShowModal(false);
  };
  const closeDetail = () => { setDetail(null);
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (o: WebSpecialOffer) => {
    setEditing(o);
    const origPrice = o.pricingMode === 'alaPiece' ? (o.unitPrice ?? 0) : o.originalPrice;
    setForm({ name: o.name, image: o.image, silverTypeId: o.silverTypeId, calibre: o.calibre, form: o.form, pricingMode: o.pricingMode, weight: o.weight ?? 0, pricePerGram: o.pricePerGram ?? 0, originalPrice: origPrice, specialPrice: o.specialPrice, unitPrice: o.unitPrice ?? 0, showQuantity: o.showQuantity, quantity: o.quantity ?? 0, showWeight: o.showWeight ?? false, isHidden: o.isHidden, isActive: o.isActive, startDate: o.startDate, startHour: o.startHour, endDate: o.endDate, endHour: o.endHour });
    setShowModal(true);
  };

  const handleSilverChange = (id: string) => {
    const st = silverTypes.find(s => s.id === id);
    setForm(f => ({ ...f, silverTypeId: id, calibre: st?.calibre || '' }));
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const b64 = await toBase64(e.target.files[0]);
      setForm(f => ({ ...f, image: b64 }));
    }
  };

  const handleSave = () => {
    let payload = { ...form };
    // Auto-calculate originalPrice if not explicitly set
    if (form.originalPrice === 0) {
      if (form.pricingMode === 'alaPiece') {
        payload.originalPrice = form.unitPrice;
      } else {
        payload.originalPrice = form.weight * form.pricePerGram;
      }
    }
    if (editing) updateWebSpecialOffer(editing.id, payload);
    else addWebSpecialOffer(payload);
    closeShowModal();
  };

  const handleCopyLink = (o: WebSpecialOffer) => {
    navigator.clipboard.writeText(window.location.origin + '/shop?special=' + o.id);
    setToast('Lien copié !');
    setTimeout(() => setToast(''), 2500);
  };

  const discountPct = (orig: number, special: number) => orig > 0 ? Math.round((orig - special) / orig * 100) : 0;
  const silverName = (id: string) => silverTypes.find(s => s.id === id)?.name || id;

  const Countdown: React.FC<{ endDate: string; endHour: string }> = ({ endDate, endHour }) => {
    const [remaining, setRemaining] = React.useState('');
    React.useEffect(() => {
      const end = new Date(`${endDate}T${endHour || '23:59'}`);
      const update = () => {
        const diff = end.getTime() - Date.now();
        if (diff <= 0) { setRemaining('Expiré'); return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setRemaining(`${d}j ${h}h ${m}m`);
      };
      update();
      const iv = setInterval(update, 60000);
      return () => clearInterval(iv);
    }, [endDate, endHour]);
    return <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 700 }}>⏱ {remaining}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>Offres Spéciales ({webSpecialOffers.length})</h2>
        <button onClick={openCreate} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} /> Nouvelle Offre Spéciale
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {webSpecialOffers.map(o => (
          <div key={o.id} className="lux-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 160, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {o.image ? <img src={o.image} alt={o.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={36} color="var(--silver-400)" />}
              <span className="badge badge-danger" style={{ position: 'absolute', top: 8, right: 8 }}>-{discountPct(o.originalPrice, o.specialPrice)}%</span>
            </div>
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontWeight: 700, color: 'var(--silver-100)', fontSize: 13, margin: 0 }}>{o.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className={o.isActive ? 'badge badge-success' : 'badge badge-platinum'}>{o.isActive ? 'Active' : 'Inactive'}</span>
                  <span className={o.isHidden ? 'badge badge-platinum' : 'badge badge-info'}>{o.isHidden ? 'Masqué' : 'Visible'}</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--silver-300)', margin: 0 }}>{silverName(o.silverTypeId)} • {o.calibre} • {o.form}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--silver-400)' }}>{o.originalPrice.toLocaleString()} DA</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>{o.specialPrice.toLocaleString()} DA</span>
              </div>
              {o.endDate && <Countdown endDate={o.endDate} endHour={o.endHour} />}
              <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setDetail(o)} className="btn-icon" title="Détails"><Eye size={14} /></button>
                <button onClick={() => openEdit(o)} className="btn-icon" title="Modifier"><Edit2 size={14} /></button>
                <button onClick={() => { if (confirm('Supprimer ?')) deleteWebSpecialOffer(o.id); }} className="btn-icon danger" title="Supprimer"><Trash2 size={14} /></button>
                <button onClick={() => updateWebSpecialOffer(o.id, { isHidden: !o.isHidden })} className="btn-icon"><EyeOff size={14} /></button>
                <button onClick={() => updateWebSpecialOffer(o.id, { isActive: !o.isActive })} className="btn-icon">
                  {o.isActive ? <Square size={14} /> : <Play size={14} />}
                </button>
                <button onClick={() => handleCopyLink(o)} className="btn-icon"><Link size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {webSpecialOffers.length === 0 && (
          <p style={{ color: 'var(--silver-400)', fontSize: 13, gridColumn: '1/-1', textAlign: 'center', padding: '48px 0' }}>
            Aucune offre spéciale.
          </p>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeShowModal}>
            <motion.div
              className="modal-box"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
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
                    {editing ? 'Modifier' : 'Nouvelle offre spéciale'}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>Offres promotionnelles</p>
                </div>
                <button onClick={closeShowModal} className="btn-icon"><X size={18} /></button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="lux-label">Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {form.image ? <img src={form.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <ImageIcon size={22} color="var(--silver-400)" />}
                    </div>
                    <button onClick={() => fileRef.current?.click()} className="btn-silver" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Choisir</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                  </div>
                </div>
                <div>
                  <label className="lux-label">Nom</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                </div>
                <div>
                  <label className="lux-label">Type d'argent</label>
                  <select value={form.silverTypeId} onChange={e => handleSilverChange(e.target.value)} className="lux-select" style={{ marginTop: 6 }}>
                    <option value="">-- Choisir --</option>
                    {silverTypes.filter(s => !s.isCassie).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lux-label">Calibre</label>
                  <input value={form.calibre} onChange={e => setForm(f => ({ ...f, calibre: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                </div>
                <div>
                  <label className="lux-label">Forme</label>
                  <select value={form.form} onChange={e => setForm(f => ({ ...f, form: e.target.value }))} className="lux-select" style={{ marginTop: 6 }}>
                    <option value="">-- Choisir --</option>
                    {shapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lux-label">Mode tarification</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    {(['perGram', 'alaPiece'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setForm(f => ({ ...f, pricingMode: m }))}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          background: form.pricingMode === m ? 'rgba(212,175,55,0.15)' : 'transparent',
                          border: `1px solid ${form.pricingMode === m ? 'var(--gold)' : 'var(--border)'}`,
                          color: form.pricingMode === m ? 'var(--gold)' : 'var(--silver-300)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {m === 'perGram' ? 'Au Gramme' : 'À la Pièce'}
                      </button>
                    ))}
                  </div>
                </div>
                {form.pricingMode === 'perGram' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="lux-label">Poids (g)</label>
                      <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                    <div>
                      <label className="lux-label">Prix/g</label>
                      <input type="number" value={form.pricePerGram} onChange={e => setForm(f => ({ ...f, pricePerGram: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="lux-label">Prix unitaire (DA)</label>
                    <input type="number" value={form.unitPrice} onChange={e => setForm(f => ({ ...f, unitPrice: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="lux-label">Prix original (DA)</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} placeholder={form.pricingMode === 'alaPiece' ? `Auto: ${form.unitPrice}` : `Auto: ${(form.weight * form.pricePerGram).toFixed(0)}`} />
                  </div>
                  <div>
                    <label className="lux-label">Prix spécial (DA)</label>
                    <input type="number" value={form.specialPrice} onChange={e => setForm(f => ({ ...f, specialPrice: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="lux-label">Date début</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                  <div>
                    <label className="lux-label">Heure début</label>
                    <input type="time" value={form.startHour} onChange={e => setForm(f => ({ ...f, startHour: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                  <div>
                    <label className="lux-label">Date fin</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                  <div>
                    <label className="lux-label">Heure fin</label>
                    <input type="time" value={form.endHour} onChange={e => setForm(f => ({ ...f, endHour: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <div
                      onClick={() => setForm(f => ({ ...f, showQuantity: !f.showQuantity }))}
                      style={{ width: 40, height: 22, borderRadius: 11, background: form.showQuantity ? 'var(--gold)' : 'var(--border)', transition: 'all 0.2s', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: form.showQuantity ? 20 : 2, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver-200)' }}>Afficher les quantités</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <div
                      onClick={() => setForm(f => ({ ...f, showWeight: !f.showWeight }))}
                      style={{ width: 40, height: 22, borderRadius: 11, background: form.showWeight ? 'var(--gold)' : 'var(--border)', transition: 'all 0.2s', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: form.showWeight ? 20 : 2, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver-200)' }}>Afficher le poids sur la carte</span>
                  </label>
                </div>
                {form.showQuantity && (
                  <div>
                    <label className="lux-label">Quantité</label>
                    <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button onClick={closeShowModal} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Annuler</button>
                <button onClick={handleSave} className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Save size={15} /> Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detail && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetail}>
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Détails</h2>
                </div>
                <button onClick={closeDetail} className="btn-icon"><X size={18} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {detail.image && <img src={detail.image} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12 }} alt="" />}
                {[
                  { label: 'Nom', value: detail.name },
                  { label: 'Prix original', value: `${detail.originalPrice.toLocaleString()} DA`, line: true },
                  { label: 'Prix spécial', value: `${detail.specialPrice.toLocaleString()} DA`, gold: true },
                  { label: 'Réduction', value: `${discountPct(detail.originalPrice, detail.specialPrice)}%`, danger: true },
                  { label: 'Fin', value: `${detail.endDate} ${detail.endHour}` },
                ].map(({ label, value, gold, danger, line }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--silver-300)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: gold ? 'var(--gold)' : danger ? 'var(--danger)' : 'var(--silver-100)', textDecoration: line ? 'line-through' : 'none' }}>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
    </div>
  );
};

// ==================== DELIVERY TAB ====================
const DeliveryTab: React.FC = () => {
  const { webDeliveryCompanies, addWebDeliveryCompany, updateWebDeliveryCompany, deleteWebDeliveryCompany } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [editingCompany, setEditingCompany] = useState<WebDeliveryCompany | null>(null);
  const [managingCompany, setManagingCompany] = useState<WebDeliveryCompany | null>(null);
  const [companyForm, setCompanyForm] = useState({ name: '', phone: '' });
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number | ''>('');
  const [communesInput, setCommunesInput] = useState('');

  const handleWilayaSelect = (code: number | '') => {
    setSelectedWilayaCode(code);
    if (code) {
      const wilaya = ALGERIA_WILAYAS.find(w => w.code === code);
      if (wilaya?.communes?.length) {
        setCommunesInput(wilaya.communes.join(', '));
      }
    } else {
      setCommunesInput('');
    }
  };
  const [toBureau, setToBureau] = useState(0);
  const [toHome, setToHome] = useState(0);

  const openCreate = () => { setEditingCompany(null); setCompanyForm({ name: '', phone: '' }); setShowCreate(true); };
  const openEdit = (c: WebDeliveryCompany) => { setEditingCompany(c); setCompanyForm({ name: c.name, phone: c.phone }); setShowCreate(true); };

  const closeShowCreate = () => { setShowCreate(false); setEditingCompany(null);
  };

  const closeManagingCompany = () => { setManagingCompany(null);
  };

  const saveCompany = () => {
    if (editingCompany) updateWebDeliveryCompany(editingCompany.id, companyForm);
    else addWebDeliveryCompany({ ...companyForm, wilayas: [] });
    closeShowCreate();
  };

  const addWilaya = () => {
    if (!managingCompany || !selectedWilayaCode) return;
    const wilaya = ALGERIA_WILAYAS.find(w => w.code === selectedWilayaCode);
    if (!wilaya) return;
    const communes = communesInput.split(',').map(s => s.trim()).filter(Boolean);
    const newWilaya: WebWilayaPrice = { wilayaCode: wilaya.code, wilayaName: wilaya.name, communes, toBureau, toHome };
    const updated = { ...managingCompany, wilayas: [...managingCompany.wilayas.filter(w => w.wilayaCode !== wilaya.code), newWilaya] };
    updateWebDeliveryCompany(managingCompany.id, { wilayas: updated.wilayas });
    setManagingCompany(updated);
    setSelectedWilayaCode('');
    setCommunesInput('');
    setToBureau(0);
    setToHome(0);
  };

  const deleteWilaya = (code: number) => {
    if (!managingCompany) return;
    const wilayas = managingCompany.wilayas.filter(w => w.wilayaCode !== code);
    updateWebDeliveryCompany(managingCompany.id, { wilayas });
    setManagingCompany({ ...managingCompany, wilayas });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>Sociétés de Livraison ({webDeliveryCompanies.length})</h2>
        <button onClick={openCreate} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} /> Nouvelle Société
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {webDeliveryCompanies.map(c => (
          <div key={c.id} className="lux-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--silver-100)', margin: '0 0 4px' }}>{c.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--silver-300)', margin: 0 }}>{c.phone}</p>
              <p style={{ fontSize: 11, color: 'var(--silver-400)', margin: '4px 0 0' }}>{c.wilayas.length} wilaya(s) configurée(s)</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(c)} className="btn-icon" title="Modifier"><Edit2 size={14} /></button>
              <button onClick={() => { if (confirm('Supprimer cette société ?')) deleteWebDeliveryCompany(c.id); }} className="btn-icon danger" title="Supprimer"><Trash2 size={14} /></button>
              <button
                onClick={() => setManagingCompany(c)}
                className="btn-silver"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                <Truck size={13} /> Gérer les prix
              </button>
            </div>
          </div>
        ))}
        {webDeliveryCompanies.length === 0 && (
          <p style={{ color: 'var(--silver-400)', fontSize: 13, gridColumn: '1/-1', textAlign: 'center', padding: '48px 0' }}>Aucune société de livraison.</p>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeShowCreate}>
            <motion.div
              className="modal-box"
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
                    {editingCompany ? 'Modifier' : 'Nouvelle société'}
                  </h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>Société de livraison</p>
                </div>
                <button onClick={closeShowCreate} className="btn-icon"><X size={18} /></button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="lux-label">Nom</label>
                  <input value={companyForm.name} onChange={e => setCompanyForm(f => ({ ...f, name: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                </div>
                <div>
                  <label className="lux-label">Téléphone</label>
                  <input value={companyForm.phone} onChange={e => setCompanyForm(f => ({ ...f, phone: e.target.value }))} className="lux-input" style={{ marginTop: 6 }} />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={closeShowCreate} className="btn-outline" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Annuler</button>
                <button onClick={saveCompany} className="btn-gold" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Save size={15} /> Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Wilayas Modal */}
      <AnimatePresence>
        {managingCompany && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeManagingCompany}>
            <motion.div
              className="modal-box"
              style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Prix de livraison</h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>{managingCompany.name}</p>
                </div>
                <button onClick={closeManagingCompany} className="btn-icon"><X size={18} /></button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Add wilaya form */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--silver-200)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Ajouter un wilaya</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="lux-label">Wilaya</label>
                      <select value={selectedWilayaCode} onChange={e => handleWilayaSelect(e.target.value ? +e.target.value : '')} className="lux-select" style={{ marginTop: 6 }}>
                        <option value="">-- Choisir --</option>
                        {ALGERIA_WILAYAS.map(w => <option key={w.code} value={w.code}>{w.code}. {w.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="lux-label">Communes (virgule)</label>
                      <input value={communesInput} onChange={e => setCommunesInput(e.target.value)} placeholder="Alger, Sétif..." className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                    <div>
                      <label className="lux-label">Prix bureau (DA)</label>
                      <input type="number" value={toBureau} onChange={e => setToBureau(+e.target.value)} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                    <div>
                      <label className="lux-label">Prix domicile (DA)</label>
                      <input type="number" value={toHome} onChange={e => setToHome(+e.target.value)} className="lux-input" style={{ marginTop: 6 }} />
                    </div>
                  </div>
                  <button onClick={addWilaya} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>
                    <Plus size={13} /> Ajouter
                  </button>
                </div>

                {/* Wilayas table */}
                {managingCompany.wilayas.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="lux-table">
                      <thead>
                        <tr>
                          <th>Wilaya</th>
                          <th>Communes</th>
                          <th style={{ textAlign: 'right' }}>Bureau</th>
                          <th style={{ textAlign: 'right' }}>Domicile</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {managingCompany.wilayas.map(w => (
                          <tr key={w.wilayaCode}>
                            <td style={{ fontWeight: 600, color: 'var(--silver-100)' }}>{w.wilayaCode}. {w.wilayaName}</td>
                            <td style={{ fontSize: 11, color: 'var(--silver-300)' }}>{w.communes.join(', ')}</td>
                            <td style={{ textAlign: 'right', color: 'var(--silver-200)' }}>{w.toBureau.toLocaleString()} DA</td>
                            <td style={{ textAlign: 'right', color: 'var(--silver-200)' }}>{w.toHome.toLocaleString()} DA</td>
                            <td>
                              <button onClick={() => deleteWilaya(w.wilayaCode)} className="btn-icon danger"><Trash2 size={13} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'var(--silver-400)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>Aucun wilaya configuré.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== CONTACTS TAB ====================
const ContactsTab: React.FC = () => {
  const { webContacts, updateWebContacts } = useApp();
  const [form, setForm] = useState({ ...webContacts });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWebContacts(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ icon: Icon, label, field, placeholder }: { icon: React.ElementType; label: string; field: keyof typeof form; placeholder?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color="var(--gold)" />
      </div>
      <div style={{ flex: 1 }}>
        <label className="lux-label">{label}</label>
        <input value={(form[field] as string) || ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder || ''} className="lux-input" style={{ marginTop: 6 }} />
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', marginBottom: 20 }}>Contacts & Réseaux Sociaux</h2>
      <div className="lux-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field icon={Facebook} label="Facebook" field="facebook" placeholder="https://facebook.com/..." />
        <Field icon={Instagram} label="Instagram" field="instagram" placeholder="https://instagram.com/..." />
        <Field icon={Globe as React.ElementType} label="TikTok" field="tiktok" placeholder="https://tiktok.com/@..." />
        <Field icon={Globe as React.ElementType} label="Snapchat" field="snapchat" placeholder="https://snapchat.com/add/..." />
        <Field icon={PhoneCall} label="WhatsApp" field="whatsapp" placeholder="+213..." />
        <Field icon={Send} label="Telegram" field="telegram" placeholder="https://t.me/..." />
        <Field icon={Mail} label="Email" field="email" placeholder="contact@..." />
        <Field icon={PhoneCall} label="Téléphone" field="phone" placeholder="0555..." />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 24 }}>
            <MapPin size={17} color="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="lux-label">Adresse</label>
            <textarea value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={3} className="lux-input" style={{ marginTop: 6, resize: 'none' }} />
          </div>
        </div>

        {saved && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 12, fontWeight: 700, padding: '10px 16px', borderRadius: 10 }}>
            Contacts enregistrés !
          </div>
        )}

        <button onClick={handleSave} className="btn-gold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <Save size={15} /> Enregistrer les contacts
        </button>
      </div>
    </div>
  );
};

// ==================== SITE SETTINGS TAB ====================
const SiteSettingsTab: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [storeName, setStoreName] = useState(settings.storeName || '');
  const [slogan, setSlogan] = useState(settings.slogan || '');
  const [logo, setLogo] = useState(settings.logo || '');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const b64 = await toBase64(e.target.files[0]);
      setLogo(b64);
    }
  };

  const handleSave = () => {
    updateSettings({ storeName, slogan, logo });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', marginBottom: 20 }}>Paramètres du Site Vitrine</h2>
      <div className="lux-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label className="lux-label">Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {logo ? <img src={logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" /> : <Gem size={26} color="var(--silver-400)" />}
            </div>
            <button onClick={() => fileRef.current?.click()} className="btn-silver" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Choisir un logo</button>
            {logo && <button onClick={() => setLogo('')} className="btn-outline" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Retirer</button>}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>
        </div>
        <div>
          <label className="lux-label">Nom du magasin</label>
          <input value={storeName} onChange={e => setStoreName(e.target.value)} className="lux-input" style={{ marginTop: 6 }} />
        </div>
        <div>
          <label className="lux-label">Slogan / Description</label>
          <textarea value={slogan} onChange={e => setSlogan(e.target.value)} rows={3} className="lux-input" style={{ marginTop: 6, resize: 'none' }} />
        </div>

        {saved && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 12, fontWeight: 700, padding: '10px 16px', borderRadius: 10 }}>
            Paramètres enregistrés !
          </div>
        )}

        <button onClick={handleSave} className="btn-gold" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <Save size={15} /> Sauvegarder
        </button>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const WebsiteManagement: React.FC = () => {
  const shouldReduce = useReducedMotion();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('offers');

  const renderSubTab = () => {
    switch (activeSubTab) {
      case 'offers': return <OffersTab />;
      case 'specialOffers': return <SpecialOffersTab />;
      case 'delivery': return <DeliveryTab />;
      case 'contacts': return <ContactsTab />;
      case 'siteSettings': return <SiteSettingsTab />;
    }
  };

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 14, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as any }}
      style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
    >
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="silver-line" />
          <h1 className="section-title">Gestion Site Web</h1>
          <p className="section-subtitle">Gérez vos offres, livraisons et paramètres du site vitrine</p>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div className="lux-tabs">
        {SUBTABS.map(tab => (
          <button
            key={tab.id}
            className={`lux-tab${activeSubTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="lux-card">
        {renderSubTab()}
      </div>
    </motion.div>
  );
};

export default WebsiteManagement;
