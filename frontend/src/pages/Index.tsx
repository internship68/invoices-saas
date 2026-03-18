import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-foreground flex flex-col">
      <header className="w-full border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-white">InvoiceFlow</span>
            <span className="text-[11px] rounded-full border border-white/10 px-2 py-[2px] text-slate-300">
              for freelancers
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/invoices"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Go to app
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-white/5">
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 grid gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center">
            <motion.div
              className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <motion.div
              className="space-y-7 relative z-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/80">
                Simple invoice generator
              </p>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                Create invoices in{" "}
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  30 seconds.
                </span>
                <span className="block mt-2 text-slate-300 text-xl md:text-2xl font-normal">
                  No Word. No formatting. No PDFs by hand.
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                InvoiceFlow helps freelancers go from rough numbers to a clean, ready‑to‑send invoice:
                clients, line items, VAT, deposits – all handled in the browser with Thai‑ready support.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              >
                <Link
                  to="/invoices/new"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 transition"
                >
                  Try the app now
                </Link>
                <a
                  href="#waitlist"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/5 transition"
                >
                  Join launch waitlist
                </a>
              </motion.div>

              <motion.div
                className="grid gap-3 text-sm text-slate-300 md:grid-cols-2 max-w-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Built for freelancers
                  </p>
                  <ul className="space-y-1.5">
                    <li>• Auto‑calculate totals, VAT, deposit, and amount due</li>
                    <li>• Save clients once and reuse them across invoices</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Ready to send
                  </p>
                  <ul className="space-y-1.5">
                    <li>• One‑click export to clean PDF or shareable link</li>
                    <li>• Layout designed for Thai businesses and VAT 7%</li>
                  </ul>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
                    Early access
                  </p>
                  <p className="text-xs text-slate-300">
                    100% free while we&apos;re in early access. Core features will always have a generous free tier for early users.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="absolute -inset-6 rounded-[32px] bg-gradient-to-tr from-primary/20 via-emerald-400/10 to-transparent blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
              <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-300">Invoice preview</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-[2px] text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
                    Live in your browser
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide">Client</p>
                      <p className="text-sm font-medium text-slate-50">Mai Studio Co., Ltd.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide">Total</p>
                      <p className="text-sm font-semibold text-slate-50">฿19,260.00</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Design work (Landing page)</span>
                      <span>฿18,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT 7%</span>
                      <span>฿1,260.00</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  This is a static preview. The real app lets you change clients, items, VAT and export PDFs instantly.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="waitlist" className="border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-14">
            <div className="max-w-xl space-y-3">
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Get notified when we launch on Product Hunt
              </h2>
              <p className="text-sm text-slate-300">
                Leave your email and we&apos;ll send you the launch link, plus a short guide on how to get
                the most out of InvoiceFlow as a freelancer.
              </p>
            </div>
            <motion.form
              action="https://docs.google.com/forms"
              method="GET"
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-white/15 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-md shadow-primary/30"
              >
                Join waitlist
              </button>
            </motion.form>
            <p className="mt-2 text-[11px] text-slate-400">
              You can replace this form action with Mailchimp or any email provider later.
            </p>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto px-4 py-8 text-[11px] md:text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p>Built with NestJS, React, Neon, and Tailwind — optimized for freelancers.</p>
            <p>Ready for Product Hunt: name, tagline, screenshots, and demo all come from this live app.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
