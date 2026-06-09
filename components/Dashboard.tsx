
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Package, Users, Layers, Activity, ShoppingBag, Wrench,
  AlertCircle, Settings, X, Scale, Clock, CheckCircle,
} from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS_DARK = ['#CBD5E1', '#94A3B8', '#64748B', '#D4A843', '#2DD4BF', '#F87171'];
const COLORS_LIGHT = ['#334155', '#475569', '#64748B', '#B45309', '#0D9488', '#DC2626'];

const Dashboard: React.FC = () => {
  const {
    silverTypes, sales, purchases, workers, workerPayments,
    suppliers, workshops, commands, language, user, theme,
    workerAdvances, workerAbsences, shapes, minimalWeight, setMinimalWeight,
    silverPricePerGram, setSilverPricePerGram
  } = useApp();
  const t = translations[language];
  const COLORS = theme === 'light' ? COLORS_LIGHT : COLORS_DARK;
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState(minimalWeight.toString());
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceInput, setPriceInput] = useState(silverPricePerGram.toString());
  const isAdmin = user?.role === 'admin';
  const shouldReduce = useReducedMotion();

  const stats = useMemo(() => {
    const relevantSales = isAdmin ? sales : sales.filter(s => s.workerId === user?.id);
    const totalInventory = silverTypes.reduce((acc, st) => {
      const shapesTotal = (Object.values(st.shapes) as number[]).reduce((a, b) => a + b, 0);
      return acc + (st.isCassie ? st.initialQuantity : shapesTotal);
    }, 0);
    const totalSalesValue = relevantSales.reduce((acc, sale) => acc + sale.total, 0);
    const totalPurchasesValue = purchases.reduce((acc, pur) => acc + pur.payment.total, 0);
    const totalWorkerPayments = workerPayments.reduce((acc, wp) => acc + wp.amount, 0);
    const pendingCommandsCount = commands.filter(c => c.status === 'pending').length;
    const finalizedCommandsCount = commands.filter(c => c.status === 'finalized').length;
    const paidCommandsCount = commands.filter(c => c.status === 'paid').length;

    const shapeDistribution = shapes.map(s => ({ name: s, value: 0 }));
    silverTypes.forEach(st => {
      if (!st.isCassie) {
        shapes.forEach((shapeName, idx) => {
          shapeDistribution[idx].value += (st.shapes as any)[shapeName] || 0;
        });
      }
    });

    const now = new Date();
    const monthlyCounts = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        name: d.toLocaleString('fr-FR', { month: 'short' }),
        ventes: relevantSales.filter(s => {
          const sd = new Date(s.date);
          return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
        }).length,
        commandes: commands.filter(c => {
          const cd = new Date(c.date);
          return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
        }).length,
      };
    });

    const recentSales = [...relevantSales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
    const recentCommands = [...commands].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

    return {
      totalInventory, totalSalesValue, totalPurchasesValue, totalWorkerPayments,
      pendingCommandsCount, finalizedCommandsCount, paidCommandsCount,
      shapeDistribution, monthlyCounts, recentSales, recentCommands, relevantSales,
    };
  }, [silverTypes, sales, purchases, workerPayments, commands, workers, workerAdvances, workerAbsences, isAdmin, user, shapes]);

  const closeShowWeightModal = () => setShowWeightModal(false);
  const closeShowPriceModal = () => setShowPriceModal(false);

  const kpiAccents = [
    'linear-gradient(180deg, var(--silver-200), var(--silver-300))',
    'linear-gradient(180deg, var(--teal), #0EA887)',
    'linear-gradient(180deg, var(--gold), var(--gold-deep))',
    'linear-gradient(180deg, var(--silver-400), #3D4F60)',
  ];
  const kpis = isAdmin ? [
    { label: 'Stock Total', value: `${stats.totalInventory.toFixed(1)}g`, sub: `${silverTypes.length} type(s)`, icon: Layers, iconBg: 'var(--platinum-100)', iconColor: 'var(--silver-200)', accent: kpiAccents[0] },
    { label: 'Transactions', value: stats.relevantSales.length, sub: 'Ventes réalisées', icon: ShoppingBag, iconBg: 'var(--success-bg)', iconColor: 'var(--teal)', accent: kpiAccents[1] },
    { label: 'En Attente', value: stats.pendingCommandsCount, sub: `${stats.finalizedCommandsCount} finalisées`, icon: Wrench, iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)', accent: kpiAccents[2] },
    { label: 'Équipe', value: workers.length, sub: `${workshops.length} atelier(s)`, icon: Users, iconBg: 'var(--platinum-100)', iconColor: 'var(--silver-300)', accent: kpiAccents[3] },
  ] : [
    { label: 'Mes Ventes', value: stats.relevantSales.length, sub: 'Transactions', icon: ShoppingBag, iconBg: 'var(--success-bg)', iconColor: 'var(--teal)', accent: kpiAccents[1] },
    { label: 'Dettes Clients', value: stats.relevantSales.filter(s => s.isDebt).length, sub: 'Non soldées', icon: AlertCircle, iconBg: 'var(--danger-bg)', iconColor: 'var(--danger)', accent: 'linear-gradient(180deg, var(--danger), #CC3D4F)' },
    { label: 'Tâches', value: stats.pendingCommandsCount, sub: 'En attente', icon: Clock, iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)', accent: kpiAccents[2] },
    { label: 'Finalisées', value: stats.finalizedCommandsCount, sub: 'Commandes clôturées', icon: CheckCircle, iconBg: 'var(--success-bg)', iconColor: 'var(--teal)', accent: kpiAccents[1] },
  ];

  const tooltipStyle = {
    background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12,
    boxShadow: 'var(--shadow-card)', padding: '10px 16px',
    color: 'var(--silver-100)',
  };

  return (
    <div className="animate-page-enter space-y-8">
      {/* PAGE HEADER */}
      <motion.div initial={shouldReduce ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="silver-line" />
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{t.dashboard}</h1>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--silver-300)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '4px 0 0' }}>
          {language === 'ar' ? 'نظرة عامة تشغيلية' : "Vue d'ensemble opérationnelle"}
        </p>
      </motion.div>

      {/* ADMIN CONTROLS */}
      {isAdmin && (
        <div className="space-y-4">
          <AnimatePresence>
            {stats.totalInventory < minimalWeight && (
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ background: 'rgba(255,95,114,0.08)', border: '1px solid rgba(255,95,114,0.25)', borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'rgba(255,95,114,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={20} style={{ color: 'var(--danger)' }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Stock Critique</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,95,114,0.8)', margin: 0 }}>
                    Stock actuel <strong>{stats.totalInventory.toFixed(1)}g</strong> — Seuil minimum <strong>{minimalWeight}g</strong>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={() => { setWeightInput(minimalWeight.toString()); setShowWeightModal(true); }}
              className="btn-silver"
              whileHover={shouldReduce ? {} : { scale: 1.02 }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              style={{ height: 44, borderRadius: 12, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer' }}
            >
              <Settings size={16} /> Seuil de Stock
            </motion.button>
            <motion.button
              onClick={() => { setPriceInput(silverPricePerGram.toString()); setShowPriceModal(true); }}
              className="btn-outline"
              whileHover={shouldReduce ? {} : { scale: 1.02 }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              style={{ height: 44, borderRadius: 12, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, cursor: 'pointer' }}
            >
              <Scale size={16} /> Prix Argent / g
            </motion.button>
          </div>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={shouldReduce ? {} : { y: -3, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            className="stat-card"
            style={{ position: 'relative', overflow: 'hidden', willChange: 'transform' }}
          >
            {/* Left accent strip */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: kpi.accent, borderRadius: '0 99px 99px 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingLeft: 8 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(192,200,212,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                  {kpi.label}
                </p>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--silver-100)', letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1 }}>
                  {kpi.value}
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(192,200,212,0.4)', margin: '6px 0 0' }}>{kpi.sub}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} style={{ color: kpi.iconColor }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="silver-card lg:col-span-2"
          style={{ padding: 28 }}
        >
          <div style={{ marginBottom: 24 }}>
            <div className="silver-line" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Activité Mensuelle</h3>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(192,200,212,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '4px 0 0' }}>
              Ventes & commandes — 6 derniers mois
            </p>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--silver-300)', fontSize: 11, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--silver-300)', fontSize: 11, fontWeight: 600 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'var(--silver-300)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }} itemStyle={{ fontWeight: 700, color: 'var(--silver-100)' }} cursor={{ fill: 'var(--platinum-100)' }} />
                <Bar dataKey="ventes" name="Ventes" fill={theme === 'light' ? '#475569' : '#94A3B8'} radius={[6, 6, 0, 0]} />
                <Bar dataKey="commandes" name="Commandes" fill={theme === 'light' ? '#B45309' : '#D4A843'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {[{ color: theme === 'light' ? '#475569' : '#94A3B8', label: 'Ventes' }, { color: 'var(--gold)', label: 'Commandes' }].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="silver-card"
          style={{ padding: 28 }}
        >
          <div style={{ marginBottom: 20 }}>
            <div className="silver-line" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Stock par Forme</h3>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(192,200,212,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '4px 0 0' }}>
              Répartition en grammes
            </p>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.shapeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={6} dataKey="value">
                  {stats.shapeDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => `${Number(val).toFixed(1)}g`} itemStyle={{ color: 'var(--silver-100)', fontWeight: 700 }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontWeight: 700, color: 'var(--silver-300)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* STOCK + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock status */}
        <motion.div initial={shouldReduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="silver-card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 22 }}>
            <div className="silver-line" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>État des Stocks</h3>
          </div>
          <div className="space-y-4">
            {silverTypes.map(st => {
              const total = st.isCassie ? st.initialQuantity : (Object.values(st.shapes) as number[]).reduce((a, b) => a + b, 0);
              const min = (st as any).minimalQuantity || 0;
              const pct = min > 0 ? Math.min(100, (total / min) * 100) : Math.min(100, (total / (stats.totalInventory || 1)) * 100 * silverTypes.length);
              const isLow = min > 0 && total < min;
              return (
                <div key={st.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver-100)' }}>{st.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)' }}>{st.calibre}</span>
                      {st.isCassie && <span className="badge badge-platinum" style={{ fontSize: 9 }}>Cassie</span>}
                      {isLow && <span className="badge badge-danger" style={{ fontSize: 9 }}>Bas</span>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isLow ? 'var(--danger)' : 'var(--silver-200)', flexShrink: 0 }}>{total.toFixed(1)}g</span>
                  </div>
                  <div className="lux-progress">
                    <motion.div
                      initial={shouldReduce ? false : { width: 0 }}
                      animate={{ width: `${Math.max(4, pct)}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="lux-progress-fill"
                      style={{ ...(isLow ? { background: 'linear-gradient(90deg, var(--danger), #FF8A97)' } : pct > 50 ? { background: 'linear-gradient(90deg, var(--teal), #10B996)' } : { background: 'linear-gradient(90deg, var(--gold), var(--gold-bright))' }) }}
                    />
                  </div>
                </div>
              );
            })}
            {silverTypes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <Package size={28} style={{ color: 'var(--silver-400)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Aucun type d'argent</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={shouldReduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="silver-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div className="silver-line" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Activité Récente</h3>
            </div>
            <span className="badge badge-success" style={{ fontSize: 10 }}>Live</span>
          </div>
          <div className="space-y-1">
            {[
              ...stats.recentSales.slice(0, 3).map(s => ({
                date: s.date, title: s.clientName || 'Passager',
                sub: `${s.items.length} article(s) · ${s.items.map(i => i.shape).filter(Boolean).join(', ') || '—'}`,
                badge: s.isDebt ? 'badge-danger' : 'badge-success', badgeLabel: s.isDebt ? 'Dette' : 'Payé',
                iconBg: 'var(--success-bg)', iconColor: 'var(--teal)', Icon: ShoppingBag,
              })),
              ...stats.recentCommands.slice(0, 3).map(c => ({
                date: c.date, title: c.clientName,
                sub: `${c.type === 'reparation' ? 'Réparation' : 'Industrie'} · ${c.metal || '—'} ${c.initialWeight}g`,
                badge: c.status === 'paid' ? 'badge-success' : c.status === 'finalized' ? 'badge-info' : 'badge-warning',
                badgeLabel: c.status === 'paid' ? 'Payé' : c.status === 'finalized' ? 'Finalisé' : 'En attente',
                iconBg: c.status === 'pending' ? 'var(--gold-dim)' : c.status === 'finalized' ? 'var(--platinum-100)' : 'var(--success-bg)',
                iconColor: c.status === 'pending' ? 'var(--gold)' : c.status === 'finalized' ? 'var(--silver-200)' : 'var(--teal)', Icon: Wrench,
              })),
            ]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 6)
              .map((item, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, cursor: 'default', transition: 'background 0.15s' }}
                  whileHover={shouldReduce ? {} : { backgroundColor: 'rgba(192,200,212,0.04)' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.Icon size={15} style={{ color: item.iconColor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver-100)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--silver-300)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.sub}</p>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`badge ${item.badge}`} style={{ fontSize: 9 }}>{item.badgeLabel}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-400)' }}>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </motion.div>
              ))}
            {stats.recentSales.length === 0 && stats.recentCommands.length === 0 && (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <Activity size={28} style={{ color: 'var(--silver-400)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Aucune activité récente</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* COMMANDS STATUS - Admin only */}
      {isAdmin && (
        <motion.div initial={shouldReduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="silver-card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <div className="silver-line" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Tableau des Commandes</h3>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(192,200,212,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '4px 0 0' }}>Répartition par statut</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'En Attente', value: stats.pendingCommandsCount, color: 'var(--gold)', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.25)' },
              { label: 'Finalisées', value: stats.finalizedCommandsCount, color: 'var(--silver-200)', bg: 'rgba(192,200,212,0.08)', border: 'rgba(192,200,212,0.2)' },
              { label: 'Payées', value: stats.paidCommandsCount, color: 'var(--teal)', bg: 'rgba(34,211,165,0.08)', border: 'rgba(34,211,165,0.25)' },
            ].map(item => (
              <motion.div
                key={item.label}
                whileHover={shouldReduce ? {} : { y: -2, scale: 1.02 }}
                style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 18, padding: '24px 16px', textAlign: 'center', cursor: 'default' }}
              >
                <p style={{ fontSize: 40, fontWeight: 900, color: item.color, margin: '0 0 8px', letterSpacing: '-0.05em', lineHeight: 1 }}>{item.value}</p>
                <p style={{ fontSize: 10, fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, opacity: 0.75 }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* WEIGHT MODAL */}
      <AnimatePresence mode="wait">
        {showWeightModal && (
          <motion.div
            className="modal-overlay"
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) closeShowWeightModal(); }}
          >
            <motion.div
              className="modal-box"
              initial={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Seuil de Stock</h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>Alerte stock critique</p>
                </div>
                <button onClick={closeShowWeightModal} className="btn-icon" style={{ flexShrink: 0 }}><X size={18} /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const v = parseFloat(weightInput); if (!isNaN(v) && v > 0) { setMinimalWeight(v); closeShowWeightModal(); } }}>
                <div className="modal-body space-y-5">
                  <div>
                    <label className="lux-label">Poids Minimum (g)</label>
                    <input type="number" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} step="0.01" required className="lux-input" placeholder="Ex: 1000" />
                  </div>
                  <div style={{ background: 'var(--gold-dim)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 14, padding: '14px 18px' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Stock Actuel</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em', margin: 0 }}>{stats.totalInventory.toFixed(1)}g</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeShowWeightModal} className="btn-outline" style={{ height: 42, borderRadius: 10, padding: '0 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Annuler</button>
                  <button type="submit" className="btn-silver" style={{ height: 42, borderRadius: 10, padding: '0 24px', fontSize: 13, cursor: 'pointer' }}>Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SILVER PRICE MODAL */}
      <AnimatePresence mode="wait">
        {showPriceModal && (
          <motion.div
            className="modal-overlay"
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) closeShowPriceModal(); }}
          >
            <motion.div
              className="modal-box"
              initial={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <div className="silver-line" style={{ marginBottom: 6 }} />
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>Prix Argent / Gramme</h2>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--silver-300)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>Taux de référence journalier</p>
                </div>
                <button onClick={closeShowPriceModal} className="btn-icon" style={{ flexShrink: 0 }}><X size={18} /></button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); const v = parseFloat(priceInput); if (!isNaN(v) && v >= 0) { setSilverPricePerGram(v); closeShowPriceModal(); } }}>
                <div className="modal-body space-y-5">
                  <div>
                    <label className="lux-label">Prix par Gramme (DZD)</label>
                    <input type="number" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} step="0.01" required className="lux-input" placeholder="Ex: 750" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div style={{ background: 'var(--gold-dim)', border: '1px solid rgba(212,168,67,0.22)', borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Prix Actuel</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em', margin: 0 }}>{silverPricePerGram} DZD/g</p>
                    </div>
                    <div style={{ background: 'var(--platinum-100)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--silver-300)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 6px' }}>Stock Total</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-200)', letterSpacing: '-0.02em', margin: 0 }}>{stats.totalInventory.toFixed(1)}g</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeShowPriceModal} className="btn-outline" style={{ height: 42, borderRadius: 10, padding: '0 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Annuler</button>
                  <button type="submit" className="btn-silver" style={{ height: 42, borderRadius: 10, padding: '0 24px', fontSize: 13, cursor: 'pointer' }}>Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
