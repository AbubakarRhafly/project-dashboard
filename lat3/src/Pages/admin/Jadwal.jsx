import { useEffect, useState } from "react";
import JadwalTable from "./JadwalTable.jsx";
import {
    getAllJadwal, storeJadwal, updateJadwal, deleteJadwal
} from "../../Utils/Apis/JadwalApi.jsx";
import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers.jsx";

export default function Jadwal() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [form, setForm] = useState({ id: "", kode: "", hari: "", jam: "", ruang: "" });

    const fetchRows = async () => {
        try {
            setLoading(true);
            const res = await getAllJadwal();
            setRows(res.data || []);
        } catch (e) { console.error(e); toastError("Gagal memuat jadwal"); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchRows(); }, []);

    const openAdd = () => { setMode("add"); setForm({ id: "", kode: "", hari: "", jam: "", ruang: "" }); setModalOpen(true); };
    const openEdit = (row) => { setMode("edit"); setForm({ id: row.id, kode: row.kode ?? "", hari: row.hari ?? "", jam: row.jam ?? "", ruang: row.ruang ?? "" }); setModalOpen(true); };

    const handleDelete = async (id) => {
        try {
            const ok = await confirmDelete(); if (!ok) return;
            await deleteJadwal(id);
            toastSuccess("Data terhapus");
            fetchRows();
        } catch (e) { console.error(e); toastError("Gagal menghapus"); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.kode.trim() || !form.hari.trim() || !form.jam.trim() || !form.ruang.trim()) {
            toastError("Semua field wajib diisi"); return;
        }
        try {
            if (mode === "edit") {
                const ok = await confirmUpdate(); if (!ok) return;
                await updateJadwal(form.id, { kode: form.kode, hari: form.hari, jam: form.jam, ruang: form.ruang });
                toastSuccess("Berhasil diperbarui");
            } else {
                await storeJadwal({ kode: form.kode, hari: form.hari, jam: form.jam, ruang: form.ruang });
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
                    <h2 className="text-xl font-semibold">Jadwal</h2>
                    <p className="text-slate-500 text-sm">CRUD via JSON-Server (axios)</p>
                </div>
                <button type="button" onClick={openAdd} className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">+ Tambah</button>
            </div>

            {loading ? (
                <div className="p-6 text-sm text-slate-600">Memuat data…</div>
            ) : (
                <JadwalTable data={rows} onEdit={openEdit} onDelete={handleDelete} />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">{mode === "add" ? "Tambah Jadwal" : "Edit Jadwal"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm text-slate-600">Kode MK</span>
                                <input name="kode" value={form.kode} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-slate-600">Hari</span>
                                <input name="hari" value={form.hari} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-slate-600">Jam</span>
                                <input name="jam" value={form.jam} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200" placeholder="08:00-09:40" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-slate-600">Ruang</span>
                                <input name="ruang" value={form.ruang} onChange={handleChange}
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
