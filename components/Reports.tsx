
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Calendar, Download, FileText, TrendingUp, Wallet, ShoppingBag, Package,
  Truck, Warehouse, Wrench, Users, Info, ChevronRight, ChevronDown,
  Layers, Receipt, CreditCard, Globe, Flame, Repeat, BarChart2, X,
  ShoppingCart, PiggyBank, RefreshCw
} from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

// ─── Module definitions (maps to sidebar sections) ─────────────────────────
const ALL_MODULES = [
  { id: 'ventes',      label: 'Ventes',          icon: ShoppingBag,  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { id: 'achats',      label: 'Achats',           icon: ShoppingCart, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 'commandes',   label: 'Commandes',        icon: Wrench,       color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { id: 'cassie',      label: 'Cassie',           icon: Flame,        color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { id: 'livraisons',  label: 'Livreurs',         icon: Truck,        color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'travailleurs',label: 'Travailleurs',     icon: Users,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { id: 'depenses',    label: 'Dépenses',         icon: Receipt,      color: '#f43f5e', bg: 'rgba(244,63,94,0.1)'  },
  { id: 'clients',     label: 'Clients',          icon: Users,        color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
  { id: 'dettes',      label: 'Dettes',           icon: CreditCard,   color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { id: 'echanges',    label: 'Échanges',         icon: Repeat,       color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  { id: 'fusions',     label: 'Fusions',          icon: Package,      color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
  { id: 'inventaire',  label: 'Inventaire',       icon: Layers,       color: '#84cc16', bg: 'rgba(132,204,22,0.1)'  },
  { id: 'web',         label: 'Commandes Web',    icon: Globe,        color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
] as const;

type ModuleId = typeof ALL_MODULES[number]['id'];

// ─── Helper: section header ─────────────────────────────────────────────────
const SectionHeader: React.FC<{
  icon: React.FC<any>;
  label: string;
  count?: number;
  color: string;
  bg: string;
  open: boolean;
  onToggle: () => void;
}> = ({ icon: Icon, label, count, color, bg, open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: bg,
      border: `1px solid ${color}30`,
      borderRadius: open ? '16px 16px 0 0' : 16,
      padding: '16px 20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
  >
    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={16} style={{ color }} />
    </div>
    <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', textAlign: 'left' }}>
      {label}
    </span>
    {count !== undefined && (
      <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}20`, borderRadius: 99, padding: '3px 10px' }}>
        {count}
      </span>
    )}
    {open ? <ChevronDown size={16} style={{ color: 'var(--platinum-400)', flexShrink: 0 }} /> : <ChevronRight size={16} style={{ color: 'var(--platinum-400)', flexShrink: 0 }} />}
  </button>
);

// ─── Helper: stat row ───────────────────────────────────────────────────────
const StatRow: React.FC<{ label: string; value: string; highlight?: boolean; color?: string }> = ({ label, value, highlight, color }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: highlight ? 'var(--ink-900)' : 'var(--bg-surface)',
    border: highlight ? 'none' : '1px solid var(--platinum-100)',
    borderRadius: 12,
  }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: highlight ? 'rgba(255,255,255,0.55)' : 'var(--platinum-600)' }}>
      {label}
    </span>
    <span style={{ fontSize: 14, fontWeight: 800, color: highlight ? 'var(--gold-pure)' : (color || 'var(--ink-900)'), letterSpacing: '-0.02em' }}>
      {value}
    </span>
  </div>
);

const Reports: React.FC = () => {
  const {
    sales, purchases, workerPayments, silverTypes, suppliers, workshops,
    commands, workers, deliveries, storeExpenses, workerAdvances, workerAbsences,
    replacements, clients, debts, meltings, cassiePurchases, language,
    silverPricePerGram, webOrders, webDeliveryCompanies
  } = useApp();
  const t = translations[language];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showTotalWeight, setShowTotalWeight] = useState(false);
  const [activeModules, setActiveModules] = useState<Set<ModuleId>>(
    new Set(ALL_MODULES.map(m => m.id))
  );
  const [openSections, setOpenSections] = useState<Set<ModuleId>>(new Set());

  const toggleModule = (id: ModuleId) => {
    setActiveModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: ModuleId) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setActiveModules(new Set(ALL_MODULES.map(m => m.id)));
  const clearAll = () => setActiveModules(new Set());

  // ─── ALL DATA LOGIC KEPT EXACTLY INTACT ───────────────────────────────────
  const reportStats = useMemo(() => {
    if (!reportGenerated) return null;

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const filteredSales = sales.filter(s => {
      const d = new Date(s.date);
      return d >= start && d <= end;
    });

    const filteredPurchases = purchases.filter(p => {
      const d = new Date(p.date);
      return d >= start && d <= end;
    });

    const filteredWorkerPay = workerPayments.filter(p => {
      const d = new Date(p.date);
      return d >= start && d <= end;
    });

    const totalRevenue = filteredSales.reduce((a, b) => a + b.total, 0);
    const totalCosts = filteredPurchases.reduce((a, b) => a + b.payment.total, 0);
    const totalSalaries = filteredWorkerPay.reduce((a, b) => a + b.amount, 0);
    const totalDebts = filteredSales.filter(s => s.isDebt).reduce((a, b) => a + b.total, 0);
    const filteredStoreExpenses = storeExpenses.filter(se => {
      const d = new Date(se.date);
      return d >= start && d <= end;
    });

    const totalStoreExpenses = filteredStoreExpenses.reduce((a, b) => a + b.price, 0);

    const filteredDeliveries = deliveries.filter(dv => {
      const d = new Date(dv.createdDate);
      return d >= start && d <= end;
    });

    const totalDeliveryPayments = filteredDeliveries.reduce((sum, dv) => sum + dv.paymentHistory.reduce((s, ph) => s + ph.amount, 0), 0)
      + commands.filter(c => {
          if (!c.endDate) return false;
          const d = new Date(c.endDate);
          return d >= start && d <= end;
        }).reduce((s, c) => s + (c.deliveryPrice || 0), 0);

    const filteredAdvances = workerAdvances.filter(a => { const d = new Date(a.date); return d >= start && d <= end; });
    const totalAdvances = filteredAdvances.reduce((a, b) => a + b.amount, 0);
    const filteredAbsences = workerAbsences.filter(a => { const d = new Date(a.date); return d >= start && d <= end; });
    const totalAbsenceDeductions = filteredAbsences.reduce((a, b) => a + b.deduction, 0);

    const pendingCommandsCount = commands.filter(c => c.status === 'pending').length;
    const finishedCommandsInPeriod = commands.filter(c => {
       if (c.status !== 'paid' || !c.endDate) return false;
       const d = new Date(c.endDate);
       return d >= start && d <= end;
    });

    const costMap: Record<string, { totalWeight: number; totalCost: number }> = {};
    filteredPurchases.forEach(p => {
      p.items.forEach(it => {
        const id = it.silverTypeId;
        if (!costMap[id]) costMap[id] = { totalWeight: 0, totalCost: 0 };
        costMap[id].totalWeight += Number(it.weight) || 0;
        costMap[id].totalCost += Number(it.totalPrice) || 0;
      });
    });
    const costPerGram: Record<string, number> = {};
    Object.entries(costMap).forEach(([k, v]) => {
      costPerGram[k] = v.totalWeight > 0 ? v.totalCost / v.totalWeight : 0;
    });

    const cogs = filteredSales.reduce((s, sale) => s + sale.items.reduce((si, it) => {
      const cpg = costPerGram[it.silverTypeId] ?? (it.pricePerGram * 0.6);
      return si + (Number(it.weight) || 0) * cpg;
    }, 0), 0);
    const grossProfit = totalRevenue - cogs;

    const filteredReplacements = replacements.filter(r => { const d = new Date(r.date); return d >= start && d <= end; });
    const replacementsImpact = filteredReplacements.reduce((s, r) => s + (Number(r.amountToPay || 0) - Number(r.amountToRefund || 0)), 0);

    const filteredClients = clients;
    const clientBalancesTotal = clients.reduce((s, c) => s + (c.payments || []).reduce((ss, p) => ss + (p.amount || 0), 0), 0);

    const filteredDebts = debts.filter(d => { const dt = new Date(d.date); return dt >= start && dt <= end; });
    const debtsGiven = filteredDebts.filter(d => d.direction === 'given').reduce((a,b)=>a+(b.remaining||0),0);
    const debtsTaken = filteredDebts.filter(d => d.direction === 'taken').reduce((a,b)=>a+(b.remaining||0),0);

    const filteredCommands = commands.filter(c => {
      const d = new Date(c.date || c.endDate || 0);
      return d >= start && d <= end;
    });
    const industryProfit = filteredCommands.reduce((s, c) => {
      if (c.type !== 'industry' || !c.clientPrice) return s;
      return s + (Number(c.clientPrice || 0) - Number(c.workshopPrice || 0) - Number(c.deliveryPrice || 0));
    }, 0);
    const reparationsProfit = filteredCommands.reduce((s, c) => {
      if (c.type !== 'reparation') return s;
      return s + (Number(c.paidAmount || 0) - Number(c.workshopPrice || 0));
    }, 0);

    const filteredMeltings = (meltings || []).filter(m => { const d = new Date(m.date); return d >= start && d <= end; });
    const totalMeltingLoss = filteredMeltings.reduce((s, m) => s + (Number(m.loss) || 0), 0);
    const totalMeltingPreWeight = filteredMeltings.reduce((s, m) => s + (Number(m.totalPreWeight) || 0), 0);
    const totalMeltingPostWeight = filteredMeltings.reduce((s, m) => s + (Number(m.postWeight) || 0), 0);

    const totalSoldWeight = filteredSales.reduce((s, sale) => s + sale.items.reduce((si, it) => si + (Number(it.weight) || 0), 0), 0);

    const silverPriceBenefit = silverPricePerGram > 0 ? totalRevenue - (totalSoldWeight * silverPricePerGram) : 0;

    const filteredCassiePurchases = (cassiePurchases || []).filter(cp => {
      const d = new Date(cp.date);
      return d >= start && d <= end;
    });
    const totalCassiePurchaseCost = filteredCassiePurchases.reduce((s, cp) => s + (Number(cp.totalCost) || 0), 0);
    const totalCassieWeight = filteredCassiePurchases.reduce((s, cp) => s + (Number(cp.weight) || 0), 0);

    const allRevenuesIn = {
      sales: totalRevenue,
      clientPayments: clientBalancesTotal,
      industryCommands: industryProfit,
      reparations: reparationsProfit,
      replacements: Math.max(0, replacementsImpact),
    };
    const totalMoneyIn = Object.values(allRevenuesIn).reduce((a, b) => a + b, 0);

    const allExpensesOut = {
      purchases: totalCosts,
      cassiePurchases: totalCassiePurchaseCost,
      salaries: totalSalaries,
      advances: totalAdvances,
      storeExpenses: totalStoreExpenses,
      deliveries: totalDeliveryPayments,
      debtsGiven: debtsGiven,
      replacementsRefund: Math.abs(Math.min(0, replacementsImpact)),
    };
    const totalMoneyOut = Object.values(allExpensesOut).reduce((a, b) => a + b, 0);

    const storeCashFlow = totalMoneyIn - totalMoneyOut;
    const storeNetProfit = totalRevenue + industryProfit + reparationsProfit - totalCosts - totalCassiePurchaseCost - totalSalaries - totalStoreExpenses - totalDeliveryPayments;

    return {
      totalRevenue, totalCosts, totalSalaries, totalStoreExpenses, totalDeliveryPayments,
      totalDebts, netEarnings: totalRevenue - totalCosts - totalSalaries - totalStoreExpenses - totalDeliveryPayments,
      salesCount: filteredSales.length, purchasesCount: filteredPurchases.length,
      commandsFinished: finishedCommandsInPeriod.length, pendingCommandsCount,
      costPerGram, cogs, grossProfit, replacementsImpact, clientBalancesTotal,
      debtsGiven, debtsTaken, industryProfit, reparationsProfit,
      filteredMeltings, totalMeltingLoss, totalMeltingPreWeight, totalMeltingPostWeight,
      totalSoldWeight, silverPriceBenefit, filteredReplacements, filteredDebts,
      filteredCassiePurchases, totalCassiePurchaseCost, totalCassieWeight,
      allRevenuesIn, allExpensesOut, totalMoneyIn, totalMoneyOut,
      storeCashFlow, storeNetProfit, totalAdvances, totalAbsenceDeductions,
      filteredSales, filteredPurchases, filteredCommands, filteredDeliveries,
      filteredStoreExpenses,
    };
  }, [reportGenerated, startDate, endDate, sales, purchases, workerPayments, commands, storeExpenses, deliveries, workerAdvances, workerAbsences, replacements, clients, debts, meltings, silverTypes, cassiePurchases, silverPricePerGram]);

  const webOrderStats = React.useMemo(() => {
    if (!reportGenerated) return null;
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const filtered = webOrders.filter(o => { const d = new Date(o.createdAt); return d >= start && d <= end; });
    const nonCancelled = filtered.filter(o => o.status !== 'cancelled');
    const finalized = filtered.filter(o => o.status === 'finalized');
    const personalizedOrders = filtered.filter(o => o.isPersonalized);
    return {
      filtered,
      total: filtered.length,
      pending: filtered.filter(o => o.status === 'pending').length,
      accepted: filtered.filter(o => o.status === 'accepted').length,
      in_delivery: filtered.filter(o => o.status === 'in_delivery').length,
      delivered: filtered.filter(o => o.status === 'delivered').length,
      finalized: finalized.length,
      cancelled: filtered.filter(o => o.status === 'cancelled').length,
      totalRevenue: nonCancelled.reduce((s, o) => s + o.total, 0),
      finalizedRevenue: finalized.reduce((s, o) => s + o.total, 0),
      totalDeliveryFees: nonCancelled.reduce((s, o) => s + o.deliveryPrice, 0),
      avgOrderValue: nonCancelled.length > 0 ? nonCancelled.reduce((s, o) => s + o.total, 0) / nonCancelled.length : 0,
      personalizedOrders,
    };
  }, [reportGenerated, startDate, endDate, webOrders]);

  // ─── helpers for inline date filter in lists ──────────────────────────────
  const inRange = (dateStr: string) => {
    const d = new Date(dateStr);
    const s = startDate ? new Date(startDate) : new Date(0);
    const e = endDate ? new Date(endDate) : new Date();
    e.setHours(23, 59, 59, 999);
    return d >= s && d <= e;
  };

  return (
    <div className="animate-page-enter space-y-8">

      {/* PAGE HEADER */}
      <div>
        <div className="silver-line" />
        <h1 className="section-title">{t.reports}</h1>
        <p className="section-subtitle">Rapport d'activité global — tous modules</p>
      </div>

      {/* DATE RANGE + GENERATE */}
      <div className="lux-card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', margin: '0 0 20px' }}>
          Période d'Analyse
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <div>
            <label className="lux-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Calendar size={13} style={{ color: 'var(--gold-pure)' }} /> Date de Début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="lux-input"
            />
          </div>
          <div>
            <label className="lux-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Calendar size={13} style={{ color: 'var(--gold-pure)' }} /> Date de Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="lux-input"
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setReportGenerated(true); setOpenSections(new Set()); }}
              className="btn-gold"
              style={{ flex: 1, height: 48, borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
            >
              <FileText size={16} /> Générer
            </button>
            {reportGenerated && (
              <button
                onClick={() => setReportGenerated(false)}
                className="btn-icon"
                title="Réinitialiser"
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODULE SELECTOR */}
      <div className="lux-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', margin: 0 }}>
              Modules à Inclure
            </h3>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: '3px 0 0' }}>
              {activeModules.size} / {ALL_MODULES.length} sélectionnés
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={selectAll} style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold-pure)', background: 'var(--gold-muted)', border: '1px solid #E8C86B', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
              Tout
            </button>
            <button onClick={clearAll} style={{ fontSize: 11, fontWeight: 700, color: 'var(--platinum-500)', background: 'var(--bg-muted)', border: '1px solid var(--platinum-200)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
              Aucun
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {ALL_MODULES.map(mod => {
            const active = activeModules.has(mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => toggleModule(mod.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${active ? mod.color + '50' : 'var(--platinum-200)'}`,
                  background: active ? mod.bg : 'var(--bg-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <mod.icon size={14} style={{ color: active ? mod.color : 'var(--platinum-400)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: active ? 'var(--ink-900)' : 'var(--platinum-500)' }}>
                  {mod.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── REPORT RESULTS ──────────────────────────────────────────────────── */}
      {reportGenerated && reportStats && (
        <div className="space-y-6 animate-fade-scale">

          {/* PERIOD BADGE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'var(--gold-muted)', border: '1px solid #E8C86B', borderRadius: 14 }}>
            <Calendar size={16} style={{ color: 'var(--gold-deep)', flexShrink: 0 }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-deep)', margin: 0 }}>
              Période : <strong>{startDate || 'Début des données'}</strong> → <strong>{endDate || "Aujourd'hui"}</strong>
            </p>
          </div>

          {/* FINANCIAL KPI SUMMARY */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Ventes', value: reportStats.totalRevenue.toLocaleString() + ' DZD', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
              { label: 'Achats', value: reportStats.totalCosts.toLocaleString() + ' DZD', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
              { label: 'Salaires', value: reportStats.totalSalaries.toLocaleString() + ' DZD', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)' },
              {
                label: 'Bénéfice Net',
                value: reportStats.netEarnings.toLocaleString() + ' DZD',
                color: reportStats.netEarnings >= 0 ? 'var(--gold-pure)' : '#f43f5e',
                bg: reportStats.netEarnings >= 0 ? 'rgba(201,168,76,0.1)' : 'rgba(244,63,94,0.1)',
                border: reportStats.netEarnings >= 0 ? 'rgba(201,168,76,0.3)' : 'rgba(244,63,94,0.3)',
              },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: kpi.bg, border: `1.5px solid ${kpi.border}`, borderRadius: 16, padding: '18px 20px' }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: kpi.color, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px', opacity: 0.75 }}>
                  {kpi.label}
                </p>
                <p style={{ fontSize: 18, fontWeight: 900, color: kpi.color, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* CASH FLOW SUMMARY */}
          <div style={{ background: 'var(--ink-900)', borderRadius: 20, padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { label: 'Total Entré', value: reportStats.totalMoneyIn.toLocaleString() + ' DZD', color: '#10b981' },
              { label: 'Total Sorti', value: '-' + reportStats.totalMoneyOut.toLocaleString() + ' DZD', color: '#f43f5e' },
              { label: 'Flux Net', value: reportStats.storeCashFlow.toLocaleString() + ' DZD', color: 'var(--gold-pure)' },
            ].map((item, i) => (
              <div key={item.label} style={{ textAlign: 'center', ...(i === 1 ? { borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' } : {}) }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, color: item.color, margin: 0, letterSpacing: '-0.04em' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* IN / OUT BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Money IN */}
            <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#065f46', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} /> Revenus
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Ventes directes', v: reportStats.allRevenuesIn.sales },
                  { label: 'Paiements clients', v: reportStats.allRevenuesIn.clientPayments },
                  { label: 'Commandes industrie', v: reportStats.allRevenuesIn.industryCommands },
                  { label: 'Réparations', v: reportStats.allRevenuesIn.reparations },
                  { label: 'Échanges / Retours', v: reportStats.allRevenuesIn.replacements },
                ].map(row => (
                  <StatRow key={row.label} label={row.label} value={row.v.toLocaleString() + ' DZD'} color="#10b981" />
                ))}
                <StatRow label="TOTAL REVENUS" value={reportStats.totalMoneyIn.toLocaleString() + ' DZD'} highlight />
              </div>
            </div>

            {/* Money OUT */}
            <div style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#7f1d1d', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wallet size={16} /> Dépenses
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Achats réguliers', v: reportStats.allExpensesOut.purchases },
                  { label: 'Achats cassie', v: reportStats.allExpensesOut.cassiePurchases },
                  { label: 'Salaires', v: reportStats.allExpensesOut.salaries },
                  { label: 'Avances employés', v: reportStats.allExpensesOut.advances },
                  { label: 'Dépenses magasin', v: reportStats.allExpensesOut.storeExpenses },
                  { label: 'Livraisons', v: reportStats.allExpensesOut.deliveries },
                  { label: 'Dettes données', v: reportStats.allExpensesOut.debtsGiven },
                ].map(row => (
                  <StatRow key={row.label} label={row.label} value={row.v.toLocaleString() + ' DZD'} color="#f43f5e" />
                ))}
                <StatRow label="TOTAL DÉPENSES" value={reportStats.totalMoneyOut.toLocaleString() + ' DZD'} highlight />
              </div>
            </div>
          </div>

          {/* Silver price benefit */}
          {silverPricePerGram > 0 && (
            <div style={{ background: 'var(--gold-muted)', border: '1px solid #E8C86B', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold-deep)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Bénéfice calculé (prix argent {silverPricePerGram} DZD/g)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Poids vendu', value: (reportStats.totalSoldWeight || 0).toFixed(2) + ' g' },
                  { label: 'Coût argent', value: ((reportStats.totalSoldWeight || 0) * silverPricePerGram).toLocaleString() + ' DZD' },
                  { label: 'Bénéfice brut', value: reportStats.silverPriceBenefit.toLocaleString() + ' DZD' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--bg-surface)', borderRadius: 14, padding: '14px 16px' }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>{item.label}</p>
                    <p style={{ fontSize: 17, fontWeight: 900, color: 'var(--gold-deep)', margin: 0, letterSpacing: '-0.03em' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── MODULE SECTIONS ──────────────────────────────── */}
          <div className="space-y-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div className="silver-line" style={{ flex: 1 }} />
              <h2 style={{ fontSize: 11, fontWeight: 800, color: 'var(--platinum-400)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                Détails par Module
              </h2>
              <div className="silver-line" style={{ flex: 1 }} />
            </div>

            {/* VENTES */}
            {activeModules.has('ventes') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={ShoppingBag} label="Ventes" count={reportStats.filteredSales.length}
                  color="#10b981" bg="rgba(16,185,129,0.05)"
                  open={openSections.has('ventes')} onToggle={() => toggleSection('ventes')}
                />
                {openSections.has('ventes') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    {reportStats.filteredSales.length === 0 && (
                      <p style={{ textAlign: 'center', color: 'var(--platinum-400)', fontSize: 12, padding: '20px 0', margin: 0 }}>Aucune vente dans cette période</p>
                    )}
                    {reportStats.filteredSales.map(s => (
                      <div key={s.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{s.clientName || 'Passager'}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(s.date).toLocaleString('fr-FR')} · {workers.find(w => w.id === s.workerId)?.fullName || '—'}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 15, fontWeight: 900, color: 'var(--ink-900)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{s.total.toLocaleString()} DZD</p>
                            <span className={s.isDebt ? 'badge badge-danger' : 'badge badge-success'} style={{ fontSize: 9 }}>
                              {s.isDebt ? 'Dette' : 'Payé'}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {s.items.map((it, idx) => (
                            <div key={idx} style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '10px 12px' }}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--platinum-400)', margin: '0 0 3px', textTransform: 'capitalize' }}>
                                {(it.shape || '—')} — {silverTypes.find(st => st.id === it.silverTypeId)?.name || it.silverTypeId}
                              </p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)', margin: 0 }}>
                                {it.weight}g × {it.pricePerGram} DZD/g = {it.totalPrice.toLocaleString()} DZD
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ACHATS */}
            {activeModules.has('achats') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={ShoppingCart} label="Achats" count={reportStats.filteredPurchases.length}
                  color="#f59e0b" bg="rgba(245,158,11,0.05)"
                  open={openSections.has('achats')} onToggle={() => toggleSection('achats')}
                />
                {openSections.has('achats') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    {reportStats.filteredPurchases.length === 0 && (
                      <p style={{ textAlign: 'center', color: 'var(--platinum-400)', fontSize: 12, padding: '20px 0', margin: 0 }}>Aucun achat dans cette période</p>
                    )}
                    {reportStats.filteredPurchases.map(p => (
                      <div key={p.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{suppliers.find(s => s.id === p.supplierId)?.name || p.supplierId}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(p.date).toLocaleString('fr-FR')}</p>
                          </div>
                          <p style={{ fontSize: 15, fontWeight: 900, color: '#f59e0b', margin: 0, letterSpacing: '-0.02em' }}>{p.payment.total.toLocaleString()} DZD</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {p.items.map((it, idx) => (
                            <div key={idx} style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '10px 12px' }}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--platinum-400)', margin: '0 0 3px', textTransform: 'capitalize' }}>
                                {it.shape || '—'} — {silverTypes.find(st => st.id === it.silverTypeId)?.name || it.silverTypeId}
                              </p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)', margin: 0 }}>
                                {it.weight}g × {it.pricePerGram} DZD/g = {it.totalPrice.toLocaleString()} DZD
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMMANDES */}
            {activeModules.has('commandes') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Wrench} label="Commandes & Réparations" count={reportStats.filteredCommands.length}
                  color="#6366f1" bg="rgba(99,102,241,0.05)"
                  open={openSections.has('commandes')} onToggle={() => toggleSection('commandes')}
                />
                {openSections.has('commandes') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
                      {[
                        { label: 'Finalisées (période)', value: reportStats.commandsFinished },
                        { label: 'Profit Réparations', value: reportStats.reparationsProfit.toLocaleString() + ' DZD' },
                        { label: 'Profit Industrie', value: reportStats.industryProfit.toLocaleString() + ' DZD' },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                          <p style={{ fontSize: 9, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{item.label}</p>
                          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {reportStats.filteredCommands.map(c => (
                      <div key={c.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{c.clientName}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(c.date).toLocaleString('fr-FR')}</p>
                          </div>
                          <span className={c.status === 'paid' ? 'badge badge-success' : c.status === 'finalized' ? 'badge badge-info' : 'badge badge-warning'} style={{ fontSize: 10 }}>
                            {c.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs" style={{ color: 'var(--platinum-600)' }}>
                          {[
                            ['Type', c.type],
                            ['Métal', c.metal || '—'],
                            ['Poids Initial', `${c.initialWeight}g`],
                            ['Poids Final', c.finalWeight ? `${c.finalWeight}g` : '—'],
                            ['Atelier', workshops.find(w => w.id === c.workshopId)?.name || '—'],
                            ['Versé', `${(c.paidAmount || 0).toLocaleString()} DZD`],
                            ['Prix Client', `${(c.clientPrice || 0).toLocaleString()} DZD`],
                            ['Livraison', c.deliveryId ? (deliveries.find(d => d.id === c.deliveryId)?.fullName || '—') : '—'],
                          ].map(([label, val]) => (
                            <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 10px' }}>
                              <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--platinum-400)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 2 }}>{label}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)' }}>{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CASSIE */}
            {activeModules.has('cassie') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Flame} label="Achats Cassie" count={reportStats.filteredCassiePurchases.length}
                  color="#f97316" bg="rgba(249,115,22,0.05)"
                  open={openSections.has('cassie')} onToggle={() => toggleSection('cassie')}
                />
                {openSections.has('cassie') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 12 }}>
                      <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Poids Total</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{reportStats.totalCassieWeight.toFixed(2)}g</p>
                      </div>
                      <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Coût Total</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{reportStats.totalCassiePurchaseCost.toLocaleString()} DZD</p>
                      </div>
                    </div>
                    {reportStats.filteredCassiePurchases.map((cp: any) => (
                      <div key={cp.id} style={{ background: 'var(--bg-muted)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 3px' }}>{cp.supplierName || '—'}</p>
                          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(cp.date).toLocaleDateString('fr-FR')} · {cp.weight}g</p>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#f97316', margin: 0 }}>{(cp.totalCost || 0).toLocaleString()} DZD</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIVRAISONS */}
            {activeModules.has('livraisons') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Truck} label="Livreurs" count={reportStats.filteredDeliveries.length}
                  color="#3b82f6" bg="rgba(59,130,246,0.05)"
                  open={openSections.has('livraisons')} onToggle={() => toggleSection('livraisons')}
                />
                {openSections.has('livraisons') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    {reportStats.filteredDeliveries.map(dv => (
                      <div key={dv.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{dv.fullName}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{dv.phone} · {new Date(dv.createdDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 800, color: '#3b82f6', margin: 0 }}>
                            {dv.paymentHistory.reduce((s, p) => s + p.amount, 0).toLocaleString()} DZD
                          </p>
                        </div>
                        {dv.paymentHistory.length > 0 && (
                          <div className="space-y-1">
                            {dv.paymentHistory.map(ph => (
                              <div key={ph.id} style={{ fontSize: 12, color: 'var(--platinum-500)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{new Date(ph.date).toLocaleDateString('fr-FR')} · {ph.method}</span>
                                <span style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{ph.amount.toLocaleString()} DZD</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TRAVAILLEURS */}
            {activeModules.has('travailleurs') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Users} label="Travailleurs & Salaires" count={workers.length}
                  color="#8b5cf6" bg="rgba(139,92,246,0.05)"
                  open={openSections.has('travailleurs')} onToggle={() => toggleSection('travailleurs')}
                />
                {openSections.has('travailleurs') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 12 }}>
                      {[
                        { label: 'Salaires Payés', value: reportStats.totalSalaries.toLocaleString() + ' DZD' },
                        { label: 'Avances', value: reportStats.totalAdvances.toLocaleString() + ' DZD' },
                        { label: 'Déductions Absences', value: '-' + reportStats.totalAbsenceDeductions.toLocaleString() + ' DZD' },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                          <p style={{ fontSize: 9, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{item.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {workers.map(w => {
                        const paid = workerPayments.filter(p => p.workerId === w.id && inRange(p.date)).reduce((a, b) => a + b.amount, 0);
                        const advances = workerAdvances.filter(a => a.workerId === w.id && inRange(a.date)).reduce((a, b) => a + b.amount, 0);
                        const absDed = workerAbsences.filter(a => a.workerId === w.id && inRange(a.date)).reduce((a, b) => a + b.deduction, 0);
                        return (
                          <div key={w.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 10px' }}>{w.fullName}</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                ['Salaire (param)', w.salary.toLocaleString() + ' DZD'],
                                ['Payé (période)', paid.toLocaleString() + ' DZD'],
                                ['Avances', advances.toLocaleString() + ' DZD'],
                                ['Absences (déd.)', '-' + absDed.toLocaleString() + ' DZD'],
                              ].map(([l, v]) => (
                                <div key={l} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 10px' }}>
                                  <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--platinum-400)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 2 }}>{l}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)' }}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DÉPENSES */}
            {activeModules.has('depenses') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Receipt} label="Dépenses Magasin" count={reportStats.filteredStoreExpenses.length}
                  color="#f43f5e" bg="rgba(244,63,94,0.05)"
                  open={openSections.has('depenses')} onToggle={() => toggleSection('depenses')}
                />
                {openSections.has('depenses') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-2">
                    <StatRow label="Total Dépenses" value={reportStats.totalStoreExpenses.toLocaleString() + ' DZD'} color="#f43f5e" />
                    {reportStats.filteredStoreExpenses.map(se => (
                      <div key={se.id} style={{ background: 'var(--bg-muted)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 2px' }}>{se.expenseName}</p>
                          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(se.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#f43f5e', margin: 0 }}>{se.price.toLocaleString()} DZD</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CLIENTS */}
            {activeModules.has('clients') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Users} label="Clients" count={clients.length}
                  color="#14b8a6" bg="rgba(20,184,166,0.05)"
                  open={openSections.has('clients')} onToggle={() => toggleSection('clients')}
                />
                {openSections.has('clients') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {clients.map(c => {
                        const balance = (c.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
                        return (
                          <div key={c.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{c.name}</p>
                                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{c.phone}</p>
                              </div>
                              <p style={{ fontSize: 14, fontWeight: 800, color: '#14b8a6', margin: 0, flexShrink: 0 }}>{balance.toLocaleString()} DZD</p>
                            </div>
                            {c.note && <p style={{ fontSize: 11, color: 'var(--platinum-500)', margin: '8px 0 0' }}>{c.note}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DETTES */}
            {activeModules.has('dettes') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={CreditCard} label="Dettes" count={reportStats.filteredDebts.length}
                  color="#6366f1" bg="rgba(99,102,241,0.05)"
                  open={openSections.has('dettes')} onToggle={() => toggleSection('dettes')}
                />
                {openSections.has('dettes') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-2">
                    <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 12 }}>
                      <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Dettes Données</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{reportStats.debtsGiven.toLocaleString()} DZD</p>
                      </div>
                      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Dettes Prises</p>
                        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{reportStats.debtsTaken.toLocaleString()} DZD</p>
                      </div>
                    </div>
                    {reportStats.filteredDebts.map((d: any) => (
                      <div key={d.id} style={{ background: 'var(--bg-muted)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 2px' }}>{d.personName || '—'}</p>
                          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>
                            {new Date(d.date).toLocaleDateString('fr-FR')} · {d.direction === 'given' ? 'Donné' : 'Pris'}
                          </p>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: d.direction === 'given' ? '#f43f5e' : '#6366f1', margin: 0 }}>{(d.remaining || 0).toLocaleString()} DZD</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ÉCHANGES */}
            {activeModules.has('echanges') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Repeat} label="Échanges & Reprises" count={(reportStats.filteredReplacements || []).length}
                  color="#a855f7" bg="rgba(168,85,247,0.05)"
                  open={openSections.has('echanges')} onToggle={() => toggleSection('echanges')}
                />
                {openSections.has('echanges') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    <StatRow label="Impact Net Échanges" value={reportStats.replacementsImpact.toLocaleString() + ' DZD'} color="#a855f7" />
                    {(reportStats.filteredReplacements || []).map((r: any) => (
                      <div key={r.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{r.clientName || '—'}</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(r.date).toLocaleString('fr-FR')}</p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 800, color: '#a855f7', margin: 0 }}>
                            Net: {(Number(r.amountToPay || 0) - Number(r.amountToRefund || 0)).toLocaleString()} DZD
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '10px 12px' }}>
                            <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--platinum-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Retour</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)', margin: 0 }}>
                              {r.returnedItem.shape || r.returnedItem.silverTypeId} — {r.returnedItem.weight}g × {r.returnedItem.pricePerGram} = {(Number(r.returnedItem.weight || 0) * Number(r.returnedItem.pricePerGram || 0)).toLocaleString()} DZD
                            </p>
                          </div>
                          {r.newItem && (
                            <div style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '10px 12px' }}>
                              <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--platinum-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Nouveau</p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)', margin: 0 }}>
                                {r.newItem.shape || r.newItem.silverTypeId} — {r.newItem.weight}g × {r.newItem.pricePerGram} = {(Number(r.newItem.weight || 0) * Number(r.newItem.pricePerGram || 0)).toLocaleString()} DZD
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FUSIONS */}
            {activeModules.has('fusions') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Package} label="Fusions" count={reportStats.filteredMeltings.length}
                  color="#0ea5e9" bg="rgba(14,165,233,0.05)"
                  open={openSections.has('fusions')} onToggle={() => toggleSection('fusions')}
                />
                {openSections.has('fusions') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 12 }}>
                      {[
                        { label: 'Poids Avant', value: reportStats.totalMeltingPreWeight.toFixed(2) + 'g' },
                        { label: 'Perte', value: '-' + reportStats.totalMeltingLoss.toFixed(2) + 'g' },
                        { label: 'Poids Après', value: reportStats.totalMeltingPostWeight.toFixed(2) + 'g' },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                          <p style={{ fontSize: 9, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{item.label}</p>
                          <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-900)', margin: 0 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reportStats.filteredMeltings.map((m: any) => (
                        <div key={m.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 2px' }}>Fusion</p>
                              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>{new Date(m.date).toLocaleString('fr-FR')}</p>
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 800, color: '#f43f5e', margin: 0 }}>Perte: -{Number(m.loss).toFixed(2)}g</p>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--platinum-600)', margin: '0 0 3px' }}>
                            {Number(m.totalPreWeight).toFixed(2)}g → {Number(m.postWeight).toFixed(2)}g
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--platinum-500)', margin: 0 }}>
                            Déposé dans: {(silverTypes.find(s => s.id === m.targetSilverTypeId)?.name) || m.targetSilverTypeId}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* INVENTAIRE */}
            {activeModules.has('inventaire') && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Layers} label="Inventaire Détaillé" count={silverTypes.length}
                  color="#84cc16" bg="rgba(132,204,22,0.05)"
                  open={openSections.has('inventaire')} onToggle={() => toggleSection('inventaire')}
                />
                {openSections.has('inventaire') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {silverTypes.map(st => (
                        <div key={st.id} style={{ background: 'var(--bg-muted)', borderRadius: 14, padding: '14px 18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 3px' }}>{st.name}</p>
                              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--platinum-400)', margin: 0 }}>Calibre {st.calibre}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              {st.isCassie && <span className="badge badge-platinum" style={{ fontSize: 9 }}>Cassie</span>}
                              <p style={{ fontSize: 15, fontWeight: 900, color: '#84cc16', margin: 0 }}>{st.initialQuantity.toFixed(2)}g</p>
                            </div>
                          </div>
                          {!st.isCassie && (
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(st.shapes).map(([shape, qty]) => (
                                <div key={shape} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--platinum-600)', textTransform: 'capitalize' }}>{shape}</span>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-900)' }}>{Number(qty).toFixed(2)}g</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* WEB ORDERS */}
            {activeModules.has('web') && webOrderStats && (
              <div style={{ border: '1px solid var(--platinum-100)', borderRadius: 16, overflow: 'hidden' }}>
                <SectionHeader
                  icon={Globe} label="Commandes Site Web" count={webOrderStats.total}
                  color="#a855f7" bg="rgba(168,85,247,0.05)"
                  open={openSections.has('web')} onToggle={() => toggleSection('web')}
                />
                {openSections.has('web') && (
                  <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--platinum-100)', padding: 20 }} className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: 12 }}>
                      {[
                        { label: "Chiffre d'affaires", value: webOrderStats.totalRevenue.toLocaleString() + ' DZD', color: '#a855f7' },
                        { label: 'CA Finalisé', value: webOrderStats.finalizedRevenue.toLocaleString() + ' DZD', color: '#14b8a6' },
                        { label: 'Frais Livraison', value: webOrderStats.totalDeliveryFees.toLocaleString() + ' DZD', color: '#3b82f6' },
                        { label: 'Panier Moyen', value: webOrderStats.avgOrderValue.toFixed(0) + ' DZD', color: 'var(--gold-pure)' },
                        { label: 'En attente', value: String(webOrderStats.pending), color: '#f59e0b' },
                        { label: 'Acceptées', value: String(webOrderStats.accepted), color: '#3b82f6' },
                        { label: 'Finalisées', value: String(webOrderStats.finalized), color: '#10b981' },
                        { label: 'Annulées', value: String(webOrderStats.cancelled), color: '#f43f5e' },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'var(--bg-muted)', borderRadius: 12, padding: '12px 14px' }}>
                          <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--platinum-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{item.label}</p>
                          <p style={{ fontSize: 15, fontWeight: 900, color: item.color, margin: 0 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {webOrderStats.filtered.map(o => (
                        <div key={o.id} style={{ background: 'var(--bg-muted)', borderRadius: 12, padding: '12px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)' }}>{o.orderNumber}</span>
                          <span style={{ fontSize: 11, color: 'var(--platinum-400)' }}>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-900)' }}>{o.clientFullName}</span>
                          <span style={{ fontSize: 11, color: 'var(--platinum-400)' }}>{o.wilayaName}</span>
                          <span className={`badge ${o.status === 'finalized' ? 'badge-success' : o.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 9 }}>
                            {o.status}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--platinum-500)' }}>{o.items.length} article(s)</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#a855f7', marginLeft: 'auto' }}>{o.total.toLocaleString()} DZD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PRINT BUTTON */}
          <div className="flex gap-4 no-print" style={{ paddingTop: 8 }}>
            <button
              onClick={() => window.print()}
              className="btn-gold"
              style={{ flex: 1, height: 48, borderRadius: 14, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
            >
              <Download size={16} /> Exporter le Rapport
            </button>
            <button
              onClick={() => setReportGenerated(false)}
              className="btn-outline"
              style={{ height: 48, borderRadius: 14, padding: '0 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <RefreshCw size={15} /> Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
