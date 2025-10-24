import { useParams, Link } from "react-router-dom";
import { mahasiswalist } from "../../Data/Dummy.js";  // dari pages/admin

export default function MahasiswaDetail() {
  const { id } = useParams();
  const m = mahasiswaList.find((x) => x.nim === id);

  if (!m) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <p className="text-red-600">Mahasiswa tidak ditemukan.</p>
        <Link to="/admin/mahasiswa" className="mt-4 inline-block rounded-lg border border-slate-300 px-3 py-1.5">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">Detail Mahasiswa</h2>
      <div className="text-sm">
        <div><span className="text-slate-500">NIM:</span> {m.nim}</div>
        <div><span className="text-slate-500">Nama:</span> {m.nama}</div>
      </div>
      <Link to="/admin/mahasiswa" className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-1.5">
        Kembali
      </Link>
    </section>
  );
}
