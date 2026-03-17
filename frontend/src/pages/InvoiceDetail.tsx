import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Copy, CheckCircle2 } from "lucide-react";
import { useInvoice, useMarkInvoicePaid } from "@/lib/useInvoices";
import { useClients } from "@/lib/useClients";
import { formatCurrency } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import generatePayload from "promptpay-qr";

const statusConfig = {
  draft: { label: "แบบร่าง", className: "bg-muted text-muted-foreground" },
  sent: { label: "ส่งแล้ว", className: "bg-warning/10 text-warning" },
  paid: { label: "ชำระแล้ว", className: "bg-success/10 text-success" },
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { data: invoice, isLoading } = useInvoice(id || "");
  const { data: clients = [] } = useClients();
  const markPaidMutation = useMarkInvoicePaid();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        กำลังโหลด...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        ไม่พบใบแจ้งหนี้
        <br />
        <Button variant="outline" className="mt-4" onClick={() => navigate("/invoices")}>
          กลับ
        </Button>
      </div>
    );
  }

  const client = clients.find((c) => c.id === invoice.clientId);
  const cfg = statusConfig[invoice.status];

  const publicUrl = `${window.location.origin}/invoice/public/${invoice.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("คัดลอกลิงก์แล้ว!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkPaid = () => {
    if (!invoice) return;
    markPaidMutation.mutate(invoice.id, {
      onSuccess: () => {
        toast.success("เปลี่ยนสถานะเป็นชำระแล้ว + สร้างใบเสร็จอัตโนมัติ!");
        navigate("/receipts");
      },
    });
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 10,
        filename: `${invoice.invoiceNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  };

  let promptPayQr: string | null = null;
  if (invoice.promptPayId) {
    try {
      promptPayQr = generatePayload(invoice.promptPayId, { amount: Number(invoice.amountDue) });
    } catch {
      promptPayQr = null;
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Button variant="ghost" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="h-4 w-4 mr-2" />กลับ
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleCopyLink}>
            {copied ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
          </Button>
          {invoice.status !== "paid" && (
            <Button variant="default" onClick={handleMarkPaid} className="bg-success hover:bg-success/90 text-success-foreground">
              <CheckCircle2 className="h-4 w-4 mr-2" />ชำระแล้ว + สร้างใบเสร็จ
            </Button>
          )}
          {invoice.receiptId && (
            <Button variant="outline" onClick={() => navigate(`/receipts/${invoice.receiptId}`)}>
              ดูใบเสร็จ
            </Button>
          )}
          <Button onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-2" />ดาวน์โหลด PDF
          </Button>
        </div>
      </div>

      <div ref={printRef} className="bg-card rounded-xl border p-8" style={{ fontFamily: "'IBM Plex Sans Thai', 'Inter', sans-serif" }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ใบแจ้งหนี้</h1>
            <p className="text-lg font-semibold text-primary mt-1">{invoice.invoiceNumber}</p>
          </div>
          <Badge variant="secondary" className={cfg.className}>{cfg.label}</Badge>
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

        {/* Items Table */}
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
        {promptPayQr && invoice.status !== 'paid' && (
          <div className="mt-8 pt-6 border-t flex flex-col items-center">
            <p className="text-xs uppercase text-muted-foreground font-medium mb-3">สแกนจ่ายผ่าน PromptPay</p>
            <QRCodeSVG value={promptPayQr} size={200} />
            <p className="text-sm text-muted-foreground mt-2">PromptPay: {invoice.promptPayId}</p>
            <p className="text-sm font-semibold mt-1">{formatCurrency(Number(invoice.amountDue))}</p>
          </div>
        )}

        {invoice.notes && (
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs uppercase text-muted-foreground font-medium mb-2">หมายเหตุ</p>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
