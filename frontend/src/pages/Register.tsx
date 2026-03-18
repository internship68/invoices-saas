import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      // หลังสมัครสำเร็จ ให้ไปหน้า login
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message ?? "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50"
      >
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 mb-2">
            InvoiceFlow
          </p>
          <h1 className="text-2xl font-semibold mb-1 text-white">สมัครใช้งาน</h1>
          <p className="text-sm text-slate-300">
            สร้างบัญชีเพื่อเริ่มออกใบแจ้งหนี้ในไม่กี่วินาที
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-100">ชื่อ</label>
            <input
              type="text"
              className="w-full rounded-md border border-white/15 px-3 py-2 text-sm bg-slate-950/80 text-slate-50 placeholder:text-slate-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-100">อีเมล</label>
            <input
              type="email"
              className="w-full rounded-md border border-white/15 px-3 py-2 text-sm bg-slate-950/80 text-slate-50 placeholder:text-slate-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-100">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full rounded-md border border-white/15 px-3 py-2 text-sm bg-slate-950/80 text-slate-50 placeholder:text-slate-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 shadow-lg shadow-primary/40"
          >
            {loading ? "กำลังสมัคร..." : "สมัครใช้งาน"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400 text-center">
          มีบัญชีอยู่แล้ว?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

