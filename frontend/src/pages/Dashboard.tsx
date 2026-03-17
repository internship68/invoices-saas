import { FileText, Users, DollarSign, Clock } from "lucide-react";
import { useInvoices } from "@/lib/useInvoices";
import { useClients } from "@/lib/useClients";
import { formatCurrency } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-warning/10 text-warning",
  paid: "bg-success/10 text-success",
};

const statusLabels: Record<string, string> = {
  draft: "แบบร่าง",
  sent: "ส่งแล้ว",
  paid: "ชำระแล้ว",
};

export default function Dashboard() {
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: clients = [] } = useClients();

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0);
  const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + Number(i.amountDue), 0);
  const recentInvoices = [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    { label: "ใบแจ้งหนี้ทั้งหมด", value: invoices.length, icon: FileText, color: "text-primary" },
    { label: "ลูกค้า", value: clients.length, icon: Users, color: "text-primary" },
    { label: "รายได้รวม", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-success" },
    { label: "รอชำระ", value: formatCurrency(pendingAmount), icon: Clock, color: "text-warning" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แดชบอร์ด</h1>
        <p className="page-description">ภาพรวมธุรกิจของคุณ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="font-semibold">ใบแจ้งหนี้ล่าสุด</h2>
        </div>
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">
            กำลังโหลด...
          </div>
        ) : recentInvoices.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            ยังไม่มีใบแจ้งหนี้ — เริ่มสร้างเลย!
          </div>
        ) : (
          <div className="divide-y">
            {recentInvoices.map((inv) => {
              const client = clients.find(c => c.id === inv.clientId);
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                  <div>
                    <span className="font-medium">{inv.invoiceNumber}</span>
                    <span className="text-sm text-muted-foreground ml-3">{client?.name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className={statusColors[inv.status]}>
                      {statusLabels[inv.status]}
                    </Badge>
                    <span className="font-semibold min-w-[100px] text-right">{formatCurrency(Number(inv.total))}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
