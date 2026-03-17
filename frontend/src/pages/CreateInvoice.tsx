import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { InvoiceItem } from "@/lib/types";
import { useClients } from "@/lib/useClients";
import { useSettings } from "@/lib/useSettings";
import { useCreateInvoice } from "@/lib/useInvoices";
import {
  calculateItemAmount,
  calculateSubtotal,
  calculateVat,
  calculateTotal,
  calculateDeposit,
  calculateAmountDue,
  calculateInstallments,
  formatCurrency,
} from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { data: clients = [] } = useClients();
  const { data: settings } = useSettings();
  const createMutation = useCreateInvoice();
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, amount: 0 },
  ]);
  const [vatEnabled, setVatEnabled] = useState(false);
  const [depositEnabled, setDepositEnabled] = useState(false);
  const [depositPercent, setDepositPercent] = useState(50);
  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
  const [installmentCount, setInstallmentCount] = useState(3);
  const [notes, setNotes] = useState("");
  const [promptPayId, setPromptPayId] = useState(settings?.promptPayId || "");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = calculateItemAmount(
            field === "quantity" ? Number(value) : updated.quantity,
            field === "unitPrice" ? Number(value) : updated.unitPrice
          );
        }
        return updated;
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const vatAmount = useMemo(() => (vatEnabled ? calculateVat(subtotal) : 0), [subtotal, vatEnabled]);
  const total = useMemo(() => calculateTotal(subtotal, vatAmount), [subtotal, vatAmount]);
  const depositAmount = useMemo(() => (depositEnabled ? calculateDeposit(total, depositPercent) : 0), [total, depositEnabled, depositPercent]);
  const amountDue = useMemo(() => calculateAmountDue(total, depositAmount), [total, depositAmount]);
  const installments = useMemo(
    () => installmentsEnabled ? calculateInstallments(amountDue, installmentCount, dueDate) : [],
    [installmentsEnabled, installmentCount, amountDue, dueDate]
  );

  const handleSave = () => {
    if (!clientId) {
      toast.error("กรุณาเลือกลูกค้า");
      return;
    }
    if (items.some((i) => !i.description.trim())) {
      toast.error("กรุณากรอกรายละเอียดรายการทุกรายการ");
      return;
    }

    const payload = {
      clientId,
      items,
      subtotal,
      vatEnabled,
      vatAmount,
      depositEnabled,
      depositPercent,
      depositAmount,
      total,
      amountDue,
      dueDate,
      notes,
      promptPayId: promptPayId || undefined,
      installments: installmentsEnabled ? installments : undefined,
    } as never; // Temporary `as any` to bypass the type error. Consider properly typing the payload.

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("สร้างใบแจ้งหนี้สำเร็จ!");
        navigate("/invoices");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">สร้างใบแจ้งหนี้ใหม่</h1>
        <p className="page-description">กรอกรายละเอียดเพื่อสร้างใบแจ้งหนี้</p>
      </div>

      <div className="grid gap-6">
        {/* Client & Date */}
        <div className="bg-card rounded-xl border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>ลูกค้า *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกลูกค้า" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>วันครบกำหนด</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold mb-4">รายการ</h3>
          <div className="grid gap-3">
            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_120px_120px_40px] gap-3 items-end">
                <div className="grid gap-1">
                  {idx === 0 && <Label className="text-xs text-muted-foreground">รายละเอียด</Label>}
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="รายละเอียดรายการ"
                  />
                </div>
                <div className="grid gap-1">
                  {idx === 0 && <Label className="text-xs text-muted-foreground">จำนวน</Label>}
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-1">
                  {idx === 0 && <Label className="text-xs text-muted-foreground">ราคาต่อหน่วย</Label>}
                  <Input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-1">
                  {idx === 0 && <Label className="text-xs text-muted-foreground">จำนวนเงิน</Label>}
                  <Input value={formatCurrency(item.amount)} readOnly className="bg-muted" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} disabled={items.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />เพิ่มรายการ
          </Button>
        </div>

        {/* Options */}
        <div className="bg-card rounded-xl border p-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>ภาษีมูลค่าเพิ่ม (VAT 7%)</Label>
                <p className="text-sm text-muted-foreground">คำนวณ VAT 7% อัตโนมัติ</p>
              </div>
              <Switch checked={vatEnabled} onCheckedChange={setVatEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>มัดจำ</Label>
                <p className="text-sm text-muted-foreground">หักเงินมัดจำจากยอดรวม</p>
              </div>
              <div className="flex items-center gap-3">
                {depositEnabled && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                )}
                <Switch checked={depositEnabled} onCheckedChange={setDepositEnabled} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>แบ่งงวดชำระ</Label>
                <p className="text-sm text-muted-foreground">แบ่งจ่ายเป็นงวดๆ ตามจำนวนที่กำหนด</p>
              </div>
              <div className="flex items-center gap-3">
                {installmentsEnabled && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="2"
                      max="12"
                      value={installmentCount}
                      onChange={(e) => setInstallmentCount(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">งวด</span>
                  </div>
                )}
                <Switch checked={installmentsEnabled} onCheckedChange={setInstallmentsEnabled} />
              </div>
            </div>
          </div>
        </div>

        {/* PromptPay */}
        <div className="bg-card rounded-xl border p-6">
          <div className="grid gap-2">
            <Label>PromptPay ID (เบอร์โทร / เลขบัตรประชาชน)</Label>
            <p className="text-sm text-muted-foreground">แสดง QR Code สำหรับลูกค้าสแกนจ่ายเงิน</p>
            <Input
              value={promptPayId}
              onChange={(e) => setPromptPayId(e.target.value)}
              placeholder="เช่น 0812345678 หรือ 1234567890123"
              className="max-w-sm"
            />
          </div>
        </div>

        {/* Installment Preview */}
        {installmentsEnabled && installments.length > 0 && (
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-semibold mb-4">ตารางงวดชำระ</h3>
            <div className="grid gap-2 text-sm">
              {installments.map((inst) => (
                <div key={inst.number} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground">งวดที่ {inst.number}</span>
                  <span className="text-muted-foreground">{new Date(inst.dueDate).toLocaleDateString('th-TH')}</span>
                  <span className="font-medium">{formatCurrency(inst.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="bg-card rounded-xl border p-6">
          <Label>หมายเหตุ</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)"
            className="mt-2"
          />
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold mb-4">สรุปยอด</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ยอดรวมก่อน VAT</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {vatEnabled && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT 7%</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <span>ยอดรวมสุทธิ</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {depositEnabled && (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>หักมัดจำ ({depositPercent}%)</span>
                  <span>-{formatCurrency(depositAmount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>ยอดค้างชำระ</span>
                  <span className="text-primary">{formatCurrency(amountDue)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate("/invoices")}>ยกเลิก</Button>
          <Button onClick={handleSave}>บันทึกใบแจ้งหนี้</Button>
        </div>
      </div>
    </div>
  );
}
