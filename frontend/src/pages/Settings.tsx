import { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/lib/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const [form, setForm] = useState({
    promptPayId: "",
    companyName: "",
    companyAddress: "",
    companyTaxId: "",
    companyPhone: "",
    companyEmail: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        promptPayId: settings.promptPayId || "",
        companyName: settings.companyName || "",
        companyAddress: settings.companyAddress || "",
        companyTaxId: settings.companyTaxId || "",
        companyPhone: settings.companyPhone || "",
        companyEmail: settings.companyEmail || "",
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => toast.success("บันทึกการตั้งค่าแล้ว!"),
    });
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">ตั้งค่า</h1>
        </div>
        <div className="bg-card rounded-xl border p-16 text-center text-muted-foreground">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">ตั้งค่า</h1>
        <p className="page-description">ตั้งค่าข้อมูลบริษัทและ PromptPay</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold mb-4">ข้อมูลบริษัท / ฟรีแลนซ์</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>ชื่อบริษัท / ชื่อ</Label>
              <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="ชื่อบริษัทหรือชื่อคุณ" />
            </div>
            <div className="grid gap-2">
              <Label>ที่อยู่</Label>
              <Input value={form.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} placeholder="ที่อยู่สำหรับแสดงบนเอกสาร" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>เลขประจำตัวผู้เสียภาษี</Label>
                <Input value={form.companyTaxId} onChange={(e) => update("companyTaxId", e.target.value)} placeholder="เลข Tax ID" />
              </div>
              <div className="grid gap-2">
                <Label>เบอร์โทร</Label>
                <Input value={form.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} placeholder="เบอร์โทรศัพท์" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>อีเมล</Label>
              <Input value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} placeholder="อีเมลสำหรับติดต่อ" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-semibold mb-4">PromptPay</h3>
          <div className="grid gap-2">
            <Label>PromptPay ID (ค่าเริ่มต้น)</Label>
            <p className="text-sm text-muted-foreground">เบอร์โทรหรือเลขบัตรประชาชนสำหรับรับเงิน จะใช้เป็นค่าเริ่มต้นในใบแจ้งหนี้ทุกใบ</p>
            <Input value={form.promptPayId} onChange={(e) => update("promptPayId", e.target.value)} placeholder="เช่น 0812345678" className="max-w-sm" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>บันทึกการตั้งค่า</Button>
        </div>
      </div>
    </div>
  );
}
