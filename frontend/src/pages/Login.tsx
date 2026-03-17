import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ email: string; password: string }, any>("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("auth_token", res.accessToken);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-foreground text-center">เข้าสู่ระบบ BillFlow</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          จัดการใบแจ้งหนี้และใบเสร็จของคุณในที่เดียว
        </p>

        {error && (
          <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">อีเมล</label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          ยังไม่มีบัญชี?{" "}
          <Link to="/auth/register" className="text-primary hover:underline">
            สมัครใช้งานฟรี
          </Link>
        </p>
      </div>
    </div>
  );
}

