import { Link } from "react-router-dom";
import { mahasiswaList } from "../../Data/Dummy.js";

export default function MahasiswaList() {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Mahasiswa</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2 text-left font-medium">NIM</th>
              <th className="px-4 py-2 text-left font-medium">Nama</th>
              <th className="px-4 py-2 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {mahasiswaList.map((m) => (
              <tr key={m.nim} className="hover:bg-slate-50">
                <td className="px-4 py-2 font-mono">{m.nim}</td>
                <td className="px-4 py-2">{m.nama}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    to={`/admin/mahasiswa/${m.nim}`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
