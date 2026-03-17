import { InvoiceItem, Installment } from './types';

export const calculateItemAmount = (quantity: number, unitPrice: number): number => {
  return Math.round(quantity * unitPrice * 100) / 100;
};

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateVat = (subtotal: number, rate: number = 7): number => {
  return Math.round(subtotal * (rate / 100) * 100) / 100;
};

export const calculateTotal = (subtotal: number, vatAmount: number): number => {
  return subtotal + vatAmount;
};

export const calculateDeposit = (total: number, percent: number): number => {
  return Math.round(total * (percent / 100) * 100) / 100;
};

export const calculateAmountDue = (total: number, depositAmount: number): number => {
  return total - depositAmount;
};

export const calculateInstallments = (
  amountDue: number,
  count: number,
  startDate: string
): Installment[] => {
  const perInstallment = Math.floor(amountDue / count * 100) / 100;
  const remainder = Math.round((amountDue - perInstallment * count) * 100) / 100;

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    return {
      number: i + 1,
      amount: i === count - 1 ? perInstallment + remainder : perInstallment,
      dueDate: date.toISOString().split('T')[0],
      status: 'pending' as const,
    };
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount);
};
