
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  User,
  Language,
  SilverType,
  Supplier,
  PurchaseInvoice,
  SaleInvoice,
  Workshop,
  Command,
  Worker,
  WorkerAdvance,
  WorkerAbsence,
  WorkerPaymentRecord,
  Delivery,
  StoreExpense,
  PaymentAction,
  Debt,
  ReplacementInvoice,
  CassiePurchase,
  MeltingRecord,
  WebOffer,
  WebSpecialOffer,
  WebDeliveryCompany,
  WebContacts,
  WebOrder,
} from './types';

interface AppState {
  user: User | null;
  language: Language;
  silverTypes: SilverType[];
  suppliers: Supplier[];
  purchases: PurchaseInvoice[];
  sales: SaleInvoice[];
  workshops: Workshop[];
  commands: Command[];
  workers: Worker[];
  workerAdvances: WorkerAdvance[];
  workerAbsences: WorkerAbsence[];
  workerPayments: WorkerPaymentRecord[];
  deliveries: Delivery[];
  storeExpenses: StoreExpense[];
  debts: Debt[];
  cassiePurchases: any[];
  meltings: any[];
  shapes: string[];
  calibres: string[];
  metals: string[];
  minimalWeight: number;
  settings: import('./types').StoreSettings;

  setUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;

  addSilverType: (st: Omit<SilverType, 'id'>) => Promise<void>;
  updateSilverType: (id: string, st: Partial<SilverType>) => Promise<void>;
  deleteSilverType: (id: string) => Promise<void>;

  addSupplier: (s: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, s: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  addPurchase: (p: Omit<PurchaseInvoice, 'id'>) => Promise<void>;
  updatePurchase: (id: string, p: Partial<PurchaseInvoice>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;

  addSale: (s: Omit<SaleInvoice, 'id'>) => Promise<void>;
  updateSale: (id: string, s: Partial<SaleInvoice>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;

  addWorkshop: (w: Omit<Workshop, 'id'>) => Promise<void>;
  updateWorkshop: (id: string, w: Partial<Workshop>) => Promise<void>;
  deleteWorkshop: (id: string) => Promise<void>;

  addCommand: (c: Omit<Command, 'id'>) => Promise<void>;
  updateCommand: (id: string, c: Partial<Command>) => Promise<void>;
  deleteCommand: (id: string) => Promise<void>;

  addWorker: (w: Omit<Worker, 'id'>) => Promise<void>;
  updateWorker: (id: string, w: Partial<Worker>) => Promise<void>;
  deleteWorker: (id: string) => Promise<void>;

  addAdvance: (a: Omit<WorkerAdvance, 'id'>) => Promise<void>;
  addAbsence: (a: Omit<WorkerAbsence, 'id'>) => Promise<void>;
  addWorkerPayment: (p: Omit<WorkerPaymentRecord, 'id'>) => Promise<void>;

  addDelivery: (d: Omit<Delivery, 'id'>) => Promise<void>;
  updateDelivery: (id: string, d: Partial<Delivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  addPaymentAction: (deliveryId: string, p: Omit<PaymentAction, 'id'>) => Promise<void>;
  deletePaymentAction: (deliveryId: string, paymentId: string) => Promise<void>;

  addStoreExpense: (e: Omit<StoreExpense, 'id'>) => Promise<void>;
  updateStoreExpense: (id: string, e: Partial<StoreExpense>) => Promise<void>;
  deleteStoreExpense: (id: string) => Promise<void>;

  clients: import('./types').Client[];
  addClient: (c: Omit<import('./types').Client, 'id' | 'payments'>) => Promise<void>;
  updateClient: (id: string, c: Partial<import('./types').Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addClientPayment: (clientId: string, p: Omit<import('./types').ClientPayment, 'id'>) => Promise<void>;
  deleteClientPayment: (clientId: string, paymentId: string) => Promise<void>;
  addClientRecuperation: (clientId: string, r: Omit<import('./types').ClientRecuperation, 'id'>) => Promise<void>;
  deleteClientRecuperation: (clientId: string, recuperationId: string) => Promise<void>;

  replacements: import('./types').ReplacementInvoice[];
  addReplacement: (r: Omit<import('./types').ReplacementInvoice, 'id' | 'date' | 'amountDifference' | 'amountToPay' | 'amountToRefund'>) => Promise<void>;
  updateReplacement: (id: string, r: Partial<import('./types').ReplacementInvoice>) => Promise<void>;
  deleteReplacement: (id: string) => Promise<void>;

  addDebt: (d: Omit<Debt, 'id' | 'date' | 'amountPaid' | 'remaining' | 'isPaid'>) => Promise<void>;
  updateDebt: (id: string, d: Partial<Debt>) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  payDebt: (id: string, amount: number) => Promise<void>;

  addCassiePurchase: (cp: Omit<import('./types').CassiePurchase, 'id' | 'date' | 'isMelted'>) => Promise<void>;
  updateCassiePurchase: (id: string, cp: Partial<import('./types').CassiePurchase>) => Promise<void>;
  deleteCassiePurchase: (id: string) => Promise<void>;
  meltCassiePurchases: (purchaseIds: string[], postWeight: number, targetSilverTypeId: string) => Promise<void>;
  deleteMeltingRecord: (id: string) => Promise<void>;
  updateMeltingRecord: (id: string, postWeight: number, targetSilverTypeId: string) => Promise<void>;

  addShape: (name: string) => Promise<void>;
  updateShape: (oldName: string, newName: string) => Promise<void>;
  deleteShape: (name: string) => Promise<void>;

  addCalibre: (calibre: string) => Promise<void>;
  deleteCalibre: (calibre: string) => Promise<void>;

  addMetal: (metal: string) => Promise<void>;
  deleteMetal: (metal: string) => Promise<void>;

  setMinimalWeight: (weight: number) => Promise<void>;

  silverPricePerGram: number;
  setSilverPricePerGram: (price: number) => Promise<void>;
  updateSettings: (s: Partial<import('./types').StoreSettings>) => Promise<void>;

  webOffers: WebOffer[];
  addWebOffer: (o: Omit<WebOffer, 'id' | 'createdAt'>) => Promise<void>;
  updateWebOffer: (id: string, o: Partial<WebOffer>) => Promise<void>;
  deleteWebOffer: (id: string) => Promise<void>;

  webSpecialOffers: WebSpecialOffer[];
  addWebSpecialOffer: (o: Omit<WebSpecialOffer, 'id' | 'createdAt'>) => Promise<void>;
  updateWebSpecialOffer: (id: string, o: Partial<WebSpecialOffer>) => Promise<void>;
  deleteWebSpecialOffer: (id: string) => Promise<void>;

  webDeliveryCompanies: WebDeliveryCompany[];
  addWebDeliveryCompany: (c: Omit<WebDeliveryCompany, 'id'>) => Promise<void>;
  updateWebDeliveryCompany: (id: string, c: Partial<WebDeliveryCompany>) => Promise<void>;
  deleteWebDeliveryCompany: (id: string) => Promise<void>;

  webContacts: WebContacts;
  updateWebContacts: (c: Partial<WebContacts>) => Promise<void>;

  webOrders: WebOrder[];
  addWebOrder: (o: Omit<WebOrder, 'id' | 'createdAt' | 'orderNumber' | 'status'>) => Promise<string>;
  updateWebOrder: (id: string, o: Partial<WebOrder>) => Promise<void>;
  deleteWebOrder: (id: string) => Promise<void>;
  finalizeWebOrder: (id: string) => Promise<void>;
  cancelWebOrder: (id: string, recoverStock?: boolean) => Promise<void>;

  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;

  isLoading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

// ─── Helper: map SilverType to DB row ────────────────────────────────────────
const stToRow = (st: SilverType) => ({
  id: st.id, name: st.name, calibre: st.calibre,
  initial_quantity: st.initialQuantity, is_cassie: st.isCassie,
  is_ala_piece: (st as any).isAlaPiece || false, shapes: st.shapes,
});

const upsertSilverTypes = async (types: SilverType[]) => {
  const { error } = await supabase.from('silver_types').upsert(types.map(stToRow), { onConflict: 'id' });
  if (error) console.error('[upsertSilverTypes]', error.message);
};

const WEB_KEYS = [
  'webBadgeFr','webBadgeAr','webHeroLine1Fr','webHeroLine1Ar','webHeroLine2Fr','webHeroLine2Ar',
  'webHeroDescFr','webHeroDescAr','webCta1Fr','webCta1Ar','webCta2Fr','webCta2Ar',
  'webFeaturedTitleFr','webFeaturedTitleAr','webViewAllCtaFr','webViewAllCtaAr',
  'webStoryTagFr','webStoryTagAr','webStoryTitleFr','webStoryTitleAr','webStoryDescFr','webStoryDescAr',
  'webStat1Val','webStat2Val','webStat3Val','webStat4Val',
  'webStat1LabelFr','webStat1LabelAr','webStat2LabelFr','webStat2LabelAr',
  'webStat3LabelFr','webStat3LabelAr','webStat4LabelFr','webStat4LabelAr',
  'webBenefit1TitleFr','webBenefit1DescFr','webBenefit1TitleAr','webBenefit1DescAr',
  'webBenefit2TitleFr','webBenefit2DescFr','webBenefit2TitleAr','webBenefit2DescAr',
  'webBenefit3TitleFr','webBenefit3DescFr','webBenefit3TitleAr','webBenefit3DescAr',
  'webBenefit4TitleFr','webBenefit4DescFr','webBenefit4TitleAr','webBenefit4DescAr',
  'webPersonalizedTitleFr','webPersonalizedTitleAr','webPersonalizedDescFr','webPersonalizedDescAr',
  'webPersonalizedCtaFr','webPersonalizedCtaAr','webMarqueeItems',
] as const;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'light';
  });

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const [silverTypes, setSilverTypes] = useState<SilverType[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [shapes, setShapes] = useState<string[]>([
    'ring','necklace','earring','bracelet','parure4piece','triyeu3piece',
    'gourmette','pendentif','louiza','mahazma','motife',
  ]);
  const [calibres, setCalibresList] = useState<string[]>(['925','18k','14k','10k','750','585','417']);
  const [metals, setMetalsList] = useState<string[]>(['Argent','Or','Or Blanc','Platine','Cuivre','Acier']);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [sales, setSales] = useState<SaleInvoice[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerAdvances, setWorkerAdvances] = useState<WorkerAdvance[]>([]);
  const [workerAbsences, setWorkerAbsences] = useState<WorkerAbsence[]>([]);
  const [workerPayments, setWorkerPayments] = useState<WorkerPaymentRecord[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [storeExpenses, setStoreExpenses] = useState<StoreExpense[]>([]);
  const [cassiePurchases, setCassiePurchases] = useState<CassiePurchase[]>([]);
  const [meltings, setMeltings] = useState<MeltingRecord[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [replacements, setReplacements] = useState<ReplacementInvoice[]>([]);
  const [clients, setClients] = useState<import('./types').Client[]>([]);

  const [settings, setSettings] = useState<import('./types').StoreSettings>({
    logo: null, storeName: '', slogan: '', contact: '', phone: '', address: '',
  });
  const [minimalWeight, setMinimalWeightState] = useState<number>(1000);
  const [silverPricePerGram, setSilverPricePerGramState] = useState<number>(0);

  const [webOffers, setWebOffers] = useState<WebOffer[]>([]);
  const [webSpecialOffers, setWebSpecialOffers] = useState<WebSpecialOffer[]>([]);
  const [webDeliveryCompanies, setWebDeliveryCompanies] = useState<WebDeliveryCompany[]>([]);
  const [webContacts, setWebContacts] = useState<WebContacts>({});
  const [webOrders, setWebOrders] = useState<WebOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI preferences only
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('language', language); }, [language]);

  // ─── SUPABASE LOAD ON MOUNT ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [
          stRes, supRes, purRes, saleRes, wsRes, cmdRes, wrkRes, advRes, absRes, payRes,
          delRes, expRes, debtRes, repRes, cliRes, cpRes, meltRes, silRes,
          woRes, wsoRes, wdcRes, wcRes, worderRes, settRes,
        ] = await Promise.allSettled([
          supabase.from('silver_types').select('*'),
          supabase.from('suppliers').select('*'),
          supabase.from('purchase_invoices').select('*'),
          supabase.from('sale_invoices').select('*'),
          supabase.from('workshops').select('*'),
          supabase.from('commands').select('*'),
          supabase.from('workers').select('*'),
          supabase.from('worker_advances').select('*'),
          supabase.from('worker_absences').select('*'),
          supabase.from('worker_payment_records').select('*'),
          supabase.from('deliveries').select('*'),
          supabase.from('store_expenses').select('*'),
          supabase.from('debts').select('*'),
          supabase.from('replacements').select('*'),
          supabase.from('clients').select('*'),
          supabase.from('cassie_purchases').select('*'),
          supabase.from('melting_records').select('*'),
          supabase.from('silver_types').select('*'),
          supabase.from('web_offers').select('*'),
          supabase.from('web_special_offers').select('*'),
          supabase.from('web_delivery_companies').select('*'),
          supabase.from('web_contacts').select('*').eq('id', 'main').maybeSingle(),
          supabase.from('web_orders').select('*'),
          supabase.from('store_settings').select('*').eq('id', 'main').maybeSingle(),
        ]);

        const ok = <T,>(r: PromiseSettledResult<{ data: T | null; error: any }>): T | null =>
          r.status === 'fulfilled' ? r.value.data : null;

        const stData = ok<any[]>(stRes);
        if (stData?.length) setSilverTypes(stData.map(r => ({
          id: String(r.id), name: r.name, calibre: r.calibre,
          initialQuantity: Number(r.initial_quantity || 0),
          isCassie: Boolean(r.is_cassie), isAlaPiece: Boolean(r.is_ala_piece),
          shapes: r.shapes || {},
        })));

        const supData = ok<any[]>(supRes);
        if (supData?.length) setSuppliers(supData.map(r => ({ id: String(r.id), name: r.name, phone: r.phone || '', address: r.address || '' })));

        const purData = ok<any[]>(purRes);
        if (purData?.length) setPurchases(purData.map(r => ({
          id: String(r.id), supplierId: r.supplier_id, date: r.date,
          items: r.items || [], payment: r.payment || {},
          amountPaid: Number(r.amount_paid || 0), remaining: Number(r.remaining || 0),
          isDebt: Boolean(r.is_debt),
        })));

        const saleData = ok<any[]>(saleRes);
        if (saleData?.length) setSales(saleData.map(r => ({
          id: String(r.id), date: r.date, workerId: r.worker_id,
          clientName: r.client_name, clientPhone: r.client_phone || '',
          items: r.items || [], isDebt: Boolean(r.is_debt),
          total: Number(r.total || 0), amountPaid: r.amount_paid, remaining: r.remaining,
        })));

        const wsData = ok<any[]>(wsRes);
        if (wsData?.length) setWorkshops(wsData.map(r => ({ id: String(r.id), name: r.name, phone: r.phone || '', address: r.address || '' })));

        const cmdData = ok<any[]>(cmdRes);
        if (cmdData?.length) setCommands(cmdData.map(r => ({
          id: String(r.id), type: r.type, clientName: r.client_name, clientPhone: r.client_phone || '',
          metal: r.metal, initialWeight: Number(r.initial_weight || 0), workshopId: r.workshop_id,
          date: r.date, status: r.status, paidAmount: Number(r.paid_amount || 0),
          shape: r.shape, finalWeight: r.final_weight, workshopPrice: r.workshop_price,
          clientPrice: r.client_price, endDate: r.end_date,
        })));

        const wrkData = ok<any[]>(wrkRes);
        if (wrkData?.length) setWorkers(wrkData.map(r => ({
          id: String(r.id), fullName: r.full_name, phone: r.phone || '', address: r.address || '',
          paymentType: r.payment_type, salary: Number(r.salary || 0),
          username: r.username, password: r.password, createdAt: r.created_at,
        })));

        const advData = ok<any[]>(advRes);
        if (advData?.length) setWorkerAdvances(advData.map(r => ({ id: String(r.id), workerId: r.worker_id, amount: Number(r.amount || 0), date: r.date })));

        const absData = ok<any[]>(absRes);
        if (absData?.length) setWorkerAbsences(absData.map(r => ({ id: String(r.id), workerId: r.worker_id, deduction: Number(r.deduction || 0), date: r.date })));

        const payData = ok<any[]>(payRes);
        if (payData?.length) setWorkerPayments(payData.map(r => ({ id: String(r.id), workerId: r.worker_id, amount: Number(r.amount || 0), date: r.date })));

        const delData = ok<any[]>(delRes);
        if (delData?.length) setDeliveries(delData.map(r => ({
          id: String(r.id), fullName: r.full_name, phone: r.phone || '',
          createdDate: r.created_date, paymentHistory: r.payment_history || [],
        })));

        const expData = ok<any[]>(expRes);
        if (expData?.length) setStoreExpenses(expData.map(r => ({ id: String(r.id), expenseName: r.expense_name, price: Number(r.price || 0), date: r.date })));

        const debtData = ok<any[]>(debtRes);
        if (debtData?.length) setDebts(debtData.map(r => ({
          id: String(r.id), date: r.date, name: r.name, direction: r.direction,
          amount: Number(r.amount || 0), amountPaid: Number(r.amount_paid || 0),
          remaining: Number(r.remaining || 0), isPaid: Boolean(r.is_paid), note: r.note || '',
        })));

        const repData = ok<any[]>(repRes);
        if (repData?.length) setReplacements(repData.map(r => ({
          id: String(r.id), date: r.date, type: r.type,
          returnedItem: r.returned_item || {}, newItem: r.new_item,
          buyBackPricePerGram: r.buy_back_price_per_gram,
          amountDifference: Number(r.amount_difference || 0),
          amountToPay: Number(r.amount_to_pay || 0),
          amountToRefund: Number(r.amount_to_refund || 0),
        })));

        const cliData = ok<any[]>(cliRes);
        if (cliData?.length) setClients(cliData.map(r => ({
          id: String(r.id), name: r.name, phone: r.phone || '', note: r.note || '',
          payments: r.payments || [], recuperations: r.recuperations || [],
        })));

        const cpData = ok<any[]>(cpRes);
        if (cpData?.length) setCassiePurchases(cpData.map(r => ({
          id: String(r.id), date: r.date, silverTypeId: r.silver_type_id,
          clientName: r.client_name || '', clientPhone: r.client_phone || '',
          weight: Number(r.weight || 0), totalPrice: Number(r.total_price || 0),
          isMelted: Boolean(r.is_melted),
        })));

        const meltData = ok<any[]>(meltRes);
        if (meltData?.length) setMeltings(meltData.map(r => ({
          id: String(r.id), date: r.date, purchaseIds: r.purchase_ids || [],
          loss: Number(r.loss || 0), totalPreWeight: Number(r.total_pre_weight || 0),
          postWeight: Number(r.post_weight || 0), totalPrice: Number(r.total_price || 0),
          pricePerGramAfter: Number(r.price_per_gram_after || 0),
          targetSilverTypeId: r.target_silver_type_id,
        })));

        const woData = ok<any[]>(woRes);
        if (woData?.length) setWebOffers(woData.map(r => ({
          id: String(r.id), name: r.name, image: r.image_url || r.image || null,
          silverTypeId: r.silver_type_id, calibre: r.calibre, form: r.form,
          pricingMode: r.pricing_mode, weight: r.weight, pricePerGram: r.price_per_gram,
          totalPrice: Number(r.total_price || 0), unitPrice: r.unit_price,
          showQuantity: Boolean(r.show_quantity), quantity: Number(r.quantity || 0),
          showWeight: Boolean(r.show_weight),
          isHidden: Boolean(r.is_hidden), createdAt: r.created_at,
        })));

        const wsoData = ok<any[]>(wsoRes);
        if (wsoData?.length) setWebSpecialOffers(wsoData.map(r => ({
          id: String(r.id), name: r.name, image: r.image_url || r.image || null,
          silverTypeId: r.silver_type_id, calibre: r.calibre, form: r.form,
          pricingMode: r.pricing_mode, weight: r.weight, pricePerGram: r.price_per_gram,
          unitPrice: r.unit_price, originalPrice: Number(r.original_price || 0),
          specialPrice: Number(r.special_price || 0),
          showQuantity: Boolean(r.show_quantity), quantity: Number(r.quantity || 0),
          showWeight: Boolean(r.show_weight),
          isHidden: Boolean(r.is_hidden), isActive: Boolean(r.is_active),
          startDate: r.start_date, startHour: r.start_hour,
          endDate: r.end_date, endHour: r.end_hour, createdAt: r.created_at,
        })));

        const wdcData = ok<any[]>(wdcRes);
        if (wdcData?.length) setWebDeliveryCompanies(wdcData.map(r => ({
          id: String(r.id), name: r.name, phone: r.phone || '',
          wilayas: r.wilayas || [],
        })));

        const wcData = ok<any>(wcRes);
        if (wcData) setWebContacts({
          phone: wcData.phone, facebook: wcData.facebook, instagram: wcData.instagram,
          whatsapp: wcData.whatsapp, tiktok: wcData.tiktok, snapchat: wcData.snapchat,
          telegram: wcData.telegram, email: wcData.email, address: wcData.address,
        });

        const worderData = ok<any[]>(worderRes);
        if (worderData?.length) setWebOrders(worderData.map(r => ({
          id: String(r.id), orderNumber: r.order_number, createdAt: r.created_at,
          status: r.status, clientFullName: r.client_full_name || '',
          clientPhone: r.client_phone || '', clientEmail: r.client_email,
          wilayaCode: Number(r.wilaya_code || 0), wilayaName: r.wilaya_name || '',
          commune: r.commune || '', address: r.address || '',
          deliveryCompanyId: r.delivery_company_id, deliveryType: r.delivery_type,
          deliveryPrice: Number(r.delivery_price || 0), items: r.items || [],
          subtotal: Number(r.subtotal || 0), total: Number(r.total || 0),
          isPersonalized: Boolean(r.is_personalized),
          personalizedDetails: r.personalized_details,
          finalizedAt: r.finalized_at, cancelledAt: r.cancelled_at,
          storageDeducted: Boolean(r.storage_deducted),
        })));

        const settData = ok<any>(settRes);
        if (settData) {
          setSettings(prev => ({
            ...prev,
            storeName: settData.store_name || prev.storeName,
            slogan: settData.slogan ?? prev.slogan,
            contact: settData.contact ?? prev.contact,
            phone: settData.phone ?? prev.phone,
            address: settData.address ?? prev.address,
            logo: settData.logo_url ?? prev.logo,
            ...(settData.web_content || {}),
          }));
          if (settData.shapes?.length) setShapes(settData.shapes);
          if (settData.calibres?.length) setCalibresList(settData.calibres);
          if (settData.metals?.length) setMetalsList(settData.metals);
          if (settData.minimal_weight != null) setMinimalWeightState(Number(settData.minimal_weight));
          if (settData.silver_price_per_gram != null) setSilverPricePerGramState(Number(settData.silver_price_per_gram));
        }
      } catch (err) {
        console.error('[AppContext load]', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ─── SETTINGS ROW BUILDER ────────────────────────────────────────────────
  const buildSettingsRow = (
    s: import('./types').StoreSettings,
    sh: string[],
    cal: string[],
    met: string[],
    mw: number,
    spg: number
  ) => {
    const webContent: Record<string, string | null> = {};
    WEB_KEYS.forEach(k => { webContent[k] = (s as any)[k] ?? null; });
    return {
      id: 'main',
      store_name: s.storeName, slogan: s.slogan,
      contact: s.contact, phone: s.phone, address: s.address,
      logo_url: s.logo, shapes: sh, calibres: cal, metals: met,
      minimal_weight: mw, silver_price_per_gram: spg,
      web_content: webContent,
    };
  };

  // ─── SILVER TYPES ────────────────────────────────────────────────────────
  const addSilverType = async (st: Omit<SilverType, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('silver_types').insert(stToRow({ ...st, id } as SilverType));
    if (error) { console.error('[addSilverType]', error.message); return; }
    setSilverTypes(prev => [...prev, { ...st, id } as SilverType]);
  };

  const updateSilverType = async (id: string, st: Partial<SilverType>) => {
    const existing = silverTypes.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...st };
    const { error } = await supabase.from('silver_types').update({
      name: merged.name, calibre: merged.calibre,
      initial_quantity: merged.initialQuantity, is_cassie: merged.isCassie,
      is_ala_piece: (merged as any).isAlaPiece || false, shapes: merged.shapes,
    }).eq('id', id);
    if (error) { console.error('[updateSilverType]', error.message); return; }
    setSilverTypes(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteSilverType = async (id: string) => {
    const { error } = await supabase.from('silver_types').delete().eq('id', id);
    if (error) { console.error('[deleteSilverType]', error.message); return; }
    setSilverTypes(prev => prev.filter(item => item.id !== id));
  };

  // ─── SUPPLIERS ───────────────────────────────────────────────────────────
  const addSupplier = async (s: Omit<Supplier, 'id'>) => {
    const id = Date.now().toString();
    const row = { id, name: s.name, phone: s.phone ?? '', address: s.address ?? '' };
    const { error } = await supabase.from('suppliers').insert(row);
    if (error) { console.error('[addSupplier]', error.message); return; }
    setSuppliers(prev => [...prev, row as Supplier]);
  };

  const updateSupplier = async (id: string, s: Partial<Supplier>) => {
    const existing = suppliers.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...s };
    const { error } = await supabase.from('suppliers').update({ name: merged.name, phone: merged.phone, address: merged.address }).eq('id', id);
    if (error) { console.error('[updateSupplier]', error.message); return; }
    setSuppliers(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteSupplier = async (id: string) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) { console.error('[deleteSupplier]', error.message); return; }
    setSuppliers(prev => prev.filter(item => item.id !== id));
  };

  // ─── PURCHASES ───────────────────────────────────────────────────────────
  const addPurchase = async (p: Omit<PurchaseInvoice, 'id'>) => {
    const id = Date.now().toString();
    const invoiceTotal = p.items.reduce((a, b) => a + (b.totalPrice || 0), 0);
    const paid = (p.amountPaid !== undefined && p.amountPaid !== null) ? p.amountPaid : (p.payment?.total || 0);
    const remaining = Math.max(0, invoiceTotal - paid);
    const isDebt = remaining > 0;

    const { error } = await supabase.from('purchase_invoices').insert({
      id, supplier_id: p.supplierId, date: p.date,
      items: p.items, payment: p.payment,
      amount_paid: paid, remaining, is_debt: isDebt,
    });
    if (error) { console.error('[addPurchase]', error.message); return; }

    // Compute inventory changes imperatively
    const next = silverTypes.map(st => ({
      ...st,
      initialQuantity: Number(st.initialQuantity) || 0,
      shapes: Object.fromEntries(Object.entries(st.shapes || {}).map(([k, v]) => [k, Number(v) || 0])) as any,
    }));

    p.items.forEach(item => {
      const idx = next.findIndex(st => st.id === item.silverTypeId);
      if (idx === -1) { console.warn('[addPurchase] silverTypeId not found:', item); return; }
      const st = next[idx];
      const w = Number((item as any).weight) || 0;
      if ((st as any).isAlaPiece && (item as any).shape) {
        const shapeKey = String((item as any).shape);
        const pieceQty = Number((item as any).quantity) || 0;
        const ns = { ...(st.shapes || {}) } as Record<string, number>;
        ns[shapeKey] = (Number(ns[shapeKey]) || 0) + pieceQty;
        next[idx] = { ...st, shapes: ns };
      } else if (st.isCassie) {
        next[idx] = { ...st, initialQuantity: Number(st.initialQuantity || 0) + w };
      } else if ((item as any).shape) {
        const shapeKey = String((item as any).shape);
        const ns = { ...st.shapes } as Record<string, number>;
        ns[shapeKey] = (Number(ns[shapeKey]) || 0) + w;
        next[idx] = { ...st, shapes: ns };
      } else {
        next[idx] = { ...st, initialQuantity: Number(st.initialQuantity || 0) + w };
      }
    });

    const cassieSilver = Number(p.payment?.cassieSilverGrams) || 0;
    const cassieGold = Number(p.payment?.cassieGoldGrams) || 0;
    if (cassieSilver > 0) {
      const silverTypeId = (p.payment as any)?.cassieSilverTypeId;
      for (let i = 0; i < next.length; i++) {
        const st = next[i];
        const matches = silverTypeId ? st.id === silverTypeId : (st.id === '3' || (st.isCassie && st.name.toLowerCase().includes('argent')));
        if (matches) { next[i] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - cassieSilver) }; break; }
      }
    }
    if (cassieGold > 0) {
      const goldTypeId = (p.payment as any)?.cassieGoldTypeId;
      for (let i = 0; i < next.length; i++) {
        const st = next[i];
        const matches = goldTypeId ? st.id === goldTypeId : (st.id === 'gold-cassie' || (st.isCassie && st.name.toLowerCase().includes('or')));
        if (matches) { next[i] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - cassieGold) }; break; }
      }
    }

    await upsertSilverTypes(next);
    setPurchases(prev => [...prev, { ...p, id, amountPaid: paid, remaining, isDebt }]);
    setSilverTypes(next);
  };

  const updatePurchase = async (id: string, p: Partial<PurchaseInvoice>) => {
    const existing = purchases.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...p };
    const { error } = await supabase.from('purchase_invoices').update({
      supplier_id: merged.supplierId, date: merged.date,
      items: merged.items, payment: merged.payment,
      amount_paid: merged.amountPaid, remaining: merged.remaining, is_debt: merged.isDebt,
    }).eq('id', id);
    if (error) { console.error('[updatePurchase]', error.message); return; }
    setPurchases(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deletePurchase = async (id: string) => {
    const { error } = await supabase.from('purchase_invoices').delete().eq('id', id);
    if (error) { console.error('[deletePurchase]', error.message); return; }
    setPurchases(prev => prev.filter(item => item.id !== id));
  };

  // ─── SALES ───────────────────────────────────────────────────────────────
  const addSale = async (s: Omit<SaleInvoice, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('sale_invoices').insert({
      id, date: s.date, worker_id: s.workerId,
      client_name: s.clientName, client_phone: s.clientPhone,
      items: s.items, is_debt: s.isDebt,
      total: s.total, amount_paid: s.amountPaid, remaining: s.remaining,
    });
    if (error) { console.error('[addSale]', error.message); return; }

    const next = silverTypes.map(st => ({
      ...st,
      shapes: Object.fromEntries(Object.entries(st.shapes || {}).map(([k, v]) => [k, Number(v) || 0])) as any,
    }));
    s.items.forEach(item => {
      const idx = next.findIndex(st => st.id === item.silverTypeId);
      if (idx === -1) { console.warn('[addSale] silverTypeId not found:', item); return; }
      const st = next[idx];
      const w = Number(item.weight) || 0;
      if ((st as any).isAlaPiece && item.shape) {
        const shapeKey = String(item.shape);
        const pieceQty = Number((item as any).quantity) || 0;
        const ns = { ...(st.shapes || {}) } as Record<string, number>;
        ns[shapeKey] = Math.max(0, (Number(ns[shapeKey]) || 0) - pieceQty);
        next[idx] = { ...st, shapes: ns };
      } else if (st.isCassie) {
        next[idx] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - w) };
      } else if (item.shape) {
        const shapeKey = String(item.shape);
        const ns = { ...st.shapes } as Record<string, number>;
        ns[shapeKey] = Math.max(0, (Number(ns[shapeKey]) || 0) - w);
        next[idx] = { ...st, shapes: ns };
      } else {
        next[idx] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - w) };
      }
    });

    await upsertSilverTypes(next);
    setSales(prev => [...prev, { ...s, id }]);
    setSilverTypes(next);
  };

  const updateSale = async (id: string, s: Partial<SaleInvoice>) => {
    const existing = sales.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...s };
    const { error } = await supabase.from('sale_invoices').update({
      date: merged.date, worker_id: merged.workerId,
      client_name: merged.clientName, client_phone: merged.clientPhone,
      items: merged.items, is_debt: merged.isDebt,
      total: merged.total, amount_paid: merged.amountPaid, remaining: merged.remaining,
    }).eq('id', id);
    if (error) { console.error('[updateSale]', error.message); return; }
    setSales(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteSale = async (id: string) => {
    const { error } = await supabase.from('sale_invoices').delete().eq('id', id);
    if (error) { console.error('[deleteSale]', error.message); return; }
    setSales(prev => prev.filter(item => item.id !== id));
  };

  // ─── WORKSHOPS ───────────────────────────────────────────────────────────
  const addWorkshop = async (w: Omit<Workshop, 'id'>) => {
    const id = Date.now().toString();
    const row = { id, name: w.name, phone: w.phone || '', address: w.address || '' };
    const { error } = await supabase.from('workshops').insert(row);
    if (error) { console.error('[addWorkshop]', error.message); return; }
    setWorkshops(prev => [...prev, row as Workshop]);
  };

  const updateWorkshop = async (id: string, w: Partial<Workshop>) => {
    const existing = workshops.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...w };
    const { error } = await supabase.from('workshops').update({ name: merged.name, phone: merged.phone, address: merged.address }).eq('id', id);
    if (error) { console.error('[updateWorkshop]', error.message); return; }
    setWorkshops(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteWorkshop = async (id: string) => {
    const { error } = await supabase.from('workshops').delete().eq('id', id);
    if (error) { console.error('[deleteWorkshop]', error.message); return; }
    setWorkshops(prev => prev.filter(item => item.id !== id));
  };

  // ─── COMMANDS ────────────────────────────────────────────────────────────
  const addCommand = async (c: Omit<Command, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('commands').insert({
      id, type: c.type, client_name: c.clientName, client_phone: c.clientPhone,
      metal: c.metal, initial_weight: c.initialWeight, workshop_id: c.workshopId,
      date: c.date, status: c.status, paid_amount: c.paidAmount,
      shape: c.shape, final_weight: c.finalWeight,
      workshop_price: c.workshopPrice, client_price: c.clientPrice, end_date: c.endDate,
    });
    if (error) { console.error('[addCommand]', error.message); return; }

    let next = silverTypes;
    if (c.type === 'industry' && c.metal === 'silver' && c.initialWeight > 0) {
      next = silverTypes.map(st => ({ ...st, initialQuantity: Number(st.initialQuantity) || 0 }));
      const argentIdx = next.findIndex(st => st.isCassie && st.name.toLowerCase().includes('argent'));
      if (argentIdx !== -1) {
        const after = Math.max(0, next[argentIdx].initialQuantity - c.initialWeight);
        next = next.map((st, i) => i === argentIdx ? { ...st, initialQuantity: after } : st);
      } else {
        const firstCassieIdx = next.findIndex(st => st.isCassie);
        if (firstCassieIdx !== -1) {
          const after = Math.max(0, next[firstCassieIdx].initialQuantity - c.initialWeight);
          next = next.map((st, i) => i === firstCassieIdx ? { ...st, initialQuantity: after } : st);
        }
      }
      await upsertSilverTypes(next);
      setSilverTypes(next);
    }

    setCommands(prev => [...prev, { ...c, id }]);
  };

  const updateCommand = async (id: string, c: Partial<Command>) => {
    const existing = commands.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...c };
    const { error } = await supabase.from('commands').update({
      type: merged.type, client_name: merged.clientName, client_phone: merged.clientPhone,
      metal: merged.metal, initial_weight: merged.initialWeight, workshop_id: merged.workshopId,
      date: merged.date, status: merged.status, paid_amount: merged.paidAmount,
      shape: merged.shape, final_weight: merged.finalWeight,
      workshop_price: merged.workshopPrice, client_price: merged.clientPrice, end_date: merged.endDate,
    }).eq('id', id);
    if (error) { console.error('[updateCommand]', error.message); return; }
    setCommands(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteCommand = async (id: string) => {
    const { error } = await supabase.from('commands').delete().eq('id', id);
    if (error) { console.error('[deleteCommand]', error.message); return; }
    setCommands(prev => prev.filter(item => item.id !== id));
  };

  // ─── WORKERS ─────────────────────────────────────────────────────────────
  const addWorker = async (w: Omit<Worker, 'id'>) => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('workers').insert({
      id, full_name: w.fullName, phone: w.phone || '', address: w.address || '',
      payment_type: w.paymentType, salary: w.salary,
      username: w.username, password: w.password, created_at: createdAt,
    });
    if (error) { console.error('[addWorker]', error.message); return; }
    setWorkers(prev => [...prev, { ...w, id, createdAt } as Worker]);
  };

  const updateWorker = async (id: string, w: Partial<Worker>) => {
    const existing = workers.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...w };
    const dbUpdate: Record<string, any> = {};
    if (w.fullName !== undefined) dbUpdate.full_name = w.fullName;
    if (w.phone !== undefined) dbUpdate.phone = w.phone;
    if (w.address !== undefined) dbUpdate.address = w.address;
    if (w.paymentType !== undefined) dbUpdate.payment_type = w.paymentType;
    if (w.salary !== undefined) dbUpdate.salary = w.salary;
    if (w.username !== undefined) dbUpdate.username = w.username;
    if (w.password !== undefined) dbUpdate.password = w.password;
    if (Object.keys(dbUpdate).length === 0) return;
    const { error } = await supabase.from('workers').update(dbUpdate).eq('id', id);
    if (error) { console.error('[updateWorker]', error.message); return; }
    setWorkers(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteWorker = async (id: string) => {
    const { error } = await supabase.from('workers').delete().eq('id', id);
    if (error) { console.error('[deleteWorker]', error.message); return; }
    setWorkers(prev => prev.filter(item => item.id !== id));
  };

  // ─── WORKER TRANSACTIONS ─────────────────────────────────────────────────
  const addAdvance = async (a: Omit<WorkerAdvance, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('worker_advances').insert({ id, worker_id: a.workerId, amount: a.amount, date: a.date });
    if (error) { console.error('[addAdvance]', error.message); return; }
    setWorkerAdvances(prev => [...prev, { ...a, id }]);
  };

  const addAbsence = async (a: Omit<WorkerAbsence, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('worker_absences').insert({ id, worker_id: a.workerId, deduction: a.deduction, date: a.date });
    if (error) { console.error('[addAbsence]', error.message); return; }
    setWorkerAbsences(prev => [...prev, { ...a, id }]);
  };

  const addWorkerPayment = async (p: Omit<WorkerPaymentRecord, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('worker_payment_records').insert({ id, worker_id: p.workerId, amount: p.amount, date: p.date });
    if (error) { console.error('[addWorkerPayment]', error.message); return; }
    setWorkerPayments(prev => [...prev, { ...p, id }]);
  };

  // ─── DELIVERIES ──────────────────────────────────────────────────────────
  const addDelivery = async (d: Omit<Delivery, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('deliveries').insert({
      id, full_name: d.fullName, phone: d.phone || '',
      created_date: d.createdDate, payment_history: d.paymentHistory || [],
    });
    if (error) { console.error('[addDelivery]', error.message); return; }
    setDeliveries(prev => [...prev, { ...d, id }]);
  };

  const updateDelivery = async (id: string, d: Partial<Delivery>) => {
    const existing = deliveries.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...d };
    const { error } = await supabase.from('deliveries').update({
      full_name: merged.fullName, phone: merged.phone,
      created_date: merged.createdDate, payment_history: merged.paymentHistory,
    }).eq('id', id);
    if (error) { console.error('[updateDelivery]', error.message); return; }
    setDeliveries(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteDelivery = async (id: string) => {
    const { error } = await supabase.from('deliveries').delete().eq('id', id);
    if (error) { console.error('[deleteDelivery]', error.message); return; }
    setDeliveries(prev => prev.filter(item => item.id !== id));
  };

  const addPaymentAction = async (deliveryId: string, p: Omit<PaymentAction, 'id'>) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;
    const newPayment = { ...p, id: Date.now().toString() };
    const newHistory = [...delivery.paymentHistory, newPayment];
    const { error } = await supabase.from('deliveries').update({ payment_history: newHistory }).eq('id', deliveryId);
    if (error) { console.error('[addPaymentAction]', error.message); return; }
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, paymentHistory: newHistory } : d));
  };

  const deletePaymentAction = async (deliveryId: string, paymentId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return;
    const newHistory = delivery.paymentHistory.filter(p => p.id !== paymentId);
    const { error } = await supabase.from('deliveries').update({ payment_history: newHistory }).eq('id', deliveryId);
    if (error) { console.error('[deletePaymentAction]', error.message); return; }
    setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, paymentHistory: newHistory } : d));
  };

  // ─── STORE EXPENSES ──────────────────────────────────────────────────────
  const addStoreExpense = async (e: Omit<StoreExpense, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('store_expenses').insert({ id, expense_name: e.expenseName, price: e.price, date: e.date });
    if (error) { console.error('[addStoreExpense]', error.message); return; }
    setStoreExpenses(prev => [...prev, { ...e, id }]);
  };

  const updateStoreExpense = async (id: string, e: Partial<StoreExpense>) => {
    const existing = storeExpenses.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...e };
    const { error } = await supabase.from('store_expenses').update({ expense_name: merged.expenseName, price: merged.price, date: merged.date }).eq('id', id);
    if (error) { console.error('[updateStoreExpense]', error.message); return; }
    setStoreExpenses(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteStoreExpense = async (id: string) => {
    const { error } = await supabase.from('store_expenses').delete().eq('id', id);
    if (error) { console.error('[deleteStoreExpense]', error.message); return; }
    setStoreExpenses(prev => prev.filter(item => item.id !== id));
  };

  // ─── CLIENTS ─────────────────────────────────────────────────────────────
  const addClient = async (c: Omit<import('./types').Client, 'id' | 'payments'>) => {
    const id = Date.now().toString();
    const newClient: import('./types').Client = { id, name: c.name, phone: c.phone || '', note: c.note || '', payments: [], recuperations: [] };
    const { error } = await supabase.from('clients').insert({ id, name: c.name, phone: c.phone || '', note: c.note || '', payments: [], recuperations: [] });
    if (error) { console.error('[addClient]', error.message); return; }
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = async (id: string, c: Partial<import('./types').Client>) => {
    const existing = clients.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...c };
    const { error } = await supabase.from('clients').update({ name: merged.name, phone: merged.phone, note: merged.note, payments: merged.payments, recuperations: merged.recuperations || [] }).eq('id', id);
    if (error) { console.error('[updateClient]', error.message); return; }
    setClients(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) { console.error('[deleteClient]', error.message); return; }
    setClients(prev => prev.filter(item => item.id !== id));
  };

  const addClientPayment = async (clientId: string, p: Omit<import('./types').ClientPayment, 'id'>) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const newPayments = [...client.payments, { ...p, id: Date.now().toString() }];
    const { error } = await supabase.from('clients').update({ payments: newPayments }).eq('id', clientId);
    if (error) { console.error('[addClientPayment]', error.message); return; }
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, payments: newPayments } : c));
  };

  const deleteClientPayment = async (clientId: string, paymentId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const newPayments = client.payments.filter(pm => pm.id !== paymentId);
    const { error } = await supabase.from('clients').update({ payments: newPayments }).eq('id', clientId);
    if (error) { console.error('[deleteClientPayment]', error.message); return; }
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, payments: newPayments } : c));
  };

  const addClientRecuperation = async (clientId: string, r: Omit<import('./types').ClientRecuperation, 'id'>) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const newRecs = [...(client.recuperations || []), { ...r, id: Date.now().toString() }];
    const { error } = await supabase.from('clients').update({ recuperations: newRecs }).eq('id', clientId);
    if (error) { console.error('[addClientRecuperation]', error.message); return; }
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, recuperations: newRecs } : c));
  };

  const deleteClientRecuperation = async (clientId: string, recuperationId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const newRecs = (client.recuperations || []).filter(r => r.id !== recuperationId);
    const { error } = await supabase.from('clients').update({ recuperations: newRecs }).eq('id', clientId);
    if (error) { console.error('[deleteClientRecuperation]', error.message); return; }
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, recuperations: newRecs } : c));
  };

  // ─── DEBTS ───────────────────────────────────────────────────────────────
  const addDebt = async (d: Omit<Debt, 'id' | 'date' | 'amountPaid' | 'remaining' | 'isPaid'>) => {
    const id = Date.now().toString();
    const amount = Number(d.amount) || 0;
    const amountPaid = Number((d as any).amountPaid) || 0;
    const remaining = Math.max(0, amount - amountPaid);
    const isPaid = remaining <= 0;
    const date = new Date().toISOString();
    const newDebt: Debt = { id, date, name: d.name, direction: d.direction, amount, amountPaid, remaining, isPaid, note: d.note };
    const { error } = await supabase.from('debts').insert({ id, date, name: d.name, direction: d.direction, amount, amount_paid: amountPaid, remaining, is_paid: isPaid, note: d.note });
    if (error) { console.error('[addDebt]', error.message); return; }
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = async (id: string, d: Partial<Debt>) => {
    const existing = debts.find(item => item.id === id);
    if (!existing) return;
    const amount = d.amount !== undefined ? Number(d.amount) : existing.amount;
    const amountPaid = d.amountPaid !== undefined ? Number(d.amountPaid) : (existing.amountPaid || 0);
    const remaining = Math.max(0, amount - amountPaid);
    const isPaid = remaining <= 0;
    const merged = { ...existing, ...d, amount, amountPaid, remaining, isPaid };
    const { error } = await supabase.from('debts').update({ date: merged.date, name: merged.name, direction: merged.direction, amount, amount_paid: amountPaid, remaining, is_paid: isPaid, note: merged.note }).eq('id', id);
    if (error) { console.error('[updateDebt]', error.message); return; }
    setDebts(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteDebt = async (id: string) => {
    const { error } = await supabase.from('debts').delete().eq('id', id);
    if (error) { console.error('[deleteDebt]', error.message); return; }
    setDebts(prev => prev.filter(item => item.id !== id));
  };

  const payDebt = async (id: string, amt: number) => {
    const pay = Number(amt) || 0;
    if (pay <= 0) return;
    const existing = debts.find(item => item.id === id);
    if (!existing) return;
    const afterPaid = (existing.amountPaid || 0) + pay;
    const remaining = Math.max(0, (existing.amount || 0) - afterPaid);
    const isPaid = remaining <= 0;
    const { error } = await supabase.from('debts').update({ amount_paid: afterPaid, remaining, is_paid: isPaid }).eq('id', id);
    if (error) { console.error('[payDebt]', error.message); return; }
    setDebts(prev => prev.map(item => item.id === id ? { ...item, amountPaid: afterPaid, remaining, isPaid } : item));
  };

  // ─── CASSIE PURCHASES ────────────────────────────────────────────────────
  const addCassiePurchase = async (cp: Omit<CassiePurchase, 'id' | 'date' | 'isMelted'>) => {
    const id = Date.now().toString();
    const date = new Date().toISOString();
    const { error } = await supabase.from('cassie_purchases').insert({
      id, date, silver_type_id: cp.silverTypeId,
      client_name: cp.clientName || '', client_phone: cp.clientPhone || '',
      weight: cp.weight, total_price: cp.totalPrice, is_melted: false,
    });
    if (error) { console.error('[addCassiePurchase]', error.message); return; }

    const next = silverTypes.map(st =>
      st.id === cp.silverTypeId && st.isCassie
        ? { ...st, initialQuantity: Number(st.initialQuantity || 0) + Number(cp.weight || 0) }
        : st
    );
    await upsertSilverTypes(next);
    setCassiePurchases(prev => [...prev, { id, date, ...cp, isMelted: false }]);
    setSilverTypes(next);
  };

  const updateCassiePurchase = async (id: string, cp: Partial<CassiePurchase>) => {
    const old = cassiePurchases.find(p => p.id === id);
    if (!old) return;
    const updated = { ...old, ...cp };
    const { error } = await supabase.from('cassie_purchases').update({
      silver_type_id: updated.silverTypeId, client_name: updated.clientName,
      client_phone: updated.clientPhone, weight: updated.weight, total_price: updated.totalPrice,
    }).eq('id', id);
    if (error) { console.error('[updateCassiePurchase]', error.message); return; }

    const oldWeight = Number(old.weight || 0);
    const newWeight = Number(updated.weight || 0);
    let next = silverTypes.map(st => ({ ...st }));
    if (cp.silverTypeId && cp.silverTypeId !== old.silverTypeId) {
      next = next.map(st => st.id === old.silverTypeId && st.isCassie
        ? { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - oldWeight) } : st);
      next = next.map(st => st.id === cp.silverTypeId && st.isCassie
        ? { ...st, initialQuantity: Number(st.initialQuantity || 0) + newWeight } : st);
    } else {
      const weightDiff = newWeight - oldWeight;
      if (weightDiff !== 0) {
        next = next.map(st => st.id === (cp.silverTypeId || old.silverTypeId) && st.isCassie
          ? { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) + weightDiff) } : st);
      }
    }
    await upsertSilverTypes(next);
    setCassiePurchases(prev => prev.map(p => p.id === id ? updated : p));
    setSilverTypes(next);
  };

  const deleteCassiePurchase = async (id: string) => {
    const purchase = cassiePurchases.find(p => p.id === id);
    if (!purchase) return;
    const { error } = await supabase.from('cassie_purchases').delete().eq('id', id);
    if (error) { console.error('[deleteCassiePurchase]', error.message); return; }
    const next = silverTypes.map(st =>
      st.id === purchase.silverTypeId && st.isCassie
        ? { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - Number(purchase.weight || 0)) }
        : st
    );
    await upsertSilverTypes(next);
    setCassiePurchases(prev => prev.filter(p => p.id !== id));
    setSilverTypes(next);
  };

  const meltCassiePurchases = async (purchaseIds: string[], postWeight: number, targetSilverTypeId: string) => {
    if (purchaseIds.length === 0) return;
    const purchases = cassiePurchases.filter(p => purchaseIds.includes(p.id));
    const totalPreWeight = purchases.reduce((s, p) => s + Number(p.weight || 0), 0);
    const totalPrice = purchases.reduce((s, p) => s + Number(p.totalPrice || 0), 0);
    const loss = totalPreWeight - Number(postWeight || 0);
    const pricePerGramAfter = Number(postWeight || 0) > 0 ? totalPrice / Number(postWeight || 0) : 0;
    const meltingId = Date.now().toString();
    const melting: MeltingRecord = { id: meltingId, date: new Date().toISOString(), purchaseIds, loss, totalPreWeight, postWeight: Number(postWeight), totalPrice, pricePerGramAfter, targetSilverTypeId };

    const { error } = await supabase.from('melting_records').insert({
      id: meltingId, date: melting.date, purchase_ids: purchaseIds,
      loss, total_pre_weight: totalPreWeight, post_weight: Number(postWeight),
      total_price: totalPrice, price_per_gram_after: pricePerGramAfter,
      target_silver_type_id: targetSilverTypeId,
    });
    if (error) { console.error('[meltCassiePurchases]', error.message); return; }

    for (const pid of purchaseIds) {
      await supabase.from('cassie_purchases').update({ is_melted: true }).eq('id', pid);
    }

    const next = silverTypes.map(st =>
      st.id === targetSilverTypeId && st.isCassie
        ? { ...st, initialQuantity: Number(st.initialQuantity || 0) + Number(postWeight || 0) }
        : st
    );
    await upsertSilverTypes(next);
    setMeltings(prev => [...prev, melting]);
    setCassiePurchases(prev => prev.map(p => purchaseIds.includes(p.id) ? { ...p, isMelted: true } : p));
    setSilverTypes(next);
  };

  const deleteMeltingRecord = async (id: string) => {
    const melting = meltings.find(m => m.id === id);
    if (!melting) return;
    const { error } = await supabase.from('melting_records').delete().eq('id', id);
    if (error) { console.error('[deleteMeltingRecord]', error.message); return; }
    for (const pid of melting.purchaseIds) {
      await supabase.from('cassie_purchases').update({ is_melted: false }).eq('id', pid);
    }
    const next = silverTypes.map(st =>
      st.id === melting.targetSilverTypeId && st.isCassie
        ? { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - Number(melting.postWeight || 0)) }
        : st
    );
    await upsertSilverTypes(next);
    setMeltings(prev => prev.filter(m => m.id !== id));
    setCassiePurchases(prev => prev.map(p => melting.purchaseIds.includes(p.id) ? { ...p, isMelted: false } : p));
    setSilverTypes(next);
  };

  const updateMeltingRecord = async (id: string, postWeight: number, targetSilverTypeId: string) => {
    const old = meltings.find(m => m.id === id);
    if (!old) return;
    const oldPostWeight = Number(old.postWeight || 0);
    const newPostWeight = Number(postWeight || 0);
    const weightDiff = newPostWeight - oldPostWeight;
    const newPricePerGramAfter = newPostWeight > 0 ? old.totalPrice / newPostWeight : 0;
    const newLoss = old.totalPreWeight - newPostWeight;
    const updated = { ...old, postWeight: newPostWeight, targetSilverTypeId, pricePerGramAfter: newPricePerGramAfter, loss: newLoss };

    const { error } = await supabase.from('melting_records').update({
      post_weight: newPostWeight, target_silver_type_id: targetSilverTypeId,
      price_per_gram_after: newPricePerGramAfter, loss: newLoss,
    }).eq('id', id);
    if (error) { console.error('[updateMeltingRecord]', error.message); return; }

    let next = silverTypes.map(st => ({ ...st }));
    if (targetSilverTypeId !== old.targetSilverTypeId) {
      next = next.map(st => st.id === old.targetSilverTypeId && st.isCassie
        ? { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - oldPostWeight) } : st);
      next = next.map(st => st.id === targetSilverTypeId && st.isCassie
        ? { ...st, initialQuantity: Number(st.initialQuantity || 0) + newPostWeight } : st);
    } else if (weightDiff !== 0) {
      next = next.map(st => st.id === targetSilverTypeId && st.isCassie
        ? { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) + weightDiff) } : st);
    }
    if (weightDiff !== 0 || targetSilverTypeId !== old.targetSilverTypeId) {
      await upsertSilverTypes(next);
      setSilverTypes(next);
    }
    setMeltings(prev => prev.map(m => m.id === id ? updated : m));
  };

  // ─── REPLACEMENTS ────────────────────────────────────────────────────────
  const applyReplacementToInventory = (
    base: SilverType[],
    type: string,
    returnedItem: any,
    newItem: any,
    sign: 1 | -1
  ): SilverType[] => {
    const next = base.map(st => ({ ...st, shapes: { ...st.shapes } }));
    const applyItem = (item: any, addWeight: boolean) => {
      if (!item) return;
      const idx = next.findIndex(st => st.id === item.silverTypeId);
      if (idx === -1) return;
      const st = next[idx];
      const w = Number(item.weight) || 0;
      const dir = addWeight ? 1 : -1;
      if (st.isCassie) {
        next[idx] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) + dir * w) };
      } else if (item.shape) {
        const sk = String(item.shape);
        const before = Number((st.shapes as any)[sk] || 0);
        const ns = { ...st.shapes } as Record<string, number>;
        ns[sk] = Math.max(0, before + dir * w);
        next[idx] = { ...st, shapes: ns };
      } else {
        next[idx] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) + dir * w) };
      }
    };
    applyItem(returnedItem, sign === 1);
    if (type === 'exchange') applyItem(newItem, sign === -1);
    return next;
  };

  const addReplacement = async (r: Omit<ReplacementInvoice, 'id' | 'date' | 'amountDifference' | 'amountToPay' | 'amountToRefund'>) => {
    const id = Date.now().toString();
    const date = new Date().toISOString();
    const returned = r.returnedItem;
    const returnedTotal = (Number(returned.weight) || 0) * (Number(returned.pricePerGram) || 0);
    let amountDifference = 0, amountToPay = 0, amountToRefund = 0;
    if (r.type === 'exchange' && r.newItem) {
      const nw = r.newItem;
      amountDifference = (Number(nw.weight) || 0) * (Number(nw.pricePerGram) || 0) - returnedTotal;
      if (amountDifference > 0) amountToPay = amountDifference;
      else amountToRefund = Math.abs(amountDifference);
    } else if (r.type === 'buyback') {
      amountToRefund = (Number(returned.weight) || 0) * (Number(r.buyBackPricePerGram) || 0);
    }
    const invoice: ReplacementInvoice = { id, date, ...r, amountDifference, amountToPay, amountToRefund } as ReplacementInvoice;

    const { error } = await supabase.from('replacements').insert({
      id, date, type: r.type, returned_item: r.returnedItem, new_item: r.newItem,
      buy_back_price_per_gram: r.buyBackPricePerGram,
      amount_difference: amountDifference, amount_to_pay: amountToPay, amount_to_refund: amountToRefund,
    });
    if (error) { console.error('[addReplacement]', error.message); return; }

    const next = applyReplacementToInventory(silverTypes, r.type, r.returnedItem, r.newItem, 1);
    await upsertSilverTypes(next);
    setReplacements(prev => [...prev, invoice]);
    setSilverTypes(next);
  };

  const updateReplacement = async (id: string, r: Partial<ReplacementInvoice>) => {
    const old = replacements.find(x => x.id === id);
    if (!old) return;
    const merged = { ...old, ...r } as ReplacementInvoice;

    const { error } = await supabase.from('replacements').update({
      type: merged.type, returned_item: merged.returnedItem, new_item: merged.newItem,
      buy_back_price_per_gram: merged.buyBackPricePerGram,
      amount_difference: merged.amountDifference, amount_to_pay: merged.amountToPay, amount_to_refund: merged.amountToRefund,
    }).eq('id', id);
    if (error) { console.error('[updateReplacement]', error.message); return; }

    // Reverse old, then apply new
    let next = applyReplacementToInventory(silverTypes, old.type, old.returnedItem, old.newItem, -1);
    next = applyReplacementToInventory(next, merged.type, merged.returnedItem, merged.newItem, 1);
    await upsertSilverTypes(next);
    setReplacements(prev => prev.map(item => item.id === id ? merged : item));
    setSilverTypes(next);
  };

  const deleteReplacement = async (id: string) => {
    const old = replacements.find(x => x.id === id);
    if (!old) return;
    const { error } = await supabase.from('replacements').delete().eq('id', id);
    if (error) { console.error('[deleteReplacement]', error.message); return; }
    const next = applyReplacementToInventory(silverTypes, old.type, old.returnedItem, old.newItem, -1);
    await upsertSilverTypes(next);
    setReplacements(prev => prev.filter(x => x.id !== id));
    setSilverTypes(next);
  };

  // ─── SETTINGS / SHAPES / CALIBRES / METALS ───────────────────────────────
  const updateSettings = async (s: Partial<import('./types').StoreSettings>) => {
    const merged = { ...settings, ...s };
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(merged, shapes, calibres, metals, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[updateSettings]', error.message); return; }
    setSettings(merged);
  };

  const addShape = async (name: string) => {
    const newShapes = [...shapes, name];
    const newSilverTypes = silverTypes.map(st => ({ ...st, shapes: { ...st.shapes, [name]: 0 } }));
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, newShapes, calibres, metals, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[addShape]', error.message); return; }
    await upsertSilverTypes(newSilverTypes);
    setShapes(newShapes);
    setSilverTypes(newSilverTypes);
  };

  const updateShape = async (oldName: string, newName: string) => {
    const newShapes = shapes.map(s => s === oldName ? newName : s);
    const newSilverTypes = silverTypes.map(st => {
      const ns: any = {};
      Object.keys(st.shapes).forEach(k => { ns[k === oldName ? newName : k] = (st.shapes as any)[k]; });
      return { ...st, shapes: ns };
    });
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, newShapes, calibres, metals, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[updateShape]', error.message); return; }
    await upsertSilverTypes(newSilverTypes);
    setShapes(newShapes);
    setSilverTypes(newSilverTypes);
  };

  const deleteShape = async (name: string) => {
    const newShapes = shapes.filter(s => s !== name);
    const newSilverTypes = silverTypes.map(st => {
      const ns: any = { ...st.shapes };
      delete ns[name];
      return { ...st, shapes: ns };
    });
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, newShapes, calibres, metals, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[deleteShape]', error.message); return; }
    await upsertSilverTypes(newSilverTypes);
    setShapes(newShapes);
    setSilverTypes(newSilverTypes);
  };

  const addCalibre = async (calibre: string) => {
    if (!calibre || calibres.includes(calibre)) return;
    const newCals = [...calibres, calibre];
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, shapes, newCals, metals, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[addCalibre]', error.message); return; }
    setCalibresList(newCals);
  };

  const deleteCalibre = async (calibre: string) => {
    const newCals = calibres.filter(c => c !== calibre);
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, shapes, newCals, metals, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[deleteCalibre]', error.message); return; }
    setCalibresList(newCals);
  };

  const addMetal = async (metal: string) => {
    if (!metal || metals.includes(metal)) return;
    const newMets = [...metals, metal];
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, shapes, calibres, newMets, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[addMetal]', error.message); return; }
    setMetalsList(newMets);
  };

  const deleteMetal = async (metal: string) => {
    const newMets = metals.filter(m => m !== metal);
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, shapes, calibres, newMets, minimalWeight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[deleteMetal]', error.message); return; }
    setMetalsList(newMets);
  };

  const setMinimalWeight = async (weight: number) => {
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, shapes, calibres, metals, weight, silverPricePerGram),
      { onConflict: 'id' }
    );
    if (error) { console.error('[setMinimalWeight]', error.message); return; }
    setMinimalWeightState(weight);
  };

  const setSilverPricePerGram = async (price: number) => {
    const { error } = await supabase.from('store_settings').upsert(
      buildSettingsRow(settings, shapes, calibres, metals, minimalWeight, price),
      { onConflict: 'id' }
    );
    if (error) { console.error('[setSilverPricePerGram]', error.message); return; }
    setSilverPricePerGramState(price);
  };

  // ─── WEB OFFERS ──────────────────────────────────────────────────────────
  const addWebOffer = async (o: Omit<WebOffer, 'id' | 'createdAt'>) => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('web_offers').insert({
      id, name: o.name, silver_type_id: o.silverTypeId, calibre: o.calibre, form: o.form,
      pricing_mode: o.pricingMode, weight: o.weight, price_per_gram: o.pricePerGram,
      total_price: o.totalPrice, unit_price: o.unitPrice,
      show_quantity: o.showQuantity, quantity: o.quantity,
      show_weight: o.showWeight ?? false,
      is_hidden: o.isHidden, created_at: createdAt,
    });
    if (error) { console.error('[addWebOffer]', error.message); return; }
    setWebOffers(prev => [...prev, { ...o, id, createdAt }]);
  };

  const updateWebOffer = async (id: string, o: Partial<WebOffer>) => {
    const existing = webOffers.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...o };
    const { error } = await supabase.from('web_offers').update({
      name: merged.name, silver_type_id: merged.silverTypeId, calibre: merged.calibre, form: merged.form,
      pricing_mode: merged.pricingMode, weight: merged.weight, price_per_gram: merged.pricePerGram,
      total_price: merged.totalPrice, unit_price: merged.unitPrice,
      show_quantity: merged.showQuantity, quantity: merged.quantity,
      show_weight: merged.showWeight ?? false,
      is_hidden: merged.isHidden,
    }).eq('id', id);
    if (error) { console.error('[updateWebOffer]', error.message); return; }
    setWebOffers(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteWebOffer = async (id: string) => {
    const { error } = await supabase.from('web_offers').delete().eq('id', id);
    if (error) { console.error('[deleteWebOffer]', error.message); return; }
    setWebOffers(prev => prev.filter(item => item.id !== id));
  };

  // ─── WEB SPECIAL OFFERS ──────────────────────────────────────────────────
  const addWebSpecialOffer = async (o: Omit<WebSpecialOffer, 'id' | 'createdAt'>) => {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('web_special_offers').insert({
      id, name: o.name, silver_type_id: o.silverTypeId, calibre: o.calibre, form: o.form,
      pricing_mode: o.pricingMode, weight: o.weight, price_per_gram: o.pricePerGram,
      unit_price: o.unitPrice, original_price: o.originalPrice, special_price: o.specialPrice,
      show_quantity: o.showQuantity, quantity: o.quantity,
      show_weight: o.showWeight ?? false,
      is_hidden: o.isHidden, is_active: o.isActive,
      start_date: o.startDate, start_hour: o.startHour, end_date: o.endDate, end_hour: o.endHour,
      created_at: createdAt,
    });
    if (error) { console.error('[addWebSpecialOffer]', error.message); return; }
    setWebSpecialOffers(prev => [...prev, { ...o, id, createdAt }]);
  };

  const updateWebSpecialOffer = async (id: string, o: Partial<WebSpecialOffer>) => {
    const existing = webSpecialOffers.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...o };
    const { error } = await supabase.from('web_special_offers').update({
      name: merged.name, silver_type_id: merged.silverTypeId, calibre: merged.calibre, form: merged.form,
      pricing_mode: merged.pricingMode, weight: merged.weight, price_per_gram: merged.pricePerGram,
      unit_price: merged.unitPrice, original_price: merged.originalPrice, special_price: merged.specialPrice,
      show_quantity: merged.showQuantity, quantity: merged.quantity,
      show_weight: merged.showWeight ?? false,
      is_hidden: merged.isHidden, is_active: merged.isActive,
      start_date: merged.startDate, start_hour: merged.startHour, end_date: merged.endDate, end_hour: merged.endHour,
    }).eq('id', id);
    if (error) { console.error('[updateWebSpecialOffer]', error.message); return; }
    setWebSpecialOffers(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteWebSpecialOffer = async (id: string) => {
    const { error } = await supabase.from('web_special_offers').delete().eq('id', id);
    if (error) { console.error('[deleteWebSpecialOffer]', error.message); return; }
    setWebSpecialOffers(prev => prev.filter(item => item.id !== id));
  };

  // ─── WEB DELIVERY COMPANIES ──────────────────────────────────────────────
  const addWebDeliveryCompany = async (c: Omit<WebDeliveryCompany, 'id'>) => {
    const id = Date.now().toString();
    const { error } = await supabase.from('web_delivery_companies').insert({ id, name: c.name, phone: c.phone || '', wilayas: c.wilayas });
    if (error) { console.error('[addWebDeliveryCompany]', error.message); return; }
    setWebDeliveryCompanies(prev => [...prev, { ...c, id }]);
  };

  const updateWebDeliveryCompany = async (id: string, c: Partial<WebDeliveryCompany>) => {
    const existing = webDeliveryCompanies.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...c };
    const { error } = await supabase.from('web_delivery_companies').update({ name: merged.name, phone: merged.phone, wilayas: merged.wilayas }).eq('id', id);
    if (error) { console.error('[updateWebDeliveryCompany]', error.message); return; }
    setWebDeliveryCompanies(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteWebDeliveryCompany = async (id: string) => {
    const { error } = await supabase.from('web_delivery_companies').delete().eq('id', id);
    if (error) { console.error('[deleteWebDeliveryCompany]', error.message); return; }
    setWebDeliveryCompanies(prev => prev.filter(item => item.id !== id));
  };

  // ─── WEB CONTACTS ────────────────────────────────────────────────────────
  const updateWebContacts = async (c: Partial<WebContacts>) => {
    const merged = { ...webContacts, ...c };
    const { error } = await supabase.from('web_contacts').upsert({
      id: 'main', phone: merged.phone, facebook: merged.facebook,
      instagram: merged.instagram, whatsapp: merged.whatsapp,
      tiktok: merged.tiktok, snapchat: merged.snapchat,
      telegram: merged.telegram, email: merged.email, address: merged.address,
    }, { onConflict: 'id' });
    if (error) { console.error('[updateWebContacts]', error.message); return; }
    setWebContacts(merged);
  };

  // ─── WEB ORDERS ──────────────────────────────────────────────────────────
  const addWebOrder = async (o: Omit<WebOrder, 'id' | 'createdAt' | 'orderNumber' | 'status'>): Promise<string> => {
    const id = Date.now().toString();
    const orderNumber = 'CMD-WEB-' + id;
    const createdAt = new Date().toISOString();
    const { error } = await supabase.from('web_orders').insert({
      id, order_number: orderNumber, created_at: createdAt, status: 'pending',
      client_full_name: o.clientFullName, client_phone: o.clientPhone, client_email: o.clientEmail,
      wilaya_code: o.wilayaCode, wilaya_name: o.wilayaName,
      commune: o.commune, address: o.address,
      delivery_company_id: o.deliveryCompanyId, delivery_type: o.deliveryType,
      delivery_price: o.deliveryPrice, items: o.items,
      subtotal: o.subtotal, total: o.total,
      is_personalized: o.isPersonalized, personalized_details: o.personalizedDetails,
      finalized_at: null, cancelled_at: null, storage_deducted: false,
    });
    if (error) { console.error('[addWebOrder]', error.message); return ''; }
    setWebOrders(prev => [...prev, { ...o, id, orderNumber, createdAt, status: 'pending', storageDeducted: false } as WebOrder]);
    return id;
  };

  const updateWebOrder = async (id: string, o: Partial<WebOrder>) => {
    const existing = webOrders.find(item => item.id === id);
    if (!existing) return;
    const merged = { ...existing, ...o };
    const { error } = await supabase.from('web_orders').update({
      status: merged.status, client_full_name: merged.clientFullName, client_phone: merged.clientPhone,
      client_email: merged.clientEmail, wilaya_code: merged.wilayaCode, wilaya_name: merged.wilayaName,
      commune: merged.commune, address: merged.address,
      delivery_company_id: merged.deliveryCompanyId, delivery_type: merged.deliveryType,
      delivery_price: merged.deliveryPrice, items: merged.items,
      subtotal: merged.subtotal, total: merged.total,
      is_personalized: merged.isPersonalized, personalized_details: merged.personalizedDetails,
      finalized_at: merged.finalizedAt, cancelled_at: merged.cancelledAt,
      storage_deducted: merged.storageDeducted,
    }).eq('id', id);
    if (error) { console.error('[updateWebOrder]', error.message); return; }
    setWebOrders(prev => prev.map(item => item.id === id ? merged : item));
  };

  const deleteWebOrder = async (id: string) => {
    const { error } = await supabase.from('web_orders').delete().eq('id', id);
    if (error) { console.error('[deleteWebOrder]', error.message); return; }
    setWebOrders(prev => prev.filter(item => item.id !== id));
  };

  const finalizeWebOrder = async (id: string) => {
    const order = webOrders.find(o => o.id === id);
    if (!order) return;
    const finalizedAt = new Date().toISOString();
    const { error } = await supabase.from('web_orders').update({ status: 'finalized', finalized_at: finalizedAt, storage_deducted: true }).eq('id', id);
    if (error) { console.error('[finalizeWebOrder]', error.message); return; }

    const next = silverTypes.map(st => ({ ...st, shapes: { ...st.shapes } }));
    order.items.forEach(item => {
      if (!item.silverTypeId || !item.weight) return;
      const idx = next.findIndex(st => st.id === item.silverTypeId);
      if (idx === -1) return;
      const st = next[idx];
      const w = Number(item.weight) || 0;
      if (item.form) {
        const ns = { ...st.shapes } as Record<string, number>;
        ns[item.form] = Math.max(0, (Number(ns[item.form]) || 0) - w);
        next[idx] = { ...st, shapes: ns };
      } else {
        next[idx] = { ...st, initialQuantity: Math.max(0, Number(st.initialQuantity || 0) - w) };
      }
    });
    await upsertSilverTypes(next);
    setWebOrders(prev => prev.map(item => item.id === id ? { ...item, status: 'finalized' as const, finalizedAt, storageDeducted: true } : item));
    setSilverTypes(next);
  };

  const cancelWebOrder = async (id: string, recoverStock?: boolean) => {
    const order = webOrders.find(o => o.id === id);
    const cancelledAt = new Date().toISOString();
    const { error } = await supabase.from('web_orders').update({ status: 'cancelled', cancelled_at: cancelledAt }).eq('id', id);
    if (error) { console.error('[cancelWebOrder]', error.message); return; }
    setWebOrders(prev => prev.map(item => item.id === id ? { ...item, status: 'cancelled' as const, cancelledAt } : item));

    if (recoverStock && order?.storageDeducted) {
      const next = silverTypes.map(st => ({ ...st, shapes: { ...st.shapes } }));
      (order.items || []).forEach(item => {
        if (!item.silverTypeId || !item.weight) return;
        const idx = next.findIndex(st => st.id === item.silverTypeId);
        if (idx === -1) return;
        const st = next[idx];
        const w = Number(item.weight) || 0;
        if (item.form) {
          const ns = { ...st.shapes } as Record<string, number>;
          ns[item.form] = (Number(ns[item.form]) || 0) + w;
          next[idx] = { ...st, shapes: ns };
        } else {
          next[idx] = { ...st, initialQuantity: Number(st.initialQuantity || 0) + w };
        }
      });
      await upsertSilverTypes(next);
      setSilverTypes(next);
    }
  };

  return (
    <AppContext.Provider value={{
      user, language, silverTypes, suppliers, purchases, sales, workshops, commands, workers,
      workerAdvances, workerAbsences, workerPayments, deliveries, storeExpenses, debts,
      replacements, shapes, settings, clients, calibres, metals, minimalWeight,
      cassiePurchases, meltings,
      setUser, setLanguage,
      addSilverType, updateSilverType, deleteSilverType,
      addSupplier, updateSupplier, deleteSupplier,
      addPurchase, updatePurchase, deletePurchase,
      addSale, updateSale, deleteSale,
      addWorkshop, updateWorkshop, deleteWorkshop,
      addCommand, updateCommand, deleteCommand,
      addWorker, updateWorker, deleteWorker,
      addAdvance, addAbsence, addWorkerPayment,
      addDelivery, updateDelivery, deleteDelivery, addPaymentAction, deletePaymentAction,
      addStoreExpense, updateStoreExpense, deleteStoreExpense,
      addDebt, updateDebt, deleteDebt, payDebt,
      addCassiePurchase, updateCassiePurchase, deleteCassiePurchase,
      meltCassiePurchases, deleteMeltingRecord, updateMeltingRecord,
      addReplacement, updateReplacement, deleteReplacement,
      addShape, updateShape, deleteShape, updateSettings,
      addCalibre, deleteCalibre, addMetal, deleteMetal, setMinimalWeight,
      addClient, updateClient, deleteClient,
      addClientPayment, deleteClientPayment, addClientRecuperation, deleteClientRecuperation,
      silverPricePerGram, setSilverPricePerGram,
      webOffers, addWebOffer, updateWebOffer, deleteWebOffer,
      webSpecialOffers, addWebSpecialOffer, updateWebSpecialOffer, deleteWebSpecialOffer,
      webDeliveryCompanies, addWebDeliveryCompany, updateWebDeliveryCompany, deleteWebDeliveryCompany,
      webContacts, updateWebContacts,
      webOrders, addWebOrder, updateWebOrder, deleteWebOrder, finalizeWebOrder, cancelWebOrder,
      theme, setTheme,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
