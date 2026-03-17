import { useState } from "react";
import { useReceipts } from "@/lib/useReceipts";
import { useClients } from "@/lib/useClients";
import { formatCurrency } from "@/lib/calculations";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";

export default function Receipts() {
  const { data: receipts = [], isLoading } = useReceipts();
  const { data: clients = [] } = useClients();
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ใบเสร็จรับเงิน</h1>
        <p className="page-description">ใบเสร็จจะถูกสร้างอัตโนมัติเมื่อเปลี่ยนสถานะใบแจ้งหนี้เป็น "ชำระแล้ว"</p>
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          กำลังโหลด...
        </div>
      ) : receipts.length === 0 ? (
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>ยังไม่มีใบเสร็จ — จะถูกสร้างอัตโนมัติเมื่อมีการชำระเงิน</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
            <span>เลขที่ใบเสร็จ</span>
            <span>ลูกค้า</span>
            <span>ยอดรวม</span>
            <span>วันที่ชำระ</span>
          </div>
          <div className="divide-y">
            {receipts.map((r) => {
              const client = clients.find((c) => c.id === r.clientId);
              return (
                <div
                  key={r.id}
                  className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 p-4 items-center hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/receipts/${r.id}`)}
                >
                  <span className="font-medium">{r.receiptNumber}</span>
                  <span className="text-muted-foreground">{client?.name || "-"}</span>
                  <span className="font-semibold">{formatCurrency(Number(r.total))}</span>
                  <span className="text-sm text-muted-foreground">{new Date(r.paidAt).toLocaleDateString("th-TH")}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
