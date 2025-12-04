import { useEffect, useState } from "react";
import MataKuliahTable from "./MataKuliahTable.jsx";
import {
    getAllMataKuliah, storeMataKuliah, updateMataKuliah, deleteMataKuliah
} from "../../Utils/Apis/MataKuliahApi.jsx";
import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers.jsx";

export default function MataKuliah() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [form, setForm] = useState({ id: "", kode: "", nama: "", sks: 0 });

    const fetchRows = async () => {
        try {
            setLoading(true);
            const res = await getAllMataKuliah();
            setRows(res.data || []);
        } catch (e) {
            console.error(e);
            toastError("Gagal memuat data mata kuliah");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchRows(); }, []);

    const openAdd = () => { setMode("add"); setForm({ id: "", kode: "", nama: "", sks: 0 }); setModalOpen(true); };
    const openEdit = (row) => { setMode("edit"); setForm({ id: row.id, kode: row.kode ?? "", nama: row.nama ?? "", sks: row.sks ?? 0 }); setModalOpen(true); };

    const handleDelete = async (id) => {
        try {
            const ok = await confirmDelete(); if (!ok) return;
            await deleteMataKuliah(id);
            toastSuccess("Data terhapus");
            fetchRows();
        } catch (e) { console.error(e); toastError("Gagal menghapus"); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: name === "sks" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.kode.trim() || !form.nama.trim()) { toastError("Kode & Nama wajib diisi"); return; }
        try {
            if (mode === "edit") {
                const ok = await confirmUpdate(); if (!ok) return;
                await updateMataKuliah(form.id, { kode: form.kode, nama: form.nama, sks: form.sks });
                toastSuccess("Berhasil diperbarui");
            } else {
                await storeMataKuliah({ kode: form.kode, nama: form.nama, sks: form.sks });
                toastSuccess("Berhasil ditambahkan");
            }
            setModalOpen(false);
            fetchRows();
        } catch (e) { console.error(e); toastError("Operasi gagal"); }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Mata Kuliah</h2>
                    <p className="text-slate-500 text-sm">CRUD via JSON-Server (axios)</p>
                </div>
                <button type="button" onClick={openAdd} className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">+ Tambah</button>
            </div>

            {loading ? (
                <div className="p-6 text-sm text-slate-600">Memuat data…</div>
            ) : (
                <MataKuliahTable data={rows} onEdit={openEdit} onDelete={handleDelete} />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">{mode === "add" ? "Tambah Mata Kuliah" : "Edit Mata Kuliah"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm text-slate-600">Kode MK</span>
                                <input name="kode" value={form.kode} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-slate-600">Nama MK</span>
                                <input name="nama" value={form.nama} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-slate-600">SKS</span>
                                <input type="number" min="0" name="sks" value={form.sks} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200" />
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border px-4 py-2 hover:bg-slate-50">Batal</button>
                                <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
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
