// Simple–Elegant Polished (split, floating label, icons, toggle password)
import { useState } from "react";

export default function Login({ onLogin = () => {} }) {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    onLogin({ email: f.get("email"), password: f.get("password") });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* brand bar tipis */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-900/90 via-slate-700 to-slate-900/90" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl place-items-center px-6 py-10">
        <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Form */}
            <div className="md:col-span-3 p-8 sm:p-10">
              {/* brand minimal */}
              <div className="mb-8 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                  </svg>
                </div>
                <span className="text-sm font-medium tracking-wide text-slate-700">Your Console</span>
              </div>

              <header className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Masuk</h1>
                <p className="mt-1 text-sm text-slate-500">Silakan gunakan kredensial akun Anda</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="relative">
                  {/* icon */}
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 6h16v12H4z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder=" "
                    autoFocus
                    className="peer w-full rounded-2xl border border-slate-300 bg-transparent pl-10 pr-4 pb-2.5 pt-4 text-slate-900 outline-none transition
                               focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute left-10 top-2.5 px-1 text-slate-500 transition
                               peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
                               peer-focus:-top-2 peer-focus:bg-white peer-focus:text-xs peer-focus:text-slate-700"
                  >
                    Email
                  </label>
                </div>

                {/* Password */}
                <div className="relative">
                  {/* icon */}
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                    </svg>
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder=" "
                    className="peer w-full rounded-2xl border border-slate-300 bg-transparent pl-10 pr-12 pb-2.5 pt-4 text-slate-900 outline-none transition
                               focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute left-10 top-2.5 px-1 text-slate-500 transition
                               peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm
                               peer-focus:-top-2 peer-focus:bg-white peer-focus:text-xs peer-focus:text-slate-700"
                  >
                    Password
                  </label>

                  {/* toggle password */}
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPass ? (
                      // eye-off
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9 4 10 7- .29 .83 - .73 1.61 - 1.29 2.31M6.1 6.1C4.2 7.38 2.84 9.09 2 11c1 3 5 7 10 7 1.34 0 2.62-.26 3.79-.74" />
                      </svg>
                    ) : (
                      // eye
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex select-none items-center gap-2 text-slate-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20" />
                    Ingat saya
                  </label>
                  <a href="#" className="font-medium text-slate-700 hover:text-slate-900">
                    Lupa password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition
                             hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20
                             disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Memproses..." : "Masuk"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Belum punya akun?{" "}
                <a href="#" className="font-medium text-slate-700 hover:text-slate-900">
                  Daftar
                </a>
              </p>
            </div>

            {/* Panel kanan (dekor, sama konsepnya tapi lebih refined) */}
            <div className="relative hidden md:block md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
              {/* grid halus */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(transparent 0, transparent 31px, rgba(255,255,255,.08) 32px), linear-gradient(90deg, transparent 0, transparent 31px, rgba(255,255,255,.08) 32px)",
                  backgroundSize: "32px 32px",
                }}
              />
              {/* copy minimal */}
              <div className="relative z-10 flex h-full items-end p-8">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-white/90">Dashboard Admin</h2>
                  <p className="text-sm text-white/60">Rapi, cepat, dan fokus pada data.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
