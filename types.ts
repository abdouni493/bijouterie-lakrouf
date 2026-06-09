
export type Role = 'admin' | 'worker';
export type Language = 'fr' | 'ar';
export type SilverShape = string;
export type PaymentMethod = 'cash' | 'cassie_silver' | 'cassie_gold' | 'mixed';
export type WorkerPaymentType = 'monthly' | 'daily';
export type CommandStatus = 'pending' | 'finalized' | 'paid';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  password?: string;
  language: Language;
}

export interface SilverType {
  id: string;
  name: string;
  calibre: string;
  initialQuantity: number; // in grams (or total pieces if isAlaPiece)
  isCassie: boolean;
  isAlaPiece?: boolean; // À la Pièce type — shapes store piece quantities, not weights
  shapes: Record<SilverShape, number>; // weight in grams (or piece count if isAlaPiece)
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface PurchaseInvoice {
  id: string;
  supplierId: string;
  date: string;
  items: {
    silverTypeId: string;
    shape?: SilverShape;
    weight: number;
    pricePerGram: number;
    laborCostPerGram?: number;
    totalPrice: number;
    pricingMode?: 'weight' | 'piece';
    quantity?: number;
    pricePerPiece?: number;
  }[];
  payment: {
    cash: number;
    cassieSilverGrams: number;
    cassieSilverPricePerGram: number;
    cassieGoldGrams: number;
    cassieGoldPricePerGram: number;
    total: number;
  };
  // Optional debt tracking
  isDebt?: boolean;
  amountPaid?: number;
  remaining?: number;
}

export interface SaleInvoice {
  id: string;
  date: string;
  workerId: string;
  clientName?: string;
  clientPhone?: string;
  items: {
    silverTypeId: string;
    shape: SilverShape;
    weight: number;
    pricePerGram: number;
    totalPrice: number;
    // À la Pièce fields
    isAlaPiece?: boolean;
    quantity?: number;
    pricePerPiece?: number;
  }[];
  isDebt: boolean;
  amountPaid?: number;
  remaining?: number;
  total: number;
}

export interface Workshop {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Command {
  id: string;
  type: 'reparation' | 'industry';
  clientName: string;
  clientPhone: string;
  metal: string;
  calibre?: string;
  initialWeight: number;
  workshopId: string;
  date: string;
  status: CommandStatus;
  shape?: SilverShape; // for industry
  paidAmount: number;
  note?: string; // optional note
  // Industry payment method
  paymentMethod?: 'money' | 'cassie'; // for industry commands
  cassieTypeId?: string; // if paying workshop with cassie
  workshopCassieAmount?: number; // amount of cassie given to workshop
  // Finalization fields
  finalWeight?: number;
  workshopPrice?: number;
  clientPrice?: number;
  pricePerGram?: number; // for flexible pricing calculation
  endDate?: string;
  // Delivery association
  deliveryId?: string;
  deliveryPrice?: number;
}

export interface Worker {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  paymentType: WorkerPaymentType;
  salary: number;
  username: string;
  password?: string;
  createdAt?: string;
}

export interface WorkerAdvance {
  id: string;
  workerId: string;
  amount: number;
  date: string;
}

export interface WorkerAbsence {
  id: string;
  workerId: string;
  deduction: number;
  date: string;
}

export interface WorkerPaymentRecord {
  id: string;
  workerId: string;
  amount: number;
  date: string;
}

export interface Delivery {
  id: string;
  fullName: string;
  phone: string;
  createdDate: string;
  paymentHistory: PaymentAction[];
}

export interface PaymentAction {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}

export interface StoreExpense {
  id: string;
  expenseName: string;
  price: number;
  date: string;
  note?: string;
}

export interface Debt {
  id: string;
  name: string; // person or entity
  direction: 'given' | 'taken'; // 'given' = we gave money (we are creditor), 'taken' = we took (we owe)
  amount: number;
  amountPaid?: number;
  remaining?: number;
  note?: string;
  isPaid?: boolean;
  date: string;
}

export interface StoreSettings {
  logo?: string | null; // base64 image
  storeName: string;
  slogan?: string;
  contact?: string;
  phone?: string;
  address?: string;
  // Website landing page content (all optional — hardcoded defaults used when absent)
  webBadgeFr?: string; webBadgeAr?: string;
  webHeroLine1Fr?: string; webHeroLine1Ar?: string;
  webHeroLine2Fr?: string; webHeroLine2Ar?: string;
  webHeroDescFr?: string; webHeroDescAr?: string;
  webCta1Fr?: string; webCta1Ar?: string;
  webCta2Fr?: string; webCta2Ar?: string;
  webFeaturedTitleFr?: string; webFeaturedTitleAr?: string;
  webViewAllCtaFr?: string; webViewAllCtaAr?: string;
  webStoryTagFr?: string; webStoryTagAr?: string;
  webStoryTitleFr?: string; webStoryTitleAr?: string;
  webStoryDescFr?: string; webStoryDescAr?: string;
  webStat1Val?: string; webStat2Val?: string; webStat3Val?: string; webStat4Val?: string;
  webStat1LabelFr?: string; webStat1LabelAr?: string;
  webStat2LabelFr?: string; webStat2LabelAr?: string;
  webStat3LabelFr?: string; webStat3LabelAr?: string;
  webStat4LabelFr?: string; webStat4LabelAr?: string;
  webBenefit1TitleFr?: string; webBenefit1DescFr?: string;
  webBenefit1TitleAr?: string; webBenefit1DescAr?: string;
  webBenefit2TitleFr?: string; webBenefit2DescFr?: string;
  webBenefit2TitleAr?: string; webBenefit2DescAr?: string;
  webBenefit3TitleFr?: string; webBenefit3DescFr?: string;
  webBenefit3TitleAr?: string; webBenefit3DescAr?: string;
  webBenefit4TitleFr?: string; webBenefit4DescFr?: string;
  webBenefit4TitleAr?: string; webBenefit4DescAr?: string;
  webPersonalizedTitleFr?: string; webPersonalizedTitleAr?: string;
  webPersonalizedDescFr?: string; webPersonalizedDescAr?: string;
  webPersonalizedCtaFr?: string; webPersonalizedCtaAr?: string;
  webMarqueeItems?: string; // JSON array of strings
}

export interface ClientPayment {
  id: string;
  amount: number;
  date: string;
}

export interface ClientRecuperation {
  id: string;
  amount: number;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  note?: string;
  payments: ClientPayment[];
  recuperations?: ClientRecuperation[];
}

export interface ReplacementInvoiceItem {
  silverTypeId: string;
  shape?: SilverShape;
  weight: number;
  pricePerGram: number;
  totalPrice?: number;
}

export interface ReplacementInvoice {
  id: string;
  date: string;
  type: 'exchange' | 'buyback';
  workerId?: string;
  clientName?: string;
  clientPhone?: string;
  returnedItem: ReplacementInvoiceItem;
  newItem?: ReplacementInvoiceItem; // present for exchange
  buyBackPricePerGram?: number; // present for buyback
  amountDifference?: number; // newTotal - returnedTotal
  amountToPay?: number; // positive => client pays
  amountToRefund?: number; // positive => store refunds
  note?: string;
  // Delivery association
  deliveryId?: string;
  deliveryPrice?: number;
}

export interface CassiePurchase {
  id: string;
  clientName: string;
  clientPhone?: string;
  silverTypeId: string;
  weight: number;
  totalPrice: number;
  date: string;
  isMelted?: boolean;
}

export interface MeltingRecord {
  id: string;
  date: string;
  purchaseIds: string[];
  loss: number;
  totalPreWeight: number;
  postWeight: number;
  totalPrice: number;
  pricePerGramAfter: number;
  targetSilverTypeId: string;
}

// Website Offer
export interface WebOffer {
  id: string;
  name: string;
  image: string | null;
  silverTypeId: string;
  calibre: string;
  form: string;
  pricingMode: 'perGram' | 'alaPiece';
  weight?: number;
  pricePerGram?: number;
  totalPrice: number;
  unitPrice?: number;
  showQuantity: boolean;
  quantity?: number;
  isHidden: boolean;
  createdAt: string;
}

// Website Special Offer
export interface WebSpecialOffer {
  id: string;
  name: string;
  image: string | null;
  silverTypeId: string;
  calibre: string;
  form: string;
  pricingMode: 'perGram' | 'alaPiece';
  weight?: number;
  pricePerGram?: number;
  originalPrice: number;
  specialPrice: number;
  unitPrice?: number;
  showQuantity: boolean;
  quantity?: number;
  isHidden: boolean;
  isActive: boolean;
  startDate: string;
  startHour: string;
  endDate: string;
  endHour: string;
  createdAt: string;
}

// Algeria Delivery Company with Wilaya pricing
export interface WebDeliveryCompany {
  id: string;
  name: string;
  phone: string;
  wilayas: WebWilayaPrice[];
}

export interface WebWilayaPrice {
  wilayaCode: number;
  wilayaName: string;
  communes: string[];
  toBureau: number;
  toHome: number;
}

// Website Contacts / Social Links
export interface WebContacts {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  whatsapp?: string;
  telegram?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Website Order
export type WebOrderStatus = 'pending' | 'accepted' | 'in_delivery' | 'delivered' | 'finalized' | 'cancelled';

export interface WebOrderItem {
  offerId?: string;
  specialOfferId?: string;
  name: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  silverTypeId?: string;
  calibre?: string;
  form?: string;
  weight?: number;
}

export interface WebOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: WebOrderStatus;
  clientFullName: string;
  clientPhone: string;
  clientEmail?: string;
  wilayaCode: number;
  wilayaName: string;
  commune: string;
  address: string;
  deliveryCompanyId: string;
  deliveryType: 'bureau' | 'home';
  deliveryPrice: number;
  items: WebOrderItem[];
  subtotal: number;
  total: number;
  isPersonalized: boolean;
  personalizedDetails?: {
    silverType: string;
    calibre: string;
    form: string;
    maxGrams: number;
    notes?: string;
  };
  finalizedAt?: string;
  storageDeducted?: boolean;
  cancelledAt?: string;
}
