import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-foreground">
      <header className="w-full border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-semibold tracking-tight text-white">
              InvoiceFlow
            </Link>
            <span className="text-[11px] rounded-full border border-white/10 px-2 py-[2px] text-slate-300">
              pricing
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/auth/login" className="text-slate-300 hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/80">
            Early access
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-2">
            Fair pricing for freelancers
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-3 leading-relaxed">
            InvoiceFlow is currently free during early access. We’ll introduce paid plans only when we’re saving you
            meaningful time every month.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-black/40">
            <p className="text-sm font-semibold text-white">Free</p>
            <p className="text-3xl font-semibold text-white mt-2">฿0</p>
            <p className="text-xs text-slate-300 mt-1">Early access (for now)</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              <li>• Create invoices and receipts</li>
              <li>• Manage clients</li>
              <li>• VAT, deposit, installments</li>
              <li>• Public share link</li>
              <li>• Export / print to PDF</li>
            </ul>
            <div className="mt-6">
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 transition"
              >
                Start free
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-slate-900/60 p-6 shadow-2xl shadow-black/40">
            <p className="text-sm font-semibold text-white">Pro</p>
            <p className="text-3xl font-semibold text-white mt-2">Coming soon</p>
            <p className="text-xs text-slate-300 mt-1">Branding, reminders, exports</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              <li>• Custom logo & branding</li>
              <li>• Remove watermark</li>
              <li>• Email reminders for due/overdue</li>
              <li>• CSV/Excel exports for accounting</li>
              <li>• Priority support</li>
            </ul>
            <div className="mt-6">
              <Link
                to="/#waitlist"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/5 transition"
              >
                Join waitlist
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Early users keep a generous free tier. We’ll announce pricing before any changes.
        </p>
      </main>
    </div>
  );
}

