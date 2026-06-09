
import React, { useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Wallet, Calendar, History, MinusCircle, PlusCircle, 
  TrendingUp, CreditCard, Calculator, Info
} from 'lucide-react';
import { useApp } from '../AppContext';
import { translations } from '../translations';

const MyPayroll: React.FC = () => {
  const { workers, workerAdvances, workerAbsences, workerPayments, language, user } = useApp();
  const t = translations[language];

  const worker = useMemo(() => workers.find(w => w.id === user?.id), [workers, user]);

  const stats = useMemo(() => {
    if (!worker) return { advances: 0, absences: 0, payments: 0, remaining: 0 };
    
    const advances = workerAdvances.filter(a => a.workerId === worker.id).reduce((sum, a) => sum + a.amount, 0);
    const absences = workerAbsences.filter(a => a.workerId === worker.id).reduce((sum, a) => sum + a.deduction, 0);
    const payments = workerPayments.filter(p => p.workerId === worker.id).reduce((sum, p) => sum + p.amount, 0);
    
    return {
      advances,
      absences,
      payments,
      remaining: worker.salary - advances - absences - payments
    };
  }, [worker, workerAdvances, workerAbsences, workerPayments]);

  if (!worker) return <div className="p-10 text-center font-black uppercase tracking-widest text-slate-300">Profil introuvable</div>;

  return (
    <div className="space-y-8 animate-fade-scale">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{language === 'ar' ? 'مستحقاتي المالية' : 'Ma Situation Financière'}</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Séquenceur de revenus personnel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-2">Net à Percevoir</p>
             <h3 className="text-4xl font-black tracking-tighter mb-8">{stats.remaining.toLocaleString()} <span className="text-lg text-amber-400">DZD</span></h3>
             <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 w-fit">
                <CreditCard size={16} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-widest">{t[worker.paymentType]}</span>
             </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Salaire de Base</p>
                 <p className="text-xl font-black text-slate-800">{worker.salary.toLocaleString()} DZD</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Avances</p>
                    <p className="font-black text-indigo-600 text-sm">{stats.advances.toLocaleString()}</p>
                 </div>
                 <div className="p-4 bg-rose-50 rounded-2xl">
                    <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Absences</p>
                    <p className="font-black text-rose-600 text-sm">{stats.absences.toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* History Timeline */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-[600px]">
           <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl"><History size={24}/></div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Historique des Transactions</h3>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-6">
              {[...workerAdvances.filter(a => a.workerId === worker.id), 
                ...workerAbsences.filter(a => a.workerId === worker.id), 
                ...workerPayments.filter(p => p.workerId === worker.id)]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item: any, idx) => {
                  const isAdvance = 'amount' in item && !('workerId' in item && workerPayments.includes(item)); // Simpler check for testing
                  const isAbsence = 'deduction' in item;
                  const isPayment = workerPayments.some(p => p.id === item.id);

                  return (
                    <div key={idx} className="flex items-center gap-6 group">
                       <div className="text-right w-24 shrink-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(item.date).toLocaleDateString()}</p>
                          <p className="text-[9px] text-slate-300 font-bold">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                       <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-150 ${isAdvance ? 'bg-indigo-500' : isAbsence ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <div className="w-px h-full bg-slate-100 min-h-[40px]" />
                       </div>
                       <div className={`flex-1 p-6 rounded-[2rem] border border-slate-50 transition-all group-hover:shadow-xl group-hover:translate-x-2 ${isAdvance ? 'bg-indigo-50/30' : isAbsence ? 'bg-rose-50/30' : 'bg-emerald-50/30'}`}>
                          <div className="flex justify-between items-center">
                             <div>
                                <h4 className="font-black text-slate-800 text-sm">
                                   {isAdvance ? 'Avance sur salaire' : isAbsence ? 'Déduction absence' : 'Règlement mensuel'}
                                </h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Transaction enregistrée par admin</p>
                             </div>
                             <span className={`font-black text-lg tracking-tighter ${isAbsence || isAdvance ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {isAbsence ? `-${item.deduction}` : isAdvance ? `-${item.amount}` : `+${item.amount}`} <span className="text-[10px]">DZD</span>
                             </span>
                          </div>
                       </div>
                    </div>
                  );
                })}
              
              {stats.advances + stats.absences + stats.payments === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                   <Info size={48} />
                   <p className="font-black uppercase tracking-[3px] text-xs">Aucun historique disponible</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayroll;
