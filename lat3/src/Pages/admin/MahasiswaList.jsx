// src/pages/admin/MahasiswaList.jsx
import { useMemo, useState } from "react";
import { mahasiswalist as seed } from "../../Data/Dummy.js";
import { getAllMahasiswa, storeMahasiswa, updateMahasiswa, deleteMahasiswa } from "../../Utils/Apis/MahasiswaApi.jsx";

export default function MahasiswaList() {
  // --- STATE
  const [mahasiswa, setMahasiswa] = useState(() => seed);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // 'add' | 'edit'
  const [editingNim, setEditingNim] = useState(null);
  const [form, setForm] = useState({ nim: "", nama: "", status: false });
  const total = useMemo(() => mahasiswa.length, [mahasiswa]);

  // --- HANDLERS
  const openAdd = () => {
    setMode("add");
    setForm({ nim: "", nama: "", status: false });
    setEditingNim(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setForm({ nim: row.nim, nama: row.nama, status: !!row.status });
    setEditingNim(row.nim);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDASI
    if (!form.nim?.trim() || !form.nama?.trim()) {
      alert("NIM dan Nama wajib diisi");
      return;
    }
    const nimExist = mahasiswa.some(
      (m) => m.nim === form.nim && (mode === "add" || m.nim !== editingNim)
    );
    if (nimExist) {
      alert("NIM sudah dipakai");
      return;
    }

    if (mode === "add") {
      setMahasiswa((arr) => [...arr, { ...form }]);
    } else {
      if (!confirm("Simpan perubahan data?")) return;
      setMahasiswa((arr) =>
        arr.map((m) => (m.nim === editingNim ? { ...form } : m))
      );
    }
    setModalOpen(false);
  };

  const deleteRow = (nim) => {
    if (!confirm("Yakin hapus data ini?")) return;
    setMahasiswa((arr) => arr.filter((m) => m.nim !== nim));
  };

  // --- UI
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Mahasiswa</h2>
          <p className="text-slate-500 text-sm">Kelola data (CRUD via state)</p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
        >
          + Tambah
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 text-left">NIM</th>
              <th className="px-5 py-3 text-left">Nama</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mahasiswa.map((m) => (
              <tr key={m.nim} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium text-slate-800">{m.nim}</td>
                <td className="px-5 py-3">{m.nama}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 text-xs">
                    {m.status ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => openEdit(m)}
                    className="rounded-xl border px-3 py-1 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRow(m.nim)}
                    className="rounded-xl border border-red-300 text-red-600 px-3 py-1 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50">
              <td className="px-5 py-3 text-slate-600" colSpan={4}>
                Total: {total} data
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {mode === "add" ? "Tambah Mahasiswa" : "Edit Mahasiswa"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600">NIM</span>
                <input
                  name="nim"
                  value={form.nim}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="A11.2023.xxxxx"
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-600">Nama</span>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Nama lengkap"
                />
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                />
                <span className="text-sm text-slate-700">Aktif?</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                >
                  {mode === "add" ? "Simpan" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
