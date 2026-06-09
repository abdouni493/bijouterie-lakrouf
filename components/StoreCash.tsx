
import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, ShoppingBag, ShoppingCart,
  Truck, Wrench, Users, BarChart2, DollarSign, Scale, Filter,
  Calendar, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const StoreCash: React.FC = () => {
  const {
    sales, purchases, cassiePurchases, storeExpenses, deliveries,
    workshops, workers, workerPayments, clients, language, silverPricePerGram
  } = useApp();
  const t = translations[language];
  const shouldReduce = useReducedMotion();

  // Date filtering
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [showLastMonthOnly, setShowLastMonthOnly] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSilverDetail, setShowSilverDetail] = useState(false);

  // Date filtering logic
  const todayFiltered = (data: any[]) => {
    const today = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === today.toDateString();
    });
  };

  const lastMonthFiltered = (data: any[]) => {
    const today = new Date();
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= lastMonthDate && itemDate <= today;
    });
  };

  const customRangeFiltered = (data: any[]) => {
    if (!startDate || !endDate) return data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  };

  const getFilteredData = (data: any[]) => {
    if (showTodayOnly) return todayFiltered(data);
    if (showLastMonthOnly) return lastMonthFiltered(data);
    if (startDate && endDate) return customRangeFiltered(data);
    return data;
  };

  // Apply filters to all data
  const filteredSales = getFilteredData(sales);
  const filteredPurchases = getFilteredData(purchases);
  const filteredCassiePurchases = getFilteredData(cassiePurchases);
  const filteredStoreExpenses = getFilteredData(storeExpenses);
  const filteredDeliveries = getFilteredData(deliveries);
  const filteredWorkerPayments = getFilteredData(workerPayments);

  // Calculate all metrics
  const totalSellWeight = filteredSales.reduce((sum, sale) => {
    return sum + (sale.items?.reduce((itemSum: number, item: any) => itemSum + (item.weight || 0), 0) || 0);
  }, 0);

  const totalSellMoney = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

  const purchaseCost = filteredPurchases.reduce((sum, purchase) => {
    return sum + (purchase.items?.reduce((itemSum: number, item: any) => itemSum + (item.totalPrice || 0), 0) || 0);
  }, 0);

  const cassieCost = filteredCassiePurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const cassieTotalWeight = filteredCassiePurchases.reduce((sum, p) => sum + p.weight, 0);

  const normalPurchaseWeight = filteredPurchases.reduce((sum, purchase) => {
    return sum + (purchase.items?.reduce((itemSum: number, item: any) => itemSum + (item.weight || 0), 0) || 0);
  }, 0);

  const benefit = totalSellMoney - purchaseCost - cassieCost;

  const totalExpenses = filteredStoreExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const totalDeliveryCost = filteredDeliveries.reduce((sum, delivery) => {
    return sum + (delivery.paymentActions?.reduce((paySum: number, p: any) => paySum + (p.amount || 0), 0) || 0);
  }, 0);

  const totalWorkplaceCost = workshops.reduce((sum, workshop) => sum + (workshop.cost || 0), 0);

  const totalWorkerPayment = filteredWorkerPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const totalClientAmount = clients.length;

  const moneyIn = totalSellMoney;
  const moneyOut = purchaseCost + cassieCost + totalExpenses + totalDeliveryCost + totalWorkerPayment;
  const remainingCash = moneyIn - moneyOut;

  const silverCost = totalSellWeight * silverPricePerGram;
  const silverBenefit = totalSellMoney - silverCost;

  const activeFilter = showTodayOnly ? "Aujourd'hui" : showLastMonthOnly ? 'Mois dernier' : (startDate && endDate) ? `${startDate} → ${endDate}` : 'Toutes les périodes';

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
          <h1 className="section-title">Trésorerie Magasin</h1>
          <p className="section-subtitle">Flux de trésorerie, liquidités & bilan financier</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <Filter size={14} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--silver-200)' }}>{activeFilter}</span>
        </div>
      </div>

      {/* Date Filters */}
      <div className="lux-card" style={{ padding: '20px 24px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={14} style={{ color: 'var(--gold)' }} /> Filtrer par période
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr 1fr', gap: 12, alignItems: 'end', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setShowTodayOnly(!showTodayOnly); setShowLastMonthOnly(false); setStartDate(''); setEndDate(''); }}
            style={{
              padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.18s',
              background: showTodayOnly ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              color: showTodayOnly ? 'var(--deep-bg)' : 'var(--silver-200)',
              border: showTodayOnly ? '1px solid var(--gold)' : '1px solid var(--border)'
            }}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => { setShowLastMonthOnly(!showLastMonthOnly); setShowTodayOnly(false); setStartDate(''); setEndDate(''); }}
            style={{
              padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.18s',
              background: showLastMonthOnly ? 'var(--gold)' : 'rgba(255,255,255,0.05)',
              color: showLastMonthOnly ? 'var(--deep-bg)' : 'var(--silver-200)',
              border: showLastMonthOnly ? '1px solid var(--gold)' : '1px solid var(--border)'
            }}
          >
            Mois dernier
          </button>
          <div>
            <label className="lux-label" style={{ marginBottom: 6, display: 'block' }}>Depuis</label>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setShowTodayOnly(false); setShowLastMonthOnly(false); }}
              className="lux-input"
            />
          </div>
          <div>
            <label className="lux-label" style={{ marginBottom: 6, display: 'block' }}>Jusqu'à</label>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setShowTodayOnly(false); setShowLastMonthOnly(false); }}
              className="lux-input"
            />
          </div>
        </div>
      </div>

      {/* ── MAIN BALANCE HERO ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {/* Money In */}
        <div className="lux-card" style={{ padding: 28, borderLeft: '3px solid #34d399' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight size={22} style={{ color: '#34d399' }} />
            </div>
            <span className="badge badge-success">Entrées</span>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Total Encaissé</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#34d399', letterSpacing: '-0.04em', margin: 0 }}>
            {moneyIn.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, color: 'var(--silver-400)', margin: '4px 0 0', fontWeight: 600 }}>DZD</p>
        </div>

        {/* Money Out */}
        <div className="lux-card" style={{ padding: 28, borderLeft: '3px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownRight size={22} style={{ color: 'var(--danger)' }} />
            </div>
            <span className="badge badge-danger">Sorties</span>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Total Décaissé</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--danger)', letterSpacing: '-0.04em', margin: 0 }}>
            {moneyOut.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, color: 'var(--silver-400)', margin: '4px 0 0', fontWeight: 600 }}>DZD</p>
        </div>

        {/* Net Balance */}
        <div className="lux-card" style={{ padding: 28, borderLeft: `3px solid ${remainingCash >= 0 ? 'var(--gold)' : 'var(--danger)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={22} style={{ color: 'var(--gold)' }} />
            </div>
            <span className={`badge ${remainingCash >= 0 ? 'badge-gold' : 'badge-danger'}`}>
              {remainingCash >= 0 ? 'Positif' : 'Déficit'}
            </span>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Trésorerie Nette</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: remainingCash >= 0 ? 'var(--gold)' : 'var(--danger)', letterSpacing: '-0.04em', margin: 0 }}>
            {remainingCash.toLocaleString()}
          </p>
          <p style={{ fontSize: 12, color: 'var(--silver-400)', margin: '4px 0 0', fontWeight: 600 }}>DZD</p>
        </div>
      </div>

      {/* ── INCOME SOURCES ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: '#34d399' }} />
          <p style={{ fontSize: 12, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Sources de Revenus</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBag size={20} style={{ color: '#34d399' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Ventes ({filteredSales.length})</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalSellMoney.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{totalSellWeight.toFixed(2)} g vendus</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── EXPENSE BREAKDOWN ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: 'var(--danger)' }} />
          <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Détail des Dépenses</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {/* Normal Purchases */}
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingCart size={20} style={{ color: 'var(--danger)' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Achats Normaux</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{purchaseCost.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{normalPurchaseWeight.toFixed(2)} g</p>
            </div>
          </div>

          {/* Cassie Purchases */}
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(251,146,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Scale size={20} style={{ color: '#fb923c' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Achats Cassie</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{cassieCost.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{cassieTotalWeight.toFixed(2)} g</p>
            </div>
          </div>

          {/* Store Expenses */}
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <DollarSign size={20} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Frais Magasin</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalExpenses.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{filteredStoreExpenses.length} entrées</p>
            </div>
          </div>

          {/* Deliveries */}
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={20} style={{ color: '#818cf8' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Livraisons</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalDeliveryCost.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{filteredDeliveries.length} livraisons</p>
            </div>
          </div>

          {/* Workshops */}
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Wrench size={20} style={{ color: 'var(--teal)' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Ateliers</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalWorkplaceCost.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{workshops.length} ateliers</p>
            </div>
          </div>

          {/* Worker Payments */}
          <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={20} style={{ color: '#4ade80' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Paiements Ouvriers</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>{totalWorkerPayment.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--gold)' }}>DZD</span></p>
              <p style={{ fontSize: 10, color: 'var(--silver-400)', margin: '2px 0 0' }}>{workers.length} employés</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CASH FLOW TABLE ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: 'var(--gold)' }} />
          <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Bilan des Flux</p>
        </div>
        <div className="lux-card" style={{ overflow: 'hidden' }}>
          <table className="lux-table">
            <thead>
              <tr>
                <th>Poste</th>
                <th>Catégorie</th>
                <th style={{ textAlign: 'right' }}>Montant (DZD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#34d399', fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ArrowUpRight size={15} style={{ color: '#34d399' }} /> Ventes</span>
                </td>
                <td><span className="badge badge-success">Entrée</span></td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: '#34d399' }}>+{totalSellMoney.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ArrowDownRight size={15} style={{ color: 'var(--danger)' }} /> Achats Normaux</span>
                </td>
                <td><span className="badge badge-danger">Sortie</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>-{purchaseCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ArrowDownRight size={15} style={{ color: 'var(--danger)' }} /> Achats Cassie</span>
                </td>
                <td><span className="badge badge-danger">Sortie</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>-{cassieCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ArrowDownRight size={15} style={{ color: 'var(--danger)' }} /> Frais Magasin</span>
                </td>
                <td><span className="badge badge-danger">Sortie</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>-{totalExpenses.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ArrowDownRight size={15} style={{ color: 'var(--danger)' }} /> Livraisons</span>
                </td>
                <td><span className="badge badge-danger">Sortie</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>-{totalDeliveryCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ArrowDownRight size={15} style={{ color: 'var(--danger)' }} /> Paiements Ouvriers</span>
                </td>
                <td><span className="badge badge-danger">Sortie</span></td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>-{totalWorkerPayment.toLocaleString()}</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--border)' }}>
                <td style={{ fontWeight: 800, color: remainingCash >= 0 ? 'var(--gold)' : 'var(--danger)', fontSize: 15 }}>
                  Solde Net
                </td>
                <td>
                  <span className={`badge ${remainingCash >= 0 ? 'badge-gold' : 'badge-danger'}`}>
                    {remainingCash >= 0 ? 'Excédent' : 'Déficit'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 16, color: remainingCash >= 0 ? 'var(--gold)' : 'var(--danger)' }}>
                  {remainingCash >= 0 ? '+' : ''}{remainingCash.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADDITIONAL METRICS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={20} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Bénéfice Brut</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: benefit >= 0 ? 'var(--gold)' : 'var(--danger)', letterSpacing: '-0.03em', margin: 0 }}>
              {benefit.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--silver-400)' }}>DZD</span>
            </p>
          </div>
        </div>
        <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} style={{ color: 'var(--teal)' }} />
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Total Clients</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>
              {totalClientAmount} <span style={{ fontSize: 10, color: 'var(--silver-400)' }}>clients</span>
            </p>
          </div>
        </div>
        <div className="lux-card" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={20} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Poids Vendu</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver-100)', letterSpacing: '-0.03em', margin: 0 }}>
              {totalSellWeight.toFixed(2)} <span style={{ fontSize: 10, color: 'var(--silver-400)' }}>g</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── SILVER PRICE SECTION ── */}
      {silverPricePerGram > 0 && (
        <div className="lux-card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setShowSilverDetail(!showSilverDetail)}
            style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>Bénéfice Calculé par Prix Argent</p>
                <p style={{ fontSize: 10, color: 'var(--silver-300)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '2px 0 0' }}>
                  Prix défini: {silverPricePerGram} DZD/g
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: silverBenefit >= 0 ? 'var(--gold)' : 'var(--danger)' }}>
                {silverBenefit.toLocaleString()} DZD
              </span>
              {showSilverDetail ? <ChevronUp size={18} style={{ color: 'var(--silver-300)' }} /> : <ChevronDown size={18} style={{ color: 'var(--silver-300)' }} />}
            </div>
          </button>

          <AnimatePresence>
            {showSilverDetail && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Prix Argent/g</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)', margin: 0 }}>{silverPricePerGram} DZD</p>
                    </div>
                    <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Poids Vendu</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>{totalSellWeight.toFixed(2)} g</p>
                    </div>
                    <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Coût Argent</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--silver-100)', margin: 0 }}>{silverCost.toLocaleString()} DZD</p>
                    </div>
                    <div style={{ padding: '14px 16px', borderRadius: 12, background: silverBenefit >= 0 ? 'rgba(201,168,76,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${silverBenefit >= 0 ? 'rgba(201,168,76,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--silver-400)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Bénéfice Brut</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: silverBenefit >= 0 ? 'var(--gold)' : 'var(--danger)', margin: 0 }}>{silverBenefit.toLocaleString()} DZD</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--silver-400)', margin: 0 }}>
                    Calcul: {totalSellMoney.toLocaleString()} DZD (ventes) &minus; {silverCost.toLocaleString()} DZD ({totalSellWeight.toFixed(2)} g &times; {silverPricePerGram} DZD/g)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default StoreCash;
