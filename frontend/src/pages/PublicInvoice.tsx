import { useParams } from "react-router-dom";
import { usePublicInvoice } from "@/lib/useInvoices";
import { useSettings } from "@/lib/useSettings";
import { formatCurrency } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import generatePayload from "promptpay-qr";
import type { AppSettings, Client, Invoice } from "@/lib/types";

const statusConfig = {
  draft: { label: "แบบร่าง", className: "bg-muted text-muted-foreground" },
  sent: { label: "รอชำระเงิน", className: "bg-warning/10 text-warning" },
  paid: { label: "ชำระแล้ว ✓", className: "bg-success/10 text-success" },
};

export default function PublicInvoice() {
  const { id } = useParams();
  const { data, isLoading } = usePublicInvoice(id || "");
  // ถ้าผู้ใช้ล็อกอินอยู่ ก็จะได้ settings จาก API ปกติด้วย (optional)
  const { data: authedSettings } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">กำลังโหลด...</p>
      </div>
    );
  }

  if (!data?.invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">ไม่พบใบแจ้งหนี้นี้</p>
      </div>
    );
  }

  const invoice = data.invoice as Invoice;
  const settings = (data.settings ?? authedSettings ?? null) as AppSettings | null;
  const client = (invoice.client ?? null) as Client | null;
  const cfg = statusConfig[invoice.status];

  let promptPayQr: string | null = null;
  if (invoice.promptPayId && invoice.status !== "paid") {
    try {
      promptPayQr = generatePayload(invoice.promptPayId, { amount: Number(invoice.amountDue) });
    } catch {
      promptPayQr = null;
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Status Banner */}
        <div className="mb-6 flex justify-center">
          <Badge variant="secondary" className={`${cfg.className} text-base px-4 py-2`}>
            {cfg.label}
          </Badge>
        </div>

        <div
          className="bg-card rounded-xl border p-8"
          style={{ fontFamily: "'IBM Plex Sans Thai', 'Inter', sans-serif" }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {settings?.companyName && (
                <p className="text-sm font-semibold text-foreground">{settings.companyName}</p>
              )}
              {settings?.companyAddress && (
                <p className="text-xs text-muted-foreground mt-1">{settings.companyAddress}</p>
              )}
              {(settings?.companyPhone || settings?.companyEmail) && (
                <p className="text-xs text-muted-foreground">
                  {settings?.companyPhone ? settings.companyPhone : ""}
                  {settings?.companyPhone && settings?.companyEmail ? " • " : ""}
                  {settings?.companyEmail ? settings.companyEmail : ""}
                </p>
              )}
              {settings?.companyTaxId && (
                <p className="text-xs text-muted-foreground">Tax ID: {settings.companyTaxId}</p>
              )}

              <h1 className="text-2xl font-bold text-foreground mt-4">ใบแจ้งหนี้</h1>
              <p className="text-lg font-semibold text-primary mt-1">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs uppercase text-muted-foreground font-medium mb-2">ลูกค้า</p>
              <p className="font-semibold">{client?.name || "-"}</p>
              {client?.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
              {client?.taxId && <p className="text-sm text-muted-foreground">Tax ID: {client.taxId}</p>}
              {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-muted-foreground font-medium mb-2">รายละเอียด</p>
              <p className="text-sm">วันที่: {new Date(invoice.createdAt).toLocaleDateString("th-TH")}</p>
              <p className="text-sm">ครบกำหนด: {new Date(invoice.dueDate).toLocaleDateString("th-TH")}</p>
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="border-b-2 border-foreground/10">
                <th className="text-left py-3 text-xs uppercase text-muted-foreground font-medium">รายการ</th>
                <th className="text-center py-3 text-xs uppercase text-muted-foreground font-medium w-20">จำนวน</th>
                <th className="text-right py-3 text-xs uppercase text-muted-foreground font-medium w-32">ราคาต่อหน่วย</th>
                <th className="text-right py-3 text-xs uppercase text-muted-foreground font-medium w-32">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-foreground/5">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(Number(item.unitPrice))}</td>
                  <td className="py-3 text-right">{formatCurrency(Number(item.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดรวม</span>
                <span>{formatCurrency(Number(invoice.subtotal))}</span>
              </div>
              {invoice.vatEnabled && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT 7%</span>
                  <span>{formatCurrency(Number(invoice.vatAmount))}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>ยอดรวมสุทธิ</span>
                <span>{formatCurrency(Number(invoice.total))}</span>
              </div>
              {invoice.depositEnabled && (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>หักมัดจำ ({invoice.depositPercent}%)</span>
                    <span>-{formatCurrency(Number(invoice.depositAmount))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>ยอดค้างชำระ</span>
                    <span className="text-primary">{formatCurrency(Number(invoice.amountDue))}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Installments */}
          {invoice.installmentsEnabled && invoice.installments && invoice.installments.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-xs uppercase text-muted-foreground font-medium mb-3">ตารางงวดชำระ</p>
              <div className="grid gap-2 text-sm">
                {invoice.installments.map((inst) => (
                  <div key={inst.number} className="flex justify-between items-center py-2 border-b border-foreground/5 last:border-0">
                    <span>งวดที่ {inst.number}</span>
                    <span className="text-muted-foreground">{new Date(inst.dueDate).toLocaleDateString('th-TH')}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatCurrency(Number(inst.amount))}</span>
                      <Badge variant="secondary" className={inst.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                        {inst.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PromptPay QR */}
          {promptPayQr && (
            <div className="mt-8 pt-6 border-t flex flex-col items-center">
              <p className="text-xs uppercase text-muted-foreground font-medium mb-3">สแกนจ่ายผ่าน PromptPay</p>
              <QRCodeSVG value={promptPayQr} size={240} />
              <p className="text-sm text-muted-foreground mt-3">PromptPay: {invoice.promptPayId}</p>
              <p className="text-lg font-bold mt-1 text-primary">{formatCurrency(Number(invoice.amountDue))}</p>
            </div>
          )}

          {invoice.notes && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-xs uppercase text-muted-foreground font-medium mb-2">หมายเหตุ</p>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </button>
          <span className="text-muted-foreground">•</span>
          <p className="text-center text-xs text-muted-foreground">
            สร้างโดย InvoiceFlow
          </p>
        </div>
      </div>
    </div>
  );
}
