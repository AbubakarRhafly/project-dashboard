import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MahasiswaTable from "./MahasiswaTable.jsx";
import {
    useMahasiswa,
    useStoreMahasiswa,
    useUpdateMahasiswa,
    useDeleteMahasiswa,
} from "../../Utils/Hooks/useMahasiswa.jsx";

import { toastError } from "../../Utils/Helpers/ToastHelpers.jsx";
import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";

export default function Mahasiswa() {
    const navigate = useNavigate();

    const { data: mahasiswa = [], isLoading: loading } = useMahasiswa();
    const { mutate: store } = useStoreMahasiswa();
    const { mutate: update } = useUpdateMahasiswa();
    const { mutate: remove } = useDeleteMahasiswa();

    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add"); // add | edit
    const [form, setForm] = useState({ id: "", nim: "", nama: "" });

    const openAdd = () => {
        setMode("add");
        setForm({ id: "", nim: "", nama: "" });
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setMode("edit");
        setForm({ id: row.id, nim: row.nim ?? "", nama: row.nama ?? "" });
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

        if (!form.nim.trim() || !form.nama.trim()) {
            toastError("NIM dan Nama wajib diisi");
            return;
        }

        if (mode === "add") {
            const exists = mahasiswa.find((m) => m.nim === form.nim);
            if (exists) {
                toastError("NIM sudah terdaftar!");
                return;
            }

            store(
                { nim: form.nim, nama: form.nama },
                { onSuccess: () => setModalOpen(false) }
            );
            return;
        }

        const ok = await confirmUpdate();
        if (!ok) return;

        update(
            { id: form.id, data: { nim: form.nim, nama: form.nama } },
            { onSuccess: () => setModalOpen(false) }
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Mahasiswa</h2>
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
                <MahasiswaTable
                    data={mahasiswa}
                    onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            )}

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
