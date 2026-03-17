import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useInvoices, useDeleteInvoice, useUpdateInvoice, useMarkInvoicePaid } from "@/lib/useInvoices";
import { useClients } from "@/lib/useClients";
import { formatCurrency } from "@/lib/calculations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/lib/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: "แบบร่าง", className: "bg-muted text-muted-foreground" },
  sent: { label: "ส่งแล้ว", className: "bg-warning/10 text-warning" },
  paid: { label: "ชำระแล้ว", className: "bg-success/10 text-success" },
};

export default function Invoices() {
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();
  const deleteMutation = useDeleteInvoice();
  const updateMutation = useUpdateInvoice();
  const markPaidMutation = useMarkInvoicePaid();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStatusChange = (inv: any, status: InvoiceStatus) => {
    if (status === 'paid' && inv.status !== 'paid') {
      markPaidMutation.mutate(inv.id, {
        onSuccess: () => toast.success("สร้างใบเสร็จอัตโนมัติแล้ว!"),
      });
    } else {
      updateMutation.mutate({ id: inv.id, status });
    }
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">ใบแจ้งหนี้</h1>
          <p className="page-description">จัดการใบแจ้งหนี้ทั้งหมด</p>
        </div>
        <Button onClick={() => navigate('/invoices/new')}><Plus className="h-4 w-4 mr-2" />สร้างใบแจ้งหนี้</Button>
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          กำลังโหลด...
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          ยังไม่มีใบแจ้งหนี้ — สร้างใบแรกเลย!
        </div>
      ) : (
        <div className="bg-card rounded-xl border">
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
            <span>เลขที่</span>
            <span>ลูกค้า</span>
            <span>ยอดรวม</span>
            <span>สถานะ</span>
            <span></span>
          </div>
          <div className="divide-y">
            {invoices.map(inv => {
              const client = clients.find(c => c.id === inv.clientId);
              const cfg = statusConfig[inv.status];
              return (
                <div
                  key={inv.id}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 p-4 items-center hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                  <span className="font-medium">{inv.invoiceNumber}</span>
                  <span className="text-muted-foreground">{client?.name || '-'}</span>
                  <span className="font-semibold">{formatCurrency(Number(inv.total))}</span>
                  <div onClick={e => e.stopPropagation()}>
                    <Select value={inv.status} onValueChange={(v) => handleStatusChange(inv, v as InvoiceStatus)}>
                      <SelectTrigger className="w-[120px] h-8">
                        <Badge variant="secondary" className={cfg.className}>{cfg.label}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">แบบร่าง</SelectItem>
                        <SelectItem value="sent">ส่งแล้ว</SelectItem>
                        <SelectItem value="paid">ชำระแล้ว</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDeleteId(inv.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>ต้องการลบใบแจ้งหนี้นี้หรือไม่?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
