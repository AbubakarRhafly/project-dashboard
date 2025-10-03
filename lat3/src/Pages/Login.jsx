// ⬇️ tambahin onLogin di props (default biar aman)
export default function Login({ onLogin = () => {} }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    onLogin({ email, password });   // ⬅️ trigger ke App
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <main className="w-full max-w-md">
        <section className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-900/90 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                </svg>
              </div>
              <h1 className="mt-4 text-2xl font-semibold text-slate-900">Welcome Back</h1>
              <p className="text-slate-500 text-sm">Masuk ke akun anda</p>
            </div>

            {/* ⬇️ cuma tambah onSubmit */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* ...SEMUA KOMPONEN & KELAS MU TETAP SAMA... */}
              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 px-4 py-2.5 outline-none"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 px-4 py-2.5 outline-none"
                />
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 select-none">
                  <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/30" />
                  <span className="text-slate-600">Ingat saya</span>
                </label>
                <a href="#" className="text-slate-900 font-medium">Lupa password?</a>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold shadow hover:bg-slate-800">
                Masuk
              </button>
            </form>
          </div>

          <div className="bg-slate-50 px-8 py-5 text-center text-sm text-slate-500">
            Belum punya akun? <a href="#" className="text-slate-900 font-medium">Daftar</a>
          </div>
        </section>
      </main>
    </div>
  );
}
