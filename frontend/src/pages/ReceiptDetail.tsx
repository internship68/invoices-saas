import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { useReceipt } from "@/lib/useReceipts";
import { useClients } from "@/lib/useClients";
import { formatCurrency } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function ReceiptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: receipt, isLoading } = useReceipt(id || "");
  const { data: clients = [] } = useClients();

  if (isLoading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        กำลังโหลด...
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        ไม่พบใบเสร็จ
        <br />
        <Button variant="outline" className="mt-4" onClick={() => navigate("/receipts")}>กลับ</Button>
      </div>
    );
  }

  const client = clients.find((c) => c.id === receipt.clientId);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: 10,
        filename: `${receipt.receiptNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/receipts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />กลับ
        </Button>
        <Button onClick={handleDownloadPdf}>
          <Download className="h-4 w-4 mr-2" />ดาวน์โหลด PDF
        </Button>
      </div>

      <div ref={printRef} className="bg-card rounded-xl border p-8" style={{ fontFamily: "'IBM Plex Sans Thai', 'Inter', sans-serif" }}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ใบเสร็จรับเงิน</h1>
            <p className="text-lg font-semibold text-success mt-1">{receipt.receiptNumber}</p>
            <p className="text-sm text-muted-foreground mt-1">อ้างอิง: {receipt.invoiceNumber}</p>
          </div>
          <div className="bg-success/10 text-success px-4 py-2 rounded-lg font-semibold text-sm">
            ชำระแล้ว ✓
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase text-muted-foreground font-medium mb-2">ลูกค้า</p>
            <p className="font-semibold">{client?.name || "-"}</p>
            {client?.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
            {client?.taxId && <p className="text-sm text-muted-foreground">Tax ID: {client.taxId}</p>}
            {client?.address && <p className="text-sm text-muted-foreground">{client.address}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-muted-foreground font-medium mb-2">วันที่ชำระ</p>
            <p className="text-sm">{new Date(receipt.paidAt).toLocaleDateString("th-TH")}</p>
          </div>
        </div>

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
            {receipt.items && receipt.items.map((item) => (
              <tr key={item.id} className="border-b border-foreground/5">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(Number(item.unitPrice))}</td>
                <td className="py-3 text-right">{formatCurrency(Number(item.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            {receipt.subtotal !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดรวม</span>
                <span>{formatCurrency(Number(receipt.subtotal))}</span>
              </div>
            )}
            {receipt.vatEnabled && receipt.vatAmount !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT 7%</span>
                <span>{formatCurrency(Number(receipt.vatAmount))}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>ยอดรวมสุทธิ</span>
              <span className="text-success">{formatCurrency(Number(receipt.total))}</span>
            </div>
          </div>
        </div>

        {receipt.notes && (
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs uppercase text-muted-foreground font-medium mb-2">หมายเหตุ</p>
            <p className="text-sm text-muted-foreground">{receipt.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
