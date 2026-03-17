export interface Client {
  id: string;
  name: string;
  company?: string | null;
  taxId?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  createdAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export interface Installment {
  number: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  items: InvoiceItem[];
  subtotal: number | string;
  vatEnabled: boolean;
  vatRate: number;
  vatAmount: number | string;
  depositEnabled: boolean;
  depositPercent: number | string;
  depositAmount: number | string;
  total: number | string;
  amountDue: number | string;
  status: InvoiceStatus;
  notes?: string | null;
  createdAt: string;
  dueDate: string;
  installmentsEnabled?: boolean;
  installmentCount?: number;
  installments?: Installment[];
  promptPayId?: string | null;
  receiptId?: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber?: string;
  clientId?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  vatEnabled?: boolean;
  vatRate?: number;
  vatAmount?: number;
  total: number | string;
  paidAt: string;
  createdAt?: string;
  notes?: string;
}

export interface AppSettings {
  id?: string;
  promptPayId?: string | null;
  companyName?: string | null;
  companyAddress?: string | null;
  companyTaxId?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
}
