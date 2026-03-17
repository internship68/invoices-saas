import { Client, Invoice, Receipt, AppSettings } from './types';

const CLIENTS_KEY = 'billflow_clients';
const INVOICES_KEY = 'billflow_invoices';
const RECEIPTS_KEY = 'billflow_receipts';
const SETTINGS_KEY = 'billflow_settings';

// Clients
export const getClients = (): Client[] => {
  const data = localStorage.getItem(CLIENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: Client[]) => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const addClient = (client: Client) => {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
};

export const updateClient = (updated: Client) => {
  const clients = getClients().map(c => c.id === updated.id ? updated : c);
  saveClients(clients);
};

export const deleteClient = (id: string) => {
  saveClients(getClients().filter(c => c.id !== id));
};

// Invoices
export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(INVOICES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
};

export const addInvoice = (invoice: Invoice) => {
  const invoices = getInvoices();
  invoices.push(invoice);
  saveInvoices(invoices);
};

export const updateInvoice = (updated: Invoice) => {
  const invoices = getInvoices().map(i => i.id === updated.id ? updated : i);
  saveInvoices(invoices);
};

export const deleteInvoice = (id: string) => {
  saveInvoices(getInvoices().filter(i => i.id !== id));
};

export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const invoices = getInvoices();
  const thisYear = invoices.filter(i => i.invoiceNumber.includes(`INV-${year}`));
  const num = thisYear.length + 1;
  return `INV-${year}-${String(num).padStart(3, '0')}`;
};

// Receipts
export const getReceipts = (): Receipt[] => {
  const data = localStorage.getItem(RECEIPTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReceipts = (receipts: Receipt[]) => {
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
};

export const addReceipt = (receipt: Receipt) => {
  const receipts = getReceipts();
  receipts.push(receipt);
  saveReceipts(receipts);
};

export const generateReceiptNumber = (): string => {
  const year = new Date().getFullYear();
  const receipts = getReceipts();
  const thisYear = receipts.filter(r => r.receiptNumber.includes(`RCP-${year}`));
  const num = thisYear.length + 1;
  return `RCP-${year}-${String(num).padStart(3, '0')}`;
};

// Settings
const defaultSettings: AppSettings = {
  promptPayId: '',
  companyName: '',
  companyAddress: '',
  companyTaxId: '',
  companyPhone: '',
  companyEmail: '',
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
