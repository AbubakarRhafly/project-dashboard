import { useState } from "react";
import MataKuliahTable from "./MataKuliahTable.jsx";

import {
    useMataKuliah,
    useStoreMataKuliah,
    useUpdateMataKuliah,
    useDeleteMataKuliah,
} from "../../Utils/Hooks/useMataKuliah.jsx";

import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";
import { toastError } from "../../Utils/Helpers/ToastHelpers.jsx";

export default function MataKuliah() {
    const { data: rows = [], isLoading: loading } = useMataKuliah();
    const { mutate: store } = useStoreMataKuliah();
    const { mutate: update } = useUpdateMataKuliah();
    const { mutate: remove } = useDeleteMataKuliah();

    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add"); // add | edit
    const [form, setForm] = useState({
        id: "",
        kode: "",
        nama: "",
        sks: "",
    });

    const openAdd = () => {
        setMode("add");
        setForm({ id: "", kode: "", nama: "", sks: "" });
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setMode("edit");
        setForm({
            id: row.id,
            kode: row.kode ?? "",
            nama: row.nama ?? "",
            sks: String(row.sks ?? ""),
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

        if (!form.kode.trim() || !form.nama.trim() || !String(form.sks).trim()) {
            toastError("Kode, Nama, dan SKS wajib diisi");
            return;
        }

        // sks numeric
        const sksNum = Number(form.sks);
        if (Number.isNaN(sksNum) || sksNum <= 0) {
            toastError("SKS harus angka > 0");
            return;
        }

        if (mode === "add") {
            // optional: cek kode unik
            const exists = rows.find((m) => String(m.kode) === String(form.kode));
            if (exists) {
                toastError("Kode mata kuliah sudah terdaftar!");
                return;
            }

            store(
                { kode: form.kode, nama: form.nama, sks: sksNum },
                { onSuccess: () => setModalOpen(false) }
            );
            return;
        }

        const ok = await confirmUpdate();
        if (!ok) return;

        update(
            { id: form.id, data: { kode: form.kode, nama: form.nama, sks: sksNum } },
            { onSuccess: () => setModalOpen(false) }
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Mata Kuliah</h2>
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
                <MataKuliahTable data={rows} onEdit={openEdit} onDelete={handleDelete} />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">
                            {mode === "add" ? "Tambah Mata Kuliah" : "Edit Mata Kuliah"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm text-slate-600">Kode</span>
                                <input
                                    name="kode"
                                    value={form.kode}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm text-slate-600">Nama</span>
                                <input
                                    name="nama"
                                    value={form.nama}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm text-slate-600">SKS</span>
                                <input
                                    name="sks"
                                    value={form.sks}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    inputMode="numeric"
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
