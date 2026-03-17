import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Client } from "@/lib/types";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/lib/useClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const emptyClient: Omit<Client, 'id' | 'createdAt'> = {
  name: '', company: '', taxId: '', address: '', phone: '', email: '',
};

export default function Clients() {
  const { data: clients = [], isLoading } = useClients();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyClient);

  const openNew = () => {
    setEditing(null);
    setForm(emptyClient);
    setDialogOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({ name: c.name, company: c.company, taxId: c.taxId, address: c.address, phone: c.phone, email: c.email });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateMutation.mutate({ ...editing, ...form }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate(form, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">ลูกค้า</h1>
          <p className="page-description">จัดการข้อมูลลูกค้าของคุณ</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />เพิ่มลูกค้า</Button>
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          กำลังโหลด...
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          ยังไม่มีลูกค้า — เพิ่มลูกค้าคนแรกเลย!
        </div>
      ) : (
        <div className="bg-card rounded-xl border divide-y">
          {clients.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.company} {c.taxId && `• ${c.taxId}`}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>ชื่อ *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="ชื่อลูกค้า" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>บริษัท</Label>
                <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="ชื่อบริษัท" />
              </div>
              <div className="grid gap-2">
                <Label>เลขประจำตัวผู้เสียภาษี</Label>
                <Input value={form.taxId} onChange={e => set('taxId', e.target.value)} placeholder="Tax ID" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>ที่อยู่</Label>
              <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="ที่อยู่" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>โทรศัพท์</Label>
                <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="เบอร์โทร" />
              </div>
              <div className="grid gap-2">
                <Label>อีเมล</Label>
                <Input value={form.email} onChange={e => set('email', e.target.value)} placeholder="อีเมล" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>ต้องการลบลูกค้ารายนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</AlertDialogDescription>
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
