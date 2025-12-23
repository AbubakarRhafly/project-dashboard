import { useState } from "react";
import JadwalTable from "./JadwalTable.jsx";

import {
    useJadwal,
    useStoreJadwal,
    useUpdateJadwal,
    useDeleteJadwal,
} from "../../Utils/Hooks/useJadwal.jsx";
import { useDosen } from "../../Utils/Hooks/useDosen.jsx";
import { useMataKuliah } from "../../Utils/Hooks/useMataKuliah.jsx";

import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";
import { toastError } from "../../Utils/Helpers/ToastHelpers.jsx";

export default function Jadwal() {
    // Jadwal (dipakai sebagai Kelas)
    const { data: rows = [], isLoading: loading } = useJadwal();
    const { mutate: store } = useStoreJadwal();
    const { mutate: update } = useUpdateJadwal();
    const { mutate: remove } = useDeleteJadwal();

    // dropdown referensi (opsional, kalau lu pakai)
    const { data: dosen = [] } = useDosen();
    const { data: mataKuliah = [] } = useMataKuliah();

    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add"); // add | edit

    // ⚠️ FORM FIELD JADWAL bisa beda-beda antar project.
    // Ini format aman yang umum:
    // - kodeMk (relasi ke matakuliah)
    // - nidn (relasi ke dosen)
    // - hari, jam, ruang
    const [form, setForm] = useState({
        id: "",
        kodeMk: "",
        nidn: "",
        hari: "",
        jam: "",
        ruang: "",
    });

    const openAdd = () => {
        setMode("add");
        setForm({ id: "", kodeMk: "", nidn: "", hari: "", jam: "", ruang: "" });
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setMode("edit");
        setForm({
            id: row.id,
            kodeMk: row.kodeMk ?? "",
            nidn: row.nidn ?? "",
            hari: row.hari ?? "",
            jam: row.jam ?? "",
            ruang: row.ruang ?? "",
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirmDelete();
        if (!ok) return;
        remove(id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // validasi minimal
        if (!form.kodeMk.trim() || !form.nidn.trim() || !form.hari.trim() || !form.jam.trim()) {
            toastError("Kode MK, NIDN, Hari, dan Jam wajib diisi");
            return;
        }

        const payload = {
            kodeMk: form.kodeMk,
            nidn: form.nidn,
            hari: form.hari,
            jam: form.jam,
            ruang: form.ruang,
        };

        if (mode === "add") {
            store(payload, { onSuccess: () => setModalOpen(false) });
            return;
        }

        const ok = await confirmUpdate();
        if (!ok) return;

        update({ id: form.id, data: payload }, { onSuccess: () => setModalOpen(false) });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Jadwal (Kelas)</h2>
                    <p className="text-slate-500 text-sm">CRUD via React Query</p>
                </div>

                <button
                    type="button"
                    onClick={openAdd}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                >
                    + Tambah
                </button>
            </div>

            {loading ? (
                <div className="p-6 text-sm text-slate-600">Memuat data…</div>
            ) : (
                <JadwalTable data={rows} onEdit={openEdit} onDelete={handleDelete} />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">
                            {mode === "add" ? "Tambah Jadwal" : "Edit Jadwal"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Kode MK */}
                            <label className="block">
                                <span className="text-sm text-slate-600">Mata Kuliah (kode)</span>

                                {/* kalau mau dropdown */}
                                <select
                                    name="kodeMk"
                                    value={form.kodeMk}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                >
                                    <option value="">-- pilih mata kuliah --</option>
                                    {mataKuliah.map((mk) => (
                                        <option key={mk.id} value={mk.kode}>
                                            {mk.kode} - {mk.nama}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* NIDN */}
                            <label className="block">
                                <span className="text-sm text-slate-600">Dosen (NIDN)</span>

                                <select
                                    name="nidn"
                                    value={form.nidn}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                >
                                    <option value="">-- pilih dosen --</option>
                                    {dosen.map((d) => (
                                        <option key={d.id} value={d.nidn}>
                                            {d.nidn} - {d.nama}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Hari */}
                            <label className="block">
                                <span className="text-sm text-slate-600">Hari</span>
                                <input
                                    name="hari"
                                    value={form.hari}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="contoh: Senin"
                                />
                            </label>

                            {/* Jam */}
                            <label className="block">
                                <span className="text-sm text-slate-600">Jam</span>
                                <input
                                    name="jam"
                                    value={form.jam}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="contoh: 08:00 - 10:00"
                                />
                            </label>

                            {/* Ruang */}
                            <label className="block">
                                <span className="text-sm text-slate-600">Ruang (opsional)</span>
                                <input
                                    name="ruang"
                                    value={form.ruang}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="contoh: Lab 1"
                                />
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
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
